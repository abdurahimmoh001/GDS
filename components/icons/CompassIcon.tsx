import React from 'react';

export const CompassIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3a9 9 0 100 18 9 9 0 000-18z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.24 7.76l-2.88 6.632a.75.75 0 01-.328.328l-6.632 2.88a.25.25 0 01-.32-.32l2.88-6.632a.75.75 0 01.328-.328l6.632-2.88a.25.25 0 01.32.32z" />
  </svg>
);