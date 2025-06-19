"use server"

import { ActionState } from "@/types"

export interface PaymentTransaction {
  id: string
  stripePaymentIntentId: string
  bookingId: string
  userId: string
  activityId: string
  amount: number
  currency: string
  status: "pending" | "succeeded" | "failed" | "canceled" | "refunded"
  paymentMethod: "card" | "paypal" | "bank_transfer"
  cardLast4?: string
  cardBrand?: string
  customerName: string
  customerEmail: string
  activityTitle: string
  createdAt: string
  updatedAt: string
  refundedAt?: string
  refundAmount?: number
  fees: {
    stripeFee: number
    applicationFee: number
    netAmount: number
  }
}

export interface PaymentStats {
  totalRevenue: number
  totalTransactions: number
  successfulPayments: number
  failedPayments: number
  refundedPayments: number
  averageTransactionValue: number
  monthlyRevenue: number
  monthlyGrowth: number
  topPaymentMethod: string
  totalFees: number
  netRevenue: number
}

export interface RevenueBreakdown {
  daily: Array<{
    date: string
    revenue: number
    transactions: number
    fees: number
  }>
  monthly: Array<{
    month: string
    revenue: number
    transactions: number
    fees: number
    refunds: number
  }>
  byActivity: Array<{
    activityId: string
    activityTitle: string
    revenue: number
    transactions: number
    averageValue: number
  }>
  byPaymentMethod: Array<{
    method: string
    revenue: number
    transactions: number
    percentage: number
  }>
}

export interface RefundRequest {
  id: string
  transactionId: string
  bookingId: string
  requestedBy: string
  reason: string
  amount: number
  status: "pending" | "approved" | "rejected" | "processed"
  requestedAt: string
  processedAt?: string
  processedBy?: string
  notes?: string
}

export async function getPaymentStatsAction(): Promise<ActionState<PaymentStats>> {
  try {
    const stats: PaymentStats = {
      totalRevenue: 47892.50,
      totalTransactions: 234,
      successfulPayments: 218,
      failedPayments: 12,
      refundedPayments: 4,
      averageTransactionValue: 204.67,
      monthlyRevenue: 15847.50,
      monthlyGrowth: 18.3,
      topPaymentMethod: "card",
      totalFees: 2394.63, // ~5% of total revenue
      netRevenue: 45497.87
    }

    return {
      isSuccess: true,
      message: "Payment stats retrieved successfully",
      data: stats
    }
  } catch (error) {
    console.error("Error getting payment stats:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get payment stats" 
    }
  }
}

