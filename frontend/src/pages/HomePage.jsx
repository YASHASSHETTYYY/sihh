import React from "react";
import { Link } from "react-router-dom";

const highlights = [
  {
    title: "Daily Mood Tracking",
    description: "Capture how you feel each day and spot patterns over time.",
  },
  {
    title: "AI Support Chat",
    description: "Talk through stress, routines, and goals with a calm assistant.",
  },
  {
    title: "Progress Insights",
    description: "See your streaks, averages, and weekly emotional trends.",
  },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="relative overflow-hidden gradient-hero text-white pt-36 pb-24">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <p className="uppercase tracking-widest text-cyan-200 body-sm mb-4">EchoWell Mental Wellness</p>
            <h1 className="heading-xl mb-6">Build steadier days with mindful support.</h1>
            <p className="body-lg text-white/90 mb-8">
              EchoWell combines personal mood logs and Gemini-powered guidance so you can reflect, reset,
              and move forward one day at a time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="btn-primary bg-white text-cyan-700 hover:bg-gray-100">
                Create Free Account
              </Link>
              <Link to="/login" className="btn-secondary border-white text-white hover:bg-white hover:text-cyan-700">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="heading-lg text-gray-900 dark:text-white mb-4">Built for students and professionals</h2>
            <p className="body-lg text-gray-600 dark:text-gray-400">
              Focus on small daily actions that support your mental wellness journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {highlights.map((item) => (
              <div key={item.title} className="glass-card p-6">
                <h3 className="heading-sm text-gray-900 dark:text-white mb-3">{item.title}</h3>
                <p className="body-md text-gray-600 dark:text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card p-8 gradient-primary text-white">
            <h3 className="heading-md mb-3">Start with one check-in today</h3>
            <p className="body-md text-white/90 mb-6">
              Log your mood, write a short note, and get a practical suggestion from the AI coach.
            </p>
            <Link to="/register" className="btn-primary bg-white text-cyan-700 hover:bg-gray-100 inline-block">
              Start Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
