import React, { useMemo } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { getPlannedMinutes, getActualMinutes, formatDuration } from '@/types/task';
import { Sparkles, AlertTriangle, TrendingUp, Zap } from 'lucide-react';

interface AIInsightsProps {
  selectedDate: Date;
}

const AIInsights: React.FC<AIInsightsProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr);

  const dailyInsights = useMemo(() => {
    const results: { icon: React.ReactNode; text: string; type: 'info' | 'warning' | 'success' }[] = [];

    if (dayTasks.length === 0) return results;

    const lowPriTime = dayTasks
      .filter(t => t.priority === 'not-important')
      .reduce((s, t) => s + (getActualMinutes(t) || getPlannedMinutes(t)), 0);
    
    if (lowPriTime > 60) {
      results.push({
        icon: <AlertTriangle size={14} />,
        text: `Spent ${formatDuration(lowPriTime)} on low-priority work.`,
        type: 'warning',
      });
    }

    const overruns = dayTasks.filter(t => {
      const planned = getPlannedMinutes(t);
      const actual = getActualMinutes(t);
      return actual > 0 && planned > 0 && actual > planned * 1.3;
    });
    
    if (overruns.length > 0) {
      results.push({
        icon: <Zap size={14} />,
        text: `${overruns.length} tasks overran. Increase buffers.`,
        type: 'warning',
      });
    }

    const completed = dayTasks.filter(t => t.completed).length;
    if (completed === dayTasks.length && dayTasks.length >= 2) {
      results.push({
        icon: <TrendingUp size={14} />,
        text: '100% completion rate today! Perfect.',
        type: 'success',
      });
    }

    return results;
  }, [dayTasks]);

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Daily Suggestions */}
      <div className="glass-card-hover rounded-2xl p-5">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles size={16} className="text-chart-4" /> Daily Insights
        </h3>
        <div className="space-y-3">
          {dailyInsights.length === 0 ? (
            <p className="text-[10px] text-muted-foreground/60 italic">Track more tasks today for instant feedback.</p>
          ) : (
            dailyInsights.map((ins, i) => (
              <div key={i} className="flex gap-3 items-start p-2 rounded-xl bg-secondary/30 border border-border/30">
                <div className="mt-1 opacity-70 flex-shrink-0">{ins.icon}</div>
                <span className="text-[11px] text-foreground/80 leading-normal">{ins.text}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsights;
