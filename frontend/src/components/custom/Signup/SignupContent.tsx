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
    <div className="flex items-start justify-center min-w-[500px] min-h-[45vh] bg-background dark:bg-background-dark">
      <div className="w-full max-w-md p-8 bg-white dark:bg-black rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Let&apos;s get aboard!
        </h3>
        <form className="my-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <Label htmlFor="useremail" className="text-right">
              Email
            </Label>
            <Input
              type="email"
              id="useremail"
              placeholder="mail@example.com"
              {...register("email", { required: "Email is required" })}
              className="w-full p-2 mt-2 border dark:border-muted dark:bg-muted dark:text-muted-text focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark rounded-md"
            />
            {errors.email && (
              <span className="text-xs text-red-600">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••"
              className="w-full p-2 mt-2 border dark:border-muted dark:bg-muted dark:text-muted-text focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark rounded-md"
              {...register("password", { required: "Password is required" })}
            />
            {errors.password && (
              <span className="text-xs text-red-600">
                {errors.password.message}
              </span>
            )}
          </div>

          <div>
            <Label htmlFor="confirm-password" className="text-right">
              Confirm Password
            </Label>
            <Input
              type="password"
              id="confirm-password"
              placeholder="••••••••"
              className="w-full p-2 mt-2 border dark:border-muted dark:bg-muted dark:text-muted-text focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark rounded-md"
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

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-gray-600 hover:underline"
          >
            Already have an account? Login here.
          </Link>
        </div>
      </div>
    </div>
  );
}
