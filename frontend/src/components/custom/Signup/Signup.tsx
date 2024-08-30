import Link from "next/link";

import { DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import SignupDialog from "@/components/custom/Signup/SignupDialog";

export default function Signup() {
  return (
    <SignupDialog>
      <DialogTrigger asChild>
        <Link href="signup">
          <Button className="md:mr-2 mt-4 md:mt-0">
            Signup
          </Button>
        </Link>
      </DialogTrigger>
    </SignupDialog>
  );
}
