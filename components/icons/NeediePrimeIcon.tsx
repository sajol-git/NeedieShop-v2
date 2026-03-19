import React from 'react';

export const NeediePrimeIcon = ({ className = "w-6 h-6", strokeWidth = 3 }: { className?: string; strokeWidth?: number | string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="48" 
    height="48" 
    viewBox="0 0 48 48"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    className={className}
    id="credit-card"
  >
    <path d="M9 14.91h24.41A4.52 4.52 0 0 1 38 19.37v14.85a4.52 4.52 0 0 1-4.57 4.46H9a4.51 4.51 0 0 1-4.57-4.46V19.37A4.51 4.51 0 0 1 9 14.91Zm-.22 2.8a1.54 1.54 0 0 0-1.56 1.51v15.15a1.53 1.53 0 0 0 1.56 1.51h24.85a1.53 1.53 0 0 0 1.56-1.51V19.22a1.54 1.54 0 0 0-1.56-1.51H8.78Zm8.3-5.58a1.41 1.41 0 1 1 0-2.81h20.61a5.75 5.75 0 0 1 5.88 5.61v11.16a1.47 1.47 0 0 1-2.94 0V14.93a2.87 2.87 0 0 0-2.94-2.8Z"></path>
    <path d="M14.21 24.7h14a1.4 1.4 0 0 0 0-2.8h-14a1.4 1.4 0 0 0 0 2.8Z"></path>
  </svg>
);
