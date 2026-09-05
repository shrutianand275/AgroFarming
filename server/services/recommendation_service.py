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

print("✅ Crop model loaded successfully!")
print("Crop classes:", label_encoder.classes_)


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

    # Convert everything to float
    N = float(N)
    P = float(P)
    K = float(K)
    temperature = float(temperature)
    humidity = float(humidity)
    ph = float(ph)
    rainfall = float(rainfall)

    # Original feature order used during training
    raw_features = np.array([[
        N,
        P,
        K,
        temperature,
        humidity,
        ph,
        rainfall
    ]], dtype=float)

    print("\n" + "=" * 70)
    print("CROP PREDICTION")
    print("=" * 70)

    print("Input values:")
    print("N:", N)
    print("P:", P)
    print("K:", K)
    print("Temperature:", temperature)
    print("Humidity:", humidity)
    print("pH:", ph)
    print("Rainfall:", rainfall)

    # Apply SAME scaler used during training
    features = scaler.transform(raw_features)

    print("\nScaled features:")
    print(features)

    # Prediction
    prediction = model.predict(features)

    print("\nEncoded prediction:", prediction)

    crop = label_encoder.inverse_transform(prediction)[0]

    print("Recommended crop:", crop)

    # Probabilities
    probabilities = model.predict_proba(features)[0]

    print("\nAll probabilities:")

    for index, probability in enumerate(probabilities):
        crop_name = label_encoder.inverse_transform([index])[0]
        print(
            f"{crop_name}: "
            f"{probability * 100:.2f}%"
        )

    # Top 3
    top3_index = np.argsort(probabilities)[::-1][:3]

    top3 = []

    for index in top3_index:

        crop_name = label_encoder.inverse_transform([index])[0]

        top3.append({
            "crop": crop_name,
            "confidence": round(
                float(probabilities[index]) * 100,
                2
            )
        })

    confidence = round(
        float(np.max(probabilities)) * 100,
        2
    )

    print("\nTop 3:", top3)
    print("Confidence:", confidence)
    print("=" * 70)

    return {
        "recommended_crop": crop,
        "confidence": confidence,
        "season": crop_season.get(
            crop.lower(),
            "Suitable Season"
        ),
        "tips": crop_tips.get(
            crop.lower(),
            "Follow recommended agricultural practices."
        ),
        "top3": top3
    }