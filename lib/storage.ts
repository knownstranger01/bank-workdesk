export const STORAGE_KEYS = {
  tasks: 'bank-workdesk.tasks',
  notes: 'bank-workdesk.notes',
  requirements: 'bank-workdesk.requirements',
  documents: 'bank-workdesk.documents',
  theme: 'bank-workdesk.theme',
} as const;

export function readStoredValue<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStoredValue<T>(key: string, value: T) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore LocalStorage quota or browser restrictions.
  }
}
