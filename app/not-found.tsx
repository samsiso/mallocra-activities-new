import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-900 to-slate-800">
      <div className="text-center">
        <h2 className="mb-4 text-4xl font-bold text-white">Not Found</h2>
        <p className="mb-8 text-slate-300">Could not find requested resource</p>
        <Link
          href="/"
          className="rounded-lg bg-pink-600 px-6 py-3 font-medium text-white transition-colors hover:bg-pink-700"
        >
          Return Home
        </Link>
      </div>
    </div>
  )
}
