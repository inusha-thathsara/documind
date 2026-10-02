import { client } from '../../../lib/sanity';
import { markdownToPortableText } from '../../../lib/markdownToPortableText';

const writeClient = client.withConfig({
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const USERNAME = 'inushathathsara';

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
    const listRes = await fetch(`https://dev.to/api/articles?username=${USERNAME}&per_page=50`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (DocuMind Sync)' },
      cache: 'no-store'
    });

    if (!listRes.ok) {
      return new Response(JSON.stringify({ error: `DEV.to fetch failed: ${listRes.statusText}` }), { status: 502 });
    }

    const articles = await listRes.json();
    
    // Check which articles exist in Sanity
    const existingIds = await client.fetch('*[_type == "doc"]._id');
    const existingSet = new Set(existingIds);

    const newArticles = articles.filter(a => !existingSet.has(`devto-${a.id}`));
    const synced = [];

    for (const item of newArticles) {
      const detailRes = await fetch(`https://dev.to/api/articles/${item.id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (DocuMind Sync)' }
      });

      if (!detailRes.ok) continue;

      const detail = await detailRes.json();
      const rawMarkdown = detail.body_markdown || item.description || '';
      const portableBlocks = markdownToPortableText(rawMarkdown);
      const category = determineCategory(item.tag_list);

      const docPayload = {
        _id: `devto-${item.id}`,
        _type: 'doc',
        title: item.title,
        slug: {
          _type: 'slug',
          current: item.slug || `article-${item.id}`,
        },
        category: category,
        description: item.description || item.title,
        tags: item.tag_list || [],
        body: portableBlocks.length > 0 ? portableBlocks : [
          {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: item.description || item.title }]
          }
        ],
      };

      await writeClient.createOrReplace(docPayload);
      synced.push(item.title);
    }

    return new Response(JSON.stringify({
      success: true,
      message: synced.length > 0 ? `Successfully imported ${synced.length} new article(s)!` : 'All articles are already up to date.',
      newSyncedCount: synced.length,
      syncedTitles: synced
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Sync API error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
