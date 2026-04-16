import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import TaskRow from '@/components/TaskRow';

interface TaskListProps {
  selectedDate: Date;
}

const TaskList: React.FC<TaskListProps> = ({ selectedDate }) => {
  const { tasks, toggleComplete, deleteTask, startTimer, pauseTimer, stopTimer, updateTask } = useTasks();
  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const dayTasks = tasks.filter(t => t.date === dateStr).sort((a, b) => a.plannedStart.localeCompare(b.plannedStart));
  const pendingTasks = dayTasks.filter(t => !t.completed);
  const completedTasks = dayTasks.filter(t => t.completed);

  if (dayTasks.length === 0) {
    return (
      <div className="rounded-xl p-8 text-center animate-fade-in">
        <p className="text-muted-foreground">No tasks for {format(selectedDate, 'MMMM d, yyyy')}</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Add a task above to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-5 animate-fade-in">
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Pending</h3>
          <span className="text-xs text-muted-foreground">{pendingTasks.length}</span>
        </div>
        {pendingTasks.length === 0 ? (
          <div className="text-xs text-muted-foreground/70 px-3 py-2 rounded-lg glass-card-hover">
            No pending tasks.
          </div>
        ) : (
          <div className="space-y-2">
            {pendingTasks.map((task, i) => (
              <TaskRow
                key={task.id}
                task={task}
                index={i}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                onStart={startTimer}
                onPause={pauseTimer}
                onStop={stopTimer}
                onUpdate={updateTask}
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-2 pt-1 border-t border-border/60">
          <h3 className="text-sm font-semibold text-foreground">Completed</h3>
          <span className="text-xs text-muted-foreground">{completedTasks.length}</span>
        </div>
        {completedTasks.length === 0 ? (
          <div className="text-xs text-muted-foreground/70 px-3 py-2 rounded-lg glass-card-hover">
            No completed tasks yet.
          </div>
        ) : (
          <div className="space-y-2">
            {completedTasks.map((task, i) => (
              <TaskRow
                key={task.id}
                task={task}
                index={i}
                onToggle={toggleComplete}
                onDelete={deleteTask}
                onStart={startTimer}
                onPause={pauseTimer}
                onStop={stopTimer}
                onUpdate={updateTask}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default TaskList;
