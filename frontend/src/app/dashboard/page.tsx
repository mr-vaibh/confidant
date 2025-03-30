"use client"

import useSWR from "swr";
import { fetcher } from "@/app/fetcher";
import { useRouter } from "next/navigation";

import ManageSecrets from "@/components/custom/Dashboard/ManageSecrets";
import MonthlyPerformance from "@/components/custom/Dashboard/MonthlyPerformance";
import Announcements from "@/components/custom/Dashboard/Announcements";
import BillingOverview from "@/components/custom/Dashboard/BillingOverview";

// Define the user type
interface User {
  username: string;
  email: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { data: user, isLoading, error } = useSWR<User>("/auth/users/me", fetcher); // Specify the type here

  if (isLoading) return <div>Loading...</div>;
  if (error) return router.push("/login");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* First Row */}
      <MonthlyPerformance />
      <Announcements />

      {/* Second Row */}
      <BillingOverview />
      <ManageSecrets />
    </div>
  );
}
