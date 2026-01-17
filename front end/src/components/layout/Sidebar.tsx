import React, { useState } from 'react';
import { NavLink as RouterNavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban, 
  CheckSquare, 
  Clock, 
  ListTodo, 
  AlertCircle,
  Users, 
  Settings,
  ChevronDown,
  ChevronRight,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  end?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon: Icon, label, end }) => {
  const location = useLocation();
  const isActive = end ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <RouterNavLink
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group',
        isActive 
          ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
          : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </RouterNavLink>
  );
};

interface SubNavItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
}

const SubNavItem: React.FC<SubNavItemProps> = ({ to, icon: Icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <RouterNavLink
      to={to}
      className={cn(
        'flex items-center gap-3 px-4 py-2 pl-12 rounded-lg transition-all duration-200',
        isActive 
          ? 'bg-sidebar-accent text-sidebar-foreground' 
          : 'text-sidebar-muted hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
      )}
    >
      <Icon className="w-4 h-4" />
      <span className="text-sm">{label}</span>
    </RouterNavLink>
  );
};

export const Sidebar: React.FC = () => {
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const location = useLocation();
  const isTasksActive = location.pathname.includes('/tasks');

  return (
    <aside className="w-64 bg-sidebar min-h-screen flex flex-col border-r border-sidebar-border">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-sidebar-primary rounded-xl flex items-center justify-center">
            <Layers className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading font-bold text-lg text-sidebar-foreground">ProjetHub</h1>
            <p className="text-xs text-sidebar-muted">Gestion de projets</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <NavItem to="/dashboard" icon={LayoutDashboard} label="Dashboard" end />
        <NavItem to="/projects" icon={FolderKanban} label="Mes Projets" />
        
        {/* Tasks Section with submenu */}
        <div>
          <button
            onClick={() => setTasksExpanded(!tasksExpanded)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-2.5 rounded-lg transition-all duration-200',
              isTasksActive 
                ? 'bg-sidebar-accent text-sidebar-foreground' 
                : 'text-sidebar-muted hover:bg-sidebar-accent hover:text-sidebar-foreground'
            )}
          >
            <div className="flex items-center gap-3">
              <CheckSquare className="w-5 h-5" />
              <span className="font-medium">Tâches</span>
            </div>
            {tasksExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
          
          {tasksExpanded && (
            <div className="mt-1 space-y-0.5 animate-fade-in">
              <SubNavItem to="/tasks/done" icon={CheckSquare} label="Complètes" />
              <SubNavItem to="/tasks/in-progress" icon={Clock} label="En cours" />
              <SubNavItem to="/tasks/todo" icon={ListTodo} label="À faire" />
              <SubNavItem to="/tasks/incomplete" icon={AlertCircle} label="Incomplètes" />
            </div>
          )}
        </div>

        <NavItem to="/team" icon={Users} label="Équipe" />
        <NavItem to="/settings" icon={Settings} label="Paramètres" />
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <p className="text-xs text-sidebar-muted text-center">© 2024 ProjetHub</p>
      </div>
    </aside>
  );
};
