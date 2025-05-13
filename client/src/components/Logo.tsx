import React from 'react';

interface LogoProps {
  className?: string;
  textClassName?: string; // Keeping for backward compatibility
}

export function Logo({ className = "h-14 md:h-18" }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img 
        src="/priorityparcel_logo-removebg-preview.png" 
        alt="PriorityParcel Logo"
        className="w-full h-full object-contain"
      />
    </div>
  );
}
