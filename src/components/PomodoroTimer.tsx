import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react';
import { formatSeconds } from '@/types/task';

type PomodoroPhase = 'work' | 'break';

const WORK_DURATION = 25 * 60;
const BREAK_DURATION = 5 * 60;

const PomodoroTimer: React.FC = () => {
  const [phase, setPhase] = useState<PomodoroPhase>('work');
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        setRunning(false);
        if (phase === 'work') {
          setSessions(s => s + 1);
          setPhase('break');
          return BREAK_DURATION;
        } else {
          setPhase('work');
          return WORK_DURATION;
        }
      }
      return prev - 1;
    });
  }, [phase]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, tick]);

  const reset = () => {
    setRunning(false);
    setPhase('work');
    setTimeLeft(WORK_DURATION);
  };

  const progress = phase === 'work'
    ? (WORK_DURATION - timeLeft) / WORK_DURATION
    : (BREAK_DURATION - timeLeft) / BREAK_DURATION;

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground flex items-center gap-2">
          {phase === 'work' ? <Brain size={16} className="text-primary" /> : <Coffee size={16} className="text-warning" />}
          Pomodoro
        </h3>
        <span className="text-xs text-muted-foreground">{sessions} sessions</span>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32 mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(var(--border))" strokeWidth="6" />
            <circle cx="60" cy="60" r="54" fill="none"
              stroke={phase === 'work' ? 'hsl(var(--primary))' : 'hsl(var(--warning))'}
              strokeWidth="6" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold font-mono text-foreground">{formatSeconds(timeLeft)}</span>
            <span className="text-xs text-muted-foreground capitalize">{phase}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setRunning(!running)}
            className={`p-2.5 rounded-lg transition-colors ${running ? 'bg-warning/10 text-warning hover:bg-warning/20' : 'bg-primary/10 text-primary hover:bg-primary/20'}`}>
            {running ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button onClick={reset} className="p-2.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
