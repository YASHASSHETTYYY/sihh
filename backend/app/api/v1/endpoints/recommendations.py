from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_current_user
from app.db.mongo import get_mongo_db
from app.schemas.common import RecommendationResponse
from app.services.recommendation_service import get_recommendations_for_user


router = APIRouter()


@router.get("/{user_id}", response_model=RecommendationResponse)
async def recommendations(user_id: str, current_user: dict = Depends(get_current_user)) -> RecommendationResponse:
    if current_user["_id"] != user_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    db = get_mongo_db()
    latest_entry = await db.moods.find({"user_id": user_id}).sort("created_at", -1).limit(1).to_list(length=1)

    features = latest_entry[0] if latest_entry else {}
    result = get_recommendations_for_user(user_id, features)
    return RecommendationResponse(**result)
