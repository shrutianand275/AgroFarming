from flask import Blueprint, request, jsonify
from services.fertilizer_service import predict_fertilizer

fertilizer_bp = Blueprint('fertilizer', __name__)

@fertilizer_bp.route('/recommend', methods=['POST'])
def recommend_fertilizer():
    """
    Fertilizer recommendation endpoint
    
    Request body:
    {
        "Temperature": float,
        "Humidity": float,
        "Moisture": float,
        "Soil_Type": str,
        "Crop_Type": str,
        "Nitrogen": int,
        "Phosphorous": int,
        "Potassium": int,
        "language": str (optional, 'en' or 'hi')
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'Temperature', 'Humidity', 'Moisture',
            'Soil_Type', 'Crop_Type',
            'Nitrogen', 'Phosphorous', 'Potassium'
        ]
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        # Get language preference (default to English)
        language = data.get('language', 'en')
        if language not in ['en', 'hi']:
            language = 'en'
        
        # Make prediction
        result = predict_fertilizer(data, language)
        
        return jsonify({
            "success": True,
            "data": result,
            "message": "Fertilizer recommendation generated successfully"
        }), 200
        
    except ValueError as ve:
        return jsonify({
            "success": False,
            "message": f"Invalid input: {str(ve)}"
        }), 400
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"Server error: {str(e)}"
        }), 500
