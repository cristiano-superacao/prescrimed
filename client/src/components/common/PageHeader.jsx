import React from 'react';

export default function PageHeader({ title, subtitle, label, children }) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
      <div className="space-y-3">
        {label && (
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">{label}</p>
        )}
        <h1 className="text-4xl font-bold text-slate-900">{title}</h1>
        {subtitle && (
          <p className="text-slate-500 text-sm max-w-2xl">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-2 sm:gap-3">
        {children}
      </div>
    </div>
  );
}
