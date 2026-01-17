
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  BookOpen, 
  Settings, 
  Sparkles, 
  BarChart3,
  LogOut,
  Zap,
  EyeOff,
  Download,
  UserCog,
  ShieldAlert,
  Settings2,
  Terminal,
  Shield,
  Activity,
  MicOff,
  Mic
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  currentRole: 'user' | 'admin';
  onRoleChange: (role: 'user' | 'admin') => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout, currentRole, onRoleChange }) => {
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    const handleStatus = (e: any) => setSessionActive(e.detail.connected);
    window.addEventListener('bxlabs:session-status', handleStatus);
    return () => window.removeEventListener('bxlabs:session-status', handleStatus);
  }, []);

  const toggleSession = () => {
    if (sessionActive) {
      window.dispatchEvent(new CustomEvent('bxlabs:stop-session'));
    } else {
      window.dispatchEvent(new CustomEvent('bxlabs:start-session', { detail: { mode: 'copilot' } }));
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col hidden md:flex transition-all">
        <div className="p-6 flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="text-white fill-white" size={20} />
            </div>
            <span className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 tracking-tighter uppercase">
              WAR_ROOM
            </span>
          </div>
          <div className="mt-2 flex flex-col gap-1">
            <span className="text-[9px] font-mono text-indigo-400/80 font-bold uppercase tracking-widest">
              Designed by bxLabs
            </span>
            <div className="flex items-center gap-1.5">
              <Shield size={10} className="text-emerald-500" />
              <span className="text-[8px] font-mono text-emerald-500/80 font-bold uppercase tracking-widest">
                Protected by bxSecurity
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {currentRole === 'user' ? (
            <>
              <NavItem to="/" icon={<LayoutDashboard size={20} />} label="User Dashboard" />
              <NavItem to="/prep" icon={<BookOpen size={20} />} label="Question Bank" />
              <NavItem to="/install" icon={<Download size={20} />} label="Install Agent" />
              <NavItem to="/stealth" icon={<EyeOff size={20} />} label="Stealth Settings" />
              <NavItem to="/manual" icon={<Terminal size={20} />} label="User Manual" />
              <NavItem to="/analytics" icon={<BarChart3 size={20} />} label="My Performance" />
              <NavItem to="/security" icon={<ShieldCheck size={20} />} label="Privacy Vault" />
            </>
          ) : (
            <>
              <NavItem to="/admin" icon={<UserCog size={20} />} label="Admin Console" />
              <NavItem to="/admin/users" icon={<ShieldCheck size={20} />} label="User Management" />
              <NavItem to="/admin/stats" icon={<BarChart3 size={20} />} label="Global Analytics" />
              <NavItem to="/admin/bypass" icon={<ShieldAlert size={20} />} label="Bypass Controls" />
              <NavItem to="/admin/config" icon={<Settings2 size={20} />} label="System Config" />
            </>
          )}
        </nav>

        <div className="p-4 mt-auto border-t border-gray-800 space-y-3">
          <button 
            onClick={() => onRoleChange(currentRole === 'user' ? 'admin' : 'user')}
            className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-indigo-400 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-indigo-500/20 transition-all"
          >
            Switch to {currentRole === 'user' ? 'Admin' : 'User'} View
          </button>
          
          <div className="bg-gray-800/50 rounded-xl p-3 flex items-center gap-3 relative group/profile">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 border border-white/10" />
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate uppercase tracking-tight text-white">
                {currentRole === 'user' ? 'Premium Member' : 'System Admin'}
              </p>
              <p className="text-xs text-green-400 truncate font-mono text-[9px]">
                {currentRole === 'user' ? 'bxSecurity ACTIVE' : 'SYSTEM ROOT'}
              </p>
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 rounded-lg transition-all"
              title="Terminate Session"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 border-b border-gray-800 bg-gray-900/50 flex items-center justify-between px-8 z-10 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-200 uppercase tracking-tighter">
              {currentRole === 'user' ? 'INTERVIEW_WAR_ROOM' : 'ADMIN_COMMAND_CENTER'}
            </h1>
            <div className="h-4 w-[1px] bg-gray-700" />
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${sessionActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]' : (currentRole === 'user' ? 'bg-indigo-500' : 'bg-red-500')} animate-pulse`} />
              <span className={`text-[10px] ${sessionActive ? 'text-emerald-400' : (currentRole === 'user' ? 'text-indigo-400' : 'text-red-400')} font-bold uppercase tracking-wider`}>
                {sessionActive ? 'bxUplink Established' : (currentRole === 'user' ? 'bxLabs Stealth Live' : 'Global Monitor Active')}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleSession}
              className={`px-4 py-2 border rounded-xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                sessionActive 
                  ? 'bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-500/20' 
                  : 'bg-indigo-600 border-indigo-500 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/10'
              }`}
            >
              {sessionActive ? <><MicOff size={16} /> End Session</> : <><Mic size={16} /> Start Session</>}
            </button>
            <div className="h-6 w-[1px] bg-gray-800" />
            <NavLink to="/install" className="p-2 hover:bg-white/5 text-gray-400 rounded-lg transition-all" title="Deployment Hub">
              <Download size={20} />
            </NavLink>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-gray-950 p-8 pb-24">
          {children}
        </div>

        {/* Global Footer */}
        <footer className="absolute bottom-0 left-0 w-full h-12 border-t border-gray-800 bg-gray-950/80 backdrop-blur-md flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
            <span>&copy; 2025 bxLabs Inc.</span>
            <div className="w-1 h-1 bg-gray-800 rounded-full" />
            <span className="text-indigo-500/60">Securely designed by bxLabs</span>
          </div>
          <div className="flex items-center gap-2">
            <Shield size={12} className="text-emerald-500" />
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Protected by bxSecurity</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

const NavItem = ({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
        isActive
          ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20 shadow-inner'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`
    }
  >
    {icon}
    {label}
  </NavLink>
);

export default Layout;
