import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [eventsEnabled, setEventsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const data = await apiFetch('/auth/me');
      setUser(data);
      setEventsEnabled(data.eventsEnabled ?? true);
    } catch {
      setUser(null);
      setEventsEnabled(true);
      localStorage.removeItem('token');
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  const login = async (username, password) => {
    const data = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    localStorage.setItem('token', data.token);
    await refreshUser();
    return data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setEventsEnabled(true);
  };

  return (
    <AuthContext.Provider value={{ user, loading, eventsEnabled, setEventsEnabled, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};