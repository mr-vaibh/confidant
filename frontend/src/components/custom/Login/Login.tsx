import Link from "next/link";

import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import LoginDialog from "@/components/custom/Login/LoginDialog";

export default function Login() {
  return (
    <LoginDialog>
      <DialogTrigger asChild>
        <Link href="login">
          <Button className="md:mr-2 mt-4 md:mt-0" variant="link">
            Log in
          </Button>
        </Link>
      </DialogTrigger>
    </LoginDialog>
  );
}
