import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—';
  return new Intl.DateTimeFormat('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function timeAgo(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: [number, string][] = [
    [31536000, 'سنة'],
    [2592000, 'شهر'],
    [86400, 'يوم'],
    [3600, 'ساعة'],
    [60, 'دقيقة'],
  ];
  for (const [secs, label] of intervals) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `منذ ${count} ${label}`;
  }
  return 'الآن';
}

export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^؀-ۿ\w-]+/g, '')
    .replace(/-+/g, '-');
}

export function initials(name?: string | null): string {
  if (!name) return '؟';
  const parts = name.trim().split(/\s+/);
  return parts.slice(0, 2).map((p) => p[0]).join('');
}
