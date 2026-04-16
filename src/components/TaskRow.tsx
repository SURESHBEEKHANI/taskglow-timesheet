import React, { useEffect, useState } from 'react';
import { Task, PRIORITY_CONFIG, URGENCY_CONFIG, CATEGORY_CONFIG, formatSeconds, getPlannedMinutes, getActualMinutes, formatDuration } from '@/types/task';
import { Check, Clock, Play, Pause, Square, Trash2 } from 'lucide-react';

export type TaskRowProps = {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onStop: (id: string) => void;
};

const TaskRow: React.FC<TaskRowProps> = ({ task, index, onToggle, onDelete, onStart, onPause, onStop }) => {
  const [elapsed, setElapsed] = useState(task.timerElapsed);
  const cat = CATEGORY_CONFIG[task.category];
  const pri = PRIORITY_CONFIG[task.priority];
  const urg = URGENCY_CONFIG[task.urgency];
  const planned = getPlannedMinutes(task);
  const actual = getActualMinutes(task);

  useEffect(() => {
    if (task.timerStatus !== 'running' || !task.timerStartedAt) {
      setElapsed(task.timerElapsed);
      return;
    }

    const interval = setInterval(() => {
      setElapsed(task.timerElapsed + Math.floor((Date.now() - task.timerStartedAt!) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [task.timerStatus, task.timerStartedAt, task.timerElapsed]);

  const diff = actual - planned;

  return (
    <div
      className={`glass-card-hover rounded-xl p-4 animate-slide-up ${task.completed ? 'opacity-70' : ''}`}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      <div className="flex items-start sm:items-center gap-3">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
            task.completed ? 'bg-primary border-primary' : 'border-muted-foreground/30 hover:border-primary'
          }`}
          aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {task.completed && <Check size={14} className="text-primary-foreground" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm">{cat.emoji}</span>
            <span className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
              {task.name}
            </span>
          </div>

          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={11} /> {task.plannedStart}–{task.plannedEnd}
            </span>
            {planned > 0 && <span className="text-xs text-muted-foreground">({formatDuration(planned)})</span>}
            <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: pri.color + '20', color: pri.color }}>
              {pri.label}
            </span>
            <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: urg.color + '20', color: urg.color }}>
              {urg.label}
            </span>
          </div>
        </div>

        {/* Timer controls */}
        {!task.completed && (
          <div className="flex items-center gap-1.5 flex-shrink-0 ml-auto">
            <span
              className={`text-xs font-mono font-semibold min-w-[52px] text-right ${
                task.timerStatus === 'running' ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {formatSeconds(elapsed)}
            </span>

            {task.timerStatus === 'idle' && (
              <button
                onClick={() => onStart(task.id)}
                className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"
                title="Start timer"
              >
                <Play size={14} />
              </button>
            )}

            {task.timerStatus === 'running' && (
              <>
                <button
                  onClick={() => onPause(task.id)}
                  className="p-1.5 rounded-md hover:bg-warning/10 text-warning transition-colors"
                  title="Pause"
                >
                  <Pause size={14} />
                </button>
                <button
                  onClick={() => onStop(task.id)}
                  className="p-1.5 rounded-md hover:bg-danger/10 text-danger transition-colors"
                  title="Stop"
                >
                  <Square size={14} />
                </button>
              </>
            )}

            {task.timerStatus === 'paused' && (
              <>
                <button
                  onClick={() => onStart(task.id)}
                  className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors"
                  title="Resume"
                >
                  <Play size={14} />
                </button>
                <button
                  onClick={() => onStop(task.id)}
                  className="p-1.5 rounded-md hover:bg-danger/10 text-danger transition-colors"
                  title="Stop"
                >
                  <Square size={14} />
                </button>
              </>
            )}
          </div>
        )}

        {/* Planned vs Actual */}
        {(actual > 0 || task.completed) && planned > 0 && (
          <div className={`text-xs font-semibold flex-shrink-0 px-2 py-1 rounded-md ${diff > 0 ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
            {diff > 0 ? `+${formatDuration(diff)}` : diff < 0 ? `-${formatDuration(Math.abs(diff))}` : 'On time'}
          </div>
        )}

        <button
          onClick={() => onDelete(task.id)}
          className="text-muted-foreground hover:text-danger transition-colors flex-shrink-0"
          title="Delete task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskRow;

