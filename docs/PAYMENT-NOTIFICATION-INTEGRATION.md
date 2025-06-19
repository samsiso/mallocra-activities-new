# 💳 **PAYMENT NOTIFICATION INTEGRATION**

**How to add multi-channel payment confirmations when Stripe payments are implemented**

---

## **🎯 OVERVIEW**

Currently, the booking system creates bookings without processing real payments. When you implement actual Stripe payment processing, you'll want to add payment confirmations using our multi-channel system.

---

## **📋 IMPLEMENTATION STEPS**

### **STEP 1: Add Payment Event Handler to Stripe Webhook**

Update `app/api/stripe/webhooks/route.ts` to handle booking payments:

```typescript
import { sendMultiChannelPaymentConfirmationAction } from "@/actions/notifications/multi-channel-notifications"
import { getBookingByReferenceAction } from "@/actions/db/bookings-actions" // You may need to create this

// Add to relevantEvents
const relevantEvents = new Set([
  "checkout.session.completed",
  "payment_intent.succeeded", // Add this for booking payments
  "customer.subscription.updated",
  "customer.subscription.deleted"
])

// Add to switch statement
case "payment_intent.succeeded":
  await handleBookingPayment(event)
  break

// Add new handler function
async function handleBookingPayment(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent
  
  // Get booking from payment intent metadata
  const bookingReference = paymentIntent.metadata.bookingReference
  
  if (!bookingReference) {
    console.warn("No booking reference in payment intent metadata")
    return
  }

  // Get booking details from database
  const bookingResult = await getBookingByReferenceAction(bookingReference)
  
  if (!bookingResult.isSuccess) {
    console.error("Failed to get booking for payment:", bookingReference)
    return
  }

  const booking = bookingResult.data
  
  // Send multi-channel payment confirmation
  try {
    const paymentData = {
      customerName: booking.leadCustomerName,
      customerPhone: booking.leadCustomerPhone,
      telegramChatId: booking.telegramChatId, // Add this field to booking schema
      paymentType: (paymentIntent.amount === booking.totalAmount) ? "full" : "deposit",
      paymentAmount: paymentIntent.amount / 100, // Convert from cents
      bookingReference: booking.bookingReference,
      activityTitle: booking.activityTitle
    }
    
    const result = await sendMultiChannelPaymentConfirmationAction(paymentData)
    
    if (result.isSuccess) {
      console.log("✅ Payment notifications sent:", result.message)
    } else {
      console.warn("⚠️ Payment notifications failed:", result.message)
    }
  } catch (error) {
    console.error("Payment notification error:", error)
  }
}
```

### **STEP 2: Add Booking Reference to Payment Intent**

When creating Stripe payment intents, include booking reference in metadata:

```typescript
const paymentIntent = await stripe.paymentIntents.create({
  amount: totalAmount * 100, // Convert to cents
  currency: 'eur',
  metadata: {
    bookingReference: booking.bookingReference,
    activityId: booking.activityId,
    customerId: booking.customerId
  }
})
```

### **STEP 3: Add Telegram Field to Booking Form (Optional)**

If you want to support Telegram notifications, add optional field:

```typescript
// In booking form component
<div className="grid gap-4">
  <div className="grid grid-cols-2 gap-4">
    <div className="grid gap-2">
      <Label htmlFor="firstName">First Name</Label>
      <Input id="firstName" required />
    </div>
    <div className="grid gap-2">
      <Label htmlFor="lastName">Last Name</Label>
      <Input id="lastName" required />
    </div>
  </div>
  
  <div className="grid gap-2">
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" required />
  </div>
  
  <div className="grid gap-2">
    <Label htmlFor="phone">Phone Number</Label>
    <Input id="phone" type="tel" required />
  </div>
  
  {/* Optional Telegram field */}
  <div className="grid gap-2">
    <Label htmlFor="telegram">Telegram Username (Optional)</Label>
    <Input 
      id="telegram" 
      placeholder="@yourusername (for instant notifications)"
    />
    <p className="text-sm text-gray-600">
      Message our bot @malloraca_activities_bot first, then add your username for instant updates
    </p>
  </div>
</div>
```

### **STEP 4: Update Booking Schema (If Using Telegram)**

Add optional telegram field to bookings schema:

```typescript
// In db/schema/bookings-schema.ts
export const bookingsTable = pgTable("bookings", {
  // ... existing fields
  leadCustomerPhone: text("lead_customer_phone"),
  telegramChatId: text("telegram_chat_id"), // Add this
  specialRequirements: text("special_requirements"),
  // ... rest of fields
})
```

---

## **🧪 TESTING PAYMENT NOTIFICATIONS**

### **Test with Stripe Test Mode:**

1. **Create test booking** with real form data
2. **Use Stripe test card:** `4242 4242 4242 4242`
3. **Complete payment** 
4. **Check logs** for notification results
5. **Verify messages** received on all channels

### **Test Endpoint:**

Use `/api/test-notifications` to test individual channels:

```bash
curl -X POST http://localhost:3000/api/test-notifications \
  -H "Content-Type: application/json" \
  -d '{
    "phoneNumber": "+34612345678",
    "telegramChatId": "123456789",
    "testType": "all"
  }'
```

---

## **📱 CUSTOMER FLOW**

### **With Real Payments:**

1. **Customer books activity** → enters details including phone
2. **Customer pays with Stripe** → payment intent created
3. **Stripe webhook fires** → `payment_intent.succeeded`
4. **System sends notifications:**
   - ✅ **Email confirmation** (existing)
   - ✅ **SMS confirmation** (instant)
   - ✅ **WhatsApp confirmation** (if opted in)
   - ✅ **Telegram confirmation** (if provided)

### **Notification Timeline:**

- **0 seconds:** Payment completed
- **1-2 seconds:** Email sent
- **2-3 seconds:** SMS sent
- **3-4 seconds:** WhatsApp sent (if opted in)
- **4-5 seconds:** Telegram sent (if provided)

---

## **🔧 TROUBLESHOOTING**

### **Webhook not firing:**
- Check Stripe webhook endpoint is configured
- Verify webhook secret in environment variables
- Check Stripe dashboard for webhook delivery attempts

### **Notifications not sending:**
- Check environment variables are set
- Verify phone number format (+34...)
- Check server logs for error details

### **Partial failures:**
- System is designed to not fail if some notifications fail
- Check individual channel logs
- Each channel fails independently

---

## **📊 MONITORING**

Add to your monitoring dashboard:

```typescript
// Log metrics for each payment
console.log("Payment notification metrics:", {
  bookingReference: booking.bookingReference,
  paymentAmount: paymentIntent.amount / 100,
  notificationChannels: result.data,
  timestamp: new Date().toISOString()
})
```

---

**🎯 Once implemented, every payment will trigger instant confirmations across all channels, dramatically reducing customer anxiety and improving satisfaction!** 