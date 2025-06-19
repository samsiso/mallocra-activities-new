# Activities Page: Technical Implementation Roadmap

**Document Type**: Implementation Roadmap  
**Date**: June 6, 2025  
**Project**: Mallorca Activities Platform  
**Focus**: Technical Steps for Activities Page Implementation  
**Status**: Ready for Development

---

## Executive Summary

This document provides a detailed technical implementation roadmap for the Mallorca Activities page, building upon our previous layout planning. It outlines specific development tasks, component architecture, code patterns, and implementation milestones to guide the engineering team through the development process.

---

## 1. 📋 Component Development Plan

### 1.1 Core Components Breakdown

| Component | Priority | Dependencies | Complexity | Dev Time |
|-----------|----------|--------------|------------|----------|
| Enhanced ActivityCard | Highest | None | Medium | 3-4 days |
| CategorySection | Highest | ActivityCard | Medium | 2-3 days |
| FeaturedActivitiesCarousel | High | ActivityCard | Medium | 2-3 days |
| FilterSystem | High | None | High | 4-5 days |
| ActivityGrid | High | ActivityCard | Medium | 2-3 days |
| CategoryNavigation | Medium | None | Low | 1-2 days |
| SearchBar | Medium | None | Low | 1-2 days |
| PaginationSystem | Medium | None | Low | 1-2 days |
| ActivityMap | Low | ActivityCard | High | 3-4 days |

### 1.2 Component Specifications

#### Enhanced ActivityCard Component

```tsx
// Component Signature
interface ActivityCardProps {
  activity: Activity;
  size?: 'standard' | 'featured' | 'popular';
  layout?: 'grid' | 'list';
  showDetails?: boolean;
  onQuickView?: (id: string) => void;
  onSave?: (id: string) => void;
  className?: string;
}

// Key Features
// - Responsive image with blur-up loading
// - Three information tiers (visible, primary, expandable)
// - Dynamic badge system
// - Quick view functionality
// - Size variants
```

#### CategorySection Component

```tsx
// Component Signature
interface CategorySectionProps {
  title: string;
  icon?: React.ReactNode;
  activities: Activity[];
  viewAllUrl?: string;
  isScrollable?: boolean;
  className?: string;
}

// Key Features
// - Horizontal scrolling container for activities
// - Category header with icon and "See All" link
// - Optional background styling
// - Activity card rendering with proper spacing
```

#### FilterSystem Component

```tsx
// Component Signature
interface FilterSystemProps {
  filters: Filter[];
  selectedFilters: SelectedFilters;
  onFilterChange: (filters: SelectedFilters) => void;
  layout?: 'sidebar' | 'topbar';
  className?: string;
}

// Key Features
// - Responsive layout modes (sidebar/topbar)
// - Filter persistence across navigation
// - Multiple filter types (checkbox, range, date, etc.)
// - Clear all and apply buttons
```

---

## 2. 🔧 Technical Implementation Approach

### 2.1 State Management Strategy

The activities page will use a layered state management approach:

1. **URL Query Parameters**
   - Storing filter and sort selections
   - Category and subcategory selection
   - Page number and view type
   - Example: `/activities?category=water&sort=price-asc&page=2`

2. **React Context**
   - FilterContext for sharing filter state across components
   - ActivityContext for sharing loaded activity data
   - UIContext for layout preferences and view options

3. **Component State**
   - Local state for UI interactions (hover, expand, etc.)
   - Form state for search and filter inputs
   - Animation and transition states

### 2.2 Data Fetching Pattern

```tsx
// Server Component for Data Fetching
async function ActivitiesWithData({ 
  searchParams 
}: { 
  searchParams: { [key: string]: string | string[] | undefined } 
}) {
  // Extract filter parameters
  const category = searchParams.category as string;
  const sort = searchParams.sort as string;
  const page = Number(searchParams.page) || 1;
  
  // Fetch activities with filters
  const { data: activities } = await getActivitiesAction({
    category,
    sort,
    page,
    // Other filters
  });
  
  // Fetch categories for navigation
  const { data: categories } = await getCategoriesAction();
  
  // Render client component with data
  return (
    <ActivitiesPage 
      initialActivities={activities} 
      categories={categories}
      initialFilters={searchParams}
    />
  );
}
```

