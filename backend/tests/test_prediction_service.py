from app.services.prediction_service import predict_next_mood


def test_prediction_response_shape():
    result = predict_next_mood(
        user_id="user-1",
        entries=[],
        request_features={"sleep_hours": 5.5, "study_hours": 9.0, "screen_hours": 8.5, "sentiment_score": -0.6},
    )

    assert result["user_id"] == "user-1"
    assert 1 <= result["predicted_mood"] <= 5
    assert result["stress_risk"] in {"LOW", "MEDIUM", "HIGH"}
    assert "recommendation" in result
