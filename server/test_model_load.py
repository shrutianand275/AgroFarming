"""Test if models can be loaded"""
import pickle
import os

MODEL_DIR = 'models'

print("Testing model loading...")
print("=" * 50)

models_to_test = [
    'fertilizer_model.pkl',
    'fertilizer_scaler.pkl',
    'fertilizer_label_encoder.pkl',
    'soil_type_encoder.pkl',
    'crop_type_encoder.pkl'
]

for model_file in models_to_test:
    path = os.path.join(MODEL_DIR, model_file)
    try:
        with open(path, 'rb') as f:
            model = pickle.load(f)
        print(f"✅ {model_file} - Loaded successfully")
    except Exception as e:
        print(f"❌ {model_file} - Error: {str(e)}")

print("=" * 50)
print("\nNow testing fertilizer_service import...")
try:
    from services.fertilizer_service import fertilizer_model
    if fertilizer_model is None:
        print("❌ fertilizer_model is None")
    else:
        print("✅ fertilizer_model loaded successfully")
except Exception as e:
    print(f"❌ Error importing: {str(e)}")
