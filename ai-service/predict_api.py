from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os
from typing import List
from pymongo import MongoClient

# --- NEW IMPORTS FOR PATCH ---
from sklearn.multioutput import MultiOutputClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier

app = FastAPI()

# -------------------------------
# Load Model + Patch Missing Attributes
# -------------------------------

MODEL_PATH = "./rf_multilabel_model.pkl"
ENCODERS_DIR = "./label_encoders_rf"

try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully")
except Exception as e:
    raise RuntimeError(f"❌ Failed to load model: {e}")


# --- FIX: Patch function to add missing monotonic_cst ---
def patch_monotonic_cst(obj):
    """
    Adds monotonic_cst=None to any DecisionTreeClassifier
    inside RandomForest or MultiOutputClassifier models.
    """
    # Direct DecisionTreeClassifier
    if isinstance(obj, DecisionTreeClassifier):
        if not hasattr(obj, "monotonic_cst"):
            obj.monotonic_cst = None
        return

    # MultiOutputClassifier (wrapper)
    if isinstance(obj, MultiOutputClassifier):
        for est in obj.estimators_:
            patch_monotonic_cst(est)
        return

    # RandomForest or anything with estimators_
    if hasattr(obj, "estimators_"):
        for est in obj.estimators_:
            patch_monotonic_cst(est)


# --- APPLY PATCH ---
patch_monotonic_cst(model)
print("🩹 Patched model: Added missing monotonic_cst attributes")


# -------------------------------
# Load Encoders
# -------------------------------
encoders = {}
for filename in os.listdir(ENCODERS_DIR):
    if filename.endswith(".pkl"):
        feature_name = filename.replace(".pkl", "")
        try:
            encoders[feature_name] = joblib.load(os.path.join(ENCODERS_DIR, filename))
            print(f"✅ Loaded encoder for: {feature_name}")
        except Exception as e:
            print(f"❌ Failed to load encoder {feature_name}: {e}")


# -------------------------------
# MongoDB
# -------------------------------
import os
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
client = MongoClient(MONGODB_URI)
db = client.adhirath
db_collection = db.assessments



# -------------------------------
# CORS
# -------------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],     # Replace "*" with frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -------------------------------
# Input Model
# -------------------------------
class AssessmentInput(BaseModel):
    Language_Proficiency: str = Field(..., alias="Verbal IQ - Spoken Language")
    Initiates_Conversation: str = Field(..., alias="Verbal IQ - Initiates Conversation")
    Communication_Skills: str = Field(..., alias="Verbal IQ - Express Feelings")
    Diagnosis: str = Field(..., alias="Neurodevelopmental Disorder - Diagnosis")
    Medical_Conditions: str = Field(..., alias="Neurodevelopmental Disorder - Confirmed")
    Severity: str = Field(..., alias="Degree of Disorder - Severity")
    Independence_Level: str = Field(..., alias="Degree of Disorder - Self-Care")
    Learning_Speed: str = Field(..., alias="Learning Ability - Speed")
    Learning_Style: str = Field(..., alias="Learning Ability - Style")
    Memory_Retention: str = Field(..., alias="Grasping Power - Memory")
    Skill_Application: str = Field(..., alias="Grasping Power - Application")
    Preferred_Activities: str = Field(..., alias="Hobbies - Activities")
    Attention_Span: str = Field(..., alias="Hobbies - Engagement Time")
    Social_Interaction: str = Field(..., alias="Hobbies - Preferred Setting")
    Age_Group: str = Field(..., alias="Age")
    Education_Level: str = Field(..., alias="Education Level")

    class Config:
        populate_by_name = True


# -------------------------------
# Prediction Route
# -------------------------------
@app.post("/predict")
def predict_pathway(data: AssessmentInput):
    try:
        input_dict = data.dict(by_alias=True)
        print("🚀 Received Input:", input_dict)

        # Encode input
        encoded_input = {}
        for key, value in input_dict.items():
            print(f"🔄 Encoding {key} = {value}")
            if key not in encoders:
                raise ValueError(f"❌ Missing encoder for {key}")
            encoded_input[key] = encoders[key].transform([value])[0]

        print("✅ Encoded input:", encoded_input)

        # Convert to DataFrame
        input_df = pd.DataFrame([encoded_input])

        # --- Prediction ---
        prediction = model.predict(input_df)[0].tolist()
        print("📢 Prediction:", prediction)

        pathways = [
            "Adaptive Self-Care Training",
            "Attention & Behavioral Focus Training",
            "Auditory Learning Sessions",
            "Developmental Support Program",
            "Expressive Practice Sessions",
            "Generalization Practice",
            "Guided Learning Support",
            "Intensive Intervention Program",
            "Social Communication Intervention",
            "Speech Therapy"
        ]

        recommended = [pathways[i] for i, val in enumerate(prediction) if val == 1]

        # Save to DB (optional)
        db_collection.insert_one({
            "input": input_dict,
            "prediction": recommended
        })

        return {"recommended_pathways": recommended}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
