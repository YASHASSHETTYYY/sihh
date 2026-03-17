from __future__ import annotations

from typing import Any

import numpy as np

from app.ml.feature_engineering import build_dataframe
from app.ml.model_loader import load_artifact


CLUSTER_LABELS = {
    0: "Balanced Routine",
    1: "Stressed Student",
    2: "Sleep Deprived",
    3: "High Screen Load",
}


def detect_behavior_patterns(user_id: str, entries: list[dict]) -> dict[str, Any]:
    df = build_dataframe(entries)
    if df.empty:
        return {
            "user_id": user_id,
            "detected_rules": ["Not enough data for behavior analysis yet."],
            "cluster_id": 0,
            "cluster_label": CLUSTER_LABELS[0],
            "burnout_risk": 0.2,
        }

    latest = df.iloc[-1]
    features = np.array(
        [
            [
                float(latest["mood_score"]),
                float(latest["sleep_hours"]),
                float(latest["study_hours"]),
                float(latest["screen_hours"]),
                float(latest["rolling_mood_3"]),
            ]
        ]
    )

    detected_rules: list[str] = []
    if float(latest["study_hours"]) > 8 and float(latest["sleep_hours"]) < 5:
        detected_rules.append("Study >8h and sleep <5h often leads to next-day mood drop.")
    if float(latest["screen_hours"]) > 9:
        detected_rules.append("High screen exposure appears linked with lower evening mood.")
    if float(df["mood_score"].tail(3).mean()) < 2.8:
        detected_rules.append("Recent 3-day mood average indicates elevated stress period.")
    if not detected_rules:
        detected_rules.append("No high-risk rule triggered this week. Keep consistent routines.")

    kmeans = load_artifact("user_cluster_kmeans.joblib")
    iso_model = load_artifact("burnout_isolation_forest.joblib")

    if kmeans is None:
        cluster_id = int(np.clip(round(float(latest["study_hours"]) / 3), 0, 3))
    else:
        cluster_id = int(kmeans.predict(features)[0])

    if iso_model is None:
        burnout_risk = float(
            np.clip((float(latest["study_hours"]) + float(latest["screen_hours"])) / 20, 0.05, 0.95)
        )
    else:
        score = float(iso_model.decision_function(features)[0])
        burnout_risk = float(np.clip(1 - (score + 0.5), 0.05, 0.95))

    return {
        "user_id": user_id,
        "detected_rules": detected_rules,
        "cluster_id": cluster_id,
        "cluster_label": CLUSTER_LABELS.get(cluster_id, "Emerging Pattern"),
        "burnout_risk": round(burnout_risk, 3),
    }
