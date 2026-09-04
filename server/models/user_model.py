from datetime import datetime, timezone
from database import users_collection


def create_user(
    name,
    email,
    phone,
    password_hash,
    state="",
    district="",
    village="",
    farm_size="",
    soil_type="",
    irrigation="",
    main_crop=""
):
    user = {
        "name": name,
        "email": email.lower().strip(),
        "phone": phone.strip(),
        "password": password_hash,

        # Optional farming information
        "state": state.strip() if isinstance(state, str) else state,
        "district": district.strip() if isinstance(district, str) else district,
        "village": village.strip() if isinstance(village, str) else village,
        "farmSize": farm_size,
        "soilType": soil_type.strip() if isinstance(soil_type, str) else soil_type,
        "irrigation": irrigation.strip() if isinstance(irrigation, str) else irrigation,
        "mainCrop": main_crop.strip() if isinstance(main_crop, str) else main_crop,

        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }

    result = users_collection.insert_one(user)

    user["_id"] = result.inserted_id

    return user


def find_user_by_email(email):
    return users_collection.find_one({
        "email": email.lower().strip()
    })


def find_user_by_phone(phone):
    return users_collection.find_one({
        "phone": phone.strip()
    })


def find_user_by_id(user_id):
    from bson import ObjectId

    try:
        return users_collection.find_one({
            "_id": ObjectId(user_id)
        })
    except Exception:
        return None


def update_user(user_id, data):
    from bson import ObjectId

    data["updated_at"] = datetime.now(timezone.utc)

    users_collection.update_one(
        {
            "_id": ObjectId(user_id)
        },
        {
            "$set": data
        }
    )

    return find_user_by_id(user_id)


def user_response(user):
    return {
        "id": str(user["_id"]),

        "name": user.get("name", ""),
        "email": user.get("email", ""),
        "phone": user.get("phone", ""),

        # Farming information
        "state": user.get("state", ""),
        "district": user.get("district", ""),
        "village": user.get("village", ""),
        "farmSize": user.get("farmSize", ""),
        "soilType": user.get("soilType", ""),
        "irrigation": user.get("irrigation", ""),
        "mainCrop": user.get("mainCrop", ""),

        "created_at": (
            user["created_at"].isoformat()
            if user.get("created_at")
            else None
        )
    }