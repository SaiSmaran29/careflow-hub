import { useClinical } from '@/context/ClinicalContext';
import { mockPatients } from '@/data/mockData';
import { User, ChevronRight } from 'lucide-react';

export function PatientList() {
  const { selectedPatient, setSelectedPatient } = useClinical();

  return (
    <div className="space-y-1">
      {mockPatients.map(p => (
        <button
          key={p.id}
          onClick={() => setSelectedPatient(p)}
          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors text-sm ${
            selectedPatient?.id === p.id
              ? 'bg-sidebar-accent text-sidebar-accent-foreground'
              : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50'
          }`}
        >
          <div className="h-8 w-8 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-xs font-semibold text-sidebar-primary shrink-0">
            {p.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium truncate text-xs">{p.name}</div>
            <div className="text-[10px] opacity-60">{p.room} · {p.diagnosis}</div>
          </div>
          <ChevronRight className="h-3 w-3 opacity-40 shrink-0" />
        </button>
      ))}
    </div>
  );
}
