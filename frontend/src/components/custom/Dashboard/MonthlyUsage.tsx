"use client";

import { useState, useEffect } from "react";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { fetcher } from "@/app/fetcher";

// Utility to format month + year from raw date
const formatMonthYear = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
};

export default function MonthlyUsage() {
  const [data, setData] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetcher<{ monthly_usage_report: { name: string; value: number }[] }>("/monthly-usage/");
        setData(response.monthly_usage_report);
      } catch (err: any) {
        setError(err.message || "Failed to load data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const chartConfig = {
    apiUsage: {
      label: "API Usage",
      color: "hsl(var(--chart-1))",
      icon: Activity,
    },
  } satisfies ChartConfig;

  // Determine the number of months available
  const totalMonths = data.length;

  // Calculate percentage increase/decrease
  let usageText = "No data to compare";
  let usageIcon = null;

  if (totalMonths >= 2) {
    const latestValue = data[totalMonths - 1].value;
    const prevValue = data[totalMonths - 2].value;

    if (prevValue !== 0) {
      const changePercent = ((latestValue - prevValue) / prevValue) * 100;
      const isIncrease = changePercent > 0;

      usageText = `${isIncrease ? "Usage up" : "Usage down"} by ${Math.abs(changePercent.toFixed(2))}% last month`;
      usageIcon = isIncrease ? <TrendingUp className="h-4 w-4 text-green-500" /> : <TrendingDown className="h-4 w-4 text-red-500" />;
    }
  }

  return (
    <Card className="w-full max-h-[45vh] flex flex-col justify-between">
      <CardHeader className="flex-shrink-0">
        <CardTitle>Monthly API Usage</CardTitle>
        <CardDescription>
          Showing total API requests for these {totalMonths} months
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow min-h-0 overflow-hidden">
        {(() => {
          if (loading) {
            return <p className="text-gray-500">Loading...</p>;
          }
          if (error) {
            return <p className="text-red-500">{error}</p>;
          }
          return (
            <ChartContainer className="w-full h-full" config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ left: 12, right: 12 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={formatMonthYear} // Format X-axis labels
                  />
                  <YAxis />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="var(--color-apiUsage)"
                    fill="var(--color-apiUsage)"
                    fillOpacity={0.4}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          );
        })()}
      </CardContent>
      <CardFooter className="flex-shrink-0">
        <div className="flex w-full items-start gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              {usageText} {usageIcon}
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              Net {totalMonths} months usage
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
