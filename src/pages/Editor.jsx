import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TextareaAutosize from 'react-textarea-autosize';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuthStore } from '../stores/authStore';
import { usePromptStore } from '../stores/promptStore';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

const { FiSave, FiZap, FiEye, FiShare2, FiTag, FiType, FiLightbulb, FiCheckCircle, FiAlertCircle, FiX, FiServer } = FiIcons;

const Editor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { createPrompt, updatePrompt, enhancePrompt, enhancing, currentPrompt, setCurrentPrompt } = usePromptStore();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    tags: [],
    category: '',
    is_public: false
  });

  const [tagInput, setTagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [enhancementResult, setEnhancementResult] = useState(null);
  const [showEnhancementModal, setShowEnhancementModal] = useState(false);

  // Check if we're in development or production
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const hasEnhancementService = !isDevelopment; // Only available in production with Netlify functions

  useEffect(() => {
    if (id && currentPrompt && currentPrompt.id === parseInt(id)) {
      setFormData({
        title: currentPrompt.title || '',
        description: currentPrompt.description || '',
        content: currentPrompt.content || '',
        tags: currentPrompt.tags || [],
        category: currentPrompt.category || '',
        is_public: currentPrompt.is_public || false
      });
    }
  }, [id, currentPrompt]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleEnhance = async () => {
    if (!formData.content.trim()) {
      toast.error('Please enter some content to enhance');
      return;
    }

    if (!hasEnhancementService) {
      toast.error('AI enhancement is only available in the deployed version. Deploy to Netlify to use this feature.');
      return;
    }

    console.log('🚀 Starting AI enhancement process...');
    
    try {
      const result = await enhancePrompt(formData.content);
      if (result) {
        console.log('✅ Enhancement successful:', result);
        setEnhancementResult(result);
        setShowEnhancementModal(true);
      }
    } catch (error) {
      console.error('❌ Enhancement failed:', error);
      // Error is already handled in the store with toast
    }
  };

  const acceptEnhancement = () => {
    if (enhancementResult) {
      setFormData(prev => ({
        ...prev,
        content: enhancementResult.enhanced
      }));
      setShowEnhancementModal(false);
      setEnhancementResult(null);
      toast.success('Enhancement applied!');
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('Please fill in title and content');
      return;
    }

    setIsSaving(true);
    try {
      if (id && currentPrompt) {
        await updatePrompt(currentPrompt.id, formData);
      } else {
        const newPrompt = await createPrompt(formData, user.id);
        if (newPrompt) {
          navigate(`/editor/${newPrompt.id}`);
        }
      }
    } catch (error) {
      toast.error('Failed to save prompt');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold">
            {id ? 'Edit Prompt' : 'Create New Prompt'}
          </h1>
          <p className="text-gray-400">
            {id ? 'Update your existing prompt' : 'Create a new AI prompt with intelligent assistance'}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={isSaving}
          >
            <SafeIcon icon={FiSave} className="mr-2" />
            Save Prompt
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Title */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
              <SafeIcon icon={FiType} />
              <span>Title</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter a descriptive title for your prompt..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Description
            </label>
            <TextareaAutosize
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Briefly describe what this prompt does..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              minRows={2}
              maxRows={4}
            />
          </div>

          {/* Content */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-gray-300">
                Prompt Content
              </label>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEnhance}
                loading={enhancing}
                disabled={!formData.content.trim() || !hasEnhancementService}
              >
                <SafeIcon icon={FiZap} className="mr-2" />
                {enhancing ? 'Enhancing...' : 'Enhance with AI'}
              </Button>
            </div>
            <TextareaAutosize
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              placeholder="Write your prompt here. Use AI enhancement to improve clarity and effectiveness..."
              className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              minRows={8}
              maxRows={20}
            />
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* AI Enhancement Status */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-4">
              <SafeIcon icon={FiLightbulb} />
              <span>AI Enhancement</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <SafeIcon 
                  icon={hasEnhancementService ? FiCheckCircle : FiAlertCircle} 
                  className={hasEnhancementService ? 'text-green-400' : 'text-yellow-400'} 
                />
                <span className="text-gray-300">
                  {hasEnhancementService ? 'Enhancement Service Ready' : 'Development Mode'}
                </span>
              </div>
              {!hasEnhancementService && (
                <div className="p-3 bg-yellow-600/20 border border-yellow-500/30 rounded-lg">
                  <p className="text-yellow-400 text-xs">
                    AI enhancement is available in the deployed version. Deploy to Netlify to use this feature.
                  </p>
                  <div className="flex items-center space-x-1 mt-2">
                    <SafeIcon icon={FiServer} className="text-yellow-300" />
                    <p className="text-yellow-300 text-xs">
                      Requires Netlify Functions backend
                    </p>
                  </div>
                </div>
              )}
              {hasEnhancementService && (
                <div className="p-3 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <p className="text-green-300 text-xs">
                    AI enhancement is ready! Write your prompt and click "Enhance with AI" to improve it.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Tags */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-3">
              <SafeIcon icon={FiTag} />
              <span>Tags</span>
            </label>
            <div className="flex space-x-2 mb-3">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                placeholder="Add a tag..."
                className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button size="sm" onClick={handleAddTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded-full"
                >
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-primary-300"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-sm font-medium text-gray-300 mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select category</option>
                  <option value="writing">Writing</option>
                  <option value="coding">Coding</option>
                  <option value="marketing">Marketing</option>
                  <option value="analysis">Analysis</option>
                  <option value="creative">Creative</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={formData.is_public}
                  onChange={(e) => handleInputChange('is_public', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-slate-700 border-slate-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="isPublic" className="ml-2 text-sm text-gray-300">
                  Make public
                </label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="flex items-center space-x-2 text-sm font-medium text-gray-300 mb-4">
              <SafeIcon icon={FiEye} />
              <span>Preview</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-400">Title:</span>
                <p className="text-white">{formData.title || 'Untitled'}</p>
              </div>
              <div>
                <span className="text-gray-400">Description:</span>
                <p className="text-white">{formData.description || 'No description'}</p>
              </div>
              <div>
                <span className="text-gray-400">Content preview:</span>
                <p className="text-white line-clamp-3">
                  {formData.content || 'No content yet...'}
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Enhancement Modal */}
      {showEnhancementModal && enhancementResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-800 rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto border border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">AI Enhancement Results</h2>
              <button
                onClick={() => setShowEnhancementModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <SafeIcon icon={FiX} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Enhanced Content */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Enhanced Prompt:</h3>
                <div className="bg-slate-700 rounded-lg p-4 border border-slate-600">
                  <p className="text-white whitespace-pre-wrap">{enhancementResult.enhanced}</p>
                </div>
              </div>

              {/* Improvements */}
              {enhancementResult.improvements && enhancementResult.improvements.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Improvements Made:</h3>
                  <ul className="space-y-2">
                    {enhancementResult.improvements.map((improvement, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <SafeIcon icon={FiCheckCircle} className="text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Suggestions */}
              {enhancementResult.suggestions && enhancementResult.suggestions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Additional Suggestions:</h3>
                  <ul className="space-y-2">
                    {enhancementResult.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <SafeIcon icon={FiLightbulb} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-slate-600">
                <Button onClick={acceptEnhancement}>
                  <SafeIcon icon={FiCheckCircle} className="mr-2" />
                  Accept Enhancement
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowEnhancementModal(false)}
                >
                  Keep Original
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Editor;