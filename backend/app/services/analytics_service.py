from __future__ import annotations

import numpy as np
import pandas as pd

from app.ml.feature_engineering import build_dataframe


def _compute_streak(df: pd.DataFrame) -> int:
    if df.empty:
        return 0

    days = set(df["created_at"].dt.date.tolist())
    streak = 0
    current = pd.Timestamp.utcnow().date()

    while current in days:
        streak += 1
        current = (pd.Timestamp(current) - pd.Timedelta(days=1)).date()

    return streak


def build_analytics_payload(user_id: str, entries: list[dict]) -> dict:
    df = build_dataframe(entries)
    if df.empty:
        return {
            "user_id": user_id,
            "weekly_trend": [],
            "monthly_trend": [],
            "heatmap": [],
            "correlation_matrix": [[1.0]],
            "correlation_labels": ["mood_score"],
            "insights": ["Add at least 7 mood logs to unlock richer insights."],
            "summary": {
                "average_mood": 0,
                "weekly_average": 0,
                "streak_days": 0,
                "best_day": "N/A",
            },
        }

    weekly_df = (
        df.set_index("created_at")
        .resample("W")["mood_score"]
        .mean()
        .reset_index()
        .tail(12)
    )
    weekly_trend = [
        {"week": row.created_at.strftime("%Y-%m-%d"), "mood": round(float(row.mood_score), 2)}
        for row in weekly_df.itertuples()
    ]

    monthly_df = (
        df.set_index("created_at")
        .resample("ME")["mood_score"]
        .mean()
        .reset_index()
        .tail(12)
    )
    monthly_trend = [
        {"month": row.created_at.strftime("%Y-%m"), "mood": round(float(row.mood_score), 2)}
        for row in monthly_df.itertuples()
    ]

    heatmap_df = df.copy()
    heatmap_df["date"] = heatmap_df["created_at"].dt.strftime("%Y-%m-%d")
    heatmap = [
        {
            "date": row.date,
            "mood": round(float(row.mood_score), 2),
            "emotion": row.get("emotion_label", "neutral"),
        }
        for row in heatmap_df.tail(120).to_dict(orient="records")
    ]

    corr_features = ["mood_score", "sleep_hours", "study_hours", "screen_hours"]
    corr_matrix = df[corr_features].corr().fillna(0).round(3)
    correlation_matrix = corr_matrix.values.tolist()

    insights: list[str] = []

    corr_sleep = float(corr_matrix.loc["mood_score", "sleep_hours"])
    if corr_sleep > 0.25:
        insights.append("Mood rises when sleep improves. Prioritize 7-8 hours for better stability.")

    low_sleep = df[df["sleep_hours"] < 6]
    if not low_sleep.empty:
        low_sleep_avg = float(low_sleep["mood_score"].mean())
        overall_avg = float(df["mood_score"].mean())
        drop_pct = max(((overall_avg - low_sleep_avg) / max(overall_avg, 0.1)) * 100, 0)
        insights.append(f"Mood drops about {drop_pct:.0f}% when sleep is below 6 hours.")

    by_day = df.groupby(df["created_at"].dt.day_name())["mood_score"].mean()
    ordered = by_day.reindex(
        ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    )
    if ordered.dropna().empty:
        best_day = "N/A"
    else:
        best_day = ordered.idxmax()
        insights.append(f"You tend to feel best on {best_day}s.")

    if not insights:
        insights.append("Your mood has been relatively stable. Keep tracking for personalized patterns.")

    last_7_days = df[df["created_at"] >= (pd.Timestamp.utcnow() - pd.Timedelta(days=7))]

    return {
        "user_id": user_id,
        "weekly_trend": weekly_trend,
        "monthly_trend": monthly_trend,
        "heatmap": heatmap,
        "correlation_matrix": correlation_matrix,
        "correlation_labels": corr_features,
        "insights": insights,
        "summary": {
            "average_mood": round(float(df["mood_score"].mean()), 2),
            "weekly_average": round(float(last_7_days["mood_score"].mean()), 2)
            if not last_7_days.empty
            else 0,
            "streak_days": _compute_streak(df),
            "best_day": best_day,
            "total_logs": int(len(df)),
        },
    }
