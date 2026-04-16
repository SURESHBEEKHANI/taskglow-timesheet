export type TaskCategory = 'work' | 'study' | 'personal';
export type TaskPriority = 'important' | 'not-important';
export type TaskUrgency = 'urgent' | 'not-urgent';
export type TimerStatus = 'idle' | 'running' | 'paused';

export interface Task {
  id: string;
  date: string;
  name: string;
  category: TaskCategory;
  priority: TaskPriority;
  urgency: TaskUrgency;
  plannedStart: string;
  plannedEnd: string;
  actualStart: string;
  actualEnd: string;
  completed: boolean;
  timerStatus: TimerStatus;
  timerElapsed: number; // seconds accumulated
  timerStartedAt: number | null; // timestamp when timer last started
  createdAt: string;
}

export type ViewMode = 'tasks' | 'daily' | 'monthly' | 'yearly' | 'analytics';

export const CATEGORY_CONFIG: Record<TaskCategory, { label: string; emoji: string; color: string }> = {
  work: { label: 'Work', emoji: '🏢', color: 'hsl(var(--chart-4))' },
  study: { label: 'Study', emoji: '📚', color: 'hsl(var(--chart-2))' },
  personal: { label: 'Personal', emoji: '👤', color: 'hsl(var(--chart-3))' },
};

export const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
  important: { label: 'Important', color: 'hsl(var(--danger))' },
  'not-important': { label: 'Not Important', color: 'hsl(var(--muted-foreground))' },
};

export const URGENCY_CONFIG: Record<TaskUrgency, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: 'hsl(var(--warning))' },
  'not-urgent': { label: 'Not Urgent', color: 'hsl(var(--success))' },
};

export const getPlannedMinutes = (task: Task): number => {
  if (!task.plannedStart || !task.plannedEnd) return 0;
  const [sh, sm] = task.plannedStart.split(':').map(Number);
  const [eh, em] = task.plannedEnd.split(':').map(Number);
  return Math.max((eh * 60 + em) - (sh * 60 + sm), 0);
};

export const getActualMinutes = (task: Task): number => {
  if (task.timerElapsed > 0) return Math.round(task.timerElapsed / 60);
  if (!task.actualStart || !task.actualEnd) return 0;
  const [sh, sm] = task.actualStart.split(':').map(Number);
  const [eh, em] = task.actualEnd.split(':').map(Number);
  return Math.max((eh * 60 + em) - (sh * 60 + sm), 0);
};

export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

export const formatSeconds = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => n.toString().padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
};
