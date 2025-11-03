# 🛫 Skyscanner API - Setup Complete Guide

## 🎯 **Ce ai acum implementat:**

### **1. Integrare Skyscanner Flight Search API** ✅
- `frontend/lib/skyscanner-api.ts` - Client library pentru Skyscanner API
- `frontend/app/api/flights/search/route.ts` - API route care folosește date REALE
- Fallback la mock data dacă API-ul nu e disponibil

### **2. Background Price Monitoring** ✅
- `services/search-service/src/jobs/price-monitor.job.ts` - Job asincron
- Rulează la fiecare 6 ore
- Monitorizează prețurile și trimite alerte

### **3. Best Deals Finder** ✅
- Job zilnic la 8 AM
- Găsește cele mai bune oferte pentru luna următoare
- Perfect pentru homepage "Cele mai bune oferte săptămâna aceasta"

---

## 📋 **Ce trebuie să faci:**

### **STEP 1: Obține Skyscanner API Key**

#### **A. Sign Up pentru Skyscanner Travel APIs**
1. **Go to:** https://developers.skyscanner.net/
2. **Click:** "Get Started" sau "Sign Up"
3. **Complete:**
   - Business details
   - Use case: "Travel comparison website"
   - Expected traffic

#### **B. Choose Plan**

**FREE Tier (Început):**
- ✅ 10,000 API calls/lună
- ✅ Acces la Flight Search API
- ✅ Acces la Autosuggest API
- ✅ Perfect pentru testare și începuturi
- ❌ Limited support

**Paid Tier (După lansare):**
- Unlimited API calls
- Premium support
- Negociază preț în funcție de trafic

**RECOMANDARE:** Începi cu FREE, upgrade când ai trafic.

#### **C. Get API Key**
1. După aprobare (1-3 zile), primești API key
2. Copiezi key-ul
3. Adaugi în `.env`:

```bash
# .env (project root)
SKYSCANNER_API_KEY=your-skyscanner-api-key-here
```

---

### **STEP 2: Update Frontend să folosească API-ul Real**

#### **Modifică** `frontend/app/search/page.tsx`:

Înlocuiește:
```typescript
const response = await fetch(`/api/search?type=flights&origin=${origin}&destination=${destination}&date=${date}`);
```

Cu:
```typescript
const response = await fetch(`/api/flights/search?origin=${origin}&destination=${destination}&date=${date}`);
```

---

### **STEP 3: Setup Background Jobs (Price Monitoring)**

#### **A. Install Dependencies în search-service**
```bash
cd services/search-service
npm install @nestjs/schedule
```

#### **B. Enable Scheduling în AppModule**

**File:** `services/search-service/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceMonitorJob } from './jobs/price-monitor.job';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Enable cron jobs
    // ... alte imports
  ],
  providers: [
    PriceMonitorJob, // Register job
    // ... alți provideri
  ],
})
export class AppModule {}
```

#### **C. Start search-service**
```bash
cd services/search-service
npm run start:dev
```

**Job-urile vor rula automat:**
- ⏰ La fiecare 6 ore: Price monitoring
- ⏰ În fiecare zi la 8 AM: Best deals finder

---

### **STEP 4: Testare**

#### **A. Test cu Mock Data (fără API key)**
```bash
# Frontend
cd frontend && npm run dev

# Go to:
http://localhost:3000/search?origin=OTP&destination=BUD&date=2025-11-15

# Ar trebui să vezi mock data (fallback)
```

#### **B. Test cu Real API (după ce ai API key)**
```bash
# 1. Adaugă API key în .env
SKYSCANNER_API_KEY=your-real-key

# 2. Restart frontend
cd frontend && npm run dev

# 3. Search flights
# Ar trebui să vezi "Source: skyscanner" în console
```

#### **C. Test Background Jobs**
```bash
# Watch logs în search-service terminal
# Ar trebui să vezi:
# "🔍 Starting flight price monitoring..."
# "📊 Monitoring X routes"
```

---

## 🎨 **CE VEDE USER-UL:**

### **Înainte (doar affiliate):**
```
┌──────────────────────────────┐
│  [Vezi pe Skyscanner]        │
│  (redirect extern)           │
└──────────────────────────────┘
```

### **Acum (cu API real):**
```
┌──────────────────────────────┐
│  ✈️ OTP → BUD                │
│  08:00 - 08:50               │
│  Wizz Air | €45.99           │
│                              │
│  [Rezervă acum]  [Skyscanner]│
└──────────────────────────────┘
```

**User poate:**
1. ✅ **Vezi rezultatele ÎN APP** (date reale de la Skyscanner)
2. ✅ **Rezervă prin tine** (cu booking-service)
3. ✅ **SAU merge pe Skyscanner** (dacă preferă să cumpere direct)

---

## 💡 **FEATURE-URI BONUS (incluse în cod):**

### **1. Price Alerts** 📧
User-ii pot seta alerte pentru rute:
- Job-ul verifică prețurile la 6h
- Dacă prețul scade > €20, trimite email/notificare
- **TODO:** Conectează la notification-service

