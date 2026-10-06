"""
Daily Weather Notification Scheduler
Sends automated weather updates to all users with location
"""

from apscheduler.schedulers.background import BackgroundScheduler
from datetime import datetime
from models.user_model import users_collection
from models.notification_model import create_notification
from services.real_weather_service import real_weather_service
from services.email_service import email_service

class DailyWeatherScheduler:
    """Scheduler for sending daily weather notifications"""
    
    def __init__(self):
        self.scheduler = BackgroundScheduler()
        self.is_running = False
    
    def start(self):
        """Start the daily weather notification scheduler"""
        if self.is_running:
            print("⚠️ Scheduler already running")
            return
        
        # Schedule daily weather notifications
        # Run every day at 7:00 AM
        self.scheduler.add_job(
            func=self.send_daily_weather_notifications,
            trigger='cron',
            hour=7,
            minute=0,
            id='daily_weather_notifications',
            name='Send daily weather notifications to all users',
            replace_existing=True
        )
        
        # Optional: Send evening update at 6:00 PM
        self.scheduler.add_job(
            func=self.send_evening_weather_update,
            trigger='cron',
            hour=18,
            minute=0,
            id='evening_weather_update',
            name='Send evening weather update',
            replace_existing=True
        )
        
        self.scheduler.start()
        self.is_running = True
        
        print("✅ Daily Weather Scheduler Started")
        print("   📅 Morning Update: Every day at 7:00 AM")
        print("   🌆 Evening Update: Every day at 6:00 PM")
    
    def stop(self):
        """Stop the scheduler"""
        if self.scheduler.running:
            self.scheduler.shutdown()
            self.is_running = False
            print("⏹️ Daily Weather Scheduler Stopped")
    
    def send_daily_weather_notifications(self):
        """Send weather notifications to all users with location"""
        try:
            print(f"\n{'='*60}")
            print(f"🌤️ SENDING DAILY WEATHER NOTIFICATIONS")
            print(f"   Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
            print(f"{'='*60}")
            
            # Get all users with location set
            users_with_location = list(users_collection.find({
                "$or": [
                    {"state": {"$exists": True, "$ne": ""}},
                    {"district": {"$exists": True, "$ne": ""}}
                ]
            }))
            
            print(f"📊 Found {len(users_with_location)} users with location")
            
            success_count = 0
            error_count = 0
            
            for user in users_with_location:
                try:
                    # Get user location
                    location = user.get('district') or user.get('state', 'Unknown')
                    user_name = user.get('name', 'User')
                    user_email = user.get('email')
                    user_id = str(user['_id'])
                    
                    print(f"\n📍 Processing: {user_name} - {location}")
                    
                    # Fetch real weather data
                    weather = real_weather_service.get_weather_by_location(location)
                    
                    if not weather:
                        print(f"   ❌ Failed to fetch weather for {location}")
                        error_count += 1
                        continue
                    
                    print(f"   🌡️ Weather: {weather['description']}, {weather['temperature']}°C")
                    
                    # Detect weather alerts
                    alerts = real_weather_service.detect_weather_alerts(weather)
                    
                    # Get farming advice
                    farming_advice = real_weather_service.get_farming_advice(weather, alerts)
                    
                    # Determine if this is a significant weather change
                    is_significant = self._is_significant_weather(weather, alerts)
                    
                    # Always send daily update, but highlight if significant
                    notification_type = 'weather_alert' if is_significant else 'weather_daily'
                    
                    # Create notification title
                    if alerts:
                        alert_emoji = self._get_alert_emoji(alerts[0]['type'])
                        title = f"{alert_emoji} Weather Alert: {weather['description']} - {location}"
                    else:
                        emoji = self._get_weather_emoji(weather)
                        title = f"{emoji} Daily Weather: {weather['description']} - {location}"
                    
                    # Create notification message
                    message_parts = [
                        f"Temperature: {weather['temperature']}°C (Feels like {weather['feels_like']}°C)",
                        f"Humidity: {weather['humidity']}%",
                    ]
                    
                    if weather['rainfall'] > 0:
                        message_parts.append(f"Rainfall: {weather['rainfall']}mm")
                    
                    if alerts:
                        message_parts.append(f"⚠️ {alerts[0]['message']}")
                    
                    message_parts.extend(farming_advice[:2])  # Top 2 advice
                    
                    message = " | ".join(message_parts)
                    
                    # Create in-app notification
                    create_notification(
                        user_id=user_id,
                        title=title,
                        message=message,
                        notification_type=notification_type,
                        metadata={
                            'weather': weather,
                            'alerts': alerts,
                            'advice': farming_advice
                        }
                    )
                    
                    # Send email notification
                    email_service.send_daily_weather_email(
                        user_name=user_name,
                        user_email=user_email,
                        weather=weather,
                        alerts=alerts,
                        farming_advice=farming_advice,
                        is_morning=True
                    )
                    
                    print(f"   ✅ Notification sent successfully")
                    success_count += 1
                    
                except Exception as user_error:
                    print(f"   ❌ Error for user: {str(user_error)}")
                    error_count += 1
                    continue
            
            print(f"\n{'='*60}")
            print(f"📈 SUMMARY:")
            print(f"   ✅ Success: {success_count}")
            print(f"   ❌ Errors: {error_count}")
            print(f"   📊 Total: {len(users_with_location)}")
            print(f"{'='*60}\n")
            
        except Exception as e:
            print(f"❌ Daily weather notification error: {str(e)}")
    
    def send_evening_weather_update(self):
        """Send evening weather update (next day forecast)"""
        try:
            print(f"\n🌆 Sending evening weather update...")
            # Similar to morning but with "tomorrow's weather" context
            # For now, we'll skip implementation as morning update is primary
            pass
            
        except Exception as e:
            print(f"❌ Evening update error: {str(e)}")
    
    def send_test_notification(self, user_email=None):
        """Send test notification immediately (for testing)"""
        try:
            print("\n🧪 SENDING TEST NOTIFICATION")
            
            if user_email:
                user = users_collection.find_one({"email": user_email.lower().strip()})
                if not user:
                    print(f"❌ User not found: {user_email}")
                    return False
                
                users_with_location = [user]
            else:
                # Send to first user with location
                users_with_location = list(users_collection.find({
                    "$or": [
                        {"state": {"$exists": True, "$ne": ""}},
                        {"district": {"$exists": True, "$ne": ""}}
                    ]
                }).limit(1))
            
            if not users_with_location:
                print("❌ No users with location found")
                return False
            
            # Temporarily change scheduler function to send immediately
            for user in users_with_location:
                location = user.get('district') or user.get('state')
                user_name = user.get('name', 'User')
                user_email = user.get('email')
                
                weather = real_weather_service.get_weather_by_location(location)
                alerts = real_weather_service.detect_weather_alerts(weather)
                farming_advice = real_weather_service.get_farming_advice(weather, alerts)
                
                email_service.send_daily_weather_email(
                    user_name=user_name,
                    user_email=user_email,
                    weather=weather,
                    alerts=alerts,
                    farming_advice=farming_advice,
                    is_morning=True
                )
                
                print(f"✅ Test notification sent to {user_email}")
                return True
                
        except Exception as e:
            print(f"❌ Test notification error: {str(e)}")
            return False
    
    def _is_significant_weather(self, weather, alerts):
        """Determine if weather requires immediate attention"""
        # High priority if there are alerts
        if alerts:
            return True
        
        # High temp
        if weather['temperature'] >= 38 or weather['temperature'] <= 12:
            return True
        
        # Rainfall
        if weather['rainfall'] > 10:
            return True
        
        # Strong winds
        if weather['wind_speed'] > 35:
            return True
        
        return False
    
    def _get_weather_emoji(self, weather):
        """Get emoji based on weather condition"""
        main = weather['main'].lower()
        temp = weather['temperature']
        
        if temp >= 38:
            return '🔥'
        elif temp <= 12:
            return '❄️'
        elif 'thunder' in weather['description'].lower():
            return '⛈️'
        elif main == 'rain':
            if weather['rainfall'] > 20:
                return '🌊'
            return '🌧️'
        elif main == 'clouds':
            return '☁️'
        elif main == 'clear':
            return '☀️'
        else:
            return '🌤️'
    
    def _get_alert_emoji(self, alert_type):
        """Get emoji for alert type"""
        emoji_map = {
            'extreme_heat': '🔥',
            'heat': '☀️',
            'cold': '❄️',
            'heavy_rain': '🌊',
            'moderate_rain': '🌧️',
            'thunderstorm': '⛈️',
            'strong_wind': '💨'
        }
        return emoji_map.get(alert_type, '⚠️')

# Create singleton instance
daily_weather_scheduler = DailyWeatherScheduler()
