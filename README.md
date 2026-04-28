# NexusAI - AI Productivity Suite

A full-stack AI-powered productivity application that helps you with report writing, code generation, document creation, email composition, debugging, and more.

![NexusAI](https://img.shields.io/badge/NexusAI-AI%20Productivity-blue?style=for-the-badge)

## Features

- **AI Chat** - General-purpose AI assistant for any task
- **Report Writer** - Generate professional reports (research, technical, business, academic, lab)
- **Code Generator** - Write clean, production-ready code in 20+ languages
- **Email Composer** - Draft professional emails with customizable tone
- **Error Handler / Debugger** - Debug and fix code errors with AI assistance
- **Document Creator** - Generate Word (.docx), Excel (.xlsx), and PowerPoint (.pptx) files
- **Form Builder** - Create smart forms and surveys with AI

## Tech Stack

### Frontend
- React 19 + Vite
- Tailwind CSS 4
- React Router v7
- Lucide React icons
- React Markdown

### Backend
- FastAPI (Python)
- OpenAI GPT-4o-mini
- python-docx (Word documents)
- openpyxl (Excel spreadsheets)
- python-pptx (PowerPoint presentations)

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- OpenAI API key

### Backend Setup

```bash
cd backend
pip install -e .
export OPENAI_API_KEY="your-api-key-here"
uvicorn app.main:app --reload --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend at `http://localhost:8000`.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | OpenAI API key for AI features | Yes |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/ai/generate-report` | POST | Generate a report |
| `/api/ai/generate-code` | POST | Generate code |
| `/api/ai/compose-email` | POST | Compose an email |
| `/api/ai/debug-code` | POST | Debug code |
| `/api/ai/generate-form` | POST | Generate a form |
| `/api/ai/chat` | POST | General AI chat |
| `/api/documents/generate-word` | POST | Generate Word document |
| `/api/documents/generate-excel` | POST | Generate Excel spreadsheet |
| `/api/documents/generate-ppt` | POST | Generate PowerPoint presentation |

## License

MIT
