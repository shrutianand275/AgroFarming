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

        # Get old user data to check if location changed
        old_user = find_user_by_id(request.user_id)
        
        user = update_user(
            request.user_id,
            update_data
        )
        
        # ================= SEND WEATHER NOTIFICATION IF LOCATION ADDED/UPDATED =================
        
        location_updated = False
        if "state" in update_data or "district" in update_data:
            # Check if location was added or changed
            old_has_location = old_user.get('state') and old_user.get('district')
            new_has_location = user.get('state') and user.get('district')
            
            if new_has_location:
                location_updated = True
                
        if location_updated:
            try:
                from services.real_weather_service import real_weather_service
                from services.email_service import email_service
                from models.notification_model import create_notification
                
                # Get weather for user's location
                weather_data = real_weather_service.get_weather_for_location(
                    user.get('state'),
                    user.get('district')
                )
                
                farming_advice = real_weather_service.get_farming_advice(weather_data)
                
                # Create in-app notification
                create_notification(
                    user_id=request.user_id,
                    title=f"🌤️ Weather Update - {user.get('district', '')}",
                    message=f"{weather_data['description']} • {weather_data['temperature']}°C • {farming_advice[:100]}...",
                    notification_type="weather_update",
                    metadata=weather_data
                )
                
                # Send email
                email_service.send_daily_weather_email(
                    user_name=user.get('name', 'User'),
                    user_email=user.get('email'),
                    weather_data=weather_data,
                    farming_advice=farming_advice
                )
                
                print(f"✅ Weather notification sent to {user.get('email')}")
                
            except Exception as weather_error:
                print(f"⚠️ Weather notification error (non-critical): {str(weather_error)}")

        return jsonify({
            "success": True,
            "message": "Profile updated successfully." + (" Weather update sent!" if location_updated else ""),
            "user": user_response(user),
            "weather_sent": location_updated
        }), 200

    except Exception as e:

        print("PROFILE UPDATE ERROR:", repr(e))

        return jsonify({
            "success": False,
            "message": "Unable to update profile."
        }), 500