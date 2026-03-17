import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { clearToken, isAuthenticated } from "../../lib/auth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const authed = isAuthenticated();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    setIsDarkMode(theme === "dark");
    document.documentElement.setAttribute("data-theme", theme);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const navLinks = authed
    ? [
        { path: "/dashboard", label: "Dashboard" },
        { path: "/mood", label: "Mood" },
        { path: "/analytics", label: "Analytics" },
        { path: "/admin", label: "Admin" },
      ]
    : [
        { path: "/", label: "Home" },
        { path: "/login", label: "Login" },
        { path: "/register", label: "Register" },
      ];

  const doLogout = () => {
    clearToken();
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "glass-card shadow-lg backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <span className="heading-sm text-gradient">EchoWell</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-2 py-1 text-sm font-medium transition-all duration-300 hover:text-cyan-600 ${
                  location.pathname === link.path
                    ? "text-cyan-600"
                    : "text-gray-700 dark:text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? "Light" : "Dark"}
            </button>

            {authed ? (
              <button onClick={doLogout} className="btn-secondary">
                Logout
              </button>
            ) : (
              <Link to="/register" className="btn-primary">
                Get Started
              </Link>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Toggle menu"
          >
            <span className="text-gray-700 dark:text-gray-200">Menu</span>
          </button>
        </div>

        <div className={`md:hidden transition-all duration-300 overflow-hidden ${isMenuOpen ? "max-h-96" : "max-h-0"}`}>
          <div className="py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                  location.pathname === link.path
                    ? "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="px-4 py-2 flex gap-2">
              <button onClick={toggleDarkMode} className="btn-secondary w-full">
                {isDarkMode ? "Light" : "Dark"}
              </button>
              {authed ? (
                <button
                  className="btn-secondary w-full"
                  onClick={() => {
                    doLogout();
                    setIsMenuOpen(false);
                  }}
                >
                  Logout
                </button>
              ) : (
                <Link to="/register" className="btn-primary w-full text-center" onClick={() => setIsMenuOpen(false)}>
                  Join
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
