from __future__ import annotations

from datetime import datetime
from typing import Any

import numpy as np

from app.ml.feature_engineering import build_dataframe, latest_feature_vector
from app.ml.model_loader import load_artifact


def _fallback_prediction(features: dict[str, Any]) -> float:
    mood = 3.2
    mood += (float(features.get("sleep_hours", 7)) - 7) * 0.15
    mood -= max(float(features.get("study_hours", 3)) - 8, 0) * 0.12
    mood -= max(float(features.get("screen_hours", 4)) - 8, 0) * 0.08
    mood += float(features.get("sentiment_score", 0)) * 0.35
    return float(np.clip(mood, 1.0, 5.0))


def _risk_label(predicted_mood: float, burnout_probability: float) -> str:
    if predicted_mood <= 2.6 or burnout_probability >= 0.7:
        return "HIGH"
    if predicted_mood <= 3.3 or burnout_probability >= 0.4:
        return "MEDIUM"
    return "LOW"


def _recommendation(predicted_mood: float, features: dict[str, Any]) -> str:
    if predicted_mood <= 2.5:
        return "Try a 10-minute walk, hydrate, and avoid late-night screens before sleep."
    if float(features.get("sleep_hours", 7)) < 6:
        return "Focus on sleep recovery tonight: reduce screen time and set a 30-minute wind-down routine."
    if float(features.get("study_hours", 3)) > 8:
        return "Use a 50/10 study rhythm with short breaks and deep breathing between sessions."
    return "Keep your current routine and add a brief gratitude or journaling check-in tonight."


def predict_next_mood(user_id: str, entries: list[dict], request_features: dict[str, Any]) -> dict[str, Any]:
    df = build_dataframe(entries)

    engineered = {
        "sleep_hours": float(request_features.get("sleep_hours", 7.0)),
        "study_hours": float(request_features.get("study_hours", 3.0)),
        "screen_hours": float(request_features.get("screen_hours", 4.0)),
        "day_of_week": float(datetime.utcnow().weekday()),
        "is_weekend": float(datetime.utcnow().weekday() >= 5),
        "sentiment_score": float(request_features.get("sentiment_score", 0.0)),
    }

    vector = latest_feature_vector(df, engineered)

    regressor = load_artifact("mood_regressor.joblib")
    burnout_model = load_artifact("burnout_isolation_forest.joblib")

    if regressor is None:
        predicted = _fallback_prediction(engineered)
    else:
        predicted = float(np.clip(regressor.predict(vector)[0], 1.0, 5.0))

    if burnout_model is None:
        burnout_probability = float(
            np.clip((float(engineered["study_hours"]) / 10 + float(engineered["screen_hours"]) / 10) / 2, 0.05, 0.95)
        )
    else:
        raw = burnout_model.decision_function(vector)[0]
        burnout_probability = float(np.clip(1 - (raw + 0.5), 0.05, 0.95))

    risk = _risk_label(predicted, burnout_probability)

    return {
        "user_id": user_id,
        "predicted_mood": round(predicted, 2),
        "stress_risk": risk,
        "recommendation": _recommendation(predicted, engineered),
        "feature_snapshot": {
            **engineered,
            "burnout_probability": round(burnout_probability, 3),
        },
    }
