export type ToolType = 'dashboard' | 'email' | 'meeting' | 'tasks' | 'research' | 'chat';

export type EmailTone = 'Professional & Formal' | 'Assertive & Decisive' | 'Friendly & Warm' | 'Concise & Direct' | 'Persuasive & Sales' | 'Executive / C-Suite';
export type EmailAudience = 'Executive / Board' | 'Client / Partner' | 'Direct Report / Team' | 'Cross-Functional Peers' | 'Vendor / External';
export type EmailUrgency = 'Normal' | 'Urgent / Same-day' | 'Action Required' | 'FYI / Low Priority';

export interface EmailGenerationInput {
  recipientName: string;
  recipientRole: string;
  topic: string;
  keyPoints: string[];
  tone: EmailTone;
  audience: EmailAudience;
  urgency: EmailUrgency;
  callToAction: string;
  senderName: string;
  senderRole: string;
}

export interface EmailOutput {
  subjectOptions: string[];
  recommendedSubject: string;
  body: string;
  shortVersion: string;
  executiveSummary: string;
  followUpPlan: string;
}

export type MeetingType = '1-on-1 Sync' | 'Sprint Planning / Agile' | 'Executive Leadership' | 'Client Pitch / Review' | 'Project Kickoff' | 'Brainstorming / Workshop';

export interface MeetingSummarizerInput {
  title: string;
  meetingType: MeetingType;
  attendees: string;
  date: string;
  rawNotes: string;
  focusArea?: string;
}

export interface MeetingActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface MeetingOutput {
  executiveSummary: string;
  keyDiscussions: { topic: string; details: string }[];
  decisions: string[];
  actionItems: MeetingActionItem[];
  blockersOrRisks: string[];
  nextSteps: string[];
}

export type TaskUrgency = 'High' | 'Medium' | 'Low';
export type TaskImportance = 'High' | 'Medium' | 'Low';

export interface TaskPlannerInput {
  projectGoal: string;
  timeframe: 'Today' | 'This Week' | 'Current Sprint (2 Weeks)' | 'Monthly';
  availableHoursPerDay: number;
  rawTasksList: string;
}

export interface PlannedTask {
  id: string;
  title: string;
  category: 'Do First (Urgent & Important)' | 'Schedule (Important)' | 'Delegate (Urgent)' | 'Eliminate / Backlog';
  estimatedHours: number;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  suggestedDayOrTime: string;
  actionableStep: string;
  completed?: boolean;
}

export interface TaskPlanOutput {
  summary: string;
  totalEstimatedHours: number;
  eisenhowerBreakdown: {
    doFirst: PlannedTask[];
    schedule: PlannedTask[];
    delegate: PlannedTask[];
    backlog: PlannedTask[];
  };
  dailySchedule: {
    day: string;
    focusTheme: string;
    tasks: string[];
  }[];
  productivityTips: string[];
}

export type ResearchDepth = 'Executive Brief (1 min read)' | 'Strategic Market & Competitive Overview' | 'SWOT & Risk Assessment' | 'Actionable Implementation Roadmap';

export interface ResearchInput {
  topic: string;
  industryContext: string;
  targetObjective: string;
  depth: ResearchDepth;
}

export interface ResearchOutput {
  title: string;
  executiveTakeaway: string;
  coreInsights: { heading: string; point: string; impact: string }[];
  marketLandscape: string;
  swotAnalysis?: {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
    threats: string[];
  };
  strategicRecommendations: { step: string; priority: 'Immediate' | 'Short-term' | 'Long-term'; rationale: string }[];
  keyMetricsToWatch: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  persona?: string;
}

export type ChatPersona = 'General Workplace Copilot' | 'Executive Strategy Advisor' | 'Agile Project Manager' | 'Corporate Communications Expert' | 'HR & Talent Specialist';

export interface HistoryItem {
  id: string;
  tool: ToolType;
  title: string;
  timestamp: string;
  preview: string;
  data: any;
}
