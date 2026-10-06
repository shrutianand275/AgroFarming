# 🌾 AgroFarming - AI-Powered Smart Farming Platform

![AgroFarming](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react)
![Flask](https://img.shields.io/badge/Flask-3.0-black?logo=flask)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green?logo=mongodb)

AgroFarming is a comprehensive AI-powered platform designed to help farmers make informed decisions about crop cultivation, yield prediction, disease detection, and fertilizer recommendations. The platform combines machine learning models with real-time weather data to provide personalized farming advice.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Machine Learning Models](#-machine-learning-models)
- [Database Schema](#-database-schema)
- [Internationalization](#-internationalization)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🌱 Core Features

1. **Crop Recommendation System**
   - AI-powered crop suggestions based on soil parameters (N, P, K, pH)
   - Weather-based recommendations (temperature, humidity, rainfall)
   - Location-specific advice

2. **Yield Prediction**
   - Predict crop yield based on multiple factors
   - State, season, and crop-specific predictions
   - Soil type and irrigation considerations
   - Fertilizer and pesticide usage analysis

3. **Fertilizer Recommendation**
   - Soil nutrient analysis (NPK levels)
   - Crop-specific fertilizer suggestions
   - Environmental factor considerations (temperature, humidity, moisture)
   - Multi-language support (English & Hindi)

4. **Plant Disease Detection**
   - Disease prediction based on symptoms
   - Plant type, season, and weather analysis
   - Treatment recommendations
   - Severity assessment

5. **Weather Forecast & Climate Analysis**
   - Real-time weather data integration
   - Seasonal climate analysis
   - State and city-specific forecasts
   - Historical weather data

6. **Government Schemes Information**
   - Comprehensive database of agricultural schemes
   - Eligibility criteria
   - Application procedures
   - Scheme benefits

7. **AI Chatbot**
   - Agriculture-focused conversational AI
   - Powered by OpenAI
   - Context-aware responses
   - Multi-language support

### 🔐 User Management

- **Authentication & Authorization**
  - JWT-based secure authentication
  - User registration and login
  - Profile management
  - Password encryption with bcrypt

- **User Profile**
  - Personal information management
  - Location settings (state, district)
  - Contact details

- **History & Analytics**
  - Track all predictions and recommendations
  - Historical data analysis
  - Export capabilities

- **Notifications System**
  - In-app notifications
  - Email notifications
  - Weather alerts
  - Registration confirmations
  - Location-based reminders

### 🌐 Additional Features

- **Multi-language Support** (English & Hindi)
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark/Light Mode** support
- **Data Visualization** - Charts and graphs for better insights

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 19.2
- **Build Tool**: Vite 8.1
- **Routing**: React Router DOM 7.18
- **UI Components**: 
  - Bootstrap 5.3
  - React Icons
  - Lucide React
- **Animations**: Framer Motion 12.42
- **HTTP Client**: Axios 1.18
- **Internationalization**: i18next, react-i18next
- **Styling**: CSS3, Bootstrap

### Backend
- **Framework**: Flask 3.0
- **Language**: Python 3.8+
- **Database**: MongoDB
- **Authentication**: JWT (PyJWT)
- **Password Hashing**: bcrypt
- **CORS**: Flask-CORS

### Machine Learning
- **Framework**: scikit-learn 1.5.2
- **Data Processing**: 
  - pandas 2.2.3
  - numpy 2.1.2
- **Model Serialization**: joblib 1.4.2

### AI & External Services
- **AI**: OpenAI API
- **Weather Data**: OpenWeatherMap API
- **Email**: SMTP (Gmail)

### Development Tools
- **Linting**: ESLint 10.6
- **Environment Variables**: python-dotenv
- **API Testing**: Postman/Thunder Client

---

## 📁 Project Structure

```
AgroFarming/
│
├── client/                          # Frontend React Application
│   ├── public/                      # Static assets
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── assets/                  # Images and icons
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── components/              # Reusable components
│   │   │   ├── Navbar/
│   │   │   ├── Footer/
│   │   │   ├── Hero/
│   │   │   ├── Services/
│   │   │   ├── HowItWorks/
│   │   │   ├── SeasonalClimateAnalysis/
│   │   │   ├── ClimateForm.jsx
│   │   │   ├── FertilizerForm.jsx
│   │   │   ├── FertilizerResultCard.jsx
│   │   │   └── ResultCard.jsx
│   │   ├── pages/                   # Page components
│   │   │   ├── Home/
│   │   │   ├── About/
│   │   │   ├── Login/
│   │   │   ├── Signup/
│   │   │   ├── Profile/
│   │   │   ├── History/
│   │   │   ├── Notifications/
│   │   │   ├── CropRecommendation/
│   │   │   ├── YieldPrediction/
│   │   │   ├── FertilizerRecommendation/
│   │   │   ├── DiseasePrediction/
│   │   │   ├── WeatherForecast/
│   │   │   ├── GovernmentSchemes/
│   │   │   └── Chatbot/
│   │   ├── data/                    # Static data files
│   │   │   ├── governmentSchemes.js
│   │   │   └── soilHints.js
│   │   ├── locals/                  # i18n translations
│   │   │   ├── en/translation.json
│   │   │   └── hi/translation.json
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # Entry point
│   │   ├── i18n.js                  # i18n configuration
│   │   └── index.css                # Global styles
│   ├── eslint.config.js
│   ├── vite.config.js
│   ├── index.html
│   └── package.json
│
├── server/                          # Backend Flask Application
│   ├── datasets/                    # Training datasets
│   │   ├── Crop_recommendation.csv
│   │   ├── Crop_Recommendation_Data_Large.csv
│   │   ├── Crop_Yield_Data.csv
│   │   ├── Fertilizer_Prediction.csv
│   │   ├── Fertilizer_Data_Large.csv
│   │   ├── Plant_Disease_Data.csv
│   │   ├── Indian_Climate_Dataset_2024_2025.csv
│   │   ├── india_2000_2024_daily_weather.csv
│   │   ├── rainfall_in_india.csv
│   │   └── Government_Schemes.csv
│   ├── models/                      # ML models and database models
│   │   ├── crop_model.pkl
│   │   ├── fertilizer_model.pkl
│   │   ├── disease_model.pkl
│   │   ├── yield_model.pkl
│   │   ├── *_encoder.pkl            # Label encoders
│   │   ├── *_scaler.pkl             # Feature scalers
│   │   ├── user_model.py            # User DB operations
│   │   ├── history_model.py         # History DB operations
│   │   └── notification_model.py    # Notification DB operations
│   ├── routes/                      # API route handlers
│   │   ├── auth_routes.py           # Authentication endpoints
│   │   ├── profile_routes.py        # User profile endpoints
│   │   ├── history_routes.py        # History endpoints
│   │   ├── notification_routes.py   # Notification endpoints
│   │   ├── crop_routes.py           # Crop recommendation
│   │   ├── yield_routes.py          # Yield prediction
│   │   ├── fertilizer_routes.py     # Fertilizer recommendation
│   │   ├── disease_routes.py        # Disease prediction
│   │   ├── climate_routes.py        # Climate data
│   │   └── chatbot_routes.py        # AI chatbot
│   ├── services/                    # Business logic
│   │   ├── recommendation_service.py
│   │   ├── yield_service.py
│   │   ├── fertilizer_service.py
│   │   ├── disease_service.py
│   │   ├── climate_service.py
│   │   ├── weather_service.py
│   │   ├── real_weather_service.py
│   │   ├── email_service.py
│   │   ├── weather_notification_service.py
│   │   ├── daily_weather_scheduler.py
│   │   └── soil_hint_service.py
│   ├── utils/                       # Utility functions
│   │   └── history.py               # History helper functions
│   ├── training/                    # Model training scripts
│   ├── static/                      # Static files
│   ├── app.py                       # Flask application
│   ├── config.py                    # Configuration
│   ├── database.py                  # MongoDB connection
│   ├── start_server.py              # Server starter
│   ├── requirements.txt             # Python dependencies
│   ├── .env                         # Environment variables (not in git)
│   └── .env.example                 # Environment template
│
└── README.md                        # This file
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **Python** (v3.8 or higher) - [Download](https://www.python.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **Git** - [Download](https://git-scm.com/)

### Optional
- **MongoDB Compass** (GUI for MongoDB) - [Download](https://www.mongodb.com/products/compass)
- **Postman** (API testing) - [Download](https://www.postman.com/)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/AgroFarming.git
cd AgroFarming
```

### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install
```

---

## ⚙️ Configuration

### 1. Backend Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
copy .env.example .env  # Windows
# or
cp .env.example .env    # macOS/Linux
```

Edit the `.env` file with your configuration:

```env
# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/agrofarming

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Email Configuration (Gmail)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SENDER_EMAIL=your-email@gmail.com
SENDER_PASSWORD=your-16-char-app-password

# Server Configuration
FLASK_ENV=development
FLASK_DEBUG=True

# OpenWeatherMap API Configuration
OPENWEATHER_API_KEY=your-openweather-api-key

# OpenAI API Configuration (for chatbot)
OPENAI_API_KEY=your-openai-api-key
```

### 2. Getting API Keys

#### OpenWeatherMap API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Navigate to API Keys section
4. Copy your API key

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy and save it securely

#### Gmail App Password (for email notifications)
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → 2-Step Verification → App passwords
4. Generate a new app password
5. Use this 16-character password in `.env`

### 3. MongoDB Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
# Windows:
net start MongoDB

# macOS (with Homebrew):
brew services start mongodb-community

# Linux:
sudo systemctl start mongod
```

#### Option B: MongoDB Atlas (Cloud)
1. Visit [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update `MONGO_URI` in `.env` file

### 4. Frontend Configuration (Optional)

If your backend runs on a different port or domain, update the API base URL in your frontend code.

Create `client/src/config.js`:
```javascript
export const API_BASE_URL = "http://localhost:5000/api";
```

---

## 🏃 Running the Application

### Development Mode

#### 1. Start MongoDB (if using local)
```bash
# Make sure MongoDB is running
mongod
```

#### 2. Start Backend Server
```bash
# Navigate to server directory
cd server

# Activate virtual environment (if not already activated)
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Run the server
python start_server.py
# or
python app.py
```

The backend server will start at `http://localhost:5000`

#### 3. Start Frontend Development Server
```bash
# Open a new terminal
# Navigate to client directory
cd client

# Start Vite dev server
npm run dev
```

The frontend will start at `http://localhost:5173`

### Production Build

#### Frontend Build
```bash
cd client
npm run build
```

This creates an optimized production build in the `client/dist` directory.

#### Backend Production
```bash
cd server

# Set environment to production in .env
FLASK_ENV=production
FLASK_DEBUG=False

# Run with a production server like Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "securepassword123",
  "state": "Punjab",
  "district": "Ludhiana"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response:**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

### Profile Endpoints

#### Get Profile
```http
GET /profile
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "state": "Punjab",
  "district": "Ludhiana"
}
```

### Crop Recommendation

```http
POST /crop/recommend
Content-Type: application/json

{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.8,
  "humidity": 82,
  "ph": 6.5,
  "rainfall": 202.9
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "crop": "Rice",
    "confidence": 0.95,
    "suitability": "Highly Suitable"
  }
}
```

### Yield Prediction

```http
POST /yield/predict
Content-Type: application/json

{
  "crop": "Rice",
  "season": "Kharif",
  "state": "Punjab",
  "area": 10.5,
  "rainfall": 1200,
  "fertilizer": 150,
  "pesticide": 20,
  "temperature": 28,
  "irrigation": "Canal",
  "soil_type": "Loamy"
}
```

### Fertilizer Recommendation

```http
POST /fertilizer/recommend
Content-Type: application/json

{
  "Temperature": 25,
  "Humidity": 70,
  "Moisture": 40,
  "Soil_Type": "Loamy",
  "Crop_Type": "Rice",
  "Nitrogen": 40,
  "Phosphorous": 30,
  "Potassium": 20,
  "language": "en"
}
```

### Disease Prediction

```http
POST /disease/predict
Content-Type: application/json

{
  "Plant": "Tomato",
  "Temperature": 28,
  "Humidity": 85,
  "Season": "Summer",
  "Severity": "Moderate",
  "language": "en"
}
```

### Weather & Climate

#### Get States
```http
GET /climate/states
```

#### Get Cities
```http
GET /climate/cities/:state
```

#### Get Climate Data
```http
POST /climate/data
Content-Type: application/json

{
  "state": "Punjab",
  "city": "Ludhiana",
  "month": "January"
}
```

### Notifications

#### Get All Notifications
```http
GET /notifications
Authorization: Bearer <token>
```

#### Get Unread Count
```http
GET /notifications/unread-count
Authorization: Bearer <token>
```

#### Mark as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

#### Create Weather Alert
```http
POST /notifications/weather-alert
Authorization: Bearer <token>
Content-Type: application/json

{
  "temperature": 35,
  "humidity": 65,
  "rainfall": 0
}
```

### History

#### Get User History
```http
GET /history
Authorization: Bearer <token>
```

#### Delete History Item
```http
DELETE /history/:id
Authorization: Bearer <token>
```

### Chatbot

```http
POST /chatbot/chat
Content-Type: application/json

{
  "message": "What is the best crop for loamy soil?",
  "language": "en"
}
```

---

## 🤖 Machine Learning Models

### 1. Crop Recommendation Model
- **Algorithm**: Random Forest Classifier
- **Features**: N, P, K, Temperature, Humidity, pH, Rainfall
- **Output**: Recommended crop
- **Accuracy**: ~95%

### 2. Yield Prediction Model
- **Algorithm**: Random Forest Regressor
- **Features**: Crop, Season, State, Area, Rainfall, Fertilizer, Pesticide, Temperature, Irrigation, Soil Type
- **Output**: Predicted yield (tons/hectare)
- **Accuracy**: ~92%

### 3. Fertilizer Recommendation Model
- **Algorithm**: Random Forest Classifier
- **Features**: Temperature, Humidity, Moisture, Soil Type, Crop Type, N, P, K
- **Output**: Recommended fertilizer
- **Accuracy**: ~93%

### 4. Disease Prediction Model
- **Algorithm**: Random Forest Classifier
- **Features**: Plant, Temperature, Humidity, Season, Severity
- **Output**: Disease name, description, treatment
- **Accuracy**: ~90%

### Model Training

To retrain models with new data:

```bash
cd server/training
python train_crop_model.py
python train_yield_model.py
python train_fertilizer_model.py
python train_disease_model.py
```

---

## 💾 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  phone: String,
  password: String (hashed),
  state: String,
  district: String,
  created_at: Date
}
```

### History Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  type: String, // "crop", "yield", "fertilizer", "disease"
  title: String,
  input_data: Object,
  result: Object,
  created_at: Date
}
```

### Notifications Collection
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  title: String,
  message: String,
  type: String, // "weather", "registration", "location_reminder"
  read: Boolean,
  metadata: Object,
  created_at: Date
}
```

