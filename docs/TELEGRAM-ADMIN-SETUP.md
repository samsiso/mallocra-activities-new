# 🤖 **TELEGRAM ADMIN NOTIFICATIONS - 5 MINUTE SETUP**

**Get instant Telegram alerts every time someone books an activity!**

---

## 🎯 **WHAT YOU'LL GET**

Every time a customer books an activity, you'll instantly receive a Telegram message with:
- 💰 Revenue amount
- 👤 Customer details (name, email, phone)
- 📅 Activity details (name, date, time)
- 👥 Number of participants
- 📋 Booking reference number

---

## 📱 **SETUP STEPS (5 minutes total)**

### **STEP 1: Create Telegram Bot (2 minutes)**

1. **Open Telegram** on your phone or computer
2. **Search for** `@BotFather`
3. **Send message**: `/newbot`
4. **Follow the prompts**:
   - **Bot name**: `Mallorca Activities Admin`
   - **Username**: `mallorca_activities_admin_bot` (must end in 'bot')
5. **Copy the token** (looks like: `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`)

### **STEP 2: Get Your Chat ID (1 minute)**

1. **Send a message** to your new bot (anything like "Hello")
2. **Go to**: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
   - Replace `<YOUR_BOT_TOKEN>` with the token from Step 1
3. **Look for your chat ID** in the response (it's a number like `123456789`)

### **STEP 3: Add Environment Variables (1 minute)**

Add these lines to your `.env.local` file:

```bash
# TELEGRAM ADMIN NOTIFICATIONS
TELEGRAM_BOT_TOKEN=your_bot_token_from_step_1
TELEGRAM_ADMIN_CHAT_ID=your_chat_id_from_step_2
```

### **STEP 4: Test (1 minute)**

1. **Make a test booking** on your website
2. **Complete the payment**
3. **Check your Telegram** - you should receive an admin notification!

---

## 📱 **EXAMPLE NOTIFICATION**

When someone books, you'll receive:

```
🔔 NEW BOOKING ALERT!

💰 Revenue: €150.00
👥 Participants: 4

📅 Activity: Sunset Sailing Experience
🗓️ Date: 2025-01-30
🕒 Time: 18:00

👤 Customer: John Smith
📧 Email: john@example.com
📱 Phone: +34 123 456 789

📋 Reference: MAL-456789-ABC

🎯 Admin Actions:
- View booking details in admin dashboard
- Contact customer if needed
- Prepare for activity date

💪 Keep up the great work! Another happy customer secured! 🌴
```

---

## 🔧 **TROUBLESHOOTING**

### **Not receiving notifications?**
- ✅ Check bot token is correct in `.env.local`
- ✅ Check chat ID is correct in `.env.local`
- ✅ Make sure you sent a message to your bot first
- ✅ Restart your development server after adding env variables

### **Bot token format:**
- ✅ Should look like: `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`
- ❌ Don't include spaces or extra characters

### **Chat ID format:**
- ✅ Should be just numbers: `123456789`
- ❌ Don't include quotes or text

---

## 💰 **COST**

**Telegram notifications are 100% FREE forever!**
- No message limits
- No monthly fees
- No API costs

---

## 🚀 **NEXT STEPS**

Once this works, you can also add:
- 💳 Payment confirmation alerts
- ❌ Booking cancellation alerts
- 📊 Daily/weekly revenue summaries
- 🎯 Customer follow-up reminders

---

**✅ After setup, you'll never miss another booking and can provide instant customer service!** 