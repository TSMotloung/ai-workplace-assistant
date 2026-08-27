import React, { useState } from 'react';
import { 
  CheckSquare, 
  Sparkles, 
  Clock, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  ListChecks, 
  Layers, 
  Lightbulb, 
  Copy, 
  Check, 
  RefreshCw,
  Tag,
  Target
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TaskPlannerInput, TaskPlanOutput, PlannedTask } from '../../types';
import { AIEngineService } from '../../services/aiEngine';
import { saveHistoryItem } from '../../services/storage';
import { DisclaimerBanner } from '../common/DisclaimerBanner';

interface TaskPlannerViewProps {
  initialPrompt?: string;
  onSaveNotification?: (msg: string) => void;
}

export const TaskPlannerView: React.FC<TaskPlannerViewProps> = ({ initialPrompt = '', onSaveNotification }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  const [input, setInput] = useState<TaskPlannerInput>({
    projectGoal: initialPrompt || 'Ship v2.4 Release on Schedule & Prepare Board Deck',
    timeframe: 'This Week',
    availableHoursPerDay: 6,
    rawTasksList: `1. Review pull requests for OAuth token refresh vulnerability.
2. Draft slides for Q3 Product Strategy Review with CEO.
3. Review and sign off on new vendor invoice for monitoring services.
4. Prepare demo environment for high-priority enterprise lead call on Thursday.
5. Reorganize Figma workspace components and update design system tokens.
6. Write technical documentation for webhook reliability retries.
7. Conduct 1-on-1 performance review with Junior Engineer.`
  });

  const [output, setOutput] = useState<TaskPlanOutput | null>(null);

  const toggleTaskCompletion = (taskId: string) => {
    setCompletedTasks(prev => {
      const next = { ...prev, [taskId]: !prev[taskId] };
      if (next[taskId]) {
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.9 }
        });
      }
      return next;
    });
  };

  const handlePlan = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.rawTasksList.trim()) return;

    setLoading(true);
    try {
      const res = await AIEngineService.planTasks(input);
      setOutput(res);
      setCompletedTasks({});

      saveHistoryItem(
        'tasks',
        `Task Plan: ${input.projectGoal}`,
        `Optimized plan: ${res.totalEstimatedHours}h estimated over ${input.timeframe}`,
        { input, output: res }
      );

      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.8 }
      });
      if (onSaveNotification) onSaveNotification('Task backlog prioritized via Eisenhower Matrix');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyPlan = () => {
    if (!output) return;
    const formatted = `# Work Plan: ${input.projectGoal}
**Timeframe:** ${input.timeframe} | **Capacity:** ${input.availableHoursPerDay} hrs/day

## 1. Do First (Urgent & Important)
${output.eisenhowerBreakdown.doFirst.map(t => `- [ ] **${t.title}** (${t.estimatedHours}h) - ${t.actionableStep}`).join('\n')}

## 2. Schedule (Important)
${output.eisenhowerBreakdown.schedule.map(t => `- [ ] **${t.title}** (${t.estimatedHours}h) - Suggested: ${t.suggestedDayOrTime}`).join('\n')}

## 3. Delegate (Urgent)
${output.eisenhowerBreakdown.delegate.map(t => `- [ ] **${t.title}** (${t.estimatedHours}h) - ${t.suggestedDayOrTime}`).join('\n')}

## 4. Backlog / Eliminate
${output.eisenhowerBreakdown.backlog.map(t => `- [ ] **${t.title}** (${t.estimatedHours}h)`).join('\n')}
`;
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <DisclaimerBanner variant="subtle" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Inputs (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800/90 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-amber-400" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">Task Backlog & Goals</h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Eisenhower Matrix</span>
          </div>

          <form onSubmit={handlePlan} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Primary Objective / Milestone *</label>
              <input
                type="text"
                required
                value={input.projectGoal}
                onChange={e => setInput({ ...input, projectGoal: e.target.value })}
                placeholder="e.g. Q3 Sprint Launch, Client Delivery"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Time Horizon</label>
                <select
                  value={input.timeframe}
                  onChange={e => setInput({ ...input, timeframe: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Today">Today</option>
                  <option value="This Week">This Week</option>
                  <option value="Current Sprint (2 Weeks)">Current Sprint (2 Wks)</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Available Deep Work (hrs/day)</label>
                <input
                  type="number"
                  min={1}
                  max={14}
                  value={input.availableHoursPerDay}
                  onChange={e => setInput({ ...input, availableHoursPerDay: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Unstructured Tasks Brain-dump *
              </label>
              <textarea
                required
                rows={8}
                value={input.rawTasksList}
                onChange={e => setInput({ ...input, rawTasksList: e.target.value })}
                placeholder="List tasks, to-dos, or deliverables in any format..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono leading-relaxed resize-y"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !input.rawTasksList.trim()}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold text-sm py-3 rounded-xl shadow-lg shadow-amber-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Prioritizing & Scheduling Tasks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-200" />
                  <span>Generate Eisenhower Matrix Plan</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Output: Quadrants & Schedule (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {output ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider">Optimized Action Plan</h3>
                  <p className="text-[11px] text-slate-400">Total Workload: ~{output.totalEstimatedHours} hours</p>
                </div>

                <button
                  onClick={handleCopyPlan}
                  className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 transition-colors font-medium"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied Plan!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Export Markdown</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4 Quadrants Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Quadrant 1: Do First */}
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-400">
                    <span className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" />
                      <span>1. Do First (Urgent & Important)</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">
                      {output.eisenhowerBreakdown.doFirst.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {output.eisenhowerBreakdown.doFirst.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          completedTasks[task.id]
                            ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                            : 'bg-slate-950/80 border-rose-900/40 text-slate-200 hover:border-rose-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={!!completedTasks[task.id]}
                            onChange={() => {}}
                            className="mt-0.5 rounded border-slate-700 text-rose-500 focus:ring-0"
                          />
                          <div className="flex-1">
                            <span className="font-semibold">{task.title}</span>
                            <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                              <span className="text-rose-300/90">{task.suggestedDayOrTime}</span>
                              <span className="font-mono text-[10px] bg-slate-900 px-1 rounded">{task.estimatedHours}h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quadrant 2: Schedule */}
                <div className="p-3.5 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-indigo-400">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>2. Schedule (Deep Impact)</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                      {output.eisenhowerBreakdown.schedule.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {output.eisenhowerBreakdown.schedule.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          completedTasks[task.id]
                            ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                            : 'bg-slate-950/80 border-indigo-900/40 text-slate-200 hover:border-indigo-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={!!completedTasks[task.id]}
                            onChange={() => {}}
                            className="mt-0.5 rounded border-slate-700 text-indigo-500 focus:ring-0"
                          />
                          <div className="flex-1">
                            <span className="font-semibold">{task.title}</span>
                            <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                              <span className="text-indigo-300/90">{task.suggestedDayOrTime}</span>
                              <span className="font-mono text-[10px] bg-slate-900 px-1 rounded">{task.estimatedHours}h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quadrant 3: Delegate */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-amber-400">
                    <span className="flex items-center gap-1.5">
                      <ListChecks className="w-3.5 h-3.5" />
                      <span>3. Delegate / Automate</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                      {output.eisenhowerBreakdown.delegate.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {output.eisenhowerBreakdown.delegate.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => toggleTaskCompletion(task.id)}
                        className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          completedTasks[task.id]
                            ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                            : 'bg-slate-950/80 border-amber-900/40 text-slate-200 hover:border-amber-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={!!completedTasks[task.id]}
                            onChange={() => {}}
                            className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-0"
                          />
                          <div className="flex-1">
                            <span className="font-semibold">{task.title}</span>
                            <div className="mt-1 text-[11px] text-slate-400 flex items-center justify-between">
                              <span className="text-amber-300/90">{task.suggestedDayOrTime}</span>
                              <span className="font-mono text-[10px] bg-slate-900 px-1 rounded">{task.estimatedHours}h</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quadrant 4: Backlog */}
                <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>4. Backlog / Low Leverage</span>
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {output.eisenhowerBreakdown.backlog.length}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {output.eisenhowerBreakdown.backlog.map((task) => (
                      <div
                        key={task.id}
                        className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 text-xs text-slate-400"
                      >
                        <span className="font-medium">{task.title}</span>
                        <div className="mt-1 text-[11px] text-slate-500 flex items-center justify-between">
                          <span>{task.suggestedDayOrTime}</span>
                          <span className="font-mono text-[10px] bg-slate-900 px-1 rounded">{task.estimatedHours}h</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Productivity Tips Bar */}
              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1 text-xs">
                <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Cognitive Workload Advice</span>
                </div>
                <ul className="text-slate-400 text-xs list-disc list-inside space-y-0.5">
                  {output.productivityTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>

              <DisclaimerBanner variant="inline" />
            </div>
          ) : (
            <div className="h-full min-h-[420px] bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-8 text-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-950/50 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400 shadow-lg">
                <CheckSquare className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-white">AI Task Planner & Prioritizer</h3>
              <p className="text-xs text-slate-400 max-w-md mt-1.5 leading-relaxed">
                Paste your unorganized list of to-dos and available working hours. The system automatically categorizes your work into the 4 Eisenhower Quadrants with realistic daily time slots.
              </p>
              <button
                onClick={() => handlePlan()}
                className="mt-5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Optimize Sample Backlog</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
