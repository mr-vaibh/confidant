"use client"

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return router.push("/login");

  return (
    <Usage />
  );
}
