import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
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

  const features = [
    {
      icon: "🧠",
      title: "AI-Powered Insights",
      description: "Get personalized mental health insights powered by advanced AI algorithms tailored to your unique needs."
    },
    {
      icon: "💬",
      title: "24/7 Support Chat",
      description: "Access our intelligent chatbot anytime for immediate support and guidance when you need it most."
    },
    {
      icon: "📊",
      title: "Mood Tracking",
      description: "Monitor your emotional well-being with our intuitive mood tracking system and detailed analytics."
    },
    {
      icon: "👥",
      title: "Community Forum",
      description: "Connect with others on similar journeys in our safe, supportive community environment."
    },
    {
      icon: "📚",
      title: "Expert Resources",
      description: "Access curated articles, exercises, and resources created by mental health professionals."
    },
    {
      icon: "🎯",
      title: "Goal Setting",
      description: "Set and track personal wellness goals with our guided goal-setting and achievement system."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "College Student",
      content: "MindClave helped me manage my anxiety during finals week. The 24/7 support was a lifesaver!",
      avatar: "https://i.pravatar.cc/150?img=1"
    },
    {
      name: "Michael Chen",
      role: "Working Professional",
      content: "The mood tracking feature helped me identify patterns in my stress levels. Highly recommend!",
      avatar: "https://i.pravatar.cc/150?img=2"
    },
    {
      name: "Emily Rodriguez",
      role: "Graduate Student",
      content: "The community forum is amazing. Finding people who understand what I'm going through made all the difference.",
      avatar: "https://i.pravatar.cc/150?img=3"
    }
  ];

  const stats = [
    { number: "10K+", label: "Active Users" },
    { number: "95%", label: "Satisfaction Rate" },
    { number: "24/7", label: "Support Available" },
    { number: "500+", label: "Expert Resources" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 gradient-hero opacity-90">
          <div className="absolute inset-0 bg-black/20" />
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-20 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '4s' }} />
        
        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="heading-xl text-white mb-6 animate-slide-up">
            Your Mental Wellness
            <span className="block text-cyan-300">Companion</span>
          </h1>
          
          <p className="body-lg text-white/90 mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Discover peace of mind with MindClave - your personalized mental health platform offering AI-powered insights, 
            24/7 support, and a caring community. Start your wellness journey today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/register" className="btn-primary text-lg px-8 py-4 hover-lift">
              Start Your Journey
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4 bg-white/10 border-white text-white hover:bg-white hover:text-gray-900">
              Sign In
            </Link>
          </div>
          
          <div className="mt-12 animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <p className="text-white/70 text-sm mb-4">Trusted by students and professionals worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="heading-md text-white font-bold">{stat.number}</div>
                  <div className="body-sm text-white/80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="features-header"
            data-animate
            className={`text-center mb-16 ${isVisible['features-header'] ? 'animate-slide-up' : 'opacity-0'}`}
          >
            <h2 className="heading-lg text-gray-900 dark:text-white mb-4">
              Everything You Need for
              <span className="text-gradient block">Mental Wellness</span>
            </h2>
            <p className="body-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive tools and resources designed to support your mental health journey every step of the way.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                id={`feature-${index}`}
                data-animate
                className={`glass-card p-8 hover-lift group cursor-pointer ${
                  isVisible[`feature-${index}`] ? 'animate-slide-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="heading-sm text-gray-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="body-md text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            id="testimonials-header"
            data-animate
            className={`text-center mb-16 ${isVisible['testimonials-header'] ? 'animate-slide-up' : 'opacity-0'}`}
          >
            <h2 className="heading-lg text-gray-900 dark:text-white mb-4">
              What Our Community Says
            </h2>
            <p className="body-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real stories from real people who found support and healing through MindClave.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                id={`testimonial-${index}`}
                data-animate
                className={`glass-card p-8 hover-lift ${
                  isVisible[`testimonial-${index}`] ? 'animate-slide-up' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="heading-sm text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h4>
                    <p className="body-sm text-gray-500 dark:text-gray-400">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="body-md text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.content}"
                </p>
                <div className="flex text-yellow-400 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div 
            id="cta-section"
            data-animate
            className={`text-center ${isVisible['cta-section'] ? 'animate-slide-up' : 'opacity-0'}`}
          >
            <h2 className="heading-lg text-white mb-6">
              Ready to Transform Your Mental Wellness?
            </h2>
            <p className="body-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students and professionals who have already started their journey to better mental health.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/register" className="btn-primary bg-white text-cyan-600 hover:bg-gray-100 text-lg px-8 py-4">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary border-white text-white hover:bg-white hover:text-cyan-600 text-lg px-8 py-4">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;