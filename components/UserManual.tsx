
import React from 'react';
import { 
  BookOpen, 
  Shield, 
  Terminal, 
  Mic, 
  Monitor, 
  Zap, 
  EyeOff, 
  AlertTriangle,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
  MessageSquare
} from 'lucide-react';

const UserManual: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400 mb-2">
          <BookOpen size={24} />
        </div>
        <h1 className="text-4xl font-black text-white tracking-tight uppercase">Operational Manual</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Learn how to deploy and manage your Sparkle AI Stealth Assistant for maximum interview success.
        </p>
      </div>

      {/* Quick Start Guide */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">1</div>
          <h2 className="text-2xl font-bold text-white">Quick Start Protocol</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StepCard 
            icon={<Zap className="text-yellow-500" />}
            title="Deploy"
            desc="Open the 'Deployment Center' and run the install script for your OS."
          />
          <StepCard 
            icon={<EyeOff className="text-emerald-500" />}
            title="Mask"
            desc="Toggle 'Stealth Mode' in the widget to hide the UI from standard screen capture."
          />
          <StepCard 
            icon={<MessageSquare className="text-indigo-500" />}
            title="Init"
            desc="Start the feed. AI will listen and provide answers in the secret HUD."
          />
        </div>
      </section>

      {/* Core Features */}
      <section className="bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-12 space-y-10">
        <h2 className="text-2xl font-bold text-white flex items-center gap-3">
          <Terminal className="text-indigo-500" /> Advanced Capabilities
        </h2>

        <div className="space-y-8">
          <FeatureItem 
            icon={<Monitor />}
            title="Real-time HUD (Heads-Up Display)"
            desc="The HUD is a transparent overlay that remains invisible to Zoom, Teams, and Google Meet. It displays the AI's suggested STARR-method answers directly on your screen."
          />
          <FeatureItem 
            icon={<Shield />}
            title="Stealth Engine (Bypass Modes)"
            desc="Fine-tune your invisibility levels. 'Kernel' level masking prevents proctoring software like TestGorilla or ProctorU from detecting active processes."
          />
          <FeatureItem 
            icon={<Mic />}
            title="Machine Sound Detection"
            desc="Sparkle AI differentiates between human interviewers and automated system sounds. It prioritizes the interviewer's question to generate relevant answers instantly."
          />
        </div>
      </section>

      {/* Safety & Best Practices */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-red-500/5 border border-red-500/10 rounded-[2rem] p-8">
          <h3 className="text-lg font-bold text-red-500 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} /> Forbidden Actions
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex gap-3">
              <span className="text-red-500 font-bold">•</span>
              Never share your full screen if 'Stealth Mode' is inactive.
            </li>
            <li className="flex gap-3">
              <span className="text-red-500 font-bold">•</span>
              Avoid looking directly at the HUD for long periods.
            </li>
            <li className="flex gap-3">
              <span className="text-red-500 font-bold">•</span>
              Don't read answers verbatim; adapt them to your natural voice.
            </li>
          </ul>
        </div>

        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem] p-8">
          <h3 className="text-lg font-bold text-emerald-500 mb-4 flex items-center gap-2">
            <CheckCircle2 size={20} /> Pro Tips
          </h3>
          <ul className="space-y-4 text-sm text-gray-400">
            <li className="flex gap-3">
              <span className="text-emerald-500 font-bold">•</span>
              Use a secondary monitor for the HUD to maintain eye contact.
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-500 font-bold">•</span>
              Set Stealth Intensity to 'High' when using web-based IDEs.
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-500 font-bold">•</span>
              Practice with 'Mock Mode' before your real interview.
            </li>
          </ul>
        </div>
      </div>

      {/* FAQ/Support */}
      <div className="text-center p-10 border-t border-white/5">
        <p className="text-gray-500 text-sm mb-6">Need mission-critical support?</p>
        <div className="flex justify-center gap-4">
          <button className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-600/20">Contact Field Agent</button>
          <button className="px-8 py-3 bg-gray-800 text-white rounded-xl font-bold">Access FAQ</button>
        </div>
      </div>
    </div>
  );
};

const StepCard = ({ icon, title, desc }: any) => (
  <div className="bg-gray-900/40 border border-white/5 p-6 rounded-2xl hover:border-indigo-500/30 transition-all">
    <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center mb-4">{icon}</div>
    <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
    <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
  </div>
);

const FeatureItem = ({ icon, title, desc }: any) => (
  <div className="flex gap-6 group">
    <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500/20 transition-all">
      {icon}
    </div>
    <div className="space-y-2">
      <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors">{title}</h3>
      <p className="text-sm text-gray-400 leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default UserManual;
