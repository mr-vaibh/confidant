import React, { createContext, useContext, ReactNode } from 'react';
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
  mutateUser: () => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isPublicPath =
    typeof window !== "undefined" && publicPaths.includes(window.location.pathname);

  const { data: user, error, mutate } = useSWR<User>(
    !isPublicPath ? '/auth/users/me' : null,
    fetcher
  );

  const contextValue: UserContextType = {
    user: user || null,
    mutateUser: () => mutate(),
  };

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
