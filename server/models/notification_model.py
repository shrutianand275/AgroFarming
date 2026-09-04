from datetime import datetime, timezone
from bson import ObjectId

from database import notifications_collection


def create_notification(user_id, title, message, notification_type="info"):
    notification = {
        "user_id": ObjectId(user_id),
        "title": title,
        "message": message,
        "type": notification_type,
        "read": False,
        "created_at": datetime.now(timezone.utc)
    }

    result = notifications_collection.insert_one(notification)
    notification["_id"] = result.inserted_id

    return notification


def get_user_notifications(user_id):
    return list(
        notifications_collection.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1).limit(100)
    )


def mark_notification_read(user_id, notification_id):
    return notifications_collection.update_one(
        {
            "_id": ObjectId(notification_id),
            "user_id": ObjectId(user_id)
        },
        {
            "$set": {
                "read": True
            }
        }
    )


def delete_notification(user_id, notification_id):
    return notifications_collection.delete_one({
        "_id": ObjectId(notification_id),
        "user_id": ObjectId(user_id)
    })


def clear_notifications(user_id):
    return notifications_collection.delete_many({
        "user_id": ObjectId(user_id)
    })


def notification_response(notification):
    return {
        "id": str(notification["_id"]),
        "title": notification.get("title", ""),
        "message": notification.get("message", ""),
        "type": notification.get("type", "info"),
        "read": notification.get("read", False),
        "created_at": (
            notification["created_at"].isoformat()
            if notification.get("created_at")
            else None
        )
    }