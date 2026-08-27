import {
  EmailGenerationInput,
  EmailOutput,
  MeetingSummarizerInput,
  MeetingOutput,
  TaskPlannerInput,
  TaskPlanOutput,
  ResearchInput,
  ResearchOutput,
  ChatMessage,
  ChatPersona,
  HistoryItem,
  ToolType
} from '../types';

const HISTORY_KEY = 'agy_workplace_history_v1';
const SETTINGS_KEY = 'agy_workplace_settings_v1';

export const saveHistoryItem = (tool: ToolType, title: string, preview: string, data: any): HistoryItem => {
  const item: HistoryItem = {
    id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    tool,
    title,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }),
    preview,
    data
  };

  try {
    const existing = getHistory();
    const updated = [item, ...existing.filter(i => i.id !== item.id)].slice(0, 30);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error('Failed to save to local storage', e);
  }
  return item;
};

export const getHistory = (): HistoryItem[] => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const clearHistory = (): void => {
  localStorage.removeItem(HISTORY_KEY);
};

export interface AppSettings {
  apiKey?: string;
  theme: 'dark' | 'light';
  userName: string;
  userRole: string;
  company: string;
}

export const getSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    theme: 'dark',
    userName: 'Alex Morgan',
    userRole: 'Director of Product Strategy',
    company: 'NexusTech Global'
  };
};

export const saveSettings = (settings: AppSettings): void => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};
