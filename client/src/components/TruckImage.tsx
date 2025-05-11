import React from 'react';

interface TruckImageProps {
  className?: string;
  alt?: string;
}

export function TruckImage({ 
  className = "rounded-lg shadow-lg w-full h-auto", 
  alt = "Bezorgdienst in actie" 
}: TruckImageProps) {
  return (
    <img 
      src="/image_1746990792057.png" 
      alt={alt} 
      className={className} 
    />
  );
}