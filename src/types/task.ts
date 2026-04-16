export type TaskCategory = 'work' | 'personal' | 'health' | 'learning' | 'meeting' | 'other';
export type TaskImportance = 'critical' | 'high' | 'medium' | 'low';
export type TaskUrgency = 'urgent' | 'soon' | 'normal' | 'later';

export interface Task {
  id: string;
  date: string; // YYYY-MM-DD
  name: string;
  category: TaskCategory;
  importance: TaskImportance;
  urgency: TaskUrgency;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  completed: boolean;
  createdAt: string;
}

export type ViewMode = 'tasks' | 'daily' | 'monthly' | 'yearly';

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  work: 'hsl(var(--chart-4))',
  personal: 'hsl(var(--chart-2))',
  health: 'hsl(var(--success))',
  learning: 'hsl(var(--chart-3))',
  meeting: 'hsl(var(--chart-5))',
  other: 'hsl(var(--muted-foreground))',
};

export const IMPORTANCE_CONFIG: Record<TaskImportance, { label: string; color: string }> = {
  critical: { label: 'Critical', color: 'hsl(var(--danger))' },
  high: { label: 'High', color: 'hsl(var(--warning))' },
  medium: { label: 'Medium', color: 'hsl(var(--info))' },
  low: { label: 'Low', color: 'hsl(var(--success))' },
};

export const URGENCY_CONFIG: Record<TaskUrgency, { label: string; color: string }> = {
  urgent: { label: 'Urgent', color: 'hsl(var(--danger))' },
  soon: { label: 'Soon', color: 'hsl(var(--warning))' },
  normal: { label: 'Normal', color: 'hsl(var(--info))' },
  later: { label: 'Later', color: 'hsl(var(--success))' },
};
