-- ========================================
-- PREDICSURE AI - TEST USERS SEED SCRIPT
-- ========================================
-- This script creates 8 test users, one for each personality type
-- Run this in your Railway PostgreSQL database
-- After running, sign up with Clerk using the test emails
-- ========================================

-- Clean up existing test users (optional - uncomment if you want to reset)
-- DELETE FROM psyche_profiles WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-%@test.com');
-- DELETE FROM subscriptions WHERE user_id IN (SELECT id FROM users WHERE email LIKE 'test-%@test.com');
-- DELETE FROM users WHERE email LIKE 'test-%@test.com';

-- ========================================
-- INSERT TEST USERS
-- ========================================

INSERT INTO users (
  "openId", 
  email, 
  name, 
  nickname, 
  "loginMethod", 
  role, 
  badge,
  "onboardingCompleted", 
  interests, 
  "careerProfile",
  "createdAt",
  "updatedAt",
  "lastSignedIn"
) VALUES 
  -- 1. The Maverick (Risk Addict)
  (
    'test_maverick_' || FLOOR(RANDOM() * 1000000)::TEXT,
    'test-maverick@test.com',
    'Test Maverick',
    'Test Maverick',
    'test',
    'user',
    'none',
    true,
    '["career"]',
    '{"position":"mid","direction":"clarity","challenge":"direction","timeline":"6mo"}',
    NOW(),
    NOW(),
    NOW()
  ),
  
  -- 2. The Strategist (Quiet Strategist)
  (
    'test_strategist_' || FLOOR(RANDOM() * 1000000)::TEXT,
    'test-strategist@test.com',
    'Test Strategist',
    'Test Strategist',
    'test',
    'user',
    'none',
    true,
    '["career"]',
    '{"position":"mid","direction":"clarity","challenge":"direction","timeline":"6mo"}',
    NOW(),
    NOW(),
    NOW()
  ),
  
  -- 3. The Visionary (Ambitious Builder)
  (
    'test_visionary_' || FLOOR(RANDOM() * 1000000)::TEXT,
    'test-visionary@test.com',
    'Test Visionary',
    'Test Visionary',
    'test',
    'user',
    'none',
    true,
    '["career"]',
    '{"position":"mid","direction":"clarity","challenge":"direction","timeline":"6mo"}',
    NOW(),
    NOW(),
    NOW()
  ),
  
  -- 4. The Guardian (Stabilizer)
  (
    'test_guardian_' || FLOOR(RANDOM() * 1000000)::TEXT,
    'test-guardian@test.com',
    'Test Guardian',
    'Test Guardian',
    'test',
    'user',
    'none',
    true,
    '["career"]',
    '{"position":"mid","direction":"clarity","challenge":"direction","timeline":"6mo"}',
    NOW(),
    NOW(),
    NOW()
  ),
  
  -- 5. The Pioneer (Long-Term Builder)
  (
    'test_pioneer_' || FLOOR(RANDOM() * 1000000)::TEXT,
    'test-pioneer@test.com',
    'Test Pioneer',
    'Test Pioneer',
    'test',
    'user',
    'none',
    true,
    '["career"]',
    '{"position":"mid","direction":"clarity","challenge":"direction","timeline":"6mo"}',
    NOW(),
    NOW(),
    NOW()
  ),
  
  -- 6. The Pragmatist (Pattern Analyst)
  (
    'test_pragmatist_' || FLOOR(RANDOM() * 1000000)::TEXT,
    'test-pragmatist@test.com',
    'Test Pragmatist',
    'Test Pragmatist',
    'test',
    'user',
    'none',
    true,
    '["career"]',
    '{"position":"mid","direction":"clarity","challenge":"direction","timeline":"6mo"}',
    NOW(),
    NOW(),
    NOW()
  ),
  
  -- 7. The Catalyst (Momentum Chaser)
  (
    'test_catalyst_' || FLOOR(RANDOM() * 1000000)::TEXT,
    'test-catalyst@test.com',
    'Test Catalyst',
    'Test Catalyst',
    'test',
    'user',
    'none',
    true,
    '["career"]',
    '{"position":"mid","direction":"clarity","challenge":"direction","timeline":"6mo"}',
    NOW(),
    NOW(),
    NOW()
  ),
  
  -- 8. The Adapter (Intuitive Empath)
  (
    'test_adapter_' || FLOOR(RANDOM() * 1000000)::TEXT,
    'test-adapter@test.com',
    'Test Adapter',
    'Test Adapter',
    'test',
    'user',
    'none',
    true,
    '["career"]',
    '{"position":"mid","direction":"clarity","challenge":"direction","timeline":"6mo"}',
    NOW(),
    NOW(),
    NOW()
  );

