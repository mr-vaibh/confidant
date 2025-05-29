"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = {
  monthly: [
    {
      name: "Free",
      price: "0",
      features: [
        "Up to 3 projects",
        "Basic encryption",
        "Community support",
      ],
    },
    {
      name: "Pro",
      price: "9",
      features: [
        "Unlimited projects",
        "End-to-end encryption",
        "CLI & SDK access",
        "Priority support",
      ],
    },
    {
      name: "Team",
      price: "29",
      features: [
        "Unlimited projects",
        "Team access control",
        "Audit logs",
        "Custom domain",
        "Email support",
      ],
    },
  ],
  yearly: [
    {
      name: "Free",
      price: "0",
      features: [
        "Up to 3 projects",
        "Basic encryption",
        "Community support",
      ],
    },
    {
      name: "Pro",
      price: "90", // $7.5/mo
      features: [
        "Unlimited projects",
        "End-to-end encryption",
        "CLI & SDK access",
        "Priority support",
      ],
    },
    {
      name: "Team",
      price: "290", // $24.1/mo
      features: [
        "Unlimited projects",
        "Team access control",
        "Audit logs",
        "Custom domain",
        "Email support",
      ],
    },
  ],
};

export function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const currentPlans = isYearly ? plans.yearly : plans.monthly;

  return (
    <section className="py-20">
      <div className="container text-center mb-12">
        <h2 className="text-4xl font-bold mb-2">Simple, Transparent Pricing</h2>
        <p className="text-muted-foreground">No hidden fees. Choose what fits your team.</p>
        <div className="mt-6 flex justify-center items-center gap-4 relative">
          <span className="text-sm font-medium">Monthly</span>
          <Switch checked={isYearly} onCheckedChange={setIsYearly} />
          <span className="text-sm font-medium">Yearly</span>

          {/* Always reserve space, show only when yearly is true */}
          <span
            className={`absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm font-semibold text-green-600 transition-opacity duration-300 ${isYearly ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            style={{ minHeight: "1rem" }}
          >
            Save up to 20%
          </span>
        </div>

      </div>

      <div className="grid gap-6 px-6 md:grid-cols-3 max-w-6xl mx-auto">
        {currentPlans.map((plan) => (
          <Card key={plan.name} className="rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">{plan.name}</CardTitle>
              <div className="text-center mt-4">
                <span className="text-4xl font-bold">${plan.price}</span>
                {plan.price !== "0" && (
                  <span className="text-sm text-muted-foreground">
                    /{isYearly ? "year" : "month"}
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 mt-2 flex-1">
              <ul className="text-left space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm">
                    ✅ {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-auto rounded-xl" variant={plan.name === "Pro" ? "default" : "secondary"}>
                {plan.name === "Free" ? "Start for Free" : "Get Started"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
