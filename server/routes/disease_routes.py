from flask import Blueprint, request, jsonify
from services.disease_service import predict_disease

disease_bp = Blueprint('disease', __name__)

@disease_bp.route('/predict', methods=['POST'])
def predict():
    """
    Disease prediction endpoint
    
    Request body:
    {
        "Plant": str,
        "Temperature": float,
        "Humidity": float,
        "Season": str,
        "Severity": str (optional, default: "Moderate"),
        "language": str (optional, 'en' or 'hi')
    }
    """
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['Plant', 'Temperature', 'Humidity', 'Season']
        
        missing_fields = [field for field in required_fields if field not in data]
        if missing_fields:
            return jsonify({
                "success": False,
                "message": f"Missing required fields: {', '.join(missing_fields)}"
            }), 400
        
        # Set defaults
        if 'Severity' not in data:
            data['Severity'] = 'Moderate'
        
        # Get language preference (default to English)
        language = data.get('language', 'en')
        if language not in ['en', 'hi']:
            language = 'en'
        
        # Make prediction
        result = predict_disease(data, language)
        
        return jsonify({
            "success": True,
            "data": result,
            "message": "Disease prediction generated successfully"
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
