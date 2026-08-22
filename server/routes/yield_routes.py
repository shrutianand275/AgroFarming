from flask import Blueprint, request, jsonify
from services.yield_service import yield_service

yield_bp = Blueprint('yield', __name__)

@yield_bp.route('/options', methods=['GET'])
def get_yield_options():
    """Get all dropdown options for yield prediction form"""
    try:
        return jsonify({
            'success': True,
            'data': {
                'crops': yield_service.get_crops(),
                'seasons': yield_service.get_seasons(),
                'states': yield_service.get_states(),
                'soil_types': yield_service.get_soil_types(),
                'irrigation_options': ['Yes', 'No']
            }
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@yield_bp.route('/predict', methods=['POST'])
def predict_yield():
    """Predict crop yield based on input parameters"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = [
            'crop', 'season', 'state', 'area', 'rainfall',
            'fertilizer', 'pesticide', 'temperature', 'irrigation', 'soil_type'
        ]
        
        for field in required_fields:
            if field not in data:
                return jsonify({
                    'success': False,
                    'message': f'Missing required field: {field}'
                }), 400
        
        # Validate numeric fields
        try:
            float(data['area'])
            float(data['rainfall'])
            float(data['fertilizer'])
            float(data['pesticide'])
            float(data['temperature'])
        except ValueError:
            return jsonify({
                'success': False,
                'message': 'Numeric fields must contain valid numbers'
            }), 400
        
        # Get prediction
        result = yield_service.predict_yield(data)
        
        return jsonify({
            'success': True,
            'data': result
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500
