from flask import Blueprint, jsonify, request

from models.notification_model import (
    get_user_notifications,
    mark_as_read,
    mark_all_as_read,
    get_unread_count,
    delete_notification,
    delete_all_notifications,
    notification_response
)
from models.user_model import find_user_by_id
from services.weather_notification_service import weather_notification_service

from utils.auth import login_required


notification_bp = Blueprint(
    "notifications",
    __name__
)


@notification_bp.route("", methods=["GET"])
@login_required
def get_notifications():
    """Get all notifications for logged-in user"""
    try:
        user_id = request.user_id
        
        # Get query parameters
        unread_only = request.args.get('unread_only', 'false').lower() == 'true'
        limit = int(request.args.get('limit', 50))
        
        notifications = get_user_notifications(user_id, limit=limit, unread_only=unread_only)
        unread_count = get_unread_count(user_id)

        return jsonify({
            "success": True,
            "data": [notification_response(item) for item in notifications],
            "unread_count": unread_count
        }), 200

    except Exception as e:
        print("GET NOTIFICATIONS ERROR:", repr(e))
        return jsonify({
            "success": False,
            "message": "Unable to load notifications."
        }), 500


@notification_bp.route("/unread-count", methods=["GET"])
@login_required
def get_unread():
    """Get count of unread notifications"""
    try:
        user_id = request.user_id
        count = get_unread_count(user_id)
        
        return jsonify({
            "success": True,
            "count": count
        }), 200
        
    except Exception as e:
        print("GET UNREAD COUNT ERROR:", repr(e))
        return jsonify({
            "success": False,
            "message": "Unable to get unread count."
        }), 500


@notification_bp.route("/<notification_id>/read", methods=["PUT"])
@login_required
def mark_read(notification_id):
    """Mark a notification as read"""
    try:
        mark_as_read(notification_id)
        
        return jsonify({
            "success": True,
            "message": "Notification marked as read."
        }), 200

    except Exception as e:
        print("MARK NOTIFICATION ERROR:", repr(e))
        return jsonify({
            "success": False,
            "message": "Unable to update notification."
        }), 500


@notification_bp.route("/mark-all-read", methods=["PUT"])
@login_required
def mark_all_read():
    """Mark all notifications as read"""
    try:
        user_id = request.user_id
        mark_all_as_read(user_id)
        
        return jsonify({
            "success": True,
            "message": "All notifications marked as read."
        }), 200
        
    except Exception as e:
        print("MARK ALL READ ERROR:", repr(e))
        return jsonify({
            "success": False,
            "message": "Unable to mark all as read."
        }), 500


@notification_bp.route("/<notification_id>", methods=["DELETE"])
@login_required
def delete_notification_item(notification_id):
    """Delete a notification"""
    try:
        delete_notification(notification_id)
        
        return jsonify({
            "success": True,
            "message": "Notification deleted."
        }), 200

    except Exception as e:
        print("DELETE NOTIFICATION ERROR:", repr(e))
        return jsonify({
            "success": False,
            "message": "Unable to delete notification."
        }), 500


@notification_bp.route("", methods=["DELETE"])
@login_required
def delete_all_notifications_route():
    """Delete all notifications for logged-in user"""
    try:
        user_id = request.user_id
        count = delete_all_notifications(user_id)
        
        return jsonify({
            "success": True,
            "message": f"All notifications cleared. {count} notification(s) deleted.",
            "deleted_count": count
        }), 200
        
    except Exception as e:
        print("DELETE ALL NOTIFICATIONS ERROR:", repr(e))
        return jsonify({
            "success": False,
            "message": "Unable to clear notifications."
        }), 500


@notification_bp.route("/weather-alert", methods=["POST"])
@login_required
def create_weather_alert():
    """Create weather-based notification (can be triggered manually or by cron job)"""
    try:
        user_id = request.user_id
        
        # Get user details
        user = find_user_by_id(user_id)
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404
        
        # Check if user has location
        if not user.get('state') and not user.get('district'):
            # Send location reminder
            weather_notification_service.send_location_reminder(
                user_id=user_id,
                user_name=user.get('name', 'User'),
                user_email=user.get('email')
            )
            
            return jsonify({
                "success": True,
                "message": "Please add your location to receive weather alerts.",
                "location_reminder_sent": True
            }), 200
        
        # Get weather parameters from request or use mock data
        data = request.get_json() or {}
        weather_params = {
            'temperature': data.get('temperature', 28),
            'humidity': data.get('humidity', 65),
            'rainfall': data.get('rainfall', 0)
        }
        
        location = {
            'state': user.get('state', ''),
            'district': user.get('district', '')
        }
        
        # Create weather notification
        notification = weather_notification_service.create_weather_notification(
            user_id=user_id,
            user_name=user.get('name', 'User'),
            user_email=user.get('email'),
            location=location,
            weather_params=weather_params
        )
        
        return jsonify({
            "success": True,
            "message": "Weather alert sent successfully.",
            "notification": notification_response(notification)
        }), 201
        
    except Exception as e:
        print("CREATE WEATHER ALERT ERROR:", repr(e))
        return jsonify({
            "success": False,
            "message": "Unable to create weather alert."
        }), 500


@notification_bp.route("/check-location", methods=["GET"])
@login_required
def check_location():
    """Check if user has location set, send reminder if not"""
    try:
        user_id = request.user_id
        user = find_user_by_id(user_id)
        
        if not user:
            return jsonify({
                "success": False,
                "message": "User not found."
            }), 404
        
        has_location = bool(user.get('state') or user.get('district'))
        
        # If no location, send reminder
        if not has_location:
            weather_notification_service.send_location_reminder(
                user_id=user_id,
                user_name=user.get('name', 'User'),
                user_email=user.get('email')
            )
        
        return jsonify({
            "success": True,
            "has_location": has_location,
            "location": {
                "state": user.get('state', ''),
                "district": user.get('district', '')
            },
            "reminder_sent": not has_location
        }), 200
        
    except Exception as e:
        print("CHECK LOCATION ERROR:", repr(e))
        return jsonify({
            "success": False,
            "message": "Unable to check location."
        }), 500


@notification_bp.route("/send-daily-weather-test", methods=["POST"])
def send_daily_weather_test():
    """Test endpoint - Send daily weather emails to all users NOW (for testing)"""
    try:
        from services.daily_weather_scheduler import daily_weather_scheduler
        
        # Call the send function directly
        daily_weather_scheduler.send_weather_to_all_users()
        
        return jsonify({
            "success": True,
            "message": "Daily weather emails have been sent to all users with location information."
        }), 200
        
    except Exception as e:
        print("SEND DAILY WEATHER TEST ERROR:", repr(e))
        return jsonify({
            "success": False,
            "message": f"Failed to send daily weather emails: {str(e)}"
        }), 500
