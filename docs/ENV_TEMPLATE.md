# Production Environment Configuration Template

## Backend Environment (.env.production)

```bash
# Application Runtime
NODE_ENV=production
PORT=4000
LOG_LEVEL=info

# CORS and Security
CORS_ORIGINS=https://app.shakuntala-gold.com,https://web.shakuntala-gold.com
FORCE_HTTPS=true

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\nEND PRIVATE KEY-----\n"

# External API Keys (use secrets manager)
IBJA_API_KEY=your_ibja_api_key_here
MCX_API_KEY=your_mcx_api_key_here

# Database (PostgreSQL)
DATABASE_URL=postgresql://app_user:secure_password@prod-db.internal:5432/shakuntala

# Cache (Redis)
REDIS_URL=redis://:secure_password@prod-cache.internal:6379

# TLS/SSL Certificates
TLS_CERT_PATH=/etc/letsencrypt/live/api.shakuntala-gold.com/fullchain.pem
TLS_KEY_PATH=/etc/letsencrypt/live/api.shakuntala-gold.com/privkey.pem
```

## Mobile Environment (.env.production)

```bash
# API Configuration
EXPO_PUBLIC_API_URL=https://api.shakuntala-gold.com/api

# Build/Version Information
EXPO_PUBLIC_BUILD_ID=1.0.0
EXPO_PUBLIC_BUILD_TIMESTAMP=2026-03-30T00:00:00Z

# Certificate Pinning
EXPO_PUBLIC_PINNING_MODE=strict
EXPO_PUBLIC_PINNING_ENFORCED=true

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true
EXPO_PUBLIC_ENABLE_PERFORMANCE_MONITORING=true
```

## Development Environment (.env.development)

```bash
# Application Runtime
NODE_ENV=development
PORT=4000
LOG_LEVEL=debug

# CORS (permissive for local development)
CORS_ORIGINS=http://localhost:3000,http://localhost:3001,http://127.0.0.1:3000

# Firebase (use dev project)
FIREBASE_PROJECT_ID=shakuntala-dev
FIREBASE_CLIENT_EMAIL=dev-account@shakuntala-dev.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# API Keys (dev values)
IBJA_API_KEY=dev_ibja_key
MCX_API_KEY=dev_mcx_key

# Database (local/dev)
DATABASE_URL=postgresql://dev:dev@localhost:5432/shakuntala_dev

# Cache (local/dev)
REDIS_URL=redis://localhost:6379

# TLS (disabled for local dev)
TLS_CERT_PATH=
TLS_KEY_PATH=
```

## Staging Environment (.env.staging)

```bash
# Application Runtime
NODE_ENV=production
PORT=4000
LOG_LEVEL=info

# CORS (staging domain)
CORS_ORIGINS=https://staging.shakuntala-gold.com

# Firebase (use staging project)
FIREBASE_PROJECT_ID=shakuntala-staging
FIREBASE_CLIENT_EMAIL=staging-account@shakuntala-staging.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# API Keys (staging values)
IBJA_API_KEY=staging_ibja_key
MCX_API_KEY=staging_mcx_key

# Database (staging RDS)
DATABASE_URL=postgresql://app_user:password@staging-db.internal:5432/shakuntala

# Cache (staging Redis)
REDIS_URL=redis://:password@staging-cache.internal:6379

# TLS
TLS_CERT_PATH=/etc/ssl/certs/staging.crt
TLS_KEY_PATH=/etc/ssl/private/staging.key
```

---

## Configuration Best Practices

### Secret Management

✅ **DO:**
- Store secrets in AWS Secrets Manager / HashiCorp Vault
- Rotate API keys quarterly
- Use separate keys for dev/staging/production
- Keep FIREBASE_PRIVATE_KEY in secure storage
- Audit secret access logs regularly

❌ **DON'T:**
- Commit .env files to git
- Share credentials via email/Slack
- Use same keys across environments
- Log secrets in application logs
- Hardcode API keys in code

### Certificate Management

✅ **DO:**
- Auto-renew certificates (Let's Encrypt)
- Monitor expiration dates
- Test certificate rotation in staging first
- Update certificate pins before deployment
- Keep secondary pin during rotation

❌ **DON'T:**
- Let certificates expire
- Use self-signed certs in production
- Forget to update app with new pins
- Deploy without testing in staging

### Database Configuration

✅ **DO:**
- Use connection pooling (pgBouncer)
- Enable SSL for all connections
- Create restricted database users
- Regular backups with encryption
- Monitor slow queries

❌ **DON'T:**
- Use superuser account for app
- Allow unauthenticated connections
- Skip SSL/TLS
- Disable read-only replicas
- Run without backups

---

## Quick Start

### Deploy Backend to Production

```bash
# 1. Prepare environment file
cp docs/ENV_TEMPLATE.md /etc/shakuntala/.env.production
# Edit with actual values

# 2. Install and build
npm install --frozen-lockfile
npm run build

# 3. Verify security
npm audit --audit-level=moderate

# 4. Start with PM2
pm2 start services/api/src/index.ts \
  --name shakuntala-api \
  --env production \
  --instances max

# 5. Verify running
pm2 logs shakuntala-api
```

### Deploy Mobile to Production

```bash
# For Expo EAS Builds:
eas build --platform ios --auto-submit
eas build --platform android --auto-submit

# For bare React Native:
npm install react-native-ssl-pinning
npx expo prebuild --clean
eas build --platform ios --distribution internal
eas build --platform android --distribution internal
```

---

## Troubleshooting

### Certificate Pinning Failures

```bash
# Verify pin format
openssl x509 -in cert.crt -pubkey -noout | \
  openssl pkey -pubin -outform DER | \
  openssl dgst -sha256 -binary | \
  openssl enc -base64

# Should match format: sha256/BASE64_HASH=
```

### Database Connection Issues

```bash
# Test PostgreSQL connectivity
psql -h prod-db.internal -U app_user -d shakuntala

# Test Redis connectivity
redis-cli -h prod-cache.internal ping
```

### API Startup Issues

```bash
# Check logs
pm2 logs shakuntala-api

# Verify required env vars
env | grep -E "FIREBASE_|IBJA_|MCX_"
```
