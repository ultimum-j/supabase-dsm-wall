'use client';

const SESSION_KEY = 'dsm_user_id';

export function setSession(userId: string) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, userId);
  }
}

export function getSession(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(SESSION_KEY);
  }
  return null;
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(SESSION_KEY);
  }
}
