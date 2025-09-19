# 🍵 LegaliTea - AI-Powered Legal Document Analyzer

> **Understand any legal document in YOUR-NATIVE-LANG** - Built for the Gen AI Exchange Hackathon

[![Live Demo](https://img.shields.io/badge/🚀-Live%20Demo-blue)](https://legalitea.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black)](https://github.com/omanandswami2005/gen-ai-exchange-hackthon-prototype-LegaliTea)

## 🌟 Overview

LegaliTea democratizes access to legal understanding by transforming complex legal documents into clear, actionable guidance. Using Google Gemini AI, it provides instant analysis of contracts, leases, NDAs, and other legal documents in multiple languages.

## ✨ Key Features

### 🤖 **AI-Powered Analysis**

- **Real Google Gemini Integration** - Advanced AI for accurate legal document analysis
- **Plain English Summaries** - Complex legal jargon translated to understandable language
- **Risk Assessment** - Automatic detection of red flags and concerning clauses
- **Action Plans** - Prioritized next steps with deadlines and recommendations

### 🌍 **Multi-Language Support**

- **10+ Languages** - English, Hindi, Kannada, Gujarati, Spanish, French, German, Chinese, Japanese, Arabic
- **Localized Analysis** - AI responses in your preferred language
- **Animated Language Selector** - Beautiful cycling language display

### 📄 **Document Processing**

- **PDF Support** - Real PDF.js integration for text extraction
- **DOCX Support** - Microsoft Word document processing
- **OCR Capability** - Image-based PDF processing with Tesseract.js
- **Drag & Drop Interface** - Intuitive file upload experience

### 🎨 **Modern UI/UX**

- **Dashboard Design** - Professional horizontal layout instead of vertical sections
- **Dark/Light Themes** - Sophisticated color schemes with smooth transitions
- **Mobile-First** - Responsive design optimized for all devices
- **Micro-Animations** - Engaging user interactions and feedback

### 🔒 **Privacy & Security**

- **Local Processing** - Documents processed securely
- **24-Hour Retention** - Optional saving with automatic deletion
- **No Permanent Storage** - Privacy-first approach
- **Supabase Integration** - Secure database for temporary storage

## 🛠️ Tech Stack

### **Frontend**

- **React 18** + **TypeScript** - Modern React with full type safety
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS v4** - Latest utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library
- **Zustand** - Lightweight state management
- **TanStack Query** - Powerful data fetching and caching

### **Backend**

- **Express.js** - Fast, minimalist web framework
- **Google Gemini API** - Advanced AI for document analysis
- **PDF.js** - Client-side PDF processing
- **Mammoth.js** - DOCX document parsing
- **Tesseract.js** - OCR for image-based documents

### **Database & Storage**

- **Supabase** - PostgreSQL database with real-time features
- **Local Storage** - Client-side preferences and settings

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Google Gemini API key
- Supabase account (optional)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/omanandswami2005/gen-ai-exchange-hackthon-prototype-LegaliTea.git
cd gen-ai-exchange-hackthon-prototype-LegaliTea
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

4. **Set up Supabase (Optional)**

```bash
# Run the SQL script in your Supabase dashboard
cat supabase-setup.sql
```

5. **Start the development servers**

```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately
npm run dev      # Frontend (http://localhost:5173)
npm run server   # Backend (http://localhost:3001)
```

## 📖 Usage

### 1. **Upload Document**

- Drag & drop PDF/DOCX files
- Paste text directly
- Try sample documents

### 2. **AI Analysis**

- Real-time processing indicators
- Multi-language analysis
- Confidence scoring

### 3. **Review Results**

- Dashboard-style layout
- Risk assessment with color coding
- Action plan with priorities
- Original text viewer with highlighting

### 4. **Export & Save**

- Export analysis to PDF
- Save for 24 hours with email
- Share results easily

## 🌐 Multi-Language Support

LegaliTea supports analysis and results in multiple languages:

| Language | Code   | Native Name    |
| -------- | ------ | -------------- |
| English  | `en` | English        |
| Hindi    | `hi` | हिंदी     |
| Kannada  | `kn` | ಕನ್ನಡ     |
| Gujarati | `gu` | ગુજરાતી |
| Spanish  | `es` | Español       |
| French   | `fr` | Français      |
| German   | `de` | Deutsch        |
| Chinese  | `zh` | 中文           |
| Japanese | `ja` | 日本語         |
| Arabic   | `ar` | العربية |

## 🏗️ Project Structure

```
legalitea/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── UploadPage.tsx  # Document upload interface
│   │   ├── ProcessingPage.tsx # Processing indicators
│   │   ├── DashboardResultsPage.tsx # Results dashboard
│   │   └── ...
│   ├── contexts/           # React contexts
│   │   ├── ThemeContext.tsx # Dark/light theme
│   │   └── LanguageContext.tsx # Multi-language
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and business logic
│   ├── stores/             # Zustand state management
│   └── types/              # TypeScript definitions
├── server.js               # Express backend
├── supabase-setup.sql      # Database schema
└── ...
```

## 🎯 Features Implemented

- ✅ **Real Gemini AI Integration** - Production-ready AI analysis
- ✅ **Multi-Language Support** - 10+ languages with localized UI
- ✅ **Dashboard Results Layout** - Professional horizontal sections
- ✅ **Dark/Light Theme** - Sophisticated color schemes
- ✅ **PDF/DOCX Processing** - Real document parsing
- ✅ **Original Text Viewer** - Clause highlighting and references
- ✅ **Export to PDF** - Professional analysis reports
- ✅ **Responsive Design** - Mobile-first approach
- ✅ **Micro-Animations** - Engaging user interactions
- ✅ **Privacy-Focused** - Secure document processing
- ✅ **Supabase Integration** - Optional data persistence

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start frontend development server
npm run server       # Start backend server
npm run dev:full     # Start both frontend and backend
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables

| Variable                   | Description            | Required |
| -------------------------- | ---------------------- | -------- |
| `VITE_GEMINI_API_KEY`    | Google Gemini API key  | Yes      |
| `VITE_SUPABASE_URL`      | Supabase project URL   | Optional |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Optional |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Gen AI Exchange Hackathon** - For the opportunity to build this project
- **Google Gemini** - For powerful AI capabilities
- **Supabase** - For excellent database and auth services
- **Shadcn/ui** - For beautiful, accessible components
- **Tailwind CSS** - For rapid UI development

## 📞 Contact

**Oman Andswami**

- GitHub: [@omanandswami2005](https://github.com/omanandswami2005)
- Project: [LegaliTea](https://github.com/omanandswami2005/gen-ai-exchange-hackthon-prototype-LegaliTea)

---

<div align="center">
  <p><strong>Built with ❤️ for the Gen AI Exchange Hackathon</strong></p>
  <p>🍵 <em>Making legal documents as easy to understand as brewing tea</em> 🍵</p>
</div>
