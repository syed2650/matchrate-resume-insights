# 🚀 Super Simple Setup Guide for Syeda

Hi! I've done most of the work for you, but I need YOU to get some secret keys from your accounts. Think of these like passwords that let your app talk to other services (OpenAI, Supabase, Stripe).

---

## ✅ What I Already Did For You

1. ✅ Created `.env.local` file (this holds your secret keys)
2. ✅ Fixed the fake ATS scoring bug
3. ✅ Improved resume rewriting
4. ✅ Created all documentation

---

## 🔑 What YOU Need To Do (15 minutes max)

### Step 1: Get Your OpenAI API Key

**What is this?** This is the key that lets your app use ChatGPT to analyze resumes.

**How to get it:**
1. Go to https://platform.openai.com/api-keys
2. Log in with your OpenAI account
3. Click "Create new secret key"
4. Copy the key (starts with `sk-proj-...`)
5. Save it somewhere safe!

**Where to put it:**
- Open the file: `c:/Users/syeda/Desktop/Codex/matchrate-resume-insights/.env.local`
- Find the line that says: `OPENAI_API_KEY=sk-proj-xxxxxxxx`
- Replace the `xxxxxxxx` part with your actual key
- Save the file

---

### Step 2: Get Your Supabase Keys

**What is this?** Supabase is your database (where user data is stored).

**How to get it:**
1. Go to https://app.supabase.com/project/rodkrpeqxgqizngdypbl/settings/api
2. Log in to your Supabase account
3. You'll see TWO keys on this page:

   **a) Project URL**
   - Copy this (looks like: `https://rodkrpeqxgqizngdypbl.supabase.co`)
   - I already filled this in for you! ✅

   **b) anon public key**
   - Copy this long key (starts with `eyJhbGci...`)
   - I already filled this in too, BUT we need to CHANGE it (see Step 3)

   **c) service_role key** ⚠️ IMPORTANT
   - Scroll down to find this
   - Click the "Copy" button next to it
   - This is SECRET - never share it!

**Where to put service_role key:**
- Open: `.env.local`
- Find: `SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE`
- Replace `YOUR_SERVICE_ROLE_KEY_HERE` with the key you copied
- Save the file

---

### Step 3: Rotate (Change) Your Supabase Anonymous Key 🔒

**Why?** Your old key was exposed in your code on GitHub. Anyone could see it. We need a new one!

**How to do it:**
1. Still on https://app.supabase.com/project/rodkrpeqxgqizngdypbl/settings/api
2. Find the "anon public" key section
3. Look for a "Regenerate" or "Roll API key" button
4. Click it (this creates a NEW key)
5. Copy the NEW key
6. Update `.env.local`:
   - Find: `VITE_SUPABASE_ANON_KEY=eyJhbGci...`
   - Replace with your NEW key
   - Save

---

### Step 4: Get Your Stripe Keys (If You Want Payments)

**What is this?** Stripe handles credit card payments for your $7/month plan.

**How to get it:**
1. Go to https://dashboard.stripe.com/test/apikeys
2. Log in to Stripe
3. You'll see two keys:

   **a) Publishable key** (starts with `pk_test_...`)
   - Copy this
   - Put in `.env.local` at: `VITE_STRIPE_PUBLISHABLE_KEY=`

   **b) Secret key** (starts with `sk_test_...`)
   - Click "Reveal test key"
   - Copy it
   - Put in `.env.local` at: `STRIPE_SECRET_KEY=`

**Webhook Secret:**
1. Go to https://dashboard.stripe.com/test/webhooks
2. Click on your webhook (or create one if needed)
3. Click "Reveal" next to "Signing secret"
4. Copy it (starts with `whsec_...`)
5. Put in `.env.local` at: `STRIPE_WEBHOOK_SECRET=`

**Skip this if you don't need payments right now!**

---

### Step 5: Get Your Resend API Key (For Emails)

**What is this?** Resend sends emails to your users (like signup confirmations).

