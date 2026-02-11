export type UserRole = 'doctor' | 'nurse' | 'pharmacy' | 'lab' | 'imaging' | 'admin';

export type ActionType = 'medication' | 'lab_test' | 'imaging' | 'procedure' | 'referral' | 'nursing_task';

export type ActionStatus = 'ordered' | 'acknowledged' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';

export type Priority = 'stat' | 'urgent' | 'routine';

export type Department = 'pharmacy' | 'lab' | 'imaging' | 'nursing' | 'doctor';

export interface Patient {
  id: string;
  mrn: string;
  name: string;
  age: number;
  gender: 'M' | 'F';
  bloodType: string;
  admissionDate: string;
  room: string;
  attendingDoctor: string;
  allergies: string[];
  currentMeds: string[];
  problems: string[];
  diagnosis: string;
}

export interface ClinicalAction {
  id: string;
  patientId: string;
  type: ActionType;
  status: ActionStatus;
  priority: Priority;
  title: string;
  instructions: string;
  targetDepartment: Department;
  orderedBy: string;
  orderedAt: string;
  acknowledgedAt?: string;
  completedAt?: string;
  slaMinutes: number;
  updates: ActionUpdate[];
}

export interface ActionUpdate {
  id: string;
  actionId: string;
  status: ActionStatus;
  note: string;
  updatedBy: string;
  updatedByRole: UserRole;
  updatedAt: string;
  attachment?: string;
}

export interface TimelineEvent {
  id: string;
  patientId: string;
  actionId?: string;
  type: 'action_created' | 'status_change' | 'note' | 'vitals' | 'result' | 'alert';
  title: string;
  description: string;
  department: Department;
  priority?: Priority;
  status?: ActionStatus;
  timestamp: string;
  user: string;
  userRole: UserRole;
}

export interface AppUser {
  id: string;
  name: string;
  role: UserRole;
  department: Department;
  avatar?: string;
}
