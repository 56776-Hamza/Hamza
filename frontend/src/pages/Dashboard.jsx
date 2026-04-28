import { Link } from 'react-router-dom'
import {
  FileText,
  Code2,
  Mail,
  Bug,
  FileSpreadsheet,
  ClipboardList,
  MessageSquare,
  Sparkles,
  Zap,
  Shield,
  Globe,
} from 'lucide-react'

const tools = [
  {
    path: '/chat',
    icon: MessageSquare,
    label: 'AI Chat',
    description: 'General-purpose AI assistant for any task',
    color: 'from-violet-500 to-purple-600',
    shadow: 'shadow-violet-500/20',
  },
  {
    path: '/report',
    icon: FileText,
    label: 'Report Writer',
    description: 'Generate professional reports with AI',
    color: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/20',
  },
  {
    path: '/code',
    icon: Code2,
    label: 'Code Generator',
    description: 'Write clean code in any language',
    color: 'from-green-500 to-emerald-500',
    shadow: 'shadow-green-500/20',
  },
  {
    path: '/email',
    icon: Mail,
    label: 'Email Composer',
    description: 'Draft professional emails instantly',
    color: 'from-orange-500 to-amber-500',
    shadow: 'shadow-orange-500/20',
  },
  {
    path: '/debug',
    icon: Bug,
    label: 'Error Handler',
    description: 'Debug and fix code errors with AI',
    color: 'from-red-500 to-pink-500',
    shadow: 'shadow-red-500/20',
  },
  {
    path: '/documents',
    icon: FileSpreadsheet,
    label: 'Doc Creator',
    description: 'Generate Word, Excel & PowerPoint files',
    color: 'from-indigo-500 to-blue-500',
    shadow: 'shadow-indigo-500/20',
  },
  {
    path: '/forms',
    icon: ClipboardList,
    label: 'Form Builder',
    description: 'Create smart forms and surveys with AI',
    color: 'from-teal-500 to-cyan-500',
    shadow: 'shadow-teal-500/20',
  },
]

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    desc: 'Get results in seconds with GPT-4o powered AI',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'Your data stays private and is never stored',
  },
  {
    icon: Globe,
    title: 'Multi-Format',
    desc: 'Export to Word, Excel, PowerPoint, PDF & more',
  },
]

export default function Dashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
          <Sparkles className="w-4 h-4" />
          AI-Powered Productivity Suite
        </div>
        <h1 className="text-5xl md:text-6xl font-bold">
          <span className="gradient-text">NexusAI</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          Your all-in-one AI workspace for reports, code, documents, emails, and more.
          Powered by cutting-edge AI to supercharge your productivity.
        </p>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div key={feature.title} className="glass-card p-6 text-center">
            <div className="w-12 h-12 mx-auto mb-4 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <feature.icon className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-200 mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>

      {/* Tools Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-200 mb-6">AI Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link key={tool.path} to={tool.path} className="tool-card block">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center mb-4 shadow-lg ${tool.shadow} group-hover:scale-110 transition-transform duration-300`}>
                <tool.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-200 mb-2 group-hover:text-blue-400 transition-colors">
                {tool.label}
              </h3>
              <p className="text-sm text-gray-400">{tool.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="glass-card p-8 text-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-500/20">
        <h2 className="text-2xl font-bold text-gray-200 mb-3">Ready to boost your productivity?</h2>
        <p className="text-gray-400 mb-6">Select any tool above to get started with AI-powered content generation.</p>
        <Link to="/chat" className="btn-primary inline-flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Start with AI Chat
        </Link>
      </div>
    </div>
  )
}
