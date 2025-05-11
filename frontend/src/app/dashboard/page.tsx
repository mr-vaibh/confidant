"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/app/fetcher";
import useSWR from "swr";

import ManageSecrets from "@/components/custom/Dashboard/ManageSecrets";
import MonthlyUsage from "@/components/custom/Dashboard/MonthlyUsage";
import Notifications from "@/components/custom/Dashboard/Notifications";
import BillingOverview from "@/components/custom/Dashboard/BillingOverview";

// Define the user type
interface User {
  username: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: user, isLoading, error } = useSWR<User>("/auth/users/me", fetcher);

  // Redirect to login if there is an error fetching user data
  useEffect(() => {
    if (error) {
      router.push("/login");
    }
  }, [error, router]);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {user &&
          <>
            {/* First Row */}
            <MonthlyUsage />
            <Notifications username={user.username} />

            {/* Second Row */}
            <BillingOverview />
            <ManageSecrets />
          </>
        }
      </div>
    </div>
  );
}
