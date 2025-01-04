from transformers import AutoTokenizer, AutoModel
import torch
import torch.nn.functional as F
from dataclasses import dataclass
from typing import List, Dict, Any
import numpy as np
from flask import Flask, request, jsonify
from supabase import create_client, Client
import os
from dotenv import load_dotenv

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
        # Initialize Supabase client
        self.supabase: Client = create_client(supabase_url, supabase_key)
        
        # Load BERT model and tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
        self.model = AutoModel.from_pretrained('bert-base-uncased')
        self.model.eval()  # Set to evaluation mode
        
    def _create_profile_description(self, user: UserProfile) -> str:
        """Convert user profile to natural language description."""
        description = f"""
        A {user.age} year old {user.gender} from {user.location}. 
        They belong to {user.caste} caste category. 
        {"They have a disability." if user.disability == "Yes" else "They don't have any disability."}
        {"They belong to a minority community." if user.minority == "Yes" else "They don't belong to a minority community."}
        {"They are a student." if user.student == "Yes" else "They are not a student."}
        {"They are below poverty line." if user.bpl == "Yes" else "They are not below poverty line."}
        Their annual income is {user.income} rupees.
        """
        return description.strip()

    def _create_scheme_description(self, scheme: Dict[str, Any]) -> str:
        """Convert scheme eligibility criteria to natural language description."""
        description = f"""
        This scheme is for {scheme['gender']} candidates.
        Age requirement: {scheme['age_range']}.
        Income requirement: {scheme['income_range']}.
        Eligible castes: {scheme['eligible_castes']}.
        Location requirement: {scheme['location']}.
        {"Requires disability status." if scheme['disability'] == "Yes" else ""}
        {"Requires minority status." if scheme['minority'] == "Yes" else ""}
        {"For students only." if scheme['student'] == "Yes" else ""}
        {"For BPL candidates." if scheme['bpl'] == "Yes" else ""}
        """
        return description.strip()

    def _get_bert_embedding(self, text: str) -> torch.Tensor:
        """Generate BERT embedding for given text."""
        # Tokenize and prepare input
        inputs = self.tokenizer(text, padding=True, truncation=True, max_length=512, 
                              return_tensors="pt")
        
        # Generate embeddings
        with torch.no_grad():
            outputs = self.model(**inputs)
            # Use CLS token embedding (first token)
            embeddings = outputs.last_hidden_state[:, 0, :]
            
        # Normalize embeddings
        return F.normalize(embeddings, p=2, dim=1)

    def _calculate_similarity(self, embed1: torch.Tensor, embed2: torch.Tensor) -> float:
        """Calculate cosine similarity between embeddings."""
        return torch.cosine_similarity(embed1, embed2, dim=1).item()

    def _check_numerical_criteria(self, scheme: Dict[str, Any], user: UserProfile) -> bool:
        """Check strict numerical criteria (age and income)."""
        def parse_range(range_str: str, value: float) -> bool:
            if not range_str or range_str in ["Any", "Anyone"]:
                return True
            
            try:
                range_str = range_str.replace(" ", "").lower()
                if "<=" in range_str:
                    max_val = float(range_str.replace("<=", ""))
                    return value <= max_val
                elif ">=" in range_str:
                    min_val = float(range_str.replace(">=", ""))
                    return value >= min_val
                elif "-" in range_str:
                    min_val, max_val = map(float, range_str.split("-"))
                    return min_val <= value <= max_val
                return True
            except:
                return True

        return (parse_range(scheme["age_range"], user.age) and 
                parse_range(scheme["income_range"], user.income))

    def get_recommendations(self, email: str, similarity_threshold: float = 0.7) -> List[int]:
        """Get scheme recommendations for a user using BERT-based similarity."""
        # Fetch user profile
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

        # Get user profile embedding
        user_description = self._create_profile_description(user)
        user_embedding = self._get_bert_embedding(user_description)

        # Fetch all schemes
        schemes = self.supabase.table("schemes").select("*").execute()
        eligible_scheme_ids = []

        # Compare with each scheme
        for scheme in schemes.data:
            # First check strict numerical criteria
            if not self._check_numerical_criteria(scheme, user):
                continue

            # Generate scheme description and embedding
            scheme_description = self._create_scheme_description(scheme)
            scheme_embedding = self._get_bert_embedding(scheme_description)

            # Calculate similarity
            similarity = self._calculate_similarity(user_embedding, scheme_embedding)

            # If similarity is above threshold, consider scheme eligible
            if similarity >= similarity_threshold:
                eligible_scheme_ids.append(scheme["id"])

        return eligible_scheme_ids

# Flask application setup
app = Flask(__name__)
load_dotenv()

SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")

recommender = BERTSchemeRecommender(SUPABASE_URL, SUPABASE_KEY)

@app.route("/get_recommendations", methods=["POST"])
def get_recommendations():
    data = request.json
    email = data.get("email")
    
    if not email:
        return jsonify({"error": "Email is required"}), 400

    try:
        scheme_ids = recommender.get_recommendations(email)
        return jsonify({"eligible_scheme_ids": scheme_ids}), 200
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)