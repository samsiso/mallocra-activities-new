-- Simple Activity Consolidation Script
-- Execute these queries one by one to consolidate duplicate activities

-- =============================================
-- STEP 1: Create consolidated JetSki Tour activity
-- =============================================

INSERT INTO activities (
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
    status
) VALUES (
    'Jet Ski Adventure Tour',
    'jet-ski-adventure-tour',
    'Experience the thrill of jet skiing along Mallorca''s stunning coastline. Choose from our 30-minute taster session or extend your adventure with our full 1-hour tour. Perfect for beginners and experienced riders alike, our guided jet ski tours offer an unforgettable water sports experience with breathtaking views of the Mediterranean.',
    'Thrilling jet ski tours along Mallorca''s coastline - choose 30 minutes or 1 hour',
    'water_sports',
    'Palma Bay Marina',
    60,
    2,
    'beginner',
    'Free cancellation up to 24 hours before the tour',
    'Swimwear, towel, sunscreen, waterproof camera (optional)',
    'Professional guide, safety equipment, brief training session, fuel',
    'Minimum age 16 years. Valid driving license required for driver.',
    'active'
);

-- =============================================
-- STEP 2: Add JetSki pricing variations
-- =============================================

-- Get the activity ID for JetSki (you'll need to replace with actual ID)
-- SELECT id FROM activities WHERE slug = 'jet-ski-adventure-tour';

-- 30-minute option
INSERT INTO activity_pricing (
    activity_id,
    price_type,
    base_price,
    currency,
    description,
    duration_minutes
) VALUES (
    (SELECT id FROM activities WHERE slug = 'jet-ski-adventure-tour'),
    'adult',
    99.00,
    'EUR',
    '30-minute jet ski tour',
    30
);

-- 1-hour option  
INSERT INTO activity_pricing (
    activity_id,
    price_type,
    base_price,
    currency,
    description,
    duration_minutes
) VALUES (
    (SELECT id FROM activities WHERE slug = 'jet-ski-adventure-tour'),
    'adult',
    159.00,
    'EUR',
    '1-hour jet ski tour',
    60
);

-- =============================================
-- STEP 3: Create consolidated Formula Racing activity
-- =============================================

INSERT INTO activities (
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
    status
) VALUES (
    'Formula Racing Experience',
    'formula-racing-experience',
    'Get behind the wheel of a real Formula racing car and experience the thrill of high-speed racing on professional tracks. Choose from our introductory 2.5-hour session or our comprehensive 4.5-hour advanced experience. Both tours include professional instruction, safety briefing, and the chance to push these incredible machines to their limits.',
    'Professional Formula racing experience - choose from 2.5 or 4.5 hour sessions',
    'land_adventures',
    'Formula Racing Circuit, Mallorca',
    270,
    20,
    'intermediate',
    'Free cancellation up to 48 hours before the experience',
    'Closed-toe shoes, comfortable clothing, valid driving license',
    'Professional instructor, safety equipment, racing car, fuel, timing system',
    'Minimum age 18 years. Valid driving license required. Medical clearance may be required.',
    'active'
);

-- =============================================
-- STEP 4: Add Formula Racing pricing variations
-- =============================================

-- 2.5-hour introductory session
INSERT INTO activity_pricing (
    activity_id,
    price_type,
    base_price,
    currency,
    description,
    duration_minutes
) VALUES (
    (SELECT id FROM activities WHERE slug = 'formula-racing-experience'),
    'adult',
    59.00,
    'EUR',
    'Introductory Formula racing session (2.5 hours)',
    150
);

-- 4.5-hour advanced experience
INSERT INTO activity_pricing (
    activity_id,
    price_type,
    base_price,
    currency,
    description,
    duration_minutes
) VALUES (
    (SELECT id FROM activities WHERE slug = 'formula-racing-experience'),
    'adult',
    79.00,
    'EUR',
    'Advanced Formula racing experience (4.5 hours)',
    270
);

-- =============================================
-- STEP 5: Create consolidated Boat Rental activity
-- =============================================

INSERT INTO activities (
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
    status
) VALUES (
    'Private Boat Rental',
    'private-boat-rental',
    'Charter your own private boat and explore Mallorca''s stunning coastline at your own pace. Choose from our fleet of well-maintained boats accommodating different group sizes and budgets. All boats come with safety equipment and optional captain service. Perfect for families, couples, or groups looking for a personalized maritime adventure.',
    'Private boat charter with flexible duration and capacity options',
    'water_sports',
    'Marina Port de Mallorca',
    60,
    10,
    'beginner',
    'Free cancellation up to 24 hours before rental',
    'Swimwear, towel, sunscreen, snacks and drinks',
    'Boat rental, safety equipment, fuel, basic navigation briefing',
    'Valid boat license required for self-drive or captain service available for additional fee.',
    'active'
);

-- =============================================
-- STEP 6: Add Boat Rental pricing variations
-- =============================================

-- Compact boat (6 people)
INSERT INTO activity_pricing (
    activity_id,
    price_type,
    base_price,
    currency,
    description,
    max_participants
) VALUES (
    (SELECT id FROM activities WHERE slug = 'private-boat-rental'),
    'adult',
    320.00,
    'EUR',
    'Compact boat rental (up to 6 people) - per hour',
    6
);

-- Standard boat (8 people)
INSERT INTO activity_pricing (
    activity_id,
    price_type,
    base_price,
    currency,
    description,
    max_participants
) VALUES (
    (SELECT id FROM activities WHERE slug = 'private-boat-rental'),
    'adult',
    350.00,
    'EUR',
    'Standard boat rental (up to 8 people) - per hour',
    8
);

-- Premium boat (10 people)
INSERT INTO activity_pricing (
    activity_id,
    price_type,
    base_price,
    currency,
    description,
    max_participants
) VALUES (
    (SELECT id FROM activities WHERE slug = 'private-boat-rental'),
    'adult',
    380.00,
    'EUR',
    'Premium boat rental (up to 10 people) - per hour',
    10
);

-- =============================================
-- STEP 7: VERIFICATION - Check new consolidated activities
-- =============================================

-- Check consolidated activities
SELECT 
    a.title,
    a.slug,
    a.category,
    COUNT(ap.id) as pricing_options
FROM activities a
LEFT JOIN activity_pricing ap ON a.id = ap.activity_id
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

-- =============================================
-- STEP 8: CLEANUP - Delete old duplicate activities
-- =============================================

-- WARNING: Only run these after verifying the consolidated activities are correct
-- and after updating any existing bookings to reference the new consolidated activities

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