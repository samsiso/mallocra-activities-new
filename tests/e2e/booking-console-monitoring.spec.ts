import { test, expect, ConsoleMessage } from '@playwright/test'
import { setupBookingData, TEST_USERS } from '../helpers/test-utils'

test.describe('Booking Flow Console Monitoring', () => {
  test('should capture and analyze console logs during booking', async ({ page }) => {
    const consoleLogs: { type: string; text: string; location?: string }[] = []
    
    // Capture all console messages
    page.on('console', (msg: ConsoleMessage) => {
      consoleLogs.push({
        type: msg.type(),
        text: msg.text(),
        location: msg.location().url
      })
    })
    
    // Set up booking data
    const bookingData = {
      activityId: 'test-activity',
      activity: { title: 'Test Activity' },
      selectedDate: '2024-03-20',
      selectedTime: '10:00',
      adults: 2,
      children: 0,
      totalPrice: 100,
      customerDetails: TEST_USERS.guest
    }
    
    await setupBookingData(page, bookingData)
    
    // Navigate to payment page
    await page.goto('/book/test-activity/payment')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Look for any console errors before attempting booking
    const preBookingErrors = consoleLogs.filter(log => log.type === 'error')
    if (preBookingErrors.length > 0) {
      console.log('Pre-booking errors found:')
      preBookingErrors.forEach(error => {
        console.log(`- ${error.text} (at ${error.location})`)
      })
    }
    
    // Click Complete Booking
    await page.locator('button:has-text("Complete Booking")').click()
    
    // Wait for action to complete (either success or error)
    await page.waitForTimeout(5000)
    
    // Analyze console logs
    const errors = consoleLogs.filter(log => log.type === 'error')
    const warnings = consoleLogs.filter(log => log.type === 'warning')
    const infos = consoleLogs.filter(log => log.type === 'info' || log.type === 'log')
    
    // Print summary
    console.log('\n=== Console Log Summary ===')
    console.log(`Total logs: ${consoleLogs.length}`)
    console.log(`Errors: ${errors.length}`)
    console.log(`Warnings: ${warnings.length}`)
    console.log(`Info/Log: ${infos.length}`)
    
    if (errors.length > 0) {
      console.log('\n=== Errors ===')
      errors.forEach(error => {
        console.log(`[ERROR] ${error.text}`)
        if (error.location) console.log(`  Location: ${error.location}`)
      })
    }
    
    // Look for specific patterns
    const bookingLogs = infos.filter(log => 
      log.text.includes('booking') || 
      log.text.includes('Booking') ||
      log.text.includes('Sending booking data')
    )
    
    if (bookingLogs.length > 0) {
      console.log('\n=== Booking Related Logs ===')
      bookingLogs.forEach(log => {
        console.log(`[${log.type.toUpperCase()}] ${log.text}`)
      })
    }
    
    // Check for successful booking
    const successLogs = infos.filter(log => 
      log.text.includes('✅') || 
      log.text.includes('success') ||
      log.text.includes('Success')
    )
    
    const errorLogs = consoleLogs.filter(log => 
      log.text.toLowerCase().includes('error') ||
      log.text.toLowerCase().includes('failed')
    )
    
    // Assertions
    if (page.url().includes('booking-confirmation')) {
      expect(successLogs.length).toBeGreaterThan(0)
      console.log('\n✅ Booking completed successfully')
    } else {
      console.log('\n❌ Booking did not complete')
      if (errorLogs.length > 0) {
        console.log('Error logs found:')
        errorLogs.forEach(log => {
          console.log(`- ${log.text}`)
        })
      }
    }
    
    // Save logs for debugging
    const logReport = {
      timestamp: new Date().toISOString(),
      url: page.url(),
      summary: {
        total: consoleLogs.length,
        errors: errors.length,
        warnings: warnings.length,
        info: infos.length
      },
      logs: consoleLogs
    }
    
    // You can write this to a file if needed
    console.log('\n=== Full Log Report ===')
    console.log(JSON.stringify(logReport, null, 2))
  })

  test('should track API calls during booking', async ({ page }) => {
    const apiCalls: { url: string; method: string; status?: number; response?: any }[] = []
    
    // Intercept all API calls
    await page.route('**/api/**', async route => {
      const request = route.request()
      const response = await route.fetch()
      
      const apiCall = {
        url: request.url(),
        method: request.method(),
        status: response.status(),
        response: await response.text()
      }
      
      apiCalls.push(apiCall)
      console.log(`API Call: ${apiCall.method} ${apiCall.url} -> ${apiCall.status}`)
      
      await route.continue()
    })
    
    // Set up booking data
    const bookingData = {
      activityId: 'test-activity',
      activity: { title: 'Test Activity' },
      selectedDate: '2024-03-20',
      selectedTime: '10:00',
      adults: 2,
      children: 0,
      totalPrice: 100,
      customerDetails: TEST_USERS.guest
    }
    
    await setupBookingData(page, bookingData)
    
    // Navigate to payment page
    await page.goto('/book/test-activity/payment')
    
    // Click Complete Booking
    await page.locator('button:has-text("Complete Booking")').click()
    
    // Wait for API calls to complete
    await page.waitForTimeout(5000)
    
    // Analyze API calls
    console.log('\n=== API Call Summary ===')
    console.log(`Total API calls: ${apiCalls.length}`)
    
    const failedCalls = apiCalls.filter(call => call.status && call.status >= 400)
    if (failedCalls.length > 0) {
      console.log('\n=== Failed API Calls ===')
      failedCalls.forEach(call => {
        console.log(`${call.method} ${call.url} -> ${call.status}`)
        if (call.response) {
          console.log(`Response: ${call.response}`)
        }
      })
    }
    
    const successfulCalls = apiCalls.filter(call => call.status && call.status < 400)
    if (successfulCalls.length > 0) {
      console.log('\n=== Successful API Calls ===')
      successfulCalls.forEach(call => {
        console.log(`${call.method} ${call.url} -> ${call.status}`)
      })
    }
  })
})