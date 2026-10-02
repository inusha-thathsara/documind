'use client';
import { useSearchParams } from 'next/navigation';
import ChatInterface from '../../components/ChatInterface';
import { Suspense } from 'react';

function ChatContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  
  return <ChatInterface initialQuery={query} />;
}

export default function ChatPage() {
  return (
    <div className="animate-fade-in">
      <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>Loading chat...</div>}>
        <ChatContent />
      </Suspense>
    </div>
  );
}
