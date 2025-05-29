import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { mutate } from "swr";

export default function LogoutButton() {
  const router = useRouter();
  const { logout, removeTokens } = AuthActions();

  const handleLogout = async () => {
    try {
      await logout(); // optional API logout call
    } catch (error) {
      console.error(error);
    } finally {
      removeTokens();              // clear tokens locally
      await mutate("/auth/users/me", null, false); // clear SWR user cache immediately
      router.push("/login");       // redirect to login page
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
