import { useState } from 'react';
import { useClinical } from '@/context/ClinicalContext';
import { PatientSummaryPanel } from '@/components/clinical/PatientSummaryPanel';
import { CareTimeline } from '@/components/clinical/CareTimeline';
import { ActiveTasksPanel } from '@/components/clinical/ActiveTasksPanel';
import { DepartmentQueue } from '@/components/clinical/DepartmentQueue';
import { RoleSwitcher } from '@/components/clinical/RoleSwitcher';
import { PatientList } from '@/components/clinical/PatientList';
import { roleConfig, departmentConfig } from '@/lib/clinicalConfig';
import { Activity, LayoutGrid, Users, Bell, ListTodo } from 'lucide-react';
import { Department } from '@/types/clinical';

type View = 'timeline' | 'queues';

export function Dashboard() {
  const { currentUser, getDepartmentActions } = useClinical();
  const [view, setView] = useState<View>('timeline');

  const userDept = roleConfig[currentUser.role].department;
  const deptQueueCount = getDepartmentActions(userDept).length;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Left Sidebar — Navigation */}
      <div className="w-60 bg-sidebar flex flex-col border-r border-sidebar-border shrink-0">
        {/* Logo */}
        <div className="px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-sidebar-primary flex items-center justify-center">
              <Activity className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-sidebar-foreground">CareFlow</h1>
              <p className="text-[10px] text-sidebar-foreground/50">Clinical Coordination</p>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="p-3">
          <RoleSwitcher />
        </div>

        {/* Nav */}
        <div className="px-3 space-y-1">
          <button
            onClick={() => setView('timeline')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              view === 'timeline' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50'
            }`}
          >
            <Activity className="h-4 w-4" />
            Patient Timeline
          </button>
          <button
            onClick={() => setView('queues')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              view === 'queues' ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/60 hover:bg-sidebar-accent/50'
            }`}
          >
            <ListTodo className="h-4 w-4" />
            Work Queues
            {deptQueueCount > 0 && (
              <span className="ml-auto bg-sidebar-primary text-sidebar-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {deptQueueCount}
              </span>
            )}
          </button>
        </div>

        {/* Patient List */}
        <div className="mt-4 px-3 flex-1 overflow-hidden flex flex-col">
          <h3 className="text-[10px] font-semibold uppercase tracking-wider text-sidebar-foreground/40 px-3 mb-2">Patients</h3>
          <div className="flex-1 overflow-y-auto">
            <PatientList />
          </div>
        </div>
      </div>

      {/* Main Content */}
      {view === 'timeline' ? (
        <>
          {/* Patient Summary */}
          <div className="w-72 shrink-0">
            <PatientSummaryPanel />
          </div>

          {/* Care Timeline */}
          <div className="flex-1 min-w-0">
            <CareTimeline />
          </div>

          {/* Active Tasks */}
          <div className="w-80 shrink-0">
            <ActiveTasksPanel />
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-xl font-bold text-foreground mb-1">Department Work Queues</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Viewing as <span className="font-semibold">{currentUser.name}</span> · {roleConfig[currentUser.role].label}
            </p>

            {/* Show user's department first, then others */}
            <div className="space-y-4">
              <DepartmentQueue department={userDept} />
              {(Object.keys(departmentConfig) as Department[])
                .filter(d => d !== userDept)
                .map(dept => (
                  <DepartmentQueue key={dept} department={dept} />
                ))
              }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
