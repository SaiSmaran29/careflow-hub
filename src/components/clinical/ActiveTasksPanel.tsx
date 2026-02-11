import { useClinical } from '@/context/ClinicalContext';
import { ClinicalAction, ActionStatus } from '@/types/clinical';
import { StatusBadge, PriorityBadge } from './StatusBadges';
import { actionTypeConfig, departmentConfig } from '@/lib/clinicalConfig';
import { format, differenceInMinutes } from 'date-fns';
import { CheckCircle2, Clock, ArrowRight, Timer } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export function ActiveTasksPanel() {
  const { selectedPatient, getPatientActions, currentUser, updateActionStatus } = useClinical();

  if (!selectedPatient) return null;

  const actions = getPatientActions(selectedPatient.id)
    .filter(a => a.status !== 'completed' && a.status !== 'cancelled')
    .sort((a, b) => {
      const pOrder = { stat: 0, urgent: 1, routine: 2 };
      return pOrder[a.priority] - pOrder[b.priority];
    });

  const completed = getPatientActions(selectedPatient.id).filter(a => a.status === 'completed');

  return (
    <div className="flex flex-col h-full bg-card border-l border-border">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-base font-semibold text-foreground">Active Tasks</h2>
        <p className="text-xs text-muted-foreground">{actions.length} pending · {completed.length} completed</p>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {actions.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">No active tasks</div>
        ) : (
          actions.map(action => (
            <ActionCard key={action.id} action={action} />
          ))
        )}

        {completed.length > 0 && (
          <>
            <div className="flex items-center gap-2 pt-3 pb-1">
              <div className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Completed</span>
              <div className="flex-1 h-px bg-border" />
            </div>
            {completed.map(action => (
              <ActionCard key={action.id} action={action} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function ActionCard({ action }: { action: ClinicalAction }) {
  const { currentUser, updateActionStatus } = useClinical();
  const typeConf = actionTypeConfig[action.type];
  const Icon = typeConf.icon;
  const isOverdue = action.status !== 'completed' && action.status !== 'cancelled' &&
    differenceInMinutes(new Date(), new Date(action.orderedAt)) > action.slaMinutes;

  const canAdvance = action.status !== 'completed' && action.status !== 'cancelled' && action.status !== 'rejected';
  const nextStatus: Record<ActionStatus, ActionStatus> = {
    ordered: 'acknowledged',
    acknowledged: 'in_progress',
    in_progress: 'completed',
    completed: 'completed',
    cancelled: 'cancelled',
    rejected: 'rejected',
  };

  const handleAdvance = () => {
    const next = nextStatus[action.status];
    const notes: Record<ActionStatus, string> = {
      acknowledged: `Acknowledged by ${currentUser.name}`,
      in_progress: `In progress — ${currentUser.name}`,
      completed: `Completed by ${currentUser.name}`,
      ordered: '', cancelled: '', rejected: '',
    };
    updateActionStatus(action.id, next, notes[next]);
  };

  return (
    <div className={`rounded-lg border p-3 transition-all ${
      isOverdue ? 'border-destructive/40 bg-destructive/5' :
      action.status === 'completed' ? 'border-border bg-muted/30 opacity-70' :
      'border-border bg-card hover:shadow-sm'
    }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <Icon className={`h-4 w-4 shrink-0 dept-${action.targetDepartment}`} />
          <span className="text-sm font-medium truncate">{action.title}</span>
        </div>
        <PriorityBadge priority={action.priority} />
      </div>

      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{action.instructions}</p>

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
          <Button size="sm" variant="outline" onClick={handleAdvance} className="h-7 text-xs gap-1 hover:bg-accent hover:text-accent-foreground">
            <ArrowRight className="h-3 w-3" />
            {nextStatus[action.status] === 'completed' ? 'Complete' : nextStatus[action.status].replace('_', ' ')}
          </Button>
        )}
      </div>

      <div className="mt-2 text-[10px] text-muted-foreground flex items-center gap-1">
        <Clock className="h-2.5 w-2.5" />
        Ordered {format(new Date(action.orderedAt), 'HH:mm')} by {action.orderedBy}
      </div>
    </div>
  );
}
