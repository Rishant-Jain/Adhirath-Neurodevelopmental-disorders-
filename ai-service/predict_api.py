from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import os
from typing import List
from pymongo import MongoClient

# Load model and encoders
MODEL_PATH = "./rf_multilabel_model.pkl"
ENCODERS_DIR = "./label_encoders_rf"

try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully")
except Exception as e:
    raise RuntimeError(f"❌ Failed to load model: {e}")

encoders = {}
for filename in os.listdir(ENCODERS_DIR):
    if filename.endswith(".pkl"):
        feature_name = filename.replace(".pkl", "")
        try:
            encoders[feature_name] = joblib.load(os.path.join(ENCODERS_DIR, filename))
            print(f"✅ Loaded encoder for: {feature_name}")
        except Exception as e:
            print(f"❌ Failed to load encoder {feature_name}: {e}")

# MongoDB connection (optional)
client = MongoClient("mongodb://localhost:27017/")
db = client.adhirath
db_collection = db.assessments

# FastAPI app initialization
app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # You can replace this with your frontend's URL for security
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Input model
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

# Prediction route
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

        # Convert to DataFrame for prediction
        input_df = pd.DataFrame([encoded_input])
        prediction = model.predict(input_df)[0].tolist()
        print("📢 Prediction:", prediction)

        # Map predictions to pathway names
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

        # Optionally save input and prediction to MongoDB
        db_collection.insert_one({
            "input": input_dict,
            "prediction": recommended
        })

        return {"recommended_pathways": recommended}

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
