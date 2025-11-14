# 🔐 Test Account Credentials

## Quick Setup

To create all test accounts, run:

```bash
npm run create-test-accounts
```

**Important:** You need to add your Supabase Service Role Key to `.env` first:

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

Get your service role key from: [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API → service_role key

---

## 📋 Test Account Login Details

### 👤 Customer Account
```
Email:    customer@test.homechef.se
Password: Test123!
Role:     Customer
```
**Can do:**
- Browse available dishes
- Place orders
- Track order status
- Leave reviews for completed orders
- Manage profile and preferences

---

### 👨‍🍳 Chef Account
```
Email:    chef@test.homechef.se
Password: Test123!
Role:     Chef
```
**Can do:**
- Manage personal dishes menu
- View and accept orders
- Update order preparation status
- View customer reviews
- Access chef dashboard

**Includes:**
- ✅ Pre-approved kitchen
- 📦 3 sample dishes:
  - Swedish Meatballs (149 kr)
  - Pasta Carbonara (139 kr)
  - Apple Pie (89 kr)

---

### 🏢 Kitchen Partner Account
```
Email:    kitchen@test.homechef.se
Password: Test123!
Role:     Kitchen Partner
```
**Can do:**
- Manage commercial kitchen space
- Approve/reject chef applications
- Set kitchen availability
- Manage kitchen equipment listings
- Track kitchen usage

**Includes:**
- ✅ Pre-approved commercial kitchen
- Business: "Professional Kitchen AB"

---

### 🍽️ Restaurant Account
```
Email:    restaurant@test.homechef.se
Password: Test123!
Role:     Restaurant
```
**Can do:**
- Manage restaurant menu
- Process bulk orders
- Restaurant-specific features
- Business management tools

**Includes:**
- ✅ Pre-approved business
- Business: "Test Restaurant"

---

### 🛡️ Admin Account
```
Email:    admin@test.homechef.se
Password: Test123!
Role:     Admin
```
**Can do:**
- Full platform access
- User management
- System configuration
- View all orders and transactions
- Moderate content and reviews
- Manage platform settings

---

## ⚠️ Security Warning

**CRITICAL:** These are test accounts with publicly known passwords!

- ❌ **DO NOT** use in production
- ❌ **NEVER** store real payment information
- ❌ **DELETE** before launching to production
- ✅ **ONLY** use for development and testing

---

## 🧪 Testing Scenarios

### Test a Customer Order Flow
1. Login as **Customer** (customer@test.homechef.se)
2. Browse dishes created by the Chef account
3. Add items to cart and place an order
4. Logout and login as **Chef** (chef@test.homechef.se)
5. Accept and update the order status
6. Switch back to **Customer** and view order updates

### Test Chef Onboarding
1. Create a new chef account via signup
2. Login as **Admin** (admin@test.homechef.se)
3. Review and approve the chef application
4. Switch to the new chef account
5. Add dishes and set availability

### Test Kitchen Partner Flow
1. Login as **Kitchen Partner** (kitchen@test.homechef.se)
2. View chef applications for kitchen space
3. Approve/reject applications
4. Manage kitchen availability

---

## 🔧 Troubleshooting

### Script fails with "Missing environment variables"
- Add `SUPABASE_SERVICE_ROLE_KEY` to your `.env` file
- Make sure `VITE_SUPABASE_URL` is also present

### "User already exists" warnings
- The script skips existing users automatically
- To recreate: Delete from Supabase Dashboard → Authentication → Users

### Can't login with test accounts
- Make sure the script ran successfully
- Check Supabase Dashboard → Authentication → Users to verify accounts exist
- Confirm email addresses are verified (should auto-confirm)

### Missing dishes for chef account
- Re-run the script: `npm run create-test-accounts`
- Check Supabase Dashboard → Table Editor → dishes

---

## 📚 Additional Resources

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Setup Instructions](scripts/README.md)
- [Project Documentation](README.md)

---

**Last Updated:** November 12, 2025
