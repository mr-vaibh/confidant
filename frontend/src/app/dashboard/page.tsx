"use client";

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { useRouter } from "next/navigation";

import ManageSecrets from "@/components/custom/Dashboard/ManageSecrets";
import MonthlyUsage from "@/components/custom/Dashboard/MonthlyUsage";
import Announcements from "@/components/custom/Dashboard/Announcements";
import BillingOverview from "@/components/custom/Dashboard/BillingOverview";

// Define the user type
interface User {
  username: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: user, isLoading, error } = useSWR<User>("/auth/users/me", fetcher);

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
  if (error) return router.push("/login");

  return (
    <div className="w-full px-4 md:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Row */}
        <MonthlyUsage />
        <Announcements />

        {/* Second Row */}
        <BillingOverview />
        <ManageSecrets />
      </div>
    </div>
  );
}
