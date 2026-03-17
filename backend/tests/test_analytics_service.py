from app.services.analytics_service import build_analytics_payload


def test_analytics_payload_handles_empty_entries():
    payload = build_analytics_payload("user-1", [])
    assert payload["user_id"] == "user-1"
    assert payload["summary"]["average_mood"] == 0
    assert isinstance(payload["insights"], list)
