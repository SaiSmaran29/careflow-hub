import { useClinical } from '@/context/ClinicalContext';
import { TimelineEvent } from '@/types/clinical';
import { StatusBadge, PriorityBadge } from './StatusBadges';
import { departmentConfig, statusConfig } from '@/lib/clinicalConfig';
import { format } from 'date-fns';
import { useState } from 'react';
import { Filter, Clock, AlertTriangle, FileText, Activity, Bell } from 'lucide-react';

const eventTypeIcons: Record<string, typeof Clock> = {
  action_created: FileText,
  status_change: Activity,
  note: FileText,
  vitals: Activity,
  result: FileText,
  alert: AlertTriangle,
};

export function CareTimeline() {
  const { selectedPatient, getPatientTimeline } = useClinical();
  const [filterDept, setFilterDept] = useState<string>('all');

  if (!selectedPatient) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Select a patient to view their care timeline
      </div>
    );
  }

  let events = getPatientTimeline(selectedPatient.id);
  if (filterDept !== 'all') {
    events = events.filter(e => e.department === filterDept);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border bg-card">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">Care Timeline</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 bg-clinical-completed/10 text-clinical-completed rounded-full text-[10px] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-clinical-completed animate-pulse-live" />
              LIVE
            </span>
          </div>
          <span className="text-xs text-muted-foreground">{events.length} events</span>
        </div>
        {/* Filter */}
        <div className="flex items-center gap-1.5">
          <Filter className="h-3.5 w-3.5 text-muted-foreground" />
          {['all', ...Object.keys(departmentConfig)].map(dept => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                filterDept === dept
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-secondary'
              }`}
            >
              {dept === 'all' ? 'All' : departmentConfig[dept as keyof typeof departmentConfig].label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto px-5 py-3">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />

          <div className="space-y-1">
            {events.map((event, idx) => (
              <TimelineEntry key={event.id} event={event} isFirst={idx === 0} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineEntry({ event, isFirst }: { event: TimelineEvent; isFirst: boolean }) {
  const Icon = eventTypeIcons[event.type] || Clock;
  const deptConf = departmentConfig[event.department];
  const isAlert = event.type === 'alert';

  return (
    <div className={`relative pl-10 py-2.5 animate-slide-in ${isFirst ? '' : ''}`}>
      {/* Dot */}
      <div className={`absolute left-[9px] top-4 h-3.5 w-3.5 rounded-full border-2 border-card z-10 ${
        isAlert ? 'bg-destructive' :
        event.status === 'completed' ? 'bg-clinical-completed' :
        event.status === 'in_progress' ? 'bg-clinical-in-progress' :
        event.status === 'acknowledged' ? 'bg-clinical-acknowledged' :
        event.status === 'ordered' ? 'bg-clinical-ordered' :
        'bg-muted-foreground'
      }`} />

      <div className={`rounded-lg border p-3 transition-colors hover:bg-muted/50 ${isAlert ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-card'}`}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <Icon className={`h-3.5 w-3.5 shrink-0 ${isAlert ? 'text-destructive' : `dept-${event.department}`}`} />
            <span className={`text-sm font-medium truncate ${isAlert ? 'text-destructive' : 'text-foreground'}`}>
              {event.title}
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {event.priority && <PriorityBadge priority={event.priority} />}
            {event.status && <StatusBadge status={event.status} />}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-1.5 leading-relaxed">{event.description}</p>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className={`font-medium dept-${event.department}`}>{deptConf.label}</span>
          <span>·</span>
          <span>{event.user}</span>
          <span>·</span>
          <span className="flex items-center gap-0.5">
            <Clock className="h-2.5 w-2.5" />
            {format(new Date(event.timestamp), 'MMM d, HH:mm')}
          </span>
        </div>
      </div>
    </div>
  );
}
