import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# Paths
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'datasets', 'Plant_Disease_Data.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

def parse_range(range_str):
    """Parse temperature or humidity range and return average"""
    if '-' in str(range_str):
        parts = str(range_str).split('-')
        return (float(parts[0]) + float(parts[1])) / 2
    return float(range_str)

def train_disease_model():
    """Train disease prediction model using Random Forest"""
    
    print("=" * 60)
    print("DISEASE PREDICTION MODEL TRAINING")
    print("=" * 60)
    
    # Load dataset
    print("\n1. Loading dataset...")
    df = pd.read_csv(DATASET_PATH)
    print(f"   Dataset shape: {df.shape}")
    print(f"   Columns: {list(df.columns)}")
    
    # Check for missing values
    print("\n2. Checking for missing values...")
    print(df.isnull().sum())
    
    # Display dataset info
    print("\n3. Dataset Info:")
    print(df.info())
    print("\n   First few rows:")
    print(df.head())
    
    # Parse temperature and humidity ranges
    print("\n4. Processing temperature and humidity ranges...")
    df['Temp_Avg'] = df['Temperature_Range'].apply(parse_range)
    df['Humidity_Avg'] = df['Humidity_Range'].apply(parse_range)
    
    # Encode categorical features
    print("\n5. Encoding categorical features...")
    
    le_plant = LabelEncoder()
    le_season = LabelEncoder()
    le_severity = LabelEncoder()
    le_disease = LabelEncoder()
    
    df['Plant_Encoded'] = le_plant.fit_transform(df['Plant'])
    df['Season_Encoded'] = le_season.fit_transform(df['Season'])
    df['Severity_Encoded'] = le_severity.fit_transform(df['Severity'])
    df['Disease_Encoded'] = le_disease.fit_transform(df['Disease'])
    
    print(f"   Plants: {list(le_plant.classes_)}")
    print(f"   Seasons: {list(le_season.classes_)}")
    print(f"   Severity: {list(le_severity.classes_)}")
    print(f"   Diseases: {len(le_disease.classes_)} unique diseases")
    
    # Prepare features and target
    feature_columns = [
        'Plant_Encoded', 'Temp_Avg', 'Humidity_Avg', 
        'Season_Encoded', 'Severity_Encoded'
    ]
    
    X = df[feature_columns]
    y = df['Disease_Encoded']
    
    # Split data
    print("\n6. Splitting data into train and test sets...")
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"   Training set: {X_train.shape}")
    print(f"   Test set: {X_test.shape}")
    
    # Scale features
    print("\n7. Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    print("\n8. Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=25,
        min_samples_split=2,
        min_samples_leaf=1,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train_scaled, y_train)
    print("   Training completed!")
    
    # Evaluate model
    print("\n9. Evaluating model...")
    y_pred_train = model.predict(X_train_scaled)
    y_pred_test = model.predict(X_test_scaled)
    
    train_accuracy = accuracy_score(y_train, y_pred_train)
    test_accuracy = accuracy_score(y_test, y_pred_test)
    
    print(f"   Training Accuracy: {train_accuracy * 100:.2f}%")
    print(f"   Test Accuracy: {test_accuracy * 100:.2f}%")
    
    # Classification report for top classes
    print("\n10. Classification Report (sample):")
    unique_labels = sorted(set(y_test))[:10]  # Show first 10
    target_names_filtered = [le_disease.classes_[i] for i in unique_labels]
    print(classification_report(
        y_test, 
        y_pred_test, 
        labels=unique_labels,
        target_names=target_names_filtered
    ))
    
    # Feature importance
    print("\n11. Feature Importance:")
    feature_importance = pd.DataFrame({
        'Feature': feature_columns,
        'Importance': model.feature_importances_
    }).sort_values('Importance', ascending=False)
    print(feature_importance)
    
    # Save models and encoders
    print("\n12. Saving model and encoders...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    with open(os.path.join(MODEL_DIR, 'disease_model.pkl'), 'wb') as f:
        pickle.dump(model, f)
    
    with open(os.path.join(MODEL_DIR, 'disease_scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)
    
    with open(os.path.join(MODEL_DIR, 'disease_label_encoder.pkl'), 'wb') as f:
        pickle.dump(le_disease, f)
    
    with open(os.path.join(MODEL_DIR, 'plant_encoder.pkl'), 'wb') as f:
        pickle.dump(le_plant, f)
    
    with open(os.path.join(MODEL_DIR, 'season_encoder.pkl'), 'wb') as f:
        pickle.dump(le_season, f)
    
    with open(os.path.join(MODEL_DIR, 'severity_encoder.pkl'), 'wb') as f:
        pickle.dump(le_severity, f)
    
    # Save disease information
    disease_info = df[['Disease', 'Plant', 'Symptoms', 'Treatment', 'Prevention', 
                       'Severity', 'Temperature_Range', 'Humidity_Range', 'Season']].drop_duplicates()
    disease_info.to_csv(os.path.join(MODEL_DIR, 'disease_info.csv'), index=False)
    
    print(f"   Model saved to: {MODEL_DIR}")
    print("\n" + "=" * 60)
    print("TRAINING COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    train_disease_model()