### 2.3 Performance Optimization Techniques

1. **Image Loading Strategy**
   ```tsx
   // Example of optimized image loading in ActivityCard
   <div className="relative aspect-[3/2] overflow-hidden rounded-t-lg">
     <Image
       src={activity.image}
       alt={activity.title}
       fill
       sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
       className="object-cover transition-all duration-300 group-hover:scale-105"
       placeholder="blur"
       blurDataURL={activity.imagePlaceholder}
       priority={isPriority}
     />
     {activity.badge && (
       <div className="absolute top-2 left-2 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
         {activity.badge}
       </div>
     )}
   </div>
   ```

2. **Virtualization for Long Lists**
   ```tsx
   // Implementation with react-virtualized for long activity lists
   import { List, AutoSizer, WindowScroller } from 'react-virtualized';
   
   function VirtualizedActivityGrid({ activities }) {
     const rowRenderer = ({ index, key, style }) => (
       <div key={key} style={style}>
         <ActivityCard activity={activities[index]} />
       </div>
     );
     
     return (
       <WindowScroller>
         {({ height, isScrolling, onChildScroll, scrollTop }) => (
           <AutoSizer disableHeight>
             {({ width }) => (
               <List
                 autoHeight
                 height={height}
                 isScrolling={isScrolling}
                 onScroll={onChildScroll}
                 rowCount={activities.length}
                 rowHeight={350} // Adjust based on card height
                 rowRenderer={rowRenderer}
                 scrollTop={scrollTop}
                 width={width}
               />
             )}
           </AutoSizer>
         )}
       </WindowScroller>
     );
   }
   ```

---

## 3. 📅 Implementation Timeline & Milestones

### Phase 1: Foundation (Weeks 1-2)

#### Week 1: Core Components
| Day | Tasks | Owner | Output |
|-----|-------|-------|--------|
| 1-2 | Enhanced ActivityCard development | Frontend | ActivityCard component with all variants |
| 3-4 | Grid system implementation | Frontend | Responsive 12-column grid system |
| 5 | Basic page structure & routing | Frontend | Page shell with routing parameters |

#### Week 2: Filter & Category System
| Day | Tasks | Owner | Output |
|-----|-------|-------|--------|
| 1-2 | Filter component development | Frontend | Filter system with all filter types |
| 3-4 | Category section implementation | Frontend | Scrollable category containers |
| 5 | Integration & state management | Frontend | Connected components with state management |

### Phase 2: Features & Organization (Weeks 3-4)

#### Week 3: Featured Section & Navigation
| Day | Tasks | Owner | Output |
|-----|-------|-------|--------|
| 1-2 | Featured activities carousel | Frontend | Interactive featured section |
| 3-4 | Category navigation system | Frontend | Tab/pill navigation with scrolling |
| 5 | Pagination & loading system | Frontend | "Load more" + page navigation |

#### Week 4: Advanced Filtering & Sorting
| Day | Tasks | Owner | Output |
|-----|-------|-------|--------|
| 1-2 | Advanced filter implementation | Frontend | Combined filters with UI |
| 3-4 | Sorting system implementation | Frontend | All sorting options with persistence |
| 5 | Filter/sort URL parameter system | Frontend | State management with URL params |

### Phase 3: Enhancement (Weeks 5-6)

#### Week 5: Visual Enhancements
| Day | Tasks | Owner | Output |
|-----|-------|-------|--------|
| 1-2 | Badge and visual hierarchy system | Frontend | Complete visual differentiation |
| 3-4 | Quick view functionality | Frontend | Activity preview without page navigation |
| 5 | Animation and transition effects | Frontend | Micro-interactions and polish |

#### Week 6: Performance Optimization
| Day | Tasks | Owner | Output |
|-----|-------|-------|--------|
| 1-3 | Image loading optimization | Frontend | Optimized image loading strategy |
| 3-4 | List virtualization | Frontend | Efficient rendering for long lists |
| 5 | Performance testing & optimization | Frontend | Performance metrics and improvements |

### Phase 4: Testing & Refinement (Weeks 7-8)

