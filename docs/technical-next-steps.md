# Technical Next Steps (Production Path)

## Backend Hardening

1. Add environment config and secrets management (`dotenv` + cloud secret manager).
2. Add PostgreSQL schema migrations for users, prices, alerts, and orders.
3. Add Redis cache for latest prices and alert-evaluation windows.
4. Add queue/cron worker for alert checks every 30 minutes.
5. Add WebSocket (`socket.io`) channel for home screen real-time updates.
6. Add idempotency and retry logic for external rate provider ingestion.

## Mobile Hardening

1. Integrate React Navigation for nested stacks and deep links.
2. Add state management (Zustand/Redux Toolkit) for cached prices and settings.
3. Implement city selector and persisted preferences.
4. Implement alert creation UI and user alerts list.
5. Integrate chart library and interaction gestures.
6. Add notification permission and FCM token registration flow.

## Quality and Operations

1. Add unit tests for service/business logic.
2. Add API integration tests with supertest.
3. Add E2E smoke tests for core app flow.
4. Add Sentry and performance tracing on API + mobile.
5. Add Mixpanel/Firebase events for KPI instrumentation.

## Release Gating

1. P95 API latency < 500ms for current prices endpoint.
2. Mobile home first meaningful render < 2 seconds on 4G.
3. Crash-free sessions >= 99.5 percent in beta.
4. Alert trigger accuracy > 99 percent in simulated backtest.
