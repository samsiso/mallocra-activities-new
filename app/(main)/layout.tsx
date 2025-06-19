"use server"

import Header from "@/components/header"
import PreferredFooter from "@/components/preferred-footer"

export default async function MainLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <PreferredFooter />
    </div>
  )
}
