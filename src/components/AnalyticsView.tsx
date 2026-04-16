import React, { useMemo } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { getPlannedMinutes, getActualMinutes, formatDuration, CATEGORY_CONFIG, PRIORITY_CONFIG, URGENCY_CONFIG, TaskCategory } from '@/types/task';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';

interface AnalyticsViewProps {
  selectedDate: Date;
}

const chartTooltip = {
  contentStyle: { backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '0.5rem', fontSize: '0.8rem' },
};

const AnalyticsView: React.FC<AnalyticsViewProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const monthStr = format(selectedDate, 'yyyy-MM');
  const monthTasks = useMemo(() => tasks.filter(t => t.date.startsWith(monthStr)), [tasks, monthStr]);

  // Time per category
  const catData = useMemo(() => {
    const map: Record<string, number> = {};
    monthTasks.forEach(t => {
      const mins = getActualMinutes(t) || getPlannedMinutes(t);
      map[t.category] = (map[t.category] || 0) + mins;
    });
    return Object.entries(map).map(([cat, mins]) => ({
      name: CATEGORY_CONFIG[cat as TaskCategory].label,
      minutes: mins,
      color: CATEGORY_CONFIG[cat as TaskCategory].color,
    }));
  }, [monthTasks]);

  // Priority breakdown
  const priData = useMemo(() => {
    const imp = monthTasks.filter(t => t.priority === 'important').length;
    const notImp = monthTasks.filter(t => t.priority === 'not-important').length;
    return [
      { name: 'Important', value: imp, color: PRIORITY_CONFIG.important.color },
      { name: 'Not Important', value: notImp, color: PRIORITY_CONFIG['not-important'].color },
    ].filter(d => d.value > 0);
  }, [monthTasks]);

  // Urgency breakdown
  const urgData = useMemo(() => {
    const urg = monthTasks.filter(t => t.urgency === 'urgent').length;
    const notUrg = monthTasks.filter(t => t.urgency === 'not-urgent').length;
    return [
      { name: 'Urgent', value: urg, color: URGENCY_CONFIG.urgent.color },
      { name: 'Not Urgent', value: notUrg, color: URGENCY_CONFIG['not-urgent'].color },
    ].filter(d => d.value > 0);
  }, [monthTasks]);

  // Planned vs Actual
  const comparisonData = useMemo(() => {
    const catMap: Record<string, { planned: number; actual: number }> = {};
    monthTasks.forEach(t => {
      if (!catMap[t.category]) catMap[t.category] = { planned: 0, actual: 0 };
      catMap[t.category].planned += getPlannedMinutes(t);
      catMap[t.category].actual += getActualMinutes(t);
    });
    return Object.entries(catMap).map(([cat, v]) => ({
      name: CATEGORY_CONFIG[cat as TaskCategory].label,
      Planned: v.planned,
      Actual: v.actual,
    }));
  }, [monthTasks]);

  if (monthTasks.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center animate-fade-in">
        <p className="text-muted-foreground">No data for {format(selectedDate, 'MMMM yyyy')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <h3 className="font-semibold text-foreground text-lg">Analytics – {format(selectedDate, 'MMMM yyyy')}</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Time per category */}
        <div className="glass-card rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3">Time by Category</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={catData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTooltip} formatter={(v: number) => formatDuration(v)} />
              <Bar dataKey="minutes" radius={[6, 6, 0, 0]} name="Minutes">
                {catData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Planned vs Actual */}
        <div className="glass-card rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3">Planned vs Actual</h4>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={comparisonData}>
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
              <Tooltip {...chartTooltip} formatter={(v: number) => formatDuration(v)} />
              <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              <Bar dataKey="Planned" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Actual" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority */}
        <div className="glass-card rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3">By Priority</h4>
          {priData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={priData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {priData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip {...chartTooltip} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground text-center py-8">No data</p>}
        </div>

        {/* Urgency */}
        <div className="glass-card rounded-xl p-5">
          <h4 className="text-sm font-semibold text-foreground mb-3">By Urgency</h4>
          {urgData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={urgData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} innerRadius={40}>
                  {urgData.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Pie>
                <Tooltip {...chartTooltip} />
                <Legend wrapperStyle={{ fontSize: '0.75rem' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-muted-foreground text-center py-8">No data</p>}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;
