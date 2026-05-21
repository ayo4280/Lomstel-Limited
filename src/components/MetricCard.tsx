import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

export default function MetricCard({ title, value, icon, trend, description }: MetricCardProps) {
  return (
    <div className="glass animate-fade-in" style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-earth-700)' }}>{title}</h3>
        {icon && <div style={{ color: 'var(--color-forest-500)', opacity: 0.8 }}>{icon}</div>}
      </div>
      
      <div style={{ fontSize: '2.75rem', fontWeight: 700, color: 'var(--text-main)', margin: 0, letterSpacing: '-1px' }}>
        {value}
      </div>
      
      {trend && (
        <div style={{ 
          fontSize: '0.9rem', 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          color: trend.isPositive ? 'var(--color-forest-500)' : 'var(--color-accent)'
        }}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}% {description ? 'progress' : 'from last month'}</span>
        </div>
      )}

      {description && (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: '-0.25rem' }}>
          {description}
        </div>
      )}
    </div>
  );
}
