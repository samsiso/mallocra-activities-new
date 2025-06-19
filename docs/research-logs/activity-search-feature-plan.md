# Activity Search & Filtering Feature Plan

**Document Type**: Research & Planning  
**Date**: June 6, 2025  
**Project**: Mallorca Activities Platform  
**Focus**: Activity Search & Filtering Implementation  
**Status**: Planning Phase

---

## Executive Summary

This document outlines a comprehensive plan to implement an advanced activity search and filtering system for the Mallorca Activities platform. The goal is to create an intuitive, responsive, and powerful search experience that helps users quickly find activities matching their preferences, increasing conversion rates and user satisfaction.

---

## 1. 🔍 Research Analysis

### 1.1 Current Search Capabilities Assessment
- Basic search functionality likely limited to simple text matching
- Opportunity to implement advanced filtering options (categories, price, duration, location)
- Need for visual search components that work seamlessly with dark theme
- Potential to leverage existing Supabase database structure and views

### 1.2 User Expectations
- Modern travel platforms offer instant, predictive search experiences
- Users expect multiple filtering options that update results in real-time
- Mobile search requires optimization for touch interactions and smaller screens
- Location-based filtering is a standard expectation in travel/activity platforms

### 1.3 Technical Viability
- Supabase database already contains structured activity data
- PostgreSQL's full-text search capabilities can be leveraged for powerful text search
- Next.js server components enable efficient server-side filtering and pagination
- Client-side state management will be needed for reactive UI updates

---

## 2. 💡 Search & Filtering System Design

### 2.1 Core Search Features
- **Full-Text Search**: Search across activity titles, descriptions, and locations
- **Category Filtering**: Filter by activity types (water sports, hiking, cultural, etc.)
- **Price Filtering**: Range slider for minimum and maximum price
- **Duration Filtering**: Options for activity length (hours/days)
- **Location Filtering**: Map-based or dropdown selection of Mallorca regions
- **Availability Filtering**: Calendar-based date selection with availability checking
- **Rating Filtering**: Minimum star rating selector

### 2.2 Technical Approach
1. **Backend Search Implementation**:
   - PostgreSQL full-text search with weighted columns
   - Server actions for complex query handling
   - Optimized database views for common search patterns
   - Pagination for performance with large result sets

2. **Frontend Components**:
   - Search input with autocomplete suggestions
   - Filter sidebar/dropdown with multiple filter options
   - Results grid with sorting options
   - Interactive map component (optional for location filtering)
   - Mobile-optimized filter drawer/modal

### 2.3 User Experience Enhancement
- **Instant Search**: Type-ahead suggestions as user types
- **Applied Filters Display**: Chips/tags showing active filters
- **Save Search**: Allow users to save search parameters
- **Recent Searches**: Track and display recent user searches
- **Popular Searches**: Show trending search terms

### 2.4 Responsive Approach
- **Desktop**: Expanded filter sidebar with all options visible
- **Tablet**: Collapsible filter panel with toggles
- **Mobile**: Bottom sheet filter modal with optimized controls
- **Touch Optimization**: Larger touch targets for mobile filters

---

## 3. 🛠️ Implementation Strategy

### 3.1 Database Optimization
1. **Search Index Creation**:
   ```sql
   CREATE INDEX activity_search_idx ON activities 
   USING GIN(to_tsvector('english', title || ' ' || description));
   ```

2. **Search Function Implementation**:
   ```sql
   CREATE OR REPLACE FUNCTION search_activities(
     search_query TEXT,
     category_filter TEXT[] DEFAULT NULL,
     min_price DECIMAL DEFAULT NULL,
     max_price DECIMAL DEFAULT NULL,
     min_duration INTEGER DEFAULT NULL,
     max_duration INTEGER DEFAULT NULL,
     location_ids TEXT[] DEFAULT NULL,
     min_rating DECIMAL DEFAULT NULL,
     start_date DATE DEFAULT NULL,
     end_date DATE DEFAULT NULL
   ) RETURNS SETOF activities AS $$
   BEGIN
     RETURN QUERY
     SELECT a.*
     FROM activities a
     WHERE
       (search_query IS NULL OR 
        to_tsvector('english', a.title || ' ' || a.description) @@ 
        plainto_tsquery('english', search_query))
       AND (category_filter IS NULL OR a.category = ANY(category_filter))
       AND (min_price IS NULL OR a.price >= min_price)
       AND (max_price IS NULL OR a.price <= max_price)
       AND (min_duration IS NULL OR a.duration_hours >= min_duration)
       AND (max_duration IS NULL OR a.duration_hours <= max_duration)
       AND (location_ids IS NULL OR a.location_id = ANY(location_ids))
       AND (min_rating IS NULL OR a.avg_rating >= min_rating)
       AND (start_date IS NULL OR a.id IN (
         SELECT activity_id FROM availability 
         WHERE date >= start_date AND date <= end_date AND is_available = TRUE
       ));
   END;
   $$ LANGUAGE plpgsql;
   ```

### 3.2 Server Action Implementation
1. **Search Server Action**:
   - Create a new action in `/actions/db/activities-actions.ts`
   - Implement function to call database search function
   - Handle pagination and result formatting
   - Include error handling and response typing

### 3.3 Component Structure Planning
1. **SearchBar Component**:
   - Input field with search icon
   - Autocomplete dropdown with suggestions
   - Recent searches display
   - Voice search option (optional)

