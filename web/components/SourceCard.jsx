import Link from 'next/link';

export default function SourceCard({ source }) {
  return (
    <Link href={`/browse/${source.slug}`}>
      <div style={{
        padding: '1rem',
        borderRadius: '6px',
        backgroundColor: 'var(--surface-color-light)',
        border: '1px solid var(--border-color)',
        marginBottom: '0.75rem',
        fontSize: '0.875rem',
        display: 'block'
      }}>
        <div style={{ color: 'var(--accent-glow)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
          {source.category}
        </div>
        <div style={{ color: 'var(--text-primary)', fontWeight: '500' }}>
          {source.title}
        </div>
      </div>
    </Link>
  );
}
