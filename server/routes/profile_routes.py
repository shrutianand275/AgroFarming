from flask import Blueprint, request, jsonify

from models.user_model import find_user_by_id, update_user, user_response
from utils.auth import login_required


profile_bp = Blueprint("profile", __name__)


# ==========================================
# GET PROFILE
# ==========================================

@profile_bp.route("", methods=["GET"])
@login_required
def get_profile():

    try:
        user = find_user_by_id(request.user_id)

        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404

        return jsonify({
            "success": True,
            "user": user_response(user)
        }), 200

    except Exception as e:

        print("PROFILE GET ERROR:", repr(e))

        return jsonify({
            "success": False,
            "message": "Unable to load profile."
        }), 500


# ==========================================
# UPDATE PROFILE
# ==========================================

@profile_bp.route("", methods=["PUT"])
@login_required
def update_profile():

    try:
        data = request.get_json() or {}

        allowed_fields = [
            "name",
            "phone",
            "state",
            "district",
            "village",
            "farmSize",
            "soilType",
            "irrigation",
            "mainCrop"
        ]

        update_data = {}

        for field in allowed_fields:

            if field in data:
                value = str(data[field]).strip()

                if value:
                    update_data[field] = value

        if not update_data:

            return jsonify({
                "success": False,
                "message": "No profile information provided."
            }), 400

        # Check phone number already belongs to another user
        if "phone" in update_data:

            from database import users_collection
            from bson import ObjectId

            existing = users_collection.find_one({
                "phone": update_data["phone"],
                "_id": {
                    "$ne": ObjectId(request.user_id)
                }
            })

            if existing:

                return jsonify({
                    "success": False,
                    "message": "This phone number is already in use."
                }), 409

        user = update_user(
            request.user_id,
            update_data
        )

        return jsonify({
            "success": True,
            "message": "Profile updated successfully.",
            "user": user_response(user)
        }), 200

    except Exception as e:

        print("PROFILE UPDATE ERROR:", repr(e))

        return jsonify({
            "success": False,
            "message": "Unable to update profile."
        }), 500