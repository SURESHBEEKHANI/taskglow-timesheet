import React, { useState } from 'react';
import { TaskProvider } from '@/contexts/TaskContext';
import { ViewMode } from '@/types/task';
import DashboardHeader from '@/components/DashboardHeader';
import TaskForm from '@/components/TaskForm';
import TaskList from '@/components/TaskList';
import DailyView from '@/components/DailyView';
import MonthlyView from '@/components/MonthlyView';
import YearlyView from '@/components/YearlyView';
import MetricsPanel from '@/components/MetricsPanel';
import SummaryChart from '@/components/SummaryChart';
import EisenhowerMatrix from '@/components/EisenhowerMatrix';

const Dashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<ViewMode>('tasks');
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <DashboardHeader
          activeView={activeView}
          onViewChange={setActiveView}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        <MetricsPanel selectedDate={selectedDate} />

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <TaskForm selectedDate={selectedDate} />

            {activeView === 'tasks' && <TaskList selectedDate={selectedDate} />}
            {activeView === 'daily' && <DailyView selectedDate={selectedDate} />}
            {activeView === 'monthly' && <MonthlyView selectedDate={selectedDate} onDateChange={setSelectedDate} />}
            {activeView === 'yearly' && <YearlyView selectedDate={selectedDate} />}
          </div>

          <div className="space-y-4">
            <EisenhowerMatrix selectedDate={selectedDate} />
            <SummaryChart selectedDate={selectedDate} />
          </div>
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
