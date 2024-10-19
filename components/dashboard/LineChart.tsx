"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "A linear line chart shows the every day sale"

const chartConfig = {
    total: {
    label: "Total",
    color: "#10b981",
  },
} satisfies ChartConfig


interface LineChartData {
  date: string,
  total: string,
}

function getRoundedMax(data: { date: string, total: string }[]): number {
  const totals = data.map(item => Number(item.total));

  const maxTotal = Math.max(...totals);

  const remainder = maxTotal % 1000;

  if (remainder >= 500) {
    return Math.ceil(maxTotal / 1000) * 1000;
  } else {
    return Math.ceil(maxTotal / 500) * 500;
  }
}

function formatDate(dateStr: string): string {
  // Split the date string into parts (dd/mm/yyyy)
  const [day, month, year] = dateStr.split("/").map(Number);

  // Create a Date object from the parts
  const date = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript

  // Get the abbreviated month name
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short' };
  return date.toLocaleDateString('en-GB', options);
}

export function LineChartComponent({ chartData }: { chartData: LineChartData[] }) {
  const roundedMax = getRoundedMax(chartData);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Every Day Sell</CardTitle>
        <CardDescription>Total Sell of this product Every Day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
              bottom: 40,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => formatDate(value)}
              label={{ value: 'Date', position: 'bottom', offset: 5, style: { fontSize: "16px", fill: "#10b981", fontWeight: "semibold" } }}
            />
            <YAxis domain={[0,roundedMax]} 
             label={{ value: 'Total Sell Amount', angle: -90, position: 'insideLeft', offset: 10, style: { fontSize: "16px", fill: "#10b981", fontWeight: "semibold" } }}/>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey="total"
              type="linear"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}