import { format, formatDistanceToNow } from 'date-fns';

/**
 * Formats a date to a readable string
 * @param date - Date to format
 * @param formatString - Format string (default: 'MMM dd, yyyy')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | number,
  formatString: string = 'MMM dd, yyyy'
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return format(dateObj, formatString);
}

/**
 * Formats a date to a relative time string (e.g., "2 hours ago")
 * @param date - Date to format
 * @returns Relative time string
 */
export function formatRelativeTime(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Formats a date for display in tables (shorter format)
 * @param date - Date to format
 * @returns Short formatted date string
 */
export function formatTableDate(date: Date | string | number): string {
  return formatDate(date, 'MMM dd, yyyy');
}

/**
 * Formats a date for display in cards (with relative time)
 * @param date - Date to format
 * @returns Formatted date with relative time
 */
export function formatCardDate(date: Date | string | number): string {
  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  return `${format(dateObj, 'MMM dd, yyyy')} (${formatRelativeTime(dateObj)})`;
}