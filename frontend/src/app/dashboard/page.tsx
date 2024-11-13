"use client"

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";
import Usage from "@/components/ui/Usage";

// Define the user type
interface User {
  username: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: user, isLoading, error } = useSWR<User>("/auth/users/me", fetcher); // Specify the type here

  const { logout, removeTokens } = AuthActions();

  const handleLogout = () => {
    logout()
      .then(() => {
        removeTokens();
        router.push("/login");
      })
      .catch(() => {
        removeTokens();
        router.push("/login");
      });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading user data.</div>;

  return (
    <>
      <div>
        <Usage />
      </div>
    </>
  );
}
