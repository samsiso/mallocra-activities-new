/*
<ai_context>
LiveActivityFeed component extracted from landing page.
Shows real-time activity bookings with smooth auto-scrolling animation.
Positioned as a floating widget to create social proof.
</ai_context>
*/

"use client"

import { useState, useEffect } from "react"

interface LiveActivity {
  id: number
  name: string
  activity: string
  time: string
  flag: string
}

interface LiveActivityFeedProps {
  activities: LiveActivity[]
}

export function LiveActivityFeed({ activities }: LiveActivityFeedProps) {
  const [currentActivity, setCurrentActivity] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentActivity(prev => (prev + 1) % activities.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [activities.length])

  return (
    <div className="fixed-widget-container right-4 top-1/2 z-30 -translate-y-1/2">
      <div className="max-w-sm rounded-xl border border-white/20 bg-white/90 p-4 shadow-lg backdrop-blur-md dark:bg-gray-900/90">
        <div className="mb-3 flex items-center space-x-2">
          <div className="size-2 animate-pulse rounded-full bg-green-500"></div>
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Live Activity
          </span>
        </div>

        <div className="h-16 overflow-hidden">
          <div
            className="transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateY(-${currentActivity * 64}px)`
            }}
          >
            {activities.map(activity => (
              <div key={activity.id} className="flex h-16 items-center">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{activity.flag}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.name}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-300">
                        booked "{activity.activity}"
                      </div>
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
