// components/LogoutButton.js (or .tsx)

"use client";

import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const { logout, removeTokens } = AuthActions();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
    } finally {
      removeTokens();
      router.push("/login");
    }
  };

  return (
    <span
      onClick={handleLogout}
      className="text-black cursor-pointer"
    >
      Logout
    </span>
  );
}
