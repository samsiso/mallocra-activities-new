/*
<ai_context>
LiveChatWidget component extracted from landing page.
Provides expandable chat interface with message handling.
Positioned as a floating widget for customer support.
</ai_context>
*/

"use client"

import { useState } from "react"
import { MessageCircle, X, Send } from "lucide-react"

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState("")

  const sendMessage = () => {
    if (message.trim()) {
      // In real implementation, send message to chat service
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="h-96 w-80 rounded-xl border border-white/20 bg-white/95 shadow-xl backdrop-blur-md dark:bg-gray-900/95">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <div className="size-2 rounded-full bg-green-500"></div>
              <span className="font-medium text-gray-900 dark:text-white">
                Live Support
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div className="h-64 flex-1 space-y-3 overflow-y-auto p-4">
            <div className="flex items-start space-x-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-500">
                <span className="text-sm text-white">S</span>
              </div>
              <div className="max-w-xs rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                <p className="text-sm text-gray-900 dark:text-white">
                  Hi! How can I help you plan your perfect Mallorca adventure
                  today?
                </p>
              </div>
            </div>
          </div>

          {/* Chat Input */}
          <div className="border-t border-gray-200 p-4 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                onKeyPress={e => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex size-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all duration-200 hover:scale-110 hover:bg-blue-700"
        >
          <MessageCircle className="size-6" />
        </button>
      )}
    </div>
  )
}
