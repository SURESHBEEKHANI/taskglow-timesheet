import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { Target, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface MetricsPanelProps {
  selectedDate: Date;
}

const MetricsPanel: React.FC<MetricsPanelProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr);
  const total = dayTasks.length;
  const completed = dayTasks.filter(t => t.completed).length;
  const critical = dayTasks.filter(t => t.importance === 'critical' && !t.completed).length;
  const urgent = dayTasks.filter(t => t.urgency === 'urgent' && !t.completed).length;

  const metrics = [
    { label: 'Total', value: total, icon: <Target size={18} />, color: 'hsl(var(--chart-4))' },
    { label: 'Done', value: completed, icon: <CheckCircle2 size={18} />, color: 'hsl(var(--success))' },
    { label: 'Critical', value: critical, icon: <AlertTriangle size={18} />, color: 'hsl(var(--danger))' },
    { label: 'Urgent', value: urgent, icon: <Clock size={18} />, color: 'hsl(var(--warning))' },
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
