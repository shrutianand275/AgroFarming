import os
import joblib
import pandas as pd

from sklearn.preprocessing import LabelEncoder
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# -----------------------------
# Paths
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DATASET_PATH = os.path.join(
    BASE_DIR,
    "datasets",
    "Crop_Recommendation_Data_Large.csv"
)

MODEL_DIR = os.path.join(BASE_DIR, "models")

os.makedirs(MODEL_DIR, exist_ok=True)

# -----------------------------
# Load Dataset
# -----------------------------

df = pd.read_csv(DATASET_PATH)

print("\nDataset Loaded Successfully")
print(df.head())

# -----------------------------
# Features & Label
# -----------------------------

X = df.drop("label", axis=1)

y = df["label"]

# -----------------------------
# Encode Labels
# -----------------------------

label_encoder = LabelEncoder()

y_encoded = label_encoder.fit_transform(y)

# -----------------------------
# Scale Features
# -----------------------------

scaler = StandardScaler()

X_scaled = scaler.fit_transform(X)

# -----------------------------
# Train/Test Split
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled,
    y_encoded,
    test_size=0.20,
    random_state=42,
    stratify=y_encoded
)

# -----------------------------
# Train Model
# -----------------------------

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=20,
    min_samples_split=3,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

# -----------------------------
# Accuracy
# -----------------------------

prediction = model.predict(X_test)

accuracy = accuracy_score(y_test, prediction)

print("\nModel Accuracy : {:.2f}%".format(accuracy * 100))

# -----------------------------
# Save Model
# -----------------------------

joblib.dump(
    model,
    os.path.join(MODEL_DIR, "crop_model.pkl")
)

joblib.dump(
    scaler,
    os.path.join(MODEL_DIR, "scaler.pkl")
)

joblib.dump(
    label_encoder,
    os.path.join(MODEL_DIR, "label_encoder.pkl")
)

print("\nModel Saved Successfully")

print("\nSaved Files")

print("crop_model.pkl")

print("scaler.pkl")

print("label_encoder.pkl")