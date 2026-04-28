import { useState } from 'react'
import { Mail } from 'lucide-react'
import { apiCall } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ResultDisplay from '../components/ResultDisplay'

export default function EmailComposer() {
  const [form, setForm] = useState({
    purpose: '',
    tone: 'professional',
    recipient: '',
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
      const data = await apiCall('/ai/compose-email', form)
      setResult(data.content)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Mail className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Email Composer</h1>
          <p className="text-gray-400">Draft professional emails instantly with AI</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email Purpose *</label>
          <textarea
            required
            className="textarea-field"
            rows={3}
            placeholder="e.g., Request a meeting with the marketing team to discuss Q2 campaign strategy"
            value={form.purpose}
            onChange={(e) => setForm({ ...form, purpose: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tone</label>
            <select
              className="select-field"
              value={form.tone}
              onChange={(e) => setForm({ ...form, tone: e.target.value })}
            >
              <option value="professional">Professional</option>
              <option value="formal">Formal</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
              <option value="urgent">Urgent</option>
              <option value="apologetic">Apologetic</option>
              <option value="thankful">Thankful</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Recipient</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g., Manager, Client, Team"
              value={form.recipient}
              onChange={(e) => setForm({ ...form, recipient: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Additional Instructions</label>
          <textarea
            className="textarea-field"
            rows={2}
            placeholder="Any specific points to include..."
            value={form.additional_instructions}
            onChange={(e) => setForm({ ...form, additional_instructions: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading || !form.purpose} className="btn-primary w-full">
          {loading ? 'Composing Email...' : 'Compose Email'}
        </button>
      </form>

      {error && (
        <div className="glass-card p-4 border-red-500/50 bg-red-500/10 text-red-400">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner text="Composing your email..." />}
      {result && <ResultDisplay content={result} title="Composed Email" />}
    </div>
  )
}
