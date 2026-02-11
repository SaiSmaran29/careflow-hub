import { useClinical } from '@/context/ClinicalContext';
import { Heart, Droplets, AlertTriangle, Bed, User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export function PatientSummaryPanel() {
  const { selectedPatient, getPatientActions } = useClinical();
  if (!selectedPatient) return null;

  const actions = getPatientActions(selectedPatient.id);
  const activeCount = actions.filter(a => a.status !== 'completed' && a.status !== 'cancelled').length;
  const completedCount = actions.filter(a => a.status === 'completed').length;

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      {/* Patient Header */}
      <div className="p-4 bg-primary text-primary-foreground">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-11 w-11 rounded-full bg-primary-foreground/20 flex items-center justify-center text-lg font-bold">
            {selectedPatient.name.charAt(0)}
          </div>
          <div>
            <h2 className="font-semibold text-base leading-tight">{selectedPatient.name}</h2>
            <p className="text-xs text-primary-foreground/70">{selectedPatient.mrn}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="bg-primary-foreground/10 rounded p-1.5 text-center">
            <span className="block text-primary-foreground/60">Age</span>
            <span className="font-semibold">{selectedPatient.age}{selectedPatient.gender}</span>
          </div>
          <div className="bg-primary-foreground/10 rounded p-1.5 text-center">
            <span className="block text-primary-foreground/60">Blood</span>
            <span className="font-semibold">{selectedPatient.bloodType}</span>
          </div>
          <div className="bg-primary-foreground/10 rounded p-1.5 text-center">
            <span className="block text-primary-foreground/60">Room</span>
            <span className="font-semibold">{selectedPatient.room}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 p-3">
        <div className="bg-clinical-in-progress/10 rounded-lg p-2.5 text-center">
          <span className="text-xl font-bold text-clinical-in-progress">{activeCount}</span>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Active</p>
        </div>
        <div className="bg-clinical-completed/10 rounded-lg p-2.5 text-center">
          <span className="text-xl font-bold text-clinical-completed">{completedCount}</span>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Done</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-3">
        {/* Diagnosis */}
        <Section title="Diagnosis">
          <p className="text-sm font-medium text-foreground">{selectedPatient.diagnosis}</p>
        </Section>

        {/* Allergies */}
        {selectedPatient.allergies.length > 0 && (
          <Section title="Allergies" icon={<AlertTriangle className="h-3.5 w-3.5 text-destructive" />} alert>
            <div className="flex flex-wrap gap-1">
              {selectedPatient.allergies.map(a => (
                <span key={a} className="px-2 py-0.5 bg-destructive/10 text-destructive text-xs rounded-full font-medium">{a}</span>
              ))}
            </div>
          </Section>
        )}

        {/* Problems */}
        <Section title="Problem List">
          <ul className="space-y-1">
            {selectedPatient.problems.map(p => (
              <li key={p} className="text-xs text-foreground flex items-start gap-1.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/40 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
        </Section>

        {/* Current Meds */}
        <Section title="Current Medications">
          <ul className="space-y-1">
            {selectedPatient.currentMeds.map(m => (
              <li key={m} className="text-xs text-foreground flex items-start gap-1.5">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                {m}
              </li>
            ))}
          </ul>
        </Section>

        {/* Admission Info */}
        <Section title="Admission">
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {format(new Date(selectedPatient.admissionDate), 'MMM d, yyyy HH:mm')}
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <User className="h-3 w-3" />
              {selectedPatient.attendingDoctor}
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Section({ title, children, icon, alert }: { title: string; children: React.ReactNode; icon?: React.ReactNode; alert?: boolean }) {
  return (
    <div className={`rounded-lg border p-2.5 ${alert ? 'border-destructive/30 bg-destructive/5' : 'border-border bg-muted/30'}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {icon}
        <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      </div>
      {children}
    </div>
  );
}
