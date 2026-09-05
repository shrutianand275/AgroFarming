from flask import Blueprint, request, jsonify

from services.yield_service import yield_service
from utils.history import save_history_if_logged_in


yield_bp = Blueprint("yield", __name__)


# ============================================================
# GET YIELD OPTIONS
# ============================================================

@yield_bp.route("/options", methods=["GET"])
def get_yield_options():

    try:
        return jsonify({
            "success": True,
            "crops": yield_service.get_crops(),
            "seasons": yield_service.get_seasons(),
            "states": yield_service.get_states(),
            "soil_types": yield_service.get_soil_types(),
            "irrigation": yield_service.get_irrigation_types()
        }), 200

    except Exception as e:
        print("YIELD OPTIONS ERROR:", repr(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# ============================================================
# PREDICT YIELD
# ============================================================

@yield_bp.route("/predict", methods=["POST"])
def predict_yield():

    try:

        data = request.get_json(silent=True)

        print("\n" + "=" * 70)
        print("YIELD PREDICTION REQUEST")
        print("=" * 70)
        print("Received data:", data)

        if not data:

            return jsonify({
                "success": False,
                "message": "No prediction data received."
            }), 400


        # ====================================================
        # PREPARE INPUT
        # ====================================================

        input_data = {
            "crop": data.get("crop"),
            "season": data.get("season"),
            "state": data.get("state"),

            "area": data.get(
                "area",
                data.get("farmSize")
            ),

            "rainfall": data.get("rainfall"),
            "fertilizer": data.get("fertilizer"),
            "pesticide": data.get("pesticide"),
            "temperature": data.get("temperature"),

            "irrigation": data.get("irrigation"),

            "soil_type": data.get(
                "soil_type",
                data.get("soilType")
            )
        }


        print("Processed input:", input_data)


        # ====================================================
        # CHECK REQUIRED FIELDS
        # ====================================================

        required_fields = [
            "crop",
            "season",
            "state",
            "area",
            "rainfall",
            "fertilizer",
            "pesticide",
            "temperature",
            "irrigation",
            "soil_type"
        ]

        missing_fields = []

        for field in required_fields:

            value = input_data.get(field)

            if value is None or str(value).strip() == "":
                missing_fields.append(field)


        if missing_fields:

            return jsonify({
                "success": False,
                "message": "Please fill all required fields.",
                "missing_fields": missing_fields
            }), 400


        # ====================================================
        # SHOW ENCODER VALUES
        # ====================================================

        print("\nAvailable encoder values:")

        print(
            "Crops:",
            yield_service.get_crops()
        )

        print(
            "Seasons:",
            yield_service.get_seasons()
        )

        print(
            "States:",
            yield_service.get_states()
        )

        print(
            "Irrigation:",
            yield_service.get_irrigation_types()
        )

        print(
            "Soil Types:",
            yield_service.get_soil_types()
        )


        # ====================================================
        # PREDICT
        # ====================================================

        result = yield_service.predict_yield(
            input_data
        )


        # ====================================================
        # SAVE HISTORY
        # ====================================================

        save_history_if_logged_in(
            "yield",
            "Yield Prediction",
            input_data,
            result
        )


        print("\nPrediction result:")
        print(result)

        print("=" * 70)

        return jsonify({
            "success": True,
            "prediction": result
        }), 200


    except Exception as e:

        print("\n" + "=" * 70)
        print("!!! YIELD PREDICTION ERROR !!!")
        print("ERROR TYPE:", type(e).__name__)
        print("ERROR:", str(e))
        print("ERROR REPR:", repr(e))
        print("=" * 70)

        return jsonify({
            "success": False,
            "message": str(e),
            "error_type": type(e).__name__
        }), 500