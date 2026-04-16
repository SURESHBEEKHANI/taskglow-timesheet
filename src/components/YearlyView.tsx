import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format, startOfYear, eachMonthOfInterval, endOfYear } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface YearlyViewProps {
  selectedDate: Date;
}

const YearlyView: React.FC<YearlyViewProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const year = selectedDate.getFullYear();
  const months = eachMonthOfInterval({ start: startOfYear(selectedDate), end: endOfYear(selectedDate) });

  const data = months.map(month => {
    const monthStr = format(month, 'yyyy-MM');
    const monthTasks = tasks.filter(t => t.date.startsWith(monthStr));
    const completed = monthTasks.filter(t => t.completed).length;
    return {
      month: format(month, 'MMM'),
      total: monthTasks.length,
      completed,
      pending: monthTasks.length - completed,
    };
  });

  const totalTasks = tasks.filter(t => t.date.startsWith(`${year}`)).length;
  const completedTasks = tasks.filter(t => t.date.startsWith(`${year}`) && t.completed).length;

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{year} Overview</h3>
        <div className="flex gap-4 text-sm">
          <span className="text-muted-foreground">Total: <span className="text-foreground font-semibold">{totalTasks}</span></span>
          <span className="text-muted-foreground">Done: <span className="text-success font-semibold">{completedTasks}</span></span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} barGap={2}>
          <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
            }}
          />
          <Bar dataKey="completed" stackId="a" radius={[0, 0, 0, 0]} name="Completed">
            {data.map((_, i) => <Cell key={i} fill="hsl(var(--success))" />)}
          </Bar>
          <Bar dataKey="pending" stackId="a" radius={[4, 4, 0, 0]} name="Pending">
            {data.map((_, i) => <Cell key={i} fill="hsl(var(--chart-4))" opacity={0.5} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlyView;
