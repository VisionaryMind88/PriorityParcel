import React from 'react';
import logoPath from '../assets/logo-latest.png';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-14 md:h-20 w-auto" }: LogoProps) {
  return (
    <img 
      src={logoPath} 
      alt="PriorityParcel Logo" 
      className={className} 
      style={{ objectFit: 'contain', imageRendering: 'crisp-edges' }}
    />
  );
}