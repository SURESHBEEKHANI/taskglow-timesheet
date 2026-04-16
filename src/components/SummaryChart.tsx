import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CATEGORY_CONFIG, TaskCategory } from '@/types/task';

interface SummaryChartProps {
  selectedDate: Date;
}

const SummaryChart: React.FC<SummaryChartProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const monthStr = format(selectedDate, 'yyyy-MM');
  const monthTasks = tasks.filter(t => t.date.startsWith(monthStr));

  const categoryCounts = monthTasks.reduce<Record<string, number>>((acc, t) => { 
    acc[t.category] = (acc[t.category] || 0) + 1; 
    return acc; 
  }, {});

  const total = monthTasks.length;

  const categoryData = Object.entries(categoryCounts).map(([name, value]) => ({ 
    name, 
    value, 
    percentage: Math.round((value / total) * 100),
    color: CATEGORY_CONFIG[name as TaskCategory].color 
  })).sort((a, b) => b.value - a.value);

  if (categoryData.length === 0) {
    return (
      <div className="glass-card-hover rounded-2xl p-6 animate-fade-in text-center">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">Focus Distribution</h3>
        <div className="py-10 flex flex-col items-center gap-2 opacity-50">
          <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center font-bold text-muted-foreground">0</div>
          <p className="text-[10px] text-muted-foreground uppercase font-bold">No activity in {format(selectedDate, 'MMMM')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card-hover rounded-2xl p-6 animate-slide-up bg-gradient-to-br from-card/50 to-secondary/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Focus Distribution</h3>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">{format(selectedDate, 'MMMM yyyy')}</p>
        </div>
        <BarChart3 size={16} className="text-primary/60" />
      </div>

      <div className="flex flex-col items-center justify-center mb-6">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie 
              data={categoryData} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={65} 
              innerRadius={45}
              stroke="none"
              paddingAngle={4}
            >
              {categoryData.map((entry, i) => (
                <Cell 
                  key={i} 
                  fill={entry.color} 
                  className="hover:opacity-80 transition-opacity cursor-pointer duration-300" 
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                border: '1px solid hsl(var(--border))', 
                borderRadius: '1rem', 
                fontSize: '0.75rem',
                fontWeight: 'bold',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)' 
              }} 
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-4">
        {categoryData.map(d => (
          <div key={d.name} className="space-y-1.5 group">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold">
              <span className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors">
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </span>
              <span className="text-foreground">{d.percentage}%</span>
            </div>
            <div className="h-1.5 w-full bg-secondary/50 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full rounded-full transition-all duration-1000 ease-out" 
                style={{ backgroundColor: d.color, width: `${d.percentage}%` }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryChart;
