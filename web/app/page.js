'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/chat?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <main className="container animate-fade-in" style={{ padding: '6rem 2rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem', lineHeight: '1.2' }}>
        Ask your docs <span className="gradient-text">anything.</span>
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
        DocuMind connects to your Sanity Knowledge Base and uses Gemini AI to give you instant, accurate answers with source citations.
      </p>
      
      <form onSubmit={handleSearch} style={{ maxWidth: '600px', margin: '0 auto 4rem', display: 'flex', gap: '1rem' }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about Urban Flow AI, Climate OS, Flutter attendance, Web3..."
          style={{
            flex: 1,
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid var(--border-color)',
            backgroundColor: 'var(--surface-color-light)',
            color: 'var(--text-primary)',
            fontSize: '1.125rem'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '1.25rem 2.5rem',
            borderRadius: '12px',
            backgroundColor: 'var(--accent-color)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1.125rem',
            fontWeight: '600'
          }}
        >
          Ask
        </button>
      </form>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', flexWrap: 'wrap' }}>
        {[
          { title: 'Sanity-Powered', desc: 'Queries real content from your Content Lake via GROQ.' },
          { title: 'Gemini AI', desc: 'State-of-the-art reasoning for natural language answers.' },
          { title: 'Source-Cited', desc: 'Every answer links directly to the source documentation.' }
        ].map((feature, i) => (
          <div key={i} style={{
            padding: '2rem',
            borderRadius: '12px',
            backgroundColor: 'var(--surface-color-light)',
            border: '1px solid var(--border-color)',
            width: '300px',
            textAlign: 'left'
          }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{feature.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{feature.desc}</p>
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '5rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
        <div>
          Built by <Link href="/browse/about-inusha-thathsara-gunasekara" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>Malawige Inusha Thathsara Gunasekara</Link>.
        </div>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <a href="https://www.linkedin.com/in/inusha-gunasekara-9996632a5/" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontWeight: '500' }}>LinkedIn</a>
          <a href="https://dev.to/inushathathsara" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)' }}>DEV.to</a>
          <a href="https://github.com/inusha-thathsara" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-primary)' }}>GitHub</a>
        </div>
      </footer>
    </main>
  );
}
