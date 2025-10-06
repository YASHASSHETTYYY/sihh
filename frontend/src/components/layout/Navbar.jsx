import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    setIsDarkMode(theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/login', label: 'Login' },
    { path: '/register', label: 'Register' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'glass-card shadow-lg backdrop-blur-md' 
        : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 group"
          >
            <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-xl">M</span>
            </div>
            <span className="heading-sm text-gradient">MindClave</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 hover:text-cyan-600 ${
                  location.pathname === link.path
                    ? 'text-cyan-600'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-primary rounded-full animate-scale-in" />
                )}
              </Link>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <button className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-cyan-600 transition-colors duration-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:border-cyan-600">
              EN/HI
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 hover-lift"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>

            {/* CTA Button */}
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            aria-label="Toggle menu"
          >
            <div className="w-6 h-6 relative">
              <span className={`absolute block w-full h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 top-3' : 'top-1'
              }`} />
              <span className={`absolute block w-full h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 top-3 ${
                isMenuOpen ? 'opacity-0' : 'opacity-100'
              }`} />
              <span className={`absolute block w-full h-0.5 bg-gray-600 dark:bg-gray-300 transform transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 top-3' : 'top-5'
              }`} />
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition-all duration-300 ${
                  location.pathname === link.path
                    ? 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-600 border-l-4 border-cyan-600'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="flex items-center justify-between px-4 py-3">
              <button 
                onClick={toggleDarkMode}
                className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"
              >
                <span className="text-sm font-medium">Dark Mode</span>
                <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${
                  isDarkMode ? 'bg-cyan-600' : 'bg-gray-300'
                }`}>
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 mt-0.5 ${
                    isDarkMode ? 'translate-x-6 ml-1' : 'translate-x-1'
                  }`} />
                </div>
              </button>
              
              <button className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg">
                EN/HI
              </button>
            </div>
            
            <div className="px-4 pt-2">
              <Link 
                to="/register" 
                className="btn-primary w-full text-center block"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;