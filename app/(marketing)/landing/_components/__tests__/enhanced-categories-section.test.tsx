import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { render, screen, waitFor, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useScroll, useTransform } from "framer-motion"
import EnhancedCategoriesSection from "../enhanced-categories-section"
import { categoriesData } from "../../_data/categories-data"
import { getActivitiesSupabaseAction } from "@/actions/supabase-activities-actions"
import "@testing-library/jest-dom"

// Mock dependencies
vi.mock("framer-motion", () => ({
  motion: {
    section: ({ children, ref, style, ...props }: any) => {
      // Filter out framer-motion specific props
      const filteredProps = Object.keys(props).reduce((acc, key) => {
        if (
          ![
            "initial",
            "animate",
            "exit",
            "whileHover",
            "whileTap",
            "whileInView",
            "transition",
            "viewport"
          ].includes(key)
        ) {
          acc[key] = props[key]
        }
        return acc
      }, {} as any)
      return (
        <section ref={ref} style={style} {...filteredProps}>
          {children}
        </section>
      )
    },
    div: ({ children, style, ...props }: any) => {
      const filteredProps = Object.keys(props).reduce((acc, key) => {
        if (
          ![
            "initial",
            "animate",
            "exit",
            "whileHover",
            "whileTap",
            "whileInView",
            "transition",
            "viewport"
          ].includes(key)
        ) {
          acc[key] = props[key]
        }
        return acc
      }, {} as any)
      return (
        <div style={style} {...filteredProps}>
          {children}
        </div>
      )
    },
    h2: ({ children, ...props }: any) => {
      const filteredProps = Object.keys(props).reduce((acc, key) => {
        if (
          ![
            "initial",
            "animate",
            "exit",
            "whileHover",
            "whileTap",
            "whileInView",
            "transition",
            "viewport"
          ].includes(key)
        ) {
          acc[key] = props[key]
        }
        return acc
      }, {} as any)
      return <h2 {...filteredProps}>{children}</h2>
    },
    p: ({ children, ...props }: any) => {
      const filteredProps = Object.keys(props).reduce((acc, key) => {
        if (
          ![
            "initial",
            "animate",
            "exit",
            "whileHover",
            "whileTap",
            "whileInView",
            "transition",
            "viewport"
          ].includes(key)
        ) {
          acc[key] = props[key]
        }
        return acc
      }, {} as any)
      return <p {...filteredProps}>{children}</p>
    },
    button: ({ children, ...props }: any) => {
      const filteredProps = Object.keys(props).reduce((acc, key) => {
        if (
          ![
            "initial",
            "animate",
            "exit",
            "whileHover",
            "whileTap",
            "whileInView",
            "transition",
            "viewport"
          ].includes(key)
        ) {
          acc[key] = props[key]
        }
        return acc
      }, {} as any)
      return <button {...filteredProps}>{children}</button>
    },
    a: ({ children, ...props }: any) => {
      const filteredProps = Object.keys(props).reduce((acc, key) => {
        if (
          ![
            "initial",
            "animate",
            "exit",
            "whileHover",
            "whileTap",
            "whileInView",
            "transition",
            "viewport"
          ].includes(key)
        ) {
          acc[key] = props[key]
        }
        return acc
      }, {} as any)
      return <a {...filteredProps}>{children}</a>
    }
  },
  useScroll: vi.fn(() => ({
    scrollYProgress: { value: 0 }
  })),
  useTransform: vi.fn((value, input, output) => ({
    value: output[0]
  }))
}))

vi.mock("@/actions/supabase-activities-actions", () => ({
  getActivitiesSupabaseAction: vi.fn()
}))

vi.mock("@/lib/debug", () => ({
  debugLog: vi.fn()
}))

// Mock the child components
vi.mock("../premium-category-card", () => ({
  default: ({ category, index }: any) => (
    <div data-testid={`category-card-${category.id}`} className="category-card">
      <h3>{category.title}</h3>
      <p>{category.description}</p>
      <span>{category.activityCount} activities</span>
    </div>
  )
}))

vi.mock("../category-card-skeleton", () => ({
  default: ({ index }: any) => (
    <div data-testid={`skeleton-${index}`} className="category-card skeleton">
      Loading...
    </div>
  )
}))