#### Week 7: Testing & QA
| Day | Tasks | Owner | Output |
|-----|-------|-------|--------|
| 1-2 | Unit and integration testing | QA | Test coverage for all components |
| 3-4 | Cross-browser testing | QA | Compatibility across browsers |
| 5 | Accessibility testing | QA | WCAG 2.1 AA compliance verification |

#### Week 8: User Testing & Refinement
| Day | Tasks | Owner | Output |
|-----|-------|-------|--------|
| 1-2 | User testing sessions | UX/Frontend | User feedback and pain points |
| 3-4 | Refinements based on feedback | Frontend | Implemented improvements |
| 5 | Final QA and launch prep | QA/Frontend | Production-ready activities page |

---

## 4. 🧩 Component Integration Architecture

The activities page will be built using a modular architecture with clear component relationships:

```
ActivitiesPage (Client Component)
├── PageHeader
├── SearchFilterBar
│   ├── SearchInput
│   ├── FilterToggle
│   └── ViewToggle (Grid/List/Map)
├── FeaturedActivitiesCarousel
│   └── ActivityCard (Featured variant)
├── CategoryNavigation
│   └── CategoryTab/Pill (multiple)
├── ActivityLayout
│   ├── FilterSidebar (conditional)
│   │   └── FilterGroup (multiple)
│   └── ActivityContent
│       ├── ActivityGrid
│       │   └── ActivityCard (multiple)
│       ├── ActivityList (alternative view)
│       │   └── ActivityCard (list variant)
│       └── ActivityMap (alternative view)
│           └── MapMarker (multiple)
├── LoadMoreButton / Pagination
└── RecommendationSection
    └── ActivityCard (multiple)
```

### Component Communication Pattern

```tsx
// Example of component communication pattern
function ActivitiesPage({ initialActivities, initialFilters }) {
  // State management
  const [viewType, setViewType] = useState<'grid' | 'list' | 'map'>('grid');
  const [filters, setFilters] = useState(initialFilters);
  const [activities, setActivities] = useState(initialActivities);
  
  // Filter change handler
  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters);
    
    // Update URL parameters
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, String(value));
    });
    
    // Use Next.js router to update URL without full reload
    router.push(`/activities?${params.toString()}`, { scroll: false });
    
    // Fetch new data based on filters
    const { data } = await getActivitiesAction(newFilters);
    setActivities(data);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <SearchFilterBar 
        filters={filters} 
        onFilterChange={handleFilterChange}
        viewType={viewType}
        onViewChange={setViewType}
      />
      
      <FeaturedActivitiesCarousel activities={activities.featured} />
      
      <CategoryNavigation 
        categories={categories}
        activeCategory={filters.category}
        onCategoryChange={(category) => handleFilterChange({...filters, category})}
      />
      
      <div className="flex flex-col md:flex-row gap-6 mt-8">
        {viewType === 'grid' && (
          <ActivityGrid activities={activities.results} />
        )}
        
        {viewType === 'list' && (
          <ActivityList activities={activities.results} />
        )}
        
        {viewType === 'map' && (
          <ActivityMap activities={activities.results} />
        )}
      </div>
      
      <LoadMoreButton 
        currentCount={activities.results.length} 
        totalCount={activities.total}
        onLoadMore={() => {
          handleFilterChange({
            ...filters, 
            page: (filters.page || 1) + 1
          });
        }}
      />
    </div>
  );
}
```

---

## 5. 🧪 Testing & Quality Assurance Plan

### 5.1 Testing Strategy

The activities page implementation will follow a comprehensive testing approach:

1. **Unit Testing**
   - Component testing with React Testing Library
   - State management logic testing
   - Utility function testing

2. **Integration Testing**
   - Component interaction testing
   - Filter and sort functionality testing
   - URL parameter handling

3. **Visual Regression Testing**
   - Storybook snapshots for components
   - Cross-browser visual consistency
   - Responsive behavior testing

4. **Performance Testing**
   - Lighthouse performance scoring
   - Load time measurement
   - Memory usage monitoring
   - Interaction responsiveness

5. **Accessibility Testing**
   - WCAG 2.1 AA compliance testing
   - Keyboard navigation testing
   - Screen reader compatibility
   - Color contrast verification

### 5.2 Quality Acceptance Criteria

Each component and feature must meet these quality standards:

