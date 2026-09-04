import jwt
from datetime import datetime, timedelta, timezone
from functools import wraps
from flask import request, jsonify

from config import JWT_SECRET


def create_token(user_id):

    payload = {
        "user_id": str(user_id),
        "exp": datetime.now(timezone.utc) + timedelta(days=7)
    }

    return jwt.encode(
        payload,
        JWT_SECRET,
        algorithm="HS256"
    )


def get_current_user_id():

    auth_header = request.headers.get("Authorization", "")

    if not auth_header.startswith("Bearer "):
        return None

    token = auth_header.split(" ", 1)[1]

    try:

        payload = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"]
        )

        return payload.get("user_id")

    except jwt.ExpiredSignatureError:

        return None

    except jwt.InvalidTokenError:

        return None


def login_required(function):

    @wraps(function)
    def decorated(*args, **kwargs):

        user_id = get_current_user_id()

        if not user_id:

            return jsonify({
                "success": False,
                "message": "Login required."
            }), 401

        request.user_id = user_id

        return function(*args, **kwargs)

    return decorated