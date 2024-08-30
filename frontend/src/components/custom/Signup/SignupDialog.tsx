"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Dialog } from "@/components/ui/dialog";
import SignupModal from "./SignupModal";

export default function SignupDialog({
  children,
}: Readonly<{ children?: ReactNode }>) {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      {children}
      <SignupModal />
    </Dialog>
  );
}
