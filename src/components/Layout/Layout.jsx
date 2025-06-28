import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuthStore } from '../../stores/authStore';

const Layout = ({ children }) => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="flex">
        {user && <Sidebar />}
        <main className={`flex-1 ${user ? 'ml-64' : ''} transition-all duration-300`}>
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;