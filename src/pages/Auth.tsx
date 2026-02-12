import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, AppRole } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Mail, Lock, User, Stethoscope, Pill, FlaskConical, ScanLine, Shield, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ROLES: { value: AppRole; label: string; icon: React.ReactNode; desc: string }[] = [
  { value: 'doctor', label: 'Doctor', icon: <Stethoscope className="h-5 w-5" />, desc: 'Create clinical orders' },
  { value: 'nurse', label: 'Nurse', icon: <Heart className="h-5 w-5" />, desc: 'Manage patient care' },
  { value: 'pharmacy', label: 'Pharmacy', icon: <Pill className="h-5 w-5" />, desc: 'Process prescriptions' },
  { value: 'lab', label: 'Lab', icon: <FlaskConical className="h-5 w-5" />, desc: 'Run diagnostics' },
  { value: 'imaging', label: 'Imaging', icon: <ScanLine className="h-5 w-5" />, desc: 'Medical imaging' },
  { value: 'admin', label: 'Admin', icon: <Shield className="h-5 w-5" />, desc: 'System oversight' },
];

export default function Auth() {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [selectedRole, setSelectedRole] = useState<AppRole>('doctor');
  const [submitting, setSubmitting] = useState(false);

  const { signIn, signUp } = useAuth();

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
      if (error) {
        toast({ title: 'Login failed', description: error, variant: 'destructive' });
      }
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center">
            <Activity className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">CareFlow</h1>
            <p className="text-[11px] text-muted-foreground">Clinical Coordination</p>
          </div>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-lg">{isLogin ? 'Welcome back' : 'Create your account'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Sign in to access the clinical dashboard' : 'Register to join your clinical team'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      placeholder="Dr. Jane Smith"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      className="pl-10"
                      maxLength={100}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@hospital.org"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    maxLength={255}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* Role selector on signup */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label>Your Role</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ROLES.map(r => (
                      <button
                        type="button"
                        key={r.value}
                        onClick={() => setSelectedRole(r.value)}
                        className={`flex items-center gap-2 p-2.5 rounded-lg border text-left text-sm transition-colors ${
                          selectedRole === r.value
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border hover:bg-muted text-muted-foreground'
                        }`}
                      >
                        {r.icon}
                        <div>
                          <div className="font-medium text-foreground text-xs">{r.label}</div>
                          <div className="text-[10px] opacity-70">{r.desc}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-primary hover:underline font-medium"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
