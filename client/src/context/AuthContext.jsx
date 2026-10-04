import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, getToken, setToken } from "../api.js";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!getToken());

  // restore the session on page load
  useEffect(() => {
    if (!getToken()) return;
    api.me()
      .then((d) => setUser(d.user))
      .catch(() => setToken(null))
      .finally(() => setLoading(false));
  }, []);

  const authenticate = useCallback(async (mode, form) => {
    const data = await (mode === "login" ? api.login(form) : api.register(form));
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, authenticate, logout }}>{children}</AuthContext.Provider>;
}
