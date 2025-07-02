#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🧪 Running E2E Tests for Booking Flow${NC}"
echo "=================================="

# Check if server is running
if ! curl -s http://localhost:3001 > /dev/null; then
    echo -e "${YELLOW}⚠️  Server not running on port 3001. Starting dev server...${NC}"
    npm run dev &
    SERVER_PID=$!
    
    # Wait for server to be ready
    echo "Waiting for server to start..."
    sleep 10
    
    # Check again
    if ! curl -s http://localhost:3001 > /dev/null; then
        echo -e "${RED}❌ Failed to start dev server${NC}"
        exit 1
    fi
fi

# Install Playwright if needed
if ! npx playwright --version > /dev/null 2>&1; then
    echo -e "${YELLOW}📦 Installing Playwright...${NC}"
    npx playwright install --with-deps
fi

# Run tests based on argument
if [ "$1" = "ui" ]; then
    echo -e "${GREEN}🎭 Running tests with UI mode${NC}"
    npx playwright test --ui
elif [ "$1" = "debug" ]; then
    echo -e "${GREEN}🐛 Running tests in debug mode${NC}"
    npx playwright test --debug
elif [ "$1" = "headed" ]; then
    echo -e "${GREEN}👀 Running tests in headed mode${NC}"
    npx playwright test --headed
elif [ "$1" = "console" ]; then
    echo -e "${GREEN}📝 Running console monitoring tests${NC}"
    npx playwright test booking-console-monitoring
else
    echo -e "${GREEN}🚀 Running all tests${NC}"
    npx playwright test
fi

# Check test results
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    echo -e "${GREEN}📊 View report: npx playwright show-report${NC}"
else
    echo -e "${RED}❌ Some tests failed${NC}"
    echo -e "${YELLOW}📊 View report: npx playwright show-report${NC}"
fi

# Clean up server if we started it
if [ ! -z "$SERVER_PID" ]; then
    echo -e "${YELLOW}🛑 Stopping dev server...${NC}"
    kill $SERVER_PID
fi