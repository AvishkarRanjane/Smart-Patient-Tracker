# ICU Monitoring Dashboard — File Structure, Theme System & Page Spec

Companion to the working prototype (`icu_dashboard.html`). This document is the **production blueprint**: how to turn the prototype into a real React/TypeScript codebase, and the exact theme tokens to keep every future screen visually consistent.

---

## 1. Production File Structure (React + TypeScript)

```
dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── app/
│   │   ├── App.tsx                    # Router root, layout shell
│   │   ├── routes.tsx                 # Route definitions (6 pages)
│   │   └── providers.tsx              # Context providers (theme, websocket, auth)
│   │
│   ├── pages/
│   │   ├── Overview/
│   │   │   ├── OverviewPage.tsx
│   │   │   ├── PatientCard.tsx
│   │   │   ├── KpiRow.tsx
│   │   │   └── overview.module.css
│   │   ├── PatientDetail/
│   │   │   ├── PatientDetailPage.tsx
│   │   │   ├── VitalTiles.tsx
│   │   │   ├── VitalTrendChart.tsx
│   │   │   ├── ConnectedDevicesPanel.tsx
│   │   │   ├── PatientAlertsPanel.tsx
│   │   │   └── detail.module.css
│   │   ├── Alerts/
│   │   │   ├── AlertsPage.tsx
│   │   │   ├── AlertRow.tsx
│   │   │   ├── SeverityFilterChips.tsx
│   │   │   └── alerts.module.css
│   │   ├── Devices/
│   │   │   ├── DevicesPage.tsx
│   │   │   ├── DeviceGatewayCard.tsx
│   │   │   └── devices.module.css
│   │   ├── Trends/
│   │   │   ├── TrendsPage.tsx
│   │   │   ├── WardAverageChart.tsx
│   │   │   ├── AlertVolumeChart.tsx
│   │   │   └── trends.module.css
│   │   └── Settings/
│   │       ├── SettingsPage.tsx
│   │       ├── ThresholdSliders.tsx
│   │       ├── NotificationTogglePanel.tsx
│   │       └── settings.module.css
│   │
│   ├── components/                    # Shared, reused across pages
│   │   ├── layout/
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Topbar.tsx
│   │   │   └── PageTransition.tsx
│   │   ├── ui/
│   │   │   ├── GlassCard.tsx
│   │   │   ├── StatusRing.tsx
│   │   │   ├── VitalChip.tsx
│   │   │   ├── Switch.tsx
│   │   │   ├── Slider.tsx
│   │   │   ├── Chip.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Toast.tsx
│   │   └── charts/
│   │       ├── LiveLineChart.tsx      # wraps Chart.js/Recharts, shared config
│   │       └── SeverityBarChart.tsx
│   │
│   ├── hooks/
│   │   ├── useLiveVitals.ts           # WebSocket subscription per patient
│   │   ├── useWardSocket.ts           # ward-wide aggregate stream
│   │   ├── useAlerts.ts               # alert state + acknowledge mutation
│   │   ├── useThresholds.ts           # reads/writes threshold config
│   │   └── useSystemHealth.ts         # canary/heartbeat status for topbar pill
│   │
│   ├── services/
│   │   ├── api/
│   │   │   ├── client.ts              # fetch/axios instance, auth headers
│   │   │   ├── patients.ts            # GET /patients, /patients/:id
│   │   │   ├── alerts.ts              # GET/POST /alerts, /alerts/:id/ack
│   │   │   ├── devices.ts             # GET /devices
│   │   │   └── thresholds.ts          # GET/PUT /thresholds
│   │   └── socket/
│   │       └── socketClient.ts        # WebSocket/SSE connection manager
│   │
│   ├── context/
│   │   ├── ThemeContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── AlertContext.tsx           # global unacked-count, system status
│   │
│   ├── types/
│   │   ├── patient.ts
│   │   ├── alert.ts
│   │   ├── device.ts
│   │   └── threshold.ts
│   │
│   ├── utils/
│   │   ├── vitalStatus.ts             # threshold → stable/watch/critical logic
│   │   ├── formatters.ts              # number/time formatting
│   │   └── constants.ts               # LOINC codes, default thresholds
│   │
│   ├── styles/
│   │   ├── tokens.css                 # ALL design tokens (see §2 below)
│   │   ├── globals.css
│   │   └── animations.css             # shared keyframes (pulse, fade, float)
│   │
│   └── main.tsx
│
├── tests/
│   ├── unit/                          # vitalStatus logic, formatters
│   ├── integration/                   # page-level render + interaction tests
│   └── e2e/                           # Playwright/Cypress — full nav flows
│
├── .env.example                       # API_BASE_URL, WS_URL, AUTH_DOMAIN
├── package.json
├── tsconfig.json
└── vite.config.ts
```

**Why this shape:**
- `pages/` mirrors the six screens 1:1 — anyone can find "the alerts page" instantly.
- `components/ui/` holds the **glass-morphism primitives** (GlassCard, StatusRing, Switch) so the Apple-style look lives in one place, not copy-pasted per page.
- `hooks/` isolates live-data plumbing (WebSocket, polling) from rendering — pages stay dumb/presentational, easy to test.
- `services/` is the only layer that talks to the backend — swapping REST for GraphQL later touches this folder only.
- `styles/tokens.css` is the **single source of truth** for every color/radius/shadow — see §2.

---

## 2. Theme System — "Apple Health Glass"

### 2.1 Color palette (CSS custom properties)

