# 🚀 BooksyGo Launch Checklist

Ghid complet pentru lansarea BooksyGo în producție.

---

## ✅ **WEEK 1: Setup & Testing (5-7 zile)**

### **Day 1-2: API Configuration**

#### **1. Skyscanner Travel API**
- [ ] Sign up la https://partners.skyscanner.net/
- [ ] Request API access (poate dura 1-3 zile pentru aprobare)
- [ ] Obține `API_KEY` și `AFFILIATE_ID`
- [ ] Testează cu dummy requests
- [ ] Documentație: `docs/SKYSCANNER_API_SETUP.md`

**Environment Variables:**
```bash
NEXT_PUBLIC_SKYSCANNER_AFFILIATE_ID=your_affiliate_id
SKYSCANNER_API_KEY=your_api_key
```

**Estimated Cost:** FREE (affiliate model)
**Revenue Potential:** €5-15 per booking

---

#### **2. Booking.com Affiliate Program**
- [ ] Sign up la https://www.booking.com/affiliate
- [ ] Obține `AFFILIATE_ID`
- [ ] Setup tracking pixels (optional)
- [ ] Testează link generation

**Environment Variables:**
```bash
NEXT_PUBLIC_BOOKING_COM_AFFILIATE_ID=your_affiliate_id
```

**Estimated Cost:** FREE (affiliate model)
**Revenue Potential:** 25-40% commission per booking

---

#### **3. Stripe Payment**
- [ ] Sign up la https://stripe.com
- [ ] Obține `PUBLISHABLE_KEY` și `SECRET_KEY`
- [ ] Setup webhook endpoint: `/api/stripe/webhook`
- [ ] Configure products pentru Premium Packages
- [ ] Test cu test cards (4242 4242 4242 4242)

**Environment Variables:**
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Estimated Cost:** 2.9% + €0.30 per transaction
**Revenue Potential:** €200-2000 per premium package

---

#### **4. OpenAI API (pentru AI Chat)**
- [ ] Sign up la https://platform.openai.com
- [ ] Obține `API_KEY`
- [ ] Setup billing (minim $5)
- [ ] Choose model: `gpt-4o-mini` (cheap) sau `gpt-4o` (better)
- [ ] Set usage limits (max $50/month to start)

**Environment Variables:**
```bash
OPENAI_API_KEY=sk-proj-...
OPENAI_MODEL=gpt-4o-mini
```

**Estimated Cost:** $0.15-3 per 1M tokens (~€0.14-2.80)
**Expected Monthly:** €20-50 pentru 1000 useri

---

#### **5. Google OAuth (Social Login)**
- [ ] Go to https://console.cloud.google.com
- [ ] Create new project "BooksyGo"
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Add authorized redirect URIs:
  - `http://localhost:3001/api/auth/google/callback` (dev)
  - `https://api.booksygo.com/api/auth/google/callback` (prod)

