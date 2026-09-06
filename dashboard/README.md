# 🏥 Smart Patient Tracker — Frontend Application Guide

This is the production frontend application for the **Smart Patient Tracker** platform, built using **React 19**, **TypeScript 5**, and **Vite 8**.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start local development server (HMR enabled)
npm run dev

# Run TypeScript compilation check
npx tsc --noEmit

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

The application runs locally on **`http://localhost:5173/`**.

---

## 🔑 Demo Access Credentials

| Portal | Username / ID | Password / PIN | 1-Click Fast Login |
| :--- | :--- | :--- | :--- |
| **Doctor Portal** | `doctor` | **`doctor123`** | Click **"⚡ Instant Demo Login as Doctor 1"** |
| **Staff & Nurse Portal** | `staff` | **`staff123`** | Click **"⚡ Instant Demo Login as Staff 1"** |
| **Family Portal** | Select **Person 1 – 6** | **`family123`** | Click any patient pill (**Person 1** to **Person 6**) |

---

## 📐 Source Directory Overview

```
src/
├── app/                  # Application shell, routing, and provider setup
│   ├── App.tsx           # Router root with ProtectedRoute guards
│   ├── providers.tsx     # Unified AppProviders hierarchy
│   ├── AuroraBackground.tsx # Ambient gradient background
│   └── app.module.css    # Shell CSS grid layout
│
├── pages/                # Distinct screen views
│   ├── Login/            # 3-tab portal login screen
│   ├── Overview/         # Triage dashboard (Grid, Bed Matrix, Clinical Table)
│   ├── WardEditor/       # Spreadsheet-style ward and patient cell editor
│   ├── PatientDetail/    # Deep telemetry waveforms and clinical tiles
│   ├── Family/           # Calm, isolated family care portal
│   ├── Alerts/           # Real-time alert feed and acknowledgments
│   ├── Devices/          # Central medical equipment gateway
│   ├── Trends/           # Multi-patient vital trends and analytics
│   └── Settings/         # Vital threshold sliders and notification toggles
│
├── components/           # Shared, reusable UI components
│   ├── auth/             # Route guards and RBAC checks
│   ├── layout/           # Sidebar, Topbar, and PageTransition
│   ├── patient/          # Daily reports, timetables, and messaging desk
│   ├── devices/          # Interactive device telemetry modal
│   └── ui/               # Apple Health Glass design primitives
│
├── context/              # Global state contexts
│   ├── AuthContext.tsx   # Roles, permissions, and session persistence
│   ├── WardManagementContext.tsx # Wards, beds, and cell data persistence
│   ├── MessageContext.tsx # Patient family & nurse chat thread
│   ├── AlertContext.tsx  # Unacked alert counters and system canary
│   └── ThemeContext.tsx  # Design system theme provider
│
├── services/             # Modular API and storage utilities
│   ├── api/patients.ts   # Patient records and acuity logic
│   ├── api/ward.ts       # Ward capacities and bed calculations
│   ├── api/devices.ts    # Equipment telemetry formatting
│   └── index.ts          # Services barrel export
│
├── hooks/                # Telemetry hooks and WebSocket simulation
│   ├── useWardSocket.ts  # 2-second vital simulation engine
│   ├── useLiveVitals.ts  # Patient-specific vital stream
│   ├── useAlerts.ts      # Automated threshold scanner
│   ├── useThresholds.ts  # Clinical threshold persistence
│   └── useSystemHealth.ts# Connection health heartbeat
│
├── types/                # Strict TypeScript interfaces
│   ├── auth.ts           # Roles and permission definitions
│   ├── ward.ts           # Wards, beds, and editable records
│   ├── patient.ts        # Patient records, schedules, daily reports
│   ├── device.ts         # Connected medical equipment and telemetry
│   ├── alert.ts          # Clinical alerts and severity
│   └── threshold.ts      # Parameter threshold limits
│
├── utils/                # Pure formatting and constant utilities
│   ├── constants.ts      # Initial patient data and LOINC codes
│   ├── formatters.ts     # Uptime, date, and time formatting
│   └── vitalStatus.ts    # Acuity categorization logic
│
└── styles/               # Design tokens and global CSS
    ├── tokens.css        # Apple Health Glass variables
    ├── globals.css       # Resets and typography defaults
    └── animations.css    # Ambient keyframes and pulses
```

---

## 🎨 Design System: "Apple Health Glass"

The UI adheres strictly to the **Apple Health Glass** design principles:
- **Surface**: White frosted glass (`rgba(255, 255, 255, 0.72)`) with `backdrop-filter: blur(24px)`.
- **Borders**: Translucent glass edge (`rgba(255, 255, 255, 0.90)`).
- **Ink**: Deep navy `#1C2331` for headings, `#5B6472` for body, and `#8A93A3` for timestamps.
- **Accents**:
  - `#2A85FF` Clinical Electric Blue (Primary actions)
  - `#2FBD85` Mint Green (Stable)
  - `#F5A93F` Amber Gold (Watch)
  - `#FF5C6C` Coral Red (Critical)
- **Typography**: Inter / SF Pro Text typography scale with tightened letter-spacing (`-0.01em` to `-0.02em`).

---

## 🧪 Testing & Validation

```bash
# Type check without emitting
npx tsc --noEmit

# Production build
npm run build
```
