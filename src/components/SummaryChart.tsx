import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_COLORS, TaskCategory } from '@/types/task';

interface SummaryChartProps {
  selectedDate: Date;
}

const SummaryChart: React.FC<SummaryChartProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const monthStr = format(selectedDate, 'yyyy-MM');
  const monthTasks = tasks.filter(t => t.date.startsWith(monthStr));

  const categoryData = Object.entries(
    monthTasks.reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value, color: CATEGORY_COLORS[name as TaskCategory] }));

  if (categoryData.length === 0) {
    return (
      <div className="glass-card rounded-xl p-5 animate-fade-in">
        <h3 className="font-semibold text-foreground mb-2">Category Breakdown</h3>
        <p className="text-sm text-muted-foreground text-center py-8">No data for {format(selectedDate, 'MMMM')}</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <h3 className="font-semibold text-foreground mb-2">Category Breakdown</h3>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie data={categoryData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={75} innerRadius={45}>
            {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {categoryData.map(d => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="capitalize text-muted-foreground">{d.name}</span>
            <span className="font-semibold text-foreground">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryChart;
