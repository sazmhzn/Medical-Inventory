// src/utils/AuthProvider.tsx
import { createContext, useContext, useEffect, useCallback } from "react";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { authKeys } from "@/services/authApi";
import { User } from "types/auth";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  getCredentials: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/", "/about", "/services", "/login", "/register"];

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();

  const { data: user, isLoading } = useQuery({
    queryKey: authKeys.user(),
    queryFn: () => {
      const savedUser = localStorage.getItem("user");
      if (!savedUser) return null;
      return JSON.parse(savedUser) as User;
    },
    staleTime: Infinity,
  });

  const login = useCallback(
    (userData: User) => {
      localStorage.setItem("user", JSON.stringify(userData));
      queryClient.setQueryData(authKeys.user(), userData);
    },
    [queryClient]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    queryClient.setQueryData(authKeys.user(), null);
    queryClient.clear();
    navigate("/login");
  }, [queryClient, navigate]);

  const getCredentials = useCallback(() => {
    return user?.bota || null;
  }, [user]);

  useEffect(() => {
    const isPublicRoute =
      PUBLIC_ROUTES.includes(location.pathname) ||
      location.pathname.startsWith("/auth/");

    if (!isLoading) {
      if (!user && !isPublicRoute) {
        navigate("/login", {
          state: { from: location.pathname },
          replace: true,
        });
      } else if (user && location.pathname === "/login") {
        const intendedPath = location.state?.from || "/admin";
        navigate(intendedPath);
      }
    }
  }, [user, isLoading, location, navigate]);

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        getCredentials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuthState = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthState must be used within an AuthProvider");
  }
  return context;
};
