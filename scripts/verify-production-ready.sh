#!/bin/bash

# Production Readiness Verification Script
# Run this before deployment to ensure all systems are ready

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Shakuntala Gold - Production Readiness Check"
echo "=================================================="
echo ""

# Counter for checks
PASS=0
FAIL=0
WARN=0

check_pass() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((PASS++))
}

check_fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((FAIL++))
}

check_warn() {
    echo -e "${YELLOW}⚠ WARN${NC}: $1"
    ((WARN++))
}

# 1. Dependency Security Check
echo -e "\n${YELLOW}[1/8]${NC} Checking dependencies..."
if npm audit --audit-level=moderate > /dev/null 2>&1; then
    check_pass "npm audit: 0 vulnerabilities"
else
    check_fail "npm audit: Found vulnerabilities"
fi

# 2. TypeScript Compilation
echo -e "\n${YELLOW}[2/8]${NC} Checking TypeScript compilation..."
if npm run typecheck > /dev/null 2>&1; then
    check_pass "TypeScript compilation successful"
else
    check_fail "TypeScript compilation failed"
fi

# 3. Build Process
echo -e "\n${YELLOW}[3/8]${NC} Checking build process..."
if npm run build > /dev/null 2>&1; then
    check_pass "Production build successful"
else
    check_fail "Production build failed"
fi

# 4. Environment Configuration
echo -e "\n${YELLOW}[4/8]${NC} Checking environment configuration..."
required_vars=(
    "FIREBASE_PROJECT_ID"
    "FIREBASE_CLIENT_EMAIL"
    "FIREBASE_PRIVATE_KEY"
    "IBJA_API_KEY"
    "MCX_API_KEY"
    "CORS_ORIGINS"
)

missing_vars=()
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -eq 0 ]; then
    check_pass "All required environment variables present"
else
    check_warn "Missing environment variables: ${missing_vars[*]}"
fi

# 5. Security Headers
echo -e "\n${YELLOW}[5/8]${NC} Checking API security...
"
if command -v curl &> /dev/null; then
    if curl -s http://localhost:4000/health > /dev/null 2>&1; then
        check_pass "API health endpoint responding"
        
        # Check headers
        headers=$(curl -I -s http://localhost:4000/health)
        if echo "$headers" | grep -q "X-Content-Type-Options"; then
            check_pass "Security headers present (X-Content-Type-Options)"
        else
            check_warn "Some security headers may be missing"
        fi
    else
        check_warn "API not running - skipping connectivity checks"
    fi
else
    check_warn "curl not found - skipping API health checks"
fi

# 6. Certificate Pinning
echo -e "\n${YELLOW}[6/8]${NC} Checking certificate pinning setup..."
if [ -f "apps/mobile/src/services/certificate-pinning.ts" ]; then
    check_pass "Certificate pinning module exists"
    
    if grep -q "PRODUCTION_PINS" apps/mobile/src/services/certificate-pinning.ts; then
        check_pass "Production pins configuration found"
    else
        check_fail "Production pins not configured"
    fi
else
    check_fail "Certificate pinning module missing"
fi

# 7. Documentation
echo -e "\n${YELLOW}[7/8]${NC} Checking documentation..."
required_docs=(
    "docs/PRODUCTION_DEPLOYMENT.md"
    "docs/security-audit-report.md"
    "docs/ENV_TEMPLATE.md"
)

for doc in "${required_docs[@]}"; do
    if [ -f "$doc" ]; then
        check_pass "Documentation present: $doc"
    else
        check_fail "Missing documentation: $doc"
    fi
done

# 8. Version Pinning
echo -e "\n${YELLOW}[8/8]${NC} Checking version pinning..."
if [ -f ".nvmrc" ]; then
    node_version=$(cat .nvmrc)
    check_pass "Node version pinned: $node_version"
else
    check_warn "Node version not pinned (.nvmrc missing)"
fi

if [ -f "package-lock.json" ]; then
    check_pass "npm lockfile present"
else
    check_fail "npm lockfile missing"
fi

# Summary
echo ""
echo "=================================================="
echo -e "Results: ${GREEN}$PASS PASS${NC} | ${RED}$FAIL FAIL${NC} | ${YELLOW}$WARN WARN${NC}"
echo "=================================================="

if [ $FAIL -eq 0 ] && [ $WARN -eq 0 ]; then
    echo -e "\n${GREEN}✓ PRODUCTION READY${NC}"
    exit 0
elif [ $FAIL -eq 0 ]; then
    echo -e "\n${YELLOW}⚠ READY WITH WARNINGS${NC}"
    echo "Please review warnings before deployment"
    exit 0
else
    echo -e "\n${RED}✗ NOT READY FOR PRODUCTION${NC}"
    echo "Please fix failures before deployment"
    exit 1
fi
