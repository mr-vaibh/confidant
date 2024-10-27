"use client";

import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import SpinningLoader from "../SpinningLoader";

type FormData = {
  email: string;
  password: string;
};

export default function LoginContent() {
  const [isLoaded, setIsLoaded] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<FormData>();

  const router = useRouter();

  const { login, storeToken } = AuthActions();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  if (!isLoaded) {
    return <SpinningLoader />;
  }

  const onSubmit = (data: FormData) => {
    login(data.email, data.password)
      .then((response) => {
        const json = response.data;
        storeToken(json.access, "access");
        storeToken(json.refresh, "refresh");

        router.push("dashboard");
      })
      .catch((err) => {
        // TODO: Handle error, it just has a key of 'message'
        // also do it for the signup form
        console.log(err);
        const errorData = err.response.data;
        // for (let key in errorData) {
        //   const typedKey = key as "email" | "password" | `root.${string}` | "root";
        //   setError(typedKey, { type: "manual", message: errorData[key][0] });
        // }

        setError("root", { type: "manual", message: errorData.detail });
      });
  };

  return (
    <div>
      <form className="grid gap-4 py-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="useremail" className="text-right">
            Email
          </Label>
          <Input type="email" id="useremail" placeholder="mail@example.com" className="col-span-3"
            {...register("email", { required: true })}
          />
          {errors.email && (
            <span className="text-xs text-red-600">Email is required</span>
          )}
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="password" className="text-right">
            Password
          </Label>
          <Input type="password" id="password" placeholder="••••••••" className="col-span-3" required
            {...register("password", { required: true })}
          />
          {errors.password && (
            <span className="text-xs text-red-600">Password is required</span>
          )}
        </div>
        <div className="text-end">
          <Button type="submit">Login</Button>
        </div>
        {errors.root && (
          <span className="text-xs text-red-600">{errors.root.message}</span>
        )}
      </form>
      <div className="text-center">
        <Link
          href="/auth/password/reset-password"
          className="text-sm text-blue-600 hover:underline"
        >
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
