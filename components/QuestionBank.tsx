
import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  BookOpen, 
  Building2, 
  UserCircle, 
  ChevronRight, 
  Sparkles, 
  MessageSquare,
  Trophy,
  Lightbulb,
  Clock,
  Layers
} from 'lucide-react';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Fullstack', 'Mobile', 'System Design', 'Behavioral', 'Product Management'];
const COMPANIES = ['Google', 'Meta', 'Amazon', 'Apple', 'Netflix', 'Microsoft', 'Uber', 'Airbnb'];

const QUESTIONS_DATA = [
  { id: 1, text: "How do you optimize a large-scale React application for performance?", category: "Frontend", company: "Google", difficulty: "Hard" },
  { id: 2, text: "Explain the CAP theorem and its implications in distributed systems.", category: "System Design", company: "Amazon", difficulty: "Expert" },
  { id: 3, text: "Tell me about a time you had to deal with a difficult team member.", category: "Behavioral", company: "Meta", difficulty: "Medium" },
  { id: 4, text: "Design a URL shortening service like Bitly.", category: "System Design", company: "Microsoft", difficulty: "Hard" },
  { id: 5, text: "What is the difference between debouncing and throttling?", category: "Frontend", company: "Netflix", difficulty: "Medium" },
  { id: 6, text: "How would you design a rate limiter?", category: "System Design", company: "Apple", difficulty: "Hard" },
  { id: 7, text: "Describe your experience with Microservices architecture.", category: "Backend", company: "Uber", difficulty: "Hard" },
  { id: 8, text: "How do you handle state management in complex applications?", category: "Frontend", company: "Airbnb", difficulty: "Medium" },
];

const QuestionBank: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const filteredQuestions = QUESTIONS_DATA.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchesCompany = !selectedCompany || q.company === selectedCompany;
    return matchesSearch && matchesCategory && matchesCompany;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-4">
            <BookOpen className="text-indigo-500" size={32} />
            Question Bank
          </h2>
          <p className="text-gray-400 mt-2 text-lg">Access 5,000+ specialized interview questions categorized by role and company.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl px-6 py-3 flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Database Sync</span>
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-tighter">Live v4.9</span>
            </div>
            <Trophy className="text-yellow-500" size={24} />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat label="Questions" value="5,241" color="indigo" />
        <QuickStat label="Roles" value="124" color="purple" />
        <QuickStat label="Companies" value="850+" color="emerald" />
        <QuickStat label="Solutions" value="100%" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 border border-gray-800 rounded-[2rem] p-6 space-y-6">
            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Search Catalog</label>
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="e.g. React performance..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-xl py-3 pl-12 pr-4 text-sm text-white focus:border-indigo-500/50 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">By Role / Category</label>
              <div className="space-y-2">
                {CATEGORIES.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between ${selectedCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-gray-400 hover:bg-white/5'}`}
                  >
                    {cat}
                    {selectedCategory === cat && <ChevronRight size={14} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-4">Top Companies</label>
              <div className="grid grid-cols-2 gap-2">
                {COMPANIES.map(company => (
                  <button 
                    key={company}
                    onClick={() => setSelectedCompany(selectedCompany === company ? null : company)}
                    className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${selectedCompany === company ? 'bg-purple-600 border-purple-500 text-white' : 'bg-black/20 border-white/5 text-gray-500 hover:border-white/10'}`}
                  >
                    {company}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/20 rounded-[2rem] p-6">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <Sparkles size={16} className="text-yellow-500" />
              Pro Hint
            </h4>
            <p className="text-[11px] text-gray-400 leading-relaxed">
              Enable "Copilot Mode" in the Live Widget while viewing these questions to see how Sparkle AI suggests phrasing the answers in real-time.
            </p>
          </div>
        </div>

        {/* Question List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between px-4">
            <p className="text-xs text-gray-500">Showing <span className="text-white font-bold">{filteredQuestions.length}</span> questions</p>
            <button className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors">
              <Filter size={14} /> Clear All Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredQuestions.map(q => (
              <div key={q.id} className="bg-gray-900/40 border border-white/5 rounded-[2rem] p-6 hover:border-indigo-500/30 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-16 bg-indigo-500/5 blur-[60px] rounded-full -mr-20 -mt-20 group-hover:bg-indigo-500/10 transition-all" />
                
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-black/40 rounded-full text-[10px] font-black uppercase text-indigo-400 tracking-tighter border border-indigo-500/10">
                      {q.category}
                    </span>
                    <span className="px-3 py-1 bg-black/40 rounded-full text-[10px] font-black uppercase text-purple-400 tracking-tighter border border-purple-500/10">
                      {q.company}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                      q.difficulty === 'Medium' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/10' : 
                      q.difficulty === 'Hard' ? 'bg-orange-500/10 text-orange-500 border-orange-500/10' :
                      'bg-red-500/10 text-red-500 border-red-500/10'
                    }`}>
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-6 group-hover:text-indigo-300 transition-colors leading-snug">
                    {q.text}
                  </h3>

                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-2 text-gray-500">
                        <MessageSquare size={14} />
                        <span className="text-[10px] font-bold">1.2k Solutions</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-500">
                        <Clock size={14} />
                        <span className="text-[10px] font-bold">Avg. 15m Prep</span>
                      </div>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/10">
                      View AI Guide <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredQuestions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-gray-900/20 border border-dashed border-gray-800 rounded-[2rem]">
                <div className="w-16 h-16 bg-gray-800/50 rounded-2xl flex items-center justify-center text-gray-600 mb-4">
                  <Search size={32} />
                </div>
                <h4 className="text-lg font-bold text-gray-400">No matches found</h4>
                <p className="text-xs text-gray-600 mt-2">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickStat = ({ label, value, color }: any) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 group hover:border-indigo-500/30 transition-all">
    <p className="text-[9px] font-black text-gray-600 uppercase tracking-widest mb-1">{label}</p>
    <h4 className={`text-2xl font-black text-${color}-400 tracking-tighter`}>{value}</h4>
  </div>
);

export default QuestionBank;