---

## 🌍 Internationalization

The application supports multiple languages:
- **English (en)** - Default
- **Hindi (hi)**

### Adding a New Language

1. Create translation file:
```bash
client/src/locals/[language-code]/translation.json
```

2. Update `i18n.js`:
```javascript
import newLang from "./locals/[language-code]/translation.json";

i18n.init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
    newLang: { translation: newLang }
  }
});
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` files** - They contain sensitive information
2. **Use strong JWT secrets** - Generate random strings for production
3. **Enable HTTPS in production** - Use SSL certificates
4. **Sanitize user inputs** - Prevent SQL/NoSQL injection
5. **Rate limiting** - Implement API rate limiting
6. **Keep dependencies updated** - Regularly update packages
7. **Use environment-specific configs** - Different settings for dev/prod

---

## 🧪 Testing

### Backend Testing
```bash
cd server
python -m pytest
```

### Frontend Testing
```bash
cd client
npm run test
```

---

## 🐛 Troubleshooting

### MongoDB Connection Issues
```bash
# Check if MongoDB is running
mongo --version
mongod --version

# Test connection
mongo mongodb://localhost:27017
```

### Port Already in Use
```bash
# Find and kill process using port 5000 (backend)
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -i :5000
kill -9 <PID>
```

### Python Package Issues
```bash
# Upgrade pip
python -m pip install --upgrade pip

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Node Modules Issues
```bash
# Clear npm cache
npm cache clean --force

