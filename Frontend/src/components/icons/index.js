import { 
  Settings, 
  ListChecks, 
  LayoutGrid, 
  Lock, 
  Home, 
  FileText, 
  Clock, 
  Award,
  Users,
  Database,
  HelpCircle,
  LogOut
} from 'lucide-react';

// Main navigation icons
export const mainNavIcons = {
  dashboard: LayoutGrid,
  users: Users,
  database: Database,
  settings: Settings,
  help: HelpCircle,
  logout: LogOut
};

// Test configuration icons
export const testConfigIcons = {
  basic: Settings,
  questions: ListChecks,
  sets: LayoutGrid,
  access: Lock,
  start: Home,
  grading: FileText,
  time: Clock,
  certificate: Award
};