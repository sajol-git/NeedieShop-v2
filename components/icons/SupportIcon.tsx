import React from 'react';

export const SupportIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="128" 
    height="128" 
    fill="none" 
    viewBox="0 0 128 128" 
    className={className}
    id="support"
  >
    <circle cx="64" cy="53" r="20" stroke="currentColor" strokeWidth="9" transform="rotate(-90 64 53)"></circle>
    <path stroke="currentColor" strokeLinejoin="round" strokeWidth="9" d="M26 97.4808C26 103.843 31.1573 109 37.5192 109H90.4556C96.8314 109 102 103.831 102 97.4556V97.4556C102 90.3804 95.6937 84.9699 88.7008 86.0453L73.5581 88.3742C66.8929 89.3992 60.1092 89.3857 53.4482 88.3339L39.3158 86.1025C32.3241 84.9985 26 90.4024 26 97.4808V97.4808Z"></path>
    <path stroke="currentColor" strokeLinecap="round" strokeWidth="9" d="M95 31C93.3137 28.445 90.8422 26.1235 87.7264 24.168C84.6106 22.2125 80.9116 20.6613 76.8406 19.603C72.7696 18.5447 68.4064 18 64 18C59.5936 18 55.2304 18.5447 51.1594 19.603C47.0884 20.6613 43.3894 22.2125 40.2736 24.168C37.1578 26.1235 34.6863 28.445 33 31"></path>
    <rect width="12" height="23" x="95" y="41" stroke="currentColor" strokeWidth="9" rx="6"></rect>
    <rect width="12" height="23" x="21" y="41" stroke="currentColor" strokeWidth="9" rx="6"></rect>
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="9" d="M101 64V64C101 69.5228 96.5228 74 91 74H89.5"></path>
  </svg>
);
