from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_admin, get_current_user
from app.db.mongo import get_mongo_db
from app.db.postgres import get_postgres_session
from app.models.analytics import AnalyticsSnapshot
from app.schemas.common import AnalyticsResponse
from app.services.analytics_service import build_analytics_payload


router = APIRouter()


@router.get("/{user_id}", response_model=AnalyticsResponse)
async def get_analytics(
    user_id: str,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_postgres_session),
) -> AnalyticsResponse:
    if current_user["_id"] != user_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    db = get_mongo_db()
    entries = await db.moods.find({"user_id": user_id}).sort("created_at", 1).to_list(length=2000)

    payload = build_analytics_payload(user_id, entries)

    snapshot = AnalyticsSnapshot(
        user_id=user_id,
        avg_mood=float(payload["summary"].get("average_mood", 0)),
        weekly_avg_mood=float(payload["summary"].get("weekly_average", 0)),
        streak_days=int(payload["summary"].get("streak_days", 0)),
        payload=payload,
    )
    session.add(snapshot)
    await session.commit()

    return AnalyticsResponse(**payload)


@router.get("/admin/overview")
async def admin_analytics_overview(
    _admin: dict = Depends(get_current_admin),
) -> dict:
    db = get_mongo_db()
    total_users = await db.users.count_documents({})
    total_logs = await db.moods.count_documents({})
    return {"total_users": total_users, "total_logs": total_logs}
