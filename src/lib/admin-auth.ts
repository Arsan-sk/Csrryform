'use client';

const SESSION_KEY = 'carryform-admin-session';

export function isDevelopmentAdminEnabled() {
  return process.env.NODE_ENV !== 'production';
}

export function authenticateAdmin(username: string, password: string) {
  // Auth works in any environment as long as the admin credentials env vars are set.
  // In production without credentials configured, reject instead of silently failing.
  const expectedUsername = process.env.NEXT_PUBLIC_CARRYFORM_ADMIN_USERNAME;
  const expectedPassword = process.env.NEXT_PUBLIC_CARRYFORM_ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) return false;
  return username === expectedUsername && password === expectedPassword;
}

export function setAdminSession() {
  window.sessionStorage.setItem(SESSION_KEY, 'development-session');
}

export function hasAdminSession() {
  return window.sessionStorage.getItem(SESSION_KEY) === 'development-session';
}

export function clearAdminSession() {
  window.sessionStorage.removeItem(SESSION_KEY);
}