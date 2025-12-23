-- SQL Script to set admin role for support@predicsure.com
-- Run this in Railway database console or any PostgreSQL client

-- Option 1: Update existing user to admin by email
UPDATE users 
SET role = 'admin', "updatedAt" = NOW() 
WHERE email = 'support@predicsure.com';

-- Option 2: Check if update was successful
SELECT id, "openId", name, email, role, "createdAt" 
FROM users 
WHERE email = 'support@predicsure.com';

-- Option 3: List all admin users
SELECT id, name, email, role, "createdAt" 
FROM users 
WHERE role = 'admin';

-- Option 4: Update any user to admin by email (replace with your email)
-- UPDATE users 
-- SET role = 'admin', "updatedAt" = NOW() 
-- WHERE email = 'your-email@example.com';
