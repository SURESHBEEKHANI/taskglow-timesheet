import React, { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { TaskCategory, TaskPriority, TaskUrgency } from '@/types/task';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  selectedDate: Date;
}

const TaskForm: React.FC<TaskFormProps> = ({ selectedDate }) => {
  const { addTask } = useTasks();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: 'work' as TaskCategory,
    priority: 'important' as TaskPriority,
    urgency: 'urgent' as TaskUrgency,
    plannedStart: '09:00',
    plannedEnd: '10:00',
    actualStart: '',
    actualEnd: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addTask({ ...form, date: selectedDate.toISOString().split('T')[0] });
    setForm({ name: '', category: 'work', priority: 'important', urgency: 'urgent', plannedStart: '09:00', plannedEnd: '10:00', actualStart: '', actualEnd: '' });
    setOpen(false);
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="w-full glass-card-hover rounded-xl p-4 flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors">
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Plus size={18} className="text-primary-foreground" />
        </div>
        <span className="font-medium">Add new task...</span>
      </button>
    );
  }

  const cls = "bg-secondary/90 text-secondary-foreground text-sm rounded-lg px-3 py-2 border border-border/70 outline-none focus:ring-2 focus:ring-primary/50 w-full";

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-5 animate-slide-up space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">New Task</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-sm">Cancel</button>
      </div>
      <input placeholder="Task name..." value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className={cls} autoFocus />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as TaskCategory }))} className={cls}>
          <option value="work">Work</option>
          <option value="study">Study</option>
          <option value="personal">Personal</option>
        </select>
        <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))} className={cls}>
          <option value="important">Important</option>
          <option value="not-important">Not Important</option>
        </select>
        <select value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value as TaskUrgency }))} className={cls}>
          <option value="urgent">Urgent</option>
          <option value="not-urgent">Not Urgent</option>
        </select>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Planned Start</label>
          <input type="time" value={form.plannedStart} onChange={e => setForm(f => ({ ...f, plannedStart: e.target.value }))} className={cls} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Planned End</label>
          <input type="time" value={form.plannedEnd} onChange={e => setForm(f => ({ ...f, plannedEnd: e.target.value }))} className={cls} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Actual Start</label>
          <input type="time" value={form.actualStart} onChange={e => setForm(f => ({ ...f, actualStart: e.target.value }))} className={cls} />
        </div>
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">Actual End</label>
          <input type="time" value={form.actualEnd} onChange={e => setForm(f => ({ ...f, actualEnd: e.target.value }))} className={cls} />
        </div>
      </div>
      <button type="submit" className="gradient-primary text-primary-foreground font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-opacity shadow-md shadow-primary/20">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
