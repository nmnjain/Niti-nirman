from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F
from dataclasses import dataclass
from typing import List, Dict, Any
from flask import Flask, request, jsonify
from supabase import create_client, Client
import os
from dotenv import load_dotenv
from flask_cors import CORS

@dataclass
class UserProfile:
    gender: str
    age: int
    location: str
    caste: str
    disability: str
    minority: str
    student: str
    bpl: str
    income: float

class BERTSchemeRecommender:
    def __init__(self, supabase_url: str, supabase_key: str):
        """Initialize BERT-based recommender system."""
        self.supabase: Client = create_client(supabase_url, supabase_key)
        self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
        self.model = AutoModel.from_pretrained('bert-base-uncased')
        self.model.eval()
        
    def _create_profile_description(self, user: UserProfile) -> str:
        """Convert user profile to natural language description."""
        description = f"""A {user.age} year old {user.gender} from {user.location}. 
        They belong to {user.caste} caste category. 
        {"They have a disability." if user.disability == "Yes" else "They don't have any disability."}
        {"They belong to a minority community." if user.minority == "Yes" else "They don't belong to a minority community."}
        {"They are a student." if user.student == "Yes" else "They are not a student."}
        {"They are below poverty line." if user.bpl == "Yes" else "They are not below poverty line."}
        Their annual income is {user.income} rupees."""
        return description.strip()

    def _create_scheme_description(self, scheme: Dict[str, Any]) -> str:
        """Convert scheme eligibility criteria to natural language description."""
        description = f"""This scheme is for {scheme['gender']} candidates.
        Age requirement: {scheme['age_range']}.
        Income requirement: {scheme['income_range']}.
        Eligible castes: {scheme['eligible_castes']}.
        Location requirement: {scheme['location']}.
        {"Requires disability status." if scheme['disability'] == "Yes" else ""}
        {"Requires minority status." if scheme['minority'] == "Yes" else ""}
        {"For students only." if scheme['student'] == "Yes" else ""}
        {"For BPL candidates." if scheme['bpl'] == "Yes" else ""}"""
        return description.strip()

    def _get_bert_embedding(self, text: str) -> torch.Tensor:
        """Generate BERT embedding for given text."""
        inputs = self.tokenizer(text, padding=True, truncation=True, max_length=512, return_tensors="pt")
        with torch.no_grad():
            outputs = self.model(**inputs)
            embeddings = outputs.last_hidden_state[:, 0, :]
        return F.normalize(embeddings, p=2, dim=1)

    def _calculate_similarity(self, embed1: torch.Tensor, embed2: torch.Tensor) -> float:
        """Calculate cosine similarity between embeddings."""
        return torch.cosine_similarity(embed1, embed2, dim=1).item()

    def _check_numerical_criteria(self, scheme: Dict[str, Any], user: UserProfile) -> bool:
        """Check strict numerical criteria (age and income)."""
        def parse_range(range_str: str, value: float, is_age: bool = False) -> bool:
            if not range_str or range_str.lower() in ["any", "anyone"]:
                return True
            
            try:
                range_str = range_str.replace(" ", "").lower()
                range_str = range_str.replace("age", "").replace("income", "")
                
                if range_str.count("<=") == 2:
                    min_val, max_val = range_str.split("<=")[0], range_str.split("<=")[2]
                    return float(min_val) <= value <= float(max_val)
                
                if "<=" in range_str:
                    return value <= float(range_str.replace("<=", ""))
                elif ">=" in range_str:
                    return value >= float(range_str.replace(">=", ""))
                elif "<" in range_str:
                    return value < float(range_str.replace("<", ""))
                elif ">" in range_str:
                    return value > float(range_str.replace(">", ""))
                elif "-" in range_str:
                    min_val, max_val = map(float, range_str.split("-"))
                    return min_val <= value <= max_val
                
                return True
                
            except Exception:
                return False

        age_eligible = parse_range(scheme["age_range"], user.age, is_age=True)
        income_eligible = parse_range(scheme["income_range"], user.income, is_age=False)
        
        return age_eligible and income_eligible

    def _check_basic_eligibility(self, scheme: Dict[str, Any], user: UserProfile) -> tuple[bool, str]:
        """Check basic eligibility criteria before similarity calculation."""
        if scheme['gender'] != 'Anyone' and scheme['gender'] != user.gender:
            return False, f"Gender mismatch: Scheme requires {scheme['gender']}, user is {user.gender}"

        if scheme['location'] != 'Anyone' and scheme['location'] != user.location:
            return False, f"Location mismatch: Scheme requires {scheme['location']}, user is {user.location}"

        if 'Anyone' not in scheme['eligible_castes'] and user.caste not in scheme['eligible_castes']:
            return False, f"Caste mismatch: Scheme requires {scheme['eligible_castes']}, user is {user.caste}"

        if scheme['disability'] == 'Yes' and user.disability != 'Yes':
            return False, "Scheme requires disability status"

        if scheme['minority'] == 'Yes' and user.minority != 'Yes':
            return False, "Scheme requires minority status"

        if scheme['student'] == 'Yes' and user.student != 'Yes':
            return False, "Scheme requires student status"

        if scheme['bpl'] == 'Yes' and user.bpl != 'Yes':
            return False, "Scheme requires BPL status"

        return True, "All basic eligibility criteria met"

    def get_recommendations(self, email: str, similarity_threshold: float = 0.7) -> List[str]:
        """Get scheme recommendations for a user using BERT-based similarity."""
        response = self.supabase.table("user_profiles").select("*").eq("email", email).execute()
        if not response.data:
            raise ValueError("User not found in the database.")
        
        user_data = response.data[0]
        user = UserProfile(
            gender=user_data["gender"],
            age=user_data["age"],
            location=user_data["location"],
            caste=user_data["caste"],
            disability=user_data["disability"],
            minority=user_data["minority"],
            student=user_data["student"],
            bpl=user_data["bpl"],
            income=user_data["income"]
        )

        user_description = self._create_profile_description(user)
        user_embedding = self._get_bert_embedding(user_description)
        schemes = self.supabase.table("schemes").select("*").execute()
        eligible_scheme_ids = []

        for scheme in schemes.data:
            is_eligible, _ = self._check_basic_eligibility(scheme, user)
            if not is_eligible:
                continue

            if not self._check_numerical_criteria(scheme, user):
                continue

            scheme_description = self._create_scheme_description(scheme)
            scheme_embedding = self._get_bert_embedding(scheme_description)
            similarity = self._calculate_similarity(user_embedding, scheme_embedding)

            if similarity >= similarity_threshold:
                eligible_scheme_ids.append(scheme["id"])

        return eligible_scheme_ids

