import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ReportWriter from './pages/ReportWriter'
import CodeGenerator from './pages/CodeGenerator'
import EmailComposer from './pages/EmailComposer'
import DebugHelper from './pages/DebugHelper'
import DocCreator from './pages/DocCreator'
import FormBuilder from './pages/FormBuilder'
import ChatAssistant from './pages/ChatAssistant'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/report" element={<ReportWriter />} />
          <Route path="/code" element={<CodeGenerator />} />
          <Route path="/email" element={<EmailComposer />} />
          <Route path="/debug" element={<DebugHelper />} />
          <Route path="/documents" element={<DocCreator />} />
          <Route path="/forms" element={<FormBuilder />} />
          <Route path="/chat" element={<ChatAssistant />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
