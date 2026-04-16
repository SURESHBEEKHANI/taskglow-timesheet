import React, { useMemo } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { analyzeBurnoutRisk } from '@/lib/burnoutEngine';
import { AlertCircle, ShieldAlert, ShieldCheck, Info } from 'lucide-react';

const BurnoutAlert: React.FC = () => {
  const { tasks } = useTasks();
  
  const risk = useMemo(() => analyzeBurnoutRisk(tasks), [tasks]);

  if (risk.risk_level === 'low' && risk.warning_signs.length === 0) {
    return (
      <div className="glass-card-hover rounded-2xl p-5 border-success/20 bg-success/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center text-success">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h4 className="text-[11px] font-bold text-success uppercase tracking-wider">Health Status: Optimal</h4>
            <p className="text-[10px] text-muted-foreground mt-0.5">Your workload balance is currently safe.</p>
          </div>
        </div>
      </div>
    );
  }

  const styles = {
    high: {
      bg: 'bg-danger/10 border-danger/30',
      text: 'text-danger',
      icon: <ShieldAlert size={20} />,
      label: 'HIGH BURNOUT RISK'
    },
    medium: {
      bg: 'bg-warning/10 border-warning/30',
      text: 'text-warning',
      icon: <AlertCircle size={20} />,
      label: 'MODERATE FATIGUE'
    },
    low: {
      bg: 'bg-primary/10 border-primary/30',
      text: 'text-primary',
      icon: <Info size={20} />,
      label: 'MINOR STRAIN'
    }
  };

  const currentStyle = styles[risk.risk_level];

  return (
    <div className={`glass-card-hover rounded-2xl p-6 border-2 animate-pulse-subtle transition-all ${currentStyle.bg}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentStyle.bg} ${currentStyle.text}`}>
          {currentStyle.icon}
        </div>
        <div>
          <h4 className={`text-xs font-black uppercase tracking-widest ${currentStyle.text}`}>
            {currentStyle.label}
          </h4>
          <p className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">Pre-emptive Detection Layer</p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Warning Signs:</p>
          {risk.warning_signs.map((sign, i) => (
            <div key={i} className="flex items-start gap-2 text-[11px] text-foreground/80 leading-relaxed group">
              <span className={`mt-1.5 w-1 h-1 rounded-full flex-shrink-0 ${currentStyle.text}`} />
              <span>{sign}</span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-border/20">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Recommendation:</p>
          <div className={`text-[11px] font-bold leading-relaxed px-3 py-2 rounded-lg bg-background/50 border border-border/50 ${currentStyle.text}`}>
            {risk.recommendation}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BurnoutAlert;
