-- =============================================================================
-- SohamLabs Portfolio CMS - Admin Bootstrap Guide & Script
-- =============================================================================
-- How to safely authorize the first admin user:
--
-- Step 1: Open your Supabase Dashboard (https://supabase.com/dashboard)
-- Step 2: Navigate to "Authentication" -> "Users" in the left sidebar.
-- Step 3: Click "Add User" -> "Create User".
--         - Email: sohamgitte125@gmail.com (or your personal admin email)
--         - Password: Choose a strong master password (min 8+ characters)
--         - Auto Confirm User: Checked / Enabled
-- Step 4: After creation, click the copy icon next to the "User UID" column.
-- Step 5: Replace 'PASTE_YOUR_AUTH_USER_UUID_HERE' below with your actual UUID
--         and run this snippet in the Supabase "SQL Editor":
-- =============================================================================

INSERT INTO public.admin_users (user_id, email, role)
VALUES (
  'PASTE_YOUR_AUTH_USER_UUID_HERE'::uuid,
  'sohamgitte125@gmail.com',
  'super_admin'
)
ON CONFLICT (user_id) DO UPDATE SET
  role = 'super_admin',
  updated_at = NOW();

-- Verify that your admin user has been registered properly:
SELECT * FROM public.admin_users;
