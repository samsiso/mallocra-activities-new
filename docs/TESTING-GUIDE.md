# Testing Guide for Mallorca Activities Platform

This guide covers the automated testing setup for the booking flow, including E2E tests with Playwright and unit tests with Vitest.

## 🧪 Test Structure

```
tests/
├── e2e/                          # End-to-end tests
│   ├── booking-flow.spec.ts      # Main booking flow tests
│   ├── booking-error-handling.spec.ts  # Error scenarios
│   └── booking-console-monitoring.spec.ts  # Console log analysis
├── unit/                         # Unit tests
│   └── booking-actions.test.ts   # Server action tests
└── helpers/                      # Test utilities
    └── test-utils.ts            # Common test helpers
```

## 🚀 Running Tests

### Quick Start

```bash
# Run all E2E tests
npm run test:e2e

# Run tests with UI (recommended for debugging)
npm run test:e2e:ui

# Run specific test file
npm run test:e2e booking-flow

# Run with console monitoring
npm run test:e2e:console

# Run all tests with automated server start
npm run test:booking
```

### Test Commands

| Command | Description |
|---------|-------------|
| `npm run test` | Run unit tests with Vitest |
| `npm run test:e2e` | Run all E2E tests headless |
| `npm run test:e2e:ui` | Open Playwright UI mode |
| `npm run test:e2e:debug` | Run tests in debug mode |
| `npm run test:e2e:headed` | Run tests with browser visible |
| `npm run test:e2e:console` | Run console monitoring tests |
| `npm run test:booking` | Run tests with automated setup |

## 📝 What's Being Tested

### 1. **Complete Booking Flow** (`booking-flow.spec.ts`)
- Navigate from activities page to completion
- Select date, time, and participants
- Fill customer details
- Complete booking successfully
- Verify UI consistency (pink theme, progress indicators)

### 2. **Error Handling** (`booking-error-handling.spec.ts`)
- Database connection failures
- Invalid form inputs
- Missing activities
- Network timeouts
- API errors

### 3. **Console Monitoring** (`booking-console-monitoring.spec.ts`)
- Captures all console logs during booking
- Tracks API calls and responses
- Identifies errors and warnings
- Provides detailed debugging information

### 4. **Unit Tests** (`booking-actions.test.ts`)
- Server action functionality
- Guest user creation
- Error handling in actions
- Database operations

## 🐛 Debugging Failed Tests

### View Test Reports
```bash
# After running tests, view HTML report
npx playwright show-report

# View trace for failed tests
npx playwright show-trace trace.zip
```

### Console Monitoring
The console monitoring test provides detailed logs:
- All console messages (errors, warnings, info)
- API call tracking
- Timing information
- Error stack traces

### Common Issues and Solutions

1. **"Database unavailable" error**
   - Check `.env.local` has correct Supabase keys
   - Verify `SUPABASE_SERVICE_ROLE_KEY` is set
   - Ensure database has proper RLS policies

2. **"Invalid API key" error**
   - Verify environment variables are loaded
   - Check server is running on correct port (3001)
   - Ensure using admin client for server actions

3. **UI styling issues**
   - Verify pink theme is applied (not blue/orange)
   - Check progress indicators are visible
   - Ensure glassmorphism effects work

## 🔧 Test Configuration

### Playwright Config (`playwright.config.ts`)
- Base URL: `http://localhost:3001`
- Browsers: Chrome, Firefox, Safari, Mobile
- Screenshots on failure
- Video recording on failure
- Trace collection on retry

### Environment Setup
Required environment variables:
```env
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## 📊 CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests
- Manual workflow dispatch

GitHub Actions workflow: `.github/workflows/e2e-tests.yml`

## 🎯 Best Practices

1. **Always run tests before committing**
   ```bash
   npm run test:booking
   ```

2. **Use UI mode for debugging**
   ```bash
   npm run test:e2e:ui
   ```

3. **Check console logs for errors**
   ```bash
   npm run test:e2e:console
   ```

4. **Keep tests isolated**
   - Clear localStorage before each test
   - Use fresh test data
   - Don't depend on external state

5. **Write descriptive test names**
   - Explain what is being tested
   - Include expected outcome
   - Make failures easy to understand

## 🚨 Troubleshooting

### Server not starting
```bash
# Check if port 3001 is in use
lsof -i :3001

# Start server manually
npm run dev
```

### Tests timing out
- Increase timeout in test: `test.setTimeout(60000)`
- Check network requests in trace viewer
- Verify API endpoints are responding

### Flaky tests
- Add explicit waits: `await page.waitForSelector()`
- Use network idle: `await page.waitForLoadState('networkidle')`
- Check for race conditions in API calls

## 📈 Monitoring Test Health

1. **Review test reports regularly**
2. **Track flaky tests**
3. **Monitor test execution time**
4. **Keep tests up to date with UI changes**

## 🔗 Related Documentation

- [Playwright Documentation](https://playwright.dev)
- [Vitest Documentation](https://vitest.dev)
- [Project README](../README.md)
- [Supabase Integration](./SUPABASE-MCP-INTEGRATION.md)