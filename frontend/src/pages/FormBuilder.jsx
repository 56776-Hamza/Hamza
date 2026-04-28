import { useState } from 'react'
import { ClipboardList, Eye } from 'lucide-react'
import { apiCall } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

export default function FormBuilder() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    num_questions: 5,
    form_type: 'survey',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await apiCall('/ai/generate-form', form)
      setResult(data.content)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const renderQuestion = (question, index) => {
    return (
      <div key={question.id || index} className="glass-card p-5 space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium text-gray-200">
            {index + 1}. {question.question}
            {question.required && <span className="text-red-400 ml-1">*</span>}
          </h4>
          <span className="text-xs px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            {question.type}
          </span>
        </div>

        {question.type === 'text' && (
          <input type="text" disabled className="input-field opacity-60" placeholder="Short answer text" />
        )}

        {question.type === 'multiple_choice' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, i) => (
              <label key={i} className="flex items-center gap-3 text-gray-400">
                <div className="w-4 h-4 rounded-full border-2 border-gray-600" />
                {option}
              </label>
            ))}
          </div>
        )}

        {question.type === 'checkbox' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, i) => (
              <label key={i} className="flex items-center gap-3 text-gray-400">
                <div className="w-4 h-4 rounded border-2 border-gray-600" />
                {option}
              </label>
            ))}
          </div>
        )}

        {question.type === 'dropdown' && question.options && (
          <select disabled className="select-field opacity-60">
            <option>Select an option</option>
            {question.options.map((option, i) => (
              <option key={i}>{option}</option>
            ))}
          </select>
        )}

        {question.type === 'rating' && (
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="w-10 h-10 rounded-lg border border-gray-600 flex items-center justify-center text-gray-500">
                {n}
              </div>
            ))}
          </div>
        )}

        {question.type === 'date' && (
          <input type="date" disabled className="input-field opacity-60" />
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-teal-500/20">
          <ClipboardList className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Form Builder</h1>
          <p className="text-gray-400">Create smart forms and surveys with AI</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Form Title *</label>
          <input
            type="text"
            required
            className="input-field"
            placeholder="e.g., Customer Satisfaction Survey"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
          <textarea
            className="textarea-field"
            rows={2}
            placeholder="Describe the purpose of your form..."
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Form Type</label>
            <select
              className="select-field"
              value={form.form_type}
              onChange={(e) => setForm({ ...form, form_type: e.target.value })}
            >
              <option value="survey">Survey</option>
              <option value="feedback">Feedback Form</option>
              <option value="registration">Registration Form</option>
              <option value="quiz">Quiz</option>
              <option value="application">Application Form</option>
              <option value="order">Order Form</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Number of Questions</label>
            <input
              type="number"
              className="input-field"
              min={1}
              max={20}
              value={form.num_questions}
              onChange={(e) => setForm({ ...form, num_questions: parseInt(e.target.value) || 5 })}
            />
          </div>
        </div>

        <button type="submit" disabled={loading || !form.title} className="btn-primary w-full">
          {loading ? 'Building Form...' : 'Generate Form'}
        </button>
      </form>

      {error && (
        <div className="glass-card p-4 border-red-500/50 bg-red-500/10 text-red-400">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner text="Building your form..." />}

      {result && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Eye className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-bold text-gray-200">Form Preview</h2>
          </div>

          <div className="glass-card p-6 bg-gradient-to-br from-blue-900/10 to-purple-900/10">
            <h3 className="text-2xl font-bold text-gray-100 mb-2">{result.title}</h3>
            {result.description && <p className="text-gray-400 mb-6">{result.description}</p>}
          </div>

          <div className="space-y-4">
            {(result.questions || []).map((q, i) => renderQuestion(q, i))}
          </div>

          <div className="glass-card p-4 text-center">
            <button disabled className="btn-primary opacity-75 cursor-not-allowed">
              Submit Form (Preview Only)
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
