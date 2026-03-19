export const NotificationIcon = ({ className = "w-6 h-6", strokeWidth = 7 }: { className?: string; strokeWidth?: number | string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="128" 
    height="128" 
    fill="none" 
    viewBox="0 0 128 128" 
    className={className}
    id="notification"
  >
    <path stroke="currentColor" strokeWidth={strokeWidth} d="M64 24C78.0195 24 89.3846 35.3651 89.3846 49.3846L89.3846 59.2575C89.3846 66.0498 91.3466 72.6975 95.0346 78.4014L99.1456 84.7593C103.395 91.3316 98.6774 100 90.8509 100L37.149 100C29.3226 100 24.6049 91.3316 28.8544 84.7593L32.9654 78.4014C36.6534 72.6975 38.6154 66.0498 38.6154 59.2575L38.6154 49.3846C38.6154 35.3651 49.9805 24 64 24V24zM64 112C59.5817 112 56 108.418 56 104L56 100 72 100 72 104C72 108.418 68.4183 112 64 112V112z"></path>
    <path stroke="currentColor" strokeLinecap="round" strokeWidth={strokeWidth} d="M64 15L64 22"></path>
  </svg>
);
