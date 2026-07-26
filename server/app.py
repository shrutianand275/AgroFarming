from flask import Flask, jsonify
from flask_cors import CORS

from routes.crop_routes import crop_bp
from routes.climate_routes import climate_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(
    crop_bp,
    url_prefix="/api/crop"
)

app.register_blueprint(
    climate_bp,
    url_prefix="/api/climate"
)


@app.route("/")
def home():
    return jsonify({
        "success": True,
        "message": "AgroFarming Flask API is running successfully."
    })


@app.route("/health")
def health():
    return jsonify({
        "success": True,
        "status": "Healthy"
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )