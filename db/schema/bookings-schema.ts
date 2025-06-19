/*
<ai_context>
Bookings and payment management schema for the Mallorca Activities platform.
Handles the complete booking lifecycle from creation to completion with payment tracking.
</ai_context>
*/

import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  decimal,
  boolean,
  date,
  time
} from "drizzle-orm/pg-core"
import { usersProfilesTable, salespeopleTable } from "./users-schema"
import { activitiesTable, activityAddOnsTable } from "./activities-schema"

// Booking status enumeration
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show"
])

// Payment status enumeration
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "authorized",
  "paid",
  "refunded",
  "failed"
])

// Payment method enumeration
export const paymentMethodEnum = pgEnum("payment_method", [
  "card",
  "paypal",
  "apple_pay",
  "google_pay",
  "sepa",
  "cash"
])

// Commission status enumeration
export const commissionStatusEnum = pgEnum("commission_status", [
  "pending",
  "calculated",
  "paid",
  "withheld"
])

// Main bookings table
export const bookingsTable = pgTable("bookings", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingReference: text("booking_reference").notNull().unique(), // Human-readable booking ref
  activityId: uuid("activity_id")
    .references(() => activitiesTable.id, { onDelete: "restrict" })
    .notNull(),
  customerId: uuid("customer_id")
    .references(() => usersProfilesTable.id, { onDelete: "restrict" })
    .notNull(),
  salespersonId: uuid("salesperson_id").references(() => salespeopleTable.id, {
    onDelete: "set null"
  }), // Optional for online bookings

  // Booking details
  bookingDate: date("booking_date").notNull(), // Date of the activity
  bookingTime: time("booking_time"), // Time slot for the activity
  adults: integer("adults").notNull().default(1),
  children: integer("children").notNull().default(0),
  seniors: integer("seniors").notNull().default(0),
  totalParticipants: integer("total_participants").notNull(),

  // Pricing
  subtotal: decimal("subtotal").notNull(), // Before taxes and fees
  taxAmount: decimal("tax_amount").default("0"),
  serviceFee: decimal("service_fee").default("0"),
  totalAmount: decimal("total_amount").notNull(),
  currency: text("currency").default("EUR"),
  paidAmount: decimal("paid_amount").default("0"),

  // Customer information
  leadCustomerName: text("lead_customer_name").notNull(),
  leadCustomerEmail: text("lead_customer_email").notNull(),
  leadCustomerPhone: text("lead_customer_phone"),
  emergencyContact: text("emergency_contact"),
  specialRequirements: text("special_requirements"),
  participantNames: text("participant_names").array(), // Names of all participants

  // Booking management
  status: bookingStatusEnum("status").notNull().default("pending"),
  isDepositOnly: boolean("is_deposit_only").default(false), // True if only deposit paid
  depositAmount: decimal("deposit_amount"), // Amount of deposit if applicable
  remainingBalance: decimal("remaining_balance").default("0"),
  cancellationReason: text("cancellation_reason"),

  // Tracking and notifications
  confirmationSentAt: timestamp("confirmation_sent_at"),
  reminderSentAt: timestamp("reminder_sent_at"),
  checkInTime: timestamp("check_in_time"),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Booking add-ons junction table
export const bookingAddOnsTable = pgTable("booking_add_ons", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .references(() => bookingsTable.id, { onDelete: "cascade" })
    .notNull(),
  addOnId: uuid("add_on_id")
    .references(() => activityAddOnsTable.id, { onDelete: "restrict" })
    .notNull(),
  quantity: integer("quantity").notNull().default(1),
  unitPrice: decimal("unit_price").notNull(),
  totalPrice: decimal("total_price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
})

// Payments table
export const paymentsTable = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .references(() => bookingsTable.id, { onDelete: "cascade" })
    .notNull(),
  stripePaymentIntentId: text("stripe_payment_intent_id").unique(), // Stripe integration
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  amount: decimal("amount").notNull(),
  currency: text("currency").default("EUR"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  transactionId: text("transaction_id"), // External payment processor ID
  failureReason: text("failure_reason"),
  refundAmount: decimal("refund_amount").default("0"),
  refundReason: text("refund_reason"),
  paidAt: timestamp("paid_at"),
  refundedAt: timestamp("refunded_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Commission tracking table
export const commissionsTable = pgTable("commissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .references(() => bookingsTable.id, { onDelete: "cascade" })
    .notNull(),
  salespersonId: uuid("salesperson_id").references(() => salespeopleTable.id, {
    onDelete: "set null"
  }),

  // Commission breakdown
  bookingAmount: decimal("booking_amount").notNull(), // Original booking amount
  platformCommissionRate: decimal("platform_commission_rate").notNull(), // Platform commission %
  platformCommissionAmount: decimal("platform_commission_amount").notNull(),
  salespersonCommissionRate: decimal("salesperson_commission_rate"), // Salesperson commission %
  salespersonCommissionAmount: decimal("salesperson_commission_amount").default(
    "0"
  ),
  operatorAmount: decimal("operator_amount").notNull(), // Amount going to operator

  status: commissionStatusEnum("status").notNull().default("pending"),
  calculatedAt: timestamp("calculated_at"),
  paidAt: timestamp("paid_at"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Reviews table
export const reviewsTable = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  bookingId: uuid("booking_id")
    .references(() => bookingsTable.id, { onDelete: "cascade" })
    .notNull(),
  customerId: uuid("customer_id")
    .references(() => usersProfilesTable.id, { onDelete: "cascade" })
    .notNull(),
  activityId: uuid("activity_id")
    .references(() => activitiesTable.id, { onDelete: "cascade" })
    .notNull(),

  // Review content
  rating: integer("rating").notNull(), // 1-5 stars
  title: text("title"),
  content: text("content"),
  reviewerName: text("reviewer_name"),
  reviewerEmail: text("reviewer_email"),
  pros: text("pros"), // What they liked
  cons: text("cons"), // What could be improved
  wouldRecommend: boolean("would_recommend").default(true),

  // Review metadata
  isVerified: boolean("is_verified").default(true), // From actual booking
  isPublished: boolean("is_published").default(true),
  helpfulVotes: integer("helpful_votes").default(0),
  operatorResponse: text("operator_response"),
  operatorResponseDate: timestamp("operator_response_date"),

  // Photo attachments
  photoUrls: text("photo_urls").array(), // Customer uploaded photos

  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date())
})

// Type exports for the schemas
export type InsertBooking = typeof bookingsTable.$inferInsert
export type SelectBooking = typeof bookingsTable.$inferSelect

export type InsertBookingAddOn = typeof bookingAddOnsTable.$inferInsert
export type SelectBookingAddOn = typeof bookingAddOnsTable.$inferSelect

export type InsertPayment = typeof paymentsTable.$inferInsert
export type SelectPayment = typeof paymentsTable.$inferSelect

export type InsertCommission = typeof commissionsTable.$inferInsert
export type SelectCommission = typeof commissionsTable.$inferSelect

export type InsertReview = typeof reviewsTable.$inferInsert
export type SelectReview = typeof reviewsTable.$inferSelect
