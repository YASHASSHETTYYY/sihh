from __future__ import annotations

from typing import Any

import pandas as pd

from app.core.config import get_settings


def get_recommendations_for_user(user_id: str, user_features: dict[str, Any]) -> dict[str, Any]:
    settings = get_settings()
    csv_path = settings.artifact_path / "collab_signals.csv"

    if not csv_path.exists():
        return {
            "user_id": user_id,
            "items": [
                {
                    "title": "10-minute mindful walk",
                    "impact": "Medium",
                    "reason": "Users with similar stress and screen patterns reported better mood after short walks.",
                },
                {
                    "title": "Sleep wind-down routine",
                    "impact": "High",
                    "reason": "Low sleep is your highest impact feature and strongly affects next-day mood.",
                },
            ],
        }

    frame = pd.read_csv(csv_path)
    if frame.empty:
        return {"user_id": user_id, "items": []}

    target_sleep = float(user_features.get("sleep_hours", 7))
    target_study = float(user_features.get("study_hours", 3))
    target_screen = float(user_features.get("screen_hours", 4))

    frame["distance"] = (
        (frame["sleep_hours"] - target_sleep).abs()
        + (frame["study_hours"] - target_study).abs()
        + (frame["screen_hours"] - target_screen).abs()
    )

    nearest = frame.sort_values("distance").head(5)
    grouped = (
        nearest.groupby("intervention", as_index=False)["mood_gain"]
        .mean()
        .sort_values("mood_gain", ascending=False)
        .head(3)
    )

    items = [
        {
            "title": row["intervention"],
            "impact": "High" if row["mood_gain"] > 0.7 else "Medium",
            "reason": f"Users with similar behavior improved mood by {row['mood_gain']:.2f} points.",
        }
        for _, row in grouped.iterrows()
    ]

    return {"user_id": user_id, "items": items}
