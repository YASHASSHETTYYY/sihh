from __future__ import annotations

from datetime import datetime
from pathlib import Path

import pandas as pd


def generate_weekly_report_csv(input_csv: str, output_csv: str) -> None:
    df = pd.read_csv(input_csv)
    if df.empty:
        raise ValueError("Input dataset is empty")

    report = {
        "generated_at": datetime.utcnow().isoformat(),
        "records": len(df),
        "avg_mood": round(float(df["mood_score"].mean()), 3),
        "avg_sleep": round(float(df["sleep_hours"].mean()), 3),
        "avg_study": round(float(df["study_hours"].mean()), 3),
        "avg_screen": round(float(df["screen_hours"].mean()), 3),
    }

    pd.DataFrame([report]).to_csv(output_csv, index=False)


if __name__ == "__main__":
    source = Path("backend/app/ml/artifacts/synthetic_mood_data.csv")
    target = Path("backend/app/ml/artifacts/weekly_report.csv")
    generate_weekly_report_csv(str(source), str(target))
    print(f"Weekly report generated: {target}")
