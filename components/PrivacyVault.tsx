
import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Trash2, 
  Download, 
  FileText, 
  Search, 
  Clock, 
  ShieldAlert, 
  ChevronRight, 
  Eye, 
  Database,
  Calendar,
  Zap,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MOCK_RECORDS = [
  { id: 'rec-001', role: 'Senior Frontend Engineer', company: 'Google', date: '2025-05-10', duration: '45m', status: 'Encrypted', sentiment: 'Positive' },
  { id: 'rec-002', role: 'Fullstack Developer', company: 'Meta', date: '2025-05-12', duration: '60m', status: 'Encrypted', sentiment: 'Neutral' },
  { id: 'rec-003', role: 'System Architect', company: 'Amazon', date: '2025-05-14', duration: '30m', status: 'Encrypted', sentiment: 'Positive' },
  { id: 'rec-004', role: 'Product Manager', company: 'Microsoft', date: '2025-05-15', duration: '55m', status: 'Encrypted', sentiment: 'Positive' },
];

const PrivacyVault: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [autoWipe, setAutoWipe] = useState('7_days');

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Lock size={12} /> Secure Storage Active
          </div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-4">
            <ShieldCheck className="text-emerald-500" size={32} />
            Privacy Vault
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Manage your encrypted interview recordings and transcripts with military-grade security.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => navigate('/manual')}
            className="px-6 py-3 bg-gray-900 border border-gray-800 text-gray-400 hover:text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2"
          >
            User Manual
          </button>
          <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all flex items-center gap-2">
            <Zap size={14} /> Global Wipe
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Total Records</p>
          <h4 className="text-2xl font-black text-white tracking-tighter">24</h4>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Storage Used</p>
          <h4 className="text-2xl font-black text-emerald-400 tracking-tighter">1.2 GB</h4>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Encryption</p>
          <h4 className="text-2xl font-black text-indigo-400 tracking-tighter">AES-256</h4>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4">
          <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">Bypass Stability</p>
          <h4 className="text-2xl font-black text-emerald-400 tracking-tighter">100%</h4>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Controls */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-6 space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Protocol Search</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-emerald-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Filter records..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-emerald-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Auto-Wipe Interval</label>
              <div className="space-y-2">
                <WipeOption id="instant" label="Instant (After Session)" active={autoWipe === 'instant'} onClick={() => setAutoWipe('instant')} />
                <WipeOption id="24_hours" label="24 Hours" active={autoWipe === '24_hours'} onClick={() => setAutoWipe('24_hours')} />
                <WipeOption id="7_days" label="7 Days (Default)" active={autoWipe === '7_days'} onClick={() => setAutoWipe('7_days')} />
                <WipeOption id="manual" label="Manual Only" active={autoWipe === 'manual'} onClick={() => setAutoWipe('manual')} />
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Metadata Stripping</span>
                <div className="w-10 h-5 bg-emerald-600 rounded-full relative">
                  <div className="absolute top-1 right-1 w-3 h-3 bg-white rounded-full shadow-lg" />
                </div>
              </div>
              <p className="text-[9px] text-gray-500 leading-relaxed">Automatically removes GPS, Device ID, and Timestamp metadata from all generated logs.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-900/40 to-indigo-900/40 border border-emerald-500/20 rounded-[2rem] p-6">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <ShieldAlert size={16} className="text-orange-500" />
              Security Tip
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              For high-stakes proctored sessions, enable "Instant Wipe" to ensure no trace remains on this server after your interview completes.
            </p>
          </div>
        </div>

        {/* Records Table */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-gray-900/40 border border-white/5 rounded-[2rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Role / Company</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Duration</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {MOCK_RECORDS.map((record) => (
                    <tr key={record.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                            <FileText size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white tracking-tight">{record.role}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{record.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-400 font-medium">
                        {record.date}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-400 font-medium">
                        {record.duration}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                          <span className="text-[10px] font-black uppercase text-emerald-500 tracking-tighter">{record.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-all" title="View Transcript">
                            <Eye size={16} />
                          </button>
                          <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-500 hover:text-white transition-all" title="Download Zip">
                            <Download size={16} />
                          </button>
                          <button className="p-2 hover:bg-red-500/10 rounded-lg text-gray-500 hover:text-red-500 transition-all" title="Delete Permanent">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex items-center justify-between p-6 bg-gray-900/20 border border-dashed border-gray-800 rounded-[2rem]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800/50 rounded-2xl flex items-center justify-center text-gray-600">
                <Database size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-400">Database Optimization</h4>
                <p className="text-xs text-gray-600">Log fragmentation is low. All records are indexed and encrypted.</p>
              </div>
            </div>
            <button className="text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">Run Defragmentation</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const WipeOption = ({ label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-gray-400 hover:bg-white/5'}`}
  >
    {label}
    {active && <CheckCircle2 size={14} />}
  </button>
);

export default PrivacyVault;
