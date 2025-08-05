import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  description?: string;
  progressValue?: number;
  className?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isUp: boolean;
  };
}

export const MetricCard = ({ 
  title, 
  value, 
  description, 
  progressValue, 
  className,
  icon,
  trend
}: MetricCardProps) => (
  <Card className={cn(
    "group hover:shadow-md transition-all duration-200 border-0 shadow-sm bg-card/50 backdrop-blur-sm",
    "h-fit min-h-[140px] flex flex-col",
    className
  )}>
    <CardHeader className="pb-3 space-y-0">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
          {title}
        </CardTitle>
        {icon && (
          <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
        )}
      </div>
    </CardHeader>
    
    <CardContent className="flex-1 pt-0 space-y-3">
      <div className="flex items-baseline gap-2">
        <div className="text-2xl font-bold tracking-tight">
          {value}
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-medium px-2 py-1 rounded-full",
            trend.isUp 
              ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30" 
              : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
          )}>
            {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      {progressValue !== undefined && (
        <div className="space-y-2">
          <Progress 
            value={progressValue} 
            className="h-2 bg-muted/50" 
          />
          <div className="text-xs text-muted-foreground text-right">
            {progressValue.toFixed(0)}%
          </div>
        </div>
      )}
      
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed">
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

// Alternative compact version
export const CompactMetricCard = ({ 
  title, 
  value, 
  description, 
  className,
  icon
}: Omit<MetricCardProps, 'progressValue' | 'trend'>) => (
  <Card className={cn(
    "p-4 hover:shadow-sm transition-all duration-200 border-0 bg-card/30",
    "h-fit min-h-[100px]",
    className
  )}>
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {title}
      </p>
      {icon && (
        <div className="text-muted-foreground/60">
          {icon}
        </div>
      )}
    </div>
    
    <div className="space-y-1">
      <p className="text-xl font-bold tracking-tight">
        {value}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  </Card>
);

// Stats card for key metrics
export const StatsCard = ({ 
  title, 
  value, 
  description, 
  className,
  trend
}: Omit<MetricCardProps, 'progressValue' | 'icon'>) => (
  <Card className={cn(
    "relative overflow-hidden border-0 bg-gradient-to-br from-card to-card/50",
    "hover:shadow-lg transition-all duration-300 group",
    "h-fit min-h-[120px]",
    className
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <CardContent className="relative p-6">
      <div className="flex flex-col space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
          {title}
        </p>
        
        <div className="flex items-end justify-between">
          <div className="text-3xl font-bold tracking-tight">
            {value}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.isUp ? "text-green-600" : "text-red-600"
            )}>
              <span>{trend.isUp ? "↗" : "↘"}</span>
              {Math.abs(trend.value)}%
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground/80">
            {description}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);