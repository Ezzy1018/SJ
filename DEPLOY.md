# Quick Deployment Reference

## Backend Deployment (90 seconds)

```bash
# 1. Install & Build (30s)
npm install --frozen-lockfile
npm run build

# 2. Verify (10s)
npm audit --audit-level=moderate

# 3. Deploy (20s)
pm2 start services/api/src/index.ts --name shakuntala-api --env production

# 4. Check (10s)
curl https://api.shakuntala-gold.com/health
```

## Mobile Deployment (2-5 minutes)

### Option A: Expo EAS (Easiest)
```bash
eas build --platform ios --auto-submit
eas build --platform android --auto-submit
```

### Option B: Bare React Native (With Certificate Pinning)
```bash
npm install react-native-ssl-pinning
npx expo prebuild --clean
# Update certificate pins in apps/mobile/src/services/certificate-pinning.ts
eas build --platform ios
eas build --platform android
```

## Environment Setup

```bash
# 1. Copy template
cp docs/ENV_TEMPLATE.md .env.production

# 2. Fill in required values:
# - FIREBASE_* credentials
# - IBJA_API_KEY, MCX_API_KEY
# - DATABASE_URL
# - REDIS_URL
# - CORS_ORIGINS

# 3. Verify
env | grep FIREBASE_PROJECT_ID  # Should output your project ID
```

## Pre-Deployment Checklist

```bash
# 1. Security
npm audit --audit-level=moderate
# Expected: found 0 vulnerabilities

# 2. Build
npm run build
# Expected: Successful compilation

# 3. Types
npm run typecheck
# Expected: No errors

# 4. Files exist
ls docs/PRODUCTION_DEPLOYMENT.md
ls docs/security-audit-report.md
ls PRODUCTION_READY.md
# Expected: All files present
```

## Production Health Check

```bash
# API Running
curl https://api.shakuntala-gold.com/health
# Expected: {"status":"ok","service":"sj-api",...}

# Security Headers
curl -I https://api.shakuntala-gold.com/health
# Expected: Strict-Transport-Security, X-Content-Type-Options, etc.

# Rate Limiting
for i in {1..101}; do curl https://api.shakuntala-gold.com/api/prices/current?city=jaipur; done
# Expected: Request 101 returns 429 (Too Many Requests)

# Input Validation
curl -X POST https://api.shakuntala-gold.com/api/alerts/create \
  -H "Content-Type: application/json" \
  -d '{"invalid":"data"}'
# Expected: 400 (Validation Error)
```

## Certificate Pinning Setup

```bash
# 1. Generate pins from your certificate
openssl x509 -in api.shakuntala-gold.com.crt -pubkey -noout | \
  openssl pkey -pubin -outform DER | \
  openssl dgst -sha256 -binary | \
  openssl enc -base64
# Copy output (format: sha256/BASE64=)

# 2. Update pinning config
# Edit: apps/mobile/src/services/certificate-pinning.ts
# Replace placeholder pins with your actual pins

# 3. Rebuild mobile app
eas build --platform ios
eas build --platform android

# 4. Deploy
# Upload to App Store / Play Store
```

## Database Setup (If Using Phase 2)

```bash
# PostgreSQL
createdb shakuntala
CREATE USER app_user WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE shakuntala TO app_user;

# Redis
redis-cli CONFIG SET requirepass "secure_password"

# Environment
export DATABASE_URL=postgresql://app_user:password@host:5432/shakuntala
export REDIS_URL=redis://:password@host:6379
```

## Monitoring & Logs

```bash
# View logs
pm2 logs shakuntala-api

# Monitor metrics
pm2 monit

# Search logs for errors
pm2 logs shapkuntala-api | grep ERROR

# Check specific endpoint
curl -v https://api.shakuntala-gold.com/api/prices/current?city=jaipur
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Run `npm install --frozen-lockfile` |
| Vulnerabilities | Run full clean install with locked dependencies |
| API won't start | Check environment variables are set correctly |
| Certificate pinning fails | Verify pins with OpenSSL command, ensure format is `sha256/BASE64=` |
| Rate limiting blocks requests | Check if running > rate limit thresholds (global: 100/15m, prices: 60/min) |
| CORS errors | Verify CORS_ORIGINS env var lists your frontend domain |
| Firebase auth fails | Verify FIREBASE_PRIVATE_KEY has proper newlines |

## Rollback Plan

```bash
# If something breaks:

# 1. Stop current version
pm2 stop shakuntala-api

# 2. Revert code
git checkout <previous-commit>

# 3. Rebuild
npm install --frozen-lockfile
npm run build

# 4. Restart
pm2 restart shakuntala-api

# 5. Verify
curl https://api.shakuntala-gold.com/health
```

## Documentation References

- **Full Deployment Guide**: `docs/PRODUCTION_DEPLOYMENT.md`
- **Environment Templates**: `docs/ENV_TEMPLATE.md`
- **Security Details**: `docs/security-audit-report.md`
- **Architecture**: `PRODUCTION_READY.md`
- **Deployment Status**: `DEPLOYMENT_COMPLETE.md`

---

**Status**: ✅ PRODUCTION READY  
**Last Updated**: March 30, 2026  
**Build**: Clean • Verified • Security Hardened
