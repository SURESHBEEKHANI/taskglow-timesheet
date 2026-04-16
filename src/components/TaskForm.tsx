import React, { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { format } from 'date-fns';
import { TaskCategory, TaskPriority, TaskUrgency } from '@/types/task';
import { Plus, X } from 'lucide-react';

interface TaskFormProps {
  selectedDate: Date;
}

const TaskForm: React.FC<TaskFormProps> = ({ selectedDate }) => {
  const { addTask } = useTasks();
  const [open, setOpen] = useState(true);
  const [form, setForm] = useState({
    name: '',
    description: '',
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
    addTask({ ...form, date: format(selectedDate, 'yyyy-MM-dd') });
    setForm({ name: '', description: '', category: 'work', priority: 'important', urgency: 'urgent', plannedStart: '09:00', plannedEnd: '10:00', actualStart: '', actualEnd: '' });
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

  const cls = "bg-secondary/40 text-foreground text-sm rounded-xl px-4 py-3 border border-border/50 outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all w-full placeholder:text-muted-foreground/50";

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 animate-slide-up space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-xl font-bold text-foreground tracking-tight">Create New Task</h3>
          <p className="text-xs text-muted-foreground">Fill in the details to start tracking.</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-muted transition-colors text-muted-foreground">
          <X size={18} />
        </button>
      </div>

      <div className="space-y-4">
        <input 
          placeholder="What are you working on?" 
          value={form.name} 
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
          className={`${cls} text-base font-medium`} 
          autoFocus 
        />
        
        <textarea 
          placeholder="Add notes or a description (optional)..." 
          value={form.description} 
          onChange={e => setForm(f => ({ ...f, description: e.target.value }))} 
          className={`${cls} min-h-[100px] resize-none leading-relaxed`} 
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as TaskCategory }))} className={cls}>
              <option value="work">🏢 Work</option>
              <option value="study">📚 Study</option>
              <option value="personal">👤 Personal</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Priority</label>
            <select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))} className={cls}>
              <option value="important">🔥 Important</option>
              <option value="not-important">🧊 Not Important</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Urgency</label>
            <select value={form.urgency} onChange={e => setForm(f => ({ ...f, urgency: e.target.value as TaskUrgency }))} className={cls}>
              <option value="urgent">⚡ Urgent</option>
              <option value="not-urgent">🍃 Not Urgent</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Planned Start</label>
            <input type="time" value={form.plannedStart} onChange={e => setForm(f => ({ ...f, plannedStart: e.target.value }))} className={cls} />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Planned End</label>
            <input type="time" value={form.plannedEnd} onChange={e => setForm(f => ({ ...f, plannedEnd: e.target.value }))} className={cls} />
          </div>
          <div className="space-y-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Actual Start</label>
            <input type="time" value={form.actualStart} onChange={e => setForm(f => ({ ...f, actualStart: e.target.value }))} className={cls} />
          </div>
          <div className="space-y-1.5 opacity-60 hover:opacity-100 transition-opacity">
            <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Actual End</label>
            <input type="time" value={form.actualEnd} onChange={e => setForm(f => ({ ...f, actualEnd: e.target.value }))} className={cls} />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" className="gradient-primary text-primary-foreground font-bold px-8 py-3.5 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-primary/25 flex items-center gap-2">
          <Plus size={20} strokeWidth={3} />
          <span>Create Task</span>
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
