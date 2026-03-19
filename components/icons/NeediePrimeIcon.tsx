import React from 'react';

export const NeediePrimeIcon = ({ className = "w-6 h-6", strokeWidth = 10 }: { className?: string; strokeWidth?: number | string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="128" 
    height="128" 
    viewBox="0 0 128 128"
    fill="none"
    className={className}
    id="card"
  >
    <rect width="96" height="78" x="16" y="25" stroke="currentColor" strokeWidth={strokeWidth} rx="23"></rect>
    <path stroke="currentColor" strokeLinecap="round" strokeWidth={strokeWidth} d="M16 49L110 49M37 82H61"></path>
  </svg>
);
