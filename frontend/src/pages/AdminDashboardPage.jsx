import React, { useEffect, useState } from "react";
import api from "../lib/api";

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function fetchAdminData() {
      try {
        const [usersRes, distRes] = await Promise.all([
          api.get("/admin/users"),
          api.get("/admin/mood-distribution"),
        ]);

        if (!mounted) {
          return;
        }

        setUsers(usersRes.data.items || []);
        setDistribution(distRes.data.distribution || []);
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError.response?.data?.detail ||
              "Admin access required. Promote your user role to admin in MongoDB to view this panel."
          );
        }
      }
    }

    fetchAdminData();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-6xl space-y-6">
        <div className="glass-card p-6">
          <h1 className="heading-lg text-gray-900 dark:text-white">Admin Intelligence Panel</h1>
          <p className="body-md text-gray-600 dark:text-gray-400 mt-2">
            User segmentation, mood distribution, and platform health overview.
          </p>
        </div>

        {error && <div className="rounded-lg border border-red-300 bg-red-50 p-3 text-red-700">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-4">
            <p className="body-sm text-gray-500 dark:text-gray-400">Registered Users</p>
            <p className="heading-md text-gray-900 dark:text-white">{users.length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="body-sm text-gray-500 dark:text-gray-400">Mood Buckets</p>
            <p className="heading-md text-gray-900 dark:text-white">{distribution.length}</p>
          </div>
          <div className="glass-card p-4">
            <p className="body-sm text-gray-500 dark:text-gray-400">Status</p>
            <p className="heading-md text-emerald-600">Operational</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-card p-6">
            <h2 className="heading-sm text-gray-900 dark:text-white mb-4">Recent Users</h2>
            <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
              {users.slice(0, 20).map((user) => (
                <div key={user._id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
                  <p className="body-md text-gray-900 dark:text-white">{user.full_name}</p>
                  <p className="body-sm text-gray-600 dark:text-gray-400">{user.email}</p>
                  <p className="body-sm text-gray-500 dark:text-gray-500">Role: {user.role || "user"}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-6">
            <h2 className="heading-sm text-gray-900 dark:text-white mb-4">Mood Distribution</h2>
            <div className="space-y-2">
              {distribution.map((item) => (
                <div key={item.mood_score} className="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2">
                  <p className="body-md text-gray-900 dark:text-white">Mood {item.mood_score}</p>
                  <p className="body-md text-gray-600 dark:text-gray-400">{item.count} logs</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
