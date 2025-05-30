"use client";

import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/auth/utils";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import SpinningLoader from "../SpinningLoader";
import { useUser } from '@/hooks/useUser';

type FormData = {
  email: string;
  password: string;
};

export default function LoginContent() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { mutateUser } = useUser();

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
    setIsLoading(true);

    login(data.email, data.password)
      .then(async (response) => {
        const json = response.data;

        await Promise.all([
          storeToken(json.access, "access"),
          storeToken(json.refresh, "refresh"),
        ]);

        // Revalidate user data via SWR mutate
        await mutateUser();

        router.push("/dashboard");
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err.message === "Network Error"
            ? "Network Error. Please check your connection."
            : "Login failed. Please check your credentials."
        );
        setError("root", { type: "manual", message: err.message ?? "Login failed" });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="flex items-start justify-center min-w-[500px] min-h-[45vh] bg-background dark:bg-background-dark">
      <div className="w-full max-w-md p-8 bg-white dark:bg-black rounded-lg shadow-lg">
        <h3 className="text-2xl font-semibold mb-6 text-gray-800">
          Welcome Back!
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
              {...register("email", { required: true })}
              className="w-full p-2 mt-2 border dark:border-muted dark:bg-muted dark:text-muted-text focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark rounded-md"
            />
            {errors.email && (
              <span className="text-xs text-red-600">Email is required</span>
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
              className="col-span-3"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <span className="text-xs text-red-600">Password is required</span>
            )}
          </div>

          <div className="text-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Logging In..." : "Login"}
            </Button>
          </div>

          {errors.root && (
            <span className="text-xs text-red-600">{errors.root.message}</span>
          )}
        </form>

        <div className="text-center">
          <Link
            href="/auth/password/reset-password"
            className="text-sm text-gray-600 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <div className="text-center">
          <Link
            href="/signup"
            className="text-sm text-gray-600 hover:underline"
          >
            Don&apos;t have an account? Sign up here.
          </Link>
        </div>
      </div>
    </div>
  );
}
