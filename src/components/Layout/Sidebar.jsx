import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';

const { FiHome, FiEdit3, FiBookOpen, FiSettings, FiPlus } = FiIcons;

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiEdit3, label: 'New Prompt', path: '/editor' },
    { icon: FiBookOpen, label: 'Library', path: '/library' },
    { icon: FiSettings, label: 'Settings', path: '/profile' }
  ];

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="fixed left-0 top-16 h-full w-64 bg-slate-800 border-r border-slate-700 p-6"
    >
      <div className="space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
              location.pathname === item.path
                ? 'bg-primary-600 text-white'
                : 'hover:bg-slate-700'
            }`}
          >
            <SafeIcon icon={item.icon} className="text-lg" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 pt-8 border-t border-slate-700">
        <Link
          to="/editor"
          className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors"
        >
          <SafeIcon icon={FiPlus} />
          <span>Create Prompt</span>
        </Link>
      </div>
    </motion.aside>
  );
};

export default Sidebar;