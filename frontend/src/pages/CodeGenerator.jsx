import { useState } from 'react'
import { Code2 } from 'lucide-react'
import { apiCall } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ResultDisplay from '../components/ResultDisplay'

export default function CodeGenerator() {
  const [form, setForm] = useState({
    description: '',
    language: 'python',
    additional_instructions: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await apiCall('/ai/generate-code', form)
      setResult(data.content)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const languages = [
    'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'go',
    'rust', 'php', 'ruby', 'swift', 'kotlin', 'dart', 'sql', 'html/css',
    'react', 'vue', 'angular', 'node.js', 'flask', 'django', 'fastapi',
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/20">
          <Code2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Code Generator</h1>
          <p className="text-gray-400">Write clean, production-ready code with AI</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">What do you want to build? *</label>
          <textarea
            required
            className="textarea-field"
            rows={4}
            placeholder="e.g., A REST API with user authentication using JWT tokens, password hashing, and role-based access control"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Language / Framework</label>
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
          <label className="block text-sm font-medium text-gray-300 mb-2">Additional Instructions</label>
          <textarea
            className="textarea-field"
            rows={2}
            placeholder="Any specific patterns, libraries, or requirements..."
            value={form.additional_instructions}
            onChange={(e) => setForm({ ...form, additional_instructions: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading || !form.description} className="btn-primary w-full">
          {loading ? 'Generating Code...' : 'Generate Code'}
        </button>
      </form>

      {error && (
        <div className="glass-card p-4 border-red-500/50 bg-red-500/10 text-red-400">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner text="Writing code..." />}
      {result && <ResultDisplay content={result} title="Generated Code" />}
    </div>
  )
}
