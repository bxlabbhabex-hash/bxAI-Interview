
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Users, Activity, CreditCard, AlertCircle, TrendingUp, ShieldCheck, Globe, Search,
  Terminal, Server, Lock, Zap, Clock, ShieldAlert, Filter, User, Mail, ChevronRight, X
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const adminStats = [
  { name: 'Jan', users: 4000, revenue: 2400 },
  { name: 'Feb', users: 3000, revenue: 1398 },
  { name: 'Mar', users: 2000, revenue: 9800 },
  { name: 'Apr', users: 2780, revenue: 3908 },
  { name: 'May', users: 1890, revenue: 4800 },
  { name: 'Jun', users: 2390, revenue: 3800 },
];

const MOCK_USERS = [
  { id: 'u1', name: 'Alex Rivera', email: 'alex@rivera.sh', plan: 'Enterprise', status: 'Live' },
  { id: 'u2', name: 'Sarah Chen', email: 'schen@dev.io', plan: 'Premium', status: 'Idle' },
  { id: 'u3', name: 'Marcus Thorne', email: 'mthorne@sec.net', plan: 'Enterprise', status: 'Live' },
  { id: 'u4', name: 'Elena Vance', email: 'vance@blackmesa.org', plan: 'Premium', status: 'Offline' },
];

const AdminDashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [logs, setLogs] = useState([
    { id: 1, time: '14:20:01', event: 'New Bypass Node Initialized (Tokyo)', type: 'system' },
    { id: 2, time: '14:20:05', event: 'Proctoring Signature Hash Blocked (Teams v1.7)', type: 'security' },
    { id: 3, time: '14:21:12', event: 'User ID: #8210 - Stealth Mode Activated', type: 'user' },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString(),
        event: [
          'Kernel Cloak Updated for Windows 11 Build 22H2',
          'Encrypted Socket Established (Node-7)',
          'Automated Answer Triggered: #9421',
          'New Enterprise Subscription: $4,200',
          'Failed Detection Attempt: Proctor-X'
        ][Math.floor(Math.random() * 5)],
        type: Math.random() > 0.5 ? 'system' : 'security'
      };
      setLogs(prev => [newLog, ...prev].slice(0, 10));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logs;
    return logs.filter(log => 
      log.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.time.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [logs, searchQuery]);

  const filteredUsers = useMemo(() => {
    if (!searchQuery) return [];
    return MOCK_USERS.filter(user => 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header with Search */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">System Root Control</h2>
          <p className="text-gray-500 font-mono text-xs mt-1 tracking-widest">SPARKLE GLOBAL INFRASTRUCTURE MONITOR</p>
        </div>

        <div className="flex-1 w-full lg:max-w-xl relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
          </div>
          <input 
            type="text" 
            placeholder="Search users by name/email or query system logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/50 border border-white/5 rounded-2xl py-4 pl-12 pr-12 text-sm text-white focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          )}
        </div>

        <div className="flex gap-3 hidden sm:flex">
          <StatusBadge icon={<Server size={14} />} label="12 Global Nodes" color="indigo" />
          <StatusBadge icon={<Lock size={14} />} label="99.9% Uptime" color="emerald" />
        </div>
      </div>

      {/* Conditional User Search Results */}
      {searchQuery && filteredUsers.length > 0 && (
        <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-[2rem] p-6 animate-in slide-in-from-top-2">
          <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4 flex items-center gap-2">
            <User size={14} /> User Matches ({filteredUsers.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredUsers.map(user => (
              <div key={user.id} className="bg-gray-950 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-indigo-500/30 transition-all cursor-pointer">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase">
                    {user.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-white truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-600 truncate">{user.email}</p>
                  </div>
                </div>
                <ChevronRight size={14} className="text-gray-700 group-hover:text-indigo-500 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users />} title="Fleet Users" value="24,512" change="+12.5%" />
        <StatCard icon={<Activity />} title="Active Feed" value="892" change="+5.2%" />
        <StatCard icon={<CreditCard />} title="Total Revenue" value="$142,000" change="+18.4%" />
        <StatCard icon={<ShieldCheck />} title="Blocked Threats" value="1.2M" change="LIFETIME" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-900/40 border border-white/5 rounded-[2rem] p-8 shadow-2xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <TrendingUp className="text-indigo-500" /> Revenue vs Adoption
            </h3>
            <select className="bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-xs text-white outline-none">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adminStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                  contentStyle={{ backgroundColor: '#000', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px' }} 
                />
                <Bar dataKey="users" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={24} />
                <Bar dataKey="revenue" fill="#a855f7" radius={[6, 6, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-black/50 border border-white/5 rounded-[2rem] p-8 shadow-inner overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-3">
              <Terminal className="text-emerald-500" /> Global Event Stream
            </h3>
            {searchQuery && (
              <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">
                Filtered: {filteredLogs.length}
              </span>
            )}
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-20 py-10">
                <Search size={32} className="mb-4" />
                <p className="text-xs font-bold uppercase tracking-widest text-center leading-relaxed">No matching log entries found for "{searchQuery}"</p>
              </div>
            ) : (
              filteredLogs.map(log => (
                <div key={log.id} className="flex gap-4 animate-in slide-in-from-right-2">
                  <span className="text-[10px] font-mono text-gray-600 mt-1">{log.time}</span>
                  <div className="flex-1">
                    <p className={`text-[11px] font-medium leading-tight ${log.type === 'security' ? 'text-indigo-400' : 'text-gray-300'}`}>
                      {log.event}
                    </p>
                    <div className={`h-1 w-8 mt-2 rounded-full ${log.type === 'security' ? 'bg-indigo-500/30' : 'bg-gray-800'}`} />
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="text-[9px] font-black uppercase text-gray-600 tracking-widest">Streaming live...</span>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" />
          </div>
        </div>
      </div>

      <div className="bg-red-500/10 border border-red-500/20 rounded-[2rem] p-6 flex flex-col md:flex-row items-center justify-between gap-6 group">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-red-500/20 rounded-2xl text-red-500 group-hover:scale-110 transition-transform">
            <ShieldAlert size={32} />
          </div>
          <div className="text-center md:text-left">
            <h4 className="font-black text-white uppercase tracking-tight">Anomalous Activity Triggered</h4>
            <p className="text-sm text-red-400/80 mt-1 max-w-xl">
              12 users are showing inconsistent keystroke entropy on build #941. Automated containment protocol suggests immediate node rotation.
            </p>
          </div>
        </div>
        <button className="whitespace-nowrap px-8 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-red-600/20">
          Rotate Nodes
        </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change }: any) => (
  <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-8 group hover:border-indigo-500/30 transition-all cursor-default">
    <div className="p-4 bg-black/40 rounded-2xl w-fit mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{title}</p>
    <div className="flex items-end gap-3 mt-1">
      <h4 className="text-4xl font-black text-white tracking-tighter">{value}</h4>
      <span className="text-xs text-emerald-400 font-black mb-2">{change}</span>
    </div>
  </div>
);

const StatusBadge = ({ icon, label, color }: any) => (
  <div className={`flex items-center gap-2 px-4 py-2 bg-${color}-500/10 border border-${color}-500/20 text-${color}-400 rounded-xl text-[10px] font-black uppercase tracking-widest`}>
    {icon} {label}
  </div>
);

export default AdminDashboard;
