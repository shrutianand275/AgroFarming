import bcrypt

from flask import Blueprint, request, jsonify

from models.user_model import (
    create_user,
    find_user_by_email,
    find_user_by_phone,
    find_user_by_id,
    user_response
)

from utils.auth import create_token


auth_bp = Blueprint("auth", __name__)


# =========================================================
# REGISTER
# =========================================================

@auth_bp.route("/register", methods=["POST"])
def register():

    try:

        data = request.get_json() or {}

        # ================= REQUIRED =================

        name = data.get("name", "").strip()
        email = data.get("email", "").strip().lower()
        phone = data.get("phone", "").strip()
        password = data.get("password", "")

        # ================= OPTIONAL =================

        state = data.get("state", "").strip()
        district = data.get("district", "").strip()
        village = data.get("village", "").strip()

        farm_size = data.get("farmSize", "")

        soil_type = data.get(
            "soilType",
            ""
        ).strip()

        irrigation = data.get(
            "irrigation",
            ""
        ).strip()

        main_crop = data.get(
            "mainCrop",
            ""
        ).strip()

        # ================= VALIDATION =================

        if not name:

            return jsonify({
                "success": False,
                "message": "Name is required."
            }), 400

        if not email:

            return jsonify({
                "success": False,
                "message": "Email is required."
            }), 400

        if not phone:

            return jsonify({
                "success": False,
                "message": "Phone number is required."
            }), 400

        if not phone.isdigit() or len(phone) != 10:
            return jsonify({
                "success": False,
                "message": "Phone number must be exactly 10 digits."
            }), 400

        if not password:

            return jsonify({
                "success": False,
                "message": "Password is required."
            }), 400

        if len(password) < 6:

            return jsonify({
                "success": False,
                "message": "Password must be at least 6 characters."
            }), 400

        # ================= DUPLICATE CHECK =================

        if find_user_by_email(email):

            return jsonify({
                "success": False,
                "message": "An account with this email already exists."
            }), 409

        if find_user_by_phone(phone):

            return jsonify({
                "success": False,
                "message": "An account with this phone number already exists."
            }), 409

        # ================= PASSWORD HASH =================

        password_hash = bcrypt.hashpw(
            password.encode("utf-8"),
            bcrypt.gensalt()
        ).decode("utf-8")

        # ================= CREATE USER =================

        user = create_user(
            name=name,
            email=email,
            phone=phone,
            password_hash=password_hash,

            state=state,
            district=district,
            village=village,
            farm_size=farm_size,
            soil_type=soil_type,
            irrigation=irrigation,
            main_crop=main_crop
        )

        # ================= TOKEN =================

        token = create_token(
            user["_id"]
        )
        
        # ================= SEND REGISTRATION NOTIFICATION =================
        
        try:
            # Import services
            from models.notification_model import create_notification
            from services.email_service import email_service
            
            # Create in-app notification
            create_notification(
                user_id=str(user["_id"]),
                title="🎉 Welcome to AgroFarming!",
                message="Registration successful! You can now login and start using our AI-powered farming services. Add your location to receive weather alerts.",
                notification_type="registration",
                metadata={}
            )
            
            # Send registration email
            email_service.send_registration_email(name, email)
            
        except Exception as email_error:
            print(f"Email/Notification error (non-critical): {str(email_error)}")

        return jsonify({

            "success": True,

            "message": "Registration successful. Welcome email sent!",

            "token": token,

            "user": user_response(user)

        }), 201

    except Exception as e:

        print(
            "REGISTER ERROR:",
            repr(e)
        )

        return jsonify({
            "success": False,
            "message": "Registration failed."
        }), 500


# =========================================================
# LOGIN
# =========================================================

@auth_bp.route("/login", methods=["POST"])
def login():

    try:

        data = request.get_json() or {}

        identifier = data.get(
            "identifier",
            ""
        ).strip()

        password = data.get(
            "password",
            ""
        )

        if not identifier:

            return jsonify({
                "success": False,
                "message": "Email or phone number is required."
            }), 400

        if not password:

            return jsonify({
                "success": False,
                "message": "Password is required."
            }), 400

        # ================= FIND USER =================

        if "@" in identifier:

            user = find_user_by_email(
                identifier
            )

        else:

            user = find_user_by_phone(
                identifier
            )

        if not user:

            return jsonify({
                "success": False,
                "message": "Invalid email/phone or password."
            }), 401

        # ================= PASSWORD CHECK =================

        password_match = bcrypt.checkpw(
            password.encode("utf-8"),
            user["password"].encode("utf-8")
        )

        if not password_match:

            return jsonify({
                "success": False,
                "message": "Invalid email/phone or password."
            }), 401

        # ================= TOKEN =================

        token = create_token(
            user["_id"]
        )
        
        # ================= SEND WEATHER NOTIFICATION ON LOGIN (IF HAS LOCATION) =================
        
        weather_sent = False
        if user.get('state') and user.get('district'):
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
                    user_id=str(user["_id"]),
                    title=f"🌤️ Welcome back! Weather Update - {user.get('district', '')}",
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
                
                weather_sent = True
                print(f"✅ Weather notification sent on login to {user.get('email')}")
                
            except Exception as weather_error:
                print(f"⚠️ Weather notification error (non-critical): {str(weather_error)}")

        return jsonify({

            "success": True,

            "message": "Login successful." + (" Weather update sent!" if weather_sent else ""),

            "token": token,

            "user": user_response(user),
            
            "weather_sent": weather_sent

        }), 200

    except Exception as e:

        print(
            "LOGIN ERROR:",
            repr(e)
        )

        return jsonify({
            "success": False,
            "message": "Login failed."
        }), 500


# =========================================================
# CURRENT USER
# =========================================================

@auth_bp.route("/me", methods=["GET"])
def me():

    try:

        from utils.auth import get_current_user_id

        user_id = get_current_user_id()

        if not user_id:

            return jsonify({
                "success": False,
                "message": "Not logged in."
            }), 401

        user = find_user_by_id(
            user_id
        )

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

        print(
            "ME ERROR:",
            repr(e)
        )

        return jsonify({
            "success": False,
            "message": "Unable to get user."
        }), 500