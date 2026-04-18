import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Mneme Space Combat', url: 'https://www.drivethrurpg.com/en/product/434090/mneme-space-combat-full' },
  { label: 'CE SRD', url: 'https://www.drivethrurpg.com/en/product/186894/cepheus-engine-system-reference-document' },
  { label: '6 Career Cards', url: 'https://www.drivethrurpg.com/en/product/413465/cepheus-engine-6-combat-career-cards' },
  { label: '24 Career Cards', url: 'https://www.drivethrurpg.com/en/product/413475/cepheus-engine-24-career-cards' },
  { label: 'gi7b.org', url: 'https://gi7b.org/' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-space-dark text-gray-900 dark:text-gray-100">
      <div className="flex flex-col items-center w-full max-w-xs">
        <h1 className="text-3xl font-bold mb-1 text-center">CE CharacterGen</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 text-center">
          Cepheus Engine character generation — by Game in the Brain
        </p>

        <div className="flex flex-col gap-3 w-full">
          <Link
            to="/generate"
            className="bg-space-accent hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-lg text-center transition"
          >
            ✨ Generate Character
          </Link>
          <Link
            to="/library"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg text-center transition"
          >
            📚 Character Library
          </Link>
          <Link
            to="/reference"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg text-center transition"
          >
            📖 Reference Data
          </Link>
          <Link
            to="/settings"
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-6 rounded-lg text-center transition"
          >
            ⚙️ Settings
          </Link>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/about"
            className="text-sm text-gray-500 dark:text-gray-400 hover:text-space-accent transition"
          >
            About
          </Link>
        </div>
      </div>

      <div className="mt-12 flex flex-wrap justify-center gap-x-3 gap-y-1 max-w-md">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-400 dark:text-gray-600 hover:text-space-accent transition"
          >
            {link.label}
          </a>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-400 dark:text-gray-600">
        v0.1.0 · Phase 1 Complete
      </p>
    </div>
  )
}
