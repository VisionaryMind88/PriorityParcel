// Create a temporary favicon using a canvas element
const createTemporaryFavicon = (): string => {
  // Create canvas
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const ctx = canvas.getContext('2d');
  
  if (!ctx) return '';
  
  // Fill background
  ctx.fillStyle = '#0047AB'; // Primary blue color
  ctx.fillRect(0, 0, 32, 32);
  
  // Add text "P"
  ctx.fillStyle = 'white';
  ctx.font = 'bold 24px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', 16, 16);
  
  // Convert to data URL
  return canvas.toDataURL('image/png');
};

// Create a link element
const link = document.createElement('link');
link.rel = 'icon';
link.href = createTemporaryFavicon();
link.type = 'image/png';

// Append to document head
document.head.appendChild(link);
