#!/bin/bash

# Deployment Checklist Script
# Run this before deploying to Vercel

echo "🚀 Mallorca Activities - Pre-Deployment Checklist"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Track failures
FAILED=0

# Function to check command success
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
    else
        echo -e "${RED}✗${NC} $1"
        FAILED=$((FAILED+1))
    fi
}

# 1. Check Git status
echo "1. Checking Git Status..."
git status --porcelain
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓${NC} Working directory clean"
else
    echo -e "${YELLOW}⚠${NC} You have uncommitted changes"
fi
echo ""

# 2. Environment Variables
echo "2. Checking Environment Variables..."
node scripts/check-build.js
check_status "Environment variables validated"
echo ""

# 3. Dependencies
echo "3. Checking Dependencies..."
npm list --depth=0 > /dev/null 2>&1
check_status "Dependencies installed"
echo ""

# 4. TypeScript
echo "4. Running TypeScript Check..."
npm run type-check > /dev/null 2>&1
check_status "TypeScript check passed"
echo ""

# 5. Linting
echo "5. Running ESLint..."
npm run lint > /dev/null 2>&1
check_status "Linting passed"
echo ""

# 6. Build Test
echo "6. Testing Production Build..."
echo "   This may take a few minutes..."
npm run build > /dev/null 2>&1
check_status "Production build successful"
echo ""

# 7. Check for common issues
echo "7. Checking for Common Issues..."

# Check for console.log statements
CONSOLE_LOGS=$(grep -r "console\.log" --include="*.ts" --include="*.tsx" app/ lib/ components/ 2>/dev/null | wc -l)
if [ $CONSOLE_LOGS -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} Found $CONSOLE_LOGS console.log statements"
else
    echo -e "${GREEN}✓${NC} No console.log statements found"
fi

# Check for TODO comments
TODOS=$(grep -r "TODO" --include="*.ts" --include="*.tsx" app/ lib/ components/ 2>/dev/null | wc -l)
if [ $TODOS -gt 0 ]; then
    echo -e "${YELLOW}⚠${NC} Found $TODOS TODO comments"
else
    echo -e "${GREEN}✓${NC} No TODO comments found"
fi
echo ""

# 8. Vercel Configuration
echo "8. Checking Vercel Configuration..."
if [ -f "vercel.json" ]; then
    echo -e "${GREEN}✓${NC} vercel.json found"
else
    echo -e "${YELLOW}⚠${NC} No vercel.json file (using defaults)"
fi
echo ""

# Summary
echo "================================================"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL CHECKS PASSED!${NC}"
    echo ""
    echo "Your code is ready for deployment to Vercel!"
    echo ""
    echo "Next steps:"
    echo "1. Commit your changes: git add -A && git commit -m 'your message'"
    echo "2. Push to GitHub: git push origin main"
    echo "3. Vercel will automatically deploy"
else
    echo -e "${RED}❌ FAILED $FAILED CHECKS${NC}"
    echo ""
    echo "Please fix the issues above before deploying."
    exit 1
fi

echo ""
echo "📝 Remember to check Vercel environment variables:"
echo "   https://vercel.com/[your-team]/[your-project]/settings/environment-variables"
echo ""