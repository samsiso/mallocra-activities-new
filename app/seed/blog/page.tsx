import { Button } from "@/components/ui/button"
import { seedBlogContentAction } from "@/actions/db/seed-blog-content-actions"
import { redirect } from "next/navigation"

export default async function SeedBlogPage() {
  const result = await seedBlogContentAction()

  console.log("Seed result:", result)

  if (result.isSuccess) {
    redirect("/blog")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <div className="text-center text-white">
        <h1 className="mb-4 text-2xl font-bold">Blog Seeding</h1>
        <p className="text-red-400">Error: {result.message}</p>
      </div>
    </div>
  )
}
