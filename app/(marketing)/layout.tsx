/*
<ai_context>
This server layout provides a shared header and footer for (marketing) routes.
Updated to include Footer component for consistent navigation across all marketing pages.
</ai_context>
*/

"use server"

import Header from "@/components/header"

export default async function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  )
}
