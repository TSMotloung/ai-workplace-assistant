import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Copy, 
  Check, 
  TrendingUp, 
  ShieldAlert, 
  Compass, 
  BarChart3, 
  Lightbulb, 
  Layers, 
  FileText, 
  RefreshCw,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ResearchInput, ResearchOutput, ResearchDepth } from '../../types';
import { AIEngineService } from '../../services/aiEngine';
import { saveHistoryItem } from '../../services/storage';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface ResearchAssistantViewProps {
  initialPrompt?: string;
  onSaveNotification?: (msg: string) => void;
}

export const ResearchAssistantView: React.FC<ResearchAssistantViewProps> = ({ initialPrompt = '', onSaveNotification }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [input, setInput] = useState<ResearchInput>({
    topic: initialPrompt || 'Enterprise AI Agentic Workflows & Multi-Modal Copilot Adoption',
    industryContext: 'B2B SaaS / Enterprise Productivity & Cloud Services',
    targetObjective: 'Assess market velocity, executive governance requirements, and 2026-2027 competitive landscape',
    depth: 'Strategic Market & Competitive Overview'
  });

  const [output, setOutput] = useState<ResearchOutput | null>(null);

  const depths: ResearchDepth[] = [
    'Executive Brief (1 min read)',
    'Strategic Market & Competitive Overview',
    'SWOT & Risk Assessment',
    'Actionable Implementation Roadmap'
  ];

  const handleResearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.topic.trim()) return;

    setLoading(true);
    try {
      const res = await AIEngineService.conductResearch(input);
      setOutput(res);

      saveHistoryItem(
        'research',
        `Research: ${input.topic.slice(0, 35)}...`,
        `Analysis: ${res.executiveTakeaway.slice(0, 50)}...`,
        { input, output: res }
      );

      confetti({
        particleCount: 35,
        spread: 55,
        origin: { y: 0.8 }
      });
      if (onSaveNotification) onSaveNotification('Research analysis synthesized & saved');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!output) return;
    const formatted = `# ${output.title}
**Context:** ${input.industryContext} | **Objective:** ${input.targetObjective}

## Executive Summary
${output.executiveTakeaway}

## Core Insights
${output.coreInsights.map(c => `### ${c.heading}\n- **Insight:** ${c.point}\n- **Strategic Impact:** ${c.impact}`).join('\n\n')}

## Market Landscape
${output.marketLandscape}

