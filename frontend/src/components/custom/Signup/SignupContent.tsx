"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import SpinningLoader from "../SpinningLoader";

export default function SignupContent() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <SpinningLoader />;
  }
  
  return (
    <section className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="useremail" className="text-right">
          Email
        </Label>
        <Input type="email" id="useremail" placeholder="mail@example.com" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Password
        </Label>
        <Input type="password" id="password" placeholder="••••••••" className="col-span-3" />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="confirm-password" className="text-right">
          Confirm Password
        </Label>
        <Input type="password" id="confirm-password" placeholder="••••••••" className="col-span-3" />
      </div>
    </section>
  );
}
