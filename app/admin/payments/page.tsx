export const dynamic = "force-dynamic"

import { Suspense } from "react"
import PaymentsHeader from "./_components/payments-header"
import PaymentsManagement from "./_components/payments-management"
import { Skeleton } from "@/components/ui/skeleton"
import AdminSidebar from "../dashboard/_components/admin-sidebar"
import {
  getPaymentStatsAction,
  getPaymentTransactionsAction
} from "@/actions/db/payments-actions"

export default async function PaymentsPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main Content */}
        <div className="ml-0 flex-1 md:ml-0">
          <div className="p-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="mb-2 text-3xl font-bold text-orange-500">
                Payments Management
              </h1>
              <p className="text-gray-400">
                Track transactions, refunds, and payment analytics
              </p>
            </div>

            {/* Page Content */}
            <div className="space-y-6">
              <Suspense
                fallback={<Skeleton className="h-32 w-full bg-gray-800" />}
              >
                <PaymentsHeaderFetcher />
              </Suspense>

              <Suspense
                fallback={<Skeleton className="h-96 w-full bg-gray-800" />}
              >
                <PaymentsManagementFetcher />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

async function PaymentsHeaderFetcher() {
  const { data: stats } = await getPaymentStatsAction()

  if (!stats) {
    return <div className="text-red-400">Failed to load payment stats</div>
  }

  // Transform to match component interface
  const headerStats = {
    totalRevenue: stats.totalRevenue,
    successfulPayments: stats.successfulPayments,
    refunds: stats.refundedPayments,
    pendingPayments:
      stats.totalTransactions -
      stats.successfulPayments -
      stats.failedPayments -
      stats.refundedPayments,
    thisMonth: stats.monthlyRevenue,
    avgOrderValue: stats.averageTransactionValue
  }

  return <PaymentsHeader stats={headerStats} />
}

async function PaymentsManagementFetcher() {
  const { data: transactions } = await getPaymentTransactionsAction()

  // Transform to match component interface
  const payments = (transactions || []).map(txn => ({
    id: txn.stripePaymentIntentId,
    amount: txn.amount,
    currency: txn.currency,
    status: txn.status,
    customerEmail: txn.customerEmail,
    customerName: txn.customerName,
    activityName: txn.activityTitle,
    paymentMethod: txn.paymentMethod,
    createdAt: txn.createdAt,
    stripeChargeId: txn.status === "succeeded" ? `ch_${txn.id}` : null
  }))

  return <PaymentsManagement initialData={payments} />
}
