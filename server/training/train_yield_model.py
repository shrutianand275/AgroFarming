import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, r2_score, mean_squared_error
import pickle
import os

# Load dataset
print("Loading Crop Yield dataset...")
df = pd.read_csv('datasets/Crop_Yield_Data.csv')
print(f"Dataset shape: {df.shape}")
print(f"\nFirst few rows:\n{df.head()}")
print(f"\nDataset info:\n{df.info()}")
print(f"\nTarget statistics:\n{df['Yield_kg_per_hectare'].describe()}")

# Encode categorical variables
label_encoders = {}
categorical_columns = ['Crop', 'Season', 'State', 'Irrigation', 'Soil_Type']

for col in categorical_columns:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    label_encoders[col] = le
    print(f"\n{col} classes: {list(le.classes_)}")

# Features and target
X = df.drop('Yield_kg_per_hectare', axis=1)
y = df['Yield_kg_per_hectare']

print(f"\nFeatures shape: {X.shape}")
print(f"Target shape: {y.shape}")

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print(f"\nTraining set size: {X_train.shape[0]}")
print(f"Test set size: {X_test.shape[0]}")

# Train Random Forest Regressor
print("\nTraining Random Forest Regressor...")
model = RandomForestRegressor(
    n_estimators=100,
    max_depth=15,
    min_samples_split=2,
    min_samples_leaf=1,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("\n" + "="*50)
print("MODEL PERFORMANCE")
print("="*50)
print(f"Mean Absolute Error: {mae:.2f} kg/hectare")
print(f"Root Mean Squared Error: {rmse:.2f} kg/hectare")
print(f"R² Score: {r2:.4f}")
print(f"Accuracy: {r2*100:.2f}%")

# Feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nFeature Importance:")
print(feature_importance)

# Save model and encoders
os.makedirs('models', exist_ok=True)

with open('models/yield_model.pkl', 'wb') as f:
    pickle.dump(model, f)
print("\nModel saved to models/yield_model.pkl")

with open('models/yield_encoders.pkl', 'wb') as f:
    pickle.dump(label_encoders, f)
print("Label encoders saved to models/yield_encoders.pkl")

# Test prediction
print("\n" + "="*50)
print("TEST PREDICTION")
print("="*50)
sample = X_test.iloc[0:1]
prediction = model.predict(sample)[0]
actual = y_test.iloc[0]
print(f"Sample input:\n{sample}")
print(f"\nPredicted Yield: {prediction:.2f} kg/hectare")
print(f"Actual Yield: {actual:.2f} kg/hectare")
print(f"Difference: {abs(prediction - actual):.2f} kg/hectare")

print("\n" + "="*50)
print("Training completed successfully!")
print("="*50)