**Environment Variables:**
```bash
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

**Estimated Cost:** FREE

---

#### **6. Facebook OAuth (Social Login)**
- [ ] Go to https://developers.facebook.com
- [ ] Create new app "BooksyGo"
- [ ] Add "Facebook Login" product
- [ ] Configure OAuth redirect URIs (same as Google)
- [ ] Submit for review (can take 1-2 weeks)

**Environment Variables:**
```bash
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
```

**Estimated Cost:** FREE
**Note:** Poți lansa fără Facebook - nu e critic

---

#### **7. Apple Sign In (Social Login - Optional)**
- [ ] Go to https://developer.apple.com
- [ ] Requires Apple Developer Account ($99/year)
- [ ] Create Service ID
- [ ] Configure domains and redirect URIs

**Environment Variables:**
```bash
APPLE_CLIENT_ID=your_service_id
APPLE_TEAM_ID=your_team_id
APPLE_KEY_ID=your_key_id
APPLE_PRIVATE_KEY=your_private_key
```

**Estimated Cost:** $99/year
**Priority:** LOW - poți lansa fără

---

### **Day 3-4: Local Testing**

#### **Complete User Journey Test:**

1. **Registration Flow:**
   - [ ] Email/Password signup works
   - [ ] Email validation works (if implemented)
   - [ ] JWT token is generated
   - [ ] User is redirected to dashboard

2. **Login Flow:**
   - [ ] Email/Password login works
   - [ ] JWT token is stored
   - [ ] Protected routes work
   - [ ] Logout works

3. **Flight Search:**
   - [ ] Search form validation works
   - [ ] API call to Skyscanner works (or mock data loads)
   - [ ] Results display correctly
   - [ ] Filters work
   - [ ] Sorting works
   - [ ] "Vezi pe Skyscanner" opens affiliate link
   - [ ] Affiliate click is tracked

4. **Hotel Search:**
   - [ ] Search form validation works
   - [ ] Results display correctly
   - [ ] Filters work
   - [ ] "Vezi pe Booking.com" opens affiliate link
   - [ ] Affiliate click is tracked

5. **Package Search:**
   - [ ] Package listing works
   - [ ] Package detail page works
   - [ ] Stripe checkout opens
   - [ ] Payment success/cancel redirects work

6. **Booking Flow:**
   - [ ] Flight booking creation works
   - [ ] Hotel booking creation works
   - [ ] Booking is saved to database
   - [ ] Booking appears in dashboard
   - [ ] "Vezi toate" scroll works
   - [ ] Quick actions (Rezervă Zbor/Hotel) work

7. **Dashboard:**
   - [ ] User profile displays correctly
   - [ ] BooksyPoints display (even if mock)
   - [ ] Active bookings show
   - [ ] Booking history shows
   - [ ] Cancel booking works
   - [ ] Stats cards update

8. **Premium Page:**
   - [ ] Premium packages display
   - [ ] "Vorbește cu un Consultant" button is visible
   - [ ] Package detail pages work

9. **AI Chat:**
   - [ ] Chat window opens
   - [ ] Messages send/receive (even if mock)
   - [ ] Floating chat button is visible
   - [ ] Chat button icon is white robot

10. **Mobile Responsive:**
    - [ ] Homepage looks good on mobile
    - [ ] Search forms work on mobile
    - [ ] Booking flow works on mobile
    - [ ] Dashboard is readable on mobile

---

### **Day 5: Bug Fixes**

- [ ] Fix any bugs found during testing
- [ ] Polish UI/UX issues
- [ ] Test edge cases (empty states, error messages)
- [ ] Check console for errors
- [ ] Run linter and fix warnings

---

## ✅ **WEEK 2: Deployment (5-7 zile)**

### **Day 6-7: Production Setup**

#### **1. Choose Hosting Providers:**

**Frontend (Next.js):**
- **RECOMMENDED:** Vercel (free tier, perfect for Next.js)
- Alternatives: Netlify, Cloudflare Pages

**Backend (NestJS):**
- **RECOMMENDED:** Railway (€5-20/month, easy setup)
- Alternatives: Render (free tier available), DigitalOcean ($12/month), AWS/GCP (complex)

**Database (PostgreSQL):**
- **RECOMMENDED:** Supabase (free tier 500MB)
- Alternatives: Neon (free tier), Railway (€5-10/month), DigitalOcean ($15/month)

**Redis (Caching - Optional pentru MVP):**
- Railway (€3-5/month)
- Upstash (free tier)

**Estimated Monthly Cost:** €10-30 pentru start

---

#### **2. Deploy Database First:**

**Option A: Supabase (Recommended)**
```bash
# 1. Sign up at https://supabase.com
# 2. Create new project "BooksyGo"
# 3. Wait 2 minutes for provisioning
# 4. Go to Settings > Database
# 5. Copy connection string

# 6. Update .env.production
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# 7. Run migrations
cd services/user-service
npx prisma migrate deploy

cd ../booking-service
npx prisma migrate deploy
```

---

#### **3. Deploy Backend Services:**

**Option A: Railway (Recommended)**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy User Service
cd services/user-service
railway init
railway up

# Get service URL
railway domain

# Deploy Booking Service
cd ../booking-service
railway init
railway up
railway domain

# Set environment variables in Railway dashboard
# JWT_SECRET, DATABASE_URL, GOOGLE_CLIENT_ID, etc.
```

**Environment Variables to Set:**
- `DATABASE_URL`
- `JWT_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`
- `PORT` (usually 3000)

---

#### **4. Deploy Frontend:**

**Option A: Vercel (Recommended)**

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd frontend
vercel

# Follow prompts:
# - Link to new project
# - Set build command: npm run build
# - Set output directory: .next

# Set environment variables in Vercel dashboard:
vercel env add NEXT_PUBLIC_API_URL
vercel env add NEXT_PUBLIC_USER_SERVICE_URL
vercel env add NEXT_PUBLIC_BOOKING_SERVICE_URL
vercel env add NEXT_PUBLIC_SKYSCANNER_AFFILIATE_ID
vercel env add NEXT_PUBLIC_BOOKING_COM_AFFILIATE_ID
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add SKYSCANNER_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add OPENAI_API_KEY

# Deploy to production
vercel --prod
```

**Your URLs will be:**
- Frontend: `https://booksygo.vercel.app`
- User Service: `https://booksygo-user-service.up.railway.app`
- Booking Service: `https://booksygo-booking-service.up.railway.app`

---

### **Day 8-9: Domain & SSL**

#### **1. Buy Domain:**
- [ ] Go to Namecheap, GoDaddy, or Cloudflare
- [ ] Buy `booksygo.ro` or `booksygo.com` (~€10-15/year)

#### **2. Configure DNS:**
- [ ] Add CNAME for frontend: `www` → Vercel
- [ ] Add CNAME for API: `api` → Railway
- [ ] Wait for DNS propagation (5-60 minutes)

#### **3. SSL Certificates:**
- [ ] Vercel: automatic SSL (free)
- [ ] Railway: automatic SSL (free)
- [ ] No action needed! 🎉

