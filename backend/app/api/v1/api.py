from fastapi import APIRouter

from app.api.v1.endpoints import admin, analytics, auth, behavior, chat, moods, prediction, recommendations

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(moods.router, prefix="/moods", tags=["moods"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])
api_router.include_router(prediction.router, prefix="/predict", tags=["prediction"])
api_router.include_router(chat.router, prefix="/chat", tags=["chat"])
api_router.include_router(behavior.router, prefix="/behavior", tags=["behavior"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
