import React from 'react';
import truckPath from '../assets/image_1746990792057.png';

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
      src={truckPath} 
      alt={alt} 
      className={className} 
    />
  );
}