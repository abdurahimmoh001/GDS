import React from 'react';

export const ReportCompileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.5 22H15.5a2.5 2.5 0 0 0 2.5-2.5V4.5A2.5 2.5 0 0 0 15.5 2H8.5A2.5 2.5 0 0 0 6 4.5v15A2.5 2.5 0 0 0 8.5 22Z" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6" className="animate-report-compile-line-1" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6" className="animate-report-compile-line-2" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17h3" className="animate-report-compile-line-3" />
  </svg>
);