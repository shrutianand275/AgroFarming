import pickle
import os
import numpy as np
import pandas as pd

# Load models and encoders
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

try:
    with open(os.path.join(MODEL_DIR, 'disease_model.pkl'), 'rb') as f:
        disease_model = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, 'disease_scaler.pkl'), 'rb') as f:
        disease_scaler = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, 'disease_label_encoder.pkl'), 'rb') as f:
        disease_label_encoder = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, 'plant_encoder.pkl'), 'rb') as f:
        plant_encoder = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, 'season_encoder.pkl'), 'rb') as f:
        season_encoder = pickle.load(f)
    
    with open(os.path.join(MODEL_DIR, 'severity_encoder.pkl'), 'rb') as f:
        severity_encoder = pickle.load(f)
    
    # Load disease info
    disease_info_df = pd.read_csv(os.path.join(MODEL_DIR, 'disease_info.csv'))
    
    print("✅ Disease prediction models loaded successfully!")
except Exception as e:
    print(f"⚠️ Warning: Disease models not loaded - {str(e)}")
    disease_model = None

def predict_disease(input_data, language='en'):
    """
    Predict disease based on plant, temperature, humidity, season, and severity
    
    Args:
        input_data: dict with keys Plant, Temperature, Humidity, Season, Severity
        language: 'en' or 'hi' for response language
    
    Returns:
        dict with disease prediction and details
    """
    
    if disease_model is None:
        raise Exception("Disease model not loaded. Please train the model first.")
    
    try:
        # Encode categorical features
        plant_encoded = plant_encoder.transform([input_data['Plant']])[0]
        season_encoded = season_encoder.transform([input_data['Season']])[0]
        severity_encoded = severity_encoder.transform([input_data['Severity']])[0]
        
        # Prepare feature array
        features = np.array([[
            plant_encoded,
            input_data['Temperature'],
            input_data['Humidity'],
            season_encoded,
            severity_encoded
        ]])
        
        # Scale features
        features_scaled = disease_scaler.transform(features)
        
        # Make prediction
        prediction = disease_model.predict(features_scaled)[0]
        disease_name = disease_label_encoder.inverse_transform([prediction])[0]
        
        # Get prediction probabilities
        probabilities = disease_model.predict_proba(features_scaled)[0]
        confidence = float(max(probabilities) * 100)
        
        # Get disease information
        disease_info = disease_info_df[
            (disease_info_df['Disease'] == disease_name) & 
            (disease_info_df['Plant'] == input_data['Plant'])
        ].iloc[0] if len(disease_info_df[
            (disease_info_df['Disease'] == disease_name) & 
            (disease_info_df['Plant'] == input_data['Plant'])
        ]) > 0 else disease_info_df[disease_info_df['Disease'] == disease_name].iloc[0]
        
        # Build response
        response = {
            "disease": disease_name,
            "plant": input_data['Plant'],
            "confidence": round(confidence, 2),
            "severity": disease_info['Severity'],
            "symptoms": disease_info['Symptoms'],
            "treatment": disease_info['Treatment'],
            "prevention": disease_info['Prevention'],
            "season": disease_info['Season'],
            "temperature_range": disease_info['Temperature_Range'],
            "humidity_range": disease_info['Humidity_Range']
        }
        
        return response
        
    except Exception as e:
        raise Exception(f"Prediction error: {str(e)}")
