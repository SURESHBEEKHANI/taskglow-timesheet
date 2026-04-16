import React from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay } from 'date-fns';
import MonthlyTaskList from '@/components/MonthlyTaskList';

interface MonthlyViewProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MonthlyView: React.FC<MonthlyViewProps> = ({ selectedDate, onDateChange }) => {
  const { tasks } = useTasks();
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = getDay(monthStart);

  const getTaskCount = (day: Date) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return tasks.filter(t => t.date === dateStr);
  };

  return (
    <div className="glass-card rounded-xl p-5 animate-fade-in">
      <h3 className="font-semibold text-foreground mb-4">{format(selectedDate, 'MMMM yyyy')}</h3>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAYS.map(d => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">{d}</div>
        ))}
        {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}
        {days.map(day => {
          const dayTasks = getTaskCount(day);
          const completed = dayTasks.filter(t => t.completed).length;
          const total = dayTasks.length;
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());

          return (
            <button
              key={day.toISOString()}
              onClick={() => onDateChange(day)}
              className={`relative aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all ${
                isSelected ? 'bg-primary text-primary-foreground font-bold' :
                isToday ? 'bg-primary/10 text-primary font-semibold' :
                'hover:bg-secondary text-foreground'
              }`}
            >
              {format(day, 'd')}
              {total > 0 && (
                <div className="flex gap-0.5 mt-0.5">
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      backgroundColor: completed === total ? 'hsl(var(--success))' :
                        completed > 0 ? 'hsl(var(--warning))' : 'hsl(var(--danger))',
                    }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>

      <MonthlyTaskList selectedDate={selectedDate} />
    </div>
  );
};

export default MonthlyView;
