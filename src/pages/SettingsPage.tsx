export default function SettingsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <p className="text-gray-600 dark:text-gray-400">
          App settings and data management.
        </p>
        <div className="mt-4 text-sm text-gray-500">
          Tables · Mechanics · Import/Export · Reset
        </div>
      </div>
    </div>
  )
}
