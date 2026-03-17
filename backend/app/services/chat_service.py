from __future__ import annotations

from typing import Any

from app.core.config import get_settings


SAFETY_NOTICE = (
    "I am a wellness support coach, not a medical professional. "
    "If you are in immediate danger, contact local emergency services right now."
)


def build_context_summary(user: dict[str, Any], analytics: dict[str, Any], behavior: dict[str, Any]) -> dict[str, Any]:
    return {
        "name": user.get("full_name"),
        "avg_mood": analytics.get("summary", {}).get("average_mood", 0),
        "weekly_avg": analytics.get("summary", {}).get("weekly_average", 0),
        "best_day": analytics.get("summary", {}).get("best_day", "N/A"),
        "cluster": behavior.get("cluster_label", "Unknown"),
        "burnout_risk": behavior.get("burnout_risk", 0),
        "insights": analytics.get("insights", [])[:2],
    }


def _fallback_coach_reply(message: str, context: dict[str, Any]) -> str:
    avg = context.get("avg_mood", 0)
    risk = float(context.get("burnout_risk", 0))

    if risk > 0.7 or avg < 2.7:
        return (
            f"{SAFETY_NOTICE}\n\n"
            "Your recent pattern suggests elevated stress. Try this 10-minute reset: "
            "2 minutes breathing, 5 minutes walk/stretch, 3 minutes planning the next small task. "
            "Keep study sessions to 50/10 cycles today."
        )

    return (
        f"{SAFETY_NOTICE}\n\n"
        "You are making progress by checking in. For today, pick one grounding action: "
        "a short walk, hydration, and a realistic 3-task plan. "
        "If you want, I can turn your day into a step-by-step routine."
    )


async def generate_contextual_reply(message: str, context: dict[str, Any]) -> str:
    settings = get_settings()
    if not settings.gemini_api_key:
        return _fallback_coach_reply(message, context)

    try:
        from google.generativeai import GenerativeModel, configure

        configure(api_key=settings.gemini_api_key)
        model = GenerativeModel(settings.gemini_model)

        prompt = (
            "You are a CBT-based wellness coach. "
            "Never diagnose, never give medical claims, keep advice practical and short.\n"
            f"User context: {context}\n"
            f"User message: {message}\n"
            "Provide: (1) empathy line, (2) 10-minute routine, (3) one boundary suggestion."
        )

        response = model.generate_content(prompt)
        text = getattr(response, "text", None)
        if text:
            return f"{SAFETY_NOTICE}\n\n{text.strip()}"
        return _fallback_coach_reply(message, context)
    except Exception:
        return _fallback_coach_reply(message, context)
