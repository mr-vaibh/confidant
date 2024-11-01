"use client";

import { Suspense } from "react";
import ResetPasswordConfirmation from "@/components/custom/ResetPasswordConfirmation";

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main>
        <ResetPasswordConfirmation />
      </main>
    </Suspense>
  );
}