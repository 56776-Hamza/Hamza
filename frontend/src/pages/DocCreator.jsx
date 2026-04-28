import { useState } from 'react'
import { FileSpreadsheet, FileText, Table, Presentation, Download } from 'lucide-react'
import { downloadFile } from '../utils/api'
import LoadingSpinner from '../components/LoadingSpinner'

const docTypes = [
  {
    id: 'word',
    icon: FileText,
    label: 'Word Document',
    description: 'Generate .docx files',
    color: 'from-blue-500 to-blue-600',
    ext: '.docx',
  },
  {
    id: 'excel',
    icon: Table,
    label: 'Excel Spreadsheet',
    description: 'Generate .xlsx files with charts',
    color: 'from-green-500 to-green-600',
    ext: '.xlsx',
  },
  {
    id: 'ppt',
    icon: Presentation,
    label: 'PowerPoint',
    description: 'Generate .pptx presentations',
    color: 'from-orange-500 to-red-500',
    ext: '.pptx',
  },
]

export default function DocCreator() {
  const [selectedType, setSelectedType] = useState('word')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const [wordForm, setWordForm] = useState({ title: '', content_prompt: '', style: 'professional' })
  const [excelForm, setExcelForm] = useState({ title: '', data_description: '', num_rows: 10 })
  const [pptForm, setPptForm] = useState({ title: '', topic: '', num_slides: 8, style: 'professional' })

  const handleGenerate = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      let endpoint, data, filename
      if (selectedType === 'word') {
        endpoint = '/documents/generate-word'
        data = wordForm
        filename = (wordForm.title || 'document').replace(/\s+/g, '_') + '.docx'
      } else if (selectedType === 'excel') {
        endpoint = '/documents/generate-excel'
        data = excelForm
        filename = (excelForm.title || 'spreadsheet').replace(/\s+/g, '_') + '.xlsx'
      } else {
        endpoint = '/documents/generate-ppt'
        data = pptForm
        filename = (pptForm.title || 'presentation').replace(/\s+/g, '_') + '.pptx'
      }

      await downloadFile(endpoint, data, filename)
      setSuccess(true)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <FileSpreadsheet className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-100">Document Creator</h1>
          <p className="text-gray-400">Generate Word, Excel & PowerPoint files with AI</p>
        </div>
      </div>

      {/* Type Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {docTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedType(type.id)}
            className={`glass-card p-4 text-left transition-all duration-300 ${
              selectedType === type.id
                ? 'border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/10'
                : 'hover:border-gray-600'
            }`}
          >
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
              <type.icon className="w-5 h-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-200">{type.label}</h3>
            <p className="text-xs text-gray-400 mt-1">{type.description}</p>
          </button>
        ))}
      </div>

      {/* Forms */}
      <form onSubmit={handleGenerate} className="glass-card p-6 space-y-6">
        {selectedType === 'word' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Document Title *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g., Project Proposal"
                value={wordForm.title}
                onChange={(e) => setWordForm({ ...wordForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Content Description *</label>
              <textarea
                required
                className="textarea-field"
                rows={4}
                placeholder="Describe what the document should contain..."
                value={wordForm.content_prompt}
                onChange={(e) => setWordForm({ ...wordForm, content_prompt: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
              <select
                className="select-field"
                value={wordForm.style}
                onChange={(e) => setWordForm({ ...wordForm, style: e.target.value })}
              >
                <option value="professional">Professional</option>
                <option value="academic">Academic</option>
                <option value="creative">Creative</option>
                <option value="technical">Technical</option>
              </select>
            </div>
          </>
        )}

        {selectedType === 'excel' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Spreadsheet Title *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g., Sales Report Q2 2024"
                value={excelForm.title}
                onChange={(e) => setExcelForm({ ...excelForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Data Description *</label>
              <textarea
                required
                className="textarea-field"
                rows={4}
                placeholder="Describe the data you need, e.g., Monthly sales data for 5 products with prices, quantities, and revenue"
                value={excelForm.data_description}
                onChange={(e) => setExcelForm({ ...excelForm, data_description: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Number of Rows</label>
              <input
                type="number"
                className="input-field"
                min={1}
                max={100}
                value={excelForm.num_rows}
                onChange={(e) => setExcelForm({ ...excelForm, num_rows: parseInt(e.target.value) || 10 })}
              />
            </div>
          </>
        )}

        {selectedType === 'ppt' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Presentation Title *</label>
              <input
                type="text"
                required
                className="input-field"
                placeholder="e.g., AI in Healthcare"
                value={pptForm.title}
                onChange={(e) => setPptForm({ ...pptForm, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Topic / Content *</label>
              <textarea
                required
                className="textarea-field"
                rows={4}
                placeholder="Describe what the presentation should cover..."
                value={pptForm.topic}
                onChange={(e) => setPptForm({ ...pptForm, topic: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Number of Slides</label>
                <input
                  type="number"
                  className="input-field"
                  min={3}
                  max={20}
                  value={pptForm.num_slides}
                  onChange={(e) => setPptForm({ ...pptForm, num_slides: parseInt(e.target.value) || 8 })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Style</label>
                <select
                  className="select-field"
                  value={pptForm.style}
                  onChange={(e) => setPptForm({ ...pptForm, style: e.target.value })}
                >
                  <option value="professional">Professional</option>
                  <option value="modern">Modern</option>
                  <option value="academic">Academic</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
            </div>
          </>
        )}

        <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
          <Download className="w-5 h-5" />
          {loading ? 'Generating...' : `Generate & Download ${docTypes.find((t) => t.id === selectedType)?.label}`}
        </button>
      </form>

      {error && (
        <div className="glass-card p-4 border-red-500/50 bg-red-500/10 text-red-400">
          {error}
        </div>
      )}

      {loading && <LoadingSpinner text="Creating your document..." />}

      {success && (
        <div className="glass-card p-4 border-green-500/50 bg-green-500/10 text-green-400 text-center">
          Document generated and downloaded successfully!
        </div>
      )}
    </div>
  )
}
