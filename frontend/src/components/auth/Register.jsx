import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/api";
import { setToken } from "../../lib/auth";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        dob: '',
        age: '',
        college: '',
        issues: [],
        about: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const { name, email, password, confirmPassword, dob, age, college, issues, about } = formData;

    const mentalHealthIssues = [
        'Anxiety', 'Depression', 'Stress', 'Sleep Issues', 'Academic Pressure',
        'Social Anxiety', 'Panic Attacks', 'Mood Swings', 'Concentration Issues',
        'Relationship Issues', 'Self-esteem', 'Other'
    ];

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleIssueToggle = (issue) => {
        const updatedIssues = issues.includes(issue)
            ? issues.filter(i => i !== issue)
            : [...issues, issue];
        setFormData({ ...formData, issues: updatedIssues });
    };

    const validateStep = (step) => {
        const newErrors = {};
        
        if (step === 1) {
            if (!name.trim()) newErrors.name = 'Name is required';
            if (!email) {
                newErrors.email = 'Email is required';
            } else if (!/\S+@\S+\.\S+/.test(email)) {
                newErrors.email = 'Email is invalid';
            }
            if (!password) {
                newErrors.password = 'Password is required';
            } else if (password.length < 6) {
                newErrors.password = 'Password must be at least 6 characters';
            }
            if (!confirmPassword) {
                newErrors.confirmPassword = 'Please confirm your password';
            } else if (password !== confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }
        
        if (step === 2) {
            if (!dob) newErrors.dob = 'Date of birth is required';
            if (!age) newErrors.age = 'Age is required';
            if (!college.trim()) newErrors.college = 'College/Institution is required';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateStep(2)) return;
        
        setIsLoading(true);
        try {
            const res = await api.post('/auth/register', {
                ...formData,
                issues: issues
            });
            setToken(res.data.access_token);
            navigate("/dashboard", { replace: true });
        } catch (err) {
            setErrors({ general: err.response?.data?.detail || 'Registration failed' });
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(password);
    const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center animate-slide-up">
                    <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <span className="text-white font-bold text-2xl">M</span>
                    </div>
                    <h2 className="heading-lg text-gray-900 dark:text-white">
                        Join MindClave
                    </h2>
                    <p className="body-md text-gray-600 dark:text-gray-400 mt-2">
                        Start your mental wellness journey today
                    </p>
                </div>

                {/* Progress Indicator */}
                <div className="flex justify-center mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center space-x-4">
                        {[1, 2, 3].map((step) => (
                            <React.Fragment key={step}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                                    step <= currentStep 
                                        ? 'bg-cyan-600 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                }`}>
                                    {step < currentStep ? (
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        step
                                    )}
                                </div>
                                {step < 3 && (
                                    <div className={`w-12 h-0.5 transition-colors duration-300 ${
                                        step < currentStep ? 'bg-cyan-600' : 'bg-gray-200 dark:bg-gray-700'
                                    }`} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Form */}
                <div className="glass-card p-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <form onSubmit={onSubmit} className="space-y-6">
                        {errors.general && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 animate-scale-in">
                                <p className="text-red-600 dark:text-red-400 text-sm">{errors.general}</p>
                            </div>
                        )}

                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <h3 className="heading-sm text-gray-900 dark:text-white text-center mb-6">
                                    Basic Information
                                </h3>

                                {/* Name Field */}
                                <div>
                                    <label htmlFor="name" className="block body-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        value={name}
                                        onChange={onChange}
                                        className={`input-field ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-scale-in">{errors.name}</p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label htmlFor="email" className="block body-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={email}
                                        onChange={onChange}
                                        className={`input-field ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                        placeholder="Enter your email"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-scale-in">{errors.email}</p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div>
                                    <label htmlFor="password" className="block body-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={password}
                                            onChange={onChange}
                                            className={`input-field pr-10 ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                            placeholder="Create a password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-cyan-600 transition-colors duration-200"
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    
                                    {/* Password Strength Indicator */}
                                    {password && (
                                        <div className="mt-2">
                                            <div className="flex space-x-1 mb-1">
                                                {[0, 1, 2, 3].map((level) => (
                                                    <div
                                                        key={level}
                                                        className={`h-1 w-1/4 rounded-full transition-colors duration-300 ${
                                                            level < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-gray-200'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                            <p className="text-xs text-gray-500">
                                                Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : 'Too weak'}
                                            </p>
                                        </div>
                                    )}
                                    
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-scale-in">{errors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password Field */}
                                <div>
                                    <label htmlFor="confirmPassword" className="block body-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Confirm Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            value={confirmPassword}
                                            onChange={onChange}
                                            className={`input-field pr-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                                            placeholder="Confirm your password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-cyan-600 transition-colors duration-200"
                                        >
                                            {showConfirmPassword ? (
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-scale-in">{errors.confirmPassword}</p>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="w-full btn-primary"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {/* Step 2: Personal Information */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <h3 className="heading-sm text-gray-900 dark:text-white text-center mb-6">
                                    Personal Information
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    {/* Date of Birth */}
                                    <div>
                                        <label htmlFor="dob" className="block body-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Date of Birth
                                        </label>
                                        <input
                                            id="dob"
                                            name="dob"
                                            type="date"
                                            value={dob}
                                            onChange={onChange}
                                            className={`input-field ${errors.dob ? 'border-red-500 focus:border-red-500' : ''}`}
                                        />
                                        {errors.dob && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-scale-in">{errors.dob}</p>
                                        )}
                                    </div>

                                    {/* Age */}
                                    <div>
                                        <label htmlFor="age" className="block body-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Age
                                        </label>
                                        <input
                                            id="age"
                                            name="age"
                                            type="number"
                                            value={age}
                                            onChange={onChange}
                                            className={`input-field ${errors.age ? 'border-red-500 focus:border-red-500' : ''}`}
                                            placeholder="Age"
                                            min="13"
                                            max="100"
                                        />
                                        {errors.age && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-scale-in">{errors.age}</p>
                                        )}
                                    </div>
                                </div>

                                {/* College */}
                                <div>
                                    <label htmlFor="college" className="block body-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        College/Institution
                                    </label>
                                    <input
                                        id="college"
                                        name="college"
                                        type="text"
                                        value={college}
                                        onChange={onChange}
                                        className={`input-field ${errors.college ? 'border-red-500 focus:border-red-500' : ''}`}
                                        placeholder="Enter your college or institution"
                                    />
                                    {errors.college && (
                                        <p className="mt-1 text-sm text-red-600 dark:text-red-400 animate-scale-in">{errors.college}</p>
                                    )}
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 btn-secondary"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-1 btn-primary"
                                    >
                                        Continue
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Mental Health Information */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <h3 className="heading-sm text-gray-900 dark:text-white text-center mb-6">
                                    Help Us Understand You Better
                                </h3>

                                {/* Mental Health Issues */}
                                <div>
                                    <label className="block body-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        What areas would you like support with? (Select all that apply)
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {mentalHealthIssues.map((issue) => (
                                            <button
                                                key={issue}
                                                type="button"
                                                onClick={() => handleIssueToggle(issue)}
                                                className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 ${
                                                    issues.includes(issue)
                                                        ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300'
                                                        : 'border-gray-200 dark:border-gray-600 hover:border-cyan-300 text-gray-700 dark:text-gray-300'
                                                }`}
                                            >
                                                {issue}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* About Yourself */}
                                <div>
                                    <label htmlFor="about" className="block body-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Tell us about yourself (Optional)
                                    </label>
                                    <textarea
                                        id="about"
                                        name="about"
                                        value={about}
                                        onChange={onChange}
                                        rows={4}
                                        className="input-field resize-none"
                                        placeholder="Share anything you'd like us to know about your mental health journey..."
                                    />
                                </div>

                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 btn-secondary"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`flex-1 btn-primary ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    >
                                        {isLoading ? (
                                            <>
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Creating Account...
                                            </>
                                        ) : (
                                            'Create Account'
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                </div>

                {/* Sign In Link */}
                <div className="text-center animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <p className="body-md text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors duration-200">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
