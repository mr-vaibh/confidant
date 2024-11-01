"use client"

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";

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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Hi, {user?.username}!</h1>
        <p className="mb-4">Your account details:</p>
        <ul className="mb-4">
          <li>Username: {user?.username}</li>
          <li>Email: {user?.email}</li>
        </ul>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Disconnect
        </button>
      </div>
    </div>
  );
}
