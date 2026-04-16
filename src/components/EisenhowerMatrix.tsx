import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';

interface EisenhowerMatrixProps {
  selectedDate: Date;
}

const quadrants = [
  { label: 'Do First', filter: (t: { priority: string; urgency: string }) => t.priority === 'important' && t.urgency === 'urgent', color: 'hsl(var(--danger))' },
  { label: 'Schedule', filter: (t: { priority: string; urgency: string }) => t.priority === 'important' && t.urgency === 'not-urgent', color: 'hsl(var(--chart-4))' },
  { label: 'Delegate', filter: (t: { priority: string; urgency: string }) => t.priority === 'not-important' && t.urgency === 'urgent', color: 'hsl(var(--warning))' },
  { label: 'Eliminate', filter: (t: { priority: string; urgency: string }) => t.priority === 'not-important' && t.urgency === 'not-urgent', color: 'hsl(var(--muted-foreground))' },
];

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr && !t.completed);

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <h3 className="font-semibold text-foreground mb-3">Priority Matrix</h3>
      <div className="grid grid-cols-2 gap-2">
        {quadrants.map(q => {
          const qTasks = dayTasks.filter(q.filter);
          return (
            <div key={q.label} className="rounded-lg p-3 min-h-[80px]" style={{ backgroundColor: q.color + '10', borderLeft: `3px solid ${q.color}` }}>
              <div className="text-xs font-semibold mb-1.5" style={{ color: q.color }}>{q.label}</div>
              {qTasks.length === 0 ? (
                <div className="text-xs text-muted-foreground/50">—</div>
              ) : (
                qTasks.slice(0, 3).map(t => <div key={t.id} className="text-xs text-foreground/80 truncate">{t.name}</div>)
              )}
              {qTasks.length > 3 && <div className="text-xs text-muted-foreground">+{qTasks.length - 3} more</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EisenhowerMatrix;