export async function getPaymentTransactionsAction(
  status?: PaymentTransaction["status"],
  limit: number = 50
): Promise<ActionState<PaymentTransaction[]>> {
  try {
    const allTransactions: PaymentTransaction[] = [
      {
        id: "txn-1",
        stripePaymentIntentId: "pi_1234567890abcdef",
        bookingId: "booking-1",
        userId: "user-1",
        activityId: "activity-1",
        amount: 89.00,
        currency: "EUR",
        status: "succeeded",
        paymentMethod: "card",
        cardLast4: "4242",
        cardBrand: "visa",
        customerName: "John Smith",
        customerEmail: "john.smith@email.com",
        activityTitle: "Coasteering Adventure in Mallorca",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        fees: {
          stripeFee: 2.89,
          applicationFee: 0.89,
          netAmount: 85.22
        }
      },
      {
        id: "txn-2",
        stripePaymentIntentId: "pi_2345678901bcdefg",
        bookingId: "booking-2",
        userId: "user-2",
        activityId: "activity-2",
        amount: 125.00,
        currency: "EUR",
        status: "succeeded",
        paymentMethod: "card",
        cardLast4: "1234",
        cardBrand: "mastercard",
        customerName: "Sarah Johnson",
        customerEmail: "sarah.johnson@email.com",
        activityTitle: "Sailing Experience in Port d'Andratx",
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        fees: {
          stripeFee: 3.88,
          applicationFee: 1.25,
          netAmount: 119.87
        }
      },
      {
        id: "txn-3",
        stripePaymentIntentId: "pi_3456789012cdefgh",
        bookingId: "booking-3",
        userId: "user-3",
        activityId: "activity-3",
        amount: 75.00,
        currency: "EUR",
        status: "failed",
        paymentMethod: "card",
        cardLast4: "5678",
        cardBrand: "visa",
        customerName: "Mike Wilson",
        customerEmail: "mike.wilson@email.com",
        activityTitle: "Hiking in Serra de Tramuntana",
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        fees: {
          stripeFee: 0,
          applicationFee: 0,
          netAmount: 0
        }
      },
      {
        id: "txn-4",
        stripePaymentIntentId: "pi_4567890123defghi",
        bookingId: "booking-4",
        userId: "user-4",
        activityId: "activity-4",
        amount: 95.00,
        currency: "EUR",
        status: "refunded",
        paymentMethod: "card",
        cardLast4: "9876",
        cardBrand: "amex",
        customerName: "Emma Davis",
        customerEmail: "emma.davis@email.com",
        activityTitle: "Cultural Tour of Palma",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        refundedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        refundAmount: 95.00,
        fees: {
          stripeFee: 3.13,
          applicationFee: 0.95,
          netAmount: 90.92
        }
      },
      {
        id: "txn-5",
        stripePaymentIntentId: "pi_5678901234efghij",
        bookingId: "booking-5",
        userId: "user-5",
        activityId: "activity-5",
        amount: 110.00,
        currency: "EUR",
        status: "succeeded",
        paymentMethod: "paypal",
        customerName: "David Brown",
        customerEmail: "david.brown@email.com",
        activityTitle: "Boat Trip to Cabrera Island",
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        fees: {
          stripeFee: 3.52,
          applicationFee: 1.10,
          netAmount: 105.38
        }
      }
    ]

    // Filter by status if specified
    let filteredTransactions = allTransactions
    if (status) {
      filteredTransactions = allTransactions.filter(txn => txn.status === status)
    }

    // Apply limit
    const limitedTransactions = filteredTransactions.slice(0, limit)

    return {
      isSuccess: true,
      message: `Retrieved ${limitedTransactions.length} payment transactions`,
      data: limitedTransactions
    }
  } catch (error) {
    console.error("Error getting payment transactions:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get payment transactions" 
    }
  }
}

export async function getRevenueBreakdownAction(days: number = 30): Promise<ActionState<RevenueBreakdown>> {
  try {
    // Generate daily revenue data
    const daily = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      
      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const baseRevenue = isWeekend ? 800 : 500
      const variance = Math.random() * 400 - 200
      const revenue = Math.max(0, baseRevenue + variance)
      const transactions = Math.floor(revenue / 89) + Math.floor(Math.random() * 3)
      const fees = revenue * 0.05 // 5% fees
      
      daily.push({
        date: date.toISOString().split('T')[0],
        revenue: Math.round(revenue * 100) / 100,
        transactions,
        fees: Math.round(fees * 100) / 100
      })
    }

    const breakdown: RevenueBreakdown = {
      daily,
      monthly: [
        { month: "Jan", revenue: 12905.00, transactions: 145, fees: 645.25, refunds: 2 },
        { month: "Feb", revenue: 14863.00, transactions: 167, fees: 743.15, refunds: 1 },
        { month: "Mar", revenue: 16821.00, transactions: 189, fees: 841.05, refunds: 3 },
        { month: "Apr", revenue: 18067.00, transactions: 203, fees: 903.35, refunds: 2 },
        { month: "May", revenue: 15842.00, transactions: 178, fees: 792.10, refunds: 4 },
        { month: "Jun", revenue: 13884.00, transactions: 156, fees: 694.20, refunds: 1 }
      ],
      byActivity: [
        {
          activityId: "activity-1",
          activityTitle: "Coasteering Adventure in Mallorca",
          revenue: 4005.00,
          transactions: 45,
          averageValue: 89.00
        },
        {
          activityId: "activity-2",
          activityTitle: "Sailing Experience in Port d'Andratx",
          revenue: 4000.00,
          transactions: 32,
          averageValue: 125.00
        },
        {
          activityId: "activity-3",
          activityTitle: "Hiking in Serra de Tramuntana",
          revenue: 2100.00,
          transactions: 28,
          averageValue: 75.00
        },
        {
          activityId: "activity-4",
          activityTitle: "Cultural Tour of Palma",
          revenue: 3610.00,
          transactions: 38,
          averageValue: 95.00
        },
        {
          activityId: "activity-5",
          activityTitle: "Boat Trip to Cabrera Island",
          revenue: 2420.00,
          transactions: 22,
          averageValue: 110.00
        }
      ],
      byPaymentMethod: [
        { method: "card", revenue: 38314.00, transactions: 187, percentage: 80.0 },
        { method: "paypal", revenue: 7156.50, transactions: 32, percentage: 14.9 },
        { method: "bank_transfer", revenue: 2422.00, transactions: 15, percentage: 5.1 }
      ]
    }

    return {
      isSuccess: true,
      message: "Revenue breakdown retrieved successfully",
      data: breakdown
    }
  } catch (error) {
    console.error("Error getting revenue breakdown:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get revenue breakdown" 
    }
  }
}

