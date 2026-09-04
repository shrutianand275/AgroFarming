from datetime import datetime, timezone
from bson import ObjectId

from database import history_collection


def create_history(user_id, history_type, title, input_data, result):
    history = {
        "user_id": ObjectId(user_id),
        "type": history_type,
        "title": title,
        "input": input_data,
        "result": result,
        "created_at": datetime.now(timezone.utc)
    }

    history_collection.insert_one(history)

    return history


def get_user_history(user_id):
    return list(
        history_collection.find(
            {"user_id": ObjectId(user_id)}
        ).sort("created_at", -1).limit(100)
    )


def delete_history(user_id, history_id):
    return history_collection.delete_one({
        "_id": ObjectId(history_id),
        "user_id": ObjectId(user_id)
    })


def clear_user_history(user_id):
    return history_collection.delete_many({
        "user_id": ObjectId(user_id)
    })


def history_response(history):
    return {
        "id": str(history["_id"]),
        "type": history.get("type", ""),
        "title": history.get("title", ""),
        "input": history.get("input", {}),
        "result": history.get("result", {}),
        "created_at": (
            history["created_at"].isoformat()
            if history.get("created_at")
            else None
        )
    }