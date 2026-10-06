import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import os
from datetime import datetime

class EmailService:
    def __init__(self):
        # Email configuration - Update these with your credentials
        self.smtp_server = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
        self.smtp_port = int(os.getenv('SMTP_PORT', '587'))
        self.sender_email = os.getenv('SENDER_EMAIL', 'your-email@gmail.com')
        self.sender_password = os.getenv('SENDER_PASSWORD', 'your-app-password')
        self.sender_name = "AgroFarming"
    
    def send_email(self, to_email, subject, html_content):
        """Send email with HTML content"""
        try:
            # Create message
            message = MIMEMultipart('alternative')
            message['From'] = f"{self.sender_name} <{self.sender_email}>"
            message['To'] = to_email
            message['Subject'] = subject
            
            # Attach HTML content
            html_part = MIMEText(html_content, 'html')
            message.attach(html_part)
            
            # Send email
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.sender_password)
                server.send_message(message)
            
            print(f"✅ Email sent successfully to {to_email}")
            return True
            
        except Exception as e:
            print(f"❌ Email sending failed: {str(e)}")
            return False
    
    def send_registration_email(self, user_name, user_email):
        """Send registration success email"""
        subject = "Welcome to AgroFarming - Registration Successful!"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                }}
                .header {{
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 30px 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }}
                .content {{
                    background: white;
                    padding: 30px 20px;
                    border-radius: 0 0 8px 8px;
                }}
                .button {{
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #666;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🌾 Welcome to AgroFarming!</h1>
                </div>
                <div class="content">
                    <h2>Hello {user_name}!</h2>
                    <p>Congratulations! Your registration was successful.</p>
                    
                    <p><strong>✅ You can now login to your account</strong></p>
                    
                    <p>Start using our AI-powered services:</p>
                    <ul>
                        <li>🌱 Crop Recommendation</li>
                        <li>📊 Yield Prediction</li>
                        <li>🌡️ Weather-based Farming Advice</li>
                        <li>💧 Fertilizer Recommendations</li>
                        <li>🦠 Disease Detection</li>
                    </ul>
                    
                    <p><strong>📍 Important:</strong> Add your location in your profile to receive weather-based notifications and farming advice!</p>
                    
                    
                    <p>Thank you for choosing AgroFarming. We're here to help you make smarter farming decisions!</p>
                </div>
                <div class="footer">
                    <p>© 2026 AgroFarming • Smart Farming System</p>
                    <p>This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(user_email, subject, html_content)
    
    def send_weather_alert_email(self, user_name, user_email, weather_data, farming_advice):
        """Send weather alert email with farming advice"""
        subject = f"🌤️ Weather Alert: {weather_data['condition']} - {weather_data['location']}"
        
        # Weather icons
        weather_icons = {
            'sunny': '☀️',
            'cloudy': '☁️',
            'rainy': '🌧️',
            'thunderstorm': '⛈️',
            'heavy_rain': '🌊',
            'hot': '🔥',
            'cold': '❄️'
        }
        
        icon = weather_icons.get(weather_data.get('type', 'sunny'), '🌤️')
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                }}
                .header {{
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }}
                .weather-card {{
                    background: white;
                    padding: 25px;
                    border-radius: 0 0 8px 8px;
                }}
                .weather-info {{
                    background: #e6f7f1;
                    padding: 15px;
                    border-left: 4px solid #10b981;
                    border-radius: 6px;
                    margin: 15px 0;
                }}
                .advice-box {{
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 15px;
                    border-radius: 6px;
                    margin: 15px 0;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #666;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>{icon} Weather Alert</h1>
                    <p>{weather_data['location']}</p>
                </div>
                <div class="weather-card">
                    <h2>Hello {user_name}!</h2>
                    
                    <div class="weather-info">
                        <h3>📍 Current Weather Conditions</h3>
                        <p><strong>Condition:</strong> {weather_data['condition']}</p>
                        <p><strong>Temperature:</strong> {weather_data.get('temperature', 'N/A')}</p>
                        <p><strong>Humidity:</strong> {weather_data.get('humidity', 'N/A')}</p>
                        <p><strong>Rainfall:</strong> {weather_data.get('rainfall', 'No rain expected')}</p>
                    </div>
                    
                    <div class="advice-box">
                        <h3>🌾 Farming Advice</h3>
                        <p>{farming_advice}</p>
                    </div>
                    
                    <p><small>Weather update sent on {datetime.now().strftime('%B %d, %Y at %I:%M %p')}</small></p>
                </div>
                <div class="footer">
                    <p>© 2026 AgroFarming • Smart Farming System</p>
                    <p>Update your location in profile settings to receive accurate weather alerts.</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(user_email, subject, html_content)
    
    def send_location_reminder_email(self, user_name, user_email):
        """Send reminder to add location"""
        subject = "📍 Add Your Location to Get Weather Alerts"
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                }}
                .header {{
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 25px 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }}
                .content {{
                    background: white;
                    padding: 25px 20px;
                    border-radius: 0 0 8px 8px;
                }}
                .button {{
                    display: inline-block;
                    padding: 12px 30px;
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    text-decoration: none;
                    border-radius: 25px;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 20px;
                    font-size: 12px;
                    color: #666;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📍 Complete Your Profile</h1>
                </div>
                <div class="content">
                    <h2>Hello {user_name}!</h2>
                    
                    <p>We noticed you haven't added your location yet.</p>
                    
                    <p><strong>Why add your location?</strong></p>
                    <ul>
                        <li>🌤️ Receive weather alerts specific to your area</li>
                        <li>🌾 Get farming advice based on local conditions</li>
                        <li>📊 Access location-specific crop recommendations</li>
                        <li>💧 Receive irrigation and rainfall updates</li>
                    </ul>
                    
                    <div style="text-align: center;">
                        <a href="http://localhost:5173/profile" class="button">Add Location Now</a>
                    </div>
                    
                    <p>It only takes a minute to complete your profile!</p>
                </div>
                <div class="footer">
                    <p>© 2026 AgroFarming • Smart Farming System</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(user_email, subject, html_content)
    
    def send_daily_weather_email(self, user_name, user_email, weather_data, farming_advice):
        """Send daily weather update email"""
        subject = f"🌤️ Daily Weather Update - {weather_data['location']}"
        
        # Weather icons
        weather_icons = {
            'Clear': '☀️',
            'Clouds': '☁️',
            'Rain': '🌧️',
            'Drizzle': '🌦️',
            'Thunderstorm': '⛈️',
            'Snow': '❄️',
            'Mist': '🌫️',
            'Haze': '🌫️',
            'Fog': '🌫️'
        }
        
        icon = weather_icons.get(weather_data.get('main', 'Clear'), '🌤️')
        
        # Alert styling based on severity
        alert_style = ""
        alert_content = ""
        if weather_data.get('alerts'):
            alert_style = "background: #fee; border-left: 4px solid #dc3545; padding: 15px; border-radius: 6px; margin: 15px 0;"
            alert_content = f"""
            <div style="{alert_style}">
                <h3>⚠️ Weather Alert</h3>
                <p><strong>{weather_data['alerts']}</strong></p>
            </div>
            """
        
        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: Arial, sans-serif;
                    line-height: 1.6;
                    color: #333;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                }}
                .header {{
                    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                    color: white;
                    padding: 25px 20px;
                    text-align: center;
                    border-radius: 8px 8px 0 0;
                }}
                .weather-card {{
                    background: white;
                    padding: 30px;
                    border-radius: 0 0 8px 8px;
                }}
                .weather-info {{
                    background: #e6f7f1;
                    padding: 20px;
                    border-left: 4px solid #10b981;
                    border-radius: 6px;
                    margin: 20px 0;
                }}
                .weather-stats {{
                    display: flex;
                    flex-wrap: wrap;
                    gap: 15px;
                    margin: 15px 0;
                    justify-content: space-between;
                }}
                .stat-item {{
                    flex: 1 1 140px;
                    min-width: 120px;
                    max-width: 160px;
                    background: #f8f9fa;
                    padding: 12px 8px;
                    border-radius: 8px;
                    text-align: center;
                    overflow: hidden;
                    box-sizing: border-box;
                }}
                .advice-box {{
                    background: #fff3cd;
                    border-left: 4px solid #ffc107;
                    padding: 20px;
                    border-radius: 6px;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    margin-top: 20px;
                    padding-top: 15px;
                    border-top: 1px solid #dee2e6;
                    font-size: 12px;
                    color: #666;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>{icon} Daily Weather Update</h1>
                    <p style="font-size: 18px; margin: 5px 0;">📍 {weather_data['location']}</p>
                    <p style="font-size: 14px; opacity: 0.9;">{datetime.now().strftime('%A, %B %d, %Y')}</p>
                </div>
                <div class="weather-card">
                    <h2>Hello {user_name}! 👋</h2>
                    <p>Here's your daily weather update and farming recommendations:</p>
                    
                    {alert_content}
                    
                    <div class="weather-info">
                        <h3 style="margin-top: 0;">🌤️ Current Weather</h3>
                        <p style="font-size: 18px; margin: 10px 0;"><strong>{weather_data['description']}</strong></p>
                        
                        <div class="weather-stats">
                            <div class="stat-item">
                                <div style="font-size: 24px; font-weight: bold; color: #10b981;">
                                    {weather_data['temperature']}°C
                                </div>
                                <div style="font-size: 12px; color: #666;">Temperature</div>
                            </div>
                            
                            <div class="stat-item">
                                <div style="font-size: 24px; font-weight: bold; color: #10b981;">
                                    {weather_data['feels_like']}°C
                                </div>
                                <div style="font-size: 12px; color: #666;">Feels Like</div>
                            </div>
                            
                            <div class="stat-item">
                                <div style="font-size: 24px; font-weight: bold; color: #10b981;">
                                    {weather_data['humidity']}%
                                </div>
                                <div style="font-size: 12px; color: #666;">Humidity</div>
                            </div>
                            
                            <div class="stat-item">
                                <div style="font-size: 20px; font-weight: bold; color: #10b981; word-wrap: break-word;">
                                    {weather_data.get('wind_speed', 'N/A')} km/h
                                </div>
                                <div style="font-size: 12px; color: #666;">Wind Speed</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="advice-box">
                        <h3 style="margin-top: 0;">🌾 Today's Farming Advice</h3>
                        <div style="line-height: 1.8;">
                            {farming_advice}
                        </div>
                    </div>
                    
                    <p style="color: #666; font-size: 13px; margin-top: 25px;">
                        💡 <em>This weather data is updated in real-time from OpenWeatherMap API</em>
                    </p>
                </div>
                <div class="footer">
                    <p><strong>© 2026 AgroFarming</strong> • Smart Farming System</p>
                    <p>You're receiving this because you enabled weather notifications.</p>
                    <p style="margin-top: 10px;">
                        Update your preferences in <a href="http://localhost:5173/profile" style="color: #10b981;">Profile Settings</a>
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(user_email, subject, html_content)

# Create singleton instance
email_service = EmailService()
