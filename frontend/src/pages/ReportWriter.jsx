import { useState } from 'react'
import { FileText } from 'lucide-react'
import { apiCall } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ResultDisplay from '../components/ResultDisplay'

export default function ReportWriter() {
  const [form, setForm] = useState({
    topic: '',
    report_type: 'general',
    length: 'medium',
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
      const data = await apiCall('/ai/generate-report', form)
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
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Report Writer</h1>
          <p className="text-gray-400">Generate professional reports with AI</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Topic *</label>
          <input
            type="text"
            required
            className="input-field"
            placeholder="e.g., Impact of AI on Healthcare"
            value={form.topic}
            onChange={(e) => setForm({ ...form, topic: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
            <select
              className="select-field"
              value={form.report_type}
              onChange={(e) => setForm({ ...form, report_type: e.target.value })}
            >
              <option value="general">General Report</option>
              <option value="research">Research Report</option>
              <option value="technical">Technical Report</option>
              <option value="business">Business Report</option>
              <option value="academic">Academic Report</option>
              <option value="lab">Lab Report</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Length</label>
            <select
              className="select-field"
              value={form.length}
              onChange={(e) => setForm({ ...form, length: e.target.value })}
            >
              <option value="short">Short (~300 words)</option>
              <option value="medium">Medium (~800 words)</option>
              <option value="long">Long (~1500 words)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Additional Instructions</label>
          <textarea
            className="textarea-field"
            rows={3}
            placeholder="Any specific requirements or focus areas..."
            value={form.additional_instructions}
            onChange={(e) => setForm({ ...form, additional_instructions: e.target.value })}
          />
        </div>

        <button type="submit" disabled={loading || !form.topic} className="btn-primary w-full">
          {loading ? 'Generating Report...' : 'Generate Report'}
        </button>
      </form>

      {error && (
        <div className="glass-card p-4 border-red-500/50 bg-red-500/10 text-red-400">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner text="Writing your report..." />}
      {result && <ResultDisplay content={result} title="Generated Report" />}
    </div>
  )
}
