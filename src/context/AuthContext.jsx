import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const API_BASE = 'http://localhost:8000/api/auth';

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const AuthContext = createContext(null);

// ---------------------------------------------------------------------------
// Helper — build headers with optional JWT bearer token
// ---------------------------------------------------------------------------
function authHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return headers;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(() => localStorage.getItem('access_token'));
  const [loading, setLoading] = useState(true);  // true while fetchMe() runs on mount
  const [error, setError]     = useState(null);

  /**
   * Fetch the current user's profile.
   * Called automatically on mount when a stored token exists.
   */
  const fetchMe = useCallback(async (accessToken) => {
    try {
      const res = await fetch(`${API_BASE}/me/`, {
        headers: authHeaders(accessToken),
      });
      if (!res.ok) throw new Error('Session expired');
      const data = await res.json();
      setUser(data.user);
    } catch {
      // Token is invalid or expired — clear the session
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setToken(null);
      setUser(null);
    }
  }, []);

  // On mount: if a token exists in localStorage, validate it by calling /me/
  useEffect(() => {
    if (token) {
      fetchMe(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [fetchMe, token]);

  /**
   * Register a new account.
   * Returns { success: true, user } on success or { success: false, message } on failure.
   */
  async function register(name, email, password, role = 'user', domain = null) {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, domain }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message || data.email?.[0] || 'Registration failed';
        setError(msg);
        return { success: false, message: msg };
      }
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setToken(data.access);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      const msg = 'Network error. Is the server running?';
      setError(msg);
      return { success: false, message: msg };
    }
  }

  /**
   * Log in with email + password.
   * Stores the JWT pair in localStorage and populates the user context.
   */
  async function login(email, password) {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        const msg = data.message || 'Login failed';
        setError(msg);
        return { success: false, message: msg };
      }
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      setToken(data.access);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch {
      const msg = 'Network error. Is the server running?';
      setError(msg);
      return { success: false, message: msg };
    }
  }

  /**
   * Log out: clear tokens from localStorage and reset context state.
   */
  function logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
    setError(null);
  }

  const value = {
    user,
    token,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export default AuthContext;