## Strategic Recommendations
${output.strategicRecommendations.map(r => `- **[${r.priority}] ${r.step}**: ${r.rationale}`).join('\n')}
`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadPreset = (preset: 'compliance' | 'saas' | 'hybrid') => {
    if (preset === 'compliance') {
      setInput({
        topic: 'EU AI Act & Corporate Governance Guardrails for Generative Assistants',
        industryContext: 'Fintech & Enterprise Banking',
        targetObjective: 'Identify mandatory compliance criteria and liability implications for internal AI tools',
        depth: 'SWOT & Risk Assessment'
      });
    } else if (preset === 'saas') {
      setInput({
        topic: 'Pricing Models for AI SaaS: Seat-based vs Token Consumption vs Value-based',
        industryContext: 'Software & Cloud Platforms',
        targetObjective: 'Synthesize industry best practices to maximize customer LTV and minimize margin compression',
        depth: 'Strategic Market & Competitive Overview'
      });
    } else if (preset === 'hybrid') {
      setInput({
        topic: 'Hybrid Workplace Collaboration Fatigue & Asynchronous AI Solutions',
        industryContext: 'Global Distributed Workforce',
        targetObjective: 'Evaluate how automated standups and meeting synthesizers reduce burnout',
        depth: 'Executive Brief (1 min read)'
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
              <Search className="w-5 h-5 text-cyan-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Research Parameters</h2>
            </div>
            <div className="flex items-center gap-1 text-[11px]">
              <span className="text-slate-500">Topics:</span>
              <button onClick={() => loadPreset('compliance')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Gov</button>
              <button onClick={() => loadPreset('saas')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Pricing</button>
              <button onClick={() => loadPreset('hybrid')} className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300">Async</button>
            </div>
          </div>

          <form onSubmit={handleResearch} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Research Subject / Market Query *</label>
              <input
                type="text"
                required
                value={input.topic}
                onChange={e => setInput({ ...input, topic: e.target.value })}
                placeholder="e.g. Next-gen AI workplace trends 2026"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Industry Context / Sector</label>
              <input
                type="text"
                value={input.industryContext}
                onChange={e => setInput({ ...input, industryContext: e.target.value })}
                placeholder="e.g. Healthcare, B2B SaaS, E-Commerce"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Target Business Objective</label>
              <input
                type="text"
                value={input.targetObjective}
                onChange={e => setInput({ ...input, targetObjective: e.target.value })}
                placeholder="What strategic question are you trying to answer?"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Synthesis Format & Depth</label>
              <select
                value={input.depth}
                onChange={e => setInput({ ...input, depth: e.target.value as ResearchDepth })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                {depths.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading || !input.topic.trim()}
              className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-cyan-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Synthesizing Market Intelligence...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-200" />
                  <span>Generate Executive Research Brief</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Insights & SWOT (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {output ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Executive Synthesis</span>
                  <p className="text-[11px] text-slate-400">{output.title}</p>
                </div>

                <button
                  onClick={handleCopy}
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/30 transition-colors font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Report!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Full Brief</span>
                    </>
                  )}
                </button>
              </div>

              {/* Executive Takeaway */}
              <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300 uppercase tracking-wider">
                  <Compass className="w-4 h-4 text-cyan-400" />
                  <span>Executive Takeaway</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {output.executiveTakeaway}
                </p>
              </div>

              {/* Core Insights */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-400" />
                  <span>Key Pillars & Market Drivers</span>
                </h3>

                <div className="space-y-2.5">
                  {output.coreInsights.map((insight, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                      <div className="text-xs font-bold text-white flex items-center gap-2">
                        <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span>{insight.heading}</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{insight.point}</p>
                      <div className="text-[11px] text-cyan-300/80 bg-cyan-950/30 p-2 rounded border border-cyan-900/30">
                        <strong>Impact:</strong> {insight.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SWOT Matrix */}
              {output.swotAnalysis && (
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BarChart3 className="w-4 h-4 text-purple-400" />
                    <span>SWOT Analysis Breakdown</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-1">
                      <span className="font-bold text-emerald-400">Strengths (S)</span>
                      <ul className="text-slate-300 list-disc list-inside text-[11px] space-y-0.5">
                        {output.swotAnalysis.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1">
                      <span className="font-bold text-amber-400">Weaknesses (W)</span>
                      <ul className="text-slate-300 list-disc list-inside text-[11px] space-y-0.5">
                        {output.swotAnalysis.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-1">
                      <span className="font-bold text-cyan-400">Opportunities (O)</span>
                      <ul className="text-slate-300 list-disc list-inside text-[11px] space-y-0.5">
                        {output.swotAnalysis.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1">
                      <span className="font-bold text-rose-400">Threats (T)</span>
                      <ul className="text-slate-300 list-disc list-inside text-[11px] space-y-0.5">
                        {output.swotAnalysis.threats.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Strategic Recommendations */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-emerald-400" />
                  <span>Strategic Recommendations</span>
                </h3>
                <div className="space-y-2">
                  {output.strategicRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-semibold text-slate-200">{rec.step}</span>
                        <p className="text-[11px] text-slate-400 mt-0.5">{rec.rationale}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold self-start sm:self-auto flex-shrink-0 ${
                        rec.priority === 'Immediate' ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}>
                        {rec.priority}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <DisclaimerBanner variant="inline" />
            </div>
          ) : (
            <div className="h-full min-h-[420px] bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-cyan-950/50 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-400 shadow-lg">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">Executive Research Assistant</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
                Enter any strategic industry question or market query. The AI assistant extracts macro drivers, compiles SWOT matrices, and outputs decision-grade recommendations.
              </p>
              <button
                onClick={() => handleResearch()}
                className="mt-5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Synthesize Sample Intelligence</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
