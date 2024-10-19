"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from "recharts"

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

export const description = "A bar chart With Total Sell"

const chartConfig = {
    product: {
        label: "total",
        color: "hsl(var(--chart-1))",
    },
    label: {
        color: "hsl(var(--background))",
    },
} satisfies ChartConfig

export function ChartComponent({ chartData, onSend }: { chartData: any, onSend?: any}) {
    const handleBarClick = (data: any) => {
        if(onSend) onSend(data);
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Products - Total Sell</CardTitle>
                <CardDescription>Total Sell of each products</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={chartData}
                        layout="vertical"
                        margin={{
                            right: 16,
                            bottom: 40,
                        }}
                    >
                        <CartesianGrid horizontal={false} />
                        <YAxis
                            dataKey="product"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            reversed={true}
                            label={{ value: "Product", angle: -90, position: "insideLeft", style: { fontSize: "16px", fill: "#10b981", fontWeight: "semibold"  }, }}
                            tickFormatter={(value) => value.slice(0, 3)}
                            
                        />
                        <XAxis type="number" dataKey="total" label={{ value: "Total Sell", position: "insideBottom", offset: -15, style: { fontSize: "16px", fill: "#10b981", fontWeight: "semibold"  } }} />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Bar
                            dataKey="total"
                            layout="vertical"
                            // fill="var(--color-product)"
                            fill={chartData.fill}
                            onClick={handleBarClick}
                            radius={4}
                        >
                            <LabelList
                                dataKey="total"
                                position="right"
                                offset={8}
                                className="fill-foreground"
                                fontSize={12}
                            />
                        </Bar>
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}