from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.db.mongo import get_mongo_db
from app.db.postgres import get_postgres_session
from app.models.analytics import UserSegment
from app.schemas.common import BehaviorResponse
from app.services.behavior_service import detect_behavior_patterns


router = APIRouter()


@router.get("/{user_id}", response_model=BehaviorResponse)
async def behavior(
    user_id: str,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_postgres_session),
) -> BehaviorResponse:
    if current_user["_id"] != user_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    db = get_mongo_db()
    entries = await db.moods.find({"user_id": user_id}).sort("created_at", 1).to_list(length=2000)

    result = detect_behavior_patterns(user_id, entries)

    segment = UserSegment(
        user_id=user_id,
        cluster_id=result["cluster_id"],
        burnout_risk=result["burnout_risk"],
        summary=result["cluster_label"],
    )
    session.add(segment)
    await session.commit()

    return BehaviorResponse(**result)
