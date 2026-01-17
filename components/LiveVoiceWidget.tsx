
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { MicOff, X, Minimize2, Settings2, Terminal, Monitor, BrainCircuit, Radio, Layers, ChevronRight, Cpu, Zap, ShieldAlert, Binary, Mic2, Waves, Brain, AlertCircle, Edit2, Shield, Lock, Activity as ActivityIcon, UserCircle2, Sparkles, Ghost, EyeOff, ClipboardCheck, Volume2, Link as LinkIcon, Command, CheckCircle2 } from 'lucide-react';
import { encode, decode, decodeAudioData, createPcmBlob } from '../utils/audio-utils';
import AudioVisualizer from './AudioVisualizer';

const VOICE_OPTIONS = ['Charon', 'Puck', 'Kore', 'Fenrir', 'Zephyr'];
const MODEL_OPTIONS = [
  { id: 'gemini-2.5-flash-native-audio-preview-12-2025', name: 'Gemini 2.5 Flash (Native Audio)', desc: 'bxLabs Voice Engine' },
  { id: 'gemini-3-flash-preview', name: 'Gemini 3 Flash (Latest)', desc: 'bxSecurity Hardened' },
  { id: 'gemini-3-pro-preview', name: 'Gemini 3 Pro (Advanced)', desc: 'bxLabs Cognitive Core' }
];

const BYPASS_MODULES = [
  { id: 'zoom', name: 'Zoom Wrapper', icon: <Monitor size={14} /> },
  { id: 'teams', name: 'Teams Cloak', icon: <Layers size={14} /> },
  { id: 'hackerrank', name: 'Tab Guard', icon: <Zap size={14} /> },
  { id: 'proctor', name: 'Kernel Mask', icon: <Cpu size={14} /> },
];

const LiveVoiceWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHUD, setIsHUD] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isStealth, setIsStealth] = useState(true);
  const [mode, setMode] = useState<'copilot' | 'practice'>('copilot');
  const [audioSource, setAudioSource] = useState<'mic' | 'system' | 'dual'>('dual');
  const [activeSourceLabel, setActiveSourceLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioActivity, setAudioActivity] = useState(0);

  const [agentName, setAgentName] = useState('bxCopilot_v4');
  const [isEditingName, setIsEditingName] = useState(false);
  const [invisibilityLevel, setInvisibilityLevel] = useState(88);
  const [activeBypassModules, setActiveBypassModules] = useState<string[]>(['zoom', 'teams', 'hackerrank']);
  const [transcriptionHistory, setTranscriptionHistory] = useState<{ text: string; role: 'user' | 'model' | 'analysis' }[]>([]);
  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');
  const [renderTrigger, setRenderTrigger] = useState(0);

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'general' | 'stealth'>('general');
  const [selectedVoice, setSelectedVoice] = useState('Kore');
  const [selectedModel, setSelectedModel] = useState(MODEL_OPTIONS[0].id);

  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const streamRef = useRef<MediaStream | null>(null);
  const sessionRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);

  const cleanup = useCallback(() => {
    if (sessionRef.current) {
      sessionRef.current.close?.();
      sessionRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (sourcesRef.current) {
      sourcesRef.current.forEach(source => {
        try { source.stop(); } catch (e) { }
      });
      sourcesRef.current.clear();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsSpeaking(false);
    setAudioActivity(0);
    setActiveSourceLabel(null);
    nextStartTimeRef.current = 0;
    currentInputTranscription.current = '';
    currentOutputTranscription.current = '';
    window.dispatchEvent(new CustomEvent('bxlabs:session-status', { detail: { connected: false } }));
  }, []);

  const monitorAudioActivity = (analyser: AnalyserNode) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const update = () => {
      if (!analyserRef.current) return;
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + (b / 128), 0) / dataArray.length;
      setAudioActivity(average);
      animationFrameRef.current = requestAnimationFrame(update);
    };
    update();
  };

  const startSession = async () => {
    if (isConnected || isConnecting) return;
    setIsConnecting(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      inputAudioContextRef.current = inputCtx;
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      outputAudioContextRef.current = outputCtx;

      let finalStream: MediaStream;
      let label = "Default Audio Source";

      if (audioSource === 'dual' || audioSource === 'system') {
        const sysStream = await navigator.mediaDevices.getDisplayMedia({
          video: { displaySurface: "browser" },
          audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
          systemAudio: 'include'
        } as any);

        const audioTracks = sysStream.getAudioTracks();
        if (audioTracks.length === 0) {
          sysStream.getTracks().forEach(t => t.stop());
          throw new Error("bxLabs Audio Capture Error: No audio track found. Ensure you checked 'Share tab audio'.");
        }
        sysStream.getVideoTracks().forEach(track => track.stop());

        if (audioSource === 'dual') {
          const micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } });
          const destination = inputCtx.createMediaStreamDestination();
          const micSource = inputCtx.createMediaStreamSource(micStream);
          const sysSource = inputCtx.createMediaStreamSource(sysStream);
          micSource.connect(destination);
          sysSource.connect(destination);
          finalStream = destination.stream;
          streamRef.current = new MediaStream([...micStream.getTracks(), ...sysStream.getTracks()]);
          label = `DUAL: MIC + SYSTEM`;
        } else {
          finalStream = sysStream;
          streamRef.current = finalStream;
          label = `SYSTEM AUDIO`;
        }
      } else {
        const micStream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } });
        finalStream = micStream;
        streamRef.current = finalStream;
        label = `MIC ONLY`;
      }

      setActiveSourceLabel(label);

      const sessionPromise = ai.live.connect({
        model: selectedModel,
        callbacks: {
          onopen: () => {
            setIsConnected(true);
            setIsConnecting(false);
            window.dispatchEvent(new CustomEvent('bxlabs:session-status', { detail: { connected: true } }));
            const source = inputCtx.createMediaStreamSource(finalStream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            const analyser = inputCtx.createAnalyser();
            analyserRef.current = analyser;
            monitorAudioActivity(analyser);

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              sessionPromise.then((session) => {
                if (session) session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(analyser);
            analyser.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
              setRenderTrigger(prev => prev + 1);
            } else if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
              setRenderTrigger(prev => prev + 1);
            }

            if (message.serverContent?.turnComplete) {
              setTranscriptionHistory(prev => [
                ...prev,
                ...(currentInputTranscription.current ? [{ text: currentInputTranscription.current, role: 'user' as const }] : []),
                ...(currentOutputTranscription.current ? [{ text: currentOutputTranscription.current, role: 'model' as const }] : [])
              ].slice(-15));
              currentInputTranscription.current = '';
              currentOutputTranscription.current = '';
              setRenderTrigger(prev => prev + 1);
            }

            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData) {
              setIsSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(audioData), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.onended = () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0) setIsSpeaking(false);
              };
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
          },
          onerror: (e) => { 
            console.error("Live Error:", e);
            setError("Connection failed. Check API key and system permissions."); 
            cleanup(); 
          },
          onclose: () => cleanup(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: selectedVoice } } },
          systemInstruction: mode === 'copilot' 
            ? "You are bxCopilot, a professional technical interview assistant. Provide concise, expert answers using the STARR method. Focus on helping the candidate succeed in high-pressure engineering interviews." 
            : "You are a supportive interview practice coach. Focus on providing constructive feedback on pacing, confidence, and content quality.",
          inputAudioTranscription: {},
          outputAudioTranscription: {},
        },
      });
      sessionRef.current = await sessionPromise;
    } catch (err: any) { 
      setError(err.message || "Failed to start bxLabs session."); 
      cleanup(); 
    }
  };

  useEffect(() => {
    if (isConnected && sessionRef.current) {
      try {
        sessionRef.current.updateConfig({
          systemInstruction: mode === 'copilot' 
            ? "You are bxCopilot, a professional technical interview assistant. Provide concise, expert answers using the STARR method." 
            : "You are a supportive interview practice coach. Focus on providing constructive feedback."
        });
      } catch (e) {
        sessionRef.current.sendRealtimeInput({
          text: `[SYSTEM_SIGNAL] SWITCH_MODE: ${mode.toUpperCase()}. Please adjust your persona immediately.`
        });
      }
    }
  }, [mode]);

  useEffect(() => {
    const handleGlobalStart = (e: any) => {
      const { mode: targetMode } = e.detail || {};
      if (targetMode) setMode(targetMode);
      setIsExpanded(true);
      if (!isConnected) startSession();
    };
    const handleGlobalStop = () => cleanup();

    window.addEventListener('bxlabs:start-session', handleGlobalStart);
    window.addEventListener('bxlabs:stop-session', handleGlobalStop);
    return () => {
      window.removeEventListener('bxlabs:start-session', handleGlobalStart);
      window.removeEventListener('bxlabs:stop-session', handleGlobalStop);
    };
  }, [isConnected, startSession, cleanup]);

  const displayTranscription = useMemo(() => {
    const list = [...transcriptionHistory];
    if (currentInputTranscription.current) list.push({ text: currentInputTranscription.current, role: 'user' as const });
    if (currentOutputTranscription.current) list.push({ text: currentOutputTranscription.current, role: 'model' as const });
    return list;
  }, [transcriptionHistory, renderTrigger]);

  const toggleBypassModule = (id: string) => { setActiveBypassModules(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]); };

  const agentStatusText = isConnecting ? 'CONNECTING' : !isConnected ? 'OFFLINE' : isSpeaking ? 'BUSY' : 'ONLINE';
  const agentStatusColor = isConnecting ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-500' : !isConnected ? 'bg-gray-800/40 border-white/5 text-gray-500' : isSpeaking ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400';
  const agentStatusDot = isConnecting ? 'bg-yellow-500' : !isConnected ? 'bg-gray-700' : isSpeaking ? 'bg-indigo-400 animate-pulse' : 'bg-emerald-500 animate-pulse';

  if (isHUD && isConnected) {
    return (
      <div className="fixed top-12 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[100] animate-in slide-in-from-top-4 duration-500 font-mono">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 flex items-center gap-8 shadow-[0_0_50px_rgba(99,102,241,0.2)] relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
          
          <div className="flex flex-col items-center gap-2 border-r border-white/10 pr-6 shrink-0">
             <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 ${audioActivity > 0.05 ? 'bg-indigo-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-pulse' : 'bg-white/5 text-gray-600'}`}>
                {audioSource === 'dual' ? <LinkIcon size={20} /> : audioSource === 'system' ? <Monitor size={20} /> : <Mic2 size={20} />}
             </div>
             <div className="flex flex-col items-center">
               <span className="text-[8px] font-black text-indigo-400 uppercase tracking-[0.2em]">{mode}</span>
             </div>
          </div>

          <div className="flex-1 overflow-hidden h-28 relative">
            <div className="absolute top-0 right-0 flex items-center gap-3 bg-white/5 px-2 py-1 rounded-md">
               <span className="text-[7px] text-gray-500 font-black uppercase tracking-widest">SIGNAL_STRENGTH:</span>
               <div className="flex gap-0.5">
                 {[1,2,3,4].map(i => <div key={i} className={`w-0.5 h-2 rounded-full ${i <= 3 ? 'bg-emerald-500' : 'bg-gray-800'}`} />)}
               </div>
            </div>
            
            <div className="absolute bottom-0 w-full flex flex-col gap-2 transition-all duration-500 pb-2">
               {displayTranscription.slice(-3).map((t, i, arr) => (
                 <div key={i} className={`text-[11px] leading-relaxed flex gap-3 items-start transition-all duration-300 ${i === arr.length - 1 ? 'opacity-100 translate-y-0 scale-100' : 'opacity-30 -translate-y-1 scale-95'}`}>
                    <span className={`font-black uppercase tracking-tighter shrink-0 px-2 py-0.5 rounded border text-[9px] ${t.role === 'user' ? 'bg-gray-800 text-gray-400 border-white/10' : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/20'}`}>
                      {t.role === 'user' ? 'CANDIDATE' : 'bxAI_COPI'}:
                    </span>
                    <span className={`font-bold tracking-tight ${t.role === 'user' ? 'text-gray-300' : 'text-indigo-100 text-[12px]'} line-clamp-2`}>
                      {t.text}
                    </span>
                 </div>
               ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 shrink-0">
             <button onClick={() => setMode(mode === 'copilot' ? 'practice' : 'copilot')} className="p-2 hover:bg-white/10 rounded-xl text-gray-500 hover:text-indigo-400 transition-all border border-transparent hover:border-white/10" title="Switch Mode">
                <Brain size={18} />
             </button>
             <button onClick={() => setIsHUD(false)} className="p-2 hover:bg-white/10 rounded-xl text-gray-500 hover:text-white transition-all" title="Return to Console">
                <Layers size={18} />
             </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-8 right-8 z-[60] transition-all duration-500 ease-in-out ${isExpanded ? 'w-[450px]' : 'w-24'} ${isStealth ? 'opacity-90 hover:opacity-100' : ''}`}>
      {!isExpanded && (
        <button onClick={() => setIsExpanded(true)} className={`w-24 h-24 rounded-[3rem] flex items-center justify-center shadow-2xl transition-all duration-500 transform hover:scale-110 active:scale-95 group relative overflow-hidden ${isConnected ? 'bg-indigo-600' : 'bg-gray-900 border border-white/10 hover:border-indigo-500/50'}`}>
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          {isConnected ? (
            <div className="relative">
              <Waves className="text-white animate-pulse" size={38} />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-indigo-600 animate-ping" />
            </div>
          ) : (
            <BrainCircuit className="text-indigo-400 group-hover:text-white transition-colors" size={38} />
          )}
        </button>
      )}

      {isExpanded && (
        <div className="bg-gray-950 border border-white/10 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
          <div className="p-6 bg-gradient-to-r from-indigo-950/40 via-gray-900 to-purple-950/40 flex items-center justify-between border-b border-white/5 relative">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${isConnected ? 'bg-indigo-600/20 border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'bg-white/5 border-white/10'}`}>
                {isConnected ? <Zap className="text-indigo-400 animate-pulse" size={24} /> : <Terminal className="text-gray-500" size={24} />}
              </div>
              <div className="flex flex-col justify-center">
                <div className="flex items-center gap-2">
                  {isEditingName ? (
                    <input autoFocus className="bg-transparent border-b border-indigo-500 outline-none text-white font-black text-sm w-32 uppercase tracking-tighter" value={agentName} onChange={e => setAgentName(e.target.value)} onBlur={() => setIsEditingName(false)} onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)} />
                  ) : (
                    <h3 className="text-white font-black text-sm uppercase tracking-tighter group/name">
                      {agentName}
                    </h3>
                  )}
                  {/* Status Badges Grouped Together */}
                  <div className="flex items-center gap-1">
                    <div className={`px-1.5 py-0.5 rounded border ${agentStatusColor} text-[7px] font-black flex items-center gap-1 tracking-widest`}>
                       <div className={`w-1 h-1 rounded-full ${agentStatusDot}`} />
                       {agentStatusText}
                    </div>
                    <div className={`px-1.5 py-0.5 rounded border ${isConnected ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-white/5 border-white/10 text-gray-700'} text-[7px] font-black flex items-center gap-1 tracking-widest`}>
                       {audioSource === 'dual' ? <LinkIcon size={8} /> : audioSource === 'system' ? <Monitor size={8} /> : <Mic2 size={8} />}
                       {audioSource.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                   <Edit2 size={10} className="text-gray-600 hover:text-indigo-400 cursor-pointer transition-colors" onClick={() => setIsEditingName(true)} />
                   <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">bxEngine Runtime v4.2</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {isConnected && <button onClick={() => setIsHUD(true)} className="p-3 hover:bg-white/5 text-indigo-400 rounded-xl transition-all" title="Deploy HUD"><Layers size={20} /></button>}
              <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="p-3 hover:bg-white/5 text-gray-500 hover:text-white rounded-xl transition-all"><Settings2 size={20} /></button>
              <button onClick={() => setIsExpanded(false)} className="p-3 hover:bg-white/5 text-gray-500 hover:text-white rounded-xl transition-all"><Minimize2 size={20} /></button>
            </div>
          </div>

          {isSettingsOpen && (
            <div className="absolute inset-0 bg-gray-950 z-20 p-8 flex flex-col animate-in slide-in-from-right duration-300">
              <div className="flex items-center justify-between mb-8"><h4 className="text-xl font-black text-white uppercase tracking-tighter italic">bxConfiguration</h4><button onClick={() => setIsSettingsOpen(false)} className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl transition-all"><X size={20} /></button></div>
              <div className="flex gap-4 mb-8">
                <button onClick={() => setSettingsTab('general')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${settingsTab === 'general' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-white/5 text-gray-500 hover:text-gray-300'}`}>General</button>
                <button onClick={() => setSettingsTab('stealth')} className={`flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${settingsTab === 'stealth' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-gray-900 border-white/5 text-gray-500 hover:text-gray-300'}`}>Stealth</button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-2">
                {settingsTab === 'general' ? (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">bxEngine Voice</label>
                      <div className="grid grid-cols-2 gap-3">
                        {VOICE_OPTIONS.map(v => (
                          <button key={v} onClick={() => setSelectedVoice(v)} className={`p-4 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${selectedVoice === v ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-900 border-white/5 text-gray-500 hover:border-indigo-500/30'}`}>{v}</button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Active Model</label>
                      {MODEL_OPTIONS.map(m => (
                        <button key={m.id} onClick={() => setSelectedModel(m.id)} className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedModel === m.id ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400' : 'bg-black/20 border-white/5 text-gray-500 hover:border-indigo-500/20'}`}>
                           <p className="font-black text-[11px] uppercase tracking-tighter">{m.name}</p>
                           <p className="text-[9px] font-bold opacity-40 uppercase">{m.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <label className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                          <EyeOff size={14} /> Cloaking Level
                        </label>
                        <span className="text-xs font-black text-emerald-400 font-mono tracking-tighter">{invisibilityLevel}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={invisibilityLevel} 
                        onChange={(e) => setInvisibilityLevel(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-800 rounded-full appearance-none cursor-pointer accent-emerald-500"
                      />
                    </div>
                    
                    <label className="text-[10px] font-black text-gray-600 uppercase tracking-widest block pt-2">Bypass Modules</label>
                    <div className="grid grid-cols-2 gap-3">
                      {BYPASS_MODULES.map(m => (
                        <button 
                          key={m.id} 
                          onClick={() => toggleBypassModule(m.id)} 
                          className={`relative flex flex-col items-start gap-1 p-5 rounded-3xl border transition-all duration-300 group/module overflow-hidden ${
                            activeBypassModules.includes(m.id) 
                              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]' 
                              : 'bg-black/40 border-white/5 hover:border-white/20'
                          }`}
                        >
                          {activeBypassModules.includes(m.id) && (
                            <div className="absolute top-0 right-0 p-2 bg-emerald-500/20 rounded-bl-xl border-l border-b border-emerald-500/20">
                              <Shield size={10} className="text-emerald-500 animate-pulse" />
                            </div>
                          )}
                          <div className={`p-2 rounded-xl mb-1 ${activeBypassModules.includes(m.id) ? 'bg-emerald-500 text-white' : 'bg-white/5 text-gray-600'}`}>
                            {m.icon}
                          </div>
                          <div className="flex flex-col items-start">
                            <span className={`uppercase text-[10px] font-black tracking-widest ${activeBypassModules.includes(m.id) ? 'text-emerald-400' : 'text-gray-400'}`}>
                              {m.id}
                            </span>
                            <span className={`text-[8px] font-bold uppercase tracking-tighter ${activeBypassModules.includes(m.id) ? 'text-emerald-500/70' : 'text-gray-600'}`}>
                              {activeBypassModules.includes(m.id) ? 'PROTECTED' : 'OFFLINE'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-3">
                       <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                       <p className="text-[9px] text-emerald-400/80 leading-relaxed font-bold uppercase tracking-tight">
                         bxSecurity signatures are up to date. Deployment is currently undetectable.
                       </p>
                    </div>
                  </div>
                )}
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className={`mt-8 w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all ${settingsTab === 'stealth' ? 'bg-emerald-600 text-white shadow-emerald-600/20' : 'bg-indigo-600 text-white shadow-indigo-600/20'}`}>Apply bxConfig</button>
            </div>
          )}

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/5">
                  <button onClick={() => setMode('copilot')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'copilot' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Copilot</button>
                  <button onClick={() => setMode('practice')} className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'practice' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}>Coach</button>
                </div>
                <select value={audioSource} onChange={(e) => setAudioSource(e.target.value as any)} className="bg-gray-900 border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-black text-indigo-400 uppercase tracking-widest outline-none cursor-pointer hover:bg-gray-800 transition-all">
                  <option value="dual">Dual Feed</option><option value="mic">Mic Only</option><option value="system">System Only</option>
                </select>
              </div>
              <div className="bg-black/60 border border-white/5 rounded-[2.5rem] p-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent pointer-events-none" />
                <AudioVisualizer isActive={isConnected} isModelSpeaking={isSpeaking} />
                <div className="flex items-center justify-between mt-6">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isConnected ? 'bg-indigo-500/20 text-indigo-400' : 'bg-white/5 text-gray-600'}`}>
                      <Radio size={16} className={isConnected ? 'animate-pulse' : ''} />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[150px]">{activeSourceLabel || 'Standby Mode'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                      <div key={i} className={`w-1 h-4 rounded-full transition-all duration-300 ${audioActivity > (i * 0.1) ? (mode === 'copilot' ? 'bg-indigo-500' : 'bg-purple-500') : 'bg-gray-800'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-black/40 border-y border-white/5 overflow-y-auto p-6 space-y-5 custom-scrollbar relative">
              <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-gray-950/50 to-transparent pointer-events-none z-10" />
              {error && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-[11px] font-bold text-red-400 flex gap-3 animate-in fade-in"><AlertCircle size={16} />{error}</div>}
              
              {displayTranscription.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full opacity-10 py-20 text-center grayscale">
                   <Command size={48} className="mb-4" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em]">Signal Reception Standby</p>
                </div>
              )}

              {displayTranscription.map((item, i) => (
                <div key={i} className={`flex flex-col ${item.role === 'user' ? 'items-end' : 'items-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className="flex items-center gap-2 mb-1.5 px-3">
                    {item.role === 'user' ? <><span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Candidate</span><UserCircle2 size={12} className="text-gray-600" /></> : <><Binary size={12} className="text-indigo-500" /><span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest">bxCopilot</span></>}
                  </div>
                  <div className={`max-w-[90%] p-5 rounded-3xl text-[13px] leading-relaxed font-medium transition-all ${item.role === 'user' ? 'bg-gray-900 text-gray-200 border border-white/5' : 'bg-indigo-950/30 border border-indigo-500/20 text-indigo-50 shadow-[0_0_20px_rgba(99,102,241,0.05)]'}`}>{item.text}</div>
                </div>
              ))}
              {(currentInputTranscription.current || currentOutputTranscription.current) && (
                <div className="flex gap-3 items-center text-[10px] font-black text-indigo-500/50 uppercase tracking-[0.2em] animate-pulse px-3">
                  <ActivityIcon size={14} /><span>Processing Live Audio...</span>
                </div>
              )}
              <div className="h-4" />
            </div>

            <div className="p-8 space-y-6">
              <button onClick={isConnected ? cleanup : startSession} disabled={isConnecting} className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.25em] text-sm flex items-center justify-center gap-4 transition-all duration-300 transform active:scale-[0.98] ${isConnected ? 'bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-600/20' : 'bg-white hover:bg-indigo-50 text-indigo-600 shadow-2xl shadow-indigo-600/10'}`}>
                {isConnecting ? 'Initializing Link...' : isConnected ? <><MicOff size={22} /> Terminate Link</> : <><Mic2 size={22} /> Establish Uplink</>}
              </button>
              <div className="flex items-center justify-center gap-6 opacity-40">
                <div className="flex items-center gap-2"><Shield size={14} className="text-emerald-500" /><span className="text-[9px] font-black text-white uppercase tracking-widest">Cloaked</span></div>
                <div className="w-1 h-1 bg-gray-800 rounded-full" />
                <div className="flex items-center gap-2"><Lock size={14} className="text-indigo-500" /><span className="text-[9px] font-black text-white uppercase tracking-widest">bxSecured</span></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveVoiceWidget;
