import { Badge } from '@/components/ui/badge';
import { ActionStatus, Priority } from '@/types/clinical';
import { statusConfig, priorityConfig } from '@/lib/clinicalConfig';

export function StatusBadge({ status }: { status: ActionStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.className}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config = priorityConfig[priority];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${config.className} ${priority === 'stat' ? 'bg-destructive/10' : priority === 'urgent' ? 'bg-priority-urgent/10' : 'bg-muted'}`}>
      {config.label}
    </span>
  );
}

export function DepartmentBadge({ department, label }: { department: string; label: string }) {
  return (
    <Badge variant="outline" className={`text-[10px] font-medium dept-${department}`}>
      {label}
    </Badge>
  );
}
