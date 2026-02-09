import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function deviceType(width: number | undefined) {
  if (width === undefined) return undefined;
  if (width < 768) {
    return "mobile";
  } else if (width > 768) {
    return "desktop";
  }
}
