export const dynamic = 'force-dynamic';

import { client } from '../../lib/sanity';
import { GET_ALL_DOCS_QUERY } from '../../lib/queries';
import DocCard from '../../components/DocCard';
import SyncButton from '../../components/SyncButton';

export default async function BrowsePage() {
  const docs = await client.fetch(GET_ALL_DOCS_QUERY);
  
  return (
    <div className="container animate-fade-in" style={{ padding: '4rem 2rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        flexWrap: 'wrap',
        gap: '1.5rem',
        marginBottom: '3rem'
      }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Documentation Browser</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Browse all technical publications and knowledge base articles stored in Sanity.
          </p>
        </div>
        <SyncButton />
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {docs.map(doc => (
          <DocCard key={doc._id} doc={doc} />
        ))}
        {docs.length === 0 && (
          <div style={{ color: 'var(--text-secondary)' }}>No documents found. Add some in Sanity Studio!</div>
        )}
      </div>
    </div>
  );
}
