from dotenv import load_dotenv

# Load environment variables first
load_dotenv()

from flask import Flask, jsonify
from flask_cors import CORS

# MongoDB connection test
from database import test_connection

# Existing routes
from routes.crop_routes import crop_bp
from routes.climate_routes import climate_bp
from routes.fertilizer_routes import fertilizer_bp
from routes.disease_routes import disease_bp
from routes.yield_routes import yield_bp
from routes.chatbot_routes import chatbot_bp
from routes.auth_routes import auth_bp
from routes.profile_routes import profile_bp
from routes.history_routes import history_bp
from routes.notification_routes import notification_bp


# ==============================
# Flask App
# ==============================

app = Flask(__name__)

# ==============================
# CORS
# ==============================

CORS(app)


# ==============================
# MongoDB
# ==============================

test_connection()


# ==============================
# Existing API Routes
# ==============================
app.register_blueprint(
    auth_bp,
    url_prefix="/api/auth"
)

app.register_blueprint(
    profile_bp,
    url_prefix="/api/profile"
)

app.register_blueprint(
    history_bp,
    url_prefix="/api/history"
)

app.register_blueprint(
    notification_bp,
    url_prefix="/api/notifications"
)

app.register_blueprint(
    crop_bp,
    url_prefix="/api/crop"
)

app.register_blueprint(
    climate_bp,
    url_prefix="/api/climate"
)

app.register_blueprint(
    fertilizer_bp,
    url_prefix="/api/fertilizer"
)

app.register_blueprint(
    disease_bp,
    url_prefix="/api/disease"
)

app.register_blueprint(
    yield_bp,
    url_prefix="/api/yield"
)

app.register_blueprint(
    chatbot_bp,
    url_prefix="/api/chatbot"
)


# ==============================
# Home
# ==============================

@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "AgroFarming Flask API is running successfully."
    })


# ==============================
# Health Check
# ==============================

@app.route("/health")
def health():
    return jsonify({
        "success": True,
        "status": "Healthy"
    })


# ==============================
# Run Server
# ==============================

if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )