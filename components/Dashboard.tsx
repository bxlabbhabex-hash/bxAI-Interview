
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { 
  Target, Brain, Award, Shield, EyeOff, MonitorOff, Terminal, Download, Zap, 
  Play, Mic, BrainCircuit, BookOpen, Waves, Activity, Sparkles
} from 'lucide-react';

const data = [
  { name: 'Mon', prep: 45, confidence: 60 },
  { name: 'Tue', prep: 52, confidence: 65 },
  { name: 'Wed', prep: 88, confidence: 75 },
  { name: 'Thu', prep: 65, confidence: 72 },
  { name: 'Fri', prep: 95, confidence: 88 },
  { name: 'Sat', prep: 40, confidence: 92 },
  { name: 'Sun', prep: 30, confidence: 95 },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    const handleStatus = (e: any) => setSessionActive(e.detail.connected);
    window.addEventListener('bxlabs:session-status', handleStatus);
    return () => window.removeEventListener('bxlabs:session-status', handleStatus);
  }, []);

  const initiateSession = (mode: 'copilot' | 'practice') => {
    window.dispatchEvent(new CustomEvent('bxlabs:start-session', { detail: { mode } }));
  };

  const terminateSession = () => {
    window.dispatchEvent(new CustomEvent('bxlabs:stop-session'));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-gradient-to-r from-indigo-950 via-gray-900 to-purple-950 border border-white/10 rounded-[2.5rem] p-10 flex flex-col md:flex-row justify-between items-center gap-10 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-24 bg-indigo-500/10 blur-[120px] rounded-full group-hover:bg-indigo-500/20 transition-all" />
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-xl border border-white/10">
                <Shield className="text-white" size={24} />
             </div>
             <div className="flex flex-col">
                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">WAR_ROOM_CORE</h2>
                <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest mt-1">bxSecurity Verified</span>
             </div>
          </div>
          <p className="text-gray-400 max-w-xl text-lg leading-relaxed">
            Identity 100% cloaked. Use <span className="text-white font-bold">Initiate Copilot</span> to start your live session assistant.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 ${sessionActive ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-gray-800 border-white/5 text-gray-500'}`}>
              <Activity size={14} className={sessionActive ? 'animate-pulse' : ''} />
              <span className="text-[10px] font-black uppercase tracking-widest">{sessionActive ? 'System Live' : 'Uplink Offline'}</span>
            </div>
            {sessionActive && (
              <button onClick={terminateSession} className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-400 transition-colors">Emergency Terminate</button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3 relative z-10 w-full md:w-auto">
          {sessionActive ? (
            <div className="p-6 bg-black/40 border border-indigo-500/20 rounded-[1.5rem] flex flex-col items-center gap-4 animate-in zoom-in">
              <Sparkles className="text-indigo-400 animate-spin-slow" size={32} />
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">bxLink Established</p>
              <button onClick={() => window.dispatchEvent(new CustomEvent('bxlabs:start-session'))} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs">Open HUD</button>
            </div>
          ) : (
            <>
              <button 
                onClick={() => initiateSession('copilot')} 
                className="px-10 py-5 bg-white text-indigo-600 rounded-[1.5rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3"
              >
                <Zap size={20} /> Initiate Copilot
              </button>
              <button 
                onClick={() => initiateSession('practice')} 
                className="px-10 py-5 bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 rounded-[1.5rem] font-black uppercase tracking-widest hover:bg-indigo-600/30 transition-all flex items-center justify-center gap-3"
              >
                <BrainCircuit size={20} /> Start Practice
              </button>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Target className="text-indigo-500" />} title="Concepts Mastered" value="452" change="+15%" />
        <StatCard icon={<Brain className="text-purple-500" />} title="Intelligence Index" value="94%" change="+4.2%" />
        <StatCard icon={<Award className="text-emerald-500" />} title="Pass Rate (Sim)" value="88%" change="+2" />
        <StatCard icon={<Shield className="text-orange-500" />} title="Anonymity Level" value="100%" change="bxSECURE" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
            <div className="flex items-center justify-between mb-10">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Waves className="text-indigo-500" /> Neural Performance
              </h3>
            </div>
            <div className="h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorConfidence" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <Area type="monotone" dataKey="confidence" stroke="#6366f1" fillOpacity={1} fill="url(#colorConfidence)" strokeWidth={4} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="space-y-8 h-full">
           <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-8 h-full">
              <h3 className="text-xl font-bold text-white mb-8">System Cloaks</h3>
              <div className="space-y-4">
                <StealthItem icon={<EyeOff size={18} />} title="Screen Capture" status="Masked" />
                <StealthItem icon={<MonitorOff size={18} />} title="Process Tree" status="Obfuscated" />
                <StealthItem icon={<Terminal size={18} />} title="Shell Routing" status="Encrypted" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, change }: any) => (
  <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-8 group hover:border-indigo-500/20 transition-all">
    <div className="p-4 bg-black/30 rounded-2xl w-fit mb-6 text-indigo-500 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-[10px] text-gray-600 font-black uppercase tracking-widest">{title}</p>
    <div className="flex items-end gap-3 mt-1">
      <h4 className="text-4xl font-black text-white tracking-tighter">{value}</h4>
      <span className="text-xs text-emerald-500 font-black mb-2">{change}</span>
    </div>
  </div>
);

const StealthItem = ({ icon, title, status }: any) => (
  <div className="flex items-center gap-4 p-4 bg-black/20 rounded-[1.5rem] border border-white/5 group">
    <div className="p-3 bg-gray-900 rounded-xl text-indigo-500">{icon}</div>
    <div className="flex-1">
      <p className="text-sm font-bold text-gray-200">{title}</p>
      <div className="flex items-center gap-2 mt-0.5">
         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
         <span className="text-[9px] font-black uppercase text-emerald-500 tracking-tighter font-mono">{status}</span>
      </div>
    </div>
  </div>
);

export default Dashboard;
