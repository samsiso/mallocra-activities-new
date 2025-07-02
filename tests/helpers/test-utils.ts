import { Page } from '@playwright/test'

export const TEST_ACTIVITIES = [
  {
    slug: 'mallorca-kayaking',
    title: 'Mallorca Kayaking Adventure',
    price: 75
  },
  {
    slug: 'mallorca-hiking',
    title: 'Serra de Tramuntana Hiking',
    price: 50
  }
]

export const TEST_USERS = {
  guest: {
    firstName: 'Guest',
    lastName: 'User',
    email: 'guest@example.com',
    phone: '+34 123 456 789'
  },
  authenticated: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+34 987 654 321'
  }
}

export async function setupBookingData(page: Page, data: any) {
  await page.goto('/')
  await page.evaluate((bookingData) => {
    localStorage.setItem('booking-data', JSON.stringify(bookingData))
  }, data)
}

export async function clearBookingData(page: Page) {
  await page.goto('/')
  await page.evaluate(() => {
    localStorage.removeItem('booking-data')
  })
}

export async function mockSupabaseError(page: Page, errorMessage: string) {
  await page.route('**/rest/v1/**', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ 
        error: errorMessage,
        message: errorMessage 
      })
    })
  })
}

export async function mockSupabaseSuccess(page: Page, data: any) {
  await page.route('**/rest/v1/**', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(data)
    })
  })
}

export async function waitForBookingConfirmation(page: Page) {
  await page.waitForURL(/\/booking-confirmation\//, { timeout: 30000 })
}

export async function captureConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = []
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(msg.text())
    }
  })
  
  return errors
}