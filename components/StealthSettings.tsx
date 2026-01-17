
import React, { useState } from 'react';
import { Shield, EyeOff, Monitor, Lock, ShieldAlert, Cpu, Layers, Activity, Zap, Check, ExternalLink } from 'lucide-react';

const BYPASS_MODULES = [
  { id: 'zoom', name: 'Zoom Runtime Wrapper', desc: 'Bypasses active window detection and red-box recording indicators.', status: 'Active' },
  { id: 'teams', name: 'Teams Background Cloak', desc: 'Hides the agent process from the Teams meeting lifecycle manager.', status: 'Active' },
  { id: 'hackerrank', name: 'Tab-Switch Guard', desc: 'Maintains focus state on the browser even when checking Sparkle AI answers.', status: 'Active' },
  { id: 'proctor', name: 'Kernel Process Mask', desc: 'Injects dummy noise into proctoring software process trees.', status: 'Experimental' },
];

const StealthSettings: React.FC = () => {
  const [invisibilityLevel, setInvisibilityLevel] = useState(88);
  const [activeModules, setActiveModules] = useState<string[]>(['zoom', 'hackerrank', 'teams']);

  const toggleModule = (id: string) => {
    setActiveModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-4">
            <EyeOff className="text-indigo-500" size={32} />
            Stealth Settings
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Fine-tune your invisibility levels for specific proctoring software.</p>
        </div>
        <div className="px-6 py-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center gap-4">
           <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Cloak Status</span>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Undetectable</span>
           </div>
           <div className="w-12 h-12 rounded-full border-2 border-emerald-500/20 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-emerald-500/10 rounded-full animate-ping" />
              <Shield className="text-emerald-500" size={20} />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Intensity Slider */}
          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[100px] rounded-full -mr-40 -mt-40 transition-all group-hover:bg-indigo-500/10" />
            
            <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Invisibility Intensity</h3>
                  <p className="text-gray-500 text-sm">Higher levels increase bypass power but consume more system entropy.</p>
                </div>
                <div className="text-right">
                  <span className="text-4xl font-black text-indigo-400 tracking-tighter">{invisibilityLevel}%</span>
                  <p className="text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">Alpha Vector</p>
                </div>
              </div>

              <div className="relative pt-4">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={invisibilityLevel} 
                  onChange={(e) => setInvisibilityLevel(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between mt-4">
                  <LevelMark label="Standard" active={invisibilityLevel < 33} />
                  <LevelMark label="Encrypted" active={invisibilityLevel >= 33 && invisibilityLevel < 66} />
                  <LevelMark label="Shadow" active={invisibilityLevel >= 66 && invisibilityLevel < 90} />
                  <LevelMark label="Ghost Protocol" active={invisibilityLevel >= 90} highlight />
                </div>
              </div>
            </div>
          </div>

          {/* Module Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BYPASS_MODULES.map(module => (
              <button 
                key={module.id} 
                onClick={() => toggleModule(module.id)}
                className={`text-left p-8 rounded-[2rem] border transition-all relative overflow-hidden group ${
                  activeModules.includes(module.id) 
                    ? 'bg-indigo-900/10 border-indigo-500/30' 
                    : 'bg-gray-900 border-gray-800 grayscale hover:grayscale-0'
                }`}
              >
                {activeModules.includes(module.id) && (
                  <div className="absolute top-4 right-4">
                     <Check size={18} className="text-emerald-500" />
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${activeModules.includes(module.id) ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-800 text-gray-500'}`}>
                  {module.id === 'zoom' && <Monitor size={24} />}
                  {module.id === 'teams' && <Layers size={24} />}
                  {module.id === 'hackerrank' && <Zap size={24} />}
                  {module.id === 'proctor' && <Cpu size={24} />}
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{module.name}</h4>
                <p className="text-xs text-gray-500 leading-relaxed mb-4">{module.desc}</p>
                <div className="flex items-center gap-2">
                   <div className={`w-1.5 h-1.5 rounded-full ${module.status === 'Active' ? 'bg-emerald-500' : 'bg-yellow-500'}`} />
                   <span className="text-[10px] font-black uppercase text-gray-600 tracking-widest">{module.status}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
           <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <ShieldAlert size={120} className="absolute top-0 right-0 opacity-10 -mr-8 -mt-8 group-hover:rotate-12 transition-transform" />
              <h3 className="text-xl font-bold mb-4">Emergency Wipe</h3>
              <p className="text-indigo-100 text-sm leading-relaxed mb-6">
                In case of physical device inspection, trigger the Emergency Wipe to instantly clear all kernel logs and traces of Sparkle AI.
              </p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest transition-all">
                Initialize Wipe
              </button>
           </div>

           <div className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-8">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                <Activity className="text-indigo-500" /> Proctor Intelligence
              </h3>
              <div className="space-y-6">
                 <IntellItem label="Detection Heuristics" value="v4.2" />
                 <IntellItem label="Active Bypass Shards" value="12" />
                 <IntellItem label="Proctor Signature Database" value="1,240+" />
                 <IntellItem label="Last Update" value="6m ago" />
              </div>
              <div className="mt-8 pt-6 border-t border-white/5">
                 <button className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
                    View Threat Map <ExternalLink size={12} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const LevelMark = ({ label, active, highlight }: any) => (
  <div className="flex flex-col items-center gap-2">
     <div className={`w-1 h-3 rounded-full ${active ? (highlight ? 'bg-indigo-400' : 'bg-indigo-600') : 'bg-gray-800'}`} />
     <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? 'text-gray-300' : 'text-gray-700'}`}>{label}</span>
  </div>
);

const IntellItem = ({ label, value }: any) => (
  <div className="flex justify-between items-center">
    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{label}</span>
    <span className="text-xs font-mono text-indigo-400">{value}</span>
  </div>
);

export default StealthSettings;
