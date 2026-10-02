import { createClient } from '@sanity/client';

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.log('NOTE: To seed automatically via script, add SANITY_API_TOKEN with write access to .env.local.');
  console.log('Otherwise, you can easily create documents via Sanity Studio UI at http://localhost:3333');
  process.exit(0);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: token,
  useCdn: false,
});

const sampleDocs = [
  {
    _id: 'doc-getting-started',
    _type: 'doc',
    title: 'Getting Started with DocuMind',
    slug: { _type: 'slug', current: 'getting-started-with-documind' },
    category: 'getting-started',
    description: 'Learn how to set up, query, and manage knowledge base documents with DocuMind AI.',
    tags: ['setup', 'quickstart', 'documind'],
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'DocuMind is an intelligent developer documentation agent powered by Google Gemini and Sanity CMS. It bridges the gap between static developer documentation and interactive conversational AI by querying real-time structured content.'
          }
        ],
        markDefs: [],
        style: 'normal'
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'To get started, developers can browse all available articles in the Documentation Browser or use the AI Chat Assistant to ask technical questions with instant source attribution.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'doc-api-authentication',
    _type: 'doc',
    title: 'Authentication & API Keys',
    slug: { _type: 'slug', current: 'authentication-api-keys' },
    category: 'api-reference',
    description: 'Guidelines on authenticating requests, managing API keys, and handling security scopes.',
    tags: ['api', 'auth', 'security'],
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'All API requests to DocuMind endpoints require bearer token authentication. You should set your GEMINI_API_KEY and NEXT_PUBLIC_SANITY_PROJECT_ID in your environment variables.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ]
  },
  {
    _id: 'doc-groq-queries',
    _type: 'doc',
    title: 'Optimizing GROQ Queries for RAG',
    slug: { _type: 'slug', current: 'optimizing-groq-queries' },
    category: 'guides',
    description: 'Best practices for writing GROQ queries to power Retrieval-Augmented Generation.',
    tags: ['groq', 'rag', 'sanity'],
    body: [
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'When querying Sanity for context, use GROQ match operators and score functions to prioritize the most relevant articles. Always project only necessary fields like title, slug, description, and body to minimize context window overhead.'
          }
        ],
        markDefs: [],
        style: 'normal'
      }
    ]
  }
];

async function seed() {
  console.log('Seeding sample documentation articles into Sanity...');
  for (const doc of sampleDocs) {
    await client.createOrReplace(doc);
    console.log(`✓ Seeded: "${doc.title}"`);
  }
  console.log('Seeding complete! Check http://localhost:3000/browse to view documents.');
}

seed().catch(err => {
  console.error('Seeding failed:', err.message);
});
