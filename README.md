# 🤖 DocuMind

> **An Intelligent Real-Time AI Documentation & Technical Knowledge Agent**  
> Powered by **Next.js 15**, **Sanity CMS**, and **Google Gemini AI**.

🌐 **Live Application:** [https://documind.inusha.me](https://documind.inusha.me)  
🛠️ **Sanity Studio (CMS):** [https://documind.inusha.me/studio](https://documind.inusha.me/studio)  

DocuMind transforms static developer documentation and technical publications into an interactive, conversational AI agent. Users can query engineering concepts, architectures, and implementation details using natural language, and receive streaming answers grounded with direct source citations from a structured Sanity Content Lake.

---

## 🌟 Key Features

- **Grounded AI Reasoning (RAG)**: Built with Google Gemini 3.1 Flash and custom relevance ranking across Sanity documents to prevent hallucination.
- **Source Attribution**: Every answer provides direct citation cards with clickable links to the full articles in the Sanity Knowledge Base.
- **Sanity Studio v3**: Full-featured CMS managing Portable Text documentation, code blocks, categories, and tags.
- **Automated DEV.to Synchronization**: Includes both an on-demand sync button and a webhook ingestion engine that translates Markdown into structured Portable Text blocks.
- **Fast, Modern UI**: Dark-mode glassmorphic theme built with Next.js App Router, CSS design tokens, and smooth micro-interactions.

---

## 🏗️ Architecture

```
                      ┌──────────────────────┐
                      │    User Interface    │
                      │  (Next.js App Router)│
                      └──────────┬───────────┘
                                 │
                   Natural Query │ Streaming Response
                                 ▼
                     ┌───────────────────────┐
                     │     /api/chat         │
                     │  Token Ranker & RAG   │
                     └─────┬───────────┬─────┘
                           │           │
       GROQ Context Query  │           │ Grounded Context
                           ▼           ▼
            ┌───────────────────┐    ┌───────────────────┐
            │    Sanity CMS     │    │   Google Gemini   │
            │   (Content Lake)  │    │   (Generative AI) │
            └───────────────────┘    └───────────────────┘
```

---

## 📁 Repository Structure

```
.
├── web/                       # Next.js 15 Frontend Application
│   ├── app/                   # App Router pages & API routes
│   │   ├── api/chat/          # RAG pipeline: retrieval + Gemini streaming
│   │   ├── api/sync/          # On-demand sync with DEV.to
│   │   ├── api/webhooks/devto/# Webhook receiver for automatic ingestion
│   │   ├── browse/            # Knowledge base documentation browser
│   │   │   └── [slug]/        # Article reader with PortableText & syntax highlighting
│   │   └── chat/              # Fullscreen interactive conversational UI
│   ├── components/            # Reusable UI components (Navbar, DocCard, SyncButton, etc.)
│   ├── lib/                   # Sanity client, Gemini client, queries, and Markdown parser
│   └── scripts/               # Seeder and import scripts
│
└── studio/                    # Sanity Studio v3 Project
    ├── schemas/               # Documentation article schema definition (doc.js)
    └── sanity.config.js       # Sanity Studio configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (Tested on Node 20 & 24)
- A [Sanity.io](https://sanity.io) account and Project ID
- A [Google AI Studio](https://aistudio.google.com/) Gemini API Key

### 1. Clone & Install Dependencies

```bash
# Install Next.js dependencies
cd web
npm install

# Install Sanity Studio dependencies
cd ../studio
npm install
```

### 2. Configure Environment Variables

**In `web/.env.local`:**
```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
GEMINI_API_KEY=your_gemini_api_key
SANITY_API_TOKEN=your_sanity_editor_token
```

**In `studio/.env`:**
```env
SANITY_STUDIO_PROJECT_ID=your_sanity_project_id
SANITY_STUDIO_DATASET=production
```

### 3. Run Locally

```bash
# Terminal 1: Run Next.js App (http://localhost:3000)
cd web
npm run dev

# Terminal 2: Run Sanity Studio (http://localhost:3333)
cd studio
npm run dev
```

### 4. Sync Content

To populate your Sanity dataset with published articles from DEV.to:
```bash
cd web
npm run import:devto
```

---

## 👤 Author

**Malawige Inusha Thathsara Gunasekara**  
- **LinkedIn**: [inusha-gunasekara](https://www.linkedin.com/in/inusha-gunasekara-9996632a5/)  
- **DEV.to**: [@inushathathsara](https://dev.to/inushathathsara)  
- **GitHub**: [@inusha-thathsara](https://github.com/inusha-thathsara)  
