import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import TaskRow from '@/components/TaskRow';

const MonthlyTaskList: React.FC<{ selectedDate: Date }> = ({ selectedDate }) => {
  const { tasks, toggleComplete, deleteTask, startTimer, pauseTimer, stopTimer } = useTasks();

  const monthStr = format(selectedDate, 'yyyy-MM');
  const monthTasks = tasks
    .filter((t) => t.date.startsWith(monthStr))
    .slice()
    .sort((a, b) => {
      const d = a.date.localeCompare(b.date);
      return d !== 0 ? d : a.plannedStart.localeCompare(b.plannedStart);
    });

  const pendingTasks = monthTasks.filter((t) => !t.completed);
  const completedTasks = monthTasks.filter((t) => t.completed);

  if (monthTasks.length === 0) {
    return (
      <div className="mt-5 rounded-xl p-4 text-center text-xs text-muted-foreground/70">
        No tasks found for {format(selectedDate, 'MMMM yyyy')}.
      </div>
    );
  }

  return (
    <div className="mt-5 space-y-5">
      <section>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-foreground">Pending (this month)</h3>
          <span className="text-xs text-muted-foreground">{pendingTasks.length}</span>
        </div>
        {pendingTasks.length === 0 ? (
          <div className="text-xs text-muted-foreground/70 px-3 py-2 rounded-lg glass-card-hover">No pending tasks.</div>
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
              />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center justify-between mb-2 pt-1 border-t border-border/60">
          <h3 className="text-sm font-semibold text-foreground">Completed (this month)</h3>
          <span className="text-xs text-muted-foreground">{completedTasks.length}</span>
        </div>
        {completedTasks.length === 0 ? (
          <div className="text-xs text-muted-foreground/70 px-3 py-2 rounded-lg glass-card-hover">No completed tasks yet.</div>
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
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MonthlyTaskList;

