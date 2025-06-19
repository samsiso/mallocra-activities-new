"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface BlogListSkeletonProps {
  count?: number
  featured?: boolean
}

export default function BlogListSkeleton({
  count = 6,
  featured = false
}: BlogListSkeletonProps) {
  return (
    <div
      className={`grid grid-cols-1 ${featured ? "lg:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3"} gap-8`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="h-full overflow-hidden rounded-lg bg-white shadow-md dark:bg-gray-800"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <Skeleton className="h-48 w-full" />

          <div className="p-5">
            <div className="mb-3 flex justify-between">
              <Skeleton className="h-4 w-24" />
              {featured && <Skeleton className="h-4 w-20" />}
            </div>

            <Skeleton className="mb-2 h-7 w-full" />
            {featured && <Skeleton className="mb-2 h-7 w-3/4" />}

            <div className="mb-4 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>

            <div className="mt-3 border-t border-gray-200 pt-3 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Skeleton className="mr-2 size-8 rounded-full" />
                  <Skeleton className="h-4 w-20" />
                </div>

                {featured ? (
                  <Skeleton className="mt-4 h-9 w-full" />
                ) : (
                  <Skeleton className="h-4 w-20" />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
