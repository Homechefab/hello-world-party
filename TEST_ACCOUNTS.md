# 🔐 Test Account Setup

> ⚠️ **SECURITY NOTICE:** Plain-text credentials have been **removed** from this document. Test account passwords are now generated locally and never committed to version control.

## Quick Setup

To create test accounts locally, run:

```bash
npm run create-test-accounts
```

The script generates strong random passwords and writes them to `.test-credentials.local` (which is git-ignored). **Never commit this file.**

**Required environment variables** (in your local `.env`, not committed):

```env
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
VITE_SUPABASE_URL=your-project-url
```

Get your service role key from: [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API → service_role key

---

## 📋 Test Account Roles

The script provisions the following accounts (emails only — passwords are generated at runtime):

| Role | Email | Capabilities |
|------|-------|--------------|
| 👤 Customer | `customer@test.homechef.se` | Browse, order, review |
| 👨‍🍳 Chef | `chef@test.homechef.se` | Manage menu, accept orders (pre-approved kitchen + 3 sample dishes) |
| 🏢 Kitchen Partner | `kitchen@test.homechef.se` | Manage commercial kitchen ("Professional Kitchen AB") |
| 🍽️ Restaurant | `restaurant@test.homechef.se` | Restaurant menu and bulk orders ("Test Restaurant") |
| 🛡️ Admin | `admin@test.homechef.se` | Full platform access |

---

## ⚠️ Production Safety

**CRITICAL:**

- ❌ **NEVER** run `npm run create-test-accounts` against the production Supabase project.
- ❌ **NEVER** commit `.test-credentials.local` or any file containing real passwords.
- ✅ **ALWAYS** point the script at a local/staging Supabase instance.
- ✅ **VERIFY** the configured `VITE_SUPABASE_URL` before running.

If you suspect test accounts were ever provisioned in production:

1. Open [Supabase Auth → Users](https://supabase.com/dashboard/project/_/auth/users).
2. Search for `@test.homechef.se`.
3. Delete any matching accounts immediately.
4. Rotate the service-role key.

---

## 🧪 Common Testing Flows

### Customer Order Flow
1. Login as Customer → browse dishes → place order.
2. Login as Chef → accept and update order status.
3. Switch back to Customer → verify status updates.

### Chef Onboarding
1. Sign up as a new chef → submit application.
2. Login as Admin → approve the application.
3. Login as the new chef → add dishes and set availability.

### Kitchen Partner Flow
1. Login as Kitchen Partner → review chef applications.
2. Approve/reject applications and manage availability.

---

## 🔧 Troubleshooting

- **"Missing environment variables"** → ensure `.env` contains `SUPABASE_SERVICE_ROLE_KEY` and `VITE_SUPABASE_URL`.
- **"User already exists"** → script skips existing users; delete via Supabase Dashboard → Authentication → Users to recreate.
- **Can't login** → check `.test-credentials.local` for the generated password and verify the user exists in the Supabase dashboard.

---

## 📚 Resources

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Setup Instructions](scripts/README.md)
- [Project Documentation](README.md)
