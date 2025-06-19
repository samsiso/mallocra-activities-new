"use client"

import { MediaUpload } from "@/components/ui/media-upload"
import { MediaGallery } from "@/components/ui/media-gallery"
import { useState } from "react"
import { SelectMedia } from "@/db/schema/media-schema"

export default function MediaDemoPage() {
  const [lastUploadedMedia, setLastUploadedMedia] =
    useState<SelectMedia | null>(null)

  return (
    <div className="container mx-auto px-4 pb-10 pt-24">
      <h1 className="mb-6 text-3xl font-bold text-white">Media Demo</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Upload Media
          </h2>
          <p className="mb-6 text-gray-300">
            Upload images and videos using Cloudinary. This won't consume your
            Supabase storage quota.
          </p>

          <MediaUpload
            onUploadComplete={media => setLastUploadedMedia(media)}
            buttonText="Upload Image or Video"
            maxSize={20}
          />

          {lastUploadedMedia && (
            <div className="mt-6 rounded-md bg-gray-900 p-4">
              <h3 className="mb-2 text-lg font-medium text-white">
                Last Uploaded Media
              </h3>
              <p className="mb-1 text-sm text-gray-400">
                ID: {lastUploadedMedia.id}
              </p>
              <p className="mb-1 text-sm text-gray-400">
                Type: {lastUploadedMedia.type}
              </p>
              <p className="mb-1 text-sm text-gray-400">
                Format: {lastUploadedMedia.format}
              </p>
              <p className="mb-3 text-sm text-gray-400">
                Dimensions: {lastUploadedMedia.width}x{lastUploadedMedia.height}
              </p>

              <a
                href={lastUploadedMedia.secureUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-orange-500 underline hover:text-orange-400"
              >
                Open in new tab
              </a>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-gray-800 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Media Gallery
          </h2>
          <p className="mb-6 text-gray-300">
            View your uploaded media. You can select or delete items.
          </p>

          <MediaGallery
            deletable={true}
            selectable={true}
            onSelect={media => console.log("Selected:", media)}
            onDelete={id => console.log("Deleted:", id)}
          />
        </div>
      </div>

      <div className="mt-12 rounded-lg bg-gray-800 p-6">
        <h2 className="mb-4 text-xl font-semibold text-white">How It Works</h2>

        <div className="space-y-4 text-gray-300">
          <p>
            <strong className="text-orange-500">Efficient Storage:</strong>{" "}
            Instead of using Supabase's limited 500MB storage, this solution
            leverages Cloudinary's specialized media hosting with its generous
            free tier.
          </p>

          <p>
            <strong className="text-orange-500">Metadata Only:</strong> Supabase
            database only stores lightweight metadata about your media (URLs,
            dimensions, types), keeping your database small and fast.
          </p>

          <p>
            <strong className="text-orange-500">Optimized Delivery:</strong>{" "}
            Cloudinary automatically optimizes images and videos for different
            devices and connection speeds, improving your app's performance.
          </p>

          <p>
            <strong className="text-orange-500">Transformations:</strong> You
            can request different sizes, crops, and formats on-the-fly by
            changing URL parameters, without storing multiple versions.
          </p>
        </div>
      </div>
    </div>
  )
}
