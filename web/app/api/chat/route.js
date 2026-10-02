import { client } from '../../../lib/sanity';
import { getGeminiModel } from '../../../lib/gemini';
import { SEARCH_DOCS_QUERY } from '../../../lib/queries';

const STOPWORDS = new Set([
  'how', 'what', 'why', 'when', 'where', 'who', 'which', 'is', 'are', 'was', 'were',
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by',
  'about', 'from', 'up', 'of', 'then', 'all', 'any', 'can', 'will', 'just', 'should',
  'tell', 'me', 'explain', 'describe', 'using', 'built', 'build', 'did', 'does', 'him', 'his'
]);

function scoreDocument(doc, query) {
  const queryTokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 1 && !STOPWORDS.has(w));

  if (queryTokens.length === 0) return 0;

  const title = (doc.title || '').toLowerCase();
  const tags = (doc.tags || []).map(t => t.toLowerCase());
  const desc = (doc.description || '').toLowerCase();

  let score = 0;
  for (const token of queryTokens) {
    if (title.includes(token)) score += 6;
    if (tags.some(t => t.includes(token))) score += 5;
    if (desc.includes(token)) score += 3;
  }
  return score;
}

export async function POST(request) {
  try {
    const { messages } = await request.json();
    const lastMessage = messages[messages.length - 1].content;
    
    // Fetch all docs from Sanity
    const allDocs = await client.fetch(`*[_type == "doc"] | order(_createdAt desc) {
      _id,
      title,
      slug,
      category,
      description,
      tags,
      body
    }`);

    // Score and rank against the user's question
    const scoredDocs = (allDocs || [])
      .map(doc => ({ doc, score: scoreDocument(doc, lastMessage) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.doc);

    // Pick top 3 matches, or fallback to 3 latest docs
    const docs = scoredDocs.length > 0 ? scoredDocs.slice(0, 3) : (allDocs || []).slice(0, 3);
    
    // Helper to extract full text and code blocks from Portable Text
    const extractArticleText = (doc) => {
      if (!doc.body || !Array.isArray(doc.body)) {
        return doc.description || '';
      }
      return doc.body.map(block => {
        if (block._type === 'code') {
          return `\`\`\`${block.language || ''}\n${block.code || ''}\n\`\`\``;
        }
        if (block.children) {
          return block.children.map(c => c.text || '').join('');
        }
        return '';
      }).filter(Boolean).join('\n\n');
    };

    // Build context
    const context = docs.map(doc => `
      Title: ${doc.title}
      Category: ${doc.category}
      Content: ${extractArticleText(doc)}
    `).join('\n\n');
    
    const systemPrompt = `You are DocuMind, an intelligent AI documentation and technical knowledge agent for the engineering portfolio and technical publications of Malawige Inusha Thathsara Gunasekara.
    Answer the user's question accurately using the provided documentation context below.
    When asked about Inusha Thathsara (or Inusha Gunasekara), explain his background, education at University of Moratuwa, technical stack, hackathon wins, and notable projects based on the available context.
    Maintain a professional, articulate, and engaging tone.
    If the question is completely outside the available documentation, politely clarify what technical topics and projects you can answer.
    
    CONTEXT:
    ${context}
    `;
    
    const model = getGeminiModel(systemPrompt);
    
    const chat = model.startChat({
      history: messages.slice(0, -1).map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }],
      })),
    });
    
    // Call Gemini with automatic retry for transient 503/429 spikes
    let result;
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        result = await chat.sendMessageStream(lastMessage);
        break;
      } catch (err) {
        if (attempt === 2) throw err;
        console.warn(`Gemini stream attempt ${attempt + 1} failed, retrying in ${1000 * Math.pow(2, attempt)}ms...`);
        await new Promise(r => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
    
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            controller.enqueue(new TextEncoder().encode(chunkText));
          }
          controller.close();
        } catch (e) {
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Sources': JSON.stringify(docs.map(d => ({ title: d.title, slug: d.slug?.current, category: d.category }))),
      }
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
