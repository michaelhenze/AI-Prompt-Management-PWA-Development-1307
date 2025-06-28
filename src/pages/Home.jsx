import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AuthModal from '../components/Auth/AuthModal';
import { useAuthStore } from '../stores/authStore';

const { FiZap, FiEdit3, FiShare2, FiTrendingUp, FiUsers, FiStar } = FiIcons;

const Home = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuthStore();

  const features = [
    {
      icon: FiEdit3,
      title: 'AI-Enhanced Editing',
      description: 'Improve your prompts with GPT-4o powered suggestions and optimizations'
    },
    {
      icon: FiShare2,
      title: 'Share & Collaborate',
      description: 'Share prompts with your team and collaborate in real-time'
    },
    {
      icon: FiTrendingUp,
      title: 'Analytics & Insights',
      description: 'Track performance and get insights on your most effective prompts'
    },
    {
      icon: FiUsers,
      title: 'Community Library',
      description: 'Access thousands of prompts created by the community'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-20"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <SafeIcon icon={FiZap} className="text-6xl text-primary-500 mx-auto mb-6" />
        </motion.div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
          AI Prompt Studio
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Create, enhance, and share AI prompts with intelligent assistance. 
          Build better prompts faster with our AI-powered editing tools.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Link
              to="/dashboard"
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
            >
              Go to Dashboard
            </Link>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
            >
              Get Started Free
            </button>
          )}
          
          <Link
            to="/library"
            className="px-8 py-3 border border-slate-600 hover:border-slate-500 rounded-lg font-medium transition-colors"
          >
            Browse Library
          </Link>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="py-20"
      >
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Everything you need to create, manage, and optimize your AI prompts
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-slate-800 p-6 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors"
            >
              <SafeIcon icon={feature.icon} className="text-3xl text-primary-500 mb-4" />
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="py-20 bg-slate-800/50"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-500 mb-2">10K+</div>
            <div className="text-gray-400">Prompts Created</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-500 mb-2">5K+</div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-500 mb-2">99%</div>
            <div className="text-gray-400">Satisfaction Rate</div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="py-20 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
          Join thousands of creators who are already using AI Prompt Studio to create better prompts.
        </p>
        
        {!user && (
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg font-medium transition-colors"
          >
            Start Creating Now
          </button>
        )}
      </motion.section>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Home;