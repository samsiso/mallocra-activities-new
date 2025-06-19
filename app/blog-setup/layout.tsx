import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "Blog Setup | We Are Excursions",
  description: "Set up the blog system for We Are Excursions."
}

export default async function BlogSetupLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
