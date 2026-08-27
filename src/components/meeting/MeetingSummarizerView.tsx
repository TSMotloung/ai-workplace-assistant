import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Sparkles, 
  Copy, 
  Check, 
  CheckCircle, 
  Clock, 
  User, 
  AlertOctagon, 
  ArrowRight, 
  RefreshCw, 
  Calendar,
  Layers,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { MeetingSummarizerInput, MeetingOutput, MeetingType } from '../../types';
import { AIEngineService } from '../../services/aiEngine';
import { saveHistoryItem } from '../../services/storage';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface MeetingSummarizerViewProps {
  initialPrompt?: string;
  onSaveNotification?: (msg: string) => void;
}

export const MeetingSummarizerView: React.FC<MeetingSummarizerViewProps> = ({ initialPrompt = '', onSaveNotification }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [input, setInput] = useState<MeetingSummarizerInput>({
    title: initialPrompt || 'Q3 Enterprise Architecture & Sprint 44 Roadmap Sync',
    meetingType: 'Sprint Planning / Agile',
    attendees: 'Alex Morgan (Product), Elena Rostova (Lead Architect), Marcus Vance (Engineering Director), Priyah Shah (DevOps QA)',
    date: new Date().toISOString().split('T')[0],
    rawNotes: `Marcus opened by noting that sprint velocity reached 48 points, which is 10% over forecast.
Elena raised concerns about third-party webhook latency in the payment gateway test environment causing 504 timeouts on edge queries.
Agreed decision: We will implement an asynchronous queue with BullMQ and Redis to decouple webhook verification from user checkout.
Elena will complete the spec by Friday 5 PM.
Alex requested an updated slide deck for the executive steering committee before Monday morning.
DevOps team (Priyah) needs to spin up the staging Redis cluster by next Wednesday.
Blocker: Staging cloud quota is almost capped. Marcus will submit ticket to cloud ops.
Next meeting set for Monday 10 AM standup.`,
    focusArea: 'Action Items, Technical Decisions & Resource Blockers'
  });

  const [output, setOutput] = useState<MeetingOutput | null>(null);

  const meetingTypes: MeetingType[] = [
    'Sprint Planning / Agile',
    'Executive Leadership',
    '1-on-1 Sync',
    'Client Pitch / Review',
    'Project Kickoff',
    'Brainstorming / Workshop'
  ];

  const handleSummarize = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.rawNotes.trim()) return;

    setLoading(true);
    try {
      const res = await AIEngineService.summarizeMeeting(input);
      setOutput(res);

      saveHistoryItem(
        'meeting',
        `Meeting: ${input.title}`,
        `Summary: ${res.executiveSummary.slice(0, 50)}...`,
        { input, output: res }
      );

      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 }
      });
      if (onSaveNotification) onSaveNotification('Meeting summarized & action items extracted');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopySummary = () => {
    if (!output) return;
    const formatted = `### ${input.title} - Executive Summary
**Date:** ${input.date} | **Type:** ${input.meetingType}
**Attendees:** ${input.attendees}

${output.executiveSummary}

#### Key Decisions Made:
${output.decisions.map(d => `- ${d}`).join('\n')}

#### Action Items:
${output.actionItems.map(a => `• [${a.priority}] ${a.task} — Assignee: ${a.assignee} (Due: ${a.dueDate})`).join('\n')}

#### Blockers & Risks:
${output.blockersOrRisks.map(b => `! ${b}`).join('\n')}
`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (type: 'client' | 'sprint' | 'oneonone') => {
    if (type === 'client') {
      setInput({
        title: 'Acme Corp Annual SaaS License Renewal & Feature Request Review',
        meetingType: 'Client Pitch / Review',
        attendees: 'Alex Morgan (NexusTech), David Kim (VP IT, Acme Corp), Rachel Green (Procurement)',
        date: new Date().toISOString().split('T')[0],
        rawNotes: `David Kim expressed high satisfaction with 99.98% platform uptime over the last 12 months.
Acme wants to add 150 additional user seats starting next quarter.
Key requirement: Acme requires custom role-based access control (RBAC) and SSO integration with Azure AD.
Pricing agreed: 15% volume discount applied for a 2-year upfront commitment.
Rachel from procurement will send the MSA redlines by Thursday.
Alex will coordinate with solutions engineering to provide SSO technical setup guide by tomorrow EOD.`,
        focusArea: 'Commercial Terms, Custom Security Requirements, Renewal Timelines'
      });
    } else if (type === 'oneonone') {
      setInput({
        title: 'Quarterly Career Growth & Performance Sync — Senior Frontend Engineer',
        meetingType: '1-on-1 Sync',
        attendees: 'Alex Morgan (Manager), Jordan Lee (Senior Frontend Engineer)',
        date: new Date().toISOString().split('T')[0],
        rawNotes: `Jordan shared strong interest in leading the mobile-responsive architecture overhaul next quarter.
Feedback given: Exceptional delivery velocity on recent dashboard components. Recommended increasing cross-team RFC contributions.
Agreed goal: Jordan will write the engineering RFC for micro-frontends before end of month.
Alex will sponsor Jordan for the AWS Certified Solutions Architect exam voucher.
Next check-in scheduled for bi-weekly Tuesday.`,
        focusArea: 'Growth Goals, RFC Authorship, Skill Development'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <DisclaimerBanner variant="subtle" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Meeting Information</h2>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500">Samples:</span>
              <button onClick={() => loadPreset('client')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Client</button>
              <button onClick={() => loadPreset('oneonone')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">1-on-1</button>
            </div>
          </div>

          <form onSubmit={handleSummarize} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Title *</label>
              <input
                type="text"
                required
                value={input.title}
                onChange={e => setInput({ ...input, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Meeting Format</label>
                <select
                  value={input.meetingType}
                  onChange={e => setInput({ ...input, meetingType: e.target.value as MeetingType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  {meetingTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Date</label>
                <input
                  type="date"
                  value={input.date}
                  onChange={e => setInput({ ...input, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Attendees / Stakeholders</label>
              <input
                type="text"
                value={input.attendees}
                onChange={e => setInput({ ...input, attendees: e.target.value })}
                placeholder="e.g. Alex, Elena, Marcus"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Raw Meeting Notes / Transcript *
              </label>
              <textarea
                required
                rows={7}
                value={input.rawNotes}
                onChange={e => setInput({ ...input, rawNotes: e.target.value })}
                placeholder="Paste raw conversation, messy notes, or bullet points here..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-mono leading-relaxed resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.rawNotes.trim()}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-emerald-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Decisions & Action Items...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>Generate Executive Summary</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Structured Decisions & Action Items (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {output ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              
              {/* Output Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Executive Meeting Brief</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                    {output.actionItems.length} Action Items
                  </span>
                </div>

                <button
                  onClick={handleCopySummary}
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 transition-colors font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied All!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Markdown Summary</span>
                    </>
                  )}
                </button>
              </div>

              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Executive Overview</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {output.executiveSummary}
                </p>
              </div>

              {/* Action Items Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-indigo-400" />
                    <span>Action Items & Accountabilities</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Auto-extracted</span>
                </div>

                <div className="space-y-2">
                  {output.actionItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800/90 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold ${
                          item.priority === 'High' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {item.priority}
                        </span>
                        <span className="text-slate-200 font-medium">{item.task}</span>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto text-[11px] text-slate-400 flex-shrink-0">
                        <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          <User className="w-3 h-3 text-indigo-400" />
                          {item.assignee}
                        </span>
                        <span className="flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {item.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key Decisions */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Key Decisions Agreed Upon</span>
                </h3>
                <div className="space-y-1.5">
                  {output.decisions.map((dec, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
                      <span className="text-emerald-400 font-bold">?</span>
                      <span>{dec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risks & Blockers */}
              {output.blockersOrRisks.length > 0 && (
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                    <AlertOctagon className="w-4 h-4 text-amber-400" />
                    <span>Identified Blockers & Risks</span>
                  </div>
                  <ul className="text-xs text-amber-200/90 list-disc list-inside space-y-0.5">
                    {output.blockersOrRisks.map((b, idx) => (
                      <li key={idx}>{b}</li>
                    ))}
                  </ul>
                </div>
              )}

              <DisclaimerBanner variant="inline" />
            </div>
          ) : (
            <div className="h-full min-h-[420px] bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-950/50 border border-emerald-500/20 flex items-center justify-center mb-4 text-emerald-400 shadow-lg">
                <FileSpreadsheet className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Meeting Summarizer & Action Item Extractor</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
                Paste meeting conversations or notes on the left. The engine will extract an executive summary, assign action items with deadlines, and catalog decisions.
              </p>
              <button
                onClick={() => handleSummarize()}
                className="mt-5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Process Sample Transcript</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
