import { useClinical } from '@/context/ClinicalContext';
import { Department, ActionStatus } from '@/types/clinical';
import { departmentConfig, actionTypeConfig, statusConfig } from '@/lib/clinicalConfig';
import { StatusBadge, PriorityBadge } from './StatusBadges';
import { format, differenceInMinutes } from 'date-fns';
import { ArrowRight, Timer, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DepartmentQueue({ department }: { department: Department }) {
  const { getDepartmentActions, currentUser, updateActionStatus, patients } = useClinical();
  const actions = getDepartmentActions(department);
  const deptConf = departmentConfig[department];

  const getPatientName = (id: string) => patients.find(p => p.id === id)?.name || id;

  const nextStatus: Record<ActionStatus, ActionStatus> = {
    ordered: 'acknowledged',
    acknowledged: 'in_progress',
    in_progress: 'completed',
    completed: 'completed',
    cancelled: 'cancelled',
    rejected: 'rejected',
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full bg-dept-${department}`} />
          <h3 className="font-semibold text-sm">{deptConf.label} Queue</h3>
        </div>
        <span className="text-xs text-muted-foreground">{actions.length} pending</span>
      </div>

      {actions.length === 0 ? (
        <div className="p-6 text-center text-sm text-muted-foreground">
          All clear — no pending tasks.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {actions.map(action => {
            const TypeIcon = actionTypeConfig[action.type].icon;
            const isOverdue = differenceInMinutes(new Date(), new Date(action.orderedAt)) > action.slaMinutes;
            const canAdvance = action.status !== 'completed' && action.status !== 'cancelled';

            return (
              <div key={action.id} className={`p-3 hover:bg-muted/30 transition-colors ${isOverdue ? 'bg-destructive/5' : ''}`}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <TypeIcon className={`h-3.5 w-3.5 dept-${department}`} />
                      <span className="text-sm font-medium">{action.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">Patient: {getPatientName(action.patientId)} · Room {(() => { const p = patients.find(x => x.id === action.patientId); return p?.room; })()}</p>
                  </div>
                  <PriorityBadge priority={action.priority} />
                </div>

                <p className="text-xs text-muted-foreground mb-2">{action.instructions}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={action.status} />
                    {isOverdue && (
                      <span className="flex items-center gap-0.5 text-[10px] text-destructive font-semibold">
                        <Timer className="h-3 w-3" /> OVERDUE
                      </span>
                    )}
                  </div>
                  {canAdvance && (
                    <Button size="sm" variant="outline" onClick={() => {
                      const next = nextStatus[action.status];
                      updateActionStatus(action.id, next, `${next.replace('_', ' ')} by ${currentUser.name}`);
                    }} className="h-7 text-xs gap-1">
                      <ArrowRight className="h-3 w-3" />
                      {nextStatus[action.status] === 'completed' ? 'Complete' : nextStatus[action.status].replace('_', ' ')}
                    </Button>
                  )}
                </div>

                <div className="mt-1.5 text-[10px] text-muted-foreground flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  {format(new Date(action.orderedAt), 'MMM d, HH:mm')} · {action.orderedBy}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
