from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional
import joblib
import os
import numpy as np
from pathlib import Path
import logging
import traceback

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model and encoders
try:
    # Load the model
    model_file = 'rf_multilabel_model.pkl'  # Use the newly trained model
    if not os.path.exists(model_file):
        raise FileNotFoundError(f"Model file {model_file} not found")
    
    model = joblib.load(model_file)
    logger.info(f"Loaded model from {model_file}")
    
    # Print model information
    n_features = model.estimators_[0].n_features_in_
    logger.info(f"Model expects {n_features} features")
    
    if hasattr(model.estimators_[0], 'feature_names_in_'):
        logger.info(f"Model feature names: {list(model.estimators_[0].feature_names_in_)}")
    
    # Load all label encoders
    encoders = {}
    encoders_path = Path('label_encoders_rf')
    
    # Define feature name mappings
    feature_name_mappings = {
        'Language_Proficiency': ['Language_Proficiency', 'Verbal IQ - Spoken Language'],
        'Communication_Skills': ['Communication_Skills', 'Verbal IQ - Express Feelings'],
        'Diagnosis': ['Diagnosis', 'Neurodevelopmental Disorder - Diagnosis'],
        'Severity': ['Severity', 'Degree of Disorder - Severity'],
        'Medical_Conditions': ['Medical_Conditions', 'Neurodevelopmental Disorder - Confirmed'],
        'Independence_Level': ['Independence_Level', 'Degree of Disorder - Self-Care'],
        'Learning_Speed': ['Learning_Speed', 'Learning Ability - Speed'],
        'Learning_Style': ['Learning_Style', 'Learning Ability - Style'],
        'Memory_Retention': ['Memory_Retention', 'Grasping Power - Memory'],
        'Skill_Application': ['Skill_Application', 'Grasping Power - Application'],
        'Preferred_Activities': ['Preferred_Activities', 'Hobbies - Activities'],
        'Attention_Span': ['Attention_Span', 'Hobbies - Engagement Time'],
        'Social_Interaction': ['Social_Interaction', 'Hobbies - Preferred Setting'],
        'Age_Group': ['Age_Group', 'Age'],
        'Education_Level': ['Education_Level', 'Education Level']
    }
    
    # Load encoders with name mapping
    loaded_features = []
    for feature, possible_names in feature_name_mappings.items():
        encoder_found = False
        for name in possible_names:
            # Try different encoder filename patterns
            possible_patterns = [
                f"{name}_encoder.pkl",
                f"{name.replace('_', ' ')}_encoder.pkl",
                f"{name.replace('_', ' - ')}_encoder.pkl"
            ]
            
            for pattern in possible_patterns:
                encoder_path = encoders_path / pattern
                if encoder_path.exists():
                    try:
                        encoders[feature] = joblib.load(encoder_path)
                        logger.info(f"Loaded encoder for {feature} from {pattern}")
                        loaded_features.append(feature)
                        encoder_found = True
                        break
                    except Exception as e:
                        logger.error(f"Error loading encoder {pattern}: {str(e)}")
            
            if encoder_found:
                break
        
        if not encoder_found:
            logger.warning(f"No encoder found for feature {feature}")
    
    # Load target encoder
    target_encoder_path = encoders_path / "target_mlb.pkl"
    if target_encoder_path.exists():
        encoders['target'] = joblib.load(target_encoder_path)
        logger.info("Loaded target encoder")
    else:
        raise FileNotFoundError("Target encoder not found")
    
    logger.info("Model and encoders loaded successfully!")
    logger.info(f"Loaded {len(loaded_features)} features: {loaded_features}")
    logger.info(f"Model expects {n_features} features")
    
    if len(loaded_features) != n_features:
        logger.error(f"Mismatch between loaded features ({len(loaded_features)}) and model features ({n_features})")
        logger.error("This will cause prediction errors!")
    
except Exception as e:
    logger.error(f"Error loading model or encoders: {str(e)}")
    logger.error(traceback.format_exc())
    raise

class AssessmentData(BaseModel):
    Verbal_IQ_Spoken_Language: str = Field(alias='Verbal IQ - Spoken Language')
    Verbal_IQ_Initiates_Conversation: str = Field(alias='Verbal IQ - Initiates Conversation')
    Verbal_IQ_Express_Feelings: str = Field(alias='Verbal IQ - Express Feelings')
    Neurodevelopmental_Disorder_Diagnosis: str = Field(alias='Neurodevelopmental Disorder - Diagnosis')
    Neurodevelopmental_Disorder_Confirmed: str = Field(alias='Neurodevelopmental Disorder - Confirmed')
    Degree_of_Disorder_Severity: str = Field(alias='Degree of Disorder - Severity')
    Degree_of_Disorder_Self_Care: str = Field(alias='Degree of Disorder - Self-Care')
    Learning_Ability_Speed: str = Field(alias='Learning Ability - Speed')
    Learning_Ability_Style: str = Field(alias='Learning Ability - Style')
    Grasping_Power_Memory: str = Field(alias='Grasping Power - Memory')
    Grasping_Power_Application: str = Field(alias='Grasping Power - Application')
    Hobbies_Activities: str = Field(alias='Hobbies - Activities')
    Hobbies_Engagement_Time: str = Field(alias='Hobbies - Engagement Time')
    Hobbies_Preferred_Setting: str = Field(alias='Hobbies - Preferred Setting')
    Age: str
    Education_Level: str = Field(alias='Education Level')

    class Config:
        allow_population_by_field_name = True

