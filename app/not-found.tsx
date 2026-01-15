import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-studio px-6">
      <div className="text-center">
        <h1 className="display-text text-fluid-4xl font-bold mb-6 text-white">
          Page Not Found
        </h1>
        <p className="english-text text-fluid-lg text-gray-400 mb-8">
          This page does not exist in this gallery.
        </p>
        <Link
          href="/"
          className="english-text text-fluid-base text-emotion-melancholy-text hover:underline focus:outline-none focus:ring-2 focus:ring-emotion-melancholy-text focus:ring-offset-2 focus:ring-offset-dark-studio rounded px-4 py-2"
        >
          Return to Gallery
        </Link>
      </div>
    </div>
  )
}

