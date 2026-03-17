from __future__ import annotations

from datetime import datetime
from typing import Any

import numpy as np
import pandas as pd


def safe_float(value: Any, default: float = 0.0) -> float:
    try:
        return float(value)
    except (TypeError, ValueError):
        return default


def build_dataframe(entries: list[dict[str, Any]]) -> pd.DataFrame:
    if not entries:
        return pd.DataFrame(
            columns=[
                "created_at",
                "mood_score",
                "sleep_hours",
                "study_hours",
                "screen_hours",
                "note",
                "sentiment_score",
            ]
        )

    rows = []
    for row in entries:
        created_at = row.get("created_at")
        if isinstance(created_at, datetime):
            dt = created_at
        else:
            dt = pd.to_datetime(created_at, utc=True, errors="coerce")
        rows.append(
            {
                "created_at": dt,
                "mood_score": safe_float(row.get("mood_score"), 3.0),
                "sleep_hours": safe_float(row.get("sleep_hours"), 7.0),
                "study_hours": safe_float(row.get("study_hours"), 3.0),
                "screen_hours": safe_float(row.get("screen_hours"), 4.0),
                "note": str(row.get("note") or ""),
                "sentiment_score": safe_float(row.get("sentiment_score"), 0.0),
            }
        )

    df = pd.DataFrame(rows)
    df = df.dropna(subset=["created_at"])
    if df.empty:
        return df

    df = df.sort_values("created_at").reset_index(drop=True)
    df["day_of_week"] = df["created_at"].dt.dayofweek
    df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)
    df["rolling_mood_3"] = df["mood_score"].rolling(3, min_periods=1).mean()
    df["rolling_sleep_3"] = df["sleep_hours"].rolling(3, min_periods=1).mean()

    return df


def latest_feature_vector(df: pd.DataFrame, current_input: dict[str, Any]) -> np.ndarray:
    if df.empty:
        baseline = {
            "mood_score": 3.0,
            "rolling_mood_3": 3.0,
            "rolling_sleep_3": 7.0,
            "sleep_hours": 7.0,
            "study_hours": 3.0,
            "screen_hours": 4.0,
            "day_of_week": datetime.utcnow().weekday(),
            "is_weekend": int(datetime.utcnow().weekday() >= 5),
            "sentiment_score": 0.0,
        }
    else:
        latest = df.iloc[-1]
        baseline = {
            "mood_score": float(latest["mood_score"]),
            "rolling_mood_3": float(latest["rolling_mood_3"]),
            "rolling_sleep_3": float(latest["rolling_sleep_3"]),
            "sleep_hours": float(latest["sleep_hours"]),
            "study_hours": float(latest["study_hours"]),
            "screen_hours": float(latest["screen_hours"]),
            "day_of_week": float(datetime.utcnow().weekday()),
            "is_weekend": float(datetime.utcnow().weekday() >= 5),
            "sentiment_score": float(latest.get("sentiment_score", 0.0)),
        }

    merged = {**baseline, **current_input}
    ordered_features = [
        merged["mood_score"],
        merged["rolling_mood_3"],
        merged["rolling_sleep_3"],
        merged["sleep_hours"],
        merged["study_hours"],
        merged["screen_hours"],
        merged["day_of_week"],
        merged["is_weekend"],
        merged["sentiment_score"],
    ]
    return np.array(ordered_features, dtype=float).reshape(1, -1)
