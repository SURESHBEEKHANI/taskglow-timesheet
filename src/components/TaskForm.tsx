import React, { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { TaskCategory, TaskImportance, TaskUrgency } from '@/types/task';
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
    importance: 'medium' as TaskImportance,
    urgency: 'normal' as TaskUrgency,
    startTime: '09:00',
    endTime: '10:00',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addTask({
      ...form,
      date: selectedDate.toISOString().split('T')[0],
    });
    setForm({ name: '', category: 'work', importance: 'medium', urgency: 'normal', startTime: '09:00', endTime: '10:00' });
    setOpen(false);
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full glass-card-hover rounded-xl p-4 flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
      >
        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
          <Plus size={18} className="text-primary-foreground" />
        </div>
        <span className="font-medium">Add new task...</span>
      </button>
    );
  }

  const selectClass = "bg-secondary text-secondary-foreground text-sm rounded-lg px-3 py-2 border-none outline-none focus:ring-2 focus:ring-primary/50 w-full";
  const inputClass = selectClass;

  return (
    <form onSubmit={handleSubmit} className="glass-card rounded-xl p-5 animate-slide-up space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">New Task</h3>
        <button type="button" onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground text-sm">Cancel</button>
      </div>
      <input
        placeholder="Task name..."
        value={form.name}
        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        className={inputClass}
        autoFocus
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as TaskCategory }))} className={selectClass}>
          <option value="work">🏢 Work</option>
          <option value="personal">👤 Personal</option>
          <option value="health">💪 Health</option>
          <option value="learning">📚 Learning</option>
          <option value="meeting">🤝 Meeting</option>
          <option value="other">📌 Other</option>
        </select>
        <select value={form.importance} onChange={e => setForm(f => ({ ...f, importance: e.target.value as TaskImportance }))} className={selectClass}>
          <option value="critical">🔴 Critical</option>
          <option value="high">🟠 High</option>
          <option value="medium">🔵 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <select value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value as TaskUrgency }))} className={selectClass}>
          <option value="urgent">⚡ Urgent</option>
          <option value="soon">🕐 Soon</option>
          <option value="normal">📅 Normal</option>
          <option value="later">🗓 Later</option>
        </select>
        <div className="flex gap-2">
          <input type="time" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} className={inputClass} />
          <input type="time" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} className={inputClass} />
        </div>
      </div>
      <button type="submit" className="gradient-primary text-primary-foreground font-medium px-6 py-2 rounded-lg hover:opacity-90 transition-opacity">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
