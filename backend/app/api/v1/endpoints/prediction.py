from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.dependencies import get_current_user
from app.db.mongo import get_mongo_db
from app.db.postgres import get_postgres_session
from app.models.analytics import PredictionLog
from app.schemas.common import PredictionRequest, PredictionResponse
from app.services.emotion_service import analyze_text_emotion
from app.services.prediction_service import predict_next_mood


router = APIRouter()


@router.post("/{user_id}", response_model=PredictionResponse)
async def predict(
    user_id: str,
    payload: PredictionRequest,
    current_user: dict = Depends(get_current_user),
    session: AsyncSession = Depends(get_postgres_session),
) -> PredictionResponse:
    if current_user["_id"] != user_id and current_user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Access denied")

    db = get_mongo_db()
    entries = await db.moods.find({"user_id": user_id}).sort("created_at", 1).to_list(length=2000)

    emotion = analyze_text_emotion(payload.note)
    result = predict_next_mood(
        user_id,
        entries,
        {
            "sleep_hours": payload.sleep_hours,
            "study_hours": payload.study_hours,
            "screen_hours": payload.screen_hours,
            "sentiment_score": emotion["sentiment_score"],
        },
    )

    log = PredictionLog(
        user_id=user_id,
        predicted_mood=result["predicted_mood"],
        stress_risk=result["stress_risk"],
        recommendation=result["recommendation"],
        features=result["feature_snapshot"],
    )
    session.add(log)
    await session.commit()

    return PredictionResponse(**result)
