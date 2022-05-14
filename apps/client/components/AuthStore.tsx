import { createContext, useContext } from "react";
import useSWR from "swr";

const AuthContext = createContext(null);
const fetcher = (url: RequestInfo) => fetch(url).then((r) => r.json());

export function AuthWrapper({ children }) {
  const { data, error } = useSWR("/api/user", fetcher);

  return <AuthContext.Provider value={{ data, error }}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
