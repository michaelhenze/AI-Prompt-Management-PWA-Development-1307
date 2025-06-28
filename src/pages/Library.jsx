import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { usePromptStore } from '../stores/promptStore';
import PromptCard from '../components/Prompt/PromptCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const { FiSearch, FiFilter, FiTrendingUp, FiClock, FiHeart } = FiIcons;

const Library = () => {
  const { prompts, loading, fetchPublicPrompts } = usePromptStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('views');
  const [filteredPrompts, setFilteredPrompts] = useState([]);

  useEffect(() => {
    fetchPublicPrompts();
  }, [fetchPublicPrompts]);

  useEffect(() => {
    let filtered = prompts.filter(prompt => {
      const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prompt.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = !selectedCategory || prompt.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort prompts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return (b.views || 0) - (a.views || 0);
        case 'likes':
          return (b.likes || 0) - (a.likes || 0);
        case 'recent':
          return new Date(b.updatedAt) - new Date(a.updatedAt);
        default:
          return 0;
      }
    });

    setFilteredPrompts(filtered);
  }, [prompts, searchTerm, selectedCategory, sortBy]);

  const categories = ['writing', 'coding', 'marketing', 'analysis', 'creative', 'other'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-4">Prompt Library</h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          Discover and explore thousands of AI prompts created by our community. 
          Find inspiration for your next project.
        </p>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-800 rounded-lg p-6 border border-slate-700"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search prompts, tags, or descriptions..."
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="views">Most Viewed</option>
              <option value="likes">Most Liked</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
          <SafeIcon icon={FiTrendingUp} className="text-2xl text-primary-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">{prompts.length}</div>
          <div className="text-sm text-gray-400">Total Prompts</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
          <SafeIcon icon={FiHeart} className="text-2xl text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">
            {prompts.reduce((sum, p) => sum + (p.likes || 0), 0)}
          </div>
          <div className="text-sm text-gray-400">Total Likes</div>
        </div>
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 text-center">
          <SafeIcon icon={FiClock} className="text-2xl text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold">24/7</div>
          <div className="text-sm text-gray-400">Always Updated</div>
        </div>
      </motion.div>

      {/* Results */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredPrompts.length === 0 ? (
          <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700">
            <SafeIcon icon={FiSearch} className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
            <p className="text-gray-400">
              Try adjusting your search terms or filters to find what you're looking for.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {filteredPrompts.length} prompt{filteredPrompts.length !== 1 ? 's' : ''} found
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <PromptCard key={prompt.id} prompt={prompt} />
              ))}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Library;