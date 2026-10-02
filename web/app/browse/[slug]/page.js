import { PortableText } from '@portabletext/react';
import { client } from '../../../lib/sanity';
import { GET_DOC_BY_SLUG_QUERY, GET_ALL_DOCS_QUERY } from '../../../lib/queries';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  const docs = await client.fetch(GET_ALL_DOCS_QUERY);
  return docs.map((doc) => ({
    slug: doc.slug.current,
  }));
}

const components = {
  types: {
    code: ({ value }) => {
      return (
        <pre style={{
          padding: '1.25rem',
          backgroundColor: '#07070c',
          border: '1px solid var(--border-color)',
          borderRadius: '8px',
          overflowX: 'auto',
          margin: '1.5rem 0',
          fontSize: '0.9rem',
          color: '#e2e8f0',
          fontFamily: "'JetBrains Mono', monospace"
        }}>
          <code>{value.code}</code>
        </pre>
      );
    }
  },
  block: {
    h1: ({ children }) => <h1 style={{ fontSize: '2.25rem', marginTop: '2.5rem', marginBottom: '1rem', color: '#fff' }}>{children}</h1>,
    h2: ({ children }) => <h2 style={{ fontSize: '1.75rem', marginTop: '2rem', marginBottom: '0.75rem', color: '#fff', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{children}</h2>,
    h3: ({ children }) => <h3 style={{ fontSize: '1.35rem', marginTop: '1.5rem', marginBottom: '0.5rem', color: 'var(--accent-glow)' }}>{children}</h3>,
    normal: ({ children }) => <p style={{ marginBottom: '1.25rem', color: 'var(--text-primary)', lineHeight: '1.8' }}>{children}</p>,
    blockquote: ({ children }) => (
      <blockquote style={{ borderLeft: '4px solid var(--accent-glow)', paddingLeft: '1rem', margin: '1.5rem 0', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>{children}</ul>,
    number: ({ children }) => <ol style={{ paddingLeft: '1.5rem', marginBottom: '1.25rem' }}>{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{children}</li>,
    number: ({ children }) => <li style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{children}</li>,
  },
};

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const doc = await client.fetch(GET_DOC_BY_SLUG_QUERY, { slug });

  if (!doc) {
    return <div className="container" style={{ padding: '4rem 2rem' }}>Document not found.</div>;
  }

  return (
    <article className="container animate-fade-in" style={{ padding: '4rem 2rem', maxWidth: '800px' }}>
      <Link href="/browse" style={{ display: 'inline-block', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        &larr; Back to browser
      </Link>
      
      <div style={{ marginBottom: '3rem' }}>
        <span style={{ 
          fontSize: '0.875rem', 
          padding: '0.25rem 0.75rem', 
          backgroundColor: 'var(--surface-color)', 
          borderRadius: '12px',
          color: 'var(--accent-glow)',
          display: 'inline-block',
          marginBottom: '1rem'
        }}>{doc.category}</span>
        
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', lineHeight: '1.2' }}>{doc.title}</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)' }}>{doc.description}</p>
      </div>

      <div style={{ 
        backgroundColor: 'var(--surface-color-light)', 
        padding: '2rem', 
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        fontSize: '1.125rem',
        lineHeight: '1.8'
      }}>
        <PortableText value={doc.body} components={components} />
      </div>

      <div style={{ marginTop: '4rem', textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem' }}>Have questions about this article?</h3>
        <Link href={`/chat?q=Tell me about ${encodeURIComponent(doc.title)}`}
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            borderRadius: '8px',
            backgroundColor: 'var(--accent-color)',
            color: '#fff',
            fontWeight: '600'
          }}
        >
          Ask DocuMind
        </Link>
      </div>
    </article>
  );
}
