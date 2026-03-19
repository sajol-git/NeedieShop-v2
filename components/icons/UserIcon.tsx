export const UserIcon = ({ className, strokeWidth = 24 }: { className?: string; strokeWidth?: number | string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 256 256" 
    className={className} 
    fill="none"
  >
    <rect width="256" height="256" fill="none"></rect>
    <circle cx="128" cy="96" r="64" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth}></circle>
    <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth={strokeWidth} d="M30.989,215.99064a112.03731,112.03731,0,0,1,194.02311.002"></path>
  </svg>
);
