import React from 'react';
import { 
  Sparkles, 
  Search, 
  Settings, 
  Bell, 
  SlidersHorizontal,
  Workflow
} from 'lucide-react';
import { ToolType } from '../../types';

interface HeaderProps {
  currentTool: ToolType;
  onOpenSettings: () => void;
  userName: string;
  userRole: string;
  onQuickSearchClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTool,
  onOpenSettings,
  userName,
  userRole,
}) => {
  const toolTitles: Record<ToolType, { title: string; subtitle: string }> = {
    dashboard: { title: 'Executive Overview', subtitle: 'Workplace automation command center and key metrics' },
    email: { title: 'Smart Email Generator', subtitle: 'Audience-tailored tone shaping, subject lines, and multi-format drafting' },
    meeting: { title: 'Meeting Notes Summarizer', subtitle: 'Extract key decisions, deliverables, and assign action items' },
    tasks: { title: 'AI Task Planner & Prioritizer', subtitle: 'Eisenhower matrix classification and optimized work schedules' },
    research: { title: 'AI Research Assistant', subtitle: 'Strategic market landscape, SWOT analysis, and executive briefs' },
    chat: { title: 'Workplace Copilot Chatbot', subtitle: 'Contextual persona-driven advisor for day-to-day corporate workflow' },
  };

  const currentMeta = toolTitles[currentTool];

  return (
    <header className="h-18 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0 z-20">
      {/* Title & Context */}
      <div className="flex flex-col">
        <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          {currentMeta.title}
          <span className="inline-flex items-center gap-1 text-[11px] font-normal text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            AI Ready
          </span>
        </h1>
        <p className="text-xs text-slate-400 hidden sm:block truncate max-w-xl">
          {currentMeta.subtitle}
        </p>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* User Card */}
        <div className="flex items-center gap-3 pl-2 border-l border-slate-800/80">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white shadow-md">
            {userName ? userName.split(' ').map(n => n[0]).join('') : 'AM'}
          </div>
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-semibold text-white leading-tight">{userName}</span>
            <span className="text-[10px] text-slate-400 leading-tight">{userRole}</span>
          </div>
        </div>

        {/* Settings button */}
        <button
          onClick={onOpenSettings}
          title="Configure Persona & Settings"
          className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-lg border border-slate-700/60 transition-colors"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
