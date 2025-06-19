# Landing Page Backlog

This document outlines improvements and fixes needed for the landing page.

## Search Functionality

- [x] Fix the "Find your perfect activity" search at the top of the page ✅ **ENHANCED**
  - [x] Connect search to actual activity data ✅ **WORKING**
  - [x] Implement dropdown with activity suggestions as user types ✅ **ENHANCED WITH EXPANDED CARDS**
  - [x] Show expanded card with a few options when clicked ✅ **COMPLETED**
  - [x] Link search results to the activities page ✅ **WORKING**

### ✨ **Search Enhancement Details (Completed):**
- **Enhanced Autocomplete Dropdown**: Now shows larger, detailed cards with:
  - 80px images with hover scale effects
  - Featured activity badges
  - Category badges and location info  
  - Short descriptions for each activity
  - Duration, capacity, and rating details
  - Prominent pricing display
  - Smooth animations and hover effects
  - Action arrows for better UX

- **Improved Visual Design**: 
  - Better color scheme with orange/blue accents
  - Scroll support for many results
  - Enhanced "View all results" button
  - Professional layout and typography

- **Working Data Integration**: 
  - Connects to real Supabase activity data
  - Debounced search (300ms) for performance
  - Proper error handling and loading states
  - Routes correctly to activities page with search parameters

## Featured Activities Section

- [x] Fix missing image on one of the featured activity cards
- [x] Reduce card width to improve layout  
- [x] Redesign activity cards for better UI/UX
- [x] Ensure horizontal scrolling works properly

## Social Proof Elements

- [ ] Reposition "Recognized by leading travel publications/TripAdvisor" section
  - [ ] Move to the review card section
  - [ ] Use different text styling
  - [ ] Consider different background treatment

- [ ] Reposition stats section (50,000 happy customers, 4.9/5 rating, etc.)
  - [ ] Find more appropriate placement for the four icons and stats

## Map Integration

- [ ] Fix map overlay issue
  - [ ] Properly embed the map so it doesn't overlay the top navigation
  - [ ] Ensure map doesn't interfere with "Activities across Majorca" section
  - [ ] Fix z-index issues with map relative to other elements

## Navigation Bar

- [x] Redesign top navigation with glass effect
  - [x] Replace current red bar that spans full width
  - [x] Implement glossy card effect
  - [x] Make navigation bar narrower than full-width
  - [x] Ensure elements are properly encased within the glass container

## General Improvements

- [ ] Review overall layout and spacing
- [ ] Ensure responsive behavior on all screen sizes
- [ ] Optimize images and media for performance
- [ ] Ensure consistent styling with brand guidelines

## Priority Order (Tentative)

1. Fix map overlay issue (affects usability)
2. Fix search functionality (core feature)
3. Redesign navigation bar (high visibility element)
4. Improve featured activities section (important for conversions)
5. Reposition social proof elements (enhances credibility) 