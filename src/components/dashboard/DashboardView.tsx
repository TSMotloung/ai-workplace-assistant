import React, { useState } from 'react';
import { 
  Sparkles, 
  Mail, 
  FileSpreadsheet, 
  CheckSquare, 
  Search, 
  MessageSquareCode, 
  ArrowRight, 
  TrendingUp, 
  Clock, 
  Zap, 
  CheckCircle2, 
  PlusCircle, 
  BookmarkCheck,
  Flame,
  Lightbulb
} from 'lucide-react';
import { ToolType } from '../../types';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface DashboardViewProps {
  onSelectTool: (tool: ToolType) => void;
  onQuickPrompt: (tool: ToolType, initialPrompt: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onSelectTool, onQuickPrompt }) => {
  const [quickInput, setQuickInput] = useState('');

  const stats = [
    { label: 'Time Saved This Week', value: '14.8 hrs', change: '+22% vs last week', icon: <Clock className="w-5 h-5 text-indigo-400" /> },
    { label: 'Workflows Automated', value: '42 items', change: '8 emails, 12 summaries, 22 tasks', icon: <Zap className="w-5 h-5 text-amber-400" /> },
    { label: 'Prompt Efficiency Score', value: '98.4%', change: 'Near zero hallucination rate', icon: <TrendingUp className="w-5 h-5 text-emerald-400" /> },
    { label: 'Active Guardrails', value: 'Strict SLA', change: 'Human review disclaimer active', icon: <BookmarkCheck className="w-5 h-5 text-purple-400" /> },
  ];

  const toolsList: { id: ToolType; title: string; desc: string; icon: React.ReactNode; color: string; badge: string; sample: string }[] = [
    {
      id: 'email',
      title: 'Smart Email Generator',
      desc: 'Craft audience-aware emails with selectable tone, subject options, and executive brevity.',
      icon: <Mail className="w-6 h-6 text-indigo-400" />,
      color: 'from-indigo-900/30 to-slate-900/80 border-indigo-500/30 hover:border-indigo-500/60',
      badge: 'Tone + Audience',
      sample: 'Draft follow-up email to client regarding Q4 budget approval...'
    },
    {
      id: 'meeting',
      title: 'Meeting Notes Summarizer',
      desc: 'Transform messy transcripts and rambling notes into clear decisions and assignable action items.',
      icon: <FileSpreadsheet className="w-6 h-6 text-emerald-400" />,
      color: 'from-emerald-900/30 to-slate-900/80 border-emerald-500/30 hover:border-emerald-500/60',
      badge: 'Action Items & Due Dates',
      sample: 'Summarize executive sprint kickoff and extract blockers...'
    },
    {
      id: 'tasks',
      title: 'AI Task Planner',
      desc: 'Organize chaotic backlogs into an actionable Eisenhower Matrix schedule with time estimates.',
      icon: <CheckSquare className="w-6 h-6 text-amber-400" />,
      color: 'from-amber-900/30 to-slate-900/80 border-amber-500/30 hover:border-amber-500/60',
      badge: 'Eisenhower Matrix',
      sample: 'Plan my 3-day sprint focusing on release hotfixes and client demos...'
    },
    {
      id: 'research',
      title: 'AI Research Assistant',
      desc: 'Synthesize market trends, competitive positioning, and SWOT analysis into executive briefs.',
      icon: <Search className="w-6 h-6 text-cyan-400" />,
      color: 'from-cyan-900/30 to-slate-900/80 border-cyan-500/30 hover:border-cyan-500/60',
      badge: 'SWOT & Deep Insights',
      sample: 'Provide competitive SWOT analysis for enterprise AI adoption in 2026...'
    },
    {
      id: 'chat',
      title: 'Workplace Copilot Chatbot',
      desc: 'Role-based advisor for corporate strategy, agile grooming, HR management, and communications.',
      icon: <MessageSquareCode className="w-6 h-6 text-purple-400" />,
      color: 'from-purple-900/30 to-slate-900/80 border-purple-500/30 hover:border-purple-500/60',
      badge: 'Persona Advisor',
      sample: 'How should I communicate a 2-week roadmap delay to our VP?'
    },
  ];

  const quickShortcuts = [
    { label: 'Draft Project Kickoff Email', tool: 'email' as ToolType, text: 'Project Kickoff with Enterprise Design Team' },
    { label: 'Summarize 1-on-1 Performance Sync', tool: 'meeting' as ToolType, text: 'Quarterly Career Growth & OKR Review' },
    { label: 'Prioritize Today’s 5 Urgent Deliverables', tool: 'tasks' as ToolType, text: 'Emergency client patch, board deck slides, code review' },
    { label: 'Generate AI Governance Brief', tool: 'research' as ToolType, text: 'Enterprise Generative AI Guardrails & Security Policies' },
  ];

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickInput.trim()) return;
    // Auto-route based on keywords or default to chat
    const text = quickInput.toLowerCase();
    if (text.includes('email') || text.includes('write') || text.includes('message')) {
      onQuickPrompt('email', quickInput);
    } else if (text.includes('meeting') || text.includes('transcript') || text.includes('notes')) {
      onQuickPrompt('meeting', quickInput);
    } else if (text.includes('task') || text.includes('plan') || text.includes('todo') || text.includes('schedule')) {
      onQuickPrompt('tasks', quickInput);
    } else if (text.includes('research') || text.includes('market') || text.includes('swot') || text.includes('competitor')) {
      onQuickPrompt('research', quickInput);
    } else {
      onQuickPrompt('chat', quickInput);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Compliance Disclaimer Banner */}
      <DisclaimerBanner />

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/60 to-slate-900 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            <span>Structured Prompt Intelligence Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Accelerate your workday with focused AI workflows.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Eliminate mundane overhead across email correspondence, meeting syntheses, task scheduling, and strategic research with deterministic enterprise prompts.
          </p>

          {/* Quick Universal Prompt Bar */}
          <form onSubmit={handleQuickSubmit} className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Sparkles className="absolute left-3.5 top-3.5 w-4 h-4 text-indigo-400" />
              <input
                type="text"
                value={quickInput}
                onChange={(e) => setQuickInput(e.target.value)}
                placeholder="What do you need to accomplish? (e.g. 'Draft email to client about milestone delay')"
                className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <span>Execute with AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Productivity Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-4.5 hover:border-slate-700 transition-colors shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <div className="p-2 rounded-lg bg-slate-800/60">{stat.icon}</div>
            </div>
            <div className="mt-2 text-2xl font-bold text-white tracking-tight">{stat.value}</div>
            <div className="mt-1 text-[11px] text-slate-400 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      {/* Core AI Modules Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Workplace Automation Tools</h3>
            <p className="text-xs text-slate-400">Select a dedicated workspace tool built with domain-specific prompt engineering.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {toolsList.map((tool) => (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br ${tool.color} border transition-all duration-200 cursor-pointer hover:shadow-xl hover:-translate-y-0.5`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 shadow-sm">
                    {tool.icon}
                  </div>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-950/80 text-slate-300 border border-slate-800">
                    {tool.badge}
                  </span>
                </div>

                <h4 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                  {tool.title}
                </h4>
                <p className="mt-1.5 text-xs text-slate-300/80 leading-relaxed">
                  {tool.desc}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:text-indigo-300">
                <span>Launch Assistant</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested 1-Click Accelerators */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Recommended 1-Click Workplace Prompts</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickShortcuts.map((item, index) => (
            <button
              key={index}
              onClick={() => onQuickPrompt(item.tool, item.text)}
              className="text-left p-3 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 hover:border-indigo-500/40 transition-all text-xs text-slate-300 hover:text-white group flex flex-col justify-between"
            >
              <span className="font-semibold text-slate-200 group-hover:text-indigo-300">{item.label}</span>
              <span className="text-[11px] text-slate-500 mt-1 truncate block">{item.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
