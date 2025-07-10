-- Activity Consolidation Script
-- This script consolidates duplicate activities into single activities with pricing variations

-- =============================================
-- 1. CONSOLIDATE JETSKI TOURS
-- =============================================

-- Create consolidated JetSki Tour activity
INSERT INTO activities (
    id,
    title,
    slug,
    description,
    short_description,
    category,
    location,
    duration_minutes,
    max_participants,
    difficulty_level,
    cancellation_policy,
    what_to_bring,
    what_includes,
    important_notes,
    status,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Jet Ski Adventure Tour',
    'jet-ski-adventure-tour',
    'Experience the thrill of jet skiing along Mallorca''s stunning coastline. Choose from our 30-minute taster session or extend your adventure with our full 1-hour tour. Perfect for beginners and experienced riders alike, our guided jet ski tours offer an unforgettable water sports experience with breathtaking views of the Mediterranean.',
    'Thrilling jet ski tours along Mallorca''s coastline - choose 30 minutes or 1 hour',
    'water_sports',
    'Palma Bay Marina',
    60, -- Default to longest duration
    2,  -- Max participants per jet ski
    'beginner',
    'Free cancellation up to 24 hours before the tour',
    'Swimwear, towel, sunscreen, waterproof camera (optional)',
    'Professional guide, safety equipment, brief training session, fuel',
    'Minimum age 16 years. Valid driving license required for driver.',
    'active',
    NOW(),
    NOW()
);

