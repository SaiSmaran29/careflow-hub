import React, { createContext, useContext, useState } from 'react';
import { AppUser, UserRole, Patient, ClinicalAction, TimelineEvent, ActionStatus, Department } from '@/types/clinical';
import { mockUsers, mockPatients, mockActions, mockTimeline } from '@/data/mockData';

interface ClinicalContextType {
  currentUser: AppUser;
  setCurrentUser: (user: AppUser) => void;
  users: AppUser[];
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (p: Patient | null) => void;
  actions: ClinicalAction[];
  updateActionStatus: (actionId: string, status: ActionStatus, note: string) => void;
  timeline: TimelineEvent[];
  getPatientActions: (patientId: string) => ClinicalAction[];
  getPatientTimeline: (patientId: string) => TimelineEvent[];
  getDepartmentActions: (dept: Department) => ClinicalAction[];
}

const ClinicalContext = createContext<ClinicalContextType | null>(null);

export const useClinical = () => {
  const ctx = useContext(ClinicalContext);
  if (!ctx) throw new Error('useClinical must be used within ClinicalProvider');
  return ctx;
};

export const ClinicalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AppUser>(mockUsers[0]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(mockPatients[0]);
  const [actions, setActions] = useState<ClinicalAction[]>(mockActions);
  const [timeline, setTimeline] = useState<TimelineEvent[]>(mockTimeline);

  const updateActionStatus = (actionId: string, status: ActionStatus, note: string) => {
    const now = new Date().toISOString();
    setActions(prev => prev.map(a => {
      if (a.id !== actionId) return a;
      return {
        ...a,
        status,
        acknowledgedAt: status === 'acknowledged' ? now : a.acknowledgedAt,
        completedAt: status === 'completed' ? now : a.completedAt,
        updates: [...a.updates, {
          id: `au-${Date.now()}`,
          actionId,
          status,
          note,
          updatedBy: currentUser.name,
          updatedByRole: currentUser.role,
          updatedAt: now,
        }],
      };
    }));

    const action = actions.find(a => a.id === actionId);
    if (action) {
      const newEvent: TimelineEvent = {
        id: `t-${Date.now()}`,
        patientId: action.patientId,
        actionId,
        type: 'status_change',
        title: `${action.title} — ${status.replace('_', ' ')}`,
        description: note,
        department: action.targetDepartment,
        status,
        timestamp: now,
        user: currentUser.name,
        userRole: currentUser.role,
      };
      setTimeline(prev => [...prev, newEvent]);
    }
  };

  const getPatientActions = (patientId: string) => actions.filter(a => a.patientId === patientId);
  const getPatientTimeline = (patientId: string) => timeline.filter(t => t.patientId === patientId).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const getDepartmentActions = (dept: Department) => actions.filter(a => a.targetDepartment === dept && a.status !== 'completed' && a.status !== 'cancelled');

  return (
    <ClinicalContext.Provider value={{
      currentUser, setCurrentUser, users: mockUsers,
      patients: mockPatients, selectedPatient, setSelectedPatient,
      actions, updateActionStatus, timeline,
      getPatientActions, getPatientTimeline, getDepartmentActions,
    }}>
      {children}
    </ClinicalContext.Provider>
  );
};