@app.get("/")
def read_root():
    return {"message": "AI Assessment Service is running"}

@app.post("/predict")
def predict(data: AssessmentData):
    try:
        # Log incoming request data
        logger.info("Received prediction request")
        logger.debug(f"Input data: {data.dict()}")
        
        # Convert input data to dictionary
        input_data = data.dict()
        
        # Initialize feature vector
        encoded_features = []
        missing_encoders = []
        invalid_values = {}
        
        # Log available encoders
        logger.info(f"Available encoders: {list(encoders.keys())}")
        
        # Define the expected feature order
        feature_order = [
            'Language_Proficiency', 'Communication_Skills', 'Diagnosis',
            'Severity', 'Medical_Conditions', 'Independence_Level',
            'Learning_Speed', 'Learning_Style', 'Memory_Retention',
            'Skill_Application', 'Preferred_Activities', 'Attention_Span',
            'Social_Interaction', 'Age_Group', 'Education_Level'
        ]
        
        # Encode each feature in the correct order
        for feature in feature_order:
            value = input_data.get(feature)
            if not value:
                raise HTTPException(
                    status_code=400,
                    detail=f"Missing required feature: {feature}"
                )
            
            if feature not in encoders:
                missing_encoders.append(feature)
                logger.error(f"Missing encoder for feature: {feature}")
                continue
                
            try:
                logger.debug(f"Encoding feature {feature} with value {value}")
                    encoded_value = encoders[feature].transform([value])[0]
                    encoded_features.append(encoded_value)
                logger.debug(f"Successfully encoded {feature} to {encoded_value}")
                except Exception as e:
                logger.error(f"Failed to encode feature {feature} with value {value}: {str(e)}")
                invalid_values[feature] = {
                    'provided': value,
                    'allowed': list(encoders[feature].classes_)
                }
        
        if missing_encoders:
            logger.error(f"Missing encoders: {missing_encoders}")
            raise HTTPException(
                status_code=500,
                detail={
                    "error": "Missing encoders",
                    "missing_features": missing_encoders
                }
            )
            
        if invalid_values:
            logger.error(f"Invalid values: {invalid_values}")
                    raise HTTPException(
                        status_code=400,
                detail={
                    "error": "Invalid feature values",
                    "invalid_features": invalid_values
                }
                    )
        
        # Make prediction
        encoded_features = np.array(encoded_features).reshape(1, -1)
        logger.info(f"Encoded features shape: {encoded_features.shape}")
        logger.debug(f"Encoded features: {encoded_features}")
        
        # Check feature count
        n_features = model.estimators_[0].n_features_in_
        if encoded_features.shape[1] != n_features:
            logger.error(f"Feature count mismatch: got {encoded_features.shape[1]}, expected {n_features}")
            if hasattr(model.estimators_[0], 'feature_names_in_'):
                logger.error(f"Model feature names: {list(model.estimators_[0].feature_names_in_)}")
            logger.error(f"Provided features: {feature_order}")
            raise HTTPException(
                status_code=500,
                detail={
                    "error": "Feature count mismatch",
                    "expected_count": n_features,
                    "provided_count": encoded_features.shape[1],
                    "provided_features": feature_order,
                    "model_features": list(model.estimators_[0].feature_names_in_) if hasattr(model.estimators_[0], 'feature_names_in_') else None
                }
            )
        
        try:
        prediction_proba = model.predict_proba(encoded_features)
            logger.info(f"Model prediction successful, shape: {prediction_proba.shape}")
            logger.debug(f"Raw predictions: {prediction_proba}")
        except Exception as e:
            logger.error(f"Model prediction failed: {str(e)}")
            logger.error(f"Input shape: {encoded_features.shape}")
            logger.error(f"Input data: {encoded_features.tolist()}")
            logger.error(traceback.format_exc())
            raise HTTPException(
                status_code=500,
                detail={
                    "error": "Model prediction failed",
                    "details": str(e),
                    "input_shape": list(encoded_features.shape),
                    "input_data": encoded_features.tolist(),
                    "expected_features": feature_order
                }
            )
        
        # Get predicted pathways using MultiLabelBinarizer
        if 'target' not in encoders:
            logger.error("Target encoder not found")
            raise HTTPException(
                status_code=500,
                detail={"error": "Target encoder not found"}
            )
            
        mlb = encoders['target']
        threshold = 0.3  # Adjust this threshold as needed
        
        # Convert probabilities to binary predictions based on threshold
        binary_predictions = (prediction_proba >= threshold).astype(int)
        logger.debug(f"Binary predictions: {binary_predictions}")
        
        # Transform binary predictions back to pathway labels
        predicted_pathways = mlb.inverse_transform(binary_predictions)[0]
        logger.info(f"Predicted pathways: {predicted_pathways}")
        
        # Calculate confidence scores for predicted pathways
        confidence_scores = {}
        for pathway, score in zip(mlb.classes_, prediction_proba[0]):
            if score >= threshold:
                confidence_scores[pathway] = float(score)
        
        response = {
            "predicted_pathways": list(predicted_pathways),
            "confidence_scores": confidence_scores
        }
        logger.info("Prediction successful")
        logger.debug(f"Response: {response}")
        return response
        
    except HTTPException as he:
        logger.error(f"HTTP Exception: {he.detail}")
        raise he
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
        logger.error(traceback.format_exc())
        raise HTTPException(
            status_code=500,
            detail={
                "error": "Unexpected error",
                "details": str(e),
                "traceback": traceback.format_exc()
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 