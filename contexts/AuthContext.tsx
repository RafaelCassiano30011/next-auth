import Router from "next/router";
import { createContext, ReactNode, useEffect, useState } from "react";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import { api } from "../services/apiClient";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SingInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn: (credentials: SingInCredentials) => Promise<void>;
  signOut: () => void;
  isAuthenticated: boolean;
  user: User;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel;

export const signOut = () => {
  destroyCookie(undefined, "nextAuth.token");
  destroyCookie(undefined, "nextAuth.refreshToken");

  authChannel?.postMessage(`signOut`);

  Router.push("/");
};
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User>({} as User);
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel("auth");

    authChannel.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          signOut();
          break;
        default:
          break;
      }
    };
  });

  useEffect(() => {
    const { "nextAuth.token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response?.data;

          setUser({ email, permissions, roles });
        })
        .catch((error) => {
          signOut();
        });
    }
  }, []);

  const signIn = async ({ email, password }: SingInCredentials) => {
    try {
      const response = await api.post("sessions", {
        email,
        password,
      });

      const { refreshToken, token, permissions, roles } = response.data;

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
        permissions,
        roles,
      });

      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      Router.push("/dashboard");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
