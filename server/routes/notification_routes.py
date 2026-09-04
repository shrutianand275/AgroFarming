from flask import Blueprint, jsonify, request

from models.notification_model import (
    get_user_notifications,
    mark_notification_read,
    delete_notification,
    clear_notifications,
    notification_response
)

from utils.auth import login_required


notification_bp = Blueprint(
    "notifications",
    __name__
)


@notification_bp.route("", methods=["GET"])
@login_required
def get_notifications():

    try:

        notifications = get_user_notifications(
            request.user_id
        )

        unread_count = sum(
            1
            for item in notifications
            if not item.get("read", False)
        )

        return jsonify({
            "success": True,
            "data": [
                notification_response(item)
                for item in notifications
            ],
            "unread_count": unread_count
        }), 200

    except Exception as e:

        print(
            "GET NOTIFICATIONS ERROR:",
            repr(e)
        )

        return jsonify({
            "success": False,
            "message": "Unable to load notifications."
        }), 500


@notification_bp.route(
    "/<notification_id>/read",
    methods=["PUT"]
)
@login_required
def mark_read(notification_id):

    try:

        result = mark_notification_read(
            request.user_id,
            notification_id
        )

        if result.matched_count == 0:

            return jsonify({
                "success": False,
                "message": "Notification not found."
            }), 404

        return jsonify({
            "success": True,
            "message": "Notification marked as read."
        }), 200

    except Exception as e:

        print(
            "MARK NOTIFICATION ERROR:",
            repr(e)
        )

        return jsonify({
            "success": False,
            "message": "Unable to update notification."
        }), 500


@notification_bp.route(
    "/<notification_id>",
    methods=["DELETE"]
)
@login_required
def delete_notification_item(
    notification_id
):

    try:

        result = delete_notification(
            request.user_id,
            notification_id
        )

        if result.deleted_count == 0:

            return jsonify({
                "success": False,
                "message": "Notification not found."
            }), 404

        return jsonify({
            "success": True,
            "message": "Notification deleted."
        }), 200

    except Exception as e:

        print(
            "DELETE NOTIFICATION ERROR:",
            repr(e)
        )

        return jsonify({
            "success": False,
            "message": "Unable to delete notification."
        }), 500


@notification_bp.route(
    "",
    methods=["DELETE"]
)
@login_required
def clear_all_notifications():

    try:

        clear_notifications(
            request.user_id
        )

        return jsonify({
            "success": True,
            "message": "All notifications cleared."
        }), 200

    except Exception as e:

        print(
            "CLEAR NOTIFICATIONS ERROR:",
            repr(e)
        )

        return jsonify({
            "success": False,
            "message": "Unable to clear notifications."
        }), 500