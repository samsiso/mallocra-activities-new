import { test, expect } from '@playwright/test'

// Test data
const TEST_ACTIVITY_SLUG = 'mallorca-kayaking' // Adjust based on actual activity
const TEST_CUSTOMER = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phone: '+34 123 456 789'
}

test.describe('Booking Flow E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
  })

  test('should complete full booking flow successfully', async ({ page }) => {
    // Step 1: Navigate to activities page
    await page.goto('/activities')
    
    // Verify activities page loads with pink background
    await expect(page.locator('.activities-red-background')).toHaveClass(/bg-gradient-to-br from-pink-600/)
    
    // Step 2: Click on an activity
    const firstActivity = page.locator('[href^="/activities/"]').first()
    await expect(firstActivity).toBeVisible()
    await firstActivity.click()
    
    // Step 3: Verify activity detail page loads
    await expect(page).toHaveURL(/\/activities\//)
    await expect(page.locator('h1')).toBeVisible() // Activity title
    
    // Step 4: Select booking options in the widget
    await page.waitForSelector('[data-testid="booking-widget"], .booking-widget, div:has(> button:has-text("Book This Adventure"))', {
      timeout: 10000
    })
    
    // Select date (click first available date)
    const dateButton = page.locator('button:not([disabled])').filter({ hasText: /Mon|Tue|Wed|Thu|Fri|Sat|Sun/ }).first()
    await dateButton.click()
    
    // Select time (click first available time)
    await page.waitForSelector('button:has-text(/[0-9]{1,2}:[0-9]{2}/)')
    const timeButton = page.locator('button:not([disabled])').filter({ hasText: /[0-9]{1,2}:[0-9]{2}/ }).first()
    await timeButton.click()
    
    // Verify participants (default should be 2 adults)
    await expect(page.locator('text=Adults').locator('..').locator('text=2')).toBeVisible()
    
    // Click Book Now button
    const bookButton = page.locator('button').filter({ hasText: /Book This Adventure|Book Now/ })
    await expect(bookButton).toBeEnabled()
    await bookButton.click()
    
    // Step 5: Verify navigation to booking select page
    await expect(page).toHaveURL(/\/book\/.*\/select/)
    
    // Verify booking data is displayed
    await expect(page.locator('text=Selected Date')).toBeVisible()
    await expect(page.locator('text=Selected Time')).toBeVisible()
    
    // Click Continue
    await page.locator('button:has-text("Continue to Details")').click()
    
    // Step 6: Fill in customer details
    await expect(page).toHaveURL(/\/book\/.*\/details/)
    
    // Verify pink background (not blue)
    await expect(page.locator('.min-h-screen')).toHaveClass(/bg-gradient-to-br from-pink-600/)
    
    // Verify progress indicator is visible
    await expect(page.locator('text=Select')).toBeVisible()
    await expect(page.locator('text=Details')).toBeVisible()
    await expect(page.locator('text=Payment')).toBeVisible()
    
    // Fill form
    await page.fill('input[id="firstName"]', TEST_CUSTOMER.firstName)
    await page.fill('input[id="lastName"]', TEST_CUSTOMER.lastName)
    await page.fill('input[id="email"]', TEST_CUSTOMER.email)
    await page.fill('input[id="phone"]', TEST_CUSTOMER.phone)
    
    // Click Continue to Payment
    await page.locator('button:has-text("Continue to Payment")').click()
    
    // Step 7: Complete payment
    await expect(page).toHaveURL(/\/book\/.*\/payment/)
    
    // Verify guest booking notice appears (since we're not logged in)
    await expect(page.locator('text=Guest Booking')).toBeVisible()
    
    // Click Complete Booking
    const completeButton = page.locator('button:has-text("Complete Booking")')
    await expect(completeButton).toBeEnabled()
    
    // Monitor console for errors during booking
    const consoleMessages: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text())
      }
    })
    
    // Click complete booking
    await completeButton.click()
    
    // Wait for either success or error
    await Promise.race([
      page.waitForURL(/\/booking-confirmation\//, { timeout: 30000 }),
      page.waitForSelector('text=/Booking failed|error|Error/', { timeout: 30000 })
    ])
    
    // Verify successful booking
    if (page.url().includes('booking-confirmation')) {
      await expect(page.locator('text=Booking Confirmed')).toBeVisible({ timeout: 10000 })
    } else {
      // If booking failed, log the error
      const errorText = await page.locator('text=/Booking failed|error|Error/').textContent()
      console.error('Booking failed with error:', errorText)
      console.error('Console errors:', consoleMessages)
      throw new Error(`Booking failed: ${errorText}`)
    }
  })

  test('should handle navigation between booking steps', async ({ page }) => {
    // Navigate directly to a booking details page
    await page.goto('/book/test-activity/details')
    
    // Should redirect to activity page if no booking data
    await expect(page).toHaveURL(/\/activities\/test-activity/)
  })

  test('should validate required fields in details form', async ({ page }) => {
    // Set up booking data in localStorage
    const bookingData = {
      activityId: 'test-activity',
      selectedDate: '2024-03-20',
      selectedTime: '10:00',
      adults: 2,
      children: 0,
      totalPrice: 100
    }
    
    await page.goto('/')
    await page.evaluate((data) => {
      localStorage.setItem('booking-data', JSON.stringify(data))
    }, bookingData)
    
    // Navigate to details page
    await page.goto('/book/test-activity/details')
    
    // Try to continue without filling form
    const continueButton = page.locator('button:has-text("Continue to Payment")')
    await expect(continueButton).toBeDisabled()
    
    // Fill partial form
    await page.fill('input[id="firstName"]', 'Test')
    await expect(continueButton).toBeDisabled()
    
    // Fill all fields
    await page.fill('input[id="lastName"]', 'User')
    await page.fill('input[id="email"]', 'test@example.com')
    await page.fill('input[id="phone"]', '+34 123 456 789')
    
    // Button should now be enabled
    await expect(continueButton).toBeEnabled()
  })

  test('should maintain booking data through page refreshes', async ({ page }) => {
    // Set up booking data
    const bookingData = {
      activityId: 'test-activity',
      selectedDate: '2024-03-20',
      selectedTime: '10:00',
      adults: 3,
      children: 1,
      totalPrice: 200,
      customerDetails: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+34 987 654 321'
      }
    }
    
    await page.goto('/')
    await page.evaluate((data) => {
      localStorage.setItem('booking-data', JSON.stringify(data))
    }, bookingData)
    
    // Navigate to payment page
    await page.goto('/book/test-activity/payment')
    
    // Verify data persists
    await expect(page.locator('text=3 adults, 1 children')).toBeVisible()
    await expect(page.locator('text=€200')).toBeVisible()
    
    // Refresh page
    await page.reload()
    
    // Data should still be there
    await expect(page.locator('text=3 adults, 1 children')).toBeVisible()
    await expect(page.locator('text=€200')).toBeVisible()
  })

  test('should display correct UI styling throughout flow', async ({ page }) => {
    // Navigate to activities page
    await page.goto('/activities')
    
    // Check hero background is pink (not orange/red)
    const heroBackground = page.locator('.activities-red-background')
    await expect(heroBackground).toHaveCSS('background-image', /pink/)
    
    // Navigate to a details page with booking data
    const bookingData = {
      activityId: 'test-activity',
      selectedDate: '2024-03-20',
      selectedTime: '10:00',
      adults: 2,
      children: 0,
      totalPrice: 100
    }
    
    await page.evaluate((data) => {
      localStorage.setItem('booking-data', JSON.stringify(data))
    }, bookingData)
    
    await page.goto('/book/test-activity/details')
    
    // Check details page has pink background (not blue)
    const detailsBackground = page.locator('.min-h-screen')
    await expect(detailsBackground).toHaveClass(/from-pink-600/)
    await expect(detailsBackground).not.toHaveClass(/from-blue/)
    
    // Check progress indicator is visible
    const progressIndicator = page.locator('[aria-label="Booking progress"], div:has(> div:has(> svg))')
    await expect(progressIndicator.first()).toBeVisible()
  })
})