1. **Functionality**
   - All features work as specified
   - Edge cases are handled gracefully
   - No console errors or warnings

2. **Performance**
   - Initial load under 1.5s on desktop, 2s on mobile
   - Time to Interactive under 3.5s
   - Smooth scrolling (60fps)
   - Efficient re-rendering patterns

3. **Accessibility**
   - WCAG 2.1 AA compliant
   - Fully keyboard navigable
   - Proper ARIA attributes
   - Semantic HTML structure

4. **Cross-browser Compatibility**
   - Works in latest Chrome, Firefox, Safari, Edge
   - Responsive across device sizes
   - Touch interaction support

---

## 6. 🚀 Implementation Kickoff Plan

### 6.1 Development Environment Setup

```bash
# Branch strategy
git checkout -b feature/activities-page-implementation

# Install required dependencies
npm install react-virtualized framer-motion react-intersection-observer
```

### 6.2 Initial Component Scaffolding

```tsx
// Initial ActivityCard scaffolding
"use client";

import Image from "next/image";
import { useState } from "react";
import { Star, MapPin, Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityCardProps {
  activity: Activity;
  size?: "standard" | "featured" | "popular";
  layout?: "grid" | "list";
  showDetails?: boolean;
  className?: string;
}

export function ActivityCard({
  activity,
  size = "standard",
  layout = "grid",
  showDetails = false,
  className,
}: ActivityCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Size class mapping
  const sizeClasses = {
    standard: "w-full",
    featured: "w-full md:w-[calc(50%-12px)]",
    popular: "w-full md:w-[calc(33.333%-16px)]"
  };
  
  return (
    <div 
      className={cn(
        "group bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-all duration-300",
        layout === "grid" ? sizeClasses[size] : "w-full flex flex-row",
        isHovered && "shadow-xl transform translate-y-[-4px]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image container */}
      <div className={cn(
        "relative overflow-hidden",
        layout === "grid" ? "aspect-[3/2] w-full" : "aspect-[1/1] w-1/3"
      )}>
        <Image
          src={activity.image}
          alt={activity.title}
          fill
          sizes={size === "standard" ? "100vw" : "50vw"}
          className="object-cover transition-all duration-300 group-hover:scale-105"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN88P/hfwAJhAPYe0YqHQAAAABJRU5ErkJggg=="
        />
        {activity.badge && (
          <div className="absolute top-2 left-2 bg-yellow-400 text-black px-2 py-1 rounded text-xs font-medium">
            {activity.badge}
          </div>
        )}
      </div>
      
      {/* Content container */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Tier 1: Always visible */}
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-white">{activity.title}</h3>
          <div className="flex items-center">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm text-white ml-1">{activity.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center text-gray-300 text-sm mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span>{activity.location}</span>
        </div>
        
        {/* Tier 2: Primary details */}
        {(showDetails || size !== "standard") && (
          <>
            <p className="text-gray-400 text-sm line-clamp-2 mb-3">
              {activity.description}
            </p>
            
            <div className="flex items-center text-gray-300 text-sm mb-3">
              <Clock className="w-4 h-4 mr-1" />
              <span>{activity.duration}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {activity.highlights?.slice(0, 3).map((highlight, i) => (
                <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">
                  {highlight}
                </span>
              ))}
            </div>
          </>
        )}
        
        {/* Price and CTA */}
        <div className="mt-auto flex justify-between items-center">
          <div className="text-white">
            <span className="text-gray-400 text-sm">from </span>
            <span className="text-lg font-bold">${activity.price}</span>
          </div>
          
          <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium px-4 py-2 rounded text-sm transition-colors">
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
```

### 6.3 Server Action Scaffolding

