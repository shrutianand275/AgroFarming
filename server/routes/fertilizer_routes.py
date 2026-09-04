from flask import Blueprint, request, jsonify

from services.fertilizer_service import predict_fertilizer
from utils.history import save_history_if_logged_in


fertilizer_bp = Blueprint("fertilizer", __name__)


@fertilizer_bp.route("/recommend", methods=["POST"])
def recommend_fertilizer():

    try:

        data = request.get_json() or {}

        required_fields = [
            "Temperature",
            "Humidity",
            "Moisture",
            "Soil_Type",
            "Crop_Type",
            "Nitrogen",
            "Phosphorous",
            "Potassium"
        ]

        missing_fields = [
            field
            for field in required_fields
            if field not in data
        ]

        if missing_fields:

            return jsonify({
                "success": False,
                "message": (
                    "Missing required fields: "
                    + ", ".join(missing_fields)
                )
            }), 400

        language = data.get("language", "en")

        if language not in ["en", "hi"]:
            language = "en"

        result = predict_fertilizer(
            data,
            language
        )

        # Save history only for logged-in users
        save_history_if_logged_in(
            history_type="fertilizer",
            title="Fertilizer Recommendation",
            input_data=data,
            result=result
        )

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