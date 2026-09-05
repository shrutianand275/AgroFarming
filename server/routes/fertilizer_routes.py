from flask import Blueprint, request, jsonify

from services.fertilizer_service import predict_fertilizer
from utils.history import save_history_if_logged_in


fertilizer_bp = Blueprint("fertilizer", __name__)


@fertilizer_bp.route("/recommend", methods=["POST"])
def recommend_fertilizer():
    try:
        print("\n" + "=" * 70)
        print("FERTILIZER RECOMMENDATION REQUEST")
        print("=" * 70)

        data = request.get_json(silent=True)

        print("Received data:", data)

        if not data:
            print("ERROR: No JSON data received")

            return jsonify({
                "success": False,
                "message": "No fertilizer data received."
            }), 400

        input_data = {
            "Temperature": data.get("Temperature"),
            "Humidity": data.get("Humidity"),
            "Moisture": data.get("Moisture"),
            "Soil_Type": data.get("Soil_Type"),
            "Crop_Type": data.get("Crop_Type"),
            "Nitrogen": data.get("Nitrogen"),
            "Phosphorous": data.get("Phosphorous"),
            "Potassium": data.get("Potassium")
        }

        language = data.get("language", "en")

        print("Processed input:", input_data)
        print("Language:", language)

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
            if input_data.get(field) is None
            or input_data.get(field) == ""
        ]

        if missing_fields:
            print("Missing fields:", missing_fields)

            return jsonify({
                "success": False,
                "message": "Please fill all required fields.",
                "missing_fields": missing_fields
            }), 400

        print("Calling fertilizer prediction service...")

        result = predict_fertilizer(
            input_data,
            language=language
        )

        print("FERTILIZER RESULT:", result)

        # Save history only when user is logged in
        save_history_if_logged_in(
            "fertilizer",
            "Fertilizer Recommendation",
            input_data,
            result
        )

        print("=" * 70)

        return jsonify({
            "success": True,
            "data": result
        }), 200

    except Exception as e:

        print("\n" + "=" * 70)
        print("!!! FERTILIZER PREDICTION ERROR !!!")
        print("ERROR TYPE:", type(e).__name__)
        print("ERROR:", str(e))
        print("ERROR REPR:", repr(e))
        print("=" * 70)

        return jsonify({
            "success": False,
            "message": str(e),
            "error_type": type(e).__name__
        }), 500