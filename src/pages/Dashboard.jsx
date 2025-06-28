import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuthStore } from '../stores/authStore';
import { usePromptStore } from '../stores/promptStore';
import PromptCard from '../components/Prompt/PromptCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const { FiPlus, FiEdit3, FiBookOpen, FiTrendingUp } = FiIcons;

const Dashboard = () => {
  const { user } = useAuthStore();
  const { prompts, loading, fetchUserPrompts, deletePrompt } = usePromptStore();

  useEffect(() => {
    if (user?.id) {
      console.log('👤 Fetching prompts for user:', user.id);
      fetchUserPrompts(user.id);
    }
  }, [user?.id, fetchUserPrompts]);

  const stats = [
    { label: 'Total Prompts', value: prompts.length, icon: FiEdit3 },
    { label: 'Public Prompts', value: prompts.filter(p => p.is_public).length, icon: FiBookOpen },
    { label: 'Total Views', value: prompts.reduce((sum, p) => sum + (p.views || 0), 0), icon: FiTrendingUp }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-6 text-white"
      >
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.displayName || 'Creator'}!
        </h1>
        <p className="opacity-90">
          Ready to create some amazing prompts today?
        </p>
        <Link
          to="/editor"
          className="inline-flex items-center space-x-2 mt-4 px-4 py-2 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Create New Prompt</span>
        </Link>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-slate-800 p-6 rounded-lg border border-slate-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </div>
              <SafeIcon icon={stat.icon} className="text-2xl text-primary-500" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Prompts */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Your Prompts</h2>
          <Link
            to="/editor"
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <SafeIcon icon={FiPlus} />
            <span>New Prompt</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : prompts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700"
          >
            <SafeIcon icon={FiEdit3} className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No prompts yet</h3>
            <p className="text-gray-400 mb-6">
              Create your first prompt to get started with AI-powered prompt management.
            </p>
            <Link
              to="/editor"
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiPlus} />
              <span>Create Your First Prompt</span>
            </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onDelete={deletePrompt}
                showActions={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;