from PIL import Image
import pytesseract
import re
import base64
import io
from datetime import datetime
import numpy as np
import cv2

class AadhaarVerifier:
    def __init__(self, supabase_client):
        """Initialize AadhaarVerifier with Supabase client."""
        self.supabase = supabase_client

    def _base64_to_image(self, base64_string: str) -> Image.Image:
        """Convert base64 string to PIL Image."""
        image_data = base64.b64decode(base64_string)
        image = Image.open(io.BytesIO(image_data))
        return image

    def _safe_print(self, message: str):
        """Safely print messages with Unicode characters."""
        try:
            if isinstance(message, str):
                message = message.encode('utf-8', errors='replace').decode('utf-8')
            print(message)
        except Exception:
            print(str(message).encode('ascii', 'replace').decode('ascii'))

    def _preprocess_image(self, image: Image.Image) -> tuple[Image.Image, Image.Image]:
        """Enhanced preprocessing for better OCR results."""
        opencv_img = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        
        gray = cv2.cvtColor(opencv_img, cv2.COLOR_BGR2GRAY)
        
        threshold = cv2.adaptiveThreshold(
            gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, 
            cv2.THRESH_BINARY, 21, 11
        )
        
        denoised = cv2.fastNlMeansDenoising(gray)
        
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8,8))
        enhanced = clahe.apply(denoised)
        
        return Image.fromarray(threshold), Image.fromarray(enhanced)

    def _extract_name(self, text: str) -> str:
        """Extract name from Aadhaar card text with improved accuracy."""
        try:
            text = text.encode('utf-8', errors='replace').decode('utf-8')
            self._safe_print("\nProcessing text for name extraction")
            
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            
            self._safe_print("\nProcessed lines:")
            for i, line in enumerate(lines):
                self._safe_print(f"Line {i}: {line}")

            prefixes_to_remove = ['sy', 'sj', 'sh', 'shri', 'smt', 'mr', 'mrs', 'ms']
            
            for i, line in enumerate(lines):
                if any(header in line.lower() for header in ['government of india', 'unique identification', 'aadhaar', 'भारत सरकार']):
                    continue
                if any(keyword in line.lower() for keyword in ['male', 'female', 'dob', 'birth', 'address', 'pincode', 'आधार', 'पहचान']):
                    continue

                cleaned_line = line.strip()
                
                lower_line = cleaned_line.lower()
                for prefix in prefixes_to_remove:
                    if lower_line.startswith(prefix + ' '):
                        cleaned_line = cleaned_line[len(prefix) + 1:]
                        break
                
                name_match = re.match(r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$', cleaned_line.strip())
                if name_match:
                    name = cleaned_line.strip()
                    self._safe_print(f"Found name using exact pattern: {name}")
                    return name

                if 'DOB' in line or 'दिनांक' in line or 'जन्म' in line:
                
                    if i > 0:
                        prev_line = lines[i-1].strip()
                        for prefix in prefixes_to_remove:
                            if prev_line.lower().startswith(prefix + ' '):
                                prev_line = prev_line[len(prefix) + 1:]
                                break
                        
                        if re.match(r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2}$', prev_line):
                            self._safe_print(f"Found name before DOB: {prev_line}")
                            return prev_line

            for line in lines:
                cleaned_line = line.strip()
                for prefix in prefixes_to_remove:
                    if cleaned_line.lower().startswith(prefix + ' '):
                        cleaned_line = cleaned_line[len(prefix) + 1:]
                        break
                        
                name_pattern = r'(?:^|\s)([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,2})(?=\s|$)'
                match = re.search(name_pattern, cleaned_line)
                if match:
                    candidate = match.group(1)
                    # Verify it's not a header or common text
                    if not any(word.lower() in candidate.lower() for word in 
                            ['government', 'india', 'authority', 'unique', 'identification']):
                        self._safe_print(f"Found name using fallback pattern: {candidate}")
                        return candidate

            self._safe_print("No valid name found")
            return None
            
        except Exception as e:
            self._safe_print(f"Error in name extraction: {str(e)}")
            return None

    def _extract_dob(self, text: str) -> str:
        """Extract DOB from Aadhaar card text."""
        try:
            text = text.encode('utf-8', errors='replace').decode('utf-8')
            
            patterns = [
                r"\b(\d{2}/\d{2}/\d{4})\b",
                r"\b(\d{2}\.\d{2}\.\d{4})\b",
                r"\b(\d{2}-\d{2}-\d{4})\b",
                r"DOB\s*:?\s*(\d{2}[/.-]\d{2}[/.-]\d{4})"
            ]
            
            for pattern in patterns:
                match = re.search(pattern, text)
                if match:
                    date_str = match.group(1)
                    date_str = re.sub(r'[.\-]', '/', date_str)
                    try:
                        datetime.strptime(date_str, '%d/%m/%Y')
                        self._safe_print(f"Found DOB: {date_str}")
                        return date_str
                    except ValueError:
                        continue
            
            return None
        except Exception as e:
            self._safe_print(f"Error in DOB extraction: {str(e)}")
            return None

    def _extract_gender(self, text: str) -> str:
        """Extract gender from Aadhaar text."""
        try:
            text = text.encode('utf-8', errors='replace').decode('utf-8')
            pattern = r'\b(MALE|FEMALE|male|female|Male|Female)\b'
            match = re.search(pattern, text)
            if match:
                gender = match.group(1).title()
                self._safe_print(f"Found gender: {gender}")
                return gender
            return None
        except Exception as e:
            self._safe_print(f"Error in gender extraction: {str(e)}")
            return None

    def _extract_pincode(self, text: str) -> str:
        """Extract pincode from Aadhaar text."""
        try:
            text = text.encode('utf-8', errors='replace').decode('utf-8')
            pattern = r"\b(\d{6})\b"
            match = re.search(pattern, text)
            if match:
                pincode = match.group(1)
                self._safe_print(f"Found pincode: {pincode}")
                return pincode
            return None
        except Exception as e:
            self._safe_print(f"Error in pincode extraction: {str(e)}")
            return None

    def _calculate_age(self, dob_str: str) -> int:
        """Calculate age from DOB string."""
        try:
            dob = datetime.strptime(dob_str, "%d/%m/%Y")
            today = datetime.now()
            age = today.year - dob.year - ((today.month, today.day) < (dob.month, dob.day))
            return age
        except Exception as e:
            self._safe_print(f"Error calculating age: {str(e)}")
            return None

    def verify_aadhaar(self, email: str, front_image_b64: str, back_image_b64: str) -> tuple[bool, str]:
        try:
            response = self.supabase.table("user_profiles").select("*").eq("email", email).execute()
            if not response.data:
                return False, "User profile not found"
            
            user_profile = response.data[0]
            
            front_image = self._base64_to_image(front_image_b64)
            enhanced_front, denoised_front = self._preprocess_image(front_image)
            
            custom_config = r'--oem 3 --psm 6'
            front_text_enhanced = pytesseract.image_to_string(enhanced_front, config=custom_config)
            front_text_denoised = pytesseract.image_to_string(denoised_front, config=custom_config)
            front_text = front_text_enhanced + "\n" + front_text_denoised
            
            name = self._extract_name(front_text)
            dob = self._extract_dob(front_text)
            gender = self._extract_gender(front_text)
            
            back_image = self._base64_to_image(back_image_b64)
            enhanced_back, denoised_back = self._preprocess_image(back_image)
            back_text = pytesseract.image_to_string(enhanced_back)
            pincode = self._extract_pincode(back_text)
            
            age = self._calculate_age(dob) if dob else None
            
            is_verified = all([
                name and user_profile["name"].lower().strip() == name.lower().strip(),
                age and user_profile["age"] == age,
                gender and user_profile["gender"] == gender,
                pincode and user_profile["pincode"] == pincode
            ])
            
            return is_verified, "Verification successful" if is_verified else "Verification failed"
            
        except Exception as e:
            return False, str(e)
        

app = Flask(__name__)
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

recommender = BERTSchemeRecommender(SUPABASE_URL, SUPABASE_KEY)

ALLOWED_ORIGINS = ["http://127.0.0.1:5173", "http://localhost:5173"]

CORS(app, supports_credentials=True, resources={r"/*": {"origins": ALLOWED_ORIGINS}})

@app.route("/get_recommendations", methods=["POST"])
def get_recommendations():
    try:
        data = request.get_json()
        if not data or 'email' not in data:
            return jsonify({"error": "Email is required"}), 400
            
        email = data['email']
        scheme_ids = recommender.get_recommendations(email)
        return jsonify({"eligible_scheme_ids": scheme_ids})
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/verify_aadhaar", methods=["POST"])
def verify_aadhaar():
    try:
        data = request.get_json()
        if not data or not all(k in data for k in ['email', 'front_image', 'back_image']):
            return jsonify({"verified": False}), 400
            
        verifier = AadhaarVerifier(recommender.supabase)
        verified, _ = verifier.verify_aadhaar(data['email'], data['front_image'], data['back_image'])
        
        return jsonify({"verified": verified})
        
    except Exception:
        return jsonify({"verified": False}), 500
    

if __name__ == "__main__":
    app.run(debug=True, port=5000)


