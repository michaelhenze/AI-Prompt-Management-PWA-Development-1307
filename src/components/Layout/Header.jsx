import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../../common/SafeIcon';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';

const { FiZap, FiMoon, FiSun, FiUser, FiLogOut, FiMenu } = FiIcons;

const Header = () => {
  const { user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-slate-800 border-b border-slate-700 px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <SafeIcon icon={FiZap} className="text-2xl text-primary-500" />
          <span className="text-xl font-bold">AI Prompt Studio</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/library" className="hover:text-primary-400 transition-colors">
            Library
          </Link>
          <Link to="/pricing" className="hover:text-primary-400 transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-slate-700 transition-colors"
          >
            <SafeIcon icon={theme === 'dark' ? FiSun : FiMoon} className="text-lg" />
          </button>

          {user ? (
            <div className="flex items-center space-x-3">
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Dashboard
              </Link>
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-slate-700">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <SafeIcon icon={FiUser} className="text-lg" />
                  )}
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-slate-700 rounded-t-lg"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 hover:bg-slate-700 rounded-b-lg flex items-center space-x-2"
                  >
                    <SafeIcon icon={FiLogOut} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/pricing"
              className="px-4 py-2 bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;