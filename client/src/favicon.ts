// Import the logo as a favicon
import logo from './assets/9f3fc153-6d70-4b48-84a7-435b5b7a50f8_removalai_preview.png';

// Create a link element
const link = document.createElement('link');
link.rel = 'icon';
link.href = logo;
link.type = 'image/png';

// Append to document head
document.head.appendChild(link);