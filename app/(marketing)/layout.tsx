/*
<ai_context>
This server layout provides a shared header and footer for (marketing) routes.
Updated to include Footer component for consistent navigation across all marketing pages.
</ai_context>
*/

import Header from "@/components/header"

export default function MarketingLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
    </>
  )
}
