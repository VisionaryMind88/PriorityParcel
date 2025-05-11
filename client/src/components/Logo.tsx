import React from 'react';
import logoPath from '../assets/9f3fc153-6d70-4b48-84a7-435b5b7a50f8_removalai_preview.png';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-10 md:h-14 w-auto" }: LogoProps) {
  return (
    <img 
      src={logoPath} 
      alt="PriorityParcel Logo" 
      className={className} 
    />
  );
}