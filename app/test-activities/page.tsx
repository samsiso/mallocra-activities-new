import { getActivitiesSupabaseAction } from "@/actions/supabase-activities-actions"

export default async function TestActivitiesPage() {
  // Test the activities action
  const result = await getActivitiesSupabaseAction({
    category: "land_adventures"
  })

  return (
    <div className="container mx-auto p-8">
      <h1 className="mb-8 text-3xl font-bold">Activities Test Page</h1>

      <div className="mb-8">
        <h2 className="mb-4 text-xl font-semibold">Land Adventures:</h2>
        {result.isSuccess && result.data ? (
          <div className="grid gap-4">
            {result.data.map(activity => (
              <div key={activity.id} className="rounded border p-4">
                <h3 className="font-semibold">{activity.title}</h3>
                <p>Status: {activity.status}</p>
                <p>Slug: {activity.slug}</p>
                <p>Location: {activity.location}</p>
                <p>Images: {activity.images?.length || 0}</p>
                {activity.images?.[0] && (
                  <img
                    src={activity.images[0].image_url}
                    alt={activity.title}
                    className="mt-2 h-32 w-48 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-red-500">Error: {result.message}</div>
        )}
      </div>
    </div>
  )
}
