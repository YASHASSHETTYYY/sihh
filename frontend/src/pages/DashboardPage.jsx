import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../lib/api";
import { useCurrentUser } from "../hooks/useCurrentUser";

const moodLevels = [1, 2, 3, 4, 5];

const DashboardPage = () => {
  const { user, loading: userLoading } = useCurrentUser();

  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [moodForm, setMoodForm] = useState({
    mood_score: 3,
    note: "",
    sleep_hours: 7,
    study_hours: 4,
    screen_hours: 5,
  });
  const [savingMood, setSavingMood] = useState(false);

  const [predictionInput, setPredictionInput] = useState({
    sleep_hours: 7,
    study_hours: 4,
    screen_hours: 5,
    note: "",
  });
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);

  const [chatMessage, setChatMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      role: "assistant",
      content:
        "Hi, I am your context-aware wellness coach. Share how your day is going and I will suggest a practical routine.",
    },
  ]);

  const summary = useMemo(() => {
    if (!moods.length) {
      return { avg: 0, streak: 0 };
    }

    const avg = moods.reduce((sum, item) => sum + item.mood_score, 0) / moods.length;

    const days = new Set(moods.map((item) => new Date(item.created_at).toISOString().slice(0, 10)));
    let streak = 0;
    const now = new Date();
    while (days.has(now.toISOString().slice(0, 10))) {
      streak += 1;
      now.setDate(now.getDate() - 1);
    }

    return { avg: Number(avg.toFixed(2)), streak };
  }, [moods]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let mounted = true;

    async function loadMoods() {
      try {
        setLoading(true);
        const response = await api.get("/moods?limit=90");
        if (mounted) {
          setMoods(response.data.items || []);
          setError("");
        }
      } catch (requestError) {
        if (mounted) {
          setError(requestError.response?.data?.detail || "Could not load moods");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadMoods();
    return () => {
      mounted = false;
    };
  }, [user?.id]);

  const submitMood = async (event) => {
    event.preventDefault();
    try {
      setSavingMood(true);
      const response = await api.post("/moods", {
        mood_score: Number(moodForm.mood_score),
        note: moodForm.note,
        sleep_hours: Number(moodForm.sleep_hours),
        study_hours: Number(moodForm.study_hours),
        screen_hours: Number(moodForm.screen_hours),
      });

      setMoods((prev) => [response.data, ...prev]);
      setMoodForm({ mood_score: 3, note: "", sleep_hours: 7, study_hours: 4, screen_hours: 5 });
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Failed to save mood");
    } finally {
      setSavingMood(false);
    }
  };

  const runPrediction = async (event) => {
    event.preventDefault();
    if (!user?.id) {
      return;
    }

    try {
      setPredicting(true);
      const response = await api.post(`/predict/${user.id}`, {
        sleep_hours: Number(predictionInput.sleep_hours),
        study_hours: Number(predictionInput.study_hours),
        screen_hours: Number(predictionInput.screen_hours),
        note: predictionInput.note,
      });
      setPrediction(response.data);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Prediction failed");
    } finally {
      setPredicting(false);
    }
  };

  const sendChat = async (event) => {
    event.preventDefault();
    const content = chatMessage.trim();
    if (!content) {
      return;
    }

    try {
      setChatLoading(true);
      setChatHistory((prev) => [...prev, { role: "user", content }]);
      setChatMessage("");
      const response = await api.post("/chat", { message: content });
      setChatHistory((prev) => [...prev, { role: "assistant", content: response.data.reply }]);
    } catch (requestError) {
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content: requestError.response?.data?.detail || "Could not connect to coach right now.",
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-card p-6">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        {error && <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}

        <div className="glass-card p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="heading-lg text-gray-900 dark:text-white">Welcome, {user?.full_name || "User"}</h1>
              <p className="body-md text-gray-600 dark:text-gray-400 mt-1">
                Track mood, detect emotions, predict tomorrow, and get coaching.
              </p>
            </div>
            <Link to="/analytics" className="btn-primary text-center">
              Open Intelligence Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
              <p className="body-sm text-gray-500 dark:text-gray-400">Total Logs</p>
              <p className="heading-sm text-gray-900 dark:text-white">{moods.length}</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
              <p className="body-sm text-gray-500 dark:text-gray-400">Average Mood</p>
              <p className="heading-sm text-gray-900 dark:text-white">{summary.avg}/5</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
              <p className="body-sm text-gray-500 dark:text-gray-400">Streak</p>
              <p className="heading-sm text-gray-900 dark:text-white">{summary.streak} days</p>
            </div>
            <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
              <p className="body-sm text-gray-500 dark:text-gray-400">Last Emotion</p>
              <p className="heading-sm text-gray-900 dark:text-white">{moods[0]?.emotion_label || "N/A"}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="heading-sm text-gray-900 dark:text-white mb-4">Log Mood Entry</h2>
            <form className="space-y-3" onSubmit={submitMood}>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="body-sm text-gray-600 dark:text-gray-400">Mood Score</label>
                  <select
                    className="input-field"
                    value={moodForm.mood_score}
                    onChange={(event) => setMoodForm((prev) => ({ ...prev, mood_score: event.target.value }))}
                  >
                    {moodLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}/5
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="body-sm text-gray-600 dark:text-gray-400">Sleep Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    className="input-field"
                    value={moodForm.sleep_hours}
                    onChange={(event) => setMoodForm((prev) => ({ ...prev, sleep_hours: event.target.value }))}
                  />
                </div>
                <div>
                  <label className="body-sm text-gray-600 dark:text-gray-400">Study Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    className="input-field"
                    value={moodForm.study_hours}
                    onChange={(event) => setMoodForm((prev) => ({ ...prev, study_hours: event.target.value }))}
                  />
                </div>
                <div>
                  <label className="body-sm text-gray-600 dark:text-gray-400">Screen Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    className="input-field"
                    value={moodForm.screen_hours}
                    onChange={(event) => setMoodForm((prev) => ({ ...prev, screen_hours: event.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label className="body-sm text-gray-600 dark:text-gray-400">Journal Note</label>
                <textarea
                  rows={3}
                  className="input-field resize-none"
                  value={moodForm.note}
                  onChange={(event) => setMoodForm((prev) => ({ ...prev, note: event.target.value }))}
                  placeholder="How was your day?"
                />
              </div>

              <button className="btn-primary" disabled={savingMood}>
                {savingMood ? "Saving..." : "Save Mood"}
              </button>
            </form>
          </div>

          <div className="glass-card p-6">
            <h2 className="heading-sm text-gray-900 dark:text-white mb-4">Tomorrow Mood Prediction</h2>
            <form className="space-y-3" onSubmit={runPrediction}>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="body-sm text-gray-600 dark:text-gray-400">Sleep</label>
                  <input
                    type="number"
                    step="0.5"
                    className="input-field"
                    value={predictionInput.sleep_hours}
                    onChange={(event) =>
                      setPredictionInput((prev) => ({ ...prev, sleep_hours: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="body-sm text-gray-600 dark:text-gray-400">Study</label>
                  <input
                    type="number"
                    step="0.5"
                    className="input-field"
                    value={predictionInput.study_hours}
                    onChange={(event) =>
                      setPredictionInput((prev) => ({ ...prev, study_hours: event.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="body-sm text-gray-600 dark:text-gray-400">Screen</label>
                  <input
                    type="number"
                    step="0.5"
                    className="input-field"
                    value={predictionInput.screen_hours}
                    onChange={(event) =>
                      setPredictionInput((prev) => ({ ...prev, screen_hours: event.target.value }))
                    }
                  />
                </div>
              </div>

              <textarea
                rows={2}
                className="input-field resize-none"
                value={predictionInput.note}
                onChange={(event) => setPredictionInput((prev) => ({ ...prev, note: event.target.value }))}
                placeholder="Optional context for sentiment"
              />

              <button className="btn-primary" disabled={predicting}>
                {predicting ? "Predicting..." : "Predict Mood"}
              </button>
            </form>

            {prediction && (
              <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 p-4">
                <p className="body-md text-cyan-900">
                  Predicted Mood: <strong>{prediction.predicted_mood}/5</strong>
                </p>
                <p className="body-md text-cyan-900">
                  Stress Risk: <strong>{prediction.stress_risk}</strong>
                </p>
                <p className="body-sm text-cyan-800 mt-2">{prediction.recommendation}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="heading-sm text-gray-900 dark:text-white mb-4">Recent Mood Logs</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {moods.slice(0, 20).map((entry) => (
                <div key={entry.id} className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between gap-2">
                    <p className="body-md text-gray-900 dark:text-white font-medium">Mood {entry.mood_score}/5</p>
                    <span className="text-xs rounded-full px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="body-sm text-gray-600 dark:text-gray-400 mt-1">{entry.note || "No note"}</p>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-cyan-100 text-cyan-700 px-2 py-1">
                      Emotion: {entry.emotion_label || "neutral"}
                    </span>
                    <span className="rounded-full bg-amber-100 text-amber-700 px-2 py-1">
                      Sentiment: {entry.sentiment_label || "neutral"}
                    </span>
                    <span className="rounded-full bg-indigo-100 text-indigo-700 px-2 py-1">
                      Sleep: {entry.sleep_hours}h
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6 flex flex-col">
            <h2 className="heading-sm text-gray-900 dark:text-white mb-4">Context-Aware AI Coach</h2>
            <div className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 space-y-2 max-h-96 overflow-y-auto">
              {chatHistory.map((msg, index) => (
                <div
                  key={`${msg.role}-${index}`}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-cyan-600 text-white ml-8"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 mr-8"
                  }`}
                >
                  {msg.content}
                </div>
              ))}
              {chatLoading && (
                <div className="rounded-lg px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 mr-8">
                  Thinking...
                </div>
              )}
            </div>

            <form className="mt-3 flex gap-2" onSubmit={sendChat}>
              <input
                className="input-field"
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
                placeholder="I feel stressed about exams and sleep..."
              />
              <button className="btn-primary" disabled={chatLoading}>
                Send
              </button>
            </form>
            <p className="body-sm text-gray-500 dark:text-gray-400 mt-3">
              Not medical advice. If you are in immediate danger, contact emergency services.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
