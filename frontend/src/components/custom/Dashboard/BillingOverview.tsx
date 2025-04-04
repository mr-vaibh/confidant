"use client"

import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard } from "lucide-react";
import { fetcher } from "@/app/fetcher";
import toast from "react-hot-toast";

interface BillingInfo {
    current_plan: string;
    plan_price: number;
    next_billing_date: string;
}

export default function MonthlyPerformance() {
    const [billingData, setBillingData] = useState<BillingInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function getBillingInfo() {
            try {
                const data = await fetcher<BillingInfo>("/billing-overview/");
                setBillingData(data);
            } catch (error) {
                toast.error("Failed to fetch billing details.");
            } finally {
                setLoading(false);
            }
        }
        getBillingInfo();
    }, []);

    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle>Billing Overview</CardTitle>
            </CardHeader>
            <CardContent>
                {(() => {
                    if (loading) {
                        return <p>Loading...</p>;
                    }
                    if (billingData) {
                        return (
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span>Current Plan</span>
                                    <Badge>{billingData.current_plan}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Next Billing Date</span>
                                    <span>{billingData.next_billing_date}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span>Plan Amount</span>
                                    <span className="font-semibold">${billingData.plan_price.toFixed(2)}</span>
                                </div>
                            </div>
                        );
                    }
                    return <p className="text-red-500">Billing info unavailable.</p>;
                })()}
            </CardContent>
            <CardFooter>
                <Button className="w-full">
                    <CreditCard className="mr-2 h-4 w-4" /> Manage Billing
                </Button>
            </CardFooter>
        </Card>
    );
}
