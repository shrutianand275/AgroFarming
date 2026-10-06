from datetime import datetime, timezone
from bson import ObjectId
from database import db

# Create notifications collection
notifications_collection = db['notifications']

def create_notification(user_id, title, message, notification_type, metadata=None):
    """Create a new notification for a user"""
    notification = {
        "user_id": ObjectId(user_id),
        "title": title,
        "message": message,
        "type": notification_type,  # 'registration', 'weather', 'location_reminder', 'general'
        "read": False,
        "metadata": metadata or {},
        "created_at": datetime.now(timezone.utc)
    }
    
    result = notifications_collection.insert_one(notification)
    notification["_id"] = result.inserted_id
    
    return notification

def get_user_notifications(user_id, limit=50, unread_only=False):
    """Get notifications for a specific user"""
    query = {"user_id": ObjectId(user_id)}
    
    if unread_only:
        query["read"] = False
    
    notifications = list(
        notifications_collection
        .find(query)
        .sort("created_at", -1)
        .limit(limit)
    )
    
    return notifications

def mark_as_read(notification_id):
    """Mark a notification as read"""
    notifications_collection.update_one(
        {"_id": ObjectId(notification_id)},
        {"$set": {"read": True}}
    )

def mark_all_as_read(user_id):
    """Mark all user notifications as read"""
    notifications_collection.update_many(
        {"user_id": ObjectId(user_id), "read": False},
        {"$set": {"read": True}}
    )

def get_unread_count(user_id):
    """Get count of unread notifications"""
    return notifications_collection.count_documents({
        "user_id": ObjectId(user_id),
        "read": False
    })

def delete_notification(notification_id):
    """Delete a notification"""
    notifications_collection.delete_one({"_id": ObjectId(notification_id)})

def delete_all_notifications(user_id):
    """Delete all notifications for a user"""
    result = notifications_collection.delete_many({"user_id": ObjectId(user_id)})
    return result.deleted_count

def notification_response(notification):
    """Format notification for API response"""
    return {
        "id": str(notification["_id"]),
        "title": notification.get("title", ""),
        "message": notification.get("message", ""),
        "type": notification.get("type", "general"),
        "read": notification.get("read", False),
        "metadata": notification.get("metadata", {}),
        "created_at": notification["created_at"].isoformat() if notification.get("created_at") else None
    }
