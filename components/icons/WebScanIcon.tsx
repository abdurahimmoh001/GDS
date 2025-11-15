import React from 'react';

export const WebScanIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.6 9h16.8" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.6 15h16.8" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11.5 3a17 17 0 0 0 0 18" />
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12.5 3a17 17 0 0 1 0 18" />
    <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M4 12h16" className="animate-web-scan-line" />
  </svg>
);