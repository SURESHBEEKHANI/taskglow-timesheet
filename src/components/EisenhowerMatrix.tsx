import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { Flame, Calendar, Users, Trash2 } from 'lucide-react';

interface EisenhowerMatrixProps {
  selectedDate: Date;
}

const quadrants = [
  { 
    label: 'Do First', 
    id: 'do',
    description: 'Urgent & Important',
    filter: (t: { priority: string; urgency: string }) => t.priority === 'important' && t.urgency === 'urgent', 
    color: 'hsl(var(--danger))',
    icon: <Flame size={14} />
  },
  { 
    label: 'Schedule', 
    id: 'schedule',
    description: 'Important, Not Urgent',
    filter: (t: { priority: string; urgency: string }) => t.priority === 'important' && t.urgency === 'not-urgent', 
    color: 'hsl(var(--primary))',
    icon: <Calendar size={14} />
  },
  { 
    label: 'Delegate', 
    id: 'delegate',
    description: 'Urgent, Not Important',
    filter: (t: { priority: string; urgency: string }) => t.priority === 'not-important' && t.urgency === 'urgent', 
    color: 'hsl(var(--warning))',
    icon: <Users size={14} />
  },
  { 
    label: 'Eliminate', 
    id: 'eliminate',
    description: 'Neither',
    filter: (t: { priority: string; urgency: string }) => t.priority === 'not-important' && t.urgency === 'not-urgent', 
    color: 'hsl(var(--muted-foreground))',
    icon: <Trash2 size={14} />
  },
];

const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr && !t.completed);

  return (
    <div className="glass-card-hover rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-sm font-bold text-foreground uppercase tracking-widest leading-none">Priority Matrix</h3>
          <p className="text-[10px] text-muted-foreground mt-1.5 uppercase font-medium">Eisenhower Method</p>
        </div>
        <div className="px-2 py-1 rounded bg-secondary/50 text-[10px] font-bold text-muted-foreground uppercase">
          {dayTasks.length} Tasks
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 aspect-square sm:aspect-auto">
        {quadrants.map(q => {
          const qTasks = dayTasks.filter(q.filter);
          return (
            <div 
              key={q.id} 
              className="group relative flex flex-col rounded-xl p-3 border border-border/40 transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 bg-secondary/20"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110" style={{ backgroundColor: q.color + '20', color: q.color }}>
                  {q.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-tight text-foreground truncate">{q.label}</div>
                </div>
              </div>

              <div className="flex-1 space-y-1 overflow-hidden">
                {qTasks.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-[10px] text-muted-foreground/30 font-medium italic">Empty</div>
                  </div>
                ) : (
                  <>
                    {qTasks.slice(0, 2).map(t => (
                      <div key={t.id} className="text-[10px] text-muted-foreground truncate flex items-center gap-1.5 leading-relaxed">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: q.color }} />
                        <span className="truncate">{t.name}</span>
                      </div>
                    ))}
                    {qTasks.length > 2 && (
                      <div className="text-[9px] font-bold text-primary/70 mt-1">
                        +{qTasks.length - 2} more
                      </div>
                    )}
                  </>
                )}
              </div>
              
              {/* Description backdrop on hover */}
              <div className="absolute inset-0 bg-background/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-3 rounded-xl pointer-events-none">
                <div className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: q.color }}>{q.label}</div>
                <div className="text-[9px] text-center text-muted-foreground font-medium leading-tight px-1">{q.description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EisenhowerMatrix;
