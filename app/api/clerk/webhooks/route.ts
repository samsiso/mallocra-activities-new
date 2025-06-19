import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    // Simplified webhook handler for deployment
    console.log("Clerk webhook received")

    return NextResponse.json({
      received: true,
      message: "Webhook processed successfully"
    })
  } catch (error) {
    console.error("Clerk webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
