import React, { useEffect, useState } from "react";
import MoodTrendChart from "../../components/charts/MoodTrendChart";
import HeatmapCalendar from "../../components/charts/HeatmapCalendar";
import CorrelationMatrix from "../../components/charts/CorrelationMatrix";
import api from "../../lib/api";
import { useCurrentUser } from "../../hooks/useCurrentUser";

const AnalyticsPage = () => {
  const { user, loading: userLoading } = useCurrentUser();
  const [analytics, setAnalytics] = useState(null);
  const [behavior, setBehavior] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    let mounted = true;

    async function fetchData() {
      try {
        setLoading(true);
        const [analyticsRes, behaviorRes, recRes] = await Promise.all([
          api.get(`/analytics/${user.id}`),
          api.get(`/behavior/${user.id}`),
          api.get(`/recommendations/${user.id}`),
        ]);

        if (!mounted) {
          return;
        }

        setAnalytics(analyticsRes.data);
        setBehavior(behaviorRes.data);
        setRecommendations(recRes.data.items || []);
        setError("");
      } catch (requestError) {
        if (mounted) {
          setError(requestError.response?.data?.detail || "Failed to load analytics");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      mounted = false;
    };
  }, [user?.id]);

  if (userLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="glass-card p-6">Loading analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        {error && <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}

        <div className="glass-card p-6">
          <h1 className="heading-lg text-gray-900 dark:text-white">Mood Intelligence Dashboard</h1>
          <p className="body-md text-gray-600 dark:text-gray-400 mt-2">
            Interactive trends, behavior detection, and personalized recommendations.
          </p>
          {analytics?.summary && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
              <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                <p className="body-sm text-gray-500 dark:text-gray-400">Average Mood</p>
                <p className="heading-sm text-gray-900 dark:text-white">{analytics.summary.average_mood}/5</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                <p className="body-sm text-gray-500 dark:text-gray-400">7-Day Avg</p>
                <p className="heading-sm text-gray-900 dark:text-white">{analytics.summary.weekly_average}/5</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                <p className="body-sm text-gray-500 dark:text-gray-400">Streak</p>
                <p className="heading-sm text-gray-900 dark:text-white">{analytics.summary.streak_days} days</p>
              </div>
              <div className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                <p className="body-sm text-gray-500 dark:text-gray-400">Best Day</p>
                <p className="heading-sm text-gray-900 dark:text-white">{analytics.summary.best_day}</p>
              </div>
            </div>
          )}
        </div>

        <div className="glass-card p-4">
          <MoodTrendChart
            weeklyTrend={analytics?.weekly_trend || []}
            monthlyTrend={analytics?.monthly_trend || []}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-4">
            <HeatmapCalendar points={analytics?.heatmap || []} />
          </div>
          <div className="glass-card p-4">
            <CorrelationMatrix
              matrix={analytics?.correlation_matrix || [[1]]}
              labels={analytics?.correlation_labels || ["mood_score"]}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="heading-sm text-gray-900 dark:text-white mb-4">AI Insights</h2>
            <ul className="space-y-2">
              {(analytics?.insights || []).map((insight) => (
                <li key={insight} className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700">
                  <p className="body-md text-gray-700 dark:text-gray-300">{insight}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6">
            <h2 className="heading-sm text-gray-900 dark:text-white mb-4">Behavior & Burnout Risk</h2>
            {behavior ? (
              <div className="space-y-3">
                <p className="body-md text-gray-700 dark:text-gray-300">
                  Cluster: <strong>{behavior.cluster_label}</strong>
                </p>
                <p className="body-md text-gray-700 dark:text-gray-300">
                  Burnout Risk: <strong>{Math.round((behavior.burnout_risk || 0) * 100)}%</strong>
                </p>
                <ul className="space-y-2">
                  {(behavior.detected_rules || []).map((rule) => (
                    <li key={rule} className="rounded-lg bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 body-sm text-gray-700 dark:text-gray-300">
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="body-md text-gray-600 dark:text-gray-400">No behavior data available yet.</p>
            )}
          </div>
        </div>

        <div className="glass-card p-6">
          <h2 className="heading-sm text-gray-900 dark:text-white mb-4">Recommendation Engine</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {recommendations.length === 0 ? (
              <p className="body-md text-gray-600 dark:text-gray-400">No recommendations yet.</p>
            ) : (
              recommendations.map((item) => (
                <div key={item.title} className="rounded-xl bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700">
                  <p className="heading-sm text-gray-900 dark:text-white">{item.title}</p>
                  <p className="body-sm text-cyan-700 dark:text-cyan-400 mt-1">Impact: {item.impact}</p>
                  <p className="body-sm text-gray-600 dark:text-gray-400 mt-2">{item.reason}</p>
                </div>
              ))
            )}
          </div>
        </div>

        <p className="body-sm text-gray-500 dark:text-gray-400 text-center">
          Disclaimer: This platform provides wellness support insights and is not medical advice.
        </p>
      </div>
    </div>
  );
};

export default AnalyticsPage;
