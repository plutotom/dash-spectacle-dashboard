import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// utils/formatDate.ts
export function formatDateToHumanReadable(date: Date): string {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize time to midnight
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0); // Normalize time to midnight

    const dayDifference = (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

    if (dayDifference === 0) {
        return 'Today';
    } else if (dayDifference === 1) {
        return 'Tomorrow';
    } else if (dayDifference < 7 && dayDifference > 1) {
        return `Next ${targetDate.toLocaleDateString(undefined, { weekday: 'long' })}`;
    } else {
        return targetDate.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
    }
}
