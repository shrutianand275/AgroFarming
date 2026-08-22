"""
Quick test script for fertilizer recommendation
Run this after training the model to test predictions
"""

from services.fertilizer_service import predict_fertilizer

# Test cases
test_cases = [
    {
        "name": "Maize with Sandy Soil (Urea)",
        "input": {
            "Temperature": 26,
            "Humidity": 52,
            "Moisture": 38,
            "Soil_Type": "Sandy",
            "Crop_Type": "Maize",
            "Nitrogen": 37,
            "Phosphorous": 0,
            "Potassium": 0
        },
        "language": "en"
    },
    {
        "name": "Sugarcane with Loamy Soil (DAP)",
        "input": {
            "Temperature": 29,
            "Humidity": 52,
            "Moisture": 45,
            "Soil_Type": "Loamy",
            "Crop_Type": "Sugarcane",
            "Nitrogen": 12,
            "Phosphorous": 36,
            "Potassium": 0
        },
        "language": "hi"
    },
    {
        "name": "Cotton with Black Soil (14-35-14)",
        "input": {
            "Temperature": 34,
            "Humidity": 65,
            "Moisture": 62,
            "Soil_Type": "Black",
            "Crop_Type": "Cotton",
            "Nitrogen": 27,
            "Phosphorous": 20,
            "Potassium": 0
        },
        "language": "en"
    },
    {
        "name": "Paddy with Clayey Soil (MOP)",
        "input": {
            "Temperature": 24,
            "Humidity": 65,
            "Moisture": 58,
            "Soil_Type": "Clayey",
            "Crop_Type": "Paddy",
            "Nitrogen": 9,
            "Phosphorous": 0,
            "Potassium": 48
        },
        "language": "hi"
    }
]

def run_tests():
    print("=" * 80)
    print("FERTILIZER RECOMMENDATION SYSTEM - TEST CASES")
    print("=" * 80)
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"\n{'='*80}")
        print(f"Test Case {i}: {test_case['name']}")
        print(f"Language: {test_case['language'].upper()}")
        print(f"{'='*80}")
        
        print("\nInput:")
        for key, value in test_case['input'].items():
            print(f"  {key}: {value}")
        
        try:
            result = predict_fertilizer(test_case['input'], test_case['language'])
            
            print("\n✅ PREDICTION SUCCESSFUL!")
            print(f"\n🌱 Recommended Fertilizer: {result['fertilizer']}")
            print(f"📊 Confidence: {result['confidence']}%")
            print(f"\n📝 Description:")
            print(f"   {result['description']}")
            
            print(f"\n✨ Benefits:")
            for benefit in result['benefits']:
                print(f"   • {benefit}")
            
            print(f"\n💡 Application Tips:")
            for tip in result['applicationTips']:
                print(f"   • {tip}")
                
        except Exception as e:
            print(f"\n❌ ERROR: {str(e)}")
    
    print("\n" + "=" * 80)
    print("ALL TESTS COMPLETED!")
    print("=" * 80)

if __name__ == "__main__":
    run_tests()
