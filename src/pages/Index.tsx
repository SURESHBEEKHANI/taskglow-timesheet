import React, { useState } from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { ViewMode } from '@/types/task';
import DashboardHeader from '@/components/DashboardHeader';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import DailyView from '@/components/DailyView';
import WeeklyView from '@/components/WeeklyView';
import MonthlyView from '@/components/MonthlyView';
import YearlyView from '@/components/YearlyView';
import AnalyticsView from '@/components/AnalyticsView';
import MetricsPanel from '@/components/MetricsPanel';
import SummaryChart from '@/components/SummaryChart';
import EisenhowerMatrix from '@/components/EisenhowerMatrix';
import PomodoroTimer from '@/components/PomodoroTimer';
import AIInsights from '@/components/AIInsights';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('tasks');
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader activeView={activeView} onViewChange={setActiveView} selectedDate={selectedDate} onDateChange={setSelectedDate} />
        <MetricsPanel selectedDate={selectedDate} />

        <div className="mt-6 grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)] gap-6">
          <div className="space-y-4">
            {activeView !== 'analytics' && <TaskForm selectedDate={selectedDate} />}

            <section className="glass-card rounded-xl p-3 sm:p-4">
              {activeView === 'tasks' && <TaskList selectedDate={selectedDate} />}
              {activeView === 'daily' && <DailyView selectedDate={selectedDate} />}
              {activeView === 'weekly' && <WeeklyView selectedDate={selectedDate} />}
              {activeView === 'monthly' && <MonthlyView selectedDate={selectedDate} onDateChange={setSelectedDate} />}
              {activeView === 'yearly' && <YearlyView selectedDate={selectedDate} />}
              {activeView === 'analytics' && <AnalyticsView selectedDate={selectedDate} />}
            </section>
          </div>

          <aside className="space-y-4 xl:sticky xl:top-6 h-fit">
            <PomodoroTimer />
            <EisenhowerMatrix selectedDate={selectedDate} />
            <AIInsights selectedDate={selectedDate} />
            <SummaryChart selectedDate={selectedDate} />
          </aside>
        </div>
      </div>
    </div>
  );
};

const Index: React.FC = () => (
  <TaskProvider>
    <Dashboard />
  </TaskProvider>
);

export default Index;
