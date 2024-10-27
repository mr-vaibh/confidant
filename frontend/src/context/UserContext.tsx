// context/UserContext.tsx
// "use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/app/fetcher';

interface User {
  id: number;
  username: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Create the UserContext
const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userState, setUserState] = useState<User | null>(null);
  const { data: user, error } = useSWR<User>('/auth/users/me', fetcher);

  useEffect(() => {
    if (error) {
      console.error("Error fetching user data:", error);
      setUserState(null);
    } else if (user !== undefined) {
      setUserState(user);
    }
  }, [user, error]);

  return (
    <UserContext.Provider value={{ user: userState, setUser: setUserState }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
