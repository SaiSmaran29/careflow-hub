import { ActionStatus, ActionType, Priority, Department, UserRole } from '@/types/clinical';
import { 
  FlaskConical, Pill, ScanLine, Stethoscope, UserCheck, ArrowRightLeft,
  Clock, CheckCircle2, XCircle, Ban, AlertTriangle, CircleDot, Loader2
} from 'lucide-react';

export const statusConfig: Record<ActionStatus, { label: string; className: string; icon: typeof Clock }> = {
  ordered: { label: 'Ordered', className: 'status-ordered', icon: CircleDot },
  acknowledged: { label: 'Acknowledged', className: 'status-acknowledged', icon: Clock },
  in_progress: { label: 'In Progress', className: 'status-in-progress', icon: Loader2 },
  completed: { label: 'Completed', className: 'status-completed', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', className: 'status-cancelled', icon: Ban },
  rejected: { label: 'Rejected', className: 'status-rejected', icon: XCircle },
};

export const actionTypeConfig: Record<ActionType, { label: string; icon: typeof Pill }> = {
  medication: { label: 'Medication', icon: Pill },
  lab_test: { label: 'Lab Test', icon: FlaskConical },
  imaging: { label: 'Imaging', icon: ScanLine },
  procedure: { label: 'Procedure', icon: Stethoscope },
  referral: { label: 'Referral', icon: ArrowRightLeft },
  nursing_task: { label: 'Nursing Task', icon: UserCheck },
};

export const priorityConfig: Record<Priority, { label: string; className: string }> = {
  stat: { label: 'STAT', className: 'priority-stat' },
  urgent: { label: 'URGENT', className: 'priority-urgent' },
  routine: { label: 'Routine', className: 'priority-routine' },
};

export const departmentConfig: Record<Department, { label: string; className: string }> = {
  pharmacy: { label: 'Pharmacy', className: 'dept-pharmacy' },
  lab: { label: 'Laboratory', className: 'dept-lab' },
  imaging: { label: 'Imaging', className: 'dept-imaging' },
  nursing: { label: 'Nursing', className: 'dept-nursing' },
  doctor: { label: 'Physician', className: 'dept-doctor' },
};

export const roleConfig: Record<UserRole, { label: string; department: Department }> = {
  doctor: { label: 'Doctor', department: 'doctor' },
  nurse: { label: 'Nurse', department: 'nursing' },
  pharmacy: { label: 'Pharmacist', department: 'pharmacy' },
  lab: { label: 'Lab Tech', department: 'lab' },
  imaging: { label: 'Imaging Tech', department: 'imaging' },
  admin: { label: 'Admin', department: 'doctor' },
};
