import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/common/Sidebar';
import { Header } from './components/common/Header';
import { DashboardView } from './components/dashboard/DashboardView';
import { EmailGeneratorView } from './components/email/EmailGeneratorView';
import { MeetingSummarizerView } from './components/meeting/MeetingSummarizerView';
import { TaskPlannerView } from './components/tasks/TaskPlannerView';
import { ResearchAssistantView } from './components/research/ResearchAssistantView';
import { ChatbotView } from './components/chat/ChatbotView';
import { HistoryModal } from './components/common/HistoryModal';
import { SettingsModal } from './components/common/SettingsModal';
import { ToolType, HistoryItem } from './types';
import { getHistory, clearHistory, getSettings, saveSettings, AppSettings } from './services/storage';
import { CheckCircle } from 'lucide-react';

export function App() {
  const [currentTool, setCurrentTool] = useState<ToolType>('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeInitialPrompt, setActiveInitialPrompt] = useState<string>('');

  useEffect(() => {
    setHistory(getHistory());
  }, [currentTool, isHistoryOpen]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setHistory(getHistory());
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSelectTool = (tool: ToolType) => {
    setActiveInitialPrompt('');
    setCurrentTool(tool);
  };

  const handleQuickPrompt = (tool: ToolType, promptText: string) => {
    setActiveInitialPrompt(promptText);
    setCurrentTool(tool);
  };

  const handleSaveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    saveSettings(newSettings);
    showToast('Preferences updated successfully');
  };

  const handleClearHistory = () => {
    clearHistory();
    setHistory([]);
    showToast('History cleared');
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setCurrentTool(item.tool);
    if (item.data?.input?.topic) {
      setActiveInitialPrompt(item.data.input.topic);
    } else if (item.data?.input?.title) {
      setActiveInitialPrompt(item.data.input.title);
    } else if (item.data?.input?.projectGoal) {
      setActiveInitialPrompt(item.data.input.projectGoal);
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2 border border-indigo-400/40 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar
        currentTool={currentTool}
        onSelectTool={handleSelectTool}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Executive Header */}
        <Header
          currentTool={currentTool}
          onOpenSettings={() => setIsSettingsOpen(true)}
          userName={settings.userName}
          userRole={settings.userRole}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {currentTool === 'dashboard' && (
            <DashboardView
              onSelectTool={handleSelectTool}
              onQuickPrompt={handleQuickPrompt}
            />
          )}

          {currentTool === 'email' && (
            <EmailGeneratorView
              key={activeInitialPrompt || 'email-view'}
              initialPrompt={activeInitialPrompt}
              onSaveNotification={showToast}
            />
          )}

          {currentTool === 'meeting' && (
            <MeetingSummarizerView
              key={activeInitialPrompt || 'meeting-view'}
              initialPrompt={activeInitialPrompt}
              onSaveNotification={showToast}
            />
          )}

          {currentTool === 'tasks' && (
            <TaskPlannerView
              key={activeInitialPrompt || 'tasks-view'}
              initialPrompt={activeInitialPrompt}
              onSaveNotification={showToast}
            />
          )}

          {currentTool === 'research' && (
            <ResearchAssistantView
              key={activeInitialPrompt || 'research-view'}
              initialPrompt={activeInitialPrompt}
              onSaveNotification={showToast}
            />
          )}

          {currentTool === 'chat' && (
            <ChatbotView
              key={activeInitialPrompt || 'chat-view'}
              initialPrompt={activeInitialPrompt}
              onSaveNotification={showToast}
            />
          )}
        </main>
      </div>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
        onSelectHistoryItem={handleSelectHistoryItem}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
      />
    </div>
  );
}

export default App;