# Delete and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style Guidelines
- **Python**: Follow PEP 8
- **JavaScript**: Use ESLint configuration
- **Commits**: Use conventional commits format

---

## 📧 Contact & Support

- **Project Maintainer**: Your Name
- **Email**: your.email@example.com
- **GitHub Issues**: [Report a bug](https://github.com/yourusername/AgroFarming/issues)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Datasets**: Agricultural datasets from Kaggle and government sources
- **OpenAI**: For powering the chatbot
- **OpenWeatherMap**: For weather data
- **scikit-learn**: For machine learning capabilities
- **React & Flask communities**: For excellent documentation and support

---

## 🗺️ Roadmap

### Upcoming Features
- [ ] Mobile application (React Native)
- [ ] Real-time weather alerts via push notifications
- [ ] Soil testing kit integration
- [ ] Marketplace for agricultural products
- [ ] Community forum for farmers
- [ ] Video tutorials and guides
- [ ] Multi-crop rotation planning
- [ ] Water usage optimization
- [ ] Pest detection using image recognition
- [ ] Integration with agricultural IoT devices

---

## 📊 Project Statistics

- **Total API Endpoints**: 30+
- **ML Models**: 4 (Crop, Yield, Fertilizer, Disease)
- **Supported Languages**: 2 (English, Hindi)
- **Database Collections**: 3 (Users, History, Notifications)
- **Frontend Pages**: 14
- **Reusable Components**: 15+

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

**Made with ❤️ for Farmers**
