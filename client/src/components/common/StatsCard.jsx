import React from 'react';

export default function StatsCard({ icon: Icon, label, value, description, color = 'primary' }) {
  const colorClasses = {
    primary: { border: 'border-primary-500', bg: 'bg-primary-50', text: 'text-primary-600' },
    emerald: { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600' },
    red: { border: 'border-red-500', bg: 'bg-red-50', text: 'text-red-600' },
    purple: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-600' },
    orange: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-600' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-600' },
  };

  const theme = colorClasses[color] || colorClasses.primary;

  return (
    <div className={`card p-6 border-l-4 ${theme.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${theme.bg} rounded-xl`}>
          <Icon className={theme.text} size={24} />
        </div>
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
      </div>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {description && <p className="text-sm text-slate-500 mt-1">{description}</p>}
    </div>
  );
}
