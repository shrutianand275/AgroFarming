import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET = os.getenv("JWT_SECRET")

if not MONGO_URI:
    raise RuntimeError("MONGO_URI is missing in .env")

if not JWT_SECRET:
    raise RuntimeError("JWT_SECRET is missing in .env")