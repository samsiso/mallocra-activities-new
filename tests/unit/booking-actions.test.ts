import { describe, it, expect, vi, beforeEach } from 'vitest'
import { createBookingServerAction } from '@/actions/create-booking-action'
import { getBookingByIdServerAction } from '@/actions/get-booking-action'

// Mock Supabase client
vi.mock('@/lib/supabase-admin', () => ({
  supabaseAdminClient: {
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
    }))
  }
}))

describe('Booking Server Actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('createBookingServerAction', () => {
    it('should create a booking successfully with valid data', async () => {
      const mockBookingData = {
        bookingReference: 'MAL-123456-ABC',
        activityId: 'test-activity-id',
        customerId: 'test-customer-id',
        bookingDate: '2024-03-20',
        bookingTime: '10:00',
        adults: 2,
        children: 1,
        seniors: 0,
        totalParticipants: 3,
        subtotal: '150',
        totalAmount: '150',
        currency: 'EUR',
        leadCustomerName: 'Test User',
        leadCustomerEmail: 'test@example.com',
        leadCustomerPhone: '+34 123 456 789',
        specialRequirements: null
      }

      const { supabaseAdminClient } = await import('@/lib/supabase-admin')
      
      // Mock successful user check
      const fromMock = vi.mocked(supabaseAdminClient.from)
      fromMock.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: { id: 'test-customer-id' }, error: null })
      } as any))

      // Mock successful booking creation
      fromMock.mockImplementationOnce(() => ({
        insert: vi.fn().mockResolvedValue({ 
          data: { id: 'booking-123', ...mockBookingData }, 
          error: null 
        })
      } as any))

      const result = await createBookingServerAction(mockBookingData)

      expect(result.isSuccess).toBe(true)
      expect(result.data).toBeDefined()
      expect(result.data?.bookingReference).toBe('MAL-123456-ABC')
    })

    it('should create guest user profile if user does not exist', async () => {
      const mockBookingData = {
        bookingReference: 'MAL-123456-ABC',
        activityId: 'test-activity-id',
        customerId: 'guest-123',
        bookingDate: '2024-03-20',
        bookingTime: '10:00',
        adults: 2,
        children: 0,
        seniors: 0,
        totalParticipants: 2,
        subtotal: '100',
        totalAmount: '100',
        currency: 'EUR',
        leadCustomerName: 'Guest User',
        leadCustomerEmail: 'guest@example.com',
        leadCustomerPhone: '+34 987 654 321',
        specialRequirements: null
      }

      const { supabaseAdminClient } = await import('@/lib/supabase-admin')
      const fromMock = vi.mocked(supabaseAdminClient.from)
      
      // Mock user not found
      fromMock.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any))

      // Mock guest user creation
      fromMock.mockImplementationOnce(() => ({
        insert: vi.fn().mockResolvedValue({ error: null })
      } as any))

      // Mock booking creation
      fromMock.mockImplementationOnce(() => ({
        insert: vi.fn().mockResolvedValue({ 
          data: { id: 'booking-456', ...mockBookingData }, 
          error: null 
        })
      } as any))

      const result = await createBookingServerAction(mockBookingData)

      expect(result.isSuccess).toBe(true)
      expect(fromMock).toHaveBeenCalledTimes(3) // Check user, create user, create booking
    })

    it('should handle database errors gracefully', async () => {
      const mockBookingData = {
        bookingReference: 'MAL-123456-ABC',
        activityId: 'test-activity-id',
        customerId: 'test-customer-id',
        bookingDate: '2024-03-20',
        bookingTime: '10:00',
        adults: 2,
        children: 0,
        seniors: 0,
        totalParticipants: 2,
        subtotal: '100',
        totalAmount: '100',
        currency: 'EUR',
        leadCustomerName: 'Test User',
        leadCustomerEmail: 'test@example.com',
        leadCustomerPhone: '+34 123 456 789',
        specialRequirements: null
      }

      const { supabaseAdminClient } = await import('@/lib/supabase-admin')
      const fromMock = vi.mocked(supabaseAdminClient.from)
      
      // Mock database error
      fromMock.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ 
          data: null, 
          error: { message: 'Database connection failed' } 
        })
      } as any))

      const result = await createBookingServerAction(mockBookingData)

      expect(result.isSuccess).toBe(false)
      expect(result.message).toContain('Database connection failed')
    })
  })

  describe('getBookingByIdServerAction', () => {
    it('should retrieve booking successfully', async () => {
      const mockBooking = {
        id: 'booking-123',
        bookingReference: 'MAL-123456-ABC',
        activityId: 'test-activity-id',
        activities: {
          id: 'test-activity-id',
          title: 'Test Activity',
          location: 'Mallorca',
          duration_minutes: 120
        }
      }

      const { supabaseAdminClient } = await import('@/lib/supabase-admin')
      const fromMock = vi.mocked(supabaseAdminClient.from)
      
      fromMock.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockBooking, error: null })
      } as any))

      const result = await getBookingByIdServerAction('booking-123')

      expect(result.isSuccess).toBe(true)
      expect(result.data).toEqual(mockBooking)
    })

    it('should handle booking not found', async () => {
      const { supabaseAdminClient } = await import('@/lib/supabase-admin')
      const fromMock = vi.mocked(supabaseAdminClient.from)
      
      fromMock.mockImplementationOnce(() => ({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null })
      } as any))

      const result = await getBookingByIdServerAction('non-existent-id')

      expect(result.isSuccess).toBe(false)
      expect(result.message).toContain('Booking not found')
    })
  })
})