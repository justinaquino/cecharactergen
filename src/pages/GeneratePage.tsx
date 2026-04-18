export default function GeneratePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Generate Character</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">
          Character generation wizard will go here.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Mode selection → Accordion steps → Character sheet
        </div>
      </div>
    </div>
  )
}
