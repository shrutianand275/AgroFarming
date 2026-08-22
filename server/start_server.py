"""
AgroFarming Server Startup Script
Verifies models are loaded before starting Flask
"""
import os
import sys

print("=" * 60)
print("AGROFARMING SERVER STARTUP")
print("=" * 60)

# Check if models exist
print("\n1. Checking model files...")
model_files = [
    'models/fertilizer_model.pkl',
    'models/fertilizer_scaler.pkl',
    'models/fertilizer_label_encoder.pkl',
    'models/soil_type_encoder.pkl',
    'models/crop_type_encoder.pkl'
]

missing_files = []
for file in model_files:
    if os.path.exists(file):
        print(f"   ✅ {file}")
    else:
        print(f"   ❌ {file} - MISSING!")
        missing_files.append(file)

if missing_files:
    print("\n❌ ERROR: Missing model files!")
    print("Please run: python training/train_fertilizer_model.py")
    sys.exit(1)

# Test model loading
print("\n2. Loading models...")
try:
    from services.fertilizer_service import fertilizer_model
    
    if fertilizer_model is None:
        print("   ❌ Error: Models failed to load!")
        print("   Please run: python training/train_fertilizer_model.py")
        sys.exit(1)
    else:
        print("   ✅ Fertilizer models loaded successfully!")
except Exception as e:
    print(f"   ❌ Error loading models: {str(e)}")
    sys.exit(1)

# Start Flask
print("\n3. Starting Flask server...")
print("=" * 60)
print("🌱 AgroFarming API Server")
print("📍 Running on: http://127.0.0.1:5000")
print("📊 Models: Loaded and Ready")
print("🌍 CORS: Enabled")
print("=" * 60)
print("\nPress Ctrl+C to stop the server\n")

from app import app
app.run(host="0.0.0.0", port=5000, debug=True)
