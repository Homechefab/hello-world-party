# Test Accounts Setup

This directory contains a script to create test accounts for all roles in the HomeChef platform.

## Prerequisites

1. Make sure you have your Supabase Service Role Key
   - Go to [Supabase Dashboard](https://supabase.com/dashboard)
   - Navigate to: Settings > API
   - Copy the `service_role` key (NOT the anon key)

2. Add the service role key to your `.env` file:
   ```env
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

## Running the Script

Run the following command from the project root:

```bash
npm run create-test-accounts
```

Or with bun:

```bash
bun run scripts/create-test-accounts.ts
```

## Test Account Credentials

After running the script, you'll have the following test accounts:

### Customer Account
- **Email:** customer@test.homechef.se
- **Password:** Test123!
- **Role:** Customer
- **Access:** Can browse dishes, place orders, leave reviews

### Chef Account
- **Email:** chef@test.homechef.se
- **Password:** Test123!
- **Role:** Chef
- **Access:** Can manage dishes, view orders, update order status
- **Includes:** 3 sample dishes (Swedish Meatballs, Pasta Carbonara, Apple Pie)

### Kitchen Partner Account
- **Email:** kitchen@test.homechef.se
- **Password:** Test123!
- **Role:** Kitchen Partner
- **Access:** Can manage commercial kitchen space, approve chef applications

### Restaurant Account
- **Email:** restaurant@test.homechef.se
- **Password:** Test123!
- **Role:** Restaurant
- **Access:** Restaurant-specific features and management

### Admin Account
- **Email:** admin@test.homechef.se
- **Password:** Test123!
- **Role:** Admin
- **Access:** Full platform access, user management, system configuration

## Security Warning

⚠️ **IMPORTANT:** These are test accounts with publicly known passwords!

- **DO NOT** use these accounts in production
- **DELETE** these accounts before launching to production
- **NEVER** commit the service role key to version control
- Use strong, unique passwords for real user accounts

## What the Script Does

1. Creates user accounts in Supabase Auth
2. Sets up user profiles with contact information
3. Assigns appropriate roles in the `user_roles` table
4. Creates chef profiles for chef/kitchen/restaurant accounts
5. Adds sample dishes for the chef account
6. Auto-confirms email addresses for immediate testing

## Troubleshooting

### "Missing environment variables" error
- Make sure `VITE_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are in your `.env` file

### "User already exists" warning
- The script skips existing users automatically
- Delete the existing test accounts from Supabase Dashboard if you want to recreate them

### Database errors
- Make sure all migrations have been run: `supabase db reset` or `supabase migration up`
- Check that the tables exist: `profiles`, `user_roles`, `chefs`, `dishes`

## Manual Account Creation

If you prefer to create accounts manually:

1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user" > "Create new user"
3. Enter email and password
4. After creation, manually insert records into:
   - `profiles` table
   - `user_roles` table
   - `chefs` table (for chef roles)
