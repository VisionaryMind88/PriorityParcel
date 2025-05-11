import React from 'react';
import truckImage from '../assets/truck.png';

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
      src={truckImage} 
      alt={alt} 
      className={className} 
    />
  );
}