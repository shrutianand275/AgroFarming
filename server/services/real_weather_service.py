import requests
import os
from datetime import datetime

class RealWeatherService:
    """Service to fetch real weather data from OpenWeatherMap API"""
    
    def __init__(self):
        # Free API key from OpenWeatherMap
        # Get your own at: https://openweathermap.org/api
        self.api_key = os.getenv('OPENWEATHER_API_KEY', '')
        self.base_url = "http://api.openweathermap.org/data/2.5/weather"
        
    def get_weather_for_location(self, state, district):
        """
        Get weather for a specific state and district
        
        Parameters:
        - state: State name
        - district: District name
        
        Returns:
        - Complete weather data with alerts and advice
        """
        # Try district first, then state if district fails
        location = f"{district}, {state}" if district else state
        
        weather = self.get_weather_by_location(location)
        
        # Detect alerts
        alerts = self.detect_weather_alerts(weather)
        
        # Add alerts to weather data
        if alerts:
            weather['alerts'] = '; '.join([alert['message'] for alert in alerts])
            weather['alert_severity'] = max([alert['severity'] for alert in alerts], 
                                           key=lambda x: {'high': 3, 'medium': 2, 'low': 1}[x])
        else:
            weather['alerts'] = None
            weather['alert_severity'] = None
        
        return weather
    
    def get_farming_advice(self, weather):
        """Get farming advice from weather data"""
        alerts = []
        if weather.get('alerts'):
            # Reconstruct alerts for advice generation
            alerts = self.detect_weather_alerts(weather)
        
        advice_list = self._get_farming_advice_internal(weather, alerts)
        return '\n'.join([f"• {adv}" for adv in advice_list])
    
    def _get_farming_advice_internal(self, weather, alerts):
        """Internal method to generate farming advice list"""
        advice = []
        
        main_condition = weather.get('main', '').lower()
        temp = weather.get('temperature', 25)
        humidity = weather.get('humidity', 60)
        rainfall = weather.get('rainfall', 0)
        
        # Temperature-based advice
        if temp >= 40:
            advice.append("🔥 Extreme Heat: Provide shade for crops, increase irrigation to 3 times daily, avoid field work during 11 AM - 4 PM")
        elif temp >= 35:
            advice.append("☀️ Hot Weather: Increase irrigation frequency, mulch to retain moisture, check for heat stress in crops")
        elif temp <= 10:
            advice.append("❄️ Cold Weather: Protect frost-sensitive crops with covers, reduce irrigation, avoid early morning field work")
        elif temp >= 25 and temp <= 30:
            advice.append("🌤️ Perfect Conditions: Ideal temperature for most farming activities and crop growth")
        
        # Rainfall-based advice
        if rainfall > 50:
            advice.append("🌊 Heavy Rain: Ensure proper drainage, postpone fertilizer application, secure equipment, check for waterlogging")
        elif rainfall > 20:
            advice.append("🌧️ Moderate Rain: Delay irrigation, good for seed germination, monitor pest activity after rain")
        elif rainfall > 0:
            advice.append("💧 Light Rain: Natural irrigation, delay manual watering, good for transplanting seedlings")
        
        # Humidity-based advice
        if humidity > 80:
            advice.append("💨 High Humidity: Monitor for fungal diseases, ensure good air circulation, apply preventive fungicides if needed")
        elif humidity < 40:
            advice.append("🌵 Low Humidity: Increase irrigation, use mulching to retain moisture, protect young plants")
        
        # Wind advice
        wind_speed = weather.get('wind_speed', 0)
        if wind_speed > 40:
            advice.append("💨 Strong Winds: Support tall crops, secure structures, postpone spraying operations")
        
        # Thunderstorm advice
        if any(alert.get('type') == 'thunderstorm' for alert in alerts):
            advice.append("⛈️ Thunderstorm: Avoid field work, secure livestock, unplug electrical equipment, stay indoors")
        
        # Sunny day advice
        if main_condition == 'clear' and temp < 35:
            advice.append("☀️ Clear Sky: Perfect for harvesting, drying crops, field preparation, and outdoor work")
        
        # Cloudy day advice
        if main_condition == 'clouds' and rainfall == 0:
            advice.append("☁️ Cloudy: Good for transplanting, reduced water loss, ideal for pesticide application")
        
        # Default if no specific advice
        if not advice:
            advice.append("🌾 Normal Conditions: Continue regular farming activities, maintain standard irrigation schedule")
        
        return advice
    
    def get_weather_by_location(self, location, country='IN'):
        """
        Get real weather data for a location
        
        Parameters:
        - location: city name, district, or state
        - country: country code (default: IN for India)
        
        Returns:
        - Weather data dictionary or None if error
        """
        try:
            if not self.api_key:
                print("⚠️ OpenWeather API key not configured. Using fallback data.")
                return self._get_fallback_weather(location)
            
            # Make API request
            params = {
                'q': f"{location},{country}",
                'appid': self.api_key,
                'units': 'metric'  # Celsius
            }
            
            response = requests.get(self.base_url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                return self._parse_weather_data(data, location)
            else:
                print(f"Weather API error: {response.status_code}")
                return self._get_fallback_weather(location)
                
        except Exception as e:
            print(f"Error fetching weather: {str(e)}")
            return self._get_fallback_weather(location)
    
    def _parse_weather_data(self, data, location):
        """Parse OpenWeatherMap API response"""
        try:
            weather = {
                'location': location.title(),
                'temperature': round(data['main']['temp']),
                'feels_like': round(data['main']['feels_like']),
                'temp_min': round(data['main']['temp_min']),
                'temp_max': round(data['main']['temp_max']),
                'humidity': data['main']['humidity'],
                'pressure': data['main']['pressure'],
                'description': data['weather'][0]['description'].title(),
                'main': data['weather'][0]['main'],
                'wind_speed': round(data['wind']['speed'] * 3.6, 1),  # m/s to km/h
                'clouds': data['clouds']['all'],
                'sunrise': datetime.fromtimestamp(data['sys']['sunrise']).strftime('%I:%M %p'),
                'sunset': datetime.fromtimestamp(data['sys']['sunset']).strftime('%I:%M %p'),
                'visibility': data.get('visibility', 10000) / 1000,  # meters to km
            }
            
            # Calculate rainfall (if available)
            if 'rain' in data:
                weather['rainfall'] = data['rain'].get('1h', 0)
            else:
                weather['rainfall'] = 0
            
            return weather
            
        except Exception as e:
            print(f"Error parsing weather data: {str(e)}")
            return self._get_fallback_weather(location)
    
    def _get_fallback_weather(self, location):
        """Fallback weather data when API is not available"""
        import random
        
        # Simulate realistic weather data
        temp = random.randint(20, 35)
        humidity = random.randint(40, 80)
        
        conditions = [
            'Clear Sky', 'Partly Cloudy', 'Cloudy', 'Light Rain', 
            'Moderate Rain', 'Sunny', 'Overcast'
        ]
        
        return {
            'location': location.title(),
            'temperature': temp,
            'feels_like': temp + random.randint(-2, 3),
            'temp_min': temp - random.randint(2, 5),
            'temp_max': temp + random.randint(2, 5),
            'humidity': humidity,
            'pressure': random.randint(1000, 1020),
            'description': random.choice(conditions),
            'main': random.choice(['Clear', 'Clouds', 'Rain']),
            'wind_speed': random.randint(5, 25),
            'clouds': random.randint(0, 100),
            'sunrise': '06:00 AM',
            'sunset': '06:30 PM',
            'visibility': random.randint(5, 10),
            'rainfall': random.randint(0, 5) if random.random() > 0.7 else 0,
            'is_fallback': True
        }
    
    def detect_weather_alerts(self, weather):
        """Detect if weather requires special alert"""
        alerts = []
        
        # Temperature alerts
        if weather['temperature'] >= 40:
            alerts.append({
                'type': 'extreme_heat',
                'severity': 'high',
                'message': 'Extreme heat warning! Temperature above 40°C.'
            })
        elif weather['temperature'] >= 35:
            alerts.append({
                'type': 'heat',
                'severity': 'medium',
                'message': 'Hot weather alert. Temperature above 35°C.'
            })
        elif weather['temperature'] <= 10:
            alerts.append({
                'type': 'cold',
                'severity': 'medium',
                'message': 'Cold weather alert. Temperature below 10°C.'
            })
        
        # Rainfall alerts
        if weather['rainfall'] > 50:
            alerts.append({
                'type': 'heavy_rain',
                'severity': 'high',
                'message': f"Heavy rainfall alert! {weather['rainfall']}mm expected."
            })
        elif weather['rainfall'] > 20:
            alerts.append({
                'type': 'moderate_rain',
                'severity': 'medium',
                'message': f"Moderate rainfall expected. {weather['rainfall']}mm."
            })
        
        # Wind alerts
        if weather['wind_speed'] > 40:
            alerts.append({
                'type': 'strong_wind',
                'severity': 'high',
                'message': f"Strong wind alert! Speed: {weather['wind_speed']} km/h"
            })
        
        # Thunderstorm detection
        if 'thunder' in weather['description'].lower() or 'storm' in weather['description'].lower():
            alerts.append({
                'type': 'thunderstorm',
                'severity': 'high',
                'message': 'Thunderstorm alert! Take necessary precautions.'
            })
        
        return alerts

# Create singleton instance
real_weather_service = RealWeatherService()
