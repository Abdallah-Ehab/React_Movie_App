import { Skeleton } from '@/components/ui/skeleton'

export default function MovieCardSkeleton() {
  return (
    <div className="rounded-[19px] overflow-hidden shadow-md ring-1 ring-foreground/5">
      <Skeleton className="w-full aspect-[2/3] rounded-none" />
      <div className="p-3 pb-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}
