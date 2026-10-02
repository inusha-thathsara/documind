import { client } from '../../../../lib/sanity';
import { markdownToPortableText } from '../../../../lib/markdownToPortableText';

// Ensure the Sanity client has token write permissions
const writeClient = client.withConfig({
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

function determineCategory(tags) {
  const tagSet = new Set((tags || []).map(t => t.toLowerCase()));
  if (['machinelearning', 'datascience', 'ai', 'gemini', 'gemma', 'agents', 'buildmultiagents'].some(t => tagSet.has(t))) {
    return 'ai-ml';
  }
  if (['architecture', 'devops', 'cloud', 'fullstack', 'productivity', 'management', 'analytics'].some(t => tagSet.has(t))) {
    return 'architecture';
  }
  if (['frontendchallenge', 'css', 'javascript', 'portfolio'].some(t => tagSet.has(t))) {
    return 'frontend';
  }
  if (['blockchain', 'bitcoin', 'web3'].some(t => tagSet.has(t))) {
    return 'web3';
  }
  if (['flutter', 'learning', 'nextjs', 'typescript'].some(t => tagSet.has(t))) {
    return 'guides';
  }
  return 'examples';
}

export async function POST(request) {
  try {
    // Optional secret verification
    const secret = request.headers.get('x-devto-secret') || new URL(request.url).searchParams.get('secret');
    if (process.env.DEVTO_WEBHOOK_SECRET && secret !== process.env.DEVTO_WEBHOOK_SECRET) {
      return new Response(JSON.stringify({ error: 'Unauthorized webhook secret' }), { status: 401 });
    }

    const payload = await request.json();
    
    // DEV.to webhook format: payload.article or payload directly
    const article = payload.article || payload;
    if (!article || !article.id) {
      return new Response(JSON.stringify({ error: 'Missing article data in payload' }), { status: 400 });
    }

    const tagList = Array.isArray(article.tag_list) 
      ? article.tag_list 
      : (typeof article.tags === 'string' ? article.tags.split(',').map(t => t.trim()) : []);

    const category = determineCategory(tagList);
    const rawMarkdown = article.body_markdown || article.description || '';
    const portableBlocks = markdownToPortableText(rawMarkdown);

    const docPayload = {
      _id: `devto-${article.id}`,
      _type: 'doc',
      title: article.title,
      slug: {
        _type: 'slug',
        current: article.slug || `article-${article.id}`,
      },
      category: category,
      description: article.description || article.title,
      tags: tagList,
      body: portableBlocks.length > 0 ? portableBlocks : [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: article.description || article.title }]
        }
      ],
    };

    await writeClient.createOrReplace(docPayload);
    console.log(`[DEV.to Webhook] Successfully ingested: "${article.title}" into Sanity (${docPayload._id})`);

    return new Response(JSON.stringify({
      success: true,
      message: `Article "${article.title}" successfully synced to Sanity!`,
      docId: docPayload._id,
      slug: docPayload.slug.current,
      category: category
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('DEV.to webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
