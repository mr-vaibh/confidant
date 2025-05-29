// context/UserContext.tsx

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/app/fetcher';
import publicPaths from "@/publicPaths";

export interface User {
  id: number;
  username: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<User | null>(null);

  // Determine if the current path is a public path
  const isPublicPath = typeof window !== "undefined" && publicPaths.includes(window.location.pathname);

  // Use SWR only if it's NOT a public path
  const { data: user, error } = useSWR<User>(
    !isPublicPath ? '/auth/users/me' : null,
    fetcher
  );

  useEffect(() => {
    if (isPublicPath) {
      setUserState(null); // or {} if you prefer empty object
    } else if (error) {
      console.error("Error fetching user data:", error);
      setUserState(null);
    } else if (user !== undefined) {
      setUserState(user);
    }
  }, [user, error, isPublicPath]);

  const contextValue = React.useMemo(
    () => ({ user: userState, setUser: setUserState }),
    [userState]
  );

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
