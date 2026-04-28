import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ text = 'Generating...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-gray-700 border-t-blue-500 animate-spin" />
        <Loader2 className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
      </div>
      <p className="text-gray-400 animate-pulse">{text}</p>
    </div>
  )
}
