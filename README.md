# Shakuntala Gold Platform

Production scaffold for the Shakuntala Jewellers gold-rate + commerce app.

## Monorepo Layout

- `apps/mobile`: Expo React Native mobile app shell (iOS + Android)
- `services/api`: Node.js + Express MVP API
- `packages/contracts`: shared TypeScript contracts
- `design-system`: premium dark-gold design foundations and docs

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Run API:

```bash
npm run dev:api
```

3. Run mobile app:

```bash
npm run dev:mobile
```

## MVP Endpoints Implemented

- `GET /health`
- `GET /api/prices/current?city=jaipur&karat=22,24`
- `GET /api/prices/history?city=jaipur&karat=22&period=1d`
- `POST /api/alerts/create`
- `GET /api/alerts/user/:userId`
- `DELETE /api/alerts/:alertId`
- `POST /api/calculator`
- `POST /api/auth/register`
- `POST /api/auth/verify-otp`

## Current Status

- MVP architecture is scaffolded and runnable.
- API currently uses in-memory stores with deterministic seeded data.
- Next step is database + Redis + live IBJA/MCX adapters.

## References

- Product execution mapping: `docs/prd-to-build-map.md`
- System architecture direction: `docs/technical-next-steps.md`