```tsx
// activities-actions.ts
"use server"

import { db } from "@/db/db";
import { activitiesTable, categoriesTable } from "@/db/schema";
import { ActionState } from "@/types";
import { eq, like, and, or, gte, lte } from "drizzle-orm";

export async function getActivitiesAction({
  category,
  search,
  priceMin,
  priceMax,
  duration,
  location,
  sort = "popular",
  page = 1,
  pageSize = 12
}: {
  category?: string;
  search?: string;
  priceMin?: number;
  priceMax?: number;
  duration?: string;
  location?: string;
  sort?: string;
  page?: number;
  pageSize?: number;
}): Promise<ActionState<{
  results: Activity[];
  featured: Activity[];
  total: number;
  page: number;
  pageSize: number;
}>> {
  try {
    let query = db.select().from(activitiesTable);
    
    // Apply filters
    const filters = [];
    
    if (category) {
      filters.push(eq(activitiesTable.categoryId, category));
    }
    
    if (search) {
      filters.push(
        or(
          like(activitiesTable.title, `%${search}%`),
          like(activitiesTable.description, `%${search}%`)
        )
      );
    }
    
    if (priceMin !== undefined) {
      filters.push(gte(activitiesTable.price, priceMin));
    }
    
    if (priceMax !== undefined) {
      filters.push(lte(activitiesTable.price, priceMax));
    }
    
    if (location) {
      filters.push(eq(activitiesTable.location, location));
    }
    
    if (filters.length > 0) {
      query = query.where(and(...filters));
    }
    
    // Apply sorting
    switch (sort) {
      case "price-asc":
        query = query.orderBy(activitiesTable.price);
        break;
      case "price-desc":
        query = query.orderBy(activitiesTable.price, "desc");
        break;
      case "rating":
        query = query.orderBy(activitiesTable.rating, "desc");
        break;
      case "popular":
      default:
        query = query.orderBy(activitiesTable.popularity, "desc");
        break;
    }
    
    // Apply pagination
    const offset = (page - 1) * pageSize;
    query = query.limit(pageSize).offset(offset);
    
    // Execute query
    const activities = await query;
    
    // Get featured activities
    const featured = await db
      .select()
      .from(activitiesTable)
      .where(eq(activitiesTable.featured, true))
      .limit(3);
    
    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql`count(*)` })
      .from(activitiesTable)
      .where(and(...filters));
    
    return {
      isSuccess: true,
      message: "Activities retrieved successfully",
      data: {
        results: activities,
        featured,
        total: Number(count),
        page,
        pageSize
      }
    };
  } catch (error) {
    console.error("Error getting activities:", error);
    return { isSuccess: false, message: "Failed to get activities" };
  }
}
```

---

## 7. 📊 Progress Tracking & Reporting

### 7.1 Implementation Progress Tracking

Progress will be tracked using these metrics:

1. **Component Completion**
   - Number of components completed vs. planned
   - Component quality assessment (1-5 scale)
   - Test coverage percentage

2. **Feature Implementation**
   - User stories completed vs. planned
   - Feature completion percentage
   - Bugs identified and resolved

3. **Performance Metrics**
   - Lighthouse performance score
   - Core Web Vitals metrics
   - Bundle size and loading metrics

### 7.2 Weekly Progress Report Template

```
## Activities Page Implementation: Week X Progress Report

### 🎯 Accomplishments
- [List of completed components/features]
- [Key milestones achieved]
- [Technical challenges overcome]

### 📊 Metrics
- Components: XX/YY completed (ZZ%)
- Test Coverage: XX%
- Performance Score: XX/100
- Bundle Size: XX KB (XX% optimization)

### 🚧 In Progress
- [Current work items]
- [Expected completion dates]

### 🚨 Blockers & Risks
- [Any blocking issues]
- [Potential risks identified]
- [Mitigation strategies]

### 📅 Next Week Plan
- [Specific goals for next week]
- [Components/features to be implemented]
- [Testing focus areas]
```

---

## 8. 🔄 Post-Implementation Review & Optimization

After the initial implementation is complete, we will conduct:

1. **Performance Review**
   - Core Web Vitals assessment
   - Rendering optimization opportunities
   - Bundle size analysis and optimization

2. **User Behavior Analysis**
   - Heatmap analysis of activity clicks
   - Filter usage patterns
   - Scroll depth and engagement metrics
   - Conversion path analysis

3. **A/B Testing Program**
   - Card design variations
   - Layout organization methods
   - Filter presentation options
   - Featured content strategies

4. **Continuous Improvement Plan**
   - Monthly optimization targets
   - Quarterly feature enhancements
   - User feedback integration process

---

**Document Owner**: Development Team  
**Last Updated**: June 6, 2025  
**Implementation Priority**: High  
**Key Stakeholders**: Product Manager, UX Designer, Frontend Engineers 