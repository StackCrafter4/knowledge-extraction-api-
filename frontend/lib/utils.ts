// Utility functions

import { format, formatDistanceToNow, parseISO } from 'date-fns';

/**
 * Format date to readable string
 */
export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy');
}

/**
 * Format date and time to readable string
 */
export function formatDateTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM d, yyyy h:mm a');
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Get sentiment color class
 */
export function getSentimentColor(sentiment: string): string {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'negative':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'neutral':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

/**
 * Get sentiment badge variant
 */
export function getSentimentBadge(sentiment: string): string {
  switch (sentiment?.toLowerCase()) {
    case 'positive':
      return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    case 'negative':
      return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    case 'neutral':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200';
  }
}

/**
 * Get priority color
 */
export function getPriorityColor(priority?: string): string {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30';
    case 'medium':
      return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30';
    case 'low':
      return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30';
    default:
      return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700';
  }
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Highlight entities in text (returns HTML string)
 */
export function highlightEntities(
  text: string,
  entities: string[]
): string {
  if (!entities || entities.length === 0) return text;

  let highlightedText = text;
  entities.forEach((entity) => {
    // Escape special regex characters
    const escapedEntity = entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`\\b${escapedEntity}\\b`, 'gi');
    highlightedText = highlightedText.replace(
      regex,
      '<mark class="bg-yellow-200 px-1 rounded dark:bg-yellow-800">$&</mark>'
    );
  });

  return highlightedText;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

