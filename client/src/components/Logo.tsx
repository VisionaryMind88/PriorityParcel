import React from 'react';
import logoPath from '../assets/logo-new-blue.jpg';

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