-- Get the new consolidated activity ID
-- (In a real migration, you'd capture this ID)
-- For now, we'll use a placeholder that needs to be replaced

-- Add pricing variations for different durations
INSERT INTO activity_pricing (
    activity_id,
    price_type,
    base_price,
    currency,
    description,
    duration_minutes,
    created_at,
    updated_at
) VALUES
    -- 30-minute option
    (
        (SELECT id FROM activities WHERE slug = 'jet-ski-adventure-tour'),
        'adult',
        99.00,
        'EUR',
        '30-minute jet ski tour',
        30,
        NOW(),
        NOW()
    ),
    -- 1-hour option  
    (
        (SELECT id FROM activities WHERE slug = 'jet-ski-adventure-tour'),
        'adult',
        159.00,
        'EUR',
        '1-hour jet ski tour',
        60,
        NOW(),
        NOW()
    );

-- =============================================
-- 2. CONSOLIDATE FORMULA RACING
-- =============================================

-- Create consolidated Formula Racing activity
INSERT INTO activities (
    id,
    title,
    slug,
    description,
    short_description,
    category,
    location,
    duration_minutes,
    max_participants,
    difficulty_level,
    cancellation_policy,
    what_to_bring,
    what_includes,
    important_notes,
    status,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Formula Racing Experience',
    'formula-racing-experience',
    'Get behind the wheel of a real Formula racing car and experience the thrill of high-speed racing on professional tracks. Choose from our introductory 2.5-hour session or our comprehensive 4.5-hour advanced experience. Both tours include professional instruction, safety briefing, and the chance to push these incredible machines to their limits.',
    'Professional Formula racing experience - choose from 2.5 or 4.5 hour sessions',
    'land_adventures',
    'Formula Racing Circuit, Mallorca',
    270, -- Default to longest duration
    20,
    'intermediate',
    'Free cancellation up to 48 hours before the experience',
    'Closed-toe shoes, comfortable clothing, valid driving license',
    'Professional instructor, safety equipment, racing car, fuel, timing system',
    'Minimum age 18 years. Valid driving license required. Medical clearance may be required.',
    'active',
    NOW(),
    NOW()
);

-- Add pricing variations for different durations
INSERT INTO activity_pricing (
    activity_id,
    price_type,
    base_price,
    currency,
    description,
    duration_minutes,
    created_at,
    updated_at
) VALUES
    -- 2.5-hour introductory session
    (
        (SELECT id FROM activities WHERE slug = 'formula-racing-experience'),
        'adult',
        59.00,
        'EUR',
        'Introductory Formula racing session (2.5 hours)',
        150,
        NOW(),
        NOW()
    ),
    -- 4.5-hour advanced experience
    (
        (SELECT id FROM activities WHERE slug = 'formula-racing-experience'),
        'adult',
        79.00,
        'EUR',
        'Advanced Formula racing experience (4.5 hours)',
        270,
        NOW(),
        NOW()
    );

-- =============================================
-- 3. CONSOLIDATE BOAT RENTALS
-- =============================================

-- Create consolidated Boat Rental activity
INSERT INTO activities (
    id,
    title,
    slug,
    description,
    short_description,
    category,
    location,
    duration_minutes,
    max_participants,
    difficulty_level,
    cancellation_policy,
    what_to_bring,
    what_includes,
    important_notes,
    status,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Private Boat Rental',
    'private-boat-rental',
    'Charter your own private boat and explore Mallorca''s stunning coastline at your own pace. Choose from our fleet of well-maintained boats accommodating different group sizes and budgets. All boats come with safety equipment and optional captain service. Perfect for families, couples, or groups looking for a personalized maritime adventure.',
    'Private boat charter with flexible duration and capacity options',
    'water_sports',
    'Marina Port de Mallorca',
    60, -- Hourly rental
    10, -- Max for largest boat
    'beginner',
    'Free cancellation up to 24 hours before rental',
    'Swimwear, towel, sunscreen, snacks and drinks',
    'Boat rental, safety equipment, fuel, basic navigation briefing',
    'Valid boat license required for self-drive or captain service available for additional fee.',
    'active',
    NOW(),
    NOW()
);

-- Add pricing variations for different boat sizes/capacities
INSERT INTO activity_pricing (
    activity_id,
    price_type,
    base_price,
    currency,
    description,
    max_participants,
    created_at,
    updated_at
) VALUES
    -- Compact boat (6 people)
    (
        (SELECT id FROM activities WHERE slug = 'private-boat-rental'),
        'adult',
        320.00,
        'EUR',
        'Compact boat rental (up to 6 people) - per hour',
        6,
        NOW(),
        NOW()
    ),
    -- Standard boat (8 people)
    (
        (SELECT id FROM activities WHERE slug = 'private-boat-rental'),
        'adult',
        350.00,
        'EUR',
        'Standard boat rental (up to 8 people) - per hour',
        8,
        NOW(),
        NOW()
    ),
    -- Premium boat (10 people)
    (
        (SELECT id FROM activities WHERE slug = 'private-boat-rental'),
        'adult',
        380.00,
        'EUR',
        'Premium boat rental (up to 10 people) - per hour',
        10,
        NOW(),
        NOW()
    );

-- =============================================
-- 4. COPY IMAGES AND MEDIA
-- =============================================

-- Copy images from original JetSki activities to consolidated activity
INSERT INTO activity_images (
    activity_id,
    image_url,
    alt_text,
    is_primary,
    display_order,
    created_at,
    updated_at
)
SELECT 
    (SELECT id FROM activities WHERE slug = 'jet-ski-adventure-tour'),
    ai.image_url,
    ai.alt_text,
    false, -- Only first image should be primary
    ai.display_order,
    NOW(),
    NOW()
FROM activity_images ai
JOIN activities a ON ai.activity_id = a.id
WHERE a.title IN ('Jet Ski 30-Minute Tour', 'Jet Ski 1-Hour Tour');

-- Copy images from original Formula activities to consolidated activity
INSERT INTO activity_images (
    activity_id,
    image_url,
    alt_text,
    is_primary,
    display_order,
    created_at,
    updated_at
)
SELECT 
    (SELECT id FROM activities WHERE slug = 'formula-racing-experience'),
    ai.image_url,
    ai.alt_text,
    false,
    ai.display_order,
    NOW(),
    NOW()
FROM activity_images ai
JOIN activities a ON ai.activity_id = a.id
WHERE a.title IN ('Formula Tours - Tour 1', 'Formula Tours - Tour 2');

-- Copy images from original Boat Rental activities to consolidated activity
INSERT INTO activity_images (
    activity_id,
    image_url,
    alt_text,
    is_primary,
    display_order,
    created_at,
    updated_at
)
SELECT 
    (SELECT id FROM activities WHERE slug = 'private-boat-rental'),
    ai.image_url,
    ai.alt_text,
    false,
    ai.display_order,
    NOW(),
    NOW()
FROM activity_images ai
JOIN activities a ON ai.activity_id = a.id
WHERE a.title IN ('Boat Rental Option 1', 'Boat Rental Option 2', 'Boat Rental Option 3');

-- Update one image to be primary for each consolidated activity
UPDATE activity_images 
SET is_primary = true 
WHERE activity_id = (SELECT id FROM activities WHERE slug = 'jet-ski-adventure-tour')
AND id = (
    SELECT id FROM activity_images 
    WHERE activity_id = (SELECT id FROM activities WHERE slug = 'jet-ski-adventure-tour')
    ORDER BY display_order 
    LIMIT 1
);

UPDATE activity_images 
SET is_primary = true 
WHERE activity_id = (SELECT id FROM activities WHERE slug = 'formula-racing-experience')
AND id = (
    SELECT id FROM activity_images 
    WHERE activity_id = (SELECT id FROM activities WHERE slug = 'formula-racing-experience')
    ORDER BY display_order 
    LIMIT 1
);

UPDATE activity_images 
SET is_primary = true 
WHERE activity_id = (SELECT id FROM activities WHERE slug = 'private-boat-rental')
AND id = (
    SELECT id FROM activity_images 
    WHERE activity_id = (SELECT id FROM activities WHERE slug = 'private-boat-rental')
    ORDER BY display_order 
    LIMIT 1
);

-- =============================================
-- 5. HANDLE EXISTING BOOKINGS (IMPORTANT!)
-- =============================================

-- Before deleting old activities, we need to handle any existing bookings
-- This is a critical step to preserve data integrity

-- Update existing bookings to point to consolidated activities
-- (This is a simplified approach - in production, you'd want more sophisticated handling)

-- Update JetSki bookings
UPDATE bookings 
SET activity_id = (SELECT id FROM activities WHERE slug = 'jet-ski-adventure-tour')
WHERE activity_id IN (
    SELECT id FROM activities 
    WHERE title IN ('Jet Ski 30-Minute Tour', 'Jet Ski 1-Hour Tour')
);

-- Update Formula racing bookings
UPDATE bookings 
SET activity_id = (SELECT id FROM activities WHERE slug = 'formula-racing-experience')
WHERE activity_id IN (
    SELECT id FROM activities 
    WHERE title IN ('Formula Tours - Tour 1', 'Formula Tours - Tour 2')
);

-- Update Boat rental bookings
UPDATE bookings 
SET activity_id = (SELECT id FROM activities WHERE slug = 'private-boat-rental')
WHERE activity_id IN (
    SELECT id FROM activities 
    WHERE title IN ('Boat Rental Option 1', 'Boat Rental Option 2', 'Boat Rental Option 3')
);

-- =============================================
-- 6. CLEAN UP - DELETE OLD ACTIVITIES
-- =============================================

-- Delete old activity pricing first (foreign key constraint)
DELETE FROM activity_pricing 
WHERE activity_id IN (
    SELECT id FROM activities 
    WHERE title IN (
        'Jet Ski 30-Minute Tour', 
        'Jet Ski 1-Hour Tour',
        'Formula Tours - Tour 1',
        'Formula Tours - Tour 2',
        'Boat Rental Option 1',
        'Boat Rental Option 2',
        'Boat Rental Option 3'
    )
);

-- Delete old activity images
DELETE FROM activity_images 
WHERE activity_id IN (
    SELECT id FROM activities 
    WHERE title IN (
        'Jet Ski 30-Minute Tour', 
        'Jet Ski 1-Hour Tour',
        'Formula Tours - Tour 1',
        'Formula Tours - Tour 2',
        'Boat Rental Option 1',
        'Boat Rental Option 2',
        'Boat Rental Option 3'
    )
);

-- Delete old activities
DELETE FROM activities 
WHERE title IN (
    'Jet Ski 30-Minute Tour', 
    'Jet Ski 1-Hour Tour',
    'Formula Tours - Tour 1',
    'Formula Tours - Tour 2',
    'Boat Rental Option 1',
    'Boat Rental Option 2',
    'Boat Rental Option 3'
);

-- =============================================
-- 7. VERIFICATION QUERIES
-- =============================================

-- Verify the consolidation worked
SELECT 
    a.title,
    a.slug,
    a.category,
    COUNT(ap.id) as pricing_options,
    COUNT(ai.id) as images
FROM activities a
LEFT JOIN activity_pricing ap ON a.id = ap.activity_id
LEFT JOIN activity_images ai ON a.id = ai.activity_id
WHERE a.slug IN ('jet-ski-adventure-tour', 'formula-racing-experience', 'private-boat-rental')
GROUP BY a.id, a.title, a.slug, a.category
ORDER BY a.title;

-- Show pricing options for each consolidated activity
SELECT 
    a.title,
    ap.description,
    ap.base_price,
    ap.currency,
    ap.duration_minutes,
    ap.max_participants
FROM activities a
JOIN activity_pricing ap ON a.id = ap.activity_id
WHERE a.slug IN ('jet-ski-adventure-tour', 'formula-racing-experience', 'private-boat-rental')
ORDER BY a.title, ap.base_price;