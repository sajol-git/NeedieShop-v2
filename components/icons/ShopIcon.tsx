import React from 'react';

export const ShopIcon = ({ className = "w-6 h-6", strokeWidth = 10 }: { className?: string; strokeWidth?: number | string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="128" 
    height="128" 
    viewBox="0 0 128 128"
    fill="none"
    className={className}
    id="shopping-cart"
  >
    <circle cx="49" cy="107" r="5" fill="currentColor"></circle>
    <circle cx="87" cy="107" r="5" fill="currentColor"></circle>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M43.116 77H80.0627C87.276 77 90.8827 77 93.7816 75.2093C96.6806 73.4186 98.3028 70.178 101.547 63.6968V63.6968C109.382 48.045 113.3 40.2192 109.783 34.5255C106.266 28.8319 97.5594 28.8319 80.1468 28.8319H32.0126M43.116 77L32.2617 29.8155L31.3089 26.0536C30.4024 22.4847 28.2147 19.3377 25.1364 17.1733C22.0581 15.0089 18.2841 13.963 14.4851 14.2231L11 14.4624"></path>
  </svg>
);