-- ========================================
-- INSERT PSYCHE PROFILES
-- ========================================

-- 1. The Maverick (Risk Addict)
INSERT INTO psyche_profiles (
  "userId",
  "psycheType",
  "displayName",
  description,
  "coreTraits",
  "decisionMakingStyle",
  "growthEdge",
  "psycheParameters",
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id,
  'risk_addict',
  'The Maverick',
  'Bold, passionate, and driven by instinct. You thrive on taking risks and making quick, decisive moves based on your gut feelings.',
  '["Risk-embracing","Emotionally expressive","Present-focused","Intuitive"]',
  'Quick decision-making with high energy and adaptability',
  'May act impulsively and struggle with patience',
  '{"risk_appetite":0.9,"emotional_reactivity":0.9,"time_horizon":0.2,"analytical_weight":0.2,"volatility_tolerance":0.9,"change_aversion":0.1}',
  NOW(),
  NOW()
FROM users u 
WHERE u.email = 'test-maverick@test.com';

-- 2. The Strategist (Quiet Strategist)
INSERT INTO psyche_profiles (
  "userId",
  "psycheType",
  "displayName",
  description,
  "coreTraits",
  "decisionMakingStyle",
  "growthEdge",
  "psycheParameters",
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id,
  'quiet_strategist',
  'The Strategist',
  'Methodical, patient, and data-driven. You excel at long-term planning and making calculated decisions based on thorough analysis.',
  '["Risk-averse","Emotionally measured","Future-oriented","Analytical"]',
  'Strategic thinking with consistent execution and risk management',
  'May miss time-sensitive opportunities and struggle with uncertainty',
  '{"risk_appetite":0.2,"emotional_reactivity":0.2,"time_horizon":0.9,"analytical_weight":0.9,"volatility_tolerance":0.1,"change_aversion":0.8}',
  NOW(),
  NOW()
FROM users u 
WHERE u.email = 'test-strategist@test.com';

-- 3. The Visionary (Ambitious Builder)
INSERT INTO psyche_profiles (
  "userId",
  "psycheType",
  "displayName",
  description,
  "coreTraits",
  "decisionMakingStyle",
  "growthEdge",
  "psycheParameters",
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id,
  'ambitious_builder',
  'The Visionary',
  'Bold yet calculated, you take big risks backed by solid research. You balance ambition with strategic thinking for long-term success.',
  '["Calculated risk-taker","Emotionally controlled","Future-oriented","Strategic"]',
  'Big-picture thinking with disciplined execution',
  'May undervalue emotional factors and be overly confident',
  '{"risk_appetite":0.8,"emotional_reactivity":0.3,"time_horizon":0.8,"analytical_weight":0.8,"volatility_tolerance":0.7,"change_aversion":0.3}',
  NOW(),
  NOW()
FROM users u 
WHERE u.email = 'test-visionary@test.com';

-- 4. The Guardian (Stabilizer)
INSERT INTO psyche_profiles (
  "userId",
  "psycheType",
  "displayName",
  description,
  "coreTraits",
  "decisionMakingStyle",
  "growthEdge",
  "psycheParameters",
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id,
  'stabilizer',
  'The Guardian',
  'Protective, emotionally attuned, and focused on long-term security. You prioritize stability and deep connections over quick wins.',
  '["Risk-cautious","Emotionally aware","Future-oriented","Intuitive"]',
  'Emotionally intelligent with strong protective instincts',
  'May avoid necessary risks and struggle with change',
  '{"risk_appetite":0.2,"emotional_reactivity":0.8,"time_horizon":0.8,"analytical_weight":0.3,"volatility_tolerance":0.2,"change_aversion":0.8}',
  NOW(),
  NOW()
FROM users u 
WHERE u.email = 'test-guardian@test.com';

-- 5. The Pioneer (Long-Term Builder)
INSERT INTO psyche_profiles (
  "userId",
  "psycheType",
  "displayName",
  description,
  "coreTraits",
  "decisionMakingStyle",
  "growthEdge",
  "psycheParameters",
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id,
  'long_term_builder',
  'The Pioneer',
  'Passionate and ambitious with a long-term vision. You are willing to take bold risks to achieve your dreams and inspire others.',
  '["Risk-embracing","Emotionally driven","Future-oriented","Visionary"]',
  'Inspirational leadership with high motivation',
  'May overextend resources and be emotionally volatile',
  '{"risk_appetite":0.8,"emotional_reactivity":0.8,"time_horizon":0.9,"analytical_weight":0.4,"volatility_tolerance":0.7,"change_aversion":0.2}',
  NOW(),
  NOW()
FROM users u 
WHERE u.email = 'test-pioneer@test.com';

-- 6. The Pragmatist (Pattern Analyst)
INSERT INTO psyche_profiles (
  "userId",
  "psycheType",
  "displayName",
  description,
  "coreTraits",
  "decisionMakingStyle",
  "growthEdge",
  "psycheParameters",
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id,
  'pattern_analyst',
  'The Pragmatist',
  'Practical, grounded, and focused on what works right now. You make steady, rational decisions based on current realities.',
  '["Risk-averse","Emotionally neutral","Present-focused","Practical"]',
  'Reliable execution with clear-headed decisions',
  'May lack long-term vision and be overly conservative',
  '{"risk_appetite":0.3,"emotional_reactivity":0.3,"time_horizon":0.3,"analytical_weight":0.8,"volatility_tolerance":0.3,"change_aversion":0.6}',
  NOW(),
  NOW()
FROM users u 
WHERE u.email = 'test-pragmatist@test.com';

-- 7. The Catalyst (Momentum Chaser)
INSERT INTO psyche_profiles (
  "userId",
  "psycheType",
  "displayName",
  description,
  "coreTraits",
  "decisionMakingStyle",
  "growthEdge",
  "psycheParameters",
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id,
  'momentum_chaser',
  'The Catalyst',
  'Energetic, spontaneous, and emotionally expressive. You live in the moment and inspire action through your passion and enthusiasm.',
  '["Emotionally expressive","Present-focused","Intuitive","Action-oriented"]',
  'High energy with inspiring presence',
  'May lack long-term planning and be impulsive',
  '{"risk_appetite":0.7,"emotional_reactivity":0.8,"time_horizon":0.2,"analytical_weight":0.3,"volatility_tolerance":0.8,"change_aversion":0.2}',
  NOW(),
  NOW()
FROM users u 
WHERE u.email = 'test-catalyst@test.com';

-- 8. The Adapter (Intuitive Empath)
INSERT INTO psyche_profiles (
  "userId",
  "psycheType",
  "displayName",
  description,
  "coreTraits",
  "decisionMakingStyle",
  "growthEdge",
  "psycheParameters",
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id,
  'intuitive_empath',
  'The Adapter',
  'Flexible, balanced, and context-aware. You adjust your approach based on the situation, blending intuition with analysis and caution with boldness.',
  '["Balanced risk approach","Emotionally flexible","Adaptable time horizon","Situational decision-making"]',
  'Versatile and context-sensitive approach',
  'May lack clear identity and struggle with commitment',
  '{"risk_appetite":0.5,"emotional_reactivity":0.5,"time_horizon":0.5,"analytical_weight":0.5,"volatility_tolerance":0.5,"change_aversion":0.5}',
  NOW(),
  NOW()
FROM users u 
WHERE u.email = 'test-adapter@test.com';

-- ========================================
-- INSERT SUBSCRIPTIONS
-- ========================================

INSERT INTO subscriptions (
  "userId",
  tier,
  "dailyLimit",
  "usedToday",
  "totalUsed",
  "lastResetDate",
  "currentStreak",
  "longestStreak",
  "billingInterval",
  "isActive",
  "createdAt",
  "updatedAt"
)
SELECT 
  u.id,
  'free',
  10, -- Higher limit for testing
  0,
  0,
  NOW(),
  0,
  0,
  'monthly',
  true,
  NOW(),
  NOW()
FROM users u 
WHERE u.email LIKE 'test-%@test.com';

-- ========================================
-- VERIFICATION QUERY
-- ========================================
-- Run this to verify all test users were created successfully

SELECT 
  u.email,
  u.nickname,
  pp."displayName" as personality,
  pp."psycheType",
  s.tier,
  s."dailyLimit"
FROM users u
LEFT JOIN psyche_profiles pp ON u.id = pp."userId"
LEFT JOIN subscriptions s ON u.id = s."userId"
WHERE u.email LIKE 'test-%@test.com'
ORDER BY u.email;

-- ========================================
-- DONE!
-- ========================================
-- You should see 8 test users with their personalities
-- Now sign up with Clerk using these emails:
--   - test-maverick@test.com
--   - test-strategist@test.com
--   - test-visionary@test.com
--   - test-guardian@test.com
--   - test-pioneer@test.com
--   - test-pragmatist@test.com
--   - test-catalyst@test.com
--   - test-adapter@test.com
-- Password: Whatever you want (set during Clerk signup)
-- ========================================
