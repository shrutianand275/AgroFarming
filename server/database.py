from pymongo import MongoClient
from config import MONGO_URI

client = MongoClient(MONGO_URI)

db = client["agrofarming"]

users_collection = db["users"]
history_collection = db["history"]
notifications_collection = db["notifications"]

def test_connection():
    try:
        client.admin.command("ping")
        print("MongoDB connected successfully")
        return True
    except Exception as e:
        print("MongoDB connection failed:", e)
        return False