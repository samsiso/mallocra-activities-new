"use client"

/*
<ai_context>
Advanced Scroll-Driven Effects - 2024 Design Trends
Features sophisticated parallax scrolling, reveal animations, and scroll-driven storytelling
that creates an immersive and cinematic user experience.
</ai_context>
*/

import { useRef, useEffect, useState } from "react"
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  useAnimation,
  useSpring
} from "framer-motion"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Waves,
  Mountain,
  Sun,
  Compass,
  Camera,
  Users,
  Star,
  ArrowDown,
  Play
} from "lucide-react"

interface ParallaxTextProps {
  children: React.ReactNode
  speed?: number
  className?: string
}

export function ParallaxText({
  children,
  speed = 0.5,
  className
}: ParallaxTextProps) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  duration?: number
  delay?: number
  className?: string
}

export function ScrollReveal({
  children,
  direction = "up",
  distance = 50,
  duration = 0.8,
  delay = 0,
  className
}: ScrollRevealProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-100px" })

  const directionMap = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, ...directionMap[direction] }}
      animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StorytellingSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])
  const textOpacity = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0, 1, 1, 0]
  )
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.2])

  const stories = [
    {
      title: "Adventure Awaits",
      description: "Every sunrise brings new possibilities in Mallorca",
      icon: Sun,
      color: "from-orange-400 to-yellow-500"
    },
    {
      title: "Crystal Waters",
      description: "Dive into the clearest Mediterranean waters",
      icon: Waves,
      color: "from-blue-400 to-cyan-500"
    },
    {
      title: "Mountain Peaks",
      description: "Conquer breathtaking heights in the Tramuntana",
      icon: Mountain,
      color: "from-green-400 to-emerald-500"
    }
  ]

  return (
    <section ref={containerRef} className="relative h-[300vh] overflow-hidden">
      {/* Parallax Background */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
        style={{ y: backgroundY }}
      />

      {/* Floating Elements */}
      <div className="pointer-events-none fixed inset-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute size-2 rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Story Content */}
      <div className="sticky top-0 flex h-screen items-center justify-center">
        <motion.div
          style={{ opacity: textOpacity, scale }}
          className="max-w-4xl px-4 text-center text-white"
        >
          <motion.h2
            className="mb-8 bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-6xl font-bold text-transparent md:text-8xl"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Your Story Begins Here
          </motion.h2>

          <motion.p
            className="mb-12 text-xl text-white/80 md:text-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Where every moment becomes a cherished memory
          </motion.p>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {stories.map((story, index) => (
              <motion.div
                key={story.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                className="text-center"
              >
                <motion.div
                  className={`mx-auto mb-4 size-20 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center`}
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.8 }}
                >
                  <story.icon className="size-8 text-white" />
                </motion.div>
                <h3 className="mb-2 text-xl font-bold">{story.title}</h3>
                <p className="text-white/70">{story.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

interface MorphingShapeProps {
  size?: number
  colors?: string[]
  duration?: number
}

export function MorphingShape({
  size = 100,
  colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4"],
  duration = 4
}: MorphingShapeProps) {
  const [currentColorIndex, setCurrentColorIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex(prev => (prev + 1) % colors.length)
    }, duration * 1000)

    return () => clearInterval(interval)
  }, [colors.length, duration])

  const pathVariants = {
    animate: {
      d: [
        "M60,30 Q90,60 60,90 Q30,60 60,30",
        "M60,30 Q100,30 90,60 Q60,100 30,60 Q30,30 60,30",
        "M60,30 Q90,20 90,60 Q90,100 60,90 Q30,100 30,60 Q30,20 60,30",
        "M60,30 Q90,60 60,90 Q30,60 60,30"
      ],
      transition: {
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  }

  return (
    <motion.div
      className="relative"
      animate={{ rotate: 360 }}
      transition={{ duration: duration * 2, repeat: Infinity, ease: "linear" }}
    >
      <svg width={size} height={size} viewBox="0 0 120 120">
        <motion.path
          variants={pathVariants}
          animate="animate"
          fill={colors[currentColorIndex]}
          fillOpacity={0.7}
          stroke={colors[currentColorIndex]}
          strokeWidth={2}
        />
      </svg>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${colors[currentColorIndex]}40 0%, transparent 70%)`,
          filter: "blur(10px)"
        }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  )
}

export function ScrollProgressIndicator() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 })

  return (
    <motion.div
      className="fixed inset-x-0 top-0 z-50 h-1 transform-gpu bg-gradient-to-r from-rose-500 via-purple-500 to-blue-500"
      style={{ scaleX, transformOrigin: "0%" }}
    />
  )
}

interface InfiniteScrollProps {
  items: string[]
  speed?: number
  direction?: "left" | "right"
  className?: string
}

export function InfiniteScroll({
  items,
  speed = 50,
  direction = "left",
  className
}: InfiniteScrollProps) {
  const duplicatedItems = [...items, ...items]

  return (
    <div className={cn("overflow-hidden", className)}>
      <motion.div
        className="flex space-x-8"
        animate={{
          x:
            direction === "left"
              ? [0, -50 * items.length]
              : [-50 * items.length, 0]
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear"
          }
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="shrink-0 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-white backdrop-blur-sm"
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function ScrollSnap() {
  const [currentSection, setCurrentSection] = useState(0)
  const sections = ["Hero", "Features", "Gallery", "Testimonials", "Contact"]

  const handleScroll = () => {
    const scrollPosition = window.scrollY
    const windowHeight = window.innerHeight
    const newSection = Math.floor(scrollPosition / windowHeight)
    setCurrentSection(Math.min(newSection, sections.length - 1))
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed right-8 top-1/2 z-40 -translate-y-1/2 space-y-4">
      {sections.map((section, index) => (
        <motion.div
          key={section}
          className="group relative cursor-pointer"
          onClick={() => {
            window.scrollTo({
              top: index * window.innerHeight,
              behavior: "smooth"
            })
          }}
        >
          <motion.div
            className={cn(
              "size-3 rounded-full border-2 transition-all duration-300",
              currentSection === index
                ? "scale-125 border-white bg-white"
                : "border-white/50 bg-transparent hover:border-white"
            )}
            whileHover={{ scale: 1.2 }}
          />

          {/* Tooltip */}
          <motion.div
            className="absolute right-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded bg-black px-3 py-1 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            initial={{ x: 10 }}
            whileHover={{ x: 0 }}
          >
            {section}
          </motion.div>
        </motion.div>
      ))}
    </div>
  )
}
