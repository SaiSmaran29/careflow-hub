import { useClinical } from '@/context/ClinicalContext';
import { mockUsers } from '@/data/mockData';
import { roleConfig } from '@/lib/clinicalConfig';
import { Users, ChevronDown } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export function RoleSwitcher() {
  const { currentUser, setCurrentUser } = useClinical();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent/80 transition-colors text-sm">
        <Users className="h-4 w-4" />
        <div className="text-left">
          <div className="text-xs font-semibold leading-tight">{currentUser.name}</div>
          <div className="text-[10px] opacity-70">{roleConfig[currentUser.role].label}</div>
        </div>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        {mockUsers.map(user => (
          <DropdownMenuItem
            key={user.id}
            onClick={() => setCurrentUser(user)}
            className={`flex items-center gap-2 ${currentUser.id === user.id ? 'bg-accent' : ''}`}
          >
            <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="text-sm font-medium">{user.name}</div>
              <div className="text-[10px] text-muted-foreground">{roleConfig[user.role].label}</div>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
