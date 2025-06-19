# 🚀 **MULTI-CHANNEL NOTIFICATION SETUP GUIDE**

**Complete setup instructions for Telegram + SMS + WhatsApp notifications**

---

## **🎯 WHAT YOU'LL GET**

After setup, every booking will automatically send:
- ✅ **Email confirmation** (existing)
- ✅ **SMS confirmation** (instant mobile)
- ✅ **WhatsApp confirmation** (if customer opted in)
- ✅ **Telegram confirmation** (if customer provided)

---

## **📋 STEP-BY-STEP SETUP**

### **STEP 1: TELEGRAM BOT (5 minutes)**

1. **Open Telegram** on your phone
2. **Search for @BotFather**
3. **Send**: `/newbot`
4. **Follow prompts**:
   - Bot name: `Mallorca Activities Bot`
   - Username: `malloraca_activities_bot` (must end in 'bot')
5. **Copy the TOKEN** (looks like: `123456789:ABCdefGhIJKlmNoPQRsTUVwxyZ`)

### **STEP 2: TWILIO ACCOUNT (15 minutes)**

1. **Go to**: https://www.twilio.com/try-twilio
2. **Sign up** with business email
3. **Verify your phone number**
4. **Dashboard** → Get these 3 items:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (32-character string)
   - **Phone Number** (buy one for €1/month)

### **STEP 3: TWILIO WHATSAPP SANDBOX (5 minutes)**

1. **In Twilio Console** → Develop → Messaging → Try it out → Send a WhatsApp message
2. **Follow instructions** to connect your WhatsApp to sandbox
3. **Get sandbox number** (usually `+1 415 523 8886`)

### **STEP 4: ADD ENVIRONMENT VARIABLES (2 minutes)**

Add these to your `.env.local` file:

```bash
# ======================================
# TELEGRAM BOT CONFIGURATION
# ======================================
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here

# ======================================
# TWILIO CONFIGURATION
# ======================================
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
TWILIO_WHATSAPP_SANDBOX=whatsapp:+14155238886
```

---

## **🧪 TESTING**

### **Test Telegram Bot:**
1. Message your bot directly on Telegram
2. Send any message to activate the chat
3. Note your chat ID for testing

### **Test SMS:**
1. Add a test phone number in Twilio console
2. Make a test booking with that number

### **Test WhatsApp:**
1. Connect your WhatsApp to Twilio sandbox (follow Step 3)
2. Make a test booking with your WhatsApp number

---

## **📱 CUSTOMER EXPERIENCE**

### **For SMS (Works for Everyone):**
- Customer gets instant SMS confirmation
- No setup required from customer

### **For WhatsApp (Opt-in Required):**
- Customer texts "join [code]" to your Twilio WhatsApp number
- They get instant WhatsApp confirmations after that

### **For Telegram (Optional):**
- Add "Telegram Username" field to booking form
- Customer messages your bot once
- They get instant Telegram confirmations

---

## **🚀 DEPLOYMENT CHECKLIST**

- [ ] Telegram bot token added to `.env.local`
- [ ] Twilio credentials added to `.env.local`
- [ ] Test SMS sent successfully
- [ ] Test WhatsApp sent successfully (if opted in)
- [ ] Test Telegram sent successfully (if provided)
- [ ] Code deployed to production
- [ ] Environment variables added to Vercel/production
- [ ] Test booking completed end-to-end

---

## **💰 COSTS**

| Service | Cost | Usage |
|---------|------|-------|
| **Telegram** | FREE forever | Unlimited messages |
| **SMS** | ~€0.05/message | Per booking |
| **WhatsApp** | ~€0.02/message | Per booking (if opted in) |
| **Email** | FREE (existing) | Per booking |

**Monthly estimate for 500 bookings: €25-35**

---

## **🔧 TROUBLESHOOTING**

### **Telegram not working:**
- Check bot token is correct
- Make sure bot is active (send it a message first)

### **SMS not working:**
- Verify Twilio credentials
- Check phone number format (+34 for Spain)
- Ensure Twilio account has credit

### **WhatsApp not working:**
- Customer must join sandbox first
- Check sandbox number is correct
- Verify customer followed join instructions

---

## **📊 MONITORING**

Check your server logs for:
- `✅ Email confirmation sent successfully`
- `✅ Multi-channel notifications: Notifications sent: X/Y channels`
- `📱 Notification channels: {sms: true, whatsapp: false, telegram: true}`

---

**🎯 Once setup is complete, every booking will automatically send confirmations across all available channels, dramatically improving customer experience and reducing anxiety!** 