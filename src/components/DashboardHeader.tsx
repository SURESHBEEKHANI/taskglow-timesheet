import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { ViewMode } from '@/types/task';
import { CalendarDays, LayoutList, Calendar, BarChart3, PieChart, Cloud, CloudOff, LoaderCircle, Clock } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

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
  const { isLoading, isSyncing, storageMode, lastSyncedAt } = useTasks();

  const syncTooltip = isLoading
    ? 'Initializing...'
    : isSyncing
      ? 'Updating Supabase...'
      : storageMode === 'supabase'
        ? `Cloud Synced${lastSyncedAt ? ` • ${formatDistanceToNow(new Date(lastSyncedAt), { addSuffix: true })}` : ''}`
        : 'Local Only';

  const SyncIcon = isLoading || isSyncing ? LoaderCircle : storageMode === 'supabase' ? Cloud : CloudOff;

  return (
    <header className="animate-fade-in space-y-8">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl sm:text-4xl font-black gradient-text tracking-tighter">TaskGlow</h1>
          </div>
          <p className="text-sm font-medium text-muted-foreground max-w-lg">
            High-performance intentionality tracking.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input
              type="date"
              value={format(selectedDate, 'yyyy-MM-dd')}
              onChange={e => onDateChange(new Date(e.target.value + 'T00:00:00'))}
              className="w-full sm:w-auto bg-secondary/30 text-foreground text-sm font-bold rounded-xl pl-10 pr-4 py-2.5 border border-border/50 outline-none focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer"
            />
          </div>

          <div className="flex bg-secondary/40 backdrop-blur-md rounded-2xl p-1.5 gap-1 w-full sm:w-auto shadow-inner">
            {views.map(v => (
              <button
                key={v.id}
                onClick={() => onViewChange(v.id)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${
                  activeView === v.id
                    ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/30 ring-1 ring-white/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
                }`}
              >
                {v.icon}
                <span>{v.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-border/50 to-transparent" />
    </header>
  );
};

export default DashboardHeader;
