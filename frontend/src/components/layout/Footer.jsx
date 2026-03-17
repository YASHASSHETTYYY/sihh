import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link to="/" className="flex items-center space-x-2 mb-3">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="heading-sm text-white">MindClave</span>
            </Link>
            <p className="body-md text-gray-400 max-w-sm">
              EchoWell helps you track mood patterns and get supportive guidance with a safe, calm experience.
            </p>
          </div>

          <div>
            <h3 className="heading-sm text-white mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="body-md text-gray-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="body-md text-gray-400 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/mood" className="body-md text-gray-400 hover:text-white transition-colors">
                  Mood Tracker
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="heading-sm text-white mb-3">Support</h3>
            <p className="body-md text-gray-400 mb-2">If you are in immediate danger, contact local emergency services.</p>
            <p className="body-sm text-gray-500">AI support is informational and not a medical diagnosis.</p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="body-sm text-gray-400">&copy; {currentYear} MindClave. All rights reserved.</p>
          <p className="body-sm text-gray-500 mt-3 sm:mt-0">Made with care for mental wellness.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
