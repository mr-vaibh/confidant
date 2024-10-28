"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { fetcher } from "@/app/fetcher";

export default function ActivationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const { data, error } = useSWR(
    uid && token ? `/auth/users/activation/` : null,
    (url) => fetcher(url, 'POST', { uid, token })
  );

  useEffect(() => {
    if (data) {
      setStatus("Your account has been activated successfully!");
    } else if (error) {
      setStatus("An error occurred during activation.");
    }
  }, [data, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Account Activation</h1>
        {status && <p className="mb-4">{status}</p>}
        <button
          onClick={() => router.push("/login")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
