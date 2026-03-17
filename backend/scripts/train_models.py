from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.ensemble import IsolationForest, RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error

from generate_synthetic_data import generate_synthetic_dataset


ARTIFACT_DIR = Path("backend/app/ml/artifacts")


def train() -> None:
    ARTIFACT_DIR.mkdir(parents=True, exist_ok=True)

    data = generate_synthetic_dataset(n_samples=10_000)
    data.to_csv(ARTIFACT_DIR / "synthetic_mood_data.csv", index=False)

    feature_cols = [
        "mood_score",
        "rolling_mood_3",
        "rolling_sleep_3",
        "sleep_hours",
        "study_hours",
        "screen_hours",
        "day_of_week",
        "is_weekend",
        "sentiment_score",
    ]

    X = data[feature_cols]
    y = data["mood_score"].shift(-1).fillna(data["mood_score"])

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    regressor = RandomForestRegressor(
        n_estimators=350,
        max_depth=12,
        random_state=42,
        n_jobs=1,
    )
    regressor.fit(X_train, y_train)
    predictions = regressor.predict(X_test)
    mae = mean_absolute_error(y_test, predictions)

    joblib.dump(regressor, ARTIFACT_DIR / "mood_regressor.joblib")

    kmeans_features = data[["mood_score", "sleep_hours", "study_hours", "screen_hours", "rolling_mood_3"]]
    kmeans = KMeans(n_clusters=4, random_state=42, n_init="auto")
    kmeans.fit(kmeans_features)
    joblib.dump(kmeans, ARTIFACT_DIR / "user_cluster_kmeans.joblib")

    iso = IsolationForest(contamination=0.2, random_state=42)
    iso.fit(X)
    joblib.dump(iso, ARTIFACT_DIR / "burnout_isolation_forest.joblib")

    collab = pd.DataFrame(
        {
            "sleep_hours": np.random.uniform(4, 9, 1200),
            "study_hours": np.random.uniform(1, 12, 1200),
            "screen_hours": np.random.uniform(2, 13, 1200),
            "intervention": np.random.choice(
                [
                    "10-minute mindful walk",
                    "Breathing break every 2 hours",
                    "Sleep wind-down routine",
                    "Pomodoro 50/10 study cycles",
                    "Evening social check-in",
                ],
                size=1200,
            ),
            "mood_gain": np.random.uniform(0.15, 1.25, 1200),
        }
    )
    collab.to_csv(ARTIFACT_DIR / "collab_signals.csv", index=False)

    print(f"Training complete. Mood prediction MAE: {mae:.4f}")


if __name__ == "__main__":
    train()