**Final URLs:**
- `https://booksygo.ro` (frontend)
- `https://api.booksygo.ro` (backend)

---

### **Day 10: Production Testing**

- [ ] Test complete user journey on production
- [ ] Check all API endpoints work
- [ ] Verify database connections
- [ ] Test payment flow with real card (then refund)
- [ ] Check analytics/tracking works
- [ ] Test on multiple devices
- [ ] Share with 2-3 friends for feedback

---

### **Day 11-14: Soft Launch**

#### **Marketing Materials:**
- [ ] Update homepage copy (make it compelling!)
- [ ] Create Instagram post
- [ ] Create Facebook post
- [ ] Write LinkedIn announcement
- [ ] Email 10-20 friends/family

#### **Example Copy:**
```
🚀 LANSARE! BooksyGo - călătoriile tale, simplificate!

✈️ Zboruri
🏨 Hoteluri
🎁 Pachete curate
🤖 AI Assistant

Primul tau booking = 500 BooksyPoints BONUS!

👉 booksygo.ro
```

#### **Initial Goals:**
- [ ] 10 signups in Week 1
- [ ] 3 bookings (even via affiliate links)
- [ ] 5+ pieces of feedback
- [ ] 0 critical bugs

---

## 💰 **COST BREAKDOWN:**

### **Setup Costs (One-time):**
```
Domain:                     €10-15/year
Stripe setup:               FREE
API signups:                FREE
TOTAL:                      €10-15
```

### **Monthly Costs:**
```
Hosting (Railway):          €10-20
Database (Supabase):        FREE (sau €25 după free tier)
Redis (optional):           FREE (sau €5)
OpenAI API:                 €20-50 (based on usage)
Email service (optional):   FREE (sau €10)
────────────────────────────
TOTAL:                      €30-105/month
```

### **Break-even:**
```
1 Premium Package sale:     €500-2000
2-3 Booking.com bookings:   €50-150
10 Skyscanner bookings:     €50-150
────────────────────────────
Need ~5-10 transactions/month to break even! 🎯
```

---

## 🎯 **SUCCESS METRICS (Month 1):**

- [ ] 50+ registered users
- [ ] 10+ bookings (via affiliate or direct)
- [ ] €100+ in revenue
- [ ] 5+ pieces of positive feedback
- [ ] <3 critical bugs
- [ ] 30% conversion rate (visitor → signup)
- [ ] 10% booking rate (signup → booking)

---

## 🚨 **COMMON ISSUES & FIXES:**

### **1. Database connection fails:**
```bash
# Check connection string
echo $DATABASE_URL

# Test connection
psql $DATABASE_URL

# Verify IP whitelist (Supabase/Railway)
```

### **2. JWT authentication fails:**
```bash
# Ensure JWT_SECRET is same across services
# Check token expiration time
# Verify CORS settings
```

### **3. Vercel deployment fails:**
```bash
# Clear cache
vercel --force

# Check build logs
vercel logs

# Verify environment variables
vercel env ls
```

### **4. API calls fail in production:**
```bash
# Check CORS settings in backend
# Verify API URLs in frontend .env
# Check network tab in browser DevTools
```

---

## 📞 **NEED HELP?**

**Resources:**
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Supabase Docs: https://supabase.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Next.js Docs: https://nextjs.org/docs
- NestJS Docs: https://docs.nestjs.com

**Community:**
- Vercel Discord: https://vercel.com/discord
- Railway Discord: https://discord.gg/railway
- IndieHackers: https://www.indiehackers.com

---

## ✅ **FINAL CHECKLIST BEFORE LAUNCH:**

- [ ] All API keys configured
- [ ] Database migrated and seeded
- [ ] Backend services deployed and healthy
- [ ] Frontend deployed and loading fast (<3s)
- [ ] Domain configured with SSL
- [ ] Complete user journey tested on production
- [ ] Payment flow tested (even with test card)
- [ ] Error tracking setup (Sentry optional)
- [ ] Analytics setup (Google Analytics optional)
- [ ] Terms & Conditions page live
- [ ] Privacy Policy page live
- [ ] Contact/Support email configured

---

## 🚀 **LAUNCH DAY:**

1. **Morning:**
   - [ ] Final smoke test on production
   - [ ] Post on social media
   - [ ] Email friends/family

2. **Afternoon:**
   - [ ] Monitor errors (check logs)
   - [ ] Respond to feedback quickly
   - [ ] Fix any urgent bugs

3. **Evening:**
   - [ ] Check analytics (signups, bookings)
   - [ ] Celebrate! 🎉
   - [ ] Plan Day 2 improvements

---

**🎯 REMEMBER:** 
- **DONE IS BETTER THAN PERFECT!**
- Launch with MVP, iterate based on feedback
- First 10 users > 1000 lines of perfect code
- Be responsive to feedback
- Fix bugs fast, add features slow

**HAI SĂ LANSĂM! 🚀**

