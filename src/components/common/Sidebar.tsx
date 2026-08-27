import React from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  FileSpreadsheet, 
  CheckSquare, 
  Search, 
  MessageSquareCode, 
  History, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { ToolType } from '../../types';

interface SidebarProps {
  currentTool: ToolType;
  onSelectTool: (tool: ToolType) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onOpenHistory: () => void;
  historyCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTool,
  onSelectTool,
  isCollapsed,
  onToggleCollapse,
  onOpenHistory,
  historyCount
}) => {
  const navItems: { id: ToolType; label: string; icon: React.ReactNode; badge?: string; desc: string }[] = [
    { id: 'dashboard', label: 'Executive Hub', icon: <LayoutDashboard className="w-5 h-5" />, desc: 'Overview & metrics' },
    { id: 'email', label: 'Smart Email Generator', icon: <Mail className="w-5 h-5" />, badge: 'Tone & Audience', desc: 'Craft high-impact emails' },
    { id: 'meeting', label: 'Meeting Summarizer', icon: <FileSpreadsheet className="w-5 h-5" />, badge: 'Action Items', desc: 'Transcript to decisions' },
    { id: 'tasks', label: 'AI Task Planner', icon: <CheckSquare className="w-5 h-5" />, badge: 'Eisenhower', desc: 'Prioritize & schedule' },
    { id: 'research', label: 'Research Assistant', icon: <Search className="w-5 h-5" />, badge: 'SWOT & Insights', desc: 'Executive market briefs' },
    { id: 'chat', label: 'Workplace Chatbot', icon: <MessageSquareCode className="w-5 h-5" />, badge: 'Copilot', desc: 'Persona-based advisor' },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-slate-900/90 border-r border-slate-800/80 backdrop-blur-xl transition-all duration-300 z-30 ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Brand Header */}
      <div className="h-18 flex items-center justify-between px-4 border-b border-slate-800/60">
        <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => onSelectTool('dashboard')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col truncate">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                Antigravity AI <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-md border border-indigo-500/30">PRO</span>
              </span>
              <span className="text-[11px] text-slate-400 truncate">Workplace Productivity</span>
            </div>
          )}
        </div>

        {/* Collapse toggle */}
        <button
          onClick={onToggleCollapse}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 rounded-lg border border-slate-700/50 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1.5">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 px-3 mb-2">
          {!isCollapsed ? 'Productivity Modules' : 'Apps'}
        </div>

        {navItems.map((item) => {
          const isActive = currentTool === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTool(item.id)}
              title={isCollapsed ? `${item.label} - ${item.desc}` : undefined}
              className={`w-full group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                isActive
                  ? 'bg-gradient-to-r from-indigo-600/90 to-indigo-700 text-white shadow-lg shadow-indigo-900/30 border border-indigo-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                }`}
              >
                {item.icon}
              </div>

              {!isCollapsed && (
                <div className="flex-1 truncate">
                  <div className="flex items-center justify-between">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-indigo-950/60 text-indigo-200' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <span className={`text-[11px] block truncate ${isActive ? 'text-indigo-100/70' : 'text-slate-500'}`}>
                    {item.desc}
                  </span>
                </div>
              )}

              {isActive && isCollapsed && (
                <span className="absolute right-1 w-1.5 h-6 bg-indigo-400 rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* History & Status Footer */}
      <div className="p-3 border-t border-slate-800/60 space-y-2">
        <button
          onClick={onOpenHistory}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-300 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-amber-400" />
            {!isCollapsed && <span>Recent Activity</span>}
          </div>
          {historyCount > 0 && (
            <span className="bg-amber-500/20 text-amber-300 font-mono text-[10px] px-1.5 py-0.5 rounded-full border border-amber-500/30">
              {historyCount}
            </span>
          )}
        </button>

        {!isCollapsed && (
          <div className="p-3 rounded-xl bg-gradient-to-br from-slate-950/80 to-slate-900 border border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Prompt Engine Active</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Zero token lag with deterministic workplace models.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
