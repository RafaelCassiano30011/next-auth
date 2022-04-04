import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { api } from "../services/api";

type User = {
  email: string;
  permission: string[];
  roles: string[];
};

type SingInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SingInCredentials) => Promise<void>;
  isAuthenticated: boolean;
  user: User;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export const signOut = () => {
  signOut();
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticated = !!user;

  useEffect(() => {
    const { "nextAuth.token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permission, roles } = response?.data;

          setUser({ email, permission, roles });
        })
        .catch((error) => {
          destroyCookie(undefined, "nextAuth.token");
          destroyCookie(undefined, "nextAuth.refreshToken");

          Router.push("/");
        });
    }
  }, []);

  const signIn = async ({ email, password }: SingInCredentials) => {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      const { refreshToken, token, permission, roles } = response.data;

      setCookie(undefined, "nextAuth.token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      setCookie(undefined, "nextAuth.refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });

      setUser({
        email,
        permission,
        roles,
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
};
