export default function AboutPage() {
  const links = [
    { label: 'Mneme Space Combat', url: 'https://www.drivethrurpg.com/en/product/434090/mneme-space-combat-full' },
    { label: 'Cepheus Engine SRD', url: 'https://www.drivethrurpg.com/en/product/186894/cepheus-engine-system-reference-document' },
    { label: '6 Career Cards', url: 'https://www.drivethrurpg.com/en/product/413465/cepheus-engine-6-combat-career-cards' },
    { label: '24 Career Cards', url: 'https://www.drivethrurpg.com/en/product/413475/cepheus-engine-24-career-cards' },
    { label: 'GI7B Blog', url: 'https://gi7b.org/' },
  ]

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">About CE CharacterGen</h1>

      <section className="mb-6">
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          A Progressive Web App for generating Cepheus Engine characters using the Mneme CE rules.
        </p>
        <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
          Part of the <strong>GI7B Generator Suite</strong> — open source tools for tabletop RPGs.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Credits</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          <strong>Game in the Brain team</strong><br />
          Nicco Salonga & Justin Aquino
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Source Material</h2>
        <ul className="space-y-1">
          {links.slice(0, 4).map((link) => (
            <li key={link.label}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-space-accent hover:underline text-sm"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">About Game in the Brain</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
          Game in the Brain is an open source TTRPG initiative. The goal is to make tabletop RPG tools
          highly accessible, free, and deeply customizable — particularly for Cepheus Engine and
          Traveller-compatible games.
        </p>
        <p className="mt-2 text-sm">
          <a href="https://gi7b.org/" target="_blank" rel="noopener noreferrer" className="text-space-accent hover:underline">
            Blog: gi7b.org
          </a>
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold mb-2">License</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Released under <strong>GPL v3</strong>. Source code, data tables, and documentation are freely available.
        </p>
        <p className="mt-1 text-sm">
          <a
            href="https://github.com/Game-in-the-Brain/cecharactergen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-space-accent hover:underline"
          >
            Repository on GitHub
          </a>
        </p>
      </section>
    </div>
  )
}