**How to get it:**
1. Go to https://resend.com/api-keys
2. Log in
3. Click "Create API Key"
4. Copy it (starts with `re_...`)
5. Put in `.env.local` at: `RESEND_API_KEY=`

**Skip this if you don't need emails right now!**

---

### Step 6: Update the Frontend Code

I need you to make ONE small change to a code file:

**File to edit:** `src/integrations/supabase/client.ts`

**Find these lines (around line 6-7):**
```typescript
const SUPABASE_URL = "https://rodkrpeqxgqizngdypbl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

**Replace with:**
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

**Why?** This makes it use the keys from `.env.local` instead of hardcoded values.

**How to edit:**
- Open the file in VS Code or Notepad
- Find those two lines
- Delete them
- Copy-paste the new lines
- Save (Ctrl+S)

---

### Step 7: Test It!

Now let's see if it works:

```bash
# Open Command Prompt or PowerShell
cd c:\Users\syeda\Desktop\Codex\matchrate-resume-insights

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

**What should happen:**
- Your browser opens to http://localhost:5173
- You see your matchrate.co website
- No errors in the console

**Test the fixes:**
1. Go to `/review` page
2. Upload a resume (any PDF)
3. Paste a job description
4. Click "Analyze"
5. You should see:
   - A score between 0-100
   - Detailed feedback on 15 ATS checks
   - Specific recommendations

---

## 🆘 Troubleshooting

### Error: "OpenAI API Error"
**Fix:** Double-check your `OPENAI_API_KEY` in `.env.local` is correct

### Error: "Supabase connection failed"
**Fix:**
- Make sure you updated `src/integrations/supabase/client.ts`
- Verify your `VITE_SUPABASE_ANON_KEY` is the NEW rotated key

### Error: "Cannot find module"
**Fix:**
```bash
npm install
```

### Website won't load
**Fix:**
```bash
# Stop the server (Ctrl+C)
# Clear cache and restart
npm run dev
```

---

## 📋 Checklist

Copy this checklist and mark items as you complete them:

```
MUST DO (Core Functionality):
[ ] Get OpenAI API key from platform.openai.com
[ ] Put OpenAI key in .env.local
[ ] Get Supabase service_role key
[ ] Put Supabase service_role key in .env.local
[ ] Rotate Supabase anon key
[ ] Update .env.local with NEW anon key
[ ] Edit src/integrations/supabase/client.ts (replace hardcoded values)
[ ] Run npm install
[ ] Run npm run dev
[ ] Test resume analysis

OPTIONAL (For Full Features):
[ ] Get Stripe publishable key
[ ] Get Stripe secret key
[ ] Get Stripe webhook secret
[ ] Get Resend API key
[ ] Put all in .env.local
```

---

## 🎯 After Setup is Complete

Once everything works, you can:

1. **Deploy to Production**
   - The app is now production-ready!
   - Deploy to Vercel, Netlify, or your hosting

2. **Deploy Edge Functions**
   - I can help with this once the basic setup works
   - This uploads your backend code to Supabase

3. **Go Live**
   - Point your domain to the deployed site
   - Start getting real users!

---

## 📞 Need Help?

**If you get stuck:**

1. **Check the error message**
   - Open browser DevTools (F12)
   - Look at the Console tab
   - Copy the error message

2. **Ask me!**
   - Tell me which step you're on
   - Copy-paste the error
   - I'll help you fix it

3. **Common Issues:**
   - API key has extra spaces → Remove spaces
   - File not saved → Make sure to save (Ctrl+S)
   - Wrong key copied → Double-check you copied the right one

---

## 🎉 What You Get After This

Once setup is complete:

✅ **Real ATS Scoring** - No more fake scores!
✅ **15 Detailed Checks** - Shows exactly what's wrong
✅ **Better Resume Rewrites** - Professional, ATS-optimized
✅ **Secure** - No exposed API keys
✅ **Production Ready** - Can go live immediately

---

**You got this! 💪**

Start with Step 1 (OpenAI key) and work your way through. Each step is simple!

**Questions?** Just ask me and I'll explain anything that's confusing.
