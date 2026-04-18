import { ReactNode } from 'react'

interface AccordionStepProps {
  stepNumber: number
  title: string
  summary?: string
  state: 'locked' | 'active' | 'completed'
  onClick?: () => void
  children?: ReactNode
}

export default function AccordionStep({ stepNumber, title, summary, state, onClick, children }: AccordionStepProps) {
  const baseClasses = 'rounded-xl border transition-all duration-200 overflow-hidden'
  const stateClasses = {
    locked: 'border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 opacity-60',
    active: 'border-space-accent bg-white dark:bg-gray-800 shadow-md',
    completed: 'border-green-200 dark:border-green-900 bg-white dark:bg-gray-800 hover:shadow-sm',
  }

  return (
    <div className={`${baseClasses} ${stateClasses[state]}`}>
      <button
        onClick={state !== 'locked' ? onClick : undefined}
        className="w-full px-4 py-3 flex items-center gap-3 text-left"
        disabled={state === 'locked'}
      >
        <div className={`
          w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0
          ${state === 'completed' ? 'bg-green-500 text-white' : ''}
          ${state === 'active' ? 'bg-space-accent text-white' : ''}
          ${state === 'locked' ? 'bg-gray-200 dark:bg-gray-700 text-gray-500' : ''}
        `}>
          {state === 'completed' ? '✓' : stepNumber + 1}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{title}</div>
          {summary && state === 'completed' && (
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{summary}</div>
          )}
        </div>
        {state === 'active' && <div className="text-space-accent text-lg">▼</div>}
        {state === 'completed' && <div className="text-gray-400 text-lg">▶</div>}
      </button>
      {state === 'active' && children && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700/50">
          <div className="pt-3">{children}</div>
        </div>
      )}
    </div>
  )
}
