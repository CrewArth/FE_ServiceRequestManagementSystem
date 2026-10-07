import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { AuthResponse, User } from "../common/types/api.types";
import { authApi, session } from "../utils/api";

type AuthState = {
  user: User | null;
  loading: boolean;
  signIn: (result: AuthResponse) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session.get()) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => session.clear())
      .finally(() => setLoading(false));
  }, []);

  function signIn(result: AuthResponse) {
    session.set(result.token);
    setUser(result.user);
  }
  function signOut() {
    session.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const state = useContext(AuthContext);
  if (!state) throw new Error("AuthProvider is missing");
  return state;
}