### **2. Best Deals Section** 🎯
Homepage poate avea secțiune:
```
"Cele mai bune oferte săptămâna aceasta"
──────────────────────────────────────
OTP → LON   €45   (economisești €30)
OTP → PAR   €52   (economisești €25)
OTP → BCN   €48   (economisești €28)
```

**TODO:** Creează component în frontend care citește din DB.

### **3. Price History / Trends** 📊
Arată user-ului când e cel mai ieftin să zboare:
```
"Cel mai ieftin: Decembrie 2025 (€45)"
"Preț mediu: €65"
```

---

## 📊 **ARHITECTURA COMPLETĂ:**

```
┌─────────────────────────────────────────────┐
│          USER SEARCH                        │
└─────────────┬───────────────────────────────┘
              │
              v
┌─────────────────────────────────────────────┐
│   Frontend: /api/flights/search             │
│   ├─ Calls Skyscanner API                   │
│   ├─ Transforms data                        │
│   └─ Returns to UI                          │
└─────────────┬───────────────────────────────┘
              │
              v
┌─────────────────────────────────────────────┐
│   UI Shows Results:                         │
│   ├─ [Rezervă acum] → booking-service       │
│   └─ [Vezi pe Skyscanner] → affiliate link  │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│   BACKGROUND (search-service):              │
│   ├─ Every 6h: Price monitoring             │
│   ├─ Every day 8 AM: Best deals             │
│   └─ Store in DB for quick access           │
└─────────────────────────────────────────────┘
```

---

## 💰 **BUSINESS MODEL CLARIFICAT:**

### **Scenario 1: User rezervă PRIN TINE**
```
1. User caută pe BooksyGo
2. Vezi rezultate de la Skyscanner API
3. User click "Rezervă acum"
4. Merge la booking-service
5. Tu iei comision COMPLET (€10-20)
```

### **Scenario 2: User merge PE SKYSCANNER**
```
1. User caută pe BooksyGo
2. Vezi rezultate de la Skyscanner API
3. User click "Vezi pe Skyscanner"
4. Merge pe Skyscanner (affiliate link)
5. Tu iei comision affiliate (€5-15)
```

**STRATEGIE:**
- Încurajezi "Rezervă acum" → profit mai mare
- Dai opțiune "Skyscanner" → flexibilitate pentru user + backup revenue

---

## ⚙️ **CONFIGURARE COMPLETĂ:**

### **Environment Variables:**

**`.env` (project root):**
```bash
# Skyscanner
SKYSCANNER_API_KEY=your-skyscanner-api-key
SKYSCANNER_AFFILIATE_ID=your-affiliate-id

# Database (for price monitoring)
DATABASE_URL=postgresql://booksygo:password@localhost:5432/booksygo
```

**`frontend/.env.local`:**
```bash
# Skyscanner Affiliate (public)
NEXT_PUBLIC_SKYSCANNER_AFFILIATE_ID=your-affiliate-id
```

---

## 📝 **CHECKLIST:**

- [ ] **Week 1: API Access**
  - [ ] Sign up: https://developers.skyscanner.net/
  - [ ] Obține API key
  - [ ] Adaugă în `.env`

- [ ] **Week 1: Frontend Integration**
  - [ ] Update `frontend/app/search/page.tsx` să folosească `/api/flights/search`
  - [ ] Test cu mock data (fără API key)
  - [ ] Test cu real data (cu API key)

- [ ] **Week 2: Background Jobs**
  - [ ] Install `@nestjs/schedule` în search-service
  - [ ] Enable în `AppModule`
  - [ ] Start search-service
  - [ ] Verifică logs (job-urile rulează?)

- [ ] **Week 2: Database Setup**
  - [ ] Create table `monitored_routes`
  - [ ] Create table `best_deals`
  - [ ] Connect Prisma în price-monitor job

- [ ] **Week 3: Advanced Features**
  - [ ] Price alerts (email/push)
  - [ ] Best deals homepage section
  - [ ] Price history charts

- [ ] **Week 4: Production**
  - [ ] Switch to paid Skyscanner plan (dacă trafic > 10k)
  - [ ] Optimize caching
  - [ ] Monitor API usage

---

## 🚀 **ESTIMARE TRAFIC vs. COST:**

### **FREE Tier (10,000 calls/lună):**
```
Search per user: ~3 requests
Users/lună: ~3,300 users
```

**Suficient pentru:**
- Testare și MVP
- Primii 1-2 luni după lansare

### **Când upgrade la PAID:**
- Când ai > 100 useri/zi
- Când background jobs consumă mult API
- Când vrei support premium

**Cost estimat:** €100-500/lună în funcție de trafic

---

## 🎯 **NEXT STEPS - TL;DR:**

1. **Sign up:** https://developers.skyscanner.net/
2. **Get API key** (1-3 zile)
3. **Add to `.env`**
4. **Test** cu real data
5. **Setup background jobs** (price monitoring)
6. **Launch!** 🚀

---

**Questions?**
- Check code comments în `frontend/lib/skyscanner-api.ts`
- Skyscanner docs: https://developers.skyscanner.net/docs
- API examples: https://github.com/Skyscanner/api-documentation

**Mult succes! ✈️🌍**

