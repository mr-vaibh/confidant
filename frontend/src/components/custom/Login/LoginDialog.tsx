"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

import { Dialog } from "@/components/ui/dialog";
import LoginModal from "./LoginModal";

export default function LoginDialog({
  children,
}: Readonly<{ children?: ReactNode }>) {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      {children}
      <LoginModal />
    </Dialog>
  );
}
