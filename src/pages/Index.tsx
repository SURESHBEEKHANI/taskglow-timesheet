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
import ProductivityScore from '@/components/ProductivityScore';
import BurnoutAlert from '@/components/BurnoutAlert';
import FocusMetrics from '@/components/FocusMetrics';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('tasks');
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      {/* Abstract Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none animate-float" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-chart-4/5 blur-[120px] pointer-events-none animate-float" style={{ animationDelay: '-3s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <DashboardHeader activeView={activeView} onViewChange={setActiveView} selectedDate={selectedDate} onDateChange={setSelectedDate} />
        
        <div className="mt-8">
          <MetricsPanel selectedDate={selectedDate} activeView={activeView} />
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">
          <div className="space-y-8">
            {activeView !== 'analytics' && (
              <>
                <div className="glass-card rounded-2xl p-1">
                  <TaskForm selectedDate={selectedDate} />
                </div>
                <FocusMetrics selectedDate={selectedDate} />
              </>
            )}

            <main className="animate-fade-in min-h-[400px]">
              {activeView === 'tasks' && <TaskList selectedDate={selectedDate} />}
              {activeView === 'daily' && <DailyView selectedDate={selectedDate} />}
              {activeView === 'weekly' && <WeeklyView selectedDate={selectedDate} />}
              {activeView === 'monthly' && <MonthlyView selectedDate={selectedDate} onDateChange={setSelectedDate} />}
              {activeView === 'yearly' && <YearlyView selectedDate={selectedDate} />}
              {activeView === 'analytics' && <AnalyticsView selectedDate={selectedDate} />}
            </main>
          </div>

          <aside className="space-y-8 h-fit lg:sticky lg:top-8">
            <ProductivityScore selectedDate={selectedDate} />
            <BurnoutAlert />
            
            <div className="glass-card-hover rounded-2xl p-6">
              <PomodoroTimer />
            </div>
            
            <AIInsights selectedDate={selectedDate} />
            <SummaryChart selectedDate={selectedDate} />
            <EisenhowerMatrix selectedDate={selectedDate} />
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
