import React from 'react';
import { 
  X, 
  Trash2, 
  Clock, 
  ArrowRight, 
  Mail, 
  FileSpreadsheet, 
  CheckSquare, 
  Search, 
  MessageSquareCode,
  ExternalLink
} from 'lucide-react';
import { HistoryItem, ToolType } from '../../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectHistoryItem
}) => {
  if (!isOpen) return null;

  const toolIcons: Record<ToolType, React.ReactNode> = {
    dashboard: <Clock className="w-4 h-4 text-indigo-400" />,
    email: <Mail className="w-4 h-4 text-indigo-400" />,
    meeting: <FileSpreadsheet className="w-4 h-4 text-emerald-400" />,
    tasks: <CheckSquare className="w-4 h-4 text-amber-400" />,
    research: <Search className="w-4 h-4 text-cyan-400" />,
    chat: <MessageSquareCode className="w-4 h-4 text-purple-400" />
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Recent AI Workflows & History ({history.length})
            </h3>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-400 hover:text-rose-300 px-2 py-1 rounded hover:bg-rose-950/40 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No recent activity recorded yet. Run a prompt in any module to save history.
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistoryItem(item);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800/80 hover:border-slate-700 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-start gap-3 truncate">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 mt-0.5">
                    {toolIcons[item.tool] || <Clock className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors truncate">
                        {item.title}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500 uppercase px-1.5 py-0.2 rounded bg-slate-900 border border-slate-800">
                        {item.tool}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate mt-0.5">
                      {item.preview}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0 text-slate-500 group-hover:text-slate-300">
                  <span className="text-[10px] font-mono">{item.timestamp}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform text-indigo-400" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-500 text-center">
          Persisted locally in your browser workspace session.
        </div>
      </div>
    </div>
  );
};
