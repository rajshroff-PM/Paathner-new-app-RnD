
import React from 'react';

interface LogoProps {
  className?: string;
  noBackground?: boolean;
}

const Logo: React.FC<LogoProps> = ({ className, noBackground = false }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 32.17 32.17"
      className={className}
    >
      {!noBackground && <rect fill="#066ce4" x="3" y="3" width="26.16" height="26.16" rx="4.65" ry="4.65"/>}
      <g>
        <path fill={noBackground ? "currentColor" : "#fff"} d="M15.57,21.77h0c0,2-1.62,3.61-3.61,3.61h-1.63v-10.85l4.85.41.22,2.66c.12,1.38.17,2.77.17,4.16Z"/>
        <path fill={noBackground ? "currentColor" : "#fff"} d="M21.08,8.42l-10.72,4.92v-.03c0-3.6,2.92-6.52,6.52-6.52,1.64,0,3.14.61,4.28,1.6-.02,0-.05.02-.08.03Z"/>
        <path fill={noBackground ? "currentColor" : "#fff"} d="M23.39,13.3s0,.1,0,.14c-.04,2.11-1.08,3.96-2.67,5.12-1.11.81-2.48,1.28-3.95,1.25l4.94-10.77s.02-.06.03-.09c1.03,1.16,1.66,2.67,1.66,4.34Z"/>
      </g>
    </svg>
  );
};

export default Logo;
