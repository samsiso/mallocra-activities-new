import { test, expect } from '@playwright/test'

test.describe('Booking Error Handling Tests', () => {
  test('should handle database connection errors gracefully', async ({ page }) => {
    // Mock a booking scenario
    const bookingData = {
      activityId: 'test-activity',
      selectedDate: '2024-03-20',
      selectedTime: '10:00',
      adults: 2,
      children: 0,
      totalPrice: 100,
      customerDetails: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+34 123 456 789'
      }
    }
    
    await page.goto('/')
    await page.evaluate((data) => {
      localStorage.setItem('booking-data', JSON.stringify(data))
    }, bookingData)
    
    // Intercept API calls to simulate database error
    await page.route('**/api/**', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Database unavailable' })
      })
    })
    
    // Navigate to payment page
    await page.goto('/book/test-activity/payment')
    
    // Click complete booking
    await page.locator('button:has-text("Complete Booking")').click()
    
    // Should show error message
    await expect(page.locator('text=/failed|error|Error/')).toBeVisible({ timeout: 10000 })
  })

  test('should validate email format', async ({ page }) => {
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
    
    await page.goto('/book/test-activity/details')
    
    // Fill form with invalid email
    await page.fill('input[id="firstName"]', 'Test')
    await page.fill('input[id="lastName"]', 'User')
    await page.fill('input[id="email"]', 'invalid-email')
    await page.fill('input[id="phone"]', '+34 123 456 789')
    
    // Browser should show validation error
    const emailInput = page.locator('input[id="email"]')
    const isInvalid = await emailInput.evaluate((el: HTMLInputElement) => !el.validity.valid)
    expect(isInvalid).toBeTruthy()
  })

  test('should handle missing activity gracefully', async ({ page }) => {
    // Try to access non-existent activity
    await page.goto('/activities/non-existent-activity')
    
    // Should show "Activity Not Found" message
    await expect(page.locator('text=Activity Not Found')).toBeVisible()
    
    // Should have "Back to Activities" button
    const backButton = page.locator('button:has-text("Back to Activities")')
    await expect(backButton).toBeVisible()
    
    // Clicking button should navigate to activities page
    await backButton.click()
    await expect(page).toHaveURL('/activities')
  })

  test('should handle network timeouts', async ({ page }) => {
    const bookingData = {
      activityId: 'test-activity',
      selectedDate: '2024-03-20',
      selectedTime: '10:00',
      adults: 2,
      children: 0,
      totalPrice: 100,
      customerDetails: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+34 123 456 789'
      }
    }
    
    await page.goto('/')
    await page.evaluate((data) => {
      localStorage.setItem('booking-data', JSON.stringify(data))
    }, bookingData)
    
    // Simulate slow network
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 31000)) // Timeout after 31 seconds
      route.abort()
    })
    
    await page.goto('/book/test-activity/payment')
    
    // Click complete booking
    await page.locator('button:has-text("Complete Booking")').click()
    
    // Should show processing state
    await expect(page.locator('text=Processing')).toBeVisible()
    
    // Eventually should show error (after timeout)
    await expect(page.locator('text=/failed|error|Error/')).toBeVisible({ timeout: 35000 })
  })
})