import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { Target, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { getPlannedMinutes, getActualMinutes, formatDuration } from '@/types/task';

interface MetricsPanelProps {
  selectedDate: Date;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr);
  const total = dayTasks.length;
  const completed = dayTasks.filter(t => t.completed).length;
  const totalPlanned = dayTasks.reduce((s, t) => s + getPlannedMinutes(t), 0);
  const totalActual = dayTasks.reduce((s, t) => s + getActualMinutes(t), 0);

  // Productivity score: weighted by completion, priority, and time accuracy
  const score = total === 0 ? 0 : Math.min(100, Math.round(
    (completed / total) * 60 +
    (totalPlanned > 0 ? Math.max(0, 1 - Math.abs(totalActual - totalPlanned) / totalPlanned) * 25 : 25) +
    (dayTasks.filter(t => t.completed && t.priority === 'important').length / Math.max(1, dayTasks.filter(t => t.priority === 'important').length)) * 15
  ));

  const metrics = [
    { label: 'Tasks', value: `${completed}/${total}`, icon: <Target size={18} />, color: 'hsl(var(--chart-4))' },
    { label: 'Completed', value: total > 0 ? `${Math.round((completed / total) * 100)}%` : '—', icon: <CheckCircle2 size={18} />, color: 'hsl(var(--success))' },
    { label: 'Time Spent', value: totalActual > 0 ? formatDuration(totalActual) : '—', icon: <Clock size={18} />, color: 'hsl(var(--warning))' },
    { label: 'Productivity', value: total > 0 ? `${score}` : '—', icon: <TrendingUp size={18} />, color: score >= 70 ? 'hsl(var(--success))' : score >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--danger))' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-slide-up">
      {metrics.map(m => (
        <div key={m.label} className="glass-card-hover rounded-xl p-4 text-center">
          <div className="flex items-center justify-center mb-2" style={{ color: m.color }}>{m.icon}</div>
          <div className="text-2xl font-bold text-foreground">{m.value}</div>
          <div className="text-xs text-muted-foreground">{m.label}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricsPanel;
