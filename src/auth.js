// src/auth.js
const TOKEN_KEY = "quotes_app_token";
const USER_KEY = "quotes_app_user";

export function setToken(token, user) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  if (user) localStorage.setItem(USER_KEY, JSON.stringify(user));
}
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}
export function getUser() {
  const t = localStorage.getItem(USER_KEY);
  try {
    return t ? JSON.parse(t) : null;
  } catch {
    return null;
  }
}
export function isLoggedIn() {
  return !!getToken();
}

// read VITE_API_BASE at build time
const RAW_API_BASE = import.meta.env.VITE_API_BASE || "";
// normalize: remove trailing slash if given
const API_BASE = RAW_API_BASE.replace(/\/$/, "");

// debug: shows what the bundle captured from Vercel build
console.log("VITE_API_BASE (runtime):", API_BASE);

export async function authFetch(url, opts = {}) {
  const token = getToken();
  const headers = opts.headers ? { ...opts.headers } : {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
  const options = { ...opts, headers };

  // build fullUrl robustly:
  // - if url already absolute (http(s)://) use as-is
  // - else join API_BASE + url taking care of slashes
  let fullUrl;
  if (/^https?:\/\//i.test(url)) {
    fullUrl = url;
  } else {
    // make sure url begins with a single slash
    const path = url.startsWith("/") ? url : `/${url}`;
    fullUrl = API_BASE ? `${API_BASE}${path}` : path;
  }

  const res = await fetch(fullUrl, options);
  return res;
}