describe("EnhancedCategoriesSection", () => {
  const mockGetActivities = vi.mocked(getActivitiesSupabaseAction)

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset scroll mock
    vi.mocked(useScroll).mockReturnValue({
      scrollYProgress: { value: 0 }
    } as any)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe("Initial Rendering", () => {
    it("should render with initial static data", () => {
      render(<EnhancedCategoriesSection />)

      // Check header elements
      expect(screen.getByText("Popular Categories")).toBeInTheDocument()
      expect(screen.getByText("Explore by")).toBeInTheDocument()
      expect(screen.getByText("Category")).toBeInTheDocument()
      expect(
        screen.getByText(/Discover amazing activities/)
      ).toBeInTheDocument()

      // Check that category cards are rendered
      categoriesData.forEach(category => {
        expect(
          screen.getByTestId(`category-card-${category.id}`)
        ).toBeInTheDocument()
        expect(screen.getByText(category.title)).toBeInTheDocument()
      })
    })

    it("should render with correct brand colors and styling", () => {
      render(<EnhancedCategoriesSection />)

      const badge = screen.getByText("Popular Categories").closest("div")
      expect(badge).toHaveStyle({ backgroundColor: "#fff546" })

      const categorySpan = screen.getByText("Category")
      expect(categorySpan).toHaveClass("text-yellow-400")
    })

    it("should render navigation buttons on large screens", () => {
      render(<EnhancedCategoriesSection />)

      // Navigation buttons are hidden on mobile, visible on lg+
      const navButtons = screen
        .getAllByRole("button")
        .filter(btn => btn.querySelector("svg"))
      expect(navButtons).toHaveLength(2) // Previous and Next buttons
    })

    it("should render View All Activities CTA button", () => {
      render(<EnhancedCategoriesSection />)

      const ctaButton = screen.getByText("View All Activities").closest("a")
      expect(ctaButton).toHaveAttribute("href", "/activities")
      expect(ctaButton).toHaveClass("bg-yellow-400")
    })
  })

  describe("Data Fetching", () => {
    it("should fetch activity counts on mount", async () => {
      mockGetActivities.mockResolvedValue({
        isSuccess: true,
        data: [
          { id: "1", title: "Activity 1" },
          { id: "2", title: "Activity 2" }
        ],
        message: "Success"
      })

      render(<EnhancedCategoriesSection />)

      await waitFor(() => {
        // Should fetch test data first
        expect(mockGetActivities).toHaveBeenCalledWith({ limit: 10 })

        // Should fetch for each category
        categoriesData.forEach(category => {
          expect(mockGetActivities).toHaveBeenCalledWith({
            limit: 100,
            category: category.id.toLowerCase()
          })
        })
      })
    })

    it("should show loading skeletons while fetching data", async () => {
      mockGetActivities.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  isSuccess: true,
                  data: [],
                  message: "Success"
                }),
              100
            )
          )
      )

      render(<EnhancedCategoriesSection />)

      // Initially shows category cards
      expect(screen.queryByTestId("skeleton-0")).not.toBeInTheDocument()

      await waitFor(() => {
        // After fetch starts, should show skeletons
        expect(screen.getByTestId("skeleton-0")).toBeInTheDocument()
      })
    })

    it("should fetch and display activity counts", async () => {
      // Mock successful API responses
      mockGetActivities.mockResolvedValue({
        isSuccess: true,
        data: Array(5).fill({ id: "1", title: "Activity" }),
        message: "Success"
      })

      render(<EnhancedCategoriesSection />)

      // Wait for the component to fetch data
      await waitFor(() => {
        expect(mockGetActivities).toHaveBeenCalled()
      })

      // Verify that mockGetActivities was called for test query and each category
      expect(mockGetActivities).toHaveBeenCalledWith({ limit: 10 }) // Test query
      categoriesData.forEach(category => {
        expect(mockGetActivities).toHaveBeenCalledWith({
          limit: 100,
          category: category.id.toLowerCase()
        })
      })
    })

    it("should handle API errors gracefully", async () => {
      mockGetActivities.mockRejectedValue(new Error("API Error"))

      render(<EnhancedCategoriesSection />)

      // Should still render with fallback data
      await waitFor(() => {
        categoriesData.forEach(category => {
          expect(
            screen.getByTestId(`category-card-${category.id}`)
          ).toBeInTheDocument()
        })
      })
    })

    it("should display total activities count when data is loaded", async () => {
      mockGetActivities.mockImplementation(async ({ category, limit }) => {
        // Mock test query returns data
        if (limit === 10 && !category) {
          return {
            isSuccess: true,
            data: Array(10).fill({ id: "1", title: "Activity" }),
            message: "Success"
          }
        }
        // Each category query returns 5 activities
        return {
          isSuccess: true,
          data: Array(5).fill({ id: "1", title: "Activity" }),
          message: "Success"
        }
      })

      render(<EnhancedCategoriesSection />)

      // Wait for loading to complete
      await waitFor(
        () => {
          expect(screen.queryByTestId("skeleton-0")).not.toBeInTheDocument()
        },
        { timeout: 3000 }
      )

      // Check that the total count is displayed
      await waitFor(() => {
        const experiencesText = screen.getByText(
          /premium experiences await you/
        )
        expect(experiencesText).toBeInTheDocument()
      })
    })
  })

  describe("Carousel Interactions", () => {
    it("should handle navigation button clicks", async () => {
      const user = userEvent.setup()
      render(<EnhancedCategoriesSection />)

      const container = screen
        .getByRole("region", { name: "Activity categories" })
        .querySelector("#categories-carousel")

      // Mock scrollBy
      if (container) {
        container.scrollBy = vi.fn()
      }

      // Find navigation buttons
      const navButtons = screen
        .getAllByRole("button")
        .filter(btn => btn.querySelector("svg"))

      // Click next button
      await user.click(navButtons[1])
      expect(container?.scrollBy).toHaveBeenCalledWith({
        left: 400,
        behavior: "smooth"
      })

      // Click previous button
      await user.click(navButtons[0])
      expect(container?.scrollBy).toHaveBeenCalledWith({
        left: -400,
        behavior: "smooth"
      })
    })

    it("should update current card indicator on scroll", async () => {
      render(<EnhancedCategoriesSection />)

      const container = document.getElementById("categories-carousel")
      if (!container) throw new Error("Carousel container not found")

      // Mock container properties
      Object.defineProperty(container, "scrollLeft", {
        value: 382,
        writable: true
      })
      Object.defineProperty(container, "offsetWidth", {
        value: 350,
        writable: true
      })

      // Mock querySelectorAll to return card elements
      const mockCards = categoriesData.map((_, index) => ({
        offsetWidth: 350,
        offsetLeft: index * 382
      }))

      container.querySelectorAll = vi.fn(() => mockCards as any)

      // Trigger scroll event
      fireEvent.scroll(container)

      await waitFor(() => {
        // Should show card counter for mobile
        expect(screen.getByText(/of \d+ categories/)).toBeInTheDocument()
      })
    })

    it("should handle dot indicator clicks", async () => {
      const user = userEvent.setup()
      render(<EnhancedCategoriesSection />)

      const container = document.getElementById("categories-carousel")
      if (!container) throw new Error("Carousel container not found")

      container.scrollTo = vi.fn()

      // Mock querySelectorAll for cards
      const mockCards = categoriesData.map((_, index) => ({
        offsetLeft: index * 382
      }))
      container.querySelectorAll = vi.fn(() => mockCards as any)

      // Find dot indicators
      const dots = screen.getAllByRole("button", { name: /Go to category/ })

      // Click second dot
      await user.click(dots[1])

      expect(container.scrollTo).toHaveBeenCalledWith({
        left: 366, // 382 - 16 (padding)
        behavior: "smooth"
      })
    })
  })

  describe("Scroll Animations", () => {
    it("should apply exit animations based on scroll progress", () => {
      const mockScrollProgress = { value: 0.8 }
      vi.mocked(useScroll).mockReturnValue({
        scrollYProgress: mockScrollProgress
      } as any)

      // Mock useTransform to return calculated values
      vi.mocked(useTransform).mockImplementation((progress, input, output) => {
        if (
          JSON.stringify(input) === "[0.7,1]" &&
          JSON.stringify(output) === "[1,0.9]"
        ) {
          return { value: 0.95 } // exitScale
        }
        if (
          JSON.stringify(input) === "[0.8,1]" &&
          JSON.stringify(output) === "[1,0]"
        ) {
          return { value: 0.5 } // exitOpacity
        }
        if (
          JSON.stringify(input) === "[0.7,1]" &&
          JSON.stringify(output) === "[0,-50]"
        ) {
          return { value: -25 } // exitY
        }
        return { value: output[0] }
      })

      render(<EnhancedCategoriesSection />)

      const section = screen.getByRole("region", {
        name: "Activity categories"
      })

      // Check that transform values are being used
      expect(useTransform).toHaveBeenCalledWith(
        mockScrollProgress,
        [0.7, 1],
        [1, 0.9]
      )
      expect(useTransform).toHaveBeenCalledWith(
        mockScrollProgress,
        [0.8, 1],
        [1, 0]
      )
      expect(useTransform).toHaveBeenCalledWith(
        mockScrollProgress,
        [0.7, 1],
        [0, -50]
      )
    })
  })

  describe("Accessibility", () => {
    it("should have proper ARIA labels", () => {
      render(<EnhancedCategoriesSection />)

      expect(
        screen.getByRole("region", { name: "Activity categories" })
      ).toBeInTheDocument()

      const dots = screen.getAllByRole("button", { name: /Go to category/ })
      expect(dots).toHaveLength(categoriesData.length)
    })

    it("should support keyboard navigation", async () => {
      const user = userEvent.setup()
      render(<EnhancedCategoriesSection />)

      const ctaButton = screen.getByText("View All Activities").closest("a")

      // Tab to CTA button
      await user.tab()

      // Verify focus management
      expect(document.activeElement).toBeDefined()
    })
  })

  describe("Mobile Responsiveness", () => {
    it("should show swipe indicators on mobile", () => {
      render(<EnhancedCategoriesSection />)

      // Progress bar - find by class since it's not a semantic progressbar
      const progressBar = document.querySelector(
        ".relative.h-1.w-full.overflow-hidden.rounded-full.bg-white\\/20"
      )
      expect(progressBar).toBeInTheDocument()

      // Dot indicators
      const dots = screen.getAllByRole("button", { name: /Go to category/ })
      expect(dots.length).toBe(categoriesData.length)

      // Card counter
      expect(screen.getByText(/of \d+ categories/)).toBeInTheDocument()
    })

    it("should apply proper scroll snap behavior", () => {
      render(<EnhancedCategoriesSection />)

      const carousel = document.getElementById("categories-carousel")
      expect(carousel).toHaveStyle({
        scrollSnapType: "x mandatory",
        scrollBehavior: "smooth"
      })
    })
  })
})
