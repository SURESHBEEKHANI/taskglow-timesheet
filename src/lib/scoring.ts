import { Task, getPlannedMinutes, getActualMinutes } from '../types/task';

export interface ScoreBreakdown {
  total: number;
  completion: number;
  accuracy: number;
  intensity: number;
  consistency: number;
  label: string;
  color: string;
}

export const calculateProductivityScore = (tasks: Task[]): ScoreBreakdown => {
  if (tasks.length === 0) {
    return { total: 0, completion: 0, accuracy: 0, intensity: 0, consistency: 0, label: 'No Data', color: 'hsl(var(--muted-foreground))' };
  }

  // 1. Completion (Max 40 pts)
  const completedTasks = tasks.filter(t => t.completed);
  const completionScore = Math.round((completedTasks.length / tasks.length) * 40);

  // 2. Accuracy (Max 30 pts)
  // Penalize for overruns or underruns (deviation)
  let totalDeviationRatio = 0;
  let tracksCount = 0;
  
  completedTasks.forEach(t => {
    const planned = getPlannedMinutes(t);
    const actual = getActualMinutes(t);
    if (planned > 0 && actual > 0) {
      const deviation = Math.abs(actual - planned);
      totalDeviationRatio += (deviation / planned);
      tracksCount++;
    }
  });

  const avgDeviation = tracksCount > 0 ? totalDeviationRatio / tracksCount : 1;
  const accuracyScore = Math.max(0, Math.round((1 - Math.min(avgDeviation, 1)) * 30));

  // 3. Intensity (Max 20 pts)
  // High priority tasks give more points
  const importantCompleted = completedTasks.filter(t => t.priority === 'important').length;
  const intensityScore = Math.min(20, importantCompleted * 5);

  // 4. Consistency (Max 10 pts)
  // Have they actually used the timers?
  const timedTasks = tasks.filter(t => t.timerElapsed > 0).length;
  const consistencyScore = Math.round((timedTasks / tasks.length) * 10);

  const total = completionScore + accuracyScore + intensityScore + consistencyScore;

  let label = 'Steady';
  let color = 'hsl(var(--primary))';

  if (total >= 90) { label = 'Legendary'; color = 'hsl(var(--chart-4))'; }
  else if (total >= 75) { label = 'High Performer'; color = 'hsl(var(--success))'; }
  else if (total >= 50) { label = 'Productive'; color = 'hsl(var(--primary))'; }
  else if (total >= 30) { label = 'Gaining Momentum'; color = 'hsl(var(--warning))'; }
  else { label = 'Focus Required'; color = 'hsl(var(--danger))'; }

  return { total, completion: completionScore, accuracy: accuracyScore, intensity: intensityScore, consistency: consistencyScore, label, color };
};
