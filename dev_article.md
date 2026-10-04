*This is a submission for the [Sanity Challenge, Path One: Ship an Agent That Queries Real Content](https://dev.to/challenges/sanity-2026-09-16)*

---

# 🤖 DocuMind: Intelligent Real-Time AI Documentation & Technical Knowledge Agent

> **Transforming static developer documentation and technical publications into an interactive, grounded AI agent with verifiable source citations and automated bidirectional synchronization.**

---

## What I Built

In modern engineering teams, **documentation fragmentation** is a chronic drain on developer velocity. Architectural decisions, API schemas, installation walkthroughs, and troubleshooting guides end up scattered across static Markdown files, external developer blogging platforms (like DEV.to), and disconnected internal wikis. When developers encounter roadblocks, they waste hours manually hunting through multiple articles or asking generic AI models that frequently hallucinate out-of-date answers.

**DocuMind** solves this by unifying static technical publications into a dynamic, conversational AI documentation partner. 

Powered by **Next.js 15**, **Sanity CMS Content Lake**, and **Google Gemini AI**, DocuMind allows engineers to query complex architectures, code implementations, and technical topics using natural language. 

### 🌟 Key Highlights

1. **Grounded AI Reasoning (RAG Without Hallucinations):** Instead of relying on general model weights, DocuMind retrieves exact Portable Text blocks from Sanity via structured GROQ queries. Gemini is constrained to answer *strictly* using the retrieved documents.
2. **Verifiable Source Attribution:** Every response includes clickable **Source Cards** linking directly to the full Sanity-backed article reader, allowing users to cross-check claims with the original text.
3. **Automated DEV.to Synchronization:** DocuMind isn't a one-off import. It includes:
   - **Real-time Webhook Receiver:** Ingests newly published DEV.to Markdown and converts it into structured Sanity Portable Text blocks automatically.
   - **On-Demand Sync Button:** Triggers real-time content reconciliation directly from the UI.
   - **Automated GitHub Action:** Scheduled background synchronization running every 6 hours.
4. **Interactive Documentation Browser:** A dedicated `/browse` portal allowing developers to explore articles by tags and categories with full syntax highlighting.
5. **Modern Glassmorphic UI:** Built with dark-mode aesthetic design tokens, smooth micro-interactions, and streaming responses for sub-second perceived latency.

---

## Demo

- **Live Web App:** [https://documind.inusha.me](https://documind.inusha.me)
- **Live Sanity Studio:** [https://documind.inusha.me/studio](https://documind.inusha.me/studio)
- **GitHub Repository:** [https://github.com/inusha-thathsara/documind](https://github.com/inusha-thathsara/documind)
- **Sanity Public Query:** `https://j5tvnuy8.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=="doc"]`

### 🖥️ Key Routes
- **`/chat`**: Fullscreen conversational AI interface with streaming responses and citation badges.
- **`/browse`**: Complete knowledge base grid with category filters and tag search.
- **`/browse/[slug]`**: High-fidelity article reader with rich Portable Text rendering and syntax highlighting.
- **`/api/sync`**: On-demand synchronization engine connecting external feeds to Sanity.

---

## Code

The entire codebase is open-source and structured as a monorepo containing both the Next.js 15 frontend application and the Sanity Studio v3 workspace:

🔗 **GitHub Repository:** [https://github.com/inusha-thathsara/documind](https://github.com/inusha-thathsara/documind)

### 🏗️ Architecture

```
                       ┌─────────────────────────┐
                       │     User Interface      │
                       │  (Next.js 15 App Router)│
                       └───────────┬─────────────┘
                                   │
                     Natural Query │ Streaming Response
                                   ▼
                       ┌─────────────────────────┐
                       │       /api/chat         │
                       │   Token Ranker & RAG    │
                       └─────┬─────────────┬─────┘
                             │             │
         GROQ Context Query  │             │ Grounded Context
                             ▼             ▼
              ┌─────────────────────┐   ┌─────────────────────┐
              │     Sanity CMS      │   │    Google Gemini    │
              │    (Content Lake)   │   │   (Generative AI)   │
              └─────────────────────┘   └─────────────────────┘
                             ▲
                             │ Webhook / API Ingestion
              ┌──────────────┴──────┐
              │    DEV.to Platform  │
              │  (Technical Posts)  │
              └─────────────────────┘
```

---

## How I Used Sanity

Sanity forms the single source of truth and structured knowledge foundation for DocuMind.

### 1. Structured Content Modeling (Sanity Studio v3)

Rather than treating articles as arbitrary blobs of text, I designed a specialized `doc` schema in Sanity Studio ([`studio/schemas/doc.js`](https://github.com/inusha-thathsara/documind/blob/main/studio/schemas/doc.js)):

```javascript
export default {
  name: 'doc',
  title: 'Documentation Article',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required() },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title', maxLength: 96 } },
    { 
      name: 'category', 
      title: 'Category', 
      type: 'string', 
      options: { list: ['Architecture', 'Guides', 'DevOps & Cloud', 'Web3 & Blockchain', 'AI & Machine Learning'] } 
    },
    { name: 'description', title: 'Description / Summary', type: 'text', rows: 3 },
    { name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] },
    { name: 'body', title: 'Body Content', type: 'array', of: [{ type: 'block' }, { type: 'code' }] },
    { name: 'publishedAt', title: 'Published At', type: 'datetime' },
  ],
}
```

### 2. Populating with Real, High-Value Content

For Path 1, authentic data is essential. I pointed DocuMind at **25 real technical engineering articles** from my published library on DEV.to (`@inushathathsara`), spanning:
- Large-scale Cloud & GKE infrastructure
- Next.js 15 & React Server Components
- Web3 architectural paradigms
- ML model optimization & data pipelines

I wrote a custom **Markdown-to-PortableText engine** ([`web/scripts/import-devto.mjs`](https://github.com/inusha-thathsara/documind/blob/main/web/scripts/import-devto.mjs)) that parses markdown headings, paragraphs, lists, links, and code blocks into valid Sanity Portable Text blocks with syntax attributes.

### 3. Grounded Retrieval via GROQ

When a user submits a query in the chat interface:
1. The server extracts high-signal semantic tokens from the user's prompt.
2. A fast **GROQ query** retrieves the most relevant articles from the Sanity Content Lake based on keyword relevance across `title`, `description`, and `tags`:

```groq
*[_type == "doc" && (
  title match $keyword || 
  description match $keyword || 
  tags[] match $keyword
)][0...4]{
  _id,
  title,
  "slug": slug.current,
  category,
  description,
  tags,
  "plainText": pt::text(body)
}
```

3. The retrieved plain-text context is passed into **Google Gemini** with a strict grounding prompt instructing the model to act as a technical documentation partner and only formulate answers based on the provided Sanity articles.
4. If a concept is not present in the Knowledge Base, the model explicitly acknowledges that the docs do not contain this information rather than hallucinating.
5. The response is streamed back along with structured citation cards containing the document's `title`, `category`, and `slug`.

---

## Sanity Project Details

The Sanity dataset is publicly configured and accessible for judges to review schema definitions and documents:

- **Sanity Project ID:** `j5tvnuy8`
- **Dataset:** `production`
- **API Version:** `2024-01-01`
- **Public API Query Endpoint:**  
  [`https://j5tvnuy8.api.sanity.io/v2024-01-01/data/query/production?query=*[_type=="doc"]{title,slug,category,tags}`](https://j5tvnuy8.api.sanity.io/v2024-01-01/data/query/production?query=*[_type==%22doc%22]{title,slug,category,tags})

---

## Agent Session

During the development of DocuMind, I leveraged the **Google Antigravity IDE** pair-programming agent across the entire lifecycle:

- **Architecture & Planning:** Collaborated on an initial implementation plan outlining the schema requirements, API route structures, and token ranking logic before writing code.
- **RAG & Portable Text Parser:** Used Antigravity to build the regex-based Markdown-to-PortableText transformer, ensuring that raw markdown code fences, headers, and bulleted lists correctly converted into Sanity block specs.
- **Automated Webhook & GitHub Action:** Generated the automated ingestion pipeline (`.github/workflows/sync-devto.yml` and `/api/webhooks/devto`) to keep Sanity in sync with external publications.
- **Testing & UI Verification:** Used Antigravity's browser automation subagents to test the end-to-end user query flow, verifying streaming responses, citation badge clicks, and server-side rendering performance.

---

## Author & Acknowledgements

**Built by Malawige Inusha Thathsara Gunasekara**  
- **DEV.to Profile:** [@inushathathsara](https://dev.to/inushathathsara)  
- **GitHub:** [@inusha-thathsara](https://github.com/inusha-thathsara)  
- **LinkedIn:** [inusha-gunasekara](https://www.linkedin.com/in/inusha-gunasekara-9996632a5/)  

*Special thanks to the DEV.to and Sanity.io teams for hosting this challenge!*