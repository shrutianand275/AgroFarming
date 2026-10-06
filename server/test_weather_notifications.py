"""
Test Script for Weather Notification System
Run this to test the event-based weather notifications
"""

import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_registration_with_location():
    """Test 1: Register user with location - should send weather email"""
    print("\n" + "="*60)
    print("TEST 1: Registration with Location")
    print("="*60)
    
    payload = {
        "name": "Weather Test User",
        "email": "weathertest@example.com",
        "phone": "9999999999",
        "password": "test123",
        "state": "Uttar Pradesh",
        "district": "Lucknow"
    }
    
    response = requests.post(f"{BASE_URL}/auth/register", json=payload)
    data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(data, indent=2)}")
    
    if response.status_code == 201:
        print("✅ Registration successful!")
        print("✅ Weather email should be sent to weathertest@example.com")
        return data.get('token')
    elif response.status_code == 409:
        print("⚠️ User already exists, trying login instead...")
        return test_login()
    else:
        print("❌ Registration failed")
        return None

def test_login():
    """Test 2: Login with location - should send weather email"""
    print("\n" + "="*60)
    print("TEST 2: Login (User with Location)")
    print("="*60)
    
    payload = {
        "identifier": "weathertest@example.com",
        "password": "test123"
    }
    
    response = requests.post(f"{BASE_URL}/auth/login", json=payload)
    data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(data, indent=2)}")
    
    if response.status_code == 200:
        print("✅ Login successful!")
        weather_sent = data.get('weather_sent', False)
        if weather_sent:
            print("✅ Weather email sent on login!")
        else:
            print("⚠️ No weather email (user may not have location)")
        return data.get('token')
    else:
        print("❌ Login failed")
        return None

def test_profile_update(token):
    """Test 3: Update location - should send weather email"""
    print("\n" + "="*60)
    print("TEST 3: Update Location")
    print("="*60)
    
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "state": "Maharashtra",
        "district": "Mumbai"
    }
    
    response = requests.put(f"{BASE_URL}/profile", json=payload, headers=headers)
    data = response.json()
    
    print(f"Status Code: {response.status_code}")
    print(f"Response: {json.dumps(data, indent=2)}")
    
    if response.status_code == 200:
        print("✅ Profile updated!")
        weather_sent = data.get('weather_sent', False)
        if weather_sent:
            print("✅ Weather email sent for new location (Mumbai)!")
        else:
            print("⚠️ No weather email sent")
    else:
        print("❌ Profile update failed")

def test_weather_api_directly():
    """Test 4: Test weather API directly"""
    print("\n" + "="*60)
    print("TEST 4: Weather API Direct Test")
    print("="*60)
    
    try:
        from services.real_weather_service import real_weather_service
        
        print("Testing weather fetch for Lucknow, Uttar Pradesh...")
        weather_data = real_weather_service.get_weather_for_location(
            "Uttar Pradesh",
            "Lucknow"
        )
        
        print(f"✅ Weather fetched successfully!")
        print(f"Location: {weather_data['location']}")
        print(f"Temperature: {weather_data['temperature']}°C")
        print(f"Condition: {weather_data['description']}")
        print(f"Humidity: {weather_data['humidity']}%")
        
        farming_advice = real_weather_service.get_farming_advice(weather_data)
        print(f"\n🌾 Farming Advice:\n{farming_advice}")
        
    except Exception as e:
        print(f"❌ Weather API test failed: {str(e)}")

def main():
    """Run all tests"""
    print("\n" + "🌤️"*30)
    print("WEATHER NOTIFICATION SYSTEM - TEST SUITE")
    print("🌤️"*30)
    
    print("\n📝 Prerequisites:")
    print("1. Flask server running on http://localhost:5000")
    print("2. MongoDB connected")
    print("3. OpenWeather API key configured in .env")
    print("4. Email credentials configured in .env")
    
    input("\nPress Enter to start tests...")
    
    # Test 4: Direct weather API test (no user needed)
    test_weather_api_directly()
    
    # Test 1: Registration with location
    token = test_registration_with_location()
    
    if token:
        # Test 3: Update location
        test_profile_update(token)
    
    # Test 2: Login (use existing user)
    test_login()
    
    print("\n" + "="*60)
    print("✅ ALL TESTS COMPLETED!")
    print("="*60)
    print("\n📧 Check the email inbox for:")
    print("   - Registration email")
    print("   - Weather update emails")
    print("\n💡 Check server console logs for detailed output")
    print("\n")

if __name__ == "__main__":
    main()
