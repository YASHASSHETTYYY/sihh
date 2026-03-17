import React, { useEffect, useMemo, useState } from "react";
import api from "../lib/api";

const moodOptions = [
  { value: 1, label: "Very Low" },
  { value: 2, label: "Low" },
  { value: 3, label: "Okay" },
  { value: 4, label: "Good" },
  { value: 5, label: "Great" },
];

const MoodPage = () => {
  const [moods, setMoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({ mood_score: 3, note: "", sleep_hours: 7, study_hours: 4, screen_hours: 5 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const average = useMemo(() => {
    if (!moods.length) return 0;
    return Math.round((moods.reduce((sum, item) => sum + item.mood_score, 0) / moods.length) * 100) / 100;
  }, [moods]);

  async function loadMoods() {
    try {
      setIsLoading(true);
      const response = await api.get("/moods?limit=120");
      setMoods(response.data.items || []);
      setError("");
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Could not load mood logs");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadMoods();
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setSaving(true);
      await api.post("/moods", {
        mood_score: Number(form.mood_score),
        note: form.note,
        sleep_hours: Number(form.sleep_hours),
        study_hours: Number(form.study_hours),
        screen_hours: Number(form.screen_hours),
      });
      setForm({ mood_score: 3, note: "", sleep_hours: 7, study_hours: 4, screen_hours: 5 });
      await loadMoods();
    } catch (requestError) {
      setError(requestError.response?.data?.detail || "Could not save mood entry");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
        <div className="glass-card p-6 mb-6">
          <h1 className="heading-lg text-gray-900 dark:text-white mb-2">Mood Tracker</h1>
          <p className="body-md text-gray-600 dark:text-gray-400">
            Track score, sleep, study, and screen habits to power mood analytics.
          </p>
          <p className="body-md text-gray-700 dark:text-gray-300 mt-3">
            Average mood score: <strong>{average || "N/A"}</strong>
          </p>
        </div>

        <div className="glass-card p-6 mb-6">
          <h2 className="heading-sm text-gray-900 dark:text-white mb-4">Add New Entry</h2>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
            <div>
              <label className="block body-sm text-gray-700 dark:text-gray-300 mb-2">Mood</label>
              <select
                value={form.mood_score}
                onChange={(event) => setForm({ ...form, mood_score: event.target.value })}
                className="input-field"
              >
                {moodOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.value} - {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block body-sm text-gray-700 dark:text-gray-300 mb-2">Sleep Hours</label>
              <input
                type="number"
                step="0.5"
                value={form.sleep_hours}
                onChange={(event) => setForm({ ...form, sleep_hours: event.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block body-sm text-gray-700 dark:text-gray-300 mb-2">Study Hours</label>
              <input
                type="number"
                step="0.5"
                value={form.study_hours}
                onChange={(event) => setForm({ ...form, study_hours: event.target.value })}
                className="input-field"
              />
            </div>
            <div>
              <label className="block body-sm text-gray-700 dark:text-gray-300 mb-2">Screen Hours</label>
              <input
                type="number"
                step="0.5"
                value={form.screen_hours}
                onChange={(event) => setForm({ ...form, screen_hours: event.target.value })}
                className="input-field"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block body-sm text-gray-700 dark:text-gray-300 mb-2">Note</label>
              <textarea
                value={form.note}
                onChange={(event) => setForm({ ...form, note: event.target.value })}
                rows={3}
                className="input-field resize-none"
                placeholder="What influenced your mood today?"
              />
            </div>
            <button disabled={saving} className="btn-primary md:col-span-2">
              {saving ? "Saving..." : "Save Mood"}
            </button>
          </form>
        </div>

        <div className="glass-card p-6">
          <h2 className="heading-sm text-gray-900 dark:text-white mb-4">Recent Entries</h2>
          {error && <p className="text-red-500 body-sm mb-4">{error}</p>}
          {isLoading ? (
            <p className="body-md text-gray-600 dark:text-gray-400">Loading...</p>
          ) : moods.length === 0 ? (
            <p className="body-md text-gray-600 dark:text-gray-400">No entries yet.</p>
          ) : (
            <div className="space-y-3">
              {moods.map((entry) => (
                <div
                  key={entry.id}
                  className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                >
                  <p className="body-md text-gray-900 dark:text-white font-medium">
                    Mood: {entry.mood_score}/5 | Emotion: {entry.emotion_label || "neutral"}
                  </p>
                  <p className="body-sm text-gray-600 dark:text-gray-400">{entry.note || "No note"}</p>
                  <p className="body-sm text-gray-500 dark:text-gray-500 mt-1">
                    Sleep {entry.sleep_hours}h | Study {entry.study_hours}h | Screen {entry.screen_hours}h
                  </p>
                  <p className="body-sm text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodPage;
