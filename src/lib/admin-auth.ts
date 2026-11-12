'use client';

const SESSION_KEY = 'carryform-admin-session';

export function isDevelopmentAdminEnabled() {
  return process.env.NODE_ENV !== 'production';
}

export function authenticateAdmin(username: string, password: string) {
  if (!isDevelopmentAdminEnabled()) return false;
  const expectedUsername = process.env.NEXT_PUBLIC_CARRYFORM_ADMIN_USERNAME ?? 'admin';
  const expectedPassword = process.env.NEXT_PUBLIC_CARRYFORM_ADMIN_PASSWORD ?? 'admin';
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
