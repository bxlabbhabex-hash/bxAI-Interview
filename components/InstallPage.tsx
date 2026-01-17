
import React, { useState } from 'react';
import { 
  Monitor, 
  Smartphone, 
  Terminal as TerminalIcon, 
  Download, 
  Copy, 
  Check, 
  ChevronRight, 
  ShieldAlert,
  Apple,
  Cpu,
  Code,
  Sparkles,
  Shield,
  Info,
  Server,
  Lock,
  ChevronDown
} from 'lucide-react';

const InstallPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'windows' | 'linux' | 'mobile' | 'source'>('windows');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scripts = {
    windows: `Set-ExecutionPolicy Bypass -Scope Process -Force; 
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; 
iex ((New-Object System.Net.WebClient).DownloadString('https://sparkle-ai.com/install.ps1'))`,
    linux: `curl -fsSL https://sparkle-ai.com/install.sh | bash`,
    source: `pip install sparkle-ai-core && sparkle-ai init --stealth`
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-12">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-6">
            <Shield size={12} /> Deployment Hub v4.2
          </div>
          <h2 className="text-5xl font-black text-white tracking-tight leading-tight">Installation Center</h2>
          <p className="text-gray-400 mt-4 text-xl leading-relaxed">
            Deploy our undetectable stealth agents to bypass proctoring detection on any platform. 
            Select your operating system to begin.
          </p>
        </div>
        <div className="flex-shrink-0">
          <div className="bg-gray-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] flex items-center gap-6 shadow-2xl">
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Global Status</span>
              <span className="text-emerald-500 font-bold flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                All Nodes Secure
              </span>
            </div>
            <div className="h-10 w-[1px] bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Encrypted</span>
              <span className="text-white font-bold">AES-256</span>
            </div>
          </div>
        </div>
      </div>

      {/* OS Selection Tabs */}
      <div className="flex flex-wrap gap-3 p-2 bg-gray-900/40 border border-white/5 rounded-[2.5rem] w-fit mx-auto md:mx-0">
        <TabButton active={activeTab === 'windows'} onClick={() => setActiveTab('windows')} icon={<Monitor size={18} />} label="Windows" />
        <TabButton active={activeTab === 'linux'} onClick={() => setActiveTab('linux')} icon={<TerminalIcon size={18} />} label="Linux / macOS" />
        <TabButton active={activeTab === 'mobile'} onClick={() => setActiveTab('mobile')} icon={<Smartphone size={18} />} label="Mobile (APK/IPA)" />
        <TabButton active={activeTab === 'source'} onClick={() => setActiveTab('source')} icon={<Code size={18} />} label="Source / CLI" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Platform Specific Instruction Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-gray-900 border border-gray-800 rounded-[3rem] p-10 relative overflow-hidden group shadow-2xl">
            <div className="absolute top-0 right-0 p-32 bg-indigo-500/5 blur-[120px] rounded-full -mr-40 -mt-40 group-hover:bg-indigo-500/10 transition-all" />
            
            {activeTab === 'windows' && (
              <PlatformDetails 
                title="Windows Pro Agent" 
                version="v1.4.2"
                description="Our most robust agent. Runs as 'System Interrupt Host' to avoid detection by Task Manager and ring-0 proctoring engines."
                instructions={[
                  "Download the .exe installer below.",
                  "Run as Administrator to allow kernel-level masking.",
                  "Alternatively, use the PowerShell command for a portable setup."
                ]}
                features={["Process Masking", "Anti-Screen Capture", "Network Tunnelling"]}
                command={scripts.windows}
                onCopy={() => copyToClipboard(scripts.windows)}
                downloadLabel="Download Sparkle_Agent_Setup.exe"
              />
            )}

            {activeTab === 'linux' && (
              <PlatformDetails 
                title="Unix Stealth Shell" 
                version="v2.1.0"
                description="Lightweight shell script optimized for Ubuntu, Fedora, and macOS (Intel/M-series). Creates a localized sandbox."
                instructions={[
                  "Open your terminal window.",
                  "Paste the curl command below and hit Enter.",
                  "Grant permission when prompted for GUI overlay access."
                ]}
                features={["Sandboxed Session", "Automated Proxies", "Hide from Dock"]}
                command={scripts.linux}
                onCopy={() => copyToClipboard(scripts.linux)}
                downloadLabel="Download install.sh"
              />
            )}

            {activeTab === 'mobile' && (
              <div className="space-y-8">
                <div className="flex items-center gap-6 mb-4">
                  <div className="p-4 bg-indigo-500/20 rounded-3xl text-indigo-400">
                    <Smartphone size={40} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white">Mobile Stealth Suite</h3>
                    <p className="text-gray-400 mt-1">Cross-platform interview support for iOS & Android.</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <MobileCard 
                    icon={<Smartphone className="text-green-500" size={24} />} 
                    title="Android APK" 
                    desc="Stealth APK that bypasses the screen-recording notification bar on Android 10+."
                    btn="Get Sparkle_Mobile.apk"
                  />
                  <MobileCard 
                    icon={<Apple className="text-gray-200" size={24} />} 
                    title="iOS Enterprise IPA" 
                    desc="Side-loadable IPA via AltStore/Sideloadly. Uses custom enterprise cert for cloaking."
                    btn="Get Sparkle_iOS.ipa"
                  />
                </div>

                <div className="p-8 bg-indigo-950/20 border border-indigo-500/20 rounded-[2rem] space-y-4">
                  <h4 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                    <ShieldAlert size={16} /> iOS Instructions (Important)
                  </h4>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Due to Apple's strict sandboxing, the iOS version must be installed as an Enterprise Profile. 
                    Go to <span className="text-white font-mono">Settings > General > VPN & Device Management</span> after downloading to trust the certificate.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'source' && (
              <PlatformDetails 
                title="Python CLI Toolkit" 
                version="v0.8.0-beta"
                description="For security professionals. Run the agent directly from source or integrate it into your own scripts."
                instructions={[
                  "Ensure Python 3.9+ is installed.",
                  "Run the pip command to install the core package.",
                  "Initialize with the --stealth flag for maximum coverage."
                ]}
                features={["Headless Support", "Custom API Endpoints", "CI/CD Integration"]}
                command={scripts.source}
                onCopy={() => copyToClipboard(scripts.source)}
                downloadLabel="Download source.zip"
              />
            )}
          </div>

          {/* Verification Section */}
          <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 flex flex-col md:flex-row gap-10">
            <div className="flex-1 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-3">
                <Lock className="text-emerald-500" size={20} /> Build Verification
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Every agent is signed with our private certificate to ensure it hasn't been tampered with. 
                Verify the MD5/SHA256 hash before executing for total peace of mind.
              </p>
              <div className="flex gap-4">
                <button className="text-[10px] font-black uppercase text-indigo-400 tracking-widest hover:text-indigo-300 transition-all">Download Hash Signatures</button>
                <button className="text-[10px] font-black uppercase text-indigo-400 tracking-widest hover:text-indigo-300 transition-all">Verify Manual</button>
              </div>
            </div>
            <div className="w-full md:w-48 h-32 bg-gray-900 border border-white/5 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-black text-white">4.9/5</div>
                <div className="text-[8px] text-gray-600 font-black uppercase tracking-[0.2em] mt-1">Trust Score</div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
            <Sparkles className="absolute top-0 right-0 opacity-10 -mr-8 -mt-8 group-hover:rotate-12 transition-transform" size={160} />
            <h3 className="text-2xl font-bold mb-4">Pro Support</h3>
            <p className="text-indigo-100 text-sm leading-relaxed mb-8">
              Having trouble with installation? Our field agents are available 24/7 for 1-on-1 stealth deployment assistance.
            </p>
            <button className="w-full py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white rounded-2xl font-black uppercase tracking-widest transition-all">
              Live Support Chat
            </button>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 space-y-8">
            <h3 className="text-lg font-bold text-white flex items-center gap-3">
              <Info className="text-indigo-500" /> Platform Matrix
            </h3>
            <div className="space-y-4">
              <HardwareItem icon={<Cpu size={16} />} title="Intel / AMD" status="Native" />
              <HardwareItem icon={<Cpu size={16} />} title="Apple Silicon" status="Native" />
              <HardwareItem icon={<Server size={16} />} title="Virtual Machines" status="Compatible" />
              <HardwareItem icon={<Shield size={16} />} title="Cloud PC" status="Supported" />
            </div>
            
            <div className="pt-6 border-t border-white/5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Update Stream</span>
                <span className="text-[10px] text-emerald-500 font-bold uppercase">Automatic</span>
              </div>
              <p className="text-[11px] text-gray-600 leading-relaxed">
                Agents automatically download the latest bypass signatures every 24 hours to stay ahead of proctoring updates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}
  >
    {icon} {label}
  </button>
);

