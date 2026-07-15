interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: Readonly<SkeletonProps>) {
  return (
    <div className={`animate-shimmer rounded-lg ${className}`} />
  );
}

export function TaskCardSkeleton() {
  return (
    <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl border border-gray-700/50 bg-gray-800/30">
      <div className="shrink-0 mt-1 w-6 h-6 rounded-full bg-gray-700 animate-pulse-soft" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-3 w-4/5" />
        <div className="flex gap-2 pt-1">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-16" />
      </div>
    </div>
  );
}

export function TagCardSkeleton() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30">
      <Skeleton className="w-4 h-4 rounded-full" />
      <Skeleton className="h-4 w-24" />
      <div className="ml-auto flex gap-2">
        <Skeleton className="h-6 w-14" />
        <Skeleton className="h-6 w-14" />
      </div>
    </div>
  );
}

export function DashboardCardSkeleton() {
  return (
    <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
      <Skeleton className="h-3 w-24 mb-3" />
      <Skeleton className="h-9 w-16" />
    </div>
  );
}
