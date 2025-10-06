import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
  const [user] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: 'https://i.pravatar.cc/150?img=1',
    joinDate: '2024-01-15'
  });

  const [moodData] = useState([
    { date: '2024-01-20', mood: 4, note: 'Feeling great today!' },
    { date: '2024-01-19', mood: 3, note: 'Good day overall' },
    { date: '2024-01-18', mood: 2, note: 'Bit stressed with exams' },
    { date: '2024-01-17', mood: 4, note: 'Productive day' },
    { date: '2024-01-16', mood: 3, note: 'Normal day' },
  ]);

  const [stats] = useState({
    totalSessions: 24,
    streakDays: 7,
    articlesRead: 12,
    forumPosts: 8
  });

  const [recentActivities] = useState([
    { type: 'mood', text: 'Logged mood: Happy', time: '2 hours ago' },
    { type: 'article', text: 'Read "Managing Anxiety"', time: '1 day ago' },
    { type: 'forum', text: 'Posted in Study Tips forum', time: '2 days ago' },
    { type: 'session', text: 'Completed meditation session', time: '3 days ago' },
  ]);

  const [quickActions] = useState([
    { title: 'Log Mood', icon: '😊', color: 'bg-blue-500', description: 'Track your daily mood' },
    { title: 'Chat Support', icon: '💬', color: 'bg-green-500', description: '24/7 AI assistance' },
    { title: 'Read Articles', icon: '📚', color: 'bg-purple-500', description: 'Expert resources' },
    { title: 'Join Forum', icon: '👥', color: 'bg-orange-500', description: 'Community support' },
    { title: 'Meditation', icon: '🧘', color: 'bg-pink-500', description: 'Guided sessions' },
    { title: 'Goals', icon: '🎯', color: 'bg-indigo-500', description: 'Set wellness goals' },
  ]);

  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const getMoodEmoji = (mood) => {
    const emojis = ['😢', '😕', '😐', '😊', '😄'];
    return emojis[mood - 1] || '😐';
  };

  const getMoodColor = (mood) => {
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500'];
    return colors[mood - 1] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div 
          id="welcome-header"
          data-animate
          className={`mb-8 ${isVisible['welcome-header'] ? 'animate-slide-up' : 'opacity-0'}`}
        >
          <div className="glass-card p-6 gradient-primary text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h1 className="heading-lg mb-2">Welcome back, {user.name}! 👋</h1>
                <p className="body-lg opacity-90">Ready to continue your wellness journey?</p>
              </div>
              <div className="hidden md:block">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-4 border-white/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div 
          id="stats-grid"
          data-animate
          className={`grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 ${isVisible['stats-grid'] ? 'animate-slide-up' : 'opacity-0'}`}
          style={{ animationDelay: '0.1s' }}
        >
          <div className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="body-sm text-gray-600 dark:text-gray-400">Total Sessions</p>
                <p className="heading-md text-gray-900 dark:text-white">{stats.totalSessions}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📊</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="body-sm text-gray-600 dark:text-gray-400">Streak Days</p>
                <p className="heading-md text-gray-900 dark:text-white">{stats.streakDays}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="body-sm text-gray-600 dark:text-gray-400">Articles Read</p>
                <p className="heading-md text-gray-900 dark:text-white">{stats.articlesRead}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 hover-lift">
            <div className="flex items-center justify-between">
              <div>
                <p className="body-sm text-gray-600 dark:text-gray-400">Forum Posts</p>
                <p className="heading-md text-gray-900 dark:text-white">{stats.forumPosts}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center">
                <span className="text-2xl">💬</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div 
              id="quick-actions"
              data-animate
              className={`glass-card p-6 mb-8 ${isVisible['quick-actions'] ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.2s' }}
            >
              <h2 className="heading-md text-gray-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all duration-300 hover-lift group"
                  >
                    <div className={`w-12 h-12 ${action.color} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl">{action.icon}</span>
                    </div>
                    <h3 className="heading-sm text-gray-900 dark:text-white mb-1">{action.title}</h3>
                    <p className="body-sm text-gray-600 dark:text-gray-400">{action.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Tracking */}
            <div 
              id="mood-tracking"
              data-animate
              className={`glass-card p-6 ${isVisible['mood-tracking'] ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-md text-gray-900 dark:text-white">Recent Mood Tracking</h2>
                <Link to="/mood" className="btn-secondary text-sm px-4 py-2">
                  View All
                </Link>
              </div>
              <div className="space-y-4">
                {moodData.slice(0, 3).map((entry, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className={`w-12 h-12 ${getMoodColor(entry.mood)} rounded-full flex items-center justify-center text-white text-xl`}>
                      {getMoodEmoji(entry.mood)}
                    </div>
                    <div className="flex-1">
                      <p className="body-md text-gray-900 dark:text-white font-medium">{entry.note}</p>
                      <p className="body-sm text-gray-600 dark:text-gray-400">{entry.date}</p>
                    </div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= entry.mood ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <div 
              id="recent-activity"
              data-animate
              className={`glass-card p-6 ${isVisible['recent-activity'] ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.4s' }}
            >
              <h2 className="heading-md text-gray-900 dark:text-white mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      activity.type === 'mood' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                      activity.type === 'article' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                      activity.type === 'forum' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600' :
                      'bg-green-100 dark:bg-green-900/30 text-green-600'
                    }`}>
                      {activity.type === 'mood' ? '😊' :
                       activity.type === 'article' ? '📚' :
                       activity.type === 'forum' ? '💬' : '🧘'}
                    </div>
                    <div className="flex-1">
                      <p className="body-sm text-gray-900 dark:text-white">{activity.text}</p>
                      <p className="body-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Wellness Tip */}
            <div 
              id="wellness-tip"
              data-animate
              className={`glass-card p-6 gradient-secondary text-white ${isVisible['wellness-tip'] ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.5s' }}
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">💡</span>
                <h3 className="heading-sm">Daily Wellness Tip</h3>
              </div>
              <p className="body-md opacity-90 mb-4">
                Take 5 minutes today to practice deep breathing. Inhale for 4 counts, hold for 4, exhale for 6. This simple technique can help reduce stress and improve focus.
              </p>
              <button className="btn-secondary bg-white/20 border-white/30 text-white hover:bg-white hover:text-purple-600 text-sm px-4 py-2">
                Try Now
              </button>
            </div>

            {/* Progress Chart */}
            <div 
              id="progress-chart"
              data-animate
              className={`glass-card p-6 ${isVisible['progress-chart'] ? 'animate-slide-up' : 'opacity-0'}`}
              style={{ animationDelay: '0.6s' }}
            >
              <h3 className="heading-sm text-gray-900 dark:text-white mb-4">Weekly Progress</h3>
              <div className="space-y-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                  <div key={day} className="flex items-center space-x-3">
                    <span className="body-sm text-gray-600 dark:text-gray-400 w-8">{day}</span>
                    <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-primary h-2 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${Math.random() * 100}%`,
                          animationDelay: `${index * 0.1}s`
                        }}
                      />
                    </div>
                    <span className="body-sm text-gray-600 dark:text-gray-400">
                      {Math.floor(Math.random() * 60 + 20)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;