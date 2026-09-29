import React from 'react';
import { Map, LayoutDashboard, RadioTower, TrendingUp, Satellite, Building2, Bell, Server } from 'lucide-react';

export function Sidebar() {
  return (
    <aside className="w-64 bg-sidebar text-sidebarForeground border-r border-border/10 flex flex-col h-full overflow-y-auto">
      <nav className="flex-1 py-6 px-3 space-y-1">
        <NavItem icon={<LayoutDashboard className="w-5 h-5" />} label="Overview" active />
        <NavItem icon={<Map className="w-5 h-5" />} label="Risk Map" />
        <NavItem icon={<RadioTower className="w-5 h-5" />} label="Sensor Network" />
        <NavItem icon={<TrendingUp className="w-5 h-5" />} label="Deformation Trends" />
        <NavItem icon={<Satellite className="w-5 h-5" />} label="Satellite / InSAR" />
        <NavItem icon={<Building2 className="w-5 h-5" />} label="Infrastructure Impact" />
        <NavItem icon={<Bell className="w-5 h-5" />} label="Alerts" />
        <NavItem icon={<Server className="w-5 h-5" />} label="System Health" />
      </nav>
      
      <div className="p-4 border-t border-border/10 text-xs text-slate-400">
        <p>DHARATAL Platform</p>
        <p>Version: Prototype 1.0</p>
        <p className="mt-2 text-[10px] text-slate-500">Not for operational use. Simulation purposes only.</p>
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <a
      href="#"
      className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-primary/20 text-primary border border-primary/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </a>
  );
}
