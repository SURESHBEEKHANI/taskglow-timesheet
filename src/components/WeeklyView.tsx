import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import TaskRow from '@/components/TaskRow';

interface WeeklyViewProps {
  selectedDate: Date;
}

const WeeklyView: React.FC<WeeklyViewProps> = ({ selectedDate }) => {
  const {
    tasks,
    toggleComplete,
    deleteTask,
    startTimer,
    pauseTimer,
    stopTimer,
  } = useTasks();

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekStartStr = format(weekStart, 'yyyy-MM-dd');
  const weekEndStr = format(weekEnd, 'yyyy-MM-dd');

  const weekTasks = tasks
    .filter((t) => t.date >= weekStartStr && t.date <= weekEndStr)
    .slice()
    .sort((a, b) => a.date.localeCompare(b.date) || a.plannedStart.localeCompare(b.plannedStart));

  const pendingTasks = weekTasks.filter((t) => !t.completed);
  const completedTasks = weekTasks.filter((t) => t.completed);

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">
          Week of {format(weekStart, 'MMM d')}
        </h3>
        <p className="text-xs text-muted-foreground">
          {format(weekStart, 'MMM d, yyyy')} - {format(weekEnd, 'MMM d, yyyy')}
        </p>
      </div>

      {weekTasks.length === 0 ? (
        <div className="text-xs text-muted-foreground/70 px-3 py-2 rounded-lg glass-card-hover">
          No tasks for this week.
        </div>
      ) : (
        <div className="space-y-5 max-h-[64vh] overflow-auto pr-1">
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
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
};

export default WeeklyView;

