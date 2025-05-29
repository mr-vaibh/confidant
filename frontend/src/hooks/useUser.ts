// hooks/useUser.ts
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";

interface User {
  id: number;
  username: string;
  email: string;
}

export const useUser = () => {
  const { data, error, isLoading, mutate } = useSWR<User>("/auth/users/me", fetcher);

  return {
    user: data,
    isLoggedIn: !!data,
    isLoading,
    error,
    mutateUser: mutate, // for manual updates after login/logout
  };
};
