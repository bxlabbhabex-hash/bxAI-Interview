
import React, { useState, useEffect } from 'react';
import { Sparkles, ShieldCheck, Mail, Smartphone, Lock, ArrowRight, Fingerprint, ShieldAlert, Zap, User, UserCog, Shield, X, BellRing } from 'lucide-react';

interface AuthProps {
  onLogin: (role: 'user' | 'admin') => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<'signin' | 'signup' | 'verify'>('signin');
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [notification, setNotification] = useState<{ message: string; code: string } | null>(null);

  const handleAuthAction = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate network latency for decryption/deployment
    setTimeout(() => {
      setLoading(false);
      if (view === 'signup') {
        setView('verify');
        // Trigger Mock OTP Delivery
        setNotification({
          message: "bxSecurity Signal: Encrypted verification code delivered to your secure channel.",
          code: "123456"
        });
      } else {
        onLogin('user');
      }
    }, 1200);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Only numbers
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Auto-dismiss notification
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 8000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Mock Notification Toast */}
      {notification && (
        <div className="fixed top-6 right-6 z-[100] w-full max-w-sm animate-in slide-in-from-right-8 duration-500">
          <div className="bg-gray-900/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl p-4 shadow-2xl flex gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 h-fit">
              <BellRing size={20} className="animate-bounce" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">bxLabs Security Signal</p>
              <p className="text-xs text-gray-300 leading-tight">{notification.message}</p>
              <div className="mt-2 flex items-center gap-2">
                <span className="text-[10px] text-gray-500 font-bold uppercase">Code:</span>
                <span className="text-sm font-mono font-black text-white tracking-widest bg-emerald-500/20 px-2 py-0.5 rounded-md">{notification.code}</span>
              </div>
            </div>
            <button onClick={() => setNotification(null)} className="text-gray-600 hover:text-white transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/30 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-600/30 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-md z-10 space-y-8">
        <div className="text-center">
          <div className="inline-flex p-4 bg-gradient-to-tr from-indigo-600 to-purple-600 rounded-3xl shadow-2xl shadow-indigo-500/20 mb-6 group hover:rotate-12 transition-transform cursor-default">
            <Zap className="text-white" size={40} />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic">INTERVIEW_WAR_ROOM</h1>
          <div className="flex flex-col gap-1 mt-2">
            <p className="text-indigo-400 font-mono text-[10px] uppercase tracking-[0.4em]">Securely designed by bxLabs</p>
            <div className="flex items-center justify-center gap-2">
              <Shield size={12} className="text-emerald-500" />
              <p className="text-emerald-500/80 font-mono text-[9px] uppercase tracking-[0.2em]">Protected by bxSecurity</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
          
          {view !== 'verify' ? (
            <form onSubmit={handleAuthAction} className="space-y-6">
              <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5">
                <button type="button" onClick={() => setView('signin')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${view === 'signin' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300'}`}>Sign In</button>
                <button type="button" onClick={() => setView('signup')} className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${view === 'signup' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300'}`}>Sign Up</button>
              </div>

              <div className="space-y-4">
                <AuthInput icon={<Mail size={18} />} placeholder="Secure Email" type="email" />
                <AuthInput icon={<Lock size={18} />} placeholder="Passphrase" type="password" />
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-indigo-600/20 active:scale-[0.98] disabled:opacity-50">
                {loading ? 'Decrypting...' : <>{view === 'signin' ? 'Access System' : 'Deploy Account'} <ArrowRight size={18} /></>}
              </button>
            </form>
          ) : (
            <div className="space-y-8 text-center py-4">
              <div className="space-y-2">
                <ShieldCheck size={48} className="text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">Security Clearance</h3>
                <p className="text-xs text-gray-500 leading-relaxed">6-digit code transmitted via encrypted bxLabs signal. Check your notification hub.</p>
              </div>
              <div className="flex justify-center gap-2">
                {otp.map((d, i) => (
                  <input 
                    key={i} 
                    id={`otp-${i}`} 
                    type="text" 
                    maxLength={1} 
                    value={d} 
                    onChange={(e) => handleOtpChange(i, e.target.value)} 
                    onKeyDown={(e) => {
                      if (e.key === 'Backspace' && !otp[i] && i > 0) {
                        document.getElementById(`otp-${i - 1}`)?.focus();
                      }
                    }}
                    className="w-11 h-14 bg-black/60 border border-white/10 rounded-xl text-center text-xl font-bold text-indigo-400 focus:border-indigo-500 outline-none transition-all shadow-inner font-mono" 
                  />
                ))}
              </div>
              <div className="space-y-4">
                <button onClick={() => onLogin('user')} className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest transition-all shadow-lg shadow-emerald-600/20">Verify Identity</button>
                <button onClick={() => setView('signup')} className="text-[10px] font-bold text-gray-600 uppercase tracking-widest hover:text-gray-400 transition-colors">Resend Secure Signal</button>
              </div>
            </div>
          )}

          <div className="relative mt-8 py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold"><span className="bg-[#0b0f1a] px-4 text-gray-600">Demo Testing Hub</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <button onClick={() => onLogin('user')} className="flex items-center justify-center gap-2 py-3 bg-gray-900/50 hover:bg-gray-800 border border-white/5 text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group">
              <User size={14} className="group-hover:scale-110" /> User Demo
            </button>
            <button onClick={() => onLogin('admin')} className="flex items-center justify-center gap-2 py-3 bg-gray-900/50 hover:bg-gray-800 border border-white/5 text-purple-400 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all group">
              <UserCog size={14} className="group-hover:scale-110" /> Admin Demo
            </button>
          </div>
        </div>

        <div className="flex justify-center gap-8 text-gray-700">
           <div className="flex items-center gap-2"><Fingerprint size={16} /><span className="text-[9px] font-bold uppercase tracking-widest">Biometric Ready</span></div>
           <div className="flex items-center gap-2"><ShieldAlert size={16} /><span className="text-[9px] font-bold uppercase tracking-widest">AES-256 Valid</span></div>
        </div>
      </div>
    </div>
  );
};

const AuthInput = ({ icon, placeholder, type }: any) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors">{icon}</div>
    <input type={type} required placeholder={placeholder} className="w-full bg-black/60 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm text-white placeholder:text-gray-700 focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 outline-none transition-all shadow-inner" />
  </div>
);

export default Auth;
