import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { ViewMode } from '@/types/task';
import { CalendarDays, LayoutList, Calendar, BarChart3, PieChart, Cloud, CloudOff, LoaderCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const views: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'tasks', label: 'Tasks', icon: <LayoutList size={16} /> },
  { id: 'daily', label: 'Daily', icon: <CalendarDays size={16} /> },
  { id: 'weekly', label: 'Weekly', icon: <Clock size={16} /> },
  { id: 'monthly', label: 'Monthly', icon: <Calendar size={16} /> },
  { id: 'yearly', label: 'Yearly', icon: <BarChart3 size={16} /> },
  { id: 'analytics', label: 'Analytics', icon: <PieChart size={16} /> },
];

interface DashboardHeaderProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeView, onViewChange, selectedDate, onDateChange }) => {
  const { isLoading, isSyncing, storageMode, syncError, lastSyncedAt } = useTasks();

  const syncLabel = isLoading
    ? 'Loading data...'
    : isSyncing
      ? 'Syncing to Supabase...'
      : storageMode === 'supabase'
        ? `Supabase synced${lastSyncedAt ? ` ${formatDistanceToNow(new Date(lastSyncedAt), { addSuffix: true })}` : ''}`
        : 'Local storage fallback';

  const SyncIcon = isLoading || isSyncing ? LoaderCircle : storageMode === 'supabase' ? Cloud : CloudOff;

  return (
    <header className="glass-card rounded-xl p-4 sm:p-5 mb-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text tracking-tight">TimeFlow</h1>
          <p className="text-sm text-muted-foreground mt-1">Plan, track, and improve your day with intention.</p>
          <div className={`mt-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${
            storageMode === 'supabase'
              ? 'border-success/20 bg-success/10 text-success'
              : 'border-warning/20 bg-warning/10 text-warning'
          }`}>
            <SyncIcon size={14} className={isLoading || isSyncing ? 'animate-spin' : ''} />
            <span>{syncLabel}</span>
          </div>
          {syncError && (
            <p className="mt-2 text-xs text-muted-foreground">
              {syncError}
            </p>
          )}
        </div>
        <div className="flex items-center gap-3 flex-wrap w-full sm:w-auto">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={e => onDateChange(new Date(e.target.value + 'T00:00:00'))}
            className="bg-secondary text-secondary-foreground text-sm rounded-lg px-3 py-2 border border-border/70 outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex bg-secondary/80 rounded-lg p-1 gap-0.5 w-full sm:w-auto overflow-x-auto">
            {views.map(v => (
              <button
                key={v.id}
                onClick={() => onViewChange(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeView === v.id
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/80'
                }`}
              >
                {v.icon}
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
