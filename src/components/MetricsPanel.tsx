import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval } from 'date-fns';
import { Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { getPlannedMinutes, getActualMinutes, formatDuration, ViewMode } from '@/types/task';

interface MetricsPanelProps {
  selectedDate: Date;
  activeView: ViewMode;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ selectedDate, activeView }) => {
  const { tasks } = useTasks();
  
  const getFilteredTasks = () => {
    if (activeView === 'tasks' || activeView === 'daily') {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      return tasks.filter(t => t.date === dateStr);
    }
    
    let start: Date, end: Date;
    
    if (activeView === 'weekly') {
      start = startOfWeek(selectedDate, { weekStartsOn: 1 });
      end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    } else if (activeView === 'monthly') {
      start = startOfMonth(selectedDate);
      end = endOfMonth(selectedDate);
    } else if (activeView === 'yearly') {
      start = startOfYear(selectedDate);
      end = endOfYear(selectedDate);
    } else {
      // Analytics or other: show all tasks for current selection context
      return tasks;
    }

    return tasks.filter(t => {
      const taskDate = new Date(t.date);
      return isWithinInterval(taskDate, { start, end });
    });
  };

  const filteredTasks = getFilteredTasks();
  const total = filteredTasks.length;
  const completed = filteredTasks.filter(t => t.completed).length;
  const totalPlanned = filteredTasks.reduce((s, t) => s + getPlannedMinutes(t), 0);
  const totalActual = filteredTasks.reduce((s, t) => s + getActualMinutes(t), 0);

  // Productivity score: weighted by completion, priority, and time accuracy
  const score = total === 0 ? 0 : Math.min(100, Math.round(
    (completed / total) * 60 +
    (totalPlanned > 0 ? Math.max(0, 1 - Math.abs(totalActual - totalPlanned) / totalPlanned) * 25 : 25) +
    (filteredTasks.filter(t => t.completed && t.priority === 'important').length / Math.max(1, filteredTasks.filter(t => t.priority === 'important').length)) * 15
  ));

  const metrics = [
    { label: 'Tasks', value: `${completed}/${total}`, icon: <Target size={18} />, color: 'hsl(var(--chart-4))' },
    { label: 'Completed', value: total > 0 ? `${Math.round((completed / total) * 100)}%` : '—', icon: <CheckCircle2 size={18} />, color: 'hsl(var(--success))' },
    { label: 'Time Spent', value: totalActual > 0 ? formatDuration(totalActual) : '—', icon: <Clock size={18} />, color: 'hsl(var(--warning))' },
    { label: 'Productivity', value: total > 0 ? `${score}` : '—', icon: <TrendingUp size={18} />, color: score >= 70 ? 'hsl(var(--success))' : score >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--danger))' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-slide-up">
      {metrics.map((m, index) => (
        <div 
          key={m.label} 
          className="glass-card-hover rounded-2xl p-6 relative overflow-hidden group transition-all"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {/* Background pattern */}
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
            {React.cloneElement(m.icon as React.ReactElement, { size: 100 })}
          </div>

          <div className="flex flex-col items-start gap-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110" style={{ backgroundColor: m.color + '15', color: m.color }}>
              {m.icon}
            </div>
            
            <div className="space-y-0.5">
              <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tighter">
                {m.value}
              </div>
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {m.label}
              </div>
            </div>
          </div>
          
          <div className="absolute left-0 bottom-0 h-1 w-full opacity-20" style={{ backgroundColor: m.color }} />
        </div>
      ))}
    </div>
  );
};

export default MetricsPanel;
