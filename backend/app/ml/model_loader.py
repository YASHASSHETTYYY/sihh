from __future__ import annotations

from pathlib import Path
from typing import Any

import joblib

from app.core.config import get_settings


_cache: dict[str, Any] = {}


def artifact_path(filename: str) -> Path:
    settings = get_settings()
    return settings.artifact_path / filename


def load_artifact(filename: str) -> Any | None:
    if filename in _cache:
        return _cache[filename]

    path = artifact_path(filename)
    if not path.exists():
        return None

    artifact = joblib.load(path)
    _cache[filename] = artifact
    return artifact
