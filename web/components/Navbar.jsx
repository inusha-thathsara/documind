import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      padding: '1rem 2rem',
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'var(--surface-color)'
    }}>
      <Link href="/">
        <h2 style={{ margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🤖</span>
          <span className="gradient-text">DocuMind</span>
        </h2>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link href="/chat" style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: 'var(--surface-color-light)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
          Chat
        </Link>
        <Link href="/browse" style={{ padding: '0.5rem 1rem', borderRadius: '6px', backgroundColor: 'var(--surface-color-light)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', fontSize: '0.875rem' }}>
          Browse Docs
        </Link>
        <a 
          href="https://www.linkedin.com/in/inusha-gunasekara-9996632a5/" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ 
            padding: '0.5rem 1rem', 
            borderRadius: '6px', 
            backgroundColor: '#0a66c2', 
            color: '#fff', 
            fontSize: '0.875rem',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <span style={{ fontWeight: '700' }}>in</span>
          <span>LinkedIn</span>
        </a>
      </div>
    </nav>
  );
}
