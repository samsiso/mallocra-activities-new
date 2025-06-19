import { Metadata } from "next"
import Header from "@/components/header"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: {
    default: "Blog | We Are Excursions",
    template: "%s | We Are Excursions Blog"
  },
  description:
    "Discover insider tips, hidden gems, and everything you need to know about enjoying your time in Mallorca.",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://weareexcursions.com/blog",
    title: "Blog | We Are Excursions",
    description:
      "Discover insider tips, hidden gems, and everything you need to know about enjoying your time in Mallorca.",
    siteName: "We Are Excursions"
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | We Are Excursions",
    description:
      "Discover insider tips, hidden gems, and everything you need to know about enjoying your time in Mallorca."
  }
}

export default async function BlogLayout({
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
