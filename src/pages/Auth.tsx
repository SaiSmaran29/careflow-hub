import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Activity, Mail, Lock, User, Stethoscope, Pill, FlaskConical, ScanLine, Shield, Heart, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ROLES: { value: AppRole; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'doctor', label: 'Doctor', icon: <Stethoscope className="h-4 w-4" />, desc: 'Clinical orders' },
  { value: 'nurse', label: 'Nurse', icon: <Heart className="h-4 w-4" />, desc: 'Patient care' },
  { value: 'pharmacy', label: 'Pharmacy', icon: <Pill className="h-4 w-4" />, desc: 'Prescriptions' },
  { value: 'lab', label: 'Lab', icon: <FlaskConical className="h-4 w-4" />, desc: 'Diagnostics' },
  { value: 'imaging', label: 'Imaging', icon: <ScanLine className="h-4 w-4" />, desc: 'Radiology' },
  { value: 'admin', label: 'Admin', icon: <Shield className="h-4 w-4" />, desc: 'Oversight' },
];

const FEATURES = [
  'Unified patient care timeline',
  'Real-time department coordination',
  'Instant status tracking & alerts',
  'Role-based clinical workflows',
];

export default function Auth() {
  const { user, loading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('doctor');
  const [submitting, setSubmitting] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) toast({ title: 'Login failed', description: error, variant: 'destructive' });
    } else {
      if (!fullName.trim()) {
        toast({ title: 'Name required', description: 'Please enter your full name.', variant: 'destructive' });
        setSubmitting(false);
        return;
      }
      const { error } = await signUp(email, password, fullName, selectedRole);
      if (error) {
        toast({ title: 'Signup failed', description: error, variant: 'destructive' });
      } else {
        toast({ title: 'Account created!', description: 'Please check your email to verify your account before logging in.' });
        setIsLogin(true);
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left branded panel */}
      <div className="hidden lg:flex lg:w-[45%] bg-primary relative overflow-hidden flex-col justify-between p-10">
        {/* Decorative shapes */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-accent/10 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-accent/5 translate-y-1/3 -translate-x-1/4" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-primary-foreground/5 -translate-x-1/2 -translate-y-1/2" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-primary-foreground/15 backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10">
            <Activity className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-primary-foreground tracking-tight">CareFlow</h1>
            <p className="text-[11px] text-primary-foreground/50 font-medium">Clinical Coordination Platform</p>
          </div>
        </div>

        {/* Hero copy */}
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-bold text-primary-foreground leading-tight">
            Coordinate care,<br />
            <span className="text-accent">not paperwork.</span>
          </h2>
          <p className="text-primary-foreground/60 text-sm leading-relaxed max-w-sm">
            A unified clinical platform that connects every department in real-time — from order to completion.
          </p>
          <div className="space-y-3">
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-sm text-primary-foreground/70">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="relative z-10 text-[11px] text-primary-foreground/30">
          © 2026 CareFlow · Secure · HIPAA Compliant
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-background">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold text-foreground">CareFlow</span>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground tracking-tight">
              {isLogin ? 'Welcome back' : 'Get started'}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {isLogin ? 'Enter your credentials to continue' : 'Create your clinical account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input id="fullName" placeholder="Dr. Jane Smith" value={fullName} onChange={e => setFullName(e.target.value)} className="pl-10 h-11" maxLength={100} />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-medium">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="you@hospital.org" value={email} onChange={e => setEmail(e.target.value)} className="pl-10 h-11" required maxLength={255} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="pl-10 h-11" required minLength={6} />
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Select your role</Label>
                <div className="grid grid-cols-3 gap-1.5">
                  {ROLES.map(r => (
                    <button
                      type="button"
                      key={r.value}
                      onClick={() => setSelectedRole(r.value)}
                      className={`flex flex-col items-center gap-1 p-2.5 rounded-lg border text-center transition-all duration-150 ${
                        selectedRole === r.value
                          ? 'border-primary bg-primary/5 ring-1 ring-primary/20 shadow-sm'
                          : 'border-border hover:bg-muted/50 hover:border-muted-foreground/20'
                      }`}
                    >
                      <span className={selectedRole === r.value ? 'text-primary' : 'text-muted-foreground'}>{r.icon}</span>
                      <span className="text-[11px] font-medium text-foreground">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Button type="submit" className="w-full h-11 gap-2 text-sm font-semibold" disabled={submitting}>
              {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              {!submitting && <ArrowRight className="h-4 w-4" />}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline font-semibold">
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
