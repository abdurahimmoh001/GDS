import React from 'react';

export const ChartGenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 21V3h18" />
    <rect width="4" height="12" x="7" y="9" rx="1" className="animate-chart-gen-bar-1" />
    <rect width="4" height="16" x="12" y="5" rx="1" className="animate-chart-gen-bar-2" />
    <rect width="4" height="8" x="17" y="13" rx="1" className="animate-chart-gen-bar-3" />
  </svg>
);