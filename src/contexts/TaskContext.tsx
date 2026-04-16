import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Task, getPlannedMinutes, getActualMinutes } from '@/types/task';
import { fetchTasksFromApi, saveTasksToApi } from '@/lib/taskApi';
import { format, subDays, addDays, isBefore, parseISO, startOfDay } from 'date-fns';

interface TaskContextType {
  tasks: Task[];
  isLoading: boolean;
  isSyncing: boolean;
  storageMode: 'supabase' | 'local';
  syncError: string | null;
  lastSyncedAt: string | null;
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'timerStatus' | 'timerElapsed' | 'timerStartedAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
  startTimer: (id: string) => void;
  pauseTimer: (id: string) => void;
  stopTimer: (id: string) => void;
  smartReplan: () => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [storageMode, setStorageMode] = useState<'supabase' | 'local'>('local');
  const [syncError, setSyncError] = useState<string | null>(null);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadTasks = async () => {
      setIsLoading(true);
      try {
        const remoteTasks = await fetchTasksFromApi();
        if (mounted) {
          setTasks(remoteTasks);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(remoteTasks));
          setStorageMode('supabase');
          setSyncError(null);
          setLastSyncedAt(new Date().toISOString());
        }
      } catch (error) {
        if (mounted) {
          setStorageMode('local');
          setSyncError(error instanceof Error ? error.message : 'Supabase unavailable');
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    loadTasks();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    if (isLoading) {
      return;
    }

    setIsSyncing(true);
    saveTasksToApi(tasks)
      .then(() => {
        setStorageMode('supabase');
        setSyncError(null);
        setLastSyncedAt(new Date().toISOString());
      })
      .catch((error) => {
        setStorageMode('local');
        setSyncError(error instanceof Error ? error.message : 'Supabase sync failed');
      })
      .finally(() => {
        setIsSyncing(false);
      });
  }, [isLoading, tasks]);

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

  const smartReplan = useCallback(() => {
    setTasks(prev => {
      const today = new Date();
      const todayStr = format(today, 'yyyy-MM-dd');
      const yesterdayStr = format(subDays(today, 1), 'yyyy-MM-dd');
      
      let updatedTasks = [...prev];

      // 1. Reschedule Skipped: Move uncompleted tasks from yesterday (or older) to today
      updatedTasks = updatedTasks.map(t => {
        if (!t.completed && isBefore(parseISO(t.date), startOfDay(today))) {
          return { ...t, date: todayStr, wasRescheduled: true };
        }
        return t;
      });

      // 2. Load Balancing: Calculate total load for today
      const todayTasks = updatedTasks.filter(t => t.date === todayStr && !t.completed);
      const totalPlanned = todayTasks.reduce((sum, t) => sum + getPlannedMinutes(t), 0);

      // If load > 10 hours, push low-priority tasks to tomorrow
      if (totalPlanned > 600) {
        const sorted = [...todayTasks].sort((a, b) => {
          if (a.priority === 'important' && b.priority !== 'important') return -1;
          if (a.priority !== 'important' && b.priority === 'important') return 1;
          return 0;
        });

        let currentTotal = 0;
        updatedTasks = updatedTasks.map(t => {
          if (t.date === todayStr && !t.completed) {
            const planned = getPlannedMinutes(t);
            // If adding this task exceeds 8 hours, move it to tomorrow
            if (currentTotal + planned > 480 && t.priority !== 'important') {
              return { ...t, date: format(addDays(today, 1), 'yyyy-MM-dd'), wasRescheduled: true };
            }
            currentTotal += planned;
          }
          return t;
        });
      }

      // 3. Complexity Scaling: Identify tasks that usually overrun and increase planned time
      // (Simple version: if specific task names in history took longer, expand current planned)
      return updatedTasks;
    });
  }, []);

  return (
    <TaskContext.Provider value={{
      tasks,
      isLoading,
      isSyncing,
      storageMode,
      syncError,
      lastSyncedAt,
      addTask,
      updateTask,
      deleteTask,
      toggleComplete,
      startTimer,
      pauseTimer,
      stopTimer,
      smartReplan,
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
};
