from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd


def generate_synthetic_dataset(n_samples: int = 10_000, seed: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(seed)

    sleep_hours = np.clip(rng.normal(6.8, 1.6, n_samples), 2, 10)
    study_hours = np.clip(rng.normal(5.2, 2.3, n_samples), 0, 14)
    screen_hours = np.clip(rng.normal(6.0, 2.7, n_samples), 1, 16)
    day_of_week = rng.integers(0, 7, n_samples)
    is_weekend = (day_of_week >= 5).astype(float)
    sentiment_score = np.clip(rng.normal(0, 0.8, n_samples), -2, 2)

    baseline = 3.2
    mood_continuous = (
        baseline
        + (sleep_hours - 7) * 0.28
        - np.maximum(study_hours - 8, 0) * 0.12
        - np.maximum(screen_hours - 9, 0) * 0.07
        + sentiment_score * 0.35
        + is_weekend * 0.2
        + rng.normal(0, 0.35, n_samples)
    )

    mood_score = np.clip(mood_continuous, 1.0, 5.0)
    rolling_mood_3 = np.clip(mood_score + rng.normal(0, 0.2, n_samples), 1.0, 5.0)
    rolling_sleep_3 = np.clip(sleep_hours + rng.normal(0, 0.6, n_samples), 2.0, 10.0)

    stress_score = (
        (study_hours / 12) * 0.4
        + (screen_hours / 12) * 0.3
        + np.maximum(0, 6 - sleep_hours) / 6 * 0.3
    )
    burnout_label = (stress_score + rng.normal(0, 0.08, n_samples) > 0.62).astype(int)

    frame = pd.DataFrame(
        {
            "mood_score": mood_score,
            "rolling_mood_3": rolling_mood_3,
            "rolling_sleep_3": rolling_sleep_3,
            "sleep_hours": sleep_hours,
            "study_hours": study_hours,
            "screen_hours": screen_hours,
            "day_of_week": day_of_week,
            "is_weekend": is_weekend,
            "sentiment_score": sentiment_score,
            "burnout_label": burnout_label,
        }
    )

    return frame


if __name__ == "__main__":
    out_path = Path("backend/app/ml/artifacts/synthetic_mood_data.csv")
    out_path.parent.mkdir(parents=True, exist_ok=True)
    df = generate_synthetic_dataset()
    df.to_csv(out_path, index=False)
    print(f"Saved synthetic dataset to {out_path} with {len(df)} rows")
