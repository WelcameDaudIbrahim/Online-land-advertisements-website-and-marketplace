"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
const chartConfig = {
  posts: {
    label: "Posts",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function PostByTime({
  data,
}: {
  data: {
    month: string;
    posts: number;
  }[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Post By Month of {new Date().getFullYear()}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Area
              dataKey="posts"
              type="natural"
              fill="var(--color-posts)"
              fillOpacity={0.4}
              stroke="var(--color-posts)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
