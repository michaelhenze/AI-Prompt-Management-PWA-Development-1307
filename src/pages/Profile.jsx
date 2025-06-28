import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore } from '../stores/themeStore';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

const { FiUser, FiMail, FiCalendar, FiSettings, FiMoon, FiSun, FiBell, FiShield } = FiIcons;

const Profile = () => {
  const { user, signOut } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'preferences', label: 'Preferences', icon: FiSettings },
    { id: 'notifications', label: 'Notifications', icon: FiBell },
    { id: 'security', label: 'Security', icon: FiShield }
  ];

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 rounded-lg p-6 border border-slate-700"
      >
        <div className="flex items-center space-x-4">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName}
              className="w-16 h-16 rounded-full"
            />
          ) : (
            <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center">
              <SafeIcon icon={FiUser} className="text-2xl text-gray-400" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold">{user?.displayName || 'User'}</h1>
            <p className="text-gray-400">{user?.email}</p>
            <p className="text-sm text-gray-500">
              Member since {new Date(user?.createdAt?.seconds * 1000 || Date.now()).toLocaleDateString()}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-slate-800 rounded-lg p-4 border border-slate-700 h-fit"
        >
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white'
                    : 'hover:bg-slate-700 text-gray-300'
                }`}
              >
                <SafeIcon icon={tab.icon} />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 bg-slate-800 rounded-lg p-6 border border-slate-700"
        >
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Profile Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.displayName || ''}
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    disabled
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-gray-400 cursor-not-allowed"
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Bio
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-slate-700 border border-slate-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <Button onClick={handleSaveProfile}>
                Save Changes
              </Button>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Theme</h3>
                    <p className="text-sm text-gray-400">Choose your preferred theme</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className="flex items-center space-x-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    <SafeIcon icon={theme === 'dark' ? FiMoon : FiSun} />
                    <span>{theme === 'dark' ? 'Dark' : 'Light'}</span>
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Auto-save</h3>
                    <p className="text-sm text-gray-400">Automatically save prompts while editing</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-primary-600 bg-slate-700 border-slate-600 rounded focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Public Profile</h3>
                    <p className="text-sm text-gray-400">Allow others to see your public prompts</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-primary-600 bg-slate-700 border-slate-600 rounded focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Notification Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-400">Receive updates via email</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-primary-600 bg-slate-700 border-slate-600 rounded focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Prompt Likes</h3>
                    <p className="text-sm text-gray-400">Get notified when someone likes your prompt</p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-4 h-4 text-primary-600 bg-slate-700 border-slate-600 rounded focus:ring-primary-500"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Weekly Digest</h3>
                    <p className="text-sm text-gray-400">Receive a weekly summary of activity</p>
                  </div>
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-primary-600 bg-slate-700 border-slate-600 rounded focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Security Settings</h2>
              
              <div className="space-y-4">
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Connected Accounts</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <SafeIcon icon={FiMail} />
                      <span>Google</span>
                    </div>
                    <span className="text-green-400 text-sm">Connected</span>
                  </div>
                </div>
                
                <div className="bg-slate-700 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Account Actions</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left px-4 py-2 bg-slate-600 hover:bg-slate-500 rounded-lg transition-colors">
                      Download My Data
                    </button>
                    <button className="w-full text-left px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  onClick={signOut}
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;