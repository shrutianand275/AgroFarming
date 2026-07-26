from flask import Blueprint, request, jsonify
from services.recommendation_service import recommend_crop

crop_bp = Blueprint("crop", __name__)


@crop_bp.route("/recommend", methods=["POST"])
def crop_recommendation():

    try:

        data = request.get_json()

        required_fields = [
            "N",
            "P",
            "K",
            "temperature",
            "humidity",
            "ph",
            "rainfall"
        ]

        # Check missing fields
        for field in required_fields:
            if field not in data:
                return jsonify({
                    "success": False,
                    "message": f"{field} is required."
                }), 400

        result = recommend_crop(
            float(data["N"]),
            float(data["P"]),
            float(data["K"]),
            float(data["temperature"]),
            float(data["humidity"]),
            float(data["ph"]),
            float(data["rainfall"])
        )

        return jsonify({
            "success": True,
            "data": result
        })

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500