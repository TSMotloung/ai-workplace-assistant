import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquareCode, 
  Send, 
  Sparkles, 
  Trash2, 
  Copy, 
  Check, 
  Bot, 
  User, 
  RefreshCw, 
  ChevronDown,
  Shield,
  Layers,
  HelpCircle
} from 'lucide-react';
import Markdown from 'markdown-to-jsx';
import { ChatMessage, ChatPersona } from '../../types';
import { AIEngineService } from '../../services/aiEngine';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface ChatbotViewProps {
  initialPrompt?: string;
  onSaveNotification?: (msg: string) => void;
}

export const ChatbotView: React.FC<ChatbotViewProps> = ({ initialPrompt = '', onSaveNotification }) => {
  const [persona, setPersona] = useState<ChatPersona>('Executive Strategy Advisor');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      role: 'assistant',
      content: `Hello! I am your **Executive Strategy Advisor**.

I can assist with high-stakes corporate communication, unblocking project roadmaps, structuring executive summaries, or resolving ambiguous cross-functional challenges.

How can I support your workplace priorities today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona: 'Executive Strategy Advisor'
    }
  ]);
  const [inputText, setInputText] = useState(initialPrompt || '');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const personas: { id: ChatPersona; title: string; desc: string }[] = [
    { id: 'Executive Strategy Advisor', title: 'Executive Strategy Advisor', desc: 'High-level decision making, executive polish & ROI' },
    { id: 'General Workplace Copilot', title: 'General Workplace Copilot', desc: 'Versatile day-to-day assistant for task unblocking' },
    { id: 'Agile Project Manager', title: 'Agile Project Manager', desc: 'Sprint planning, blockers, standups & velocity' },
    { id: 'Corporate Communications Expert', title: 'Corporate Comms Expert', desc: 'Diplomatic email drafting, crisis memos & PR' },
    { id: 'HR & Talent Specialist', title: 'HR & Talent Specialist', desc: '1-on-1 feedback, coaching & team dynamics' },
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanText = inputText.trim();
    if (!cleanText || loading) return;

    const userMsg: ChatMessage = {
      id: 'msg-' + Date.now(),
      role: 'user',
      content: cleanText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      persona
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInputText('');
    setLoading(true);

    try {
      const reply = await AIEngineService.sendChatMessage(newHistory, persona);
      const botMsg: ChatMessage = {
        id: 'msg-reply-' + Date.now(),
        role: 'assistant',
        content: reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona
      };
      setMessages([...newHistory, botMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([
      {
        id: 'm-reset',
        role: 'assistant',
        content: `Conversation reset. I am ready as your **${persona}**. What are we tackling next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        persona
      }
    ]);
  };

  const promptSuggestions = [
    'How do I politely decline a low-priority meeting from a senior director?',
    'Structure a 30-day onboarding plan for a new senior backend engineer.',
    'Draft an escalation message for an external vendor API outage.',
    'Help me prepare for an executive board review on Q3 budget allocation.'
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto pb-10 flex flex-col h-[calc(100vh-140px)]">
      <DisclaimerBanner variant="subtle" />

      {/* Main Chat Container */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">
        
        {/* Chat Header & Persona Switcher */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800/80 bg-slate-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">Active Persona:</span>
                <select
                  value={persona}
                  onChange={(e) => setPersona(e.target.value as ChatPersona)}
                  className="bg-slate-900 border border-slate-700/80 text-purple-300 font-semibold text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-purple-500"
                >
                  {personas.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                {personas.find(p => p.id === persona)?.desc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={clearChat}
              title="Clear conversation"
              className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-slate-700/50 transition-colors text-xs flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        </div>

        {/* Message Feed */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-md ${
                    isUser
                      ? 'bg-indigo-600 text-white'
                      : 'bg-purple-900/60 border border-purple-500/40 text-purple-300'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div className={`space-y-1 ${isUser ? 'items-end text-right' : ''}`}>
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[11px] font-semibold text-slate-400">
                      {isUser ? 'You' : msg.persona || 'Copilot'}
                    </span>
                    <span className="text-[10px] text-slate-500">{msg.timestamp}</span>
                  </div>

                  <div
                    className={`relative group rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? 'bg-indigo-600 text-white shadow-md rounded-tr-none'
                        : 'bg-slate-950/90 border border-slate-800 text-slate-200 shadow-inner rounded-tl-none prose prose-invert max-w-none'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    ) : (
                      <div>
                        <Markdown>{msg.content}</Markdown>
                        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500">
                          <span>AI Guardrail Active</span>
                          <button
                            onClick={() => copyMessage(msg.id, msg.content)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-3 max-w-2xl">
              <div className="w-8 h-8 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-300 flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                <span>{persona} is composing advice...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Prompt Suggestions Pills */}
        <div className="px-4 py-2 border-t border-slate-800/60 bg-slate-950/40 flex items-center gap-2 overflow-x-auto text-[11px] text-slate-400">
          <span className="flex-shrink-0 font-semibold text-slate-500">Suggestions:</span>
          {promptSuggestions.map((s, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputText(s);
              }}
              className="flex-shrink-0 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-purple-500/40 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3.5 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask your ${persona}... (e.g. 'How do I structure our sprint retrospective?')`}
            className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-1.5 text-xs sm:text-sm"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
