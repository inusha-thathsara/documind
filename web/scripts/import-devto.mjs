import { createClient } from '@sanity/client';
import { markdownToPortableText } from '../lib/markdownToPortableText.js';

const token = process.env.SANITY_API_TOKEN;

if (!token) {
  console.error('ERROR: SANITY_API_TOKEN is missing in .env.local.');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: token,
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

async function importArticles() {
  console.log(`📡 Fetching articles from DEV.to for @${USERNAME}...`);
  
  const listRes = await fetch(`https://dev.to/api/articles?username=${USERNAME}&per_page=100`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (DocuMind Ingestor)' }
  });

  if (!listRes.ok) {
    throw new Error(`Failed to fetch article list: ${listRes.status} ${listRes.statusText}`);
  }

  const articles = await listRes.json();
  console.log(`Found ${articles.length} articles on DEV.to. Beginning import to Sanity...\n`);

  let count = 0;
  for (const item of articles) {
    count++;
    console.log(`[${count}/${articles.length}] Fetching full content for: "${item.title}"...`);

    try {
      const detailRes = await fetch(`https://dev.to/api/articles/${item.id}`, {
        headers: { 'User-Agent': 'Mozilla/5.0 (DocuMind Ingestor)' }
      });

      if (!detailRes.ok) {
        console.warn(`  ⚠️ Could not fetch details for #${item.id}: ${detailRes.statusText}`);
        continue;
      }

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

      await client.createOrReplace(docPayload);
      console.log(`  ✓ Synced to Sanity as [${category}]: ${item.slug}\n`);

      // Gentle rate-limiting
      await new Promise(r => setTimeout(r, 250));
    } catch (err) {
      console.error(`  ❌ Failed importing "${item.title}":`, err.message);
    }
  }

  console.log('\n🎉 All articles have been successfully synced to Sanity!');
  console.log('You can now browse them at http://localhost:3000/browse or ask questions in http://localhost:3000/chat');
}

importArticles().catch(err => {
  console.error('Fatal error during import:', err);
  process.exit(1);
});
