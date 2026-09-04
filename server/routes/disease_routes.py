from flask import Blueprint, request, jsonify

from services.disease_service import predict_disease
from utils.history import save_history_if_logged_in


disease_bp = Blueprint("disease", __name__)


@disease_bp.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json() or {}

        required_fields = [
            "Plant",
            "Temperature",
            "Humidity",
            "Season"
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

        if "Severity" not in data:
            data["Severity"] = "Moderate"

        language = data.get("language", "en")

        if language not in ["en", "hi"]:
            language = "en"

        result = predict_disease(
            data,
            language
        )

        # Save history only for logged-in users
        save_history_if_logged_in(
            history_type="disease",
            title="Disease Prediction",
            input_data=data,
            result=result
        )

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