const PlatformDetails = ({ title, version, description, instructions, features, command, onCopy, downloadLabel }: any) => (
  <div className="space-y-8">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="p-4 bg-indigo-500/20 rounded-3xl text-indigo-400">
          <Download size={40} />
        </div>
        <div>
          <h3 className="text-3xl font-black text-white">{title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-indigo-500 text-xs font-mono font-bold">{version}</span>
            <div className="w-1 h-1 rounded-full bg-gray-700" />
            <span className="text-emerald-500 text-[10px] font-black uppercase tracking-widest">Stable Build</span>
          </div>
        </div>
      </div>
      <button className="flex items-center justify-center gap-3 px-8 py-4 bg-white text-indigo-600 hover:bg-gray-100 rounded-2xl font-black uppercase tracking-widest transition-all shadow-2xl shadow-white/5 transform hover:scale-105">
        <Download size={20} /> {downloadLabel}
      </button>
    </div>
    
    <p className="text-gray-400 text-lg leading-relaxed">{description}</p>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {features.map((f: string, i: number) => (
        <div key={i} className="flex items-center gap-3 text-[10px] font-black uppercase text-indigo-300 tracking-widest bg-indigo-500/5 border border-indigo-500/10 px-4 py-3 rounded-xl">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> {f}
        </div>
      ))}
    </div>

    <div className="space-y-6 pt-6 border-t border-white/5">
      <div className="space-y-4">
        <h4 className="text-xs font-black text-gray-500 uppercase tracking-widest">Installation Steps</h4>
        <div className="space-y-3">
          {instructions.map((step: string, i: number) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-gray-800 text-[10px] font-bold text-white flex items-center justify-center border border-white/5">{i + 1}</span>
              <p className="text-sm text-gray-400">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-xs font-black text-gray-500 uppercase tracking-widest block">Direct CLI Deployment</label>
        <div className="relative group/code">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-10 group-hover/code:opacity-20 transition duration-1000"></div>
          <pre className="relative bg-black/80 border border-white/10 rounded-2xl p-8 text-sm text-indigo-400 overflow-x-auto font-mono custom-scrollbar">
            <code>{command}</code>
          </pre>
          <button 
            onClick={onCopy}
            className="absolute top-6 right-6 p-3 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-xl transition-all shadow-xl"
            title="Copy Command"
          >
            <Copy size={18} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const MobileCard = ({ icon, title, desc, btn }: any) => (
  <div className="p-8 bg-gray-900/60 border border-white/5 rounded-[2.5rem] hover:border-indigo-500/30 transition-all group cursor-pointer shadow-xl">
    <div className="flex items-center gap-4 mb-6">
      <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">{icon}</div>
      <h4 className="text-xl font-bold text-white">{title}</h4>
    </div>
    <p className="text-sm text-gray-500 mb-8 leading-relaxed">{desc}</p>
    <button className="w-full py-4 bg-gray-800 group-hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all shadow-lg group-hover:shadow-indigo-600/20">
      {btn}
    </button>
  </div>
);

const HardwareItem = ({ icon, title, status }: any) => (
  <div className="flex items-center justify-between p-4 bg-black/20 rounded-2xl border border-white/5 group hover:border-white/10 transition-all">
    <div className="flex items-center gap-4 text-gray-300">
      <div className="text-indigo-500 group-hover:scale-110 transition-transform">{icon}</div>
      <span className="text-sm font-bold tracking-tight">{title}</span>
    </div>
    <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest bg-emerald-500/5 px-2 py-1 rounded-md">{status}</span>
  </div>
);

export default InstallPage;
