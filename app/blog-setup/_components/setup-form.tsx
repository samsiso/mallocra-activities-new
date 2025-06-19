"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { AlertCircle, Check, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Project {
  id: string
  name: string
  organization_id: string
  region: string
  created_at: string
}

interface SetupFormProps {
  projects: Project[]
}

export default function SetupForm({ projects }: SetupFormProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSetup = async () => {
    if (!selectedProjectId) {
      setError("Please select a project first")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Simulate setup process
      await new Promise(resolve => setTimeout(resolve, 2000))

      setIsComplete(true)
      setError(null)
    } catch (err) {
      setError("Setup failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isComplete) {
    return (
      <Card className="mx-auto w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <Check className="mr-2 size-5" />
            Blog Setup Complete!
          </CardTitle>
          <CardDescription>
            Your blog system has been successfully configured.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Check className="size-4" />
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>
              The blog system is now ready to use. You can start creating blog
              posts and managing content.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Blog System Setup</CardTitle>
        <CardDescription>
          Set up the blog system for your Mallorca Activities platform.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label htmlFor="project" className="text-sm font-medium">
            Select Project
          </label>
          <select
            id="project"
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
            disabled={isLoading}
          >
            <option value="">Choose a project...</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name} ({project.region})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Setup will include:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Blog categories (Travel Guide, Activities, Culture, Tips)</li>
            <li>• Blog status management (Draft, Published, Archived)</li>
            <li>• Tag system for content organization</li>
            <li>• SEO optimization features</li>
            <li>• Featured content management</li>
          </ul>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleSetup}
          disabled={isLoading || !selectedProjectId}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Setting up...
            </>
          ) : (
            "Setup Blog System"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
