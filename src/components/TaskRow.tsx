import React, { useEffect, useState } from 'react';
import { Task, PRIORITY_CONFIG, URGENCY_CONFIG, CATEGORY_CONFIG, formatSeconds, getPlannedMinutes, getActualMinutes, formatDuration, TaskCategory, TaskPriority, TaskUrgency } from '@/types/task';
import { Check, Clock, Play, Pause, Square, Trash2, Pencil, X, Save, ChevronDown, ChevronUp } from 'lucide-react';

export type TaskRowProps = {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onStart: (id: string) => void;
  onPause: (id: string) => void;
  onStop: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Task>) => void;
};

const TaskRow: React.FC<TaskRowProps> = ({ task, index, onToggle, onDelete, onStart, onPause, onStop, onUpdate }) => {
  const [elapsed, setElapsed] = useState(task.timerElapsed);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...task });

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
      className={`glass-card-hover rounded-2xl p-5 group relative overflow-hidden transition-all duration-300 ${task.completed ? 'bg-secondary/30' : 'bg-card'}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Status indicator line */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${task.completed ? 'bg-success' : 'bg-primary'} opacity-60 group-hover:opacity-100 transition-opacity`} />
      
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(task.id)}
          className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all duration-300 transform active:scale-90 ${
            task.completed 
              ? 'bg-success border-success text-success-foreground shadow-lg shadow-success/20' 
              : 'border-muted-foreground/30 hover:border-primary hover:shadow-lg hover:shadow-primary/10'
          }`}
          aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
        >
          {task.completed && <Check size={18} strokeWidth={3} />}
        </button>

        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="space-y-4 p-1">
              <input 
                className="w-full bg-secondary/50 rounded-xl px-4 py-2.5 text-sm border border-border focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                value={editForm.name} 
                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Task name"
                autoFocus
              />
              <textarea 
                className="w-full bg-secondary/50 rounded-xl px-4 py-2.5 text-xs border border-border focus:ring-2 focus:ring-primary/20 transition-all outline-none min-h-[80px] resize-none"
                value={editForm.description} 
                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Add a detailed description..."
              />
              <div className="grid grid-cols-3 gap-3">
                <select className="bg-secondary/50 rounded-xl px-3 py-2 text-xs border border-border outline-none" value={editForm.category} onChange={e => setEditForm(f => ({ ...f, category: e.target.value as TaskCategory }))}>
                  <option value="work">Work</option>
                  <option value="study">Study</option>
                  <option value="personal">Personal</option>
                </select>
                <select className="bg-secondary/50 rounded-xl px-3 py-2 text-xs border border-border outline-none" value={editForm.priority} onChange={e => setEditForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}>
                  <option value="important">Important</option>
                  <option value="not-important">Not Important</option>
                </select>
                <select className="bg-secondary/50 rounded-xl px-3 py-2 text-xs border border-border outline-none" value={editForm.urgency} onChange={e => setEditForm(f => ({ ...f, urgency: e.target.value as TaskUrgency }))}>
                  <option value="urgent">Urgent</option>
                  <option value="not-urgent">Not Urgent</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all">
                  Cancel
                </button>
                <button onClick={() => { onUpdate(task.id, editForm); setIsEditing(false); }} className="px-6 py-2 text-xs font-bold gradient-primary text-primary-foreground rounded-xl shadow-xl shadow-primary/20 transform active:scale-95 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 cursor-pointer group/title" onClick={() => setIsExpanded(!isExpanded)}>
                <span className="text-lg grayscale group-hover/title:grayscale-0 transition-all">{cat.emoji}</span>
                <span className={`font-semibold text-base flex-1 transition-all ${task.completed ? 'line-through text-muted-foreground opacity-60' : 'text-foreground hover:text-primary'}`}>
                  {task.name}
                </span>
                {task.description && (
                  <div className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-secondary transition-colors text-muted-foreground/60">
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                )}
              </div>
              {task.description && (
                <div className={`mt-2 overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-40 opacity-100 mb-3' : 'max-h-0 opacity-0'}`}>
                  <p className={`text-sm text-balance leading-relaxed text-muted-foreground/90 border-l-2 border-primary/20 pl-4 ml-1 ${task.completed ? 'opacity-50' : ''}`}>
                    {task.description}
                  </p>
                </div>
              )}
            </>
          )}

          {!isEditing && (
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary/50 border border-border/50 text-[10px] font-bold text-muted-foreground">
                <Clock size={12} className="text-primary/70" /> {task.plannedStart}–{task.plannedEnd}
              </div>
              {planned > 0 && <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">{formatDuration(planned)}</span>}
              <div className="h-4 w-[1px] bg-border/50 mx-1" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: pri.color + '15', color: pri.color }}>
                {pri.label}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md" style={{ backgroundColor: urg.color + '15', color: urg.color }}>
                {urg.label}
              </span>
            </div>
          )}
        </div>

        {/* Timer controls */}
        {!task.completed && !isEditing && (
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            <div className={`flex flex-col items-end mr-2 px-3 py-1 rounded-xl bg-secondary/30 border border-border/30 ${task.timerStatus === 'running' ? 'animate-pulse' : ''}`}>
              <span className="text-[10px] uppercase font-bold text-muted-foreground/50 leading-none mb-1">Elapsed</span>
              <span className={`text-sm font-mono font-bold tracking-tight ${task.timerStatus === 'running' ? 'text-primary' : 'text-foreground'}`}>
                {formatSeconds(elapsed)}
              </span>
            </div>

            <div className="flex gap-1">
              {task.timerStatus === 'idle' && (
                <button
                  onClick={() => onStart(task.id)}
                  className="w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center shadow-lg shadow-primary/5"
                  title="Start timer"
                >
                  <Play size={18} fill="currentColor" />
                </button>
              )}

              {task.timerStatus === 'running' && (
                <>
                  <button
                    onClick={() => onPause(task.id)}
                    className="w-10 h-10 rounded-xl bg-warning/10 text-warning hover:bg-warning hover:text-warning-foreground transition-all duration-300 flex items-center justify-center shadow-lg shadow-warning/5"
                    title="Pause"
                  >
                    <Pause size={18} fill="currentColor" />
                  </button>
                  <button
                    onClick={() => onStop(task.id)}
                    className="w-10 h-10 rounded-xl bg-danger/10 text-danger hover:bg-danger hover:text-danger-foreground transition-all duration-300 flex items-center justify-center shadow-lg shadow-danger/5"
                    title="Stop"
                  >
                    <Square size={18} fill="currentColor" />
                  </button>
                </>
              )}

              {task.timerStatus === 'paused' && (
                <>
                  <button
                    onClick={() => onStart(task.id)}
                    className="w-10 h-10 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 flex items-center justify-center shadow-lg shadow-primary/5"
                    title="Resume"
                  >
                    <Play size={18} fill="currentColor" />
                  </button>
                  <button
                    onClick={() => onStop(task.id)}
                    className="w-10 h-10 rounded-xl bg-danger/10 text-danger hover:bg-danger hover:text-danger-foreground transition-all duration-300 flex items-center justify-center shadow-lg shadow-danger/5"
                    title="Stop"
                  >
                    <Square size={18} fill="currentColor" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Info & Actions */}
        {!isEditing && (
          <div className="flex flex-col items-end gap-3 self-stretch justify-between ml-4">
            {(actual > 0 || task.completed) && planned > 0 && (
              <div className={`text-[10px] font-bold uppercase tracking-tighter px-2.5 py-1 rounded-lg ${diff > 0 ? 'bg-danger/10 text-danger' : 'bg-success/10 text-success'}`}>
                {diff > 0 ? `+${formatDuration(diff)}` : diff < 0 ? `-${formatDuration(Math.abs(diff))}` : 'Perfect Match'}
              </div>
            )}
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => { setIsEditing(true); setEditForm({...task}); }}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center"
                title="Edit task"
              >
                <Pencil size={15} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="w-8 h-8 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-all flex items-center justify-center"
                title="Delete task"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskRow;

