// Shared UI utilities
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function riskColor(risk: string): string {
  switch (risk) {
    case 'STABLE':   return 'var(--color-stable)';
    case 'WATCH':    return 'var(--color-watch)';
    case 'WARNING':  return 'var(--color-warning)';
    case 'CRITICAL': return 'var(--color-critical)';
    default:         return 'var(--color-text-muted)';
  }
}

export function riskBadgeClass(risk: string): string {
  switch (risk) {
    case 'STABLE':   return 'badge badge-stable';
    case 'WATCH':    return 'badge badge-watch';
    case 'WARNING':  return 'badge badge-warning';
    case 'CRITICAL': return 'badge badge-critical';
    default:         return 'badge badge-system';
  }
}

export function statusBadgeClass(status: string): string {
  switch (status) {
    case 'Healthy': return 'badge badge-stable';
    case 'Watch':   return 'badge badge-watch';
    case 'Warning': return 'badge badge-warning';
    case 'Offline': return 'badge badge-system';
    case 'Tampered': return 'badge badge-critical';
    default:        return 'badge badge-system';
  }
}

export function formatRelativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}
