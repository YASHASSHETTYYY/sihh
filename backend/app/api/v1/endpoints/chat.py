from fastapi import APIRouter, Depends, HTTPException

from app.api.dependencies import get_current_user
from app.db.mongo import get_mongo_db
from app.schemas.common import ChatRequest, ChatResponse
from app.services.analytics_service import build_analytics_payload
from app.services.behavior_service import detect_behavior_patterns
from app.services.chat_service import build_context_summary, generate_contextual_reply


router = APIRouter()


@router.post("", response_model=ChatResponse)
async def chat(payload: ChatRequest, current_user: dict = Depends(get_current_user)) -> ChatResponse:
    db = get_mongo_db()
    entries = await db.moods.find({"user_id": current_user["_id"]}).sort("created_at", 1).to_list(length=2000)

    analytics = build_analytics_payload(current_user["_id"], entries)
    behavior = detect_behavior_patterns(current_user["_id"], entries)
    context_summary = build_context_summary(current_user, analytics, behavior)

    reply = await generate_contextual_reply(payload.message, context_summary)

    await db.chat_messages.insert_one(
        {
            "user_id": current_user["_id"],
            "message": payload.message,
            "reply": reply,
            "context": context_summary,
        }
    )

    return ChatResponse(reply=reply, context_summary=context_summary)
