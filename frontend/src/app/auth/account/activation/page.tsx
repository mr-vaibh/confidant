"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetcher } from "@/app/fetcher"; // Adjust the import path as necessary

interface ActivationData {
  uid: string | null;
  token: string | null;
}

export default function ActivationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  useEffect(() => {
    const activationData: ActivationData = { uid, token };

    const activate = async () => {
      if (!uid || !token) {
        setError("Invalid activation link.");
        setLoading(false);
        return;
      }

      try {
        await fetcher('/auth/users/activation/', 'POST', activationData);
        setStatus("Your account has been activated successfully!");
      } catch (error) {
        setError("An error occurred during activation.");
      } finally {
        setLoading(false);
      }
    };

    activate();
  }, [uid, token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Account Activation</h1>
        {loading && <p className="mb-4">Activating your account...</p>}
        {error && <p className="mb-4 text-red-500">{error}</p>}
        {status && <p className="mb-4 text-green-500">{status}</p>}
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
