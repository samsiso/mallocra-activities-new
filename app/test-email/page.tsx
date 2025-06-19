"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  testEmailConfigAction,
  sendBookingConfirmationEmailAction,
  BookingEmailData
} from "@/actions/email-actions"
import {
  Mail,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Settings,
  TestTube
} from "lucide-react"

export default function EmailTestPage() {
  const [isTestingConfig, setIsTestingConfig] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const [configResult, setConfigResult] = useState<string | null>(null)
  const [configSuccess, setConfigSuccess] = useState<boolean | null>(null)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testSuccess, setTestSuccess] = useState<boolean | null>(null)

  // Test email form state
  const [testEmail, setTestEmail] = useState({
    email: "",
    name: "Test User",
    activityTitle: "Catamaran Sunset Cruise",
    date: new Date().toISOString().split("T")[0],
    time: "18:00",
    participants: 2,
    amount: 120,
    phone: "+34 123 456 789",
    requirements: "Test booking - email system verification"
  })

  const handleTestConfig = async () => {
    setIsTestingConfig(true)
    setConfigResult(null)
    setConfigSuccess(null)

    try {
      const result = await testEmailConfigAction()
      setConfigResult(result.message)
      setConfigSuccess(result.isSuccess)
    } catch (error) {
      setConfigResult("Error testing configuration")
      setConfigSuccess(false)
    } finally {
      setIsTestingConfig(false)
    }
  }

  const handleSendTestEmail = async () => {
    if (!testEmail.email) {
      setTestResult("Please enter an email address")
      setTestSuccess(false)
      return
    }

    setIsSendingTest(true)
    setTestResult(null)
    setTestSuccess(null)

    try {
      const emailData: BookingEmailData = {
        bookingReference: `TEST-${Date.now()}`,
        activityTitle: testEmail.activityTitle,
        bookingDate: testEmail.date,
        bookingTime: testEmail.time,
        totalParticipants: testEmail.participants,
        totalAmount: testEmail.amount,
        leadCustomerName: testEmail.name,
        leadCustomerEmail: testEmail.email,
        leadCustomerPhone: testEmail.phone,
        specialRequirements: testEmail.requirements,
        isGuestBooking: true
      }

      const result = await sendBookingConfirmationEmailAction(emailData)
      setTestResult(result.message)
      setTestSuccess(result.isSuccess)
    } catch (error) {
      setTestResult("Error sending test email")
      setTestSuccess(false)
    } finally {
      setIsSendingTest(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-white">
            📧 Email System Testing
          </h1>
          <p className="text-lg text-white/80">
            Test and configure your booking confirmation email system
          </p>
        </div>

        {/* Environment Check */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Settings className="size-5" />
              Configuration Check
            </CardTitle>
            <CardDescription className="text-white/70">
              Verify that your email environment variables are properly
              configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-medium text-white">
                Required Environment Variables:
              </h4>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-white/80">
                  <Badge variant="outline" className="text-xs">
                    RESEND_API_KEY
                  </Badge>
                  Your Resend API key
                </div>
                <div className="flex items-center gap-2 text-white/80">
                  <Badge variant="outline" className="text-xs">
                    RESEND_FROM_EMAIL
                  </Badge>
                  The email address to send from
                </div>
              </div>
            </div>

            <Button
              onClick={handleTestConfig}
              disabled={isTestingConfig}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isTestingConfig ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Testing Configuration...
                </>
              ) : (
                <>
                  <TestTube className="mr-2 size-4" />
                  Test Configuration
                </>
              )}
            </Button>

            {configResult && (
              <div
                className={`flex items-start gap-2 rounded-lg p-4 ${
                  configSuccess
                    ? "border border-green-500/30 bg-green-500/20"
                    : "border border-red-500/30 bg-red-500/20"
                }`}
              >
                {configSuccess ? (
                  <CheckCircle className="mt-0.5 size-5 text-green-400" />
                ) : (
                  <AlertCircle className="mt-0.5 size-5 text-red-400" />
                )}
                <div className="text-sm text-white">
                  <p className="font-medium">
                    {configSuccess
                      ? "Configuration Test Passed"
                      : "Configuration Test Failed"}
                  </p>
                  <p className="mt-1 opacity-90">{configResult}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Test Email Form */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Mail className="size-5" />
              Send Test Email
            </CardTitle>
            <CardDescription className="text-white/70">
              Send a test booking confirmation email to verify everything works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Test Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={testEmail.email}
                  onChange={e =>
                    setTestEmail({ ...testEmail, email: e.target.value })
                  }
                  placeholder="your-email@example.com"
                  className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">
                  Customer Name
                </Label>
                <Input
                  id="name"
                  value={testEmail.name}
                  onChange={e =>
                    setTestEmail({ ...testEmail, name: e.target.value })
                  }
                  className="border-white/30 bg-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="activity" className="text-white">
                  Activity Title
                </Label>
                <Input
                  id="activity"
                  value={testEmail.activityTitle}
                  onChange={e =>
                    setTestEmail({
                      ...testEmail,
                      activityTitle: e.target.value
                    })
                  }
                  className="border-white/30 bg-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">
                  Date
                </Label>
                <Input
                  id="date"
                  type="date"
                  value={testEmail.date}
                  onChange={e =>
                    setTestEmail({ ...testEmail, date: e.target.value })
                  }
                  className="border-white/30 bg-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time" className="text-white">
                  Time
                </Label>
                <Input
                  id="time"
                  type="time"
                  value={testEmail.time}
                  onChange={e =>
                    setTestEmail({ ...testEmail, time: e.target.value })
                  }
                  className="border-white/30 bg-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="participants" className="text-white">
                  Participants
                </Label>
                <Input
                  id="participants"
                  type="number"
                  min="1"
                  value={testEmail.participants}
                  onChange={e =>
                    setTestEmail({
                      ...testEmail,
                      participants: Number(e.target.value)
                    })
                  }
                  className="border-white/30 bg-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">
                  Amount (€)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  value={testEmail.amount}
                  onChange={e =>
                    setTestEmail({
                      ...testEmail,
                      amount: Number(e.target.value)
                    })
                  }
                  className="border-white/30 bg-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">
                  Phone (optional)
                </Label>
                <Input
                  id="phone"
                  value={testEmail.phone}
                  onChange={e =>
                    setTestEmail({ ...testEmail, phone: e.target.value })
                  }
                  className="border-white/30 bg-white/10 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements" className="text-white">
                Special Requirements
              </Label>
              <Textarea
                id="requirements"
                value={testEmail.requirements}
                onChange={e =>
                  setTestEmail({ ...testEmail, requirements: e.target.value })
                }
                className="border-white/30 bg-white/10 text-white placeholder:text-white/50"
                rows={3}
              />
            </div>

            <Button
              onClick={handleSendTestEmail}
              disabled={isSendingTest || !testEmail.email}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Sending Test Email...
                </>
              ) : (
                <>
                  <Send className="mr-2 size-4" />
                  Send Test Email
                </>
              )}
            </Button>

            {testResult && (
              <div
                className={`flex items-start gap-2 rounded-lg p-4 ${
                  testSuccess
                    ? "border border-green-500/30 bg-green-500/20"
                    : "border border-red-500/30 bg-red-500/20"
                }`}
              >
                {testSuccess ? (
                  <CheckCircle className="mt-0.5 size-5 text-green-400" />
                ) : (
                  <AlertCircle className="mt-0.5 size-5 text-red-400" />
                )}
                <div className="text-sm text-white">
                  <p className="font-medium">
                    {testSuccess
                      ? "Test Email Sent Successfully!"
                      : "Test Email Failed"}
                  </p>
                  <p className="mt-1 opacity-90">{testResult}</p>
                  {testSuccess && (
                    <p className="mt-2 text-xs opacity-80">
                      Check your inbox (and spam folder) for the test email
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="border-white/20 bg-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-white/80">
            <div className="space-y-2">
              <h4 className="font-medium text-white">
                1. Create Resend Account
              </h4>
              <p className="text-sm">
                Sign up at{" "}
                <a
                  href="https://resend.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  resend.com
                </a>{" "}
                and verify your domain or use their test domain.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-white">2. Get API Key</h4>
              <p className="text-sm">
                Go to API Keys section in your Resend dashboard and create a new
                API key.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-white">
                3. Add Environment Variables
              </h4>
              <p className="text-sm">
                Add these to your{" "}
                <code className="rounded bg-black/30 px-1">.env.local</code>{" "}
                file:
              </p>
              <div className="rounded bg-black/30 p-3 font-mono text-xs">
                <div>RESEND_API_KEY="re_your_api_key_here"</div>
                <div>RESEND_FROM_EMAIL="bookings@yourdomain.com"</div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-white">4. Test Configuration</h4>
              <p className="text-sm">
                Use the configuration test above to verify everything is working
                correctly.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
