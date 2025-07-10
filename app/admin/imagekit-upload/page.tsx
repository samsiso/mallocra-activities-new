"use client"

import { useState } from "react"
import { IKContext, IKUpload } from "imagekitio-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Image } from "lucide-react"

// ImageKit authenticator
const authenticator = async () => {
  try {
    const response = await fetch("/api/imagekit-auth")
    const data = await response.json()
    return {
      signature: data.signature,
      expire: data.expire,
      token: data.token
    }
  } catch (err) {
    console.error("Authentication failed:", err)
    throw err
  }
}

export default function ImageKitUploadPage() {
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([])
  const [error, setError] = useState<string>("")

  const onError = (err: any) => {
    console.error("Upload error:", err)
    setError(err.message || "Upload failed")
  }

  const onSuccess = (res: any) => {
    console.log("Upload success:", res)
    setUploadedFiles(prev => [...prev, res])
    setError("")
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-4 text-3xl font-bold">ImageKit Upload</h1>
      <p className="mb-8 text-gray-600">
        Free unlimited storage! Just drag and drop your images below.
      </p>

      {/* Setup Instructions */}
      <Card className="mb-8 bg-blue-50 p-6">
        <h2 className="mb-4 text-lg font-semibold">Quick Setup (5 minutes):</h2>
        <ol className="list-inside list-decimal space-y-2">
          <li>
            Go to{" "}
            <a
              href="https://imagekit.io/registration"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              ImageKit.io
            </a>{" "}
            and sign up (free)
          </li>
          <li>Go to Dashboard → Developer Options</li>
          <li>
            Copy your credentials and add to .env.local:
            <pre className="mt-2 rounded bg-white p-3 text-sm">
              {`NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key  
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id`}
            </pre>
          </li>
          <li>Restart your dev server and come back here!</li>
        </ol>
      </Card>

      <IKContext
        publicKey={process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY || ""}
        urlEndpoint={process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || ""}
        authenticator={authenticator}
      >
        <Card className="mb-8 p-6">
          <IKUpload
            fileName="activity-image"
            folder="/activities"
            onError={onError}
            onSuccess={onSuccess}
            className="w-full"
            style={{
              display: "block",
              width: "100%",
              padding: "40px",
              border: "2px dashed #e5e7eb",
              borderRadius: "8px",
              textAlign: "center",
              cursor: "pointer",
              backgroundColor: "#fafafa"
            }}
          />
          {error && (
            <div className="mt-4 rounded bg-red-50 p-3 text-red-700">
              {error}
            </div>
          )}
        </Card>
      </IKContext>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Uploaded Images</h3>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {uploadedFiles.map((file, index) => (
              <div key={index} className="group relative">
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-40 w-full rounded object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center rounded bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    View Full
                  </Button>
                </div>
                <p className="mt-2 truncate text-sm">{file.name}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
