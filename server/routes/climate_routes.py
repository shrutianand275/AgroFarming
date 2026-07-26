from flask import Blueprint, jsonify, request

from services.climate_service import (
    get_states,
    get_cities,
    get_climate
)

climate_bp = Blueprint("climate", __name__)


@climate_bp.route("/states", methods=["GET"])
def states():
    return jsonify({
        "success": True,
        "states": get_states()
    })


@climate_bp.route("/cities/<state>", methods=["GET"])
def cities(state):
    return jsonify({
        "success": True,
        "cities": get_cities(state)
    })


@climate_bp.route("/data", methods=["POST"])
def climate():

    data = request.get_json()

    result = get_climate(
        data["state"],
        data["city"],
        data["month"]
    )

    if result is None:
        return jsonify({
            "success": False,
            "message": "No climate data found."
        }), 404

    return jsonify({
        "success": True,
        "data": result
    })
