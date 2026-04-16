import React, { useMemo } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format, isSameDay } from 'date-fns';
import { getActualMinutes, formatDuration } from '@/types/task';
import { Focus, Coffee, ChevronRight, Zap, Target } from 'lucide-react';

interface FocusMetricsProps {
  selectedDate: Date;
}

const FocusMetrics: React.FC<FocusMetricsProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr);

  const analytics = useMemo(() => {
    let focusMins = 0;
    let distractionMins = 0;
    const distractors: { name: string; mins: number }[] = [];

    dayTasks.forEach(t => {
      const mins = getActualMinutes(t);
      if (t.priority === 'important') {
        focusMins += mins;
      } else {
        distractionMins += mins;
        if (mins > 0) distractors.push({ name: t.name, mins });
      }
    });

    const total = focusMins + distractionMins;
    const focusRatio = total > 0 ? (focusMins / total) * 100 : 0;

    return { focusMins, distractionMins, focusRatio, distractors: distractors.sort((a, b) => b.mins - a.mins).slice(0, 3) };
  }, [dayTasks]);

  if (dayTasks.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-slide-up">
      {/* Focus Power */}
      <div className="glass-card-hover rounded-2xl p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-primary">
            <Focus size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Focus Intensity</h3>
          </div>
          <span className="text-2xl font-black tracking-tighter text-primary">{Math.round(analytics.focusRatio)}%</span>
        </div>
        
        <div className="space-y-4">
          <div className="h-2 w-full bg-secondary/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-1000" 
              style={{ width: `${analytics.focusRatio}%` }} 
            />
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Deep Work</p>
              <p className="text-lg font-bold text-foreground">{formatDuration(analytics.focusMins)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-muted-foreground uppercase font-bold">Flow Quality</p>
              <p className="text-xs font-bold text-primary">{analytics.focusRatio > 70 ? 'HIGH' : analytics.focusRatio > 40 ? 'STABLE' : 'LOW'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Distraction Detection */}
      <div className="glass-card-hover rounded-2xl p-6 border-chart-3/20 bg-gradient-to-br from-chart-3/5 to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-chart-3">
            <Coffee size={18} />
            <h3 className="text-xs font-bold uppercase tracking-widest">Distraction Layer</h3>
          </div>
          <span className="text-xl font-black tracking-tighter text-chart-3">{formatDuration(analytics.distractionMins)}</span>
        </div>

        <div className="space-y-3">
          {analytics.distractors.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic py-2">No significant distractions detected today.</p>
          ) : (
            analytics.distractors.map((d, i) => (
              <div key={i} className="flex items-center justify-between group">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-1 h-1 rounded-full bg-chart-3/50" />
                  <span className="text-[11px] text-muted-foreground truncate group-hover:text-foreground transition-colors">{d.name}</span>
                </div>
                <span className="text-[10px] font-bold text-chart-3/80">{formatDuration(d.mins)}</span>
              </div>
            ))
          )}
          {analytics.distractionMins > 60 && (
            <div className="mt-2 pt-2 border-t border-chart-3/10">
              <p className="text-[9px] text-chart-3 font-bold uppercase tracking-wider">AI Suggestion: Batch these tasks to avoid context switching.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FocusMetrics;
