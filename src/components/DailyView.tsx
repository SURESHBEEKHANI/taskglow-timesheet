import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { IMPORTANCE_CONFIG } from '@/types/task';

interface DailyViewProps {
  selectedDate: Date;
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 6); // 6am-9pm

const DailyView: React.FC<DailyViewProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr);

  const getTaskPosition = (startTime: string, endTime: string) => {
    const [sh, sm] = startTime.split(':').map(Number);
    const [eh, em] = endTime.split(':').map(Number);
    const startMin = (sh - 6) * 60 + sm;
    const endMin = (eh - 6) * 60 + em;
    return { top: `${(startMin / (16 * 60)) * 100}%`, height: `${(Math.max(endMin - startMin, 15) / (16 * 60)) * 100}%` };
  };

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <h3 className="font-semibold text-foreground mb-4">{format(selectedDate, 'EEEE, MMMM d')}</h3>
      <div className="relative" style={{ height: '600px' }}>
        {HOURS.map(h => (
          <div key={h} className="absolute w-full flex items-start" style={{ top: `${((h - 6) / 16) * 100}%` }}>
            <span className="text-xs text-muted-foreground w-12 flex-shrink-0 -mt-2">{`${h}:00`}</span>
            <div className="flex-1 border-t border-border/50" />
          </div>
        ))}
        <div className="absolute left-12 right-0 top-0 bottom-0">
          {dayTasks.map(task => {
            const pos = getTaskPosition(task.startTime, task.endTime);
            const color = IMPORTANCE_CONFIG[task.importance].color;
            return (
              <div
                key={task.id}
                className={`absolute left-1 right-1 rounded-lg px-3 py-1.5 text-xs font-medium overflow-hidden ${task.completed ? 'opacity-50' : ''}`}
                style={{
                  ...pos,
                  backgroundColor: color + '20',
                  borderLeft: `3px solid ${color}`,
                  color: 'hsl(var(--foreground))',
                }}
              >
                <div className="truncate font-semibold">{task.name}</div>
                <div className="text-muted-foreground">{task.startTime} – {task.endTime}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DailyView;
