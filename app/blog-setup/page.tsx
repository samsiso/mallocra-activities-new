import { Suspense } from "react"
import SetupForm from "./_components/setup-form"

export default async function BlogSetupPage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mx-auto max-w-3xl rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h1 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white">
          Blog Setup
        </h1>

        <div className="prose dark:prose-invert mb-8 max-w-none">
          <p>
            This page helps you set up the blog functionality by creating the
            necessary database tables and structures in your Supabase project.
          </p>
          <p>
            Click the button below to run the migrations and set up the blog
            database schema.
          </p>
        </div>

        <Suspense fallback={<div>Loading projects...</div>}>
          <ProjectSelector />
        </Suspense>
      </div>
    </div>
  )
}

async function ProjectSelector() {
  // Mock projects data for production build
  const projects = [
    {
      id: "demo-project",
      name: "Demo Project",
      organization_id: "demo-org",
      region: "us-east-1",
      created_at: new Date().toISOString()
    }
  ]

  return <SetupForm projects={projects} />
}
