import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Task } from '@/types/task';

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'timerStatus' | 'timerElapsed' | 'timerStartedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  stopTimer: (id: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);
const STORAGE_KEY = 'time-dashboard-tasks';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = useCallback((task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'timerStatus' | 'timerElapsed' | 'timerStartedAt'>) => {
    setTasks(prev => [{
      ...task,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      completed: false,
      timerStatus: 'idle',
      timerElapsed: 0,
      timerStartedAt: null,
    }, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleComplete = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const nowCompleting = !t.completed;
      let elapsed = t.timerElapsed;
      if (nowCompleting && t.timerStatus === 'running' && t.timerStartedAt) {
        elapsed += Math.floor((Date.now() - t.timerStartedAt) / 1000);
      }
      return {
        ...t,
        completed: nowCompleting,
        timerStatus: nowCompleting ? 'idle' as const : t.timerStatus,
        timerElapsed: nowCompleting ? elapsed : t.timerElapsed,
        timerStartedAt: nowCompleting ? null : t.timerStartedAt,
      };
    }));
  }, []);

  const startTimer = useCallback((id: string) => {
    setTasks(prev => prev.map(t =>
      t.id === id ? { ...t, timerStatus: 'running' as const, timerStartedAt: Date.now() } : t
    ));
  }, []);

  const pauseTimer = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id || t.timerStatus !== 'running') return t;
      const added = t.timerStartedAt ? Math.floor((Date.now() - t.timerStartedAt) / 1000) : 0;
      return { ...t, timerStatus: 'paused' as const, timerElapsed: t.timerElapsed + added, timerStartedAt: null };
    }));
  }, []);

  const stopTimer = useCallback((id: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const added = t.timerStatus === 'running' && t.timerStartedAt
        ? Math.floor((Date.now() - t.timerStartedAt) / 1000) : 0;
      return { ...t, timerStatus: 'idle' as const, timerElapsed: t.timerElapsed + added, timerStartedAt: null };
    }));
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleComplete, startTimer, pauseTimer, stopTimer }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
