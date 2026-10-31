# Bozorchi AI — Telegram Mini App (Toshkent Ulgurji Bozorlari & Birgalikda Xarid)

> **Competition Demo Prototype for Lumora IT Case Competition**  
> A wholesale price board, supplier comparison engine, AI invoice verifier, and neighborhood group-buying (pooling) tool for small grocery shops in Tashkent, Uzbekistan.
> GitHub: [https://github.com/Asliddin-Choriyev/bozorchi_ai](https://github.com/Asliddin-Choriyev/bozorchi_ai)

---

## 5-Line Demo Script (Read Aloud During 3-Minute Pitch)

> **Line 1 (The Problem):**  
> *"Every morning at 4:00 AM, Dilshod from Chilonzor drives to O'rikzor, burns 16 hours a week, and pays 15.7 million UZS solo for standard stock."*
>
> **Line 2 (The Price Board & Fair Corridor):**  
> *"With Bozorchi AI, he opens Telegram, searches 'sugar 500 kg', checks verified prices across Chorsu, O'rikzor, and Food City, and sees the official fair corridor."*
>
> **Line 3 (The Pooling Power):**  
> *"Instead of paying 12,800 UZS solo, Dilshod joins the 5-shop 'Chilonzor-9' cluster pool with one tap, locking in Tier 1 bulk pricing at 11,400 UZS/kg."*
>
> **Line 4 (BozorVision & Escrow Verification):**  
> *"When the shared Labo van arrives, Dilshod snaps the paper invoice — BozorVision AI instantly verifies the price, releases the escrow, and awards 2,500 BozorCoins."*
>
> **Line 5 (The Big Win):**  
> *"Result: Dilshod saves 1,840,000 UZS (-11.7%) on this single order, splits the 75k delivery fee 5 ways, and reclaims 15 hours and 45 minutes of his life."*

---

## Real Pitch Deck Numbers

| Metric | Old Solo Way | Pooled Way (Bozorchi AI) | Savings |
| :--- | :--- | :--- | :--- |
| **Sugar (500 kg)** | 12,800 UZS = 6,400,000 UZS | 11,400 UZS = 5,700,000 UZS | **-700,000 UZS** |
| **Flour (15 bags × 50kg)** | 280,000 UZS = 4,200,000 UZS | 255,000 UZS = 3,825,000 UZS | **-375,000 UZS** |
| **Oil (60 bottles × 5L)** | 78,000 UZS = 4,680,000 UZS | 71,500 UZS = 4,290,000 UZS | **-390,000 UZS** |
| **Delivery Vehicle** | 450,000 UZS (Private truck) | 75,000 UZS (Shared Labo van) | **-375,000 UZS** |
| **Total Cost** | **15,730,000 UZS** | **13,890,000 UZS** | **1,840,000 UZS (-11.7%)** |
| **Time Spent** | **16 hours** (Waking at 4 AM) | **15 minutes** (Delivery inspection) | **15 hours 45 minutes saved** |

---

## Project Structure

```
Lumora/
├── dist/                          # Production build output
├── node_modules/                  # Installed dependencies
├── src/
│   ├── components/
│   │   ├── BottomNav.tsx          # 4-tab bar (Prices, Alerts, Pool, Profile)
│   │   ├── DemoBanner.tsx         # 60-second floating pitch walkthrough controller
│   │   ├── Header.tsx             # Header with back nav, language switcher, brand
│   │   ├── MarketChips.tsx        # Market filters (O'rikzor, Food City, Chorsu, All)
│   │   ├── PriceTrendChart.tsx    # 30-day interactive SVG price trend line chart
│   │   └── SampleDataFooter.tsx   # Demo data notice footer
│   ├── data/
│   │   └── mock.ts                # Pitch deck numbers, 5 suppliers, pool slots, alerts
│   ├── screens/
│   │   ├── PriceBoardScreen.tsx   # Screen 1: Staples, search, 7-day price delta
│   │   ├── ProductDetailScreen.tsx# Screen 2: 30-day SVG chart, fair price range
│   │   ├── SupplierScreen.tsx     # Screen 3: 5 suppliers sorted cheapest first
│   │   ├── AlertsScreen.tsx       # Screen 4: Active toggles, triggered alert banner
│   │   ├── GroupOrderScreen.tsx   # Screen 5: Chilonzor-9 pool, 5 slots, Labo fee
│   │   ├── DeliveryScanScreen.tsx # Screen 6: Camera invoice scan, BozorVision OCR
│   │   ├── SavingsResultScreen.tsx# Screen 7: Before vs after summary & share card
│   │   └── ProfileScreen.tsx      # Tab 4: Dilshod Market profile & BozorCoins
│   ├── utils/
│   │   ├── format.ts              # UZS currency formatting and % changes
│   │   └── telegram.ts            # Telegram WebApp SDK wrapper (Main/BackButton/Haptics)
│   ├── App.tsx                    # Root container, memory state & screen routing
│   ├── i18n.ts                    # Uzbek (O'zbek), Russian (Русский), English (EN)
│   ├── index.css                  # Tailwind styles and mobile fixes
│   ├── main.tsx                   # React 18 DOM root
│   └── types.ts                   # TypeScript interfaces
├── bot.py                         # Companion Python Telegram Bot with WebApp button
├── index.html                     # Mobile viewport & Telegram SDK script
├── package.json                   # Vite + React + TypeScript + Tailwind
├── tailwind.config.js             # Cream #F4EFE4, ink #0A1714, teal #0B6B62 palette
├── tsconfig.json                  # TypeScript compiler settings
└── vite.config.ts                 # Base path and dev server configuration
```

---

## 1. How to Run Locally

### Prerequisites
- Node.js 18+ (Tested on Node v24)
- npm or pnpm

### Steps
In PowerShell:
```powershell
cd D:\Lumora

# 1. Install dependencies (if not already installed)
npm install

# 2. Run local development server
npm run dev
```

Open `http://localhost:3000` in your browser.  
Press `F12` and switch to Mobile Device mode (iPhone 14 / 390×844px) for the native feel.

### Production Build
```powershell
npm run build
```
Creates an optimized static bundle in `/dist` ready for static hosting.

---

## 2. Bozorchi AI Engine Integration (Optional)

BozorNarx includes two AI features powered by OpenAI `gpt-4o-mini`:
1. **BozorVision OCR**: Reads photos of handwritten or printed paper invoices taken with the phone camera, extracts line items & prices, and verifies whether they match the locked pool quote.
2. **Bozorchi AI Copilot**: A wholesale trading advisor accessible from the header `AI` button or Profile tab that advises shop owners on Tashkent bazaar trends and drafts supplier orders.

### How to Activate:
- **In Vercel / Locally**: Add `VITE_OPENAI_API_KEY=sk-...` to your `.env` or Vercel Environment Variables.
- **In the App**: Go to the **Profile** tab -> **Sun'iy Intellekt (OpenAI)** -> paste your API key and tap **Saqlash**.
- *Fail-Safe Guarantee:* If no key is provided, the app automatically runs in **Smart Demo Mode** with deterministic responses so live pitches never fail or crash!

---

## 3. Deploy to Vercel via GitHub (Recommended & Automated HTTPS)

Telegram Mini Apps strictly require **HTTPS**. Vercel gives you instant automatic SSL certificates, fast global CDN edge delivery, and automatic deployments whenever you push commits to GitHub.

### Step 1: Push Local Code to GitHub
Your repository is connected to:
`https://github.com/Asliddin-Choriyev/bozorchi_ai.git`

In PowerShell, push the code:
```powershell
git push -u origin main
```

### Step 2: Import & Deploy on Vercel
1. Go to [https://vercel.com/new](https://vercel.com/new) and log in with your GitHub account.
2. Under **"Import Git Repository"**, find `bozorchi_ai` and click **"Import"**.
3. Vercel automatically detects the Vite framework with preset settings:
   - **Framework Preset:** `Vite`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. *(Optional)* In **Environment Variables**, add `VITE_OPENAI_API_KEY` with your OpenAI token.
5. Click **"Deploy"**. Within ~30 seconds, Vercel will complete the build and assign you a live HTTPS domain, for example:
   `https://bozorchi-ai.vercel.app`

*(Note: We have also included `vercel.json` with client-side SPA routing rewrites so any page refresh loads seamlessly).*

---

## 3. Alternative Free Deployments (Netlify or GitHub Pages)

### Option A: Free Deployment via Netlify (Recommended - 2 Minutes)
1. Build the production files:
   ```powershell
   npm run build
   ```
2. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop) (no account required for quick drop, or sign in).
3. Drag and drop the `D:\Lumora\dist` folder onto the web page.
4. Netlify will immediately give you a live HTTPS URL, e.g.:
   `https://bozornarx-tashkent.netlify.app`
5. *(Optional)* Or connect your GitHub repo to Netlify with build command `npm run build` and publish directory `dist`.

### Option B: Deploy Free to GitHub Pages
1. Install `gh-pages`:
   ```powershell
   npm install --save-dev gh-pages
   ```
2. Add a deploy script in `package.json`:
   ```json
   "scripts": {
     "deploy": "vite build && gh-pages -d dist"
   }
   ```
3. Run `npm run deploy`. Your app will be live at `https://<your-username>.github.io/<repo-name>/`.

---

## 3. How to Connect to Telegram Bot via @BotFather

Once you have your deployed HTTPS URL (e.g. `https://bozornarx-tashkent.netlify.app`):

### Method 1: Set the Menu Button (Fastest for Users)
1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. If you don't have a bot yet, create one:
   - Send: `/newbot`
   - Name: `BozorNarx Demo`
   - Username: `BozorNarxDemoBot` (or your chosen name)
   - Copy the HTTP API token provided by BotFather.
3. Configure the Mini App menu button:
   - Send: `/setmenubutton`
   - Select your bot from the list.
   - Send your live HTTPS URL: `https://bozornarx-tashkent.netlify.app`
   - Send the button title: `BozorNarx 🛒`
4. Now open your bot in Telegram! In the bottom left next to the message field, users will see the **"BozorNarx 🛒"** button. Tapping it opens the Mini App full-screen inside Telegram!

### Method 2: Configure a Web App Shortcut (/newapp)
1. In [@BotFather](https://t.me/BotFather), send `/newapp`.
2. Select your bot.
3. Provide:
   - Title: `BozorNarx`
   - Description: `Toshkent ulgurji narxlari va birgalikda xarid`
   - Photo / Icon (640×360 px image)
   - Web App URL: `https://bozornarx-tashkent.netlify.app`
   - Short name: `app`
4. BotFather gives you a direct link: `https://t.me/YourBot?startapp=true` which you can share in Telegram channels, groups, and slides!

### Method 3: Run the Python Companion Bot (`bot.py`)
1. Create a `.env` file in `D:\Lumora`:
   ```ini
   BOT_TOKEN=123456789:ABCDefghIJKlmnoPQRstuvWXyz
   WEBAPP_URL=https://bozornarx-tashkent.netlify.app
   ```
2. Run the bot:
   ```powershell
   python bot.py
   ```
3. Send `/start` to the bot in Telegram. It will reply with an inline button **"🛒 BozorNarx Mini App-ni ochish"** which opens the Mini App instantly.

---

## 4. Design System Compliance

- **Colors:**
  - Surface cream: `#F4EFE4`
  - Cards: `#FBF8F0`
  - Ink: `#0A1714`
  - Action teal: `#0B6B62`
  - Highlight gold: `#E3B341`
  - Danger: `#8C2F2F`
  - Drop green (wholesale savings): `#167E51`
- **Typography:** Headings in **Georgia bold**, body in **Arial / system sans**.
- **Cards:** `rounded-[14px]`, clean drop shadows, crisp spacing.
- **Price Badges:** ▲ red (price increased) / ▼ green (price dropped).
- **Navigation:** Bottom tab bar: `Prices | Alerts | Pool | Profile`.
- **Telegram SDK:** Native `MainButton`, `BackButton`, and `HapticFeedback` support with browser fallbacks.
- **Languages:** Instant toggle between Uzbek (O'zbek), Russian (Русский), and English (EN).
- **Demo Mode:** Floating 60-second tour button for judges to auto-fill and advance through the killer flow without dead ends.
"# bozorchi_ai" 
