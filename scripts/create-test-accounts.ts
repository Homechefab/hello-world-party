/**
 * Script to create test accounts for all roles in the HomeChef platform
 * 
 * Usage: 
 * 1. Make sure you have SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file
 * 2. Run: npx tsx scripts/create-test-accounts.ts
 * 
 * This will create test accounts for:
 * - Customer
 * - Chef
 * - Kitchen Partner
 * - Restaurant
 * - Admin
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables:');
  console.error('   - VITE_SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY');
  console.error('\nPlease add SUPABASE_SERVICE_ROLE_KEY to your .env file');
  console.error('You can find it in Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testAccounts = [
  {
    email: 'customer@test.homechef.se',
    password: 'Test123!',
    role: 'customer',
    fullName: 'Test Customer',
    phone: '+46701234567',
    address: 'Testgatan 1, Stockholm'
  },
  {
    email: 'chef@test.homechef.se',
    password: 'Test123!',
    role: 'chef',
    fullName: 'Test Chef',
    phone: '+46701234568',
    address: 'Köksvägen 2, Stockholm',
    businessName: 'Test Kitchen',
    municipalityApproved: true
  },
  {
    email: 'kitchen@test.homechef.se',
    password: 'Test123!',
    role: 'kitchen_partner',
    fullName: 'Test Kitchen Partner',
    phone: '+46701234569',
    address: 'Industrigatan 3, Stockholm',
    businessName: 'Professional Kitchen AB',
    municipalityApproved: true
  },
  {
    email: 'restaurant@test.homechef.se',
    password: 'Test123!',
    role: 'restaurant',
    fullName: 'Test Restaurant Manager',
    phone: '+46701234570',
    address: 'Restauranggatan 4, Stockholm',
    businessName: 'Test Restaurant',
    municipalityApproved: true
  },
  {
    email: 'admin@test.homechef.se',
    password: 'Test123!',
    role: 'admin',
    fullName: 'Test Admin',
    phone: '+46701234571',
    address: 'Admingatan 5, Stockholm'
  }
];

async function createTestAccounts() {
  console.log('🚀 Starting test account creation...\n');

  for (const account of testAccounts) {
    try {
      console.log(`Creating ${account.role} account: ${account.email}`);

      // Create user with admin API
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true, // Auto-confirm email
        user_metadata: {
          full_name: account.fullName,
          role: account.role
        }
      });

      if (userError) {
        if (userError.message.includes('already registered')) {
          console.log(`⚠️  User ${account.email} already exists, skipping...`);
          continue;
        }
        throw userError;
      }

      if (!userData.user) {
        throw new Error('User creation failed - no user data returned');
      }

      console.log(`✅ Created auth user: ${userData.user.id}`);

      // Update profile with additional information
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          phone: account.phone,
          address: account.address,
          municipality_approved: account.municipalityApproved || false,
          onboarding_completed: true
        })
        .eq('id', userData.user.id);

      if (profileError) {
        console.log(`⚠️  Profile update error: ${profileError.message}`);
      } else {
        console.log(`✅ Updated profile`);
      }

      // Insert user role
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: userData.user.id,
          role: account.role
        });

      if (roleError && !roleError.message.includes('duplicate')) {
        console.log(`⚠️  Role insertion error: ${roleError.message}`);
      } else {
        console.log(`✅ Added role: ${account.role}`);
      }

      // Create chef profile if role is chef, kitchen_partner, or restaurant
      if (['chef', 'kitchen_partner', 'restaurant'].includes(account.role) && account.businessName) {
        const { data: chefData, error: chefError } = await supabase
          .from('chefs')
          .insert({
            user_id: userData.user.id,
            business_name: account.businessName,
            kitchen_approved: true,
            municipality_approval_date: new Date().toISOString()
          })
          .select()
          .single();

        if (chefError) {
          if (chefError.message.includes('duplicate')) {
            console.log(`⚠️  Chef profile already exists`);
          } else {
            console.log(`⚠️  Chef profile error: ${chefError.message}`);
          }
        } else {
          console.log(`✅ Created chef profile`);

          // Create sample dishes for chefs
          if (account.role === 'chef') {
            const dishes = [
              {
                chef_id: chefData.id,
                name: 'Swedish Meatballs',
                description: 'Traditional Swedish meatballs with lingonberry sauce',
                price: 149.00,
                category: 'Main Course',
                ingredients: ['ground beef', 'breadcrumbs', 'cream', 'onions', 'lingonberries'],
                allergens: ['gluten', 'dairy'],
                preparation_time: 45,
                available: true
              },
              {
                chef_id: chefData.id,
                name: 'Pasta Carbonara',
                description: 'Classic Italian pasta with eggs, cheese, and pancetta',
                price: 139.00,
                category: 'Main Course',
                ingredients: ['pasta', 'eggs', 'parmesan', 'pancetta', 'black pepper'],
                allergens: ['gluten', 'dairy', 'eggs'],
                preparation_time: 30,
                available: true
              },
              {
                chef_id: chefData.id,
                name: 'Apple Pie',
                description: 'Homemade apple pie with vanilla sauce',
                price: 89.00,
                category: 'Dessert',
                ingredients: ['apples', 'flour', 'butter', 'sugar', 'cinnamon'],
                allergens: ['gluten', 'dairy'],
                preparation_time: 60,
                available: true
              }
            ];

            const { error: dishesError } = await supabase
              .from('dishes')
              .insert(dishes);

            if (dishesError) {
              console.log(`⚠️  Dishes creation error: ${dishesError.message}`);
            } else {
              console.log(`✅ Created ${dishes.length} sample dishes`);
            }
          }
        }
      }

      console.log(`✅ Successfully created ${account.role} account\n`);

    } catch (error) {
      console.error(`❌ Error creating ${account.role} account:`, error);
      console.log('');
    }
  }

  console.log('✨ Test account creation completed!\n');
  console.log('📋 LOGIN CREDENTIALS:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  testAccounts.forEach(account => {
    console.log(`\n${account.role.toUpperCase()}:`);
    console.log(`  Email:    ${account.email}`);
    console.log(`  Password: ${account.password}`);
    console.log(`  Name:     ${account.fullName}`);
  });
  
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\n⚠️  WARNING: These are test accounts with known passwords.');
  console.log('   DO NOT use these in production!');
  console.log('   Delete these accounts before going live.\n');
}

// Run the script
createTestAccounts().catch(console.error);
