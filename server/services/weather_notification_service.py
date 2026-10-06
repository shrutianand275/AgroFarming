from models.notification_model import create_notification
from services.email_service import email_service

class WeatherNotificationService:
    """Service to create weather-based notifications and farming advice"""
    
    def get_weather_advice(self, weather_condition, temperature=None, rainfall=None):
        """Generate farming advice based on weather conditions"""
        
        advice_map = {
            'sunny': {
                'advice': 'Perfect day for field work! Ensure adequate irrigation for crops. Monitor soil moisture levels. Good day for harvesting if crops are ready.',
                'icon': '☀️',
                'type': 'sunny'
            },
            'hot': {
                'advice': 'High temperature alert! Increase irrigation frequency. Provide shade for sensitive crops. Avoid working during peak afternoon hours. Check livestock water supply.',
                'icon': '🔥',
                'type': 'hot'
            },
            'cloudy': {
                'advice': 'Overcast conditions. Good for transplanting seedlings. Monitor for potential rain. Reduced water evaporation today.',
                'icon': '☁️',
                'type': 'cloudy'
            },
            'light_rain': {
                'advice': 'Light rainfall expected. Delay irrigation. Good for seed germination. Ensure proper drainage in fields. Monitor for pest activity.',
                'icon': '🌧️',
                'type': 'rainy'
            },
            'heavy_rain': {
                'advice': 'Heavy rainfall warning! Ensure field drainage systems are clear. Postpone fertilizer application. Protect young plants. Check for waterlogging in low-lying areas.',
                'icon': '🌊',
                'type': 'heavy_rain'
            },
            'thunderstorm': {
                'advice': 'Thunderstorm alert! Avoid field work. Secure equipment and protect livestock. Check drainage after storm. Be cautious of lightning. Stay indoors during storm.',
                'icon': '⛈️',
                'type': 'thunderstorm'
            },
            'cold': {
                'advice': 'Cold weather alert! Protect frost-sensitive crops. Reduce irrigation. Good time for winter crop maintenance. Monitor for cold damage.',
                'icon': '❄️',
                'type': 'cold'
            },
            'windy': {
                'advice': 'Strong winds expected! Secure structures and equipment. Support tall crops. Delay spraying operations. Protect young plants.',
                'icon': '💨',
                'type': 'sunny'
            }
        }
        
        return advice_map.get(weather_condition.lower(), {
            'advice': 'Check local weather forecast regularly. Plan farming activities accordingly. Ensure proper crop care based on current conditions.',
            'icon': '🌤️',
            'type': 'sunny'
        })
    
    def detect_weather_condition(self, temperature, humidity, rainfall_mm):
        """Detect weather condition based on parameters"""
        
        if rainfall_mm > 50:
            return 'heavy_rain'
        elif rainfall_mm > 20:
            return 'thunderstorm'
        elif rainfall_mm > 5:
            return 'light_rain'
        elif temperature > 35:
            return 'hot'
        elif temperature < 15:
            return 'cold'
        elif humidity > 80:
            return 'cloudy'
        else:
            return 'sunny'
    
    def create_weather_notification(self, user_id, user_name, user_email, location, weather_params):
        """Create weather notification and send email"""
        
        # Extract weather parameters
        temperature = weather_params.get('temperature', 25)
        humidity = weather_params.get('humidity', 60)
        rainfall = weather_params.get('rainfall', 0)
        
        # Detect weather condition
        condition = self.detect_weather_condition(temperature, humidity, rainfall)
        weather_info = self.get_weather_advice(condition, temperature, rainfall)
        
        # Format location
        location_str = location.get('district', '') or location.get('state', '') or 'Your Area'
        
        # Create weather condition text
        condition_text = condition.replace('_', ' ').title()
        if condition == 'sunny':
            condition_text = 'Sunny Day'
        elif condition == 'hot':
            condition_text = f'Hot Day ({temperature}°C)'
        elif condition == 'cold':
            condition_text = f'Cold Weather ({temperature}°C)'
        elif condition == 'heavy_rain':
            condition_text = f'Heavy Rainfall ({rainfall}mm expected)'
        elif condition == 'thunderstorm':
            condition_text = f'Thunderstorm Alert ({rainfall}mm rainfall)'
        elif condition == 'light_rain':
            condition_text = f'Light Rain ({rainfall}mm)'
        
        # Create notification title and message
        title = f"{weather_info['icon']} Weather Alert: {condition_text}"
        message = weather_info['advice']
        
        # Save notification in database
        notification = create_notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type='weather',
            metadata={
                'location': location_str,
                'weather': {
                    'condition': condition_text,
                    'temperature': f"{temperature}°C",
                    'humidity': f"{humidity}%",
                    'rainfall': f"{rainfall}mm" if rainfall > 0 else "No rain expected"
                }
            }
        )
        
        # Send email notification
        weather_data = {
            'condition': condition_text,
            'location': location_str,
            'temperature': f"{temperature}°C",
            'humidity': f"{humidity}%",
            'rainfall': f"{rainfall}mm" if rainfall > 0 else "No rain expected",
            'type': weather_info['type']
        }
        
        email_service.send_weather_alert_email(
            user_name=user_name,
            user_email=user_email,
            weather_data=weather_data,
            farming_advice=weather_info['advice']
        )
        
        return notification
    
    def send_location_reminder(self, user_id, user_name, user_email):
        """Send notification and email to remind user to add location"""
        
        title = "📍 Add Your Location"
        message = "Please add your location (state/district) in your profile to receive weather-based notifications and farming advice tailored to your area."
        
        # Create in-app notification
        notification = create_notification(
            user_id=user_id,
            title=title,
            message=message,
            notification_type='location_reminder',
            metadata={}
        )
        
        # Send email reminder
        email_service.send_location_reminder_email(user_name, user_email)
        
        return notification

# Create singleton instance
weather_notification_service = WeatherNotificationService()
