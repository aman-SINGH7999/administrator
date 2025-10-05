import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function checkRole(role: string | null, allowed: string[]) {
  return role && allowed.includes(role);
}
