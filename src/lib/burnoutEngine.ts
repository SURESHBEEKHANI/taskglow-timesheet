import { Task, getActualMinutes } from '../types/task';
import { subDays, format, isSameDay } from 'date-fns';

export interface BurnoutRisk {
  risk_level: 'low' | 'medium' | 'high';
  warning_signs: string[];
  recommendation: string;
}

export const analyzeBurnoutRisk = (tasks: Task[]): BurnoutRisk => {
  const signs: string[] = [];
  let riskScore = 0;

  // 1. Detect Overworking (Threshold: > 9 hours for 3+ days in last week)
  const last7Days = Array.from({ length: 7 }, (_, i) => subDays(new Date(), i));
  let longDaysCount = 0;
  let totalWeekMinutes = 0;

  last7Days.forEach(day => {
    const dayTasks = tasks.filter(t => isSameDay(new Date(t.date), day));
    const dayMinutes = dayTasks.reduce((s, t) => s + getActualMinutes(t), 0);
    if (dayMinutes > 540) longDaysCount++; // 9 hours
    totalWeekMinutes += dayMinutes;
  });

  if (longDaysCount >= 3) {
    signs.push(`Working over 9h for ${longDaysCount} days this week.`);
    riskScore += 40;
  }

  // 2. Detect Declining Productivity (Completion rate today vs week avg)
  const todayStr = format(new Date(), 'yyyy-MM-dd');
  const todayTasks = tasks.filter(t => t.date === todayStr);
  const todayCompletion = todayTasks.length > 0 
    ? todayTasks.filter(t => t.completed).length / todayTasks.length 
    : 1;

  const weekTasks = tasks.filter(t => {
    const d = new Date(t.date);
    return d >= subDays(new Date(), 7);
  });
  const weekCompletion = weekTasks.length > 0 
    ? weekTasks.filter(t => t.completed).length / weekTasks.length 
    : 0.8;

  if (todayCompletion < weekCompletion * 0.7 && todayTasks.length > 2) {
    signs.push('Significant drop in task completion rate today.');
    riskScore += 20;
  }

  // 3. Detect "After Hours" Work (Tasks after 8 PM)
  const lateTasks = tasks.filter(t => {
    if (!t.actualStart && !t.createdAt) return false;
    const hour = t.actualStart ? parseInt(t.actualStart.split(':')[0]) : new Date(t.createdAt).getHours();
    return hour >= 20 || hour <= 5;
  });

  if (lateTasks.length >= 5) {
    signs.push('High volume of after-hours or late-night tasks detected.');
    riskScore += 25;
  }

  // 4. Consecutive Intensity (Important + Urgent tasks > 70% of week)
  const highStressTasks = weekTasks.filter(t => t.priority === 'important' && t.urgency === 'urgent').length;
  if (weekTasks.length > 5 && highStressTasks / weekTasks.length > 0.6) {
    signs.push('Sustained high-urgency workload (over 60% urgent/important).');
    riskScore += 15;
  }

  // Final Risk Classification
  let risk_level: 'low' | 'medium' | 'high' = 'low';
  let recommendation = "Maintain your current pace and keep taking recovery breaks.";

  if (riskScore >= 70) {
    risk_level = 'high';
    recommendation = "CRITICAL: Immediate 24h disconnection recommended. Delegate all pending tasks.";
  } else if (riskScore >= 40) {
    risk_level = 'medium';
    recommendation = "Caution: Workload is peaking. Reduce non-essential tasks for the next 48 hours.";
  }

  return { risk_level, warning_signs: signs, recommendation };
};
