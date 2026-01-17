
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import LiveVoiceWidget from './components/LiveVoiceWidget';
import InstallPage from './components/InstallPage';
import StealthSettings from './components/StealthSettings';
import QuestionBank from './components/QuestionBank';
import UserManual from './components/UserManual';
import PrivacyVault from './components/PrivacyVault';
import AdminDashboard from './components/AdminDashboard';
import Auth from './components/Auth';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  const handleLogin = (role: 'user' | 'admin') => {
    setIsLoggedIn(true);
    setUserRole(role);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout onLogout={handleLogout} currentRole={userRole} onRoleChange={setUserRole}>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/install" element={<InstallPage />} />
          <Route path="/prep" element={<QuestionBank />} />
          <Route path="/stealth" element={<StealthSettings />} />
          <Route path="/manual" element={<UserManual />} />
          <Route path="/security" element={<PrivacyVault />} />
          <Route path="/analytics" element={<Placeholder title="Growth Insights" description="Deep dive into your interview confidence and success rates." />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<Placeholder title="User Management" description="Full control over user accounts, permissions, and billing states." />} />
          <Route path="/admin/stats" element={<Placeholder title="Global Analytics" description="System-wide usage patterns and demographic breakdown." />} />
          <Route path="/admin/bypass" element={<Placeholder title="Bypass Controls" description="Deploy kernel-level updates to counter new detection methods." />} />
          <Route path="/admin/config" element={<Placeholder title="System Config" description="Core API management and infrastructure parameters." />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <LiveVoiceWidget />
      </Layout>
    </HashRouter>
  );
};

const Placeholder = ({ title, description }: { title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 animate-in fade-in zoom-in duration-500">
    <div className="w-20 h-20 bg-gray-900 border border-gray-800 rounded-3xl flex items-center justify-center mb-4 group hover:border-indigo-500 transition-all">
      <div className="w-8 h-8 bg-indigo-600/20 rounded-lg flex items-center justify-center">
        <div className="w-4 h-4 bg-indigo-500 rounded-full animate-pulse group-hover:scale-125 transition-transform" />
      </div>
    </div>
    <h2 className="text-3xl font-bold text-white tracking-tight">{title}</h2>
    <p className="text-gray-400 max-w-md text-sm leading-relaxed">
      {description}
    </p>
    <div className="flex gap-3">
      <button className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-indigo-600/10">
        Enter Module
      </button>
      <button className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl transition-all font-bold">
        User Manual
      </button>
    </div>
  </div>
);

export default App;
