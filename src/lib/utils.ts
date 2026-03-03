import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(iso: string, month: "short" | "long" = "short") {
    return new Date(iso).toLocaleDateString("en-GB", {
        day: "numeric",
        month,
        year: "numeric",
    })
}
