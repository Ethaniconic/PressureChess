# ♟️ PressureChess

> **Master Chess Under Pressure.** An all-in-one modern chess training platform featuring AI Coach Orion, Realtime Multiplayer with Live ELO Ratings, Interactive Academy, Tactical Rush, and Pressure Trainers.

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg?style=flat&logo=react)](https://reactjs.org)
[![React Native](https://img.shields.io/badge/React_Native-0.74.5-61DAFB.svg?style=flat&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-51.0-000020.svg?style=flat&logo=expo)](https://expo.dev)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth-3ECF8E.svg?style=flat&logo=supabase)](https://supabase.com)
[![Vite](https://img.shields.io/badge/Vite-5.2-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev)

---

## 🌟 Features

- 🤖 **AI Coach Orion & Game Review**: Post-game accuracy analysis, move classification (Brilliant, Great, Best, Inaccuracy, Mistake, Blunder), key moments, and tactical feedback.
- ⚔️ **Realtime Online Multiplayer**: Instant matchmaking, custom room codes, live dual-clock timers, move-by-move real-time sync via Supabase WebSockets, and rated ELO calculations.
- 🎓 **PressureChess Academy**: 5 structured interactive courses (Foundations to Pressure Decision Making) with on-board practice positions and completion rewards.
- ⚡ **Pressure Tactics & Blunder Prevention**: Timed tactical rush puzzles, opening trainer, endgame drills, and blunder identification mode.
- 🏆 **Global Leaderboards & Player Profiles**: Win/loss/draw breakdowns, accuracy stats, puzzle streak trackers, and Founding Beta Player badges.
- 📱 **Cross-Platform Parity**: Unified UI/UX design with dark obsidian aesthetics, gold/emerald accents, and custom vector piece sets across Web (desktop/tablet) and Mobile (Android & iOS).

---

## 📁 Repository Structure

```text
PressureChess/
├── backend/                   # FastAPI Python backend
│   ├── app/
│   │   ├── api/               # API routes (multiplayer, analysis, academy, etc.)
│   │   ├── core/              # Config & Supabase client singleton
│   │   ├── models/            # Pydantic validation schemas
│   │   ├── services/          # Chess service, Elo calculator, game analyzer
│   │   └── main.py            # FastAPI application entrypoint
│   ├── Dockerfile             # Production container setup (with Stockfish)
│   ├── Procfile               # Render / Heroku process runner
│   ├── requirements.txt       # Python dependencies
│   ├── run.py                 # Local development server runner
│   └── supabase_schema.sql    # Complete PostgreSQL schema, tables, RLS & triggers
│
├── web/                       # React 18 + Vite web application
│   ├── public/                # Static assets, icons, _redirects
│   ├── src/
│   │   ├── components/        # Chessboard, clocks, modals, cards
│   │   ├── context/           # Auth, Settings, Multiplayer, Tactics state
│   │   ├── pages/             # App views (Home, Play, Review, Academy, etc.)
│   │   └── services/          # Supabase and Backend API clients
│   ├── vercel.json            # Vercel SPA routing configuration
│   └── vite.config.js         # Vite bundler configuration
│
└── mobile/                    # React Native + Expo mobile application
    ├── assets/                # App icon and images
    ├── src/
    │   ├── components/        # Mobile touch-responsive board and components
    │   ├── context/           # AsyncStorage persistent contexts
    │   ├── navigation/        # React Navigation Native Stack
    │   └── screens/           # Mobile screens matching web features
    ├── app.json               # Expo project manifest & Android package settings
    └── eas.json               # Expo Application Services build configuration
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0.0 or later
- **Python**: v3.10 or v3.11
- **Supabase Account**: (Free tier at [supabase.com](https://supabase.com))
- **Expo CLI**: `npm install -g eas-cli` (for mobile builds)

---

### 2. Supabase Setup
1. Create a new project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Go to **SQL Editor** -> **New Query**.
3. Paste and run the entire contents of [`backend/supabase_schema.sql`](./backend/supabase_schema.sql).
4. Copy your **Project URL** and **API Keys** (`anon public` and `service_role secret`) from **Project Settings -> API**.

---

### 3. Backend Setup
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment variables
cp .env.example .env
# Edit .env and supply your SUPABASE_URL and SUPABASE_KEY

# Run server
python run.py
# Backend runs at http://localhost:8000 (Swagger docs at http://localhost:8000/docs)
```

---

### 4. Web Setup
```bash
cd web

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env:
# VITE_API_URL=http://localhost:8000
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Start development server
npm run dev
# Web runs at http://localhost:5173
```

---

### 5. Mobile Setup
```bash
cd mobile

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env:
# EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000
# EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
# EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Start Expo development server
npx expo start
```

---

## 🚢 Deployment Guide

### A. Web Deployment (Vercel)
1. Push this repository to GitHub.
2. Log in to [Vercel](https://vercel.com) and click **Add New Project** -> Import your GitHub repository.
3. Set **Root Directory** to `web`.
4. Framework Preset will automatically detect **Vite**.
5. Add Environment Variables:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://pressurechess-backend.onrender.com`)
   - `VITE_SUPABASE_URL`: `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `your-supabase-anon-key`
6. Click **Deploy**. Vercel will build and assign your production domain.

---

### B. Backend Deployment (Render)
1. Log in to [Render](https://render.com) and select **New Web Service**.
2. Connect your GitHub repository.
3. Configure settings:
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3` (or `Docker` if utilizing the included `backend/Dockerfile` with Stockfish binary)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add Environment Variables:
   - `PORT`: `8000`
   - `HOST`: `0.0.0.0`
   - `SUPABASE_URL`: `https://your-project.supabase.co`
   - `SUPABASE_KEY`: `your-supabase-service-role-key`
   - `CORS_ORIGINS`: `https://your-web-domain.vercel.app`
5. Click **Create Web Service**.

---

### C. Mobile Android APK Build (Standalone APK for Testers)
Generate a direct-install `.apk` file without needing Google Play Store:
```bash
cd mobile

# Login to your Expo account
npx eas login

# Build standalone APK
npx eas build -p android --profile preview
```
Once the cloud build finishes, download the generated `.apk` file and share it with your beta testers.

---

### D. Production App Store Releases
- **Google Play Store (.aab)**:
  ```bash
  npx eas build -p android --profile production
  ```
  Submit the resulting `.aab` file to the Google Play Console.
- **Apple iOS App Store**:
  ```bash
  npx eas build -p ios --profile production
  ```
  Submit via EAS or Transporter to Apple TestFlight / App Store Connect.

---

## 📊 Free Tier Capacity & Concurrency Guide

| Service | Free Tier Resource Quota | Simultaneous Users Capacity | Primary Constraint |
| :--- | :--- | :--- | :--- |
| **Vercel** (Hobby) | 100 GB Bandwidth / month, Edge CDN | **5,000 – 10,000+** browsing users | Static asset bandwidth limit |
| **Supabase** (Free) | 200 Realtime WebSockets, 500 MB DB, 50k MAU | **100 Simultaneous Live Matches** (200 players) | Realtime WebSocket connection cap |
| **Render** (Free) | 0.1 CPU, 512 MB RAM, spins down after 15m idle | **30 – 50 req/s** (API) / **10–15** concurrent AI analyses | Single CPU core & memory throttling |

*Tip: For smooth 24/7 uptime without Render's 50-second cold start on free tier, use a free uptime monitor (e.g. UptimeRobot or Cron-Job.org) to ping your backend's `/health` endpoint every 10 minutes.*

---

## 📄 License
MIT License. Created for the PressureChess Public Beta.
