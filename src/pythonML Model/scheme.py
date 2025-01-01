import pandas as pd
from typing import Dict, List, Any
from supabase import create_client, Client
from dataclasses import dataclass
from flask import Flask, request, jsonify
from supabase import create_client, Client
from flask_cors import CORS
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

class SchemeRecommender:
    def __init__(self, supabase_url: str, supabase_key: str):
        """Initialize the recommender system with Supabase."""
        self.supabase: Client = create_client(supabase_url, supabase_key)

    def fetch_user_info(self, email: str) -> UserProfile:
        """Fetch user information from Supabase based on email."""
        response = self.supabase.table("user_profiles").select("*").eq("email", email).execute()
        if response.data and len(response.data) > 0:
            user_data = response.data[0]
            return UserProfile(
                gender=user_data["gender"],
                age=user_data["age"],
                location=user_data["location"],
                caste=user_data["caste"],
                disability=user_data["disability"],
                minority=user_data["minority"],
                student=user_data["student"],
                bpl=user_data["bpl"],
                income=user_data["income"],
            )
        else:
            raise ValueError("User not found in the database.")

    def fetch_schemes(self) -> List[Dict[str, Any]]:
        """Fetch all schemes from Supabase."""
        response = self.supabase.table("schemes").select("*").execute()
        return response.data or []

    def _parse_range(self, range_str: str, value: float) -> bool:
        """Check if a numeric value falls within a specified range."""
        if not range_str or range_str in ["Any", "Anyone"]:
            return True

        try:
            # Handle age ranges like "Age>=18" or "18<=Age<=65"
            range_str = range_str.replace(" ", "").lower()
            
            # Handle age ranges
            if "age" in range_str.lower():
                range_str = range_str.lower().replace("age", "")
            
            # Handle income ranges
            if "income" in range_str.lower():
                range_str = range_str.lower().replace("income", "")
            
            # Handle < and > symbols
            if "<" in range_str and "=" not in range_str:
                max_val = float(range_str.replace("<", ""))
                return value < max_val
                
            if "<=" in range_str:
                if ">=" in range_str:
                    # Handle range like "18<=Age<=65"
                    parts = range_str.split("<=")
                    min_val = float(parts[0])
                    max_val = float(parts[2])
                    return min_val <= value <= max_val
                else:
                    # Handle range like "<=20000"
                    max_val = float(range_str.replace("<=", ""))
                    return value <= max_val
            elif ">=" in range_str:
                # Handle range like ">=18"
                min_val = float(range_str.replace(">=", ""))
                return value >= min_val
            elif "-" in range_str:
                # Handle range like "18-65"
                min_val, max_val = map(float, range_str.split("-"))
                return min_val <= value <= max_val
            elif range_str.isdigit():
                # Handle exact value
                return value == float(range_str)
            else:
                return False
        except (ValueError, IndexError) as e:
            print(f"Error parsing range: {range_str}, Value: {value}, Error: {e}")
            return False

    def _check_caste_eligibility(self, scheme_castes: str, user_castes: str) -> bool:
        """Check if user's caste matches scheme's caste requirements."""
        # Handle empty or None cases
        if not scheme_castes:
            return True
            
        # Handle "Anyone" cases in various formats
        if scheme_castes in [["Anyone"], "['Anyone']", "['anyone']", "[\"Anyone\"]"]:
            return True
            
        try:
            # Convert string representation of list to actual list if needed
            if isinstance(scheme_castes, str):
                if scheme_castes.startswith('[') and scheme_castes.endswith(']'):
                    scheme_castes = eval(scheme_castes)
                else:
                    scheme_castes = [scheme_castes]
                    
            # Convert to list if not already
            if not isinstance(scheme_castes, list):
                scheme_castes = [scheme_castes]
                
            # Convert everything to lowercase for comparison
            scheme_castes_lower = [str(c).lower().strip() for c in scheme_castes]
            user_castes_lower = [str(c).lower().strip() for c in user_castes]
            
            # Check if any user caste matches any scheme caste
            return any(user_caste in scheme_castes_lower for user_caste in user_castes_lower)
        except Exception as e:
            print(f"Error in caste eligibility check: {e}")
            return False

    def _check_eligibility(self, scheme: Dict[str, Any], user: UserProfile) -> bool:
        """Check if a user is eligible for a scheme based on all criteria."""
        # Handle gender eligibility
        gender_match = (
            scheme["gender"] in ["Anyone", "['Anyone']"] 
            or user.gender == scheme["gender"]
        )

        # Handle location eligibility
        location_match = (
            scheme["location"] in ["Anyone", "['Anyone']"] 
            or user.location == scheme["location"]
        )

        # Handle disability eligibility
        disability_match = (
            scheme["disability"] in ["Anyone", "['Anyone']", "No"] 
            or user.disability == scheme["disability"]
        )

        # Handle minority eligibility
        minority_match = (
            scheme["minority"] in ["Anyone", "['Anyone']"] 
            or user.minority == scheme["minority"]
        )

        # Handle student eligibility
        student_match = (
            scheme["student"] in ["Anyone", "['Anyone']"] 
            or user.student == scheme["student"]
        )

        # Handle BPL eligibility
        bpl_match = (
            scheme["bpl"] in ["Anyone", "['Anyone']"] 
            or user.bpl == scheme["bpl"]
        )

        # Combine all eligibility criteria
        is_eligible = (
            gender_match
            and location_match
            and self._check_caste_eligibility(scheme["eligible_castes"], user.caste)
            and disability_match
            and minority_match
            and student_match
            and bpl_match
            and self._parse_range(scheme["age_range"], user.age)
            and self._parse_range(scheme["income_range"], user.income)
        )

        

        return is_eligible

    def get_recommendations(self, email: str) -> List[int]:
        """Get all eligible scheme IDs for a user."""
        user = self.fetch_user_info(email)
        schemes = self.fetch_schemes()
        
        eligible_scheme_ids = []
        for scheme in schemes:
            if self._check_eligibility(scheme, user):
                eligible_scheme_ids.append(scheme["id"])  
        
        return eligible_scheme_ids



app = Flask(__name__)

CORS(app) 
load_dotenv()


SUPABASE_URL = os.getenv("VITE_SUPABASE_URL")
SUPABASE_KEY = os.getenv("VITE_SUPABASE_ANON_KEY")


recommender = SchemeRecommender(SUPABASE_URL, SUPABASE_KEY)

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
        return jsonify({"error": str(ve)}), 404  # User not found
    except Exception as e:
        return jsonify({"error": str(e)}), 500  # General server error


if __name__ == "__main__":
    app.run(debug=True)