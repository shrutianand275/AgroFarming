import os
import joblib
import numpy as np

# -----------------------------
# Paths
# -----------------------------

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, "models", "crop_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "models", "scaler.pkl")
ENCODER_PATH = os.path.join(BASE_DIR, "models", "label_encoder.pkl")

# -----------------------------
# Load ML Files
# -----------------------------

model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
label_encoder = joblib.load(ENCODER_PATH)


# -----------------------------
# Crop Seasons
# -----------------------------

crop_season = {
    "rice": "Kharif",
    "maize": "Kharif",
    "jute": "Kharif",
    "cotton": "Kharif",
    "papaya": "All Season",
    "banana": "All Season",
    "watermelon": "Summer",
    "muskmelon": "Summer",
    "coconut": "All Season",
    "coffee": "Winter",
    "kidneybeans": "Kharif",
    "pigeonpeas": "Kharif",
    "mothbeans": "Kharif",
    "mungbean": "Kharif",
    "blackgram": "Kharif",
    "lentil": "Rabi",
    "pomegranate": "Winter",
    "mango": "Summer",
    "grapes": "Winter",
    "orange": "Winter",
    "apple": "Winter",
    "chickpea": "Rabi"
}


# -----------------------------
# Crop Tips
# -----------------------------

crop_tips = {
    "rice": "Maintain standing water during early growth.",
    "maize": "Apply nitrogen in split doses.",
    "cotton": "Avoid waterlogging.",
    "banana": "Ensure regular irrigation.",
    "papaya": "Use well-drained fertile soil.",
    "coffee": "Grow under partial shade.",
    "mango": "Avoid excessive irrigation.",
    "grapes": "Provide proper pruning.",
    "apple": "Suitable for cooler climates.",
    "orange": "Maintain balanced irrigation.",
    "coconut": "Provide sufficient moisture.",
    "chickpea": "Requires well-drained soil.",
    "lentil": "Avoid excessive nitrogen.",
    "blackgram": "Needs warm climate.",
    "mungbean": "Harvest before pod shattering.",
    "mothbeans": "Suitable for dry regions.",
    "kidneybeans": "Requires moderate rainfall.",
    "pigeonpeas": "Deep fertile soil preferred.",
    "watermelon": "Needs full sunlight.",
    "muskmelon": "Avoid excess irrigation.",
    "jute": "Requires warm and humid climate."
}


# -----------------------------
# Prediction Function
# -----------------------------

def recommend_crop(
    N,
    P,
    K,
    temperature,
    humidity,
    ph,
    rainfall
):

    features = np.array([[
        N,
        P,
        K,
        temperature,
        humidity,
        ph,
        rainfall
    ]])

    features = scaler.transform(features)

    prediction = model.predict(features)

    crop = label_encoder.inverse_transform(prediction)[0]

    probabilities = model.predict_proba(features)[0]

    top3_index = np.argsort(probabilities)[::-1][:3]

    top3 = []

    for index in top3_index:

        crop_name = label_encoder.inverse_transform([index])[0]

        top3.append({
            "crop": crop_name,
            "confidence": round(
                probabilities[index] * 100,
                2
            )
        })

    confidence = round(
        np.max(probabilities) * 100,
        2
    )

    return {
        "recommended_crop": crop,
        "confidence": confidence,
        "season": crop_season.get(crop, "Suitable Season"),
        "tips": crop_tips.get(
            crop,
            "Follow recommended agricultural practices."
        ),
        "top3": top3
    }