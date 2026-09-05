import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import pickle
import os

# Paths
DATASET_PATH = os.path.join(os.path.dirname(__file__), '..', 'datasets', 'Fertilizer_Data_Large.csv')
MODEL_DIR = os.path.join(os.path.dirname(__file__), '..', 'models')

def train_fertilizer_model():
    """Train fertilizer recommendation model using Random Forest"""
    
    print("=" * 60)
    print("FERTILIZER RECOMMENDATION MODEL TRAINING")
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
    
    # Encode categorical features
    print("\n4. Encoding categorical features...")
    
    # Create label encoders for categorical features
    le_soil = LabelEncoder()
    le_crop = LabelEncoder()
    le_fertilizer = LabelEncoder()
    
    df['Soil_Type_Encoded'] = le_soil.fit_transform(df['Soil_Type'])
    df['Crop_Type_Encoded'] = le_crop.fit_transform(df['Crop_Type'])
    df['Fertilizer_Encoded'] = le_fertilizer.fit_transform(df['Fertilizer'])
    
    print(f"   Soil Types: {list(le_soil.classes_)}")
    print(f"   Crop Types: {list(le_crop.classes_)}")
    print(f"   Fertilizer Types: {list(le_fertilizer.classes_)}")
    
    # Prepare features and target
    feature_columns = [
        'Temperature', 'Humidity', 'Moisture',
        'Soil_Type_Encoded', 'Crop_Type_Encoded',
        'Nitrogen', 'Phosphorous', 'Potassium'
    ]
    
    X = df[feature_columns]
    y = df['Fertilizer_Encoded']
    
    # Split data
    print("\n5. Splitting data into train and test sets...")
    # Remove stratify due to small dataset size
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    print(f"   Training set: {X_train.shape}")
    print(f"   Test set: {X_test.shape}")
    
    # Scale features
    print("\n6. Scaling features...")
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train Random Forest model
    print("\n7. Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=200,
        max_depth=25,
        min_samples_split=3,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train_scaled, y_train)
    print("   Training completed!")
    
    # Evaluate model
    print("\n8. Evaluating model...")
    y_pred_train = model.predict(X_train_scaled)
    y_pred_test = model.predict(X_test_scaled)
    
    train_accuracy = accuracy_score(y_train, y_pred_train)
    test_accuracy = accuracy_score(y_test, y_pred_test)
    
    print(f"   Training Accuracy: {train_accuracy * 100:.2f}%")
    print(f"   Test Accuracy: {test_accuracy * 100:.2f}%")
    
    # Classification report
    print("\n9. Classification Report:")
    # Get unique labels in test set
    unique_labels = sorted(set(y_test))
    target_names_filtered = [le_fertilizer.classes_[i] for i in unique_labels]
    print(classification_report(
        y_test, 
        y_pred_test, 
        labels=unique_labels,
        target_names=target_names_filtered
    ))
    
    # Feature importance
    print("\n10. Feature Importance:")
    feature_importance = pd.DataFrame({
        'Feature': feature_columns,
        'Importance': model.feature_importances_
    }).sort_values('Importance', ascending=False)
    print(feature_importance)
    
    # Save models and encoders
    print("\n11. Saving model and encoders...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    with open(os.path.join(MODEL_DIR, 'fertilizer_model.pkl'), 'wb') as f:
        pickle.dump(model, f)
    
    with open(os.path.join(MODEL_DIR, 'fertilizer_scaler.pkl'), 'wb') as f:
        pickle.dump(scaler, f)
    
    with open(os.path.join(MODEL_DIR, 'fertilizer_label_encoder.pkl'), 'wb') as f:
        pickle.dump(le_fertilizer, f)
    
    with open(os.path.join(MODEL_DIR, 'soil_type_encoder.pkl'), 'wb') as f:
        pickle.dump(le_soil, f)
    
    with open(os.path.join(MODEL_DIR, 'crop_type_encoder.pkl'), 'wb') as f:
        pickle.dump(le_crop, f)
    
    print(f"   Model saved to: {MODEL_DIR}")
    print("\n" + "=" * 60)
    print("TRAINING COMPLETED SUCCESSFULLY!")
    print("=" * 60)

if __name__ == "__main__":
    train_fertilizer_model()