2. **FilterPanel Component**:
   - Collapsible sections for each filter type
   - Clear filters button
   - Apply filters button (for mobile)
   - Save search option

3. **SearchResults Component**:
   - Grid/list toggle view
   - Sorting options (price, rating, popularity)
   - Results count display
   - Pagination controls
   - Empty state handling

4. **ActivityCard Component**:
   - Enhanced for search results display
   - Quick view option
   - Save/favorite button
   - Pricing and availability indicators

---

## 4. 📊 Performance Considerations

### 4.1 Query Optimization
- Implement query debouncing (300-500ms) to prevent excessive API calls
- Use cursor-based pagination for large result sets
- Cache common search results on the client
- Optimize PostgreSQL queries with proper indexing

### 4.2 Frontend Performance
- Lazy load search results images
- Implement virtualized lists for large result sets
- Use skeleton loaders during search/filter operations
- Consider implementing incremental static regeneration for common searches

### 4.3 Performance Metrics Targets
- Search response time: <500ms for typical queries
- Filter application: <200ms for UI updates
- Results rendering: <100ms for visible items
- Mobile interaction delay: <50ms for touch responses

---

## 5. 🔄 User Interaction Flow

### 5.1 Initial Search
1. User enters search term in main search bar
2. System displays autocomplete suggestions as user types
3. User selects suggestion or submits search
4. System displays results with default sorting (popularity)
5. Applied search term appears as a filter chip

### 5.2 Refining Results
1. User opens filter panel/modal
2. User selects desired filters (category, price range, etc.)
3. System updates results in real-time or after "Apply" action
4. Applied filters appear as chips that can be individually removed
5. User can clear all filters with a single action

### 5.3 Sorting and Navigation
1. User can sort results by different criteria
2. User can toggle between grid and list views
3. User can navigate through pagination or infinite scroll
4. User can click activity card to view details
5. User can save/favorite activities from results view

---

## 6. 🧪 Testing Plan

### 6.1 Functional Testing
- Verify all filter combinations produce expected results
- Test search with special characters and edge cases
- Validate pagination and sorting functionality
- Test filter persistence across page reloads

### 6.2 Performance Testing
- Measure query response times with various filter combinations
- Test with large result sets (1000+ activities)
- Verify mobile performance on low-end devices
- Stress test concurrent search requests

### 6.3 User Experience Testing
- Conduct usability testing with representative users
- Track common search patterns and filter usage
- Identify pain points in the search/filter process
- A/B test different filter layouts and interactions

---

## 7. 📱 Mobile-Specific Considerations

### 7.1 Mobile Interface Design
- Implement a bottom sheet for filters instead of sidebar
- Use segmented filter display to maximize screen space
- Implement swipe gestures for result cards
- Design for thumb-friendly interaction zones

### 7.2 Mobile Performance Optimizations
- Reduce initial payload size for mobile users
- Optimize image delivery for mobile connections
- Implement view transitions for smoother UX
- Consider reduced animation mode for low-power devices

---

## 8. 🔮 Advanced Features (Future Iterations)

### 8.1 Smart Search Enhancements
- Personalized search results based on user history
- Semantic search understanding (e.g., "family-friendly" finds activities suitable for children)
- Multi-language search support
- Typo tolerance and spell correction

### 8.2 AI-Powered Recommendations
- "Similar to this" activity recommendations
- "People also searched for" suggestions
- Personalized activity bundles based on preferences
- Smart itinerary building from search results

### 8.3 Visual Search
- Search by image upload (beach, mountain, etc.)
- Map-based visual search interface
- Activity preview videos in search results
- 360° preview thumbnails

---

## 9. 🚀 Implementation Roadmap

### Phase 1: Core Search Functionality
1. Implement basic text search with essential filters (category, price)
2. Create search server action and result components
3. Implement basic sorting and pagination
4. Develop mobile-responsive search interface

### Phase 2: Enhanced Filtering
1. Add advanced filters (duration, location, availability)
2. Implement filter persistence and URL parameters
3. Create saved searches functionality
4. Enhance autocomplete with popular and recent searches

### Phase 3: Performance & UX Optimization
1. Optimize database queries and add caching
2. Implement skeleton loaders and smooth transitions
3. Add analytics to track search patterns
4. Optimize for core web vitals and mobile performance

### Phase 4: Advanced Features
1. Implement map-based search interface
2. Add personalized recommendations
3. Develop multi-language search support
4. Implement AI-powered search enhancements

---

## 10. 📋 Success Metrics

### Key Performance Indicators
- **Search Usage**: 70%+ of users utilize search functionality
- **Search to Book Conversion**: 15%+ conversion from search to booking
- **Filter Usage**: Average of 2+ filters applied per search session
- **Search Abandonment**: <25% abandonment rate for search sessions
- **Search Speed**: 95% of searches completed in <1 second
- **User Satisfaction**: 85%+ satisfaction rating for search experience

---

## 11. 🔍 Next Steps

1. **Database Preparation**: Implement search indexes and functions
2. **Component Design**: Create mockups for search and filter UI
3. **Server Action Development**: Implement core search functionality
4. **Frontend Implementation**: Develop search and filter components
5. **Testing & Optimization**: Validate search accuracy and performance

---

**Document Owner**: Development Team  
**Last Updated**: June 6, 2025  
**Review Frequency**: Bi-weekly during implementation 