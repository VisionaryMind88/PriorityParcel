// This file contains type hacks that avoid TypeScript errors
// while still letting the code work at runtime.

declare global {
  interface User {
    role?: string;
  }
}

export {}
