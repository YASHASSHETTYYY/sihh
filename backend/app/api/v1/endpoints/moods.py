from datetime import datetime
from uuid import uuid4

from fastapi import APIRouter, Depends

from app.api.dependencies import get_current_user
from app.db.mongo import get_mongo_db
from app.schemas.common import MoodEntryCreate, MoodEntryOut, MoodListResponse
from app.services.emotion_service import analyze_text_emotion


router = APIRouter()


def _map_mood(doc: dict) -> MoodEntryOut:
    return MoodEntryOut(
        id=doc["_id"],
        user_id=doc["user_id"],
        mood_score=doc["mood_score"],
        note=doc.get("note", ""),
        sleep_hours=doc.get("sleep_hours", 7.0),
        study_hours=doc.get("study_hours", 3.0),
        screen_hours=doc.get("screen_hours", 4.0),
        emotion_label=doc.get("emotion_label"),
        emotion_confidence=doc.get("emotion_confidence"),
        sentiment_label=doc.get("sentiment_label"),
        sentiment_confidence=doc.get("sentiment_confidence"),
        created_at=doc["created_at"],
    )


@router.post("", response_model=MoodEntryOut)
async def create_mood(payload: MoodEntryCreate, current_user: dict = Depends(get_current_user)) -> MoodEntryOut:
    db = get_mongo_db()
    emotion = analyze_text_emotion(payload.note)

    doc = {
        "_id": str(uuid4()),
        "user_id": current_user["_id"],
        "mood_score": int(payload.mood_score),
        "note": payload.note,
        "sleep_hours": float(payload.sleep_hours),
        "study_hours": float(payload.study_hours),
        "screen_hours": float(payload.screen_hours),
        "created_at": datetime.utcnow(),
        **emotion,
    }
    await db.moods.insert_one(doc)
    return _map_mood(doc)


@router.get("", response_model=MoodListResponse)
async def list_moods(limit: int = 100, current_user: dict = Depends(get_current_user)) -> MoodListResponse:
    db = get_mongo_db()
    cursor = (
        db.moods.find({"user_id": current_user["_id"]})
        .sort("created_at", -1)
        .limit(max(1, min(limit, 365)))
    )
    rows = await cursor.to_list(length=max(1, min(limit, 365)))
    items = [_map_mood(row) for row in rows]
    return MoodListResponse(items=items, total=len(items))
