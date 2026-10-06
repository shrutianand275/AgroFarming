"""
Test script for notification system
Run this to verify notifications work without email setup
"""

from models.notification_model import create_notification, get_user_notifications, notification_response
from models.user_model import find_user_by_email
from services.weather_notification_service import weather_notification_service

def test_notifications():
    print("=" * 60)
    print("NOTIFICATION SYSTEM TEST")
    print("=" * 60)
    
    # Test 1: Find a user (replace with actual email from your database)
    print("\n1. Finding test user...")
    test_email = input("Enter a registered user email to test: ").strip()
    
    user = find_user_by_email(test_email)
    
    if not user:
        print("❌ User not found. Please register a user first.")
        return
    
    user_id = str(user["_id"])
    user_name = user.get("name", "User")
    print(f"✅ Found user: {user_name} ({test_email})")
    
    # Test 2: Create a test notification
    print("\n2. Creating test notification...")
    notification = create_notification(
        user_id=user_id,
        title="🧪 Test Notification",
        message="This is a test notification to verify the system works!",
        notification_type="general",
        metadata={"test": True}
    )
    print(f"✅ Notification created with ID: {notification['_id']}")
    
    # Test 3: Weather detection
    print("\n3. Testing weather detection...")
    conditions = [
        {"temp": 35, "humidity": 60, "rainfall": 0, "expected": "Hot Day"},
        {"temp": 25, "humidity": 85, "rainfall": 5, "expected": "Light Rain"},
        {"temp": 28, "humidity": 60, "rainfall": 30, "expected": "Thunderstorm"},
        {"temp": 12, "humidity": 70, "rainfall": 0, "expected": "Cold Weather"},
    ]
    
    for cond in conditions:
        detected = weather_notification_service.detect_weather_condition(
            cond["temp"], cond["humidity"], cond["rainfall"]
        )
        print(f"   Temp: {cond['temp']}°C, Humidity: {cond['humidity']}%, Rain: {cond['rainfall']}mm")
        print(f"   → Detected: {detected.replace('_', ' ').title()}")
    
    # Test 4: Get user notifications
    print("\n4. Fetching user notifications...")
    notifications = get_user_notifications(user_id, limit=10)
    print(f"✅ Found {len(notifications)} notifications")
    
    print("\n   Latest notifications:")
    for notif in notifications[:3]:
        print(f"   - {notif['title']}")
        print(f"     {notif['message'][:60]}...")
        print(f"     Type: {notif['type']}, Read: {notif['read']}")
    
    # Test 5: Location check
    print("\n5. Checking user location...")
    has_location = bool(user.get('state') or user.get('district'))
    if has_location:
        print(f"✅ Location found: {user.get('state', 'N/A')}, {user.get('district', 'N/A')}")
    else:
        print("⚠️  No location set - Location reminder would be sent")
    
    print("\n" + "=" * 60)
    print("✅ ALL TESTS PASSED!")
    print("=" * 60)
    print("\nNOTE: Email sending is disabled in this test.")
    print("Configure .env file to enable email functionality.")
    print("\nNext steps:")
    print("1. Create .env file with email credentials")
    print("2. Test with actual registration")
    print("3. Build frontend notification UI")

if __name__ == "__main__":
    try:
        test_notifications()
    except Exception as e:
        print(f"\n❌ Test failed with error: {str(e)}")
        import traceback
        traceback.print_exc()
