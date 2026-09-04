from flask import Blueprint, jsonify, request

from models.history_model import (
    get_user_history,
    delete_history,
    clear_user_history,
    history_response
)

from utils.auth import login_required


history_bp = Blueprint("history", __name__)


@history_bp.route("", methods=["GET"])
@login_required
def get_history():

    try:
        histories = get_user_history(request.user_id)

        return jsonify({
            "success": True,
            "data": [
                history_response(item)
                for item in histories
            ]
        }), 200

    except Exception as e:

        print("GET HISTORY ERROR:", repr(e))

        return jsonify({
            "success": False,
            "message": "Unable to load history."
        }), 500


@history_bp.route("/<history_id>", methods=["DELETE"])
@login_required
def delete_history_item(history_id):

    try:

        result = delete_history(
            request.user_id,
            history_id
        )

        if result.deleted_count == 0:

            return jsonify({
                "success": False,
                "message": "History item not found."
            }), 404

        return jsonify({
            "success": True,
            "message": "History deleted successfully."
        }), 200

    except Exception as e:

        print("DELETE HISTORY ERROR:", repr(e))

        return jsonify({
            "success": False,
            "message": "Unable to delete history."
        }), 500


@history_bp.route("", methods=["DELETE"])
@login_required
def clear_history():

    try:

        clear_user_history(request.user_id)

        return jsonify({
            "success": True,
            "message": "History cleared successfully."
        }), 200

    except Exception as e:

        print("CLEAR HISTORY ERROR:", repr(e))

        return jsonify({
            "success": False,
            "message": "Unable to clear history."
        }), 500