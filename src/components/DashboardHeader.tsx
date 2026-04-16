import React from 'react';
import { ViewMode } from '@/types/task';
import { CalendarDays, LayoutList, Calendar, BarChart3 } from 'lucide-react';

const views: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
  { id: 'tasks', label: 'Tasks', icon: <LayoutList size={16} /> },
  { id: 'daily', label: 'Daily', icon: <CalendarDays size={16} /> },
  { id: 'monthly', label: 'Monthly', icon: <Calendar size={16} /> },
  { id: 'yearly', label: 'Yearly', icon: <BarChart3 size={16} /> },
];

interface DashboardHeaderProps {
  activeView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ activeView, onViewChange, selectedDate, onDateChange }) => {
  return (
    <header className="glass-card rounded-xl p-4 mb-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold gradient-text">TimeFlow</h1>
          <p className="text-sm text-muted-foreground">Plan · Track · Achieve</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="date"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={e => onDateChange(new Date(e.target.value + 'T00:00:00'))}
            className="bg-secondary text-secondary-foreground text-sm rounded-lg px-3 py-2 border-none outline-none focus:ring-2 focus:ring-primary/50"
          />
          <div className="flex bg-secondary rounded-lg p-1 gap-0.5">
            {views.map(v => (
              <button
                key={v.id}
                onClick={() => onViewChange(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeView === v.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
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