```css
:root{
  /* Canvas & glass */
  --canvas:        #EEF2F7;   /* app background */
  --glass:         rgba(255,255,255,0.62);
  --glass-strong:  rgba(255,255,255,0.82);
  --glass-border:  rgba(255,255,255,0.90);

  /* Ink (text) */
  --ink:           #1C2331;   /* primary text */
  --ink-soft:      #5B6472;   /* secondary text */
  --ink-faint:     #8A93A3;   /* tertiary / meta text */
  --divider:       rgba(28,35,49,0.08);

  /* Brand */
  --blue:          #4C8DFF;   /* primary accent, active states, CTAs */
  --blue-soft:     rgba(76,141,255,0.12);
  --lavender:      #8C7CF0;   /* secondary accent (gradients, BP chart) */

  /* Status semantics — the ONLY loud colors in the system */
  --mint:          #2FBD85;   /* stable */
  --mint-soft:     rgba(47,189,133,0.14);
  --amber:         #F5A93F;   /* watch */
  --amber-soft:    rgba(245,169,63,0.16);
  --coral:         #FF5C6C;   /* critical */
  --coral-soft:    rgba(255,92,108,0.14);

  /* Aurora background blobs (decorative, low-opacity, blurred) */
  --aurora-blue:   #BFD7FF;
  --aurora-pink:   #FFD6E8;
  --aurora-mint:   #D6FFEA;
}
```

**Rule:** color carries meaning, not decoration. Mint/amber/coral are *reserved exclusively* for patient status and alert severity — never used decoratively elsewhere, so a clinician's eye is never asked to second-guess whether a color means "urgent."

### 2.2 Typography

- **Family:** Inter (Google Fonts), fallback `-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif` — this fallback chain means Apple/Mac users see actual San Francisco even before Inter loads.
- **One family, weight does the work:**
  | Use | Weight | Size |
  |---|---|---|
  | Page title | 800 | 22–24px |
  | Card/section title | 700 | 14–16px |
  | Big vital number | 800 | 24–28px |
  | Body / labels | 600 | 13–14px |
  | Meta / timestamps | 500 | 11–12px |
- Letter-spacing: `-0.01em` to `-0.02em` on large numerals and headings (the "tightened" look Apple uses on big display numbers).

### 2.3 Shape & elevation

- **Radius scale:** `--radius-lg: 28px` (page-level cards) · `--radius-md: 18px` (tiles, panels) · `--radius-sm: 12px` (chips, inputs) — never mix an unrelated radius onto one card; nested elements step down one size.
- **Shadow:** one soft, consistent shadow — `0 8px 30px rgba(28,35,49,0.06), 0 2px 8px rgba(28,35,49,0.04)` — never a harsh drop shadow; elevation comes from blur + glass, not darkness.
- **Glass recipe** (the core Apple effect):
  ```css
  background: rgba(255,255,255,0.62);
  backdrop-filter: blur(24px) saturate(160%);
  border: 1px solid rgba(255,255,255,0.90);
  ```
  Always sits above the blurred "aurora" gradient blobs — that's what produces the frosted, colorful depth instead of flat white cards.

### 2.4 Motion (the "one bold moment" principle)

| Interaction | Motion |
|---|---|
| Page switch | Fade + 8px rise, 420ms, `cubic-bezier(.22,1,.36,1)` |
| Live vital number updates | Quick scale-pulse (1.12→1) on the number only, 400ms |
| Card hover | Lift 3px + shadow deepen, 250ms — no rotation/tilt gimmicks |
| Critical status ring | Soft pulsing halo (box-shadow breathing), 1.3s loop — the *only* looping animation, reserved for true urgency |
| Toggle switch | Knob slides 250ms, same easing curve everywhere |
| Toast | Slides up from bottom, 400ms |
| Background aurora blobs | Slow 22s float loop, disabled entirely under `prefers-reduced-motion` |

**Rule:** motion always answers a change in data or a user action — nothing animates just to look alive. This keeps it calm enough for a clinical setting instead of feeling like a consumer app.

---

## 3. Pages — What Each One Does and Needs

| Page | Purpose | Key live data | Primary actions |
|---|---|---|---|
| **Overview** | Ward-wide at-a-glance grid | All patients' vitals, status color | Search/filter, click card → detail |
| **Patient Detail** | Deep single-patient view | Live vitals tiles, trend chart, connected devices, alert history | Switch vital tab, back to overview |
| **Alerts** | Full ward alert log | All alerts, severity, ack state | Filter by severity, acknowledge |
| **Devices** | Every bedside gateway | Device online/offline, protocol, which vitals it feeds | (Read-only status board) |
| **Trends** | Ward-level aggregate analytics | Average HR over time, alert volume by severity | (Read-only, exportable later) |
| **Settings** | Threshold & notification config | — | Adjust sliders, toggle channels, save |

This matches the six-page structure already built in the prototype, and lines up 1:1 with `pages/` in the file tree above — nothing in the wireframe exists without a corresponding folder, and nothing in the folder tree is unused.

---

## 4. Connecting This to the Real Architecture

This dashboard is the **presentation layer** from the earlier system architecture document. In production:
- `useLiveVitals` / `useWardSocket` connect via WebSocket to the **Alert & Escalation Engine** and **stream-processing layer**, not directly to raw device feeds.
- `services/api/thresholds.ts` writes to the same threshold store the **Alarm Reduction Subsystem** reads from — so a nurse adjusting a slider here is editing the actual deterministic rule engine, live.
- The topbar's system-status pill should be wired to the **synthetic canary/dead-man's-switch** health check from the v2 architecture — if that heartbeat stops, this pill is what tells the room.
- `DevicesPage` should reflect the **Device Trust Model** — device rows should be able to show a compromised/advisory-flagged state, not just online/offline, once that feed exists.

---

*Open `icu_dashboard.html` for the live, interactive version of every page and behavior described above — it's a fully working prototype with simulated real-time data, not a static mockup.*
