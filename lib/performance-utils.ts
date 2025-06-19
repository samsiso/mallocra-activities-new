/*
Performance utilities for Mallorca Activities platform
Provides optimized scroll handling and animation utilities
*/

// Throttle function optimized for scroll events
export const throttle = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0
  return (...args: any[]) => {
    const currentTime = Date.now()
    if (currentTime - lastExecTime > delay) {
      func(...args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(
        () => {
          func(...args)
          lastExecTime = Date.now()
        },
        delay - (currentTime - lastExecTime)
      )
    }
  }
}

// Debounce function for less frequent updates
export const debounce = (func: (...args: any[]) => void, delay: number) => {
  let timeoutId: NodeJS.Timeout
  return (...args: any[]) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

// Optimized Intersection Observer for lazy loading
export const createOptimizedObserver = (
  callback: IntersectionObserverCallback,
  options?: IntersectionObserverInit
) => {
  return new IntersectionObserver(callback, {
    rootMargin: "50px",
    threshold: 0.1,
    ...options
  })
}

// CSS containment utility
export const performanceStyles = {
  willChange: "transform",
  transform: "translate3d(0, 0, 0)",
  contain: "layout style paint" as const,
  backfaceVisibility: "hidden" as const
}

// Optimized scroll listener hook
export const useOptimizedScroll = (
  callback: (scrollY: number) => void,
  dependency: any[] = []
) => {
  const throttledCallback = throttle(callback, 16) // 60fps

  if (typeof window !== "undefined") {
    window.addEventListener(
      "scroll",
      () => {
        throttledCallback(window.scrollY)
      },
      { passive: true }
    )
  }
}
