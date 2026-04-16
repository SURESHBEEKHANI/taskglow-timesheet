import { Task } from "@/types/task";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const tasksTable = import.meta.env.VITE_SUPABASE_TASKS_TABLE || "tasks";

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const fetchTasksFromApi = async (): Promise<Task[]> => {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  const { data, error } = await supabase
    .from(tasksTable)
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data || []) as Task[];
};

export const saveTasksToApi = async (tasks: Task[]): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase is not configured");
  }

  await supabase.from(tasksTable).delete().not("id", "is", null);

  if (tasks.length === 0) {
    return;
  }

  const { error } = await supabase.from(tasksTable).insert(tasks);
  if (error) {
    throw new Error(error.message);
  }
};
