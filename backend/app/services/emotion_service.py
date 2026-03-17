from __future__ import annotations

from functools import lru_cache
from typing import Any

from app.core.config import get_settings


POSITIVE_WORDS = {
    "happy",
    "great",
    "excited",
    "calm",
    "good",
    "joy",
    "relaxed",
    "hopeful",
}
NEGATIVE_WORDS = {
    "stress",
    "stressed",
    "anxious",
    "sad",
    "depressed",
    "panic",
    "lonely",
    "overwhelmed",
    "burnout",
    "tired",
}


@lru_cache(maxsize=1)
def get_emotion_pipeline() -> Any | None:
    settings = get_settings()
    try:
        from transformers import pipeline

        return pipeline("text-classification", model=settings.hf_emotion_model, top_k=1)
    except Exception:
        return None


def _lexicon_fallback(text: str) -> dict[str, Any]:
    tokens = {token.strip(".,!?;:").lower() for token in text.split()}
    positive_hits = len(tokens & POSITIVE_WORDS)
    negative_hits = len(tokens & NEGATIVE_WORDS)

    if negative_hits > positive_hits:
        label = "stress"
        sentiment = "negative"
        confidence = min(0.55 + negative_hits * 0.08, 0.95)
    elif positive_hits > negative_hits:
        label = "joy"
        sentiment = "positive"
        confidence = min(0.55 + positive_hits * 0.08, 0.95)
    else:
        label = "neutral"
        sentiment = "neutral"
        confidence = 0.6

    return {
        "emotion_label": label,
        "emotion_confidence": round(float(confidence), 3),
        "sentiment_label": sentiment,
        "sentiment_confidence": round(float(confidence), 3),
        "sentiment_score": round(float(positive_hits - negative_hits) / 4.0, 3),
    }


def analyze_text_emotion(text: str) -> dict[str, Any]:
    clean_text = (text or "").strip()
    if not clean_text:
        return {
            "emotion_label": "neutral",
            "emotion_confidence": 0.5,
            "sentiment_label": "neutral",
            "sentiment_confidence": 0.5,
            "sentiment_score": 0.0,
        }

    model = get_emotion_pipeline()
    if model is None:
        return _lexicon_fallback(clean_text)

    try:
        result = model(clean_text)
        top = result[0][0] if isinstance(result[0], list) else result[0]
        label = str(top.get("label", "neutral")).lower()
        confidence = float(top.get("score", 0.5))

        if label in {"joy", "love", "surprise"}:
            sentiment = "positive"
            sentiment_score = confidence
        elif label in {"anger", "fear", "sadness", "stress", "anxiety"}:
            sentiment = "negative"
            sentiment_score = -confidence
        else:
            sentiment = "neutral"
            sentiment_score = 0.0

        return {
            "emotion_label": label,
            "emotion_confidence": round(confidence, 3),
            "sentiment_label": sentiment,
            "sentiment_confidence": round(confidence, 3),
            "sentiment_score": round(float(sentiment_score), 3),
        }
    except Exception:
        return _lexicon_fallback(clean_text)
