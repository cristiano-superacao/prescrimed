import React from 'react';

export function TableContainer({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden relative ${className}`}>
      {children}
    </div>
  );
}

export function TableWrapper({ children }) {
  return (
    <div className="overflow-x-auto custom-scrollbar md:block hidden">
      <div className="min-w-[920px]">
        <table className="min-w-full divide-y divide-slate-200">
          {children}
        </table>
      </div>
    </div>
  );
}

export function TableHeader({ children }) {
  return (
    <thead className="bg-slate-50">
      <tr>{children}</tr>
    </thead>
  );
}

export function Th({ children, className = '', align = 'left' }) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <th 
      className={`px-4 sm:px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider ${alignStyles[align] || alignStyles.left} ${className}`}
    >
      {children}
    </th>
  );
}

export function TBody({ children }) {
  return (
    <tbody className="divide-y divide-slate-100 bg-white">
      {children}
    </tbody>
  );
}

export function Tr({ children, className = '', onClick = null }) {
  return (
    <tr 
      onClick={onClick}
      className={`hover:bg-slate-50 transition-colors ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </tr>
  );
}

export function Td({ children, className = '', align = 'left', density = 'comfortable' }) {
  const alignStyles = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };
  
  const py = density === 'compact' ? 'py-3' : 'py-4';

  return (
    <td 
      className={`px-4 sm:px-6 ${py} whitespace-nowrap ${alignStyles[align] || alignStyles.left} ${className}`}
    >
      {children}
    </td>
  );
}

export function MobileGrid({ children, className = '' }) {
  return (
    <div className={`md:hidden p-4 sm:p-6 space-y-3 ${className}`}>
      {children}
    </div>
  );
}

export function MobileCard({ children, className = '', density = 'comfortable' }) {
  const padding = density === 'compact' ? 'p-3' : 'p-4';
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${padding} ${className}`}>
      {children}
    </div>
  );
}
