import React, { useMemo } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { calculateProductivityScore } from '@/lib/scoring';
import { Trophy, Target, Gauge, Zap } from 'lucide-react';

interface ProductivityScoreProps {
  selectedDate: Date;
}

const ProductivityScore: React.FC<ProductivityScoreProps> = ({ selectedDate }) => {
  const { tasks } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr);
  
  const score = useMemo(() => calculateProductivityScore(dayTasks), [dayTasks]);

  return (
    <div className="glass-card-hover rounded-2xl p-6 animate-slide-up bg-gradient-to-br from-card/50 to-secondary/30 relative overflow-hidden group">
      {/* Background Decor */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-primary/10 blur-2xl group-hover:bg-primary/20 transition-all pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">Performance Score</h3>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase font-medium">Daily Behavior Index</p>
        </div>
        <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg shadow-primary/20">
          <Trophy size={20} className="text-primary-foreground" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-4 mb-6">
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-secondary/50"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * score.total) / 100}
              className="transition-all duration-1000 ease-out"
              style={{ color: score.color }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black tracking-tighter" style={{ color: score.color }}>{score.total}</span>
            <span className="text-[10px] uppercase font-bold text-muted-foreground leading-none">Rating</span>
          </div>
        </div>
        <div className="mt-4 text-center">
          <div className="text-sm font-bold tracking-tight text-foreground">{score.label}</div>
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mt-1">Status</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-2 mb-1.5 grayscale opacity-70">
            <Target size={12} className="text-success" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Focus</span>
          </div>
          <div className="text-sm font-bold">{score.completion}/40</div>
        </div>
        <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-2 mb-1.5 grayscale opacity-70">
            <Gauge size={12} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Precision</span>
          </div>
          <div className="text-sm font-bold">{score.accuracy}/30</div>
        </div>
        <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-2 mb-1.5 grayscale opacity-70">
            <Zap size={12} className="text-warning" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Intensity</span>
          </div>
          <div className="text-sm font-bold">{score.intensity}/20</div>
        </div>
        <div className="p-3 rounded-xl bg-secondary/50 border border-border/50">
          <div className="flex items-center gap-2 mb-1.5 grayscale opacity-70">
            <Trophy size={12} className="text-chart-4" />
            <span className="text-[10px] font-bold uppercase tracking-tight">Habit</span>
          </div>
          <div className="text-sm font-bold">{score.consistency}/10</div>
        </div>
      </div>
    </div>
  );
};

export default ProductivityScore;
