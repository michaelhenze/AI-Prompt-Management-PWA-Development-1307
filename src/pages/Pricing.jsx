import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import AuthModal from '../components/Auth/AuthModal';
import { useAuthStore } from '../stores/authStore';

const { FiCheck, FiZap, FiUsers, FiTrendingUp } = FiIcons;

const Pricing = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAnnual, setIsAnnual] = useState(false);
  const { user } = useAuthStore();

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started',
      features: [
        '5 prompts per month',
        'Basic AI enhancement',
        'Public library access',
        'Community support'
      ],
      popular: false
    },
    {
      name: 'Pro',
      price: { monthly: 19, annual: 190 },
      description: 'For serious prompt creators',
      features: [
        'Unlimited prompts',
        'Advanced AI enhancement',
        'Private sharing',
        'Analytics & insights',
        'Version control',
        'Priority support'
      ],
      popular: true
    },
    {
      name: 'Team',
      price: { monthly: 49, annual: 490 },
      description: 'For teams and organizations',
      features: [
        'Everything in Pro',
        'Team collaboration',
        'Advanced analytics',
        'Custom integrations',
        'Admin controls',
        'Dedicated support'
      ],
      popular: false
    }
  ];

  const handleGetStarted = (planName) => {
    if (!user) {
      setShowAuthModal(true);
    } else {
      // Handle subscription logic here
      console.log(`Subscribe to ${planName}`);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Start free and upgrade as you grow. All plans include our core features.
        </p>
      </motion.div>

      {/* Billing Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center justify-center space-x-4"
      >
        <span className={`${!isAnnual ? 'text-white' : 'text-gray-400'}`}>
          Monthly
        </span>
        <button
          onClick={() => setIsAnnual(!isAnnual)}
          className={`relative w-12 h-6 rounded-full transition-colors ${
            isAnnual ? 'bg-primary-600' : 'bg-slate-600'
          }`}
        >
          <div
            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
              isAnnual ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`${isAnnual ? 'text-white' : 'text-gray-400'}`}>
          Annual
        </span>
        {isAnnual && (
          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full">
            Save 20%
          </span>
        )}
      </motion.div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className={`relative bg-slate-800 rounded-lg p-8 border ${
              plan.popular
                ? 'border-primary-500 ring-2 ring-primary-500/20'
                : 'border-slate-700'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="px-4 py-1 bg-primary-600 text-white text-sm rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-8">
              <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
              <p className="text-gray-400 mb-4">{plan.description}</p>
              <div className="mb-4">
                <span className="text-4xl font-bold">
                  ${isAnnual ? plan.price.annual : plan.price.monthly}
                </span>
                <span className="text-gray-400">
                  /{isAnnual ? 'year' : 'month'}
                </span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <li key={featureIndex} className="flex items-center space-x-3">
                  <SafeIcon icon={FiCheck} className="text-primary-500 flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleGetStarted(plan.name)}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                plan.popular
                  ? 'bg-primary-600 hover:bg-primary-700 text-white'
                  : 'bg-slate-700 hover:bg-slate-600 text-white'
              }`}
            >
              {plan.name === 'Free' ? 'Get Started' : 'Upgrade Now'}
            </button>
          </motion.div>
        ))}
      </div>

      {/* Features Comparison */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-800 rounded-lg p-8 border border-slate-700"
      >
        <h2 className="text-2xl font-bold text-center mb-8">Why Choose AI Prompt Studio?</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <SafeIcon icon={FiZap} className="text-3xl text-primary-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI-Powered Enhancement</h3>
            <p className="text-gray-400">
              Improve your prompts with GPT-4o powered suggestions and optimizations.
            </p>
          </div>
          
          <div className="text-center">
            <SafeIcon icon={FiUsers} className="text-3xl text-primary-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Team Collaboration</h3>
            <p className="text-gray-400">
              Work together with your team to create and refine prompts in real-time.
            </p>
          </div>
          
          <div className="text-center">
            <SafeIcon icon={FiTrendingUp} className="text-3xl text-primary-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analytics & Insights</h3>
            <p className="text-gray-400">
              Track performance and get insights on your most effective prompts.
            </p>
          </div>
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
        
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="font-semibold mb-2">Can I change my plan anytime?</h3>
            <p className="text-gray-400">
              Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
            </p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p className="text-gray-400">
              Our Free plan gives you access to core features with no time limit. You can upgrade to Pro or Team plans anytime.
            </p>
          </div>
          
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="font-semibold mb-2">How does the AI enhancement work?</h3>
            <p className="text-gray-400">
              Our AI uses advanced language models to analyze your prompts and suggest improvements for clarity, effectiveness, and specificity.
            </p>
          </div>
        </div>
      </motion.div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default Pricing;