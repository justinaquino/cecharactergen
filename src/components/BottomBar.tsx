import { useNavigate } from 'react-router-dom'

interface BottomBarProps {
  backTo?: string
  backLabel?: string
  nextTo?: string
  nextLabel?: string
  nextDisabled?: boolean
  onBack?: () => void
  onNext?: () => void
}

export default function BottomBar({
  backTo,
  backLabel = 'Back',
  nextTo,
  nextLabel = 'Next',
  nextDisabled = false,
  onBack,
  onNext,
}: BottomBarProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) onBack()
    else if (backTo) navigate(backTo)
    else navigate(-1)
  }

  const handleNext = () => {
    if (onNext) onNext()
    else if (nextTo) navigate(nextTo)
  }

  return (
    <nav className="sticky bottom-0 z-50 bg-white/90 dark:bg-space-dark/90 backdrop-blur border-t border-gray-200 dark:border-gray-700 safe-area-pb">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          ← {backLabel}
        </button>
        {nextTo || onNext ? (
          <button
            onClick={handleNext}
            disabled={nextDisabled}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              nextDisabled
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                : 'bg-space-accent text-white hover:bg-red-600'
            }`}
          >
            {nextLabel} →
          </button>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
