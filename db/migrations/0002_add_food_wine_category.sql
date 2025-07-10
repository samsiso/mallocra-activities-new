-- Migration: Add food_wine to activity_category enum
-- Date: 2025-07-04

-- Add new value to existing enum
ALTER TYPE activity_category ADD VALUE 'food_wine';

-- No need to modify tables since they already reference the enum