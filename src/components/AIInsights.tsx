import React, { useMemo } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { getPlannedMinutes, getActualMinutes, formatDuration } from '@/types/task';
import { Sparkles, Lightbulb, AlertTriangle, TrendingUp } from 'lucide-react';

interface AIInsightsProps {
  selectedDate: Date;
}

const AIInsights: React.FC<AIInsightsProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr);

  const insights = useMemo(() => {
    const results: { icon: React.ReactNode; text: string; type: 'info' | 'warning' | 'success' }[] = [];

    if (dayTasks.length === 0) return results;

    // Low priority time
    const lowPriTime = dayTasks
      .filter(t => t.priority === 'not-important')
      .reduce((s, t) => s + (getActualMinutes(t) || getPlannedMinutes(t)), 0);
    if (lowPriTime > 60) {
      results.push({
        icon: <AlertTriangle size={14} />,
        text: `You spent ${formatDuration(lowPriTime)} on low-priority tasks today. Consider delegating or eliminating some.`,
        type: 'warning',
      });
    }

    // Overrun detection
    const overruns = dayTasks.filter(t => {
      const planned = getPlannedMinutes(t);
      const actual = getActualMinutes(t);
      return actual > 0 && planned > 0 && actual > planned * 1.3;
    });
    if (overruns.length > 0) {
      results.push({
        icon: <AlertTriangle size={14} />,
        text: `${overruns.length} task${overruns.length > 1 ? 's' : ''} took 30%+ longer than planned. Try adding buffer time.`,
        type: 'warning',
      });
    }

    // Good completion rate
    const completed = dayTasks.filter(t => t.completed).length;
    if (completed === dayTasks.length && dayTasks.length >= 3) {
      results.push({
        icon: <TrendingUp size={14} />,
        text: 'All tasks completed! Great productivity day. 🎉',
        type: 'success',
      });
    }

    // Scheduling suggestion
    const urgentNotImportant = dayTasks.filter(t => t.urgency === 'urgent' && t.priority === 'not-important' && !t.completed);
    if (urgentNotImportant.length >= 2) {
      results.push({
        icon: <Lightbulb size={14} />,
        text: `${urgentNotImportant.length} urgent but unimportant tasks. Consider batching or delegating them.`,
        type: 'info',
      });
    }

    if (results.length === 0) {
      results.push({
        icon: <Sparkles size={14} />,
        text: 'Add more tasks and track time to unlock personalized productivity insights.',
        type: 'info',
      });
    }

    return results;
  }, [dayTasks]);

  const colorMap = { info: 'hsl(var(--chart-4))', warning: 'hsl(var(--warning))', success: 'hsl(var(--success))' };

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-primary" /> AI Insights
      </h3>
      <div className="space-y-2.5">
        {insights.map((ins, i) => (
          <div key={i} className="flex gap-2.5 items-start text-xs rounded-lg p-2.5"
            style={{ backgroundColor: colorMap[ins.type] + '10' }}>
            <span className="mt-0.5 flex-shrink-0" style={{ color: colorMap[ins.type] }}>{ins.icon}</span>
            <span className="text-foreground/80 leading-relaxed">{ins.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIInsights;
