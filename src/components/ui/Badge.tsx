import React from 'react';
import { cn } from './Card'; // reuse cn utility

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'stable' | 'watch' | 'warning' | 'critical' | 'info' | 'outline';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    stable: 'bg-status-stable/10 text-status-stable border border-status-stable/20',
    watch: 'bg-status-watch/10 text-status-watch border border-status-watch/20',
    warning: 'bg-status-warning/10 text-status-warning border border-status-warning/20',
    critical: 'bg-status-critical/10 text-status-critical border border-status-critical/20',
    info: 'bg-blue-500/10 text-blue-600 border border-blue-500/20',
    outline: 'text-foreground border border-border',
  };

  return (
    <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props} />
  );
}
