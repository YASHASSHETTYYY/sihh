from datetime import datetime
from typing import Any

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    full_name: str | None = Field(default=None, min_length=2, max_length=120)
    name: str | None = Field(default=None, min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=64)
    dob: str | None = None
    age: int | None = None
    college: str | None = None
    issues: list[str] | None = None
    about: str | None = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    full_name: str
    email: EmailStr
    role: str = "user"
    created_at: datetime


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class MoodEntryCreate(BaseModel):
    mood_score: int = Field(ge=1, le=5)
    note: str = Field(default="", max_length=2000)
    sleep_hours: float = Field(default=7.0, ge=0, le=24)
    study_hours: float = Field(default=3.0, ge=0, le=24)
    screen_hours: float = Field(default=4.0, ge=0, le=24)


class MoodEntryOut(BaseModel):
    id: str
    user_id: str
    mood_score: int
    note: str
    sleep_hours: float
    study_hours: float
    screen_hours: float
    emotion_label: str | None = None
    emotion_confidence: float | None = None
    sentiment_label: str | None = None
    sentiment_confidence: float | None = None
    created_at: datetime


class MoodListResponse(BaseModel):
    items: list[MoodEntryOut]
    total: int


class AnalyticsResponse(BaseModel):
    user_id: str
    weekly_trend: list[dict[str, Any]]
    monthly_trend: list[dict[str, Any]]
    heatmap: list[dict[str, Any]]
    correlation_matrix: list[list[float]]
    correlation_labels: list[str]
    insights: list[str]
    summary: dict[str, Any]


class PredictionRequest(BaseModel):
    sleep_hours: float = Field(ge=0, le=24)
    study_hours: float = Field(ge=0, le=24)
    screen_hours: float = Field(ge=0, le=24)
    note: str = Field(default="", max_length=2000)


class PredictionResponse(BaseModel):
    user_id: str
    predicted_mood: float
    stress_risk: str
    recommendation: str
    feature_snapshot: dict[str, Any]


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=2000)


class ChatResponse(BaseModel):
    reply: str
    context_summary: dict[str, Any]


class BehaviorResponse(BaseModel):
    user_id: str
    detected_rules: list[str]
    cluster_id: int
    cluster_label: str
    burnout_risk: float


class RecommendationItem(BaseModel):
    title: str
    impact: str
    reason: str


class RecommendationResponse(BaseModel):
    user_id: str
    items: list[RecommendationItem]
