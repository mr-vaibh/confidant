"use client";

import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import Link from "next/link";

import SpinningLoader from "../SpinningLoader";

type FormData = {
  email: string;
  password: string;
  re_password: string;
};

export default function SignupContent() {
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const router = useRouter();

  const { register: registerUser } = AuthActions(); // Note: Renamed to avoid naming conflict with useForm's register

  const onSubmit = (data: FormData) => {
    registerUser(data.email, data.password, data.re_password)
      .then(() => {
        router.push("/login");
      })
      .catch((err) => {
        for (let key in err.response.data) {
          const typedKey = key as "email" | "password" | "re_password" | `root.${string}` | "root";
          setError(typedKey, { type: "manual", message: err.response.data[key][0] });
        }

        setError("root", { type: "manual", message: err.response.data.detail, });
      });
  };

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <SpinningLoader />;
  }

  return (
    <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="useremail" className="text-right">
          Email
        </Label>
        <Input type="email" id="useremail" placeholder="mail@example.com" className="col-span-3"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && (
          <span className="text-xs text-red-600">
            {errors.email.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="password" className="text-right">
          Password
        </Label>
        <Input type="password" id="password" placeholder="••••••••" className="col-span-3"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && (
          <span className="text-xs text-red-600">
            {errors.password.message}
          </span>
        )}
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="confirm-password" className="text-right">
          Confirm Password
        </Label>
        <Input type="password" id="confirm-password" placeholder="••••••••" className="col-span-3"
          {...register("re_password", { required: "Confirm Password is required" })}
        />
        {errors.re_password && (
          <span className="text-xs text-red-600">
            {errors.re_password.message}
          </span>
        )}
      </div>
      <div className="text-end">
        <Button type="submit">Get Started</Button>
      </div>
      {errors.root && (
        <span className="text-xs text-red-600">{errors.root.message}</span>
      )}
    </form>
  );
}
