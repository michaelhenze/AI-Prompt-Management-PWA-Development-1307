import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiEye, FiHeart, FiShare2, FiEdit3, FiTrash2 } = FiIcons;

const PromptCard = ({ prompt, onDelete, showActions = false }) => {
  const handleDelete = (e) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      onDelete(prompt.firestoreId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-slate-800 rounded-lg p-6 border border-slate-700 hover:border-slate-600 transition-all duration-200"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{prompt.title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2">{prompt.description}</p>
        </div>
        {showActions && (
          <div className="flex space-x-2">
            <Link
              to={`/editor/${prompt.id}`}
              className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiEdit3} className="text-sm" />
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 hover:bg-slate-700 text-red-400 rounded-lg transition-colors"
            >
              <SafeIcon icon={FiTrash2} className="text-sm" />
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {prompt.tags?.map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between text-sm text-gray-400">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiEye} />
            <span>{prompt.views || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiHeart} />
            <span>{prompt.likes || 0}</span>
          </div>
          <div className="flex items-center space-x-1">
            <SafeIcon icon={FiShare2} />
            <span>{prompt.shares || 0}</span>
          </div>
        </div>
        <span>
          {formatDistanceToNow(new Date(prompt.updatedAt?.seconds * 1000 || prompt.updatedAt), { addSuffix: true })}
        </span>
      </div>
    </motion.div>
  );
};

export default PromptCard;