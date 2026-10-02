'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SyncButton() {
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const router = useRouter();

  const handleSync = async () => {
    setLoading(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();

      if (res.ok) {
        setStatusMessage({
          type: 'success',
          text: data.newSyncedCount > 0 
            ? `✓ Synced ${data.newSyncedCount} new article(s)!` 
            : '✓ All articles are up to date with DEV.to.'
        });
        if (data.newSyncedCount > 0) {
          router.refresh();
        }
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Sync failed.' });
      }
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
      <button
        onClick={handleSync}
        disabled={loading}
        style={{
          padding: '0.6rem 1.25rem',
          borderRadius: '8px',
          backgroundColor: loading ? 'var(--surface-color-light)' : 'var(--accent-color)',
          border: '1px solid var(--border-color)',
          color: '#ffffff',
          fontWeight: '500',
          fontSize: '0.875rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease',
          opacity: loading ? 0.7 : 1,
        }}
      >
        <span>{loading ? '⏳' : '🔄'}</span>
        {loading ? 'Checking DEV.to...' : 'Sync from DEV.to'}
      </button>

      {statusMessage && (
        <span
          style={{
            fontSize: '0.85rem',
            color: statusMessage.type === 'success' ? 'var(--online-color)' : '#ef4444',
            fontWeight: '500'
          }}
        >
          {statusMessage.text}
        </span>
      )}
    </div>
  );
}
