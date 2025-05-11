import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("nl-NL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const formatPhoneNumber = (phoneNumber: string): string => {
  // Basic Dutch phone number formatting
  if (!phoneNumber) return "";
  
  // Remove all non-digit characters
  const cleaned = phoneNumber.replace(/\D/g, "");
  
  // Format based on number length
  if (cleaned.length === 10) {
    // Regular Dutch number 0612345678 -> 06 12345678
    return cleaned.replace(/(\d{2})(\d{8})/, "$1 $2");
  } else if (cleaned.length === 11 && cleaned.startsWith("31")) {
    // International Dutch number +31612345678 -> +31 6 12345678
    return `+${cleaned.replace(/(\d{2})(\d{1})(\d{8})/, "$1 $2 $3")}`;
  }
  
  // Return original if it doesn't match expected formats
  return phoneNumber;
};

export const validateEmail = (email: string): boolean => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email);
};
