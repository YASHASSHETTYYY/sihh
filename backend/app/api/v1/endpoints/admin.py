from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_admin
from app.db.mongo import get_mongo_db


router = APIRouter()


@router.get("/users")
async def list_users(_admin: dict = Depends(get_current_admin)) -> dict:
    db = get_mongo_db()
    users = await db.users.find({}, {"password_hash": 0}).sort("created_at", -1).limit(200).to_list(length=200)
    return {"items": users, "total": len(users)}


@router.get("/mood-distribution")
async def mood_distribution(_admin: dict = Depends(get_current_admin)) -> dict:
    db = get_mongo_db()
    pipeline = [
        {"$group": {"_id": "$mood_score", "count": {"$sum": 1}}},
        {"$sort": {"_id": 1}},
    ]
    rows = await db.moods.aggregate(pipeline).to_list(length=20)
    return {
        "distribution": [{"mood_score": row["_id"], "count": row["count"]} for row in rows],
    }
