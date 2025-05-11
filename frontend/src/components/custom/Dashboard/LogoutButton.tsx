// components/LogoutButton.js (or .tsx)

"use client";

import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
    <Button
      variant="ghost"
      className="w-full justify-start font-normal"
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
}
