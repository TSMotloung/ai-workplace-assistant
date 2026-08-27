import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  Send, 
  Sliders, 
  Volume2, 
  Users, 
  AlertTriangle, 
  RefreshCw, 
  Plus, 
  Trash2,
  FileText,
  Share2,
  Save
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EmailGenerationInput, EmailOutput, EmailTone, EmailAudience, EmailUrgency } from '../../types';
import { AIEngineService } from '../../services/aiEngine';
import { saveHistoryItem } from '../../services/storage';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface EmailGeneratorViewProps {
  initialPrompt?: string;
  onSaveNotification?: (msg: string) => void;
}

export const EmailGeneratorView: React.FC<EmailGeneratorViewProps> = ({ initialPrompt = '', onSaveNotification }) => {
  const [loading, setLoading] = useState(false);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeVersion, setActiveVersion] = useState<'standard' | 'short'>('standard');

  const [input, setInput] = useState<EmailGenerationInput>({
    recipientName: 'Sarah Jenkins',
    recipientRole: 'VP of Enterprise Operations',
    topic: initialPrompt || 'Q3 Product Roadmap Milestone & Resource Allocation Sync',
    keyPoints: [
      'Core authentication & SSO module is 100% complete ahead of schedule.',
      'API rate-limiting testing identified minor edge cases requiring 2 additional dev days.',
      'Deployment staging window shifts slightly to next Thursday with zero client impact.'
    ],
    tone: 'Professional & Formal',
    audience: 'Executive / Board',
    urgency: 'Action Required',
    callToAction: 'Kindly review the staging demo link and confirm 15m review availability on Wednesday morning.',
    senderName: 'Alex Morgan',
    senderRole: 'Director of Product Strategy'
  });

  const [output, setOutput] = useState<EmailOutput | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [newKeyPoint, setNewKeyPoint] = useState('');

  const toneOptions: EmailTone[] = [
    'Professional & Formal',
    'Executive / C-Suite',
    'Assertive & Decisive',
    'Friendly & Warm',
    'Concise & Direct',
    'Persuasive & Sales'
  ];

  const audienceOptions: EmailAudience[] = [
    'Executive / Board',
    'Client / Partner',
    'Direct Report / Team',
    'Cross-Functional Peers',
    'Vendor / External'
  ];

  const urgencyOptions: EmailUrgency[] = [
    'Normal',
    'Urgent / Same-day',
    'Action Required',
    'FYI / Low Priority'
  ];

  const handleAddPoint = () => {
    if (!newKeyPoint.trim()) return;
    setInput(prev => ({
      ...prev,
      keyPoints: [...prev.keyPoints, newKeyPoint.trim()]
    }));
    setNewKeyPoint('');
  };

  const handleRemovePoint = (index: number) => {
    setInput(prev => ({
      ...prev,
      keyPoints: prev.keyPoints.filter((_, i) => i !== index)
    }));
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.topic.trim()) return;

    setLoading(true);
    try {
      const res = await AIEngineService.generateEmail(input);
      setOutput(res);
      setSelectedSubject(res.recommendedSubject);

      saveHistoryItem(
        'email',
        `Email: ${input.topic.slice(0, 35)}...`,
        `Subject: ${res.recommendedSubject}`,
        { input, output: res }
      );

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
      if (onSaveNotification) onSaveNotification('Email generated & saved to history');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const loadPreset = (preset: 'followup' | 'update' | 'reschedule' | 'proposal') => {
    if (preset === 'followup') {
      setInput({
        recipientName: 'David Chen',
        recipientRole: 'Client Account Director',
        topic: 'Follow-up on Enterprise Renewal Contract & SLA Addendum',
        keyPoints: [
          'Sent revised tier-1 pricing sheet with multi-year discount applied.',
          'Legal team has approved all standard indemnity clauses.',
          'Contract expiration is in 10 business days.'
        ],
        tone: 'Persuasive & Sales',
        audience: 'Client / Partner',
        urgency: 'Urgent / Same-day',
        callToAction: 'Can you please sign off on Docusign envelope #8920 or let me know if any final questions remain?',
        senderName: 'Alex Morgan',
        senderRole: 'Director of Product Strategy'
      });
    } else if (preset === 'update') {
      setInput({
        recipientName: 'Engineering & Product Teams',
        recipientRole: 'Cross-functional Group',
        topic: 'Sprint 42 Retrospective Highlights & Quality Metrics',
        keyPoints: [
          'Delivered 94% of planned story points with zero critical regressions.',
          'Automated CI/CD test coverage increased by +8.4%.',
          'Kudos to Frontend team for shipping the responsive dark theme ahead of deadline.'
        ],
        tone: 'Friendly & Warm',
        audience: 'Direct Report / Team',
        urgency: 'FYI / Low Priority',
        callToAction: 'Please submit your retrospective kudos votes before Friday lunch.',
        senderName: 'Alex Morgan',
        senderRole: 'Director of Product Strategy'
      });
    } else if (preset === 'proposal') {
      setInput({
        recipientName: 'Executive Steering Committee',
        recipientRole: 'C-Suite & Board Members',
        topic: 'Proposal: AI Workplace Automation Pilot Program for FY26',
        keyPoints: [
          'Anticipated operational time savings of ~15 hours per manager weekly.',
          'Built-in compliance guardrails with mandatory human-in-the-loop validation.',
          'Pilot budget is under $5,000 with 90-day ROI breakeven target.'
        ],
        tone: 'Executive / C-Suite',
        audience: 'Executive / Board',
        urgency: 'Action Required',
        callToAction: 'Seeking formal approval to initiate 4-week trial with 25 pilot seats starting next Monday.',
        senderName: 'Alex Morgan',
        senderRole: 'Director of Product Strategy'
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Disclaimer */}
      <DisclaimerBanner variant="subtle" />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Form: Inputs & Tuning (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Email Parameters</h2>
            </div>
            {/* Presets dropdown/chips */}
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500">Presets:</span>
              <button onClick={() => loadPreset('followup')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Client</button>
              <button onClick={() => loadPreset('proposal')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Exec</button>
              <button onClick={() => loadPreset('update')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Team</button>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Recipient details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Name</label>
                <input
                  type="text"
                  value={input.recipientName}
                  onChange={e => setInput({ ...input, recipientName: e.target.value })}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Recipient Role</label>
                <input
                  type="text"
                  value={input.recipientRole}
                  onChange={e => setInput({ ...input, recipientRole: e.target.value })}
                  placeholder="e.g. VP Operations"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Email Topic */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Core Topic / Objective *</label>
              <input
                type="text"
                required
                value={input.topic}
                onChange={e => setInput({ ...input, topic: e.target.value })}
                placeholder="What is this email about?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>

            {/* Key Bullet Points */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Key Points to Include ({input.keyPoints.length})
              </label>
              <div className="space-y-1.5 mb-2 max-h-36 overflow-y-auto pr-1">
                {input.keyPoints.map((point, index) => (
                  <div key={index} className="flex items-start gap-2 bg-slate-950/60 border border-slate-800/80 p-2 rounded-lg text-xs text-slate-200">
                    <span className="text-indigo-400 font-bold">•</span>
                    <span className="flex-1 leading-relaxed">{point}</span>
                    <button
                      type="button"
                      onClick={() => handleRemovePoint(index)}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newKeyPoint}
                  onChange={e => setNewKeyPoint(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddPoint())}
                  placeholder="Add a key update or constraint..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddPoint}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Tone & Audience Selection */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-indigo-400" />
                  <span>Desired Tone</span>
                </label>
                <select
                  value={input.tone}
                  onChange={e => setInput({ ...input, tone: e.target.value as EmailTone })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {toneOptions.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <Users className="w-3 h-3 text-purple-400" />
                  <span>Audience</span>
                </label>
                <select
                  value={input.audience}
                  onChange={e => setInput({ ...input, audience: e.target.value as EmailAudience })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {audienceOptions.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Urgency & Call to Action */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 text-amber-400" />
                  <span>Urgency Level</span>
                </label>
                <select
                  value={input.urgency}
                  onChange={e => setInput({ ...input, urgency: e.target.value as EmailUrgency })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  {urgencyOptions.map(u => (
                    <option key={u} value={u}>{u}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Call to Action (CTA)</label>
                <input
                  type="text"
                  value={input.callToAction}
                  onChange={e => setInput({ ...input, callToAction: e.target.value })}
                  placeholder="e.g. Please approve by 3 PM"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !input.topic.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-indigo-700/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Drafting Structured Email...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Generate Polished Email</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Generated Email & Variations (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {output ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              
              {/* Header with tone badge & actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Tone:</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                    {input.tone}
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-medium">
                    {input.audience}
                  </span>
                </div>

                {/* View switcher: Standard vs Concise */}
                <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
                  <button
                    onClick={() => setActiveVersion('standard')}
                    className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                      activeVersion === 'standard'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Full Structured Draft
                  </button>
                  <button
                    onClick={() => setActiveVersion('short')}
                    className={`text-xs px-3 py-1 rounded-md font-medium transition-all ${
                      activeVersion === 'short'
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Concise (Executive Quick)
                  </button>
                </div>
              </div>

              {/* Subject Line Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                  Subject Line Options
                </label>
                <div className="space-y-1.5">
                  {output.subjectOptions.map((subj, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedSubject(subj)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                        selectedSubject === subj
                          ? 'bg-indigo-950/40 border-indigo-500/80 text-white font-medium shadow-sm'
                          : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                          selectedSubject === subj ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-600'
                        }`}>
                          {selectedSubject === subj ? '?' : idx + 1}
                        </span>
                        <span className="truncate">{subj}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(subj, `subj-${idx}`);
                        }}
                        className="text-slate-400 hover:text-indigo-300 p-1 flex-shrink-0"
                        title="Copy subject"
                      >
                        {copiedSection === `subj-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Content Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {activeVersion === 'standard' ? 'Email Body' : 'Executive Concise Variant'}
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const fullEmail = `Subject: ${selectedSubject}\n\n${activeVersion === 'standard' ? output.body : output.shortVersion}`;
                        copyToClipboard(fullEmail, 'entire-email');
                      }}
                      className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition-colors font-medium"
                    >
                      {copiedSection === 'entire-email' ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied All!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Full Email</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4.5 font-sans text-xs sm:text-sm text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner">
                  {activeVersion === 'standard' ? output.body : output.shortVersion}
                </div>
              </div>

              {/* Follow-up Strategy & AI Guardrail Note */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5">
                <div className="flex items-center justify-between text-indigo-400 font-semibold">
                  <span>Follow-up Cadence Recommendation</span>
                  <span className="text-[10px] text-slate-500">Automated cadence</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  {output.followUpPlan}
                </p>
              </div>

              <DisclaimerBanner variant="inline" />
            </div>
          ) : (
            /* Empty State */
            <div className="h-full min-h-[420px] bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-400 shadow-lg">
                <Mail className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Smart Email Generator</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
                Configure your key updates, tone, and audience on the left, then click <strong className="text-indigo-300">"Generate Polished Email"</strong>. You'll receive subject lines and both full & concise variants ready to copy.
              </p>
              <button
                onClick={() => handleGenerate()}
                className="mt-5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Try with Default Sample</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
