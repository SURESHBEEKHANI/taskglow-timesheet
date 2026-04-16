import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { Task, IMPORTANCE_CONFIG, URGENCY_CONFIG } from '@/types/task';
import { Check, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskListProps {
  selectedDate: Date;
}

const categoryEmoji: Record<string, string> = {
  work: '🏢', personal: '👤', health: '💪', learning: '📚', meeting: '🤝', other: '📌',
};

const TaskList: React.FC<TaskListProps> = ({ selectedDate }) => {
  const { tasks, toggleComplete, deleteTask } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr).sort((a, b) => a.startTime.localeCompare(b.startTime));

  if (dayTasks.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center animate-fade-in">
        <p className="text-muted-foreground">No tasks for {format(selectedDate, 'MMMM d, yyyy')}</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Add a task above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-fade-in">
      {dayTasks.map((task, i) => (
        <TaskRow key={task.id} task={task} index={i} onToggle={toggleComplete} onDelete={deleteTask} />
      ))}
    </div>
  );
};

const TaskRow: React.FC<{ task: Task; index: number; onToggle: (id: string) => void; onDelete: (id: string) => void }> = ({
  task, index, onToggle, onDelete,
}) => {
  const imp = IMPORTANCE_CONFIG[task.importance];
  const urg = URGENCY_CONFIG[task.urgency];

  return (
    <div
      className={`glass-card-hover rounded-xl p-4 flex items-center gap-4 animate-slide-up ${task.completed ? 'opacity-60' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <button
        onClick={() => onToggle(task.id)}
        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          task.completed ? 'bg-primary border-primary' : 'border-muted-foreground/30 hover:border-primary'
        }`}
      >
        {task.completed && <Check size={14} className="text-primary-foreground" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm">{categoryEmoji[task.category]}</span>
          <span className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
            {task.name}
          </span>
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock size={11} /> {task.startTime} – {task.endTime}
          </span>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: imp.color + '20', color: imp.color }}>
            {imp.label}
          </span>
          <span className="text-xs font-medium px-1.5 py-0.5 rounded" style={{ backgroundColor: urg.color + '20', color: urg.color }}>
            {urg.label}
          </span>
        </div>
      </div>

      <button onClick={() => onDelete(task.id)} className="text-muted-foreground hover:text-danger transition-colors flex-shrink-0">
        <Trash2 size={16} />
      </button>
    </div>
  );
};

export default TaskList;
