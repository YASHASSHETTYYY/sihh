import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Resources', href: '#resources' },
      { name: 'API', href: '#api' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Community', href: '#community' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Status', href: '#status' }
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' }
    ],
    legal: [
      { name: 'Privacy', href: '#privacy' },
      { name: 'Terms', href: '#terms' },
      { name: 'Security', href: '#security' },
      { name: 'Cookies', href: '#cookies' }
    ]
  };

  const socialLinks = [
    {
      name: 'Twitter',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
        </svg>
      )
    },
    {
      name: 'Facebook',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.01 6.71.058 5.487.107 4.65.278 3.927.598 3.18.928 2.542 1.566 2.213 2.313c-.32.724-.49 1.561-.539 2.784C1.625 6.316 1.615 6.784 1.615 10.405s.01 4.089.059 5.307c.048 1.223.219 2.06.539 2.784.329.747.967 1.385 1.714 1.714.724.32 1.561.49 2.784.539 1.218.049 1.686.059 5.307.059s4.089-.01 5.307-.059c1.223-.049 2.06-.219 2.784-.539.747-.329 1.385-.967 1.714-1.714.32-.724.49-1.561.539-2.784.049-1.218.059-1.686.059-5.307s-.01-4.089-.059-5.307c-.049-1.223-.219-2.06-.539-2.784-.329-.747-.967-1.385-1.714-1.714-.724-.32-1.561-.49-2.784-.539C16.106.01 15.638 0 12.017 0zM12.017 2.162c3.557 0 3.983.014 5.388.061 1.3.059 2.006.277 2.477.461.622.242 1.067.532 1.533.998.466.466.756.911.998 1.533.184.471.402 1.177.461 2.477.047 1.405.061 1.831.061 5.388s-.014 3.983-.061 5.388c-.059 1.3-.277 2.006-.461 2.477-.242.622-.532 1.067-.998 1.533-.466.466-.911.756-1.533.998-.471.184-1.177.402-2.477.461-1.405.047-1.831.061-5.388.061s-3.983-.014-5.388-.061c-1.3-.059-2.006-.277-2.477-.461-.622-.242-1.067-.532-1.533-.998-.466-.466-.756-.911-.998-1.533-.184-.471-.402-1.177-.461-2.477-.047-1.405-.061-1.831-.061-5.388s.014-3.983.061-5.388c.059-1.3.277-2.006.461-2.477.242-.622.532-1.067.998-1.533.466-.466.911-.756 1.533-.998.471-.184 1.177-.402 2.477-.461 1.405-.047 1.831-.061 5.388-.061z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M12.017 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12.017 16a4 4 0 110-8 4 4 0 010 8z" clipRule="evenodd" />
          <circle cx="18.406" cy="5.594" r="1.44" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="heading-sm text-white">MindClave</span>
            </Link>
            <p className="body-md text-gray-400 mb-6 max-w-sm">
              Your trusted mental wellness companion, providing 24/7 support, expert resources, 
              and a caring community to help you thrive.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300 hover-lift group"
                  aria-label={social.name}
                >
                  <div className="text-gray-400 group-hover:text-white transition-colors duration-300">
                    {social.icon}
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="heading-sm text-white mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="body-md text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="heading-sm text-white mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="body-md text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="heading-sm text-white mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="body-md text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="heading-sm text-white mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="body-md text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="heading-sm text-white mb-2">Stay updated</h3>
              <p className="body-md text-gray-400">
                Get the latest mental wellness tips and updates delivered to your inbox.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-600 transition-colors duration-300"
              />
              <button className="btn-primary px-6 py-3 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row justify-between items-center">
          <p className="body-sm text-gray-400">
            &copy; 2025 MindClave. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 sm:mt-0">
            <span className="body-sm text-gray-400">Made with ❤️ for mental wellness</span>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="body-sm text-gray-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;