"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts"

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Replace the BodyCompositionChart with a stacked bar chart
export function BodyCompositionChart({
  weight,
  bodyFatPercentage,
  className
}: {
  weight: number | null
  bodyFatPercentage: number | null
  className?: string
}) {
  if (!weight || !bodyFatPercentage) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle>Body Composition</CardTitle>
          <CardDescription>Lean vs Fat Mass</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center pb-0 h-[150px] sm:h-[200px] lg:h-[250px]">
          <div className="text-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate fat mass and lean body mass
  const fatMass = (weight * bodyFatPercentage) / 100
  const leanMass = weight - fatMass

  const chartData = [
    {
      category: "Body",
      lean: Math.round(leanMass * 10) / 10,
      fat: Math.round(fatMass * 10) / 10,
    }
  ]

  const chartConfig = {
    lean: {
      label: "Lean Mass",
      color: "var(--chart-2)",
    },
    fat: {
      label: "Fat Mass",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Body Composition</CardTitle>
        <CardDescription>Lean vs Fat Mass Distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip 
              content={<ChartTooltipContent hideLabel />} 
              formatter={(value, name) => [`${value}kg`, name]}
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="lean"
              stackId="a"
              fill="var(--color-lean)"
              radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="fat"
              stackId="a"
              fill="var(--color-fat)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Body Fat: {bodyFatPercentage}%
        </div>
        <div className="text-muted-foreground leading-none">
          {leanMass.toFixed(1)}kg lean mass, {fatMass.toFixed(1)}kg fat mass
        </div>
      </CardFooter>
    </Card>
  )
}

// Keep the existing RadialChart and BMIChart components as they are
type RadialChartProps = {
  title?: string
  description?: string
  data: Array<Record<string, number>>
  config: ChartConfig
  centerLabel?: { value: string | number, label: string }
  trend?: { value: number, isUp: boolean, period: string }
  endAngle?: number
  innerRadius?: number
  outerRadius?: number
  className?: string
  showFooter?: boolean
  footerText?: string
}

export function RadialChart({
  title = "Radial Chart",
  description,
  data,
  config,
  centerLabel,
  trend,
  endAngle = 100,
  innerRadius = 90,
  outerRadius = 120,
  className,
  showFooter = false,
  footerText
}: RadialChartProps) {
  // Calculate total if centerLabel is not provided
  const calculateTotal = () => {
    if (centerLabel) return centerLabel
    
    const total = data[0] ? Object.values(data[0]).reduce((sum, value) => {
      return typeof value === 'number' && typeof sum === 'number' ? sum + value : sum
    }, 0) : 0
    
    return {
      value: total,
      label: "Total"
    }
  }

  const displayLabel = calculateTotal()

  return (
    <Card className={`flex flex-col ${className || ''}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={config}
          className={`mx-auto w-full h-[150px] sm:h-[200px] lg:h-[250px] ${className || ''}`}
        >
          <RadialBarChart
            data={data}
            endAngle={endAngle}
            innerRadius={innerRadius}
            outerRadius={outerRadius}
            className="h-[100px]"
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {typeof displayLabel.value === 'number' 
                            ? displayLabel.value.toLocaleString() 
                            : displayLabel.value}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          {displayLabel.label}
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </PolarRadiusAxis>
            {Object.keys(config).map((key, index) => (
              <RadialBar
                key={key}
                dataKey={key}
                stackId="a"
                cornerRadius={2}
                fill={`var(--color-${key})`}
                className="stroke-transparent stroke-2"
              />
            ))}
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      {showFooter && (
        <CardFooter className="flex-col gap-2 text-sm">
          {trend && (
            <div className="flex items-center gap-2 leading-none font-medium">
              Trending {trend.isUp ? 'up' : 'down'} by {Math.abs(trend.value)}% {trend.period}
              {trend.isUp ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </div>
          )}
          {footerText && (
            <div className="text-muted-foreground leading-none">
              {footerText}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

// Keep the BMIChart as radial chart
export function BMIChart({
  bmi,
  bmiStatus,
  className
}: {
  bmi: number | null
  bmiStatus: string | null
  className?: string
}) {
  if (!bmi) {
    return (
      <Card className={className}>
        <CardHeader className="items-center pb-0">
          <CardTitle>BMI Status</CardTitle>
          <CardDescription>Body Mass Index</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 items-center pb-0">
          <div className="text-center text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    )
  }

  // Calculate BMI ranges for visualization
  const maxBMI = 40 // Max range for chart
  const currentBMI = Math.min(bmi, maxBMI)
  const remainingBMI = maxBMI - currentBMI

  const chartData = [{ 
    current: currentBMI,
    remaining: remainingBMI
  }]

  // Color based on BMI category
  let bmiColor = "var(--chart-2)" // Normal - green
  if (bmi < 18.5) bmiColor = "var(--chart-4)" // Underweight - blue
  else if (bmi >= 25 && bmi < 30) bmiColor = "var(--chart-3)" // Overweight - yellow
  else if (bmi >= 30) bmiColor = "var(--chart-1)" // Obese - red

  const chartConfig = {
    current: {
      label: "Current BMI",
      color: bmiColor,
    },
    remaining: {
      label: "Range",
      color: "var(--muted)",
    },
  } satisfies ChartConfig

  return (
    <RadialChart
      title="BMI Status"
      description="Body Mass Index"
      data={chartData}
      config={chartConfig}
      centerLabel={{
        value: bmi.toFixed(1),
        label: "BMI"
      }}
      footerText={bmiStatus || ""}
      className={className}
      endAngle={270}
      showFooter={true}
    />
  )
}

// Example usage component
export function RadialChartExample() {
  const chartData = [{ desktop: 1260, mobile: 570 }]
  
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "var(--chart-1)",
    },
    mobile: {
      label: "Mobile",
      color: "var(--chart-2)",
    },
  } satisfies ChartConfig

  return (
    <RadialChart
      title="Visitor Statistics"
      description="January - June 2024"
      data={chartData}
      config={chartConfig}
      centerLabel={{
        value: chartData[0].desktop + chartData[0].mobile,
        label: "Visitors"
      }}
      trend={{
        value: 5.2,
        isUp: true,
        period: "this month"
      }}
      footerText="Showing total visitors for the last 6 months"
    />
  )
}
