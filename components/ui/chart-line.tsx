"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from "recharts"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/client"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const supabase = createClient()

interface WeightData {
  date: string
  weight: number
  created_at: string
}

interface WeightChartProps {
  title?: string
  description?: string
  showLabels?: boolean
  height?: number
  className?: string // Add className prop
}

const chartConfig = {
  weight: {
    label: "Weight",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function WeightChart({
  title = "Weight Progress",
  description = "Last 6 weight measurements",
  showLabels = true,
  height = 150,
  className, // Destructure className
}: WeightChartProps) {
  const [weightData, setWeightData] = useState<WeightData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchWeightData() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session?.user?.id) {
          setError("Not authenticated")
          return
        }

        const { data, error } = await supabase
          .from("user_measurements")
          .select("weight, created_at")
          .eq("user_id", session.user.id)
          .not("weight", "is", null)
          .order("created_at", { ascending: false })
          .limit(6)

        if (error) {
          setError(error.message)
          return
        }

        if (data && data.length > 0) {
          // Reverse to show chronological order and format dates
          const formattedData = data
            .reverse()
            .map((item) => ({
              date: new Date(item.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              weight: item.weight,
              created_at: item.created_at,
            }))
          setWeightData(formattedData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchWeightData()
  }, [])

  // Calculate trend
  const calculateTrend = () => {
    if (weightData.length < 2) return { trend: 0, isUp: false }

    const firstWeight = weightData[0].weight
    const lastWeight = weightData[weightData.length - 1].weight
    const change = lastWeight - firstWeight
    const percentChange = (change / firstWeight) * 100

    return {
      trend: Math.abs(percentChange),
      isUp: change > 0,
      change: Math.abs(change),
    }
  }

  const trendData = calculateTrend()

  if (loading) {
    return (
      <Card className="hover:shadow-md transition-all duration-200 border-0 shadow-sm bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading weight data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  if (weightData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">No weight data available</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-0 shadow-sm bg-card/50 backdrop-blur-sm"> {/* Apply className to Card */}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-auto w-full">
          <LineChart
            accessibilityLayer
            data={weightData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  formatter={(value) => [`${value} kg`, "Weight"]}
                />
              }
            />
            <Line
              dataKey="weight"
              type="monotone"
              stroke="var(--color-weight)"
              strokeWidth={2}
              dot={{
                fill: "var(--color-weight)",
                r: 4,
              }}
              activeDot={{
                r: 6,
              }}
            >
              {showLabels && (
                <LabelList
                  position="top"
                  offset={12}
                  className="fill-foreground"
                  fontSize={12}
                  formatter={(value: number) => `${value}kg`}
                />
              )}
            </Line>
          </LineChart>
        </ChartContainer>
      </CardContent>
      {weightData.length >= 2 && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 leading-none font-medium">
            {trendData.isUp ? (
              <>
                Weight increased by {(trendData.change ?? 0).toFixed(1)}kg (
                {(trendData.trend ?? 0).toFixed(1)}%)
                <TrendingUp className="h-4 w-4 text-red-500" />
              </>
            ) : (
              <>
                Weight decreased by {(trendData.change ?? 0).toFixed(1)}kg (
                {(trendData.trend ?? 0).toFixed(1)}%)
                <TrendingDown className="h-4 w-4 text-green-500" />
              </>
            )}
          </div>
          <div className="text-muted-foreground leading-none">
            Showing your last {weightData.length} weight measurements
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

// Legacy export for backward compatibility
export function ChartLineLabel() {
  return <WeightChart />
}
