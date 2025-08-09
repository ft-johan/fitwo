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
    "flex flex-col min-h-[100px] sm:min-h-[120px] lg:min-h-[140px]",
    className
  )}>
    <CardHeader className="pb-2 sm:pb-3 space-y-0 flex-shrink-0">
      <div className="flex items-center justify-between">
        <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground tracking-wide uppercase line-clamp-1">
          {title}
        </CardTitle>
        {icon && (
          <div className="p-1 sm:p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </CardHeader>
    
    <CardContent className="flex-1 pt-0 space-y-2 sm:space-y-3 flex flex-col justify-between">
      <div className="flex items-baseline gap-1 sm:gap-2">
        <div className="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight line-clamp-1 break-all">
          {value}
        </div>
        {trend && (
          <div className={cn(
            "text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full flex-shrink-0",
            trend.isUp 
              ? "text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30" 
              : "text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30"
          )}>
            {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      {progressValue !== undefined && (
        <div className="space-y-1.5 sm:space-y-2">
          <Progress 
            value={progressValue} 
            className="h-1.5 sm:h-2 bg-muted/50" 
          />
          <div className="text-xs text-muted-foreground text-right">
            {progressValue.toFixed(0)}%
          </div>
        </div>
      )}
      
      {description && (
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mt-auto">
          {description}
        </p>
      )}
    </CardContent>
  </Card>
);

// Mobile-optimized compact version
export const CompactMetricCard = ({ 
  title, 
  value, 
  description, 
  className,
  icon
}: Omit<MetricCardProps, 'progressValue' | 'trend'>) => (
  <Card className={cn(
    "p-2 sm:p-3 lg:p-4 hover:shadow-sm transition-all duration-200 border-0 bg-card/30",
    "min-h-[80px] sm:min-h-[100px]",
    className
  )}>
    <div className="flex items-center justify-between mb-1.5 sm:mb-2">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider line-clamp-1">
        {title}
      </p>
      {icon && (
        <div className="text-muted-foreground/60 flex-shrink-0">
          {icon}
        </div>
      )}
    </div>
    
    <div className="space-y-0.5 sm:space-y-1">
      <p className="text-base sm:text-lg lg:text-xl font-bold tracking-tight line-clamp-1 break-all">
        {value}
      </p>
      {description && (
        <p className="text-xs text-muted-foreground line-clamp-1">
          {description}
        </p>
      )}
    </div>
  </Card>
);

// Mobile-responsive stats card
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
    "min-h-[100px] sm:min-h-[120px]",
    className
  )}>
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    
    <CardContent className="relative p-3 sm:p-4 lg:p-6">
      <div className="flex flex-col space-y-2 sm:space-y-3">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest line-clamp-1">
          {title}
        </p>
        
        <div className="flex items-end justify-between gap-2">
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight line-clamp-1 break-all min-w-0">
            {value}
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-0.5 sm:gap-1 text-xs font-medium flex-shrink-0",
              trend.isUp ? "text-green-600" : "text-red-600"
            )}>
              <span>{trend.isUp ? "↗" : "↘"}</span>
              <span className="hidden xs:inline">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-xs text-muted-foreground/80 line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </CardContent>
  </Card>
);

// Extra mobile-optimized mini card for space-constrained layouts
export const MiniMetricCard = ({ 
  title, 
  value, 
  className,
  icon
}: Pick<MetricCardProps, 'title' | 'value' | 'className' | 'icon'>) => (
  <Card className={cn(
    "p-2 sm:p-3 hover:shadow-sm transition-all duration-200 border-0 bg-card/30",
    "min-h-[60px] sm:min-h-[80px] flex items-center gap-2 sm:gap-3",
    className
  )}>
    {icon && (
      <div className="p-1.5 sm:p-2 rounded-lg bg-primary/10 text-primary flex-shrink-0">
        {icon}
      </div>
    )}
    <div className="min-w-0 flex-1">
      <p className="text-xs text-muted-foreground uppercase tracking-wider line-clamp-1 mb-0.5">
        {title}
      </p>
      <p className="text-sm sm:text-base font-bold tracking-tight line-clamp-1 break-all">
        {value}
      </p>
    </div>
  </Card>
);

// Responsive grid layout helper component
export const MetricCardGrid = ({ 
  children, 
  className 
}: { 
  children: React.ReactNode; 
  className?: string; 
}) => (
  <div className={cn(
    "grid gap-2 sm:gap-3 lg:gap-4",
    "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    "auto-rows-fr",
    className
  )}>
    {children}
  </div>
);