# PRD to Build Map

This map translates the PRD into implementation modules in this repository.

## Phase 1 MVP Coverage

### 1. Home Screen Daily Price Display

- Mobile shell: `apps/mobile/src/screens/HomeScreen.tsx`
- API endpoint: `GET /api/prices/current`
- Service: `services/api/src/services/price-service.ts`
- Status: Implemented with seeded data and city support.

### 2. Price Chart View

- Mobile placeholder: `apps/mobile/src/screens/ChartScreen.tsx`
- API endpoint: `GET /api/prices/history`
- Service: `services/api/src/services/price-service.ts`
- Status: API implemented; chart rendering pending chart library integration.

### 3. Price Alerts Setup

- API endpoints: `POST /api/alerts/create`, `GET /api/alerts/user/:userId`, `DELETE /api/alerts/:alertId`
- Service: `services/api/src/services/alert-service.ts`
- Rule implemented: max 3 active alerts per user.
- Status: Backend complete; mobile alert setup UI pending.

### 4. City Selector

- Supported cities coded in controllers (8 PRD cities).
- Status: Data and query support done; UI selector pending.

### 5. Gold Calculator

- API endpoint: `POST /api/calculator`
- Service: `services/api/src/services/calculator-service.ts`
- Purity multipliers: 24K=1, 22K=0.916, 18K=0.75
- Status: Backend complete; calculator UI pending.

### 6. Collection Tab (Basic)

- Mobile placeholder: `apps/mobile/src/screens/CollectionScreen.tsx`
- Status: Skeleton ready; CMS integration pending.

### 7. Settings and Notifications Hub

- Mobile placeholder: `apps/mobile/src/screens/SettingsScreen.tsx`
- Status: Visual shell added; persistence and permissions pending.

## Cross-Cutting

### Contracts and Types

- Shared definitions: `packages/contracts/src/index.ts`

### Design System

- Tokens and guidance: `design-system/*`

### Auth

- API endpoints: `POST /api/auth/register`, `POST /api/auth/verify-otp`
- Status: Stub OTP flow for development.

## Critical Next Actions

1. Replace in-memory store with PostgreSQL repositories.
2. Add Redis for current price cache and alert checking jobs.
3. Add live adapters for IBJA + MCX with source failover logic.
4. Add WebSocket stream for live price updates to mobile app.
5. Implement onboarding, city selector, alerts, and calculator screens.
