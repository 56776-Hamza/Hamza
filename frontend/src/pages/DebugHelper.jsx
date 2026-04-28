import { useState } from 'react'
import { Bug } from 'lucide-react'
import { apiCall } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ResultDisplay from '../components/ResultDisplay'

export default function DebugHelper() {
  const [form, setForm] = useState({
    code: '',
    error_message: '',
    language: 'python',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await apiCall('/ai/debug-code', form)
      setResult(data.content)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const languages = [
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go',
    'rust', 'php', 'ruby', 'swift', 'kotlin',
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center shadow-lg shadow-red-500/20">
          <Bug className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Error Handler</h1>
          <p className="text-gray-400">Debug and fix code errors with AI assistance</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Code *</label>
          <textarea
            required
            className="textarea-field font-mono text-sm"
            rows={10}
            placeholder="Paste your buggy code here..."
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              className="select-field"
              value={form.language}
              onChange={(e) => setForm({ ...form, language: e.target.value })}
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Error Message</label>
            <input
              type="text"
              className="input-field font-mono text-sm"
              placeholder="Paste error message (optional)"
              value={form.error_message}
              onChange={(e) => setForm({ ...form, error_message: e.target.value })}
            />
          </div>
        </div>

        <button type="submit" disabled={loading || !form.code} className="btn-primary w-full">
          {loading ? 'Debugging...' : 'Debug & Fix Code'}
        </button>
      </form>

      {error && (
        <div className="glass-card p-4 border-red-500/50 bg-red-500/10 text-red-400">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner text="Analyzing and fixing code..." />}
      {result && <ResultDisplay content={result} title="Debug Results" />}
    </div>
  )
}
