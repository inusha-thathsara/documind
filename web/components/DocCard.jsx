import Link from 'next/link';

export default function DocCard({ doc }) {
  return (
    <Link href={`/browse/${doc.slug.current}`}>
      <div className="doc-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>{doc.title}</h3>
          <span style={{ 
            fontSize: '0.75rem', 
            padding: '0.25rem 0.5rem', 
            backgroundColor: 'var(--surface-color)', 
            borderRadius: '12px',
            color: 'var(--accent-glow)'
          }}>{doc.category}</span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>
          {doc.description}
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: 'auto' }}>
          {doc.tags?.map(tag => (
            <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>#{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