export async function getRefundRequestsAction(
  status?: RefundRequest["status"]
): Promise<ActionState<RefundRequest[]>> {
  try {
    const allRequests: RefundRequest[] = [
      {
        id: "refund-1",
        transactionId: "txn-4",
        bookingId: "booking-4",
        requestedBy: "user-4",
        reason: "Activity cancelled due to weather conditions",
        amount: 95.00,
        status: "processed",
        requestedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        processedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        processedBy: "admin-1",
        notes: "Full refund approved due to weather cancellation policy"
      },
      {
        id: "refund-2",
        transactionId: "txn-6",
        bookingId: "booking-6",
        requestedBy: "user-6",
        reason: "Personal emergency - unable to attend",
        amount: 125.00,
        status: "pending",
        requestedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: "Customer provided medical documentation"
      },
      {
        id: "refund-3",
        transactionId: "txn-7",
        bookingId: "booking-7",
        requestedBy: "user-7",
        reason: "Dissatisfied with service quality",
        amount: 75.00,
        status: "approved",
        requestedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        processedBy: "admin-2",
        notes: "Partial refund approved after investigation"
      }
    ]

    // Filter by status if specified
    let filteredRequests = allRequests
    if (status) {
      filteredRequests = allRequests.filter(req => req.status === status)
    }

    return {
      isSuccess: true,
      message: `Retrieved ${filteredRequests.length} refund requests`,
      data: filteredRequests
    }
  } catch (error) {
    console.error("Error getting refund requests:", error)
    return { 
      isSuccess: false, 
      message: "Failed to get refund requests" 
    }
  }
}

export async function processRefundAction(
  refundId: string,
  action: "approve" | "reject",
  notes?: string
): Promise<ActionState<RefundRequest>> {
  try {
    const { data: refunds } = await getRefundRequestsAction()
    
    if (!refunds) {
      throw new Error("No refund requests available")
    }

    const refund = refunds.find(r => r.id === refundId)
    
    if (!refund) {
      throw new Error("Refund request not found")
    }

    const updatedRefund: RefundRequest = {
      ...refund,
      status: action === "approve" ? "approved" : "rejected",
      processedAt: new Date().toISOString(),
      processedBy: "admin-current", // In real app, get from auth
      notes: notes || refund.notes
    }

    return {
      isSuccess: true,
      message: `Refund request ${action}d successfully`,
      data: updatedRefund
    }
  } catch (error) {
    console.error("Error processing refund:", error)
    return { 
      isSuccess: false, 
      message: "Failed to process refund request" 
    }
  }
}

export async function exportPaymentDataAction(
  startDate: string,
  endDate: string,
  format: "csv" | "xlsx" = "csv"
): Promise<ActionState<{ downloadUrl: string; filename: string }>> {
  try {
    // In a real implementation, this would generate and upload the export file
    const filename = `payments_${startDate}_to_${endDate}.${format}`
    const downloadUrl = `https://exports.mallocra-activities.com/${filename}`

    return {
      isSuccess: true,
      message: "Payment data export generated successfully",
      data: { downloadUrl, filename }
    }
  } catch (error) {
    console.error("Error exporting payment data:", error)
    return { 
      isSuccess: false, 
      message: "Failed to export payment data" 
    }
  }
} 