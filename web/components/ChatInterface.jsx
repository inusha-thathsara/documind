'use client';
import { useState, useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import SourceCard from './SourceCard';

export default function ChatInterface({ initialQuery = '' }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [sources, setSources] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleSend(initialQuery);
    }
  }, [initialQuery]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (query = input) => {
    if (!query.trim()) return;
    
    const newMessages = [...messages, { role: 'user', content: query }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);
    setSources([]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const sourcesHeader = response.headers.get('X-Sources');
      if (sourcesHeader) {
        setSources(JSON.parse(sourcesHeader));
      }

      if (!response.ok) throw new Error('API Error');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let text = '';

      setMessages((prev) => [...prev, { role: 'model', content: '' }]);

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunkValue = decoder.decode(value);
        text += chunkValue;
        
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1].content = text;
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'model', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 70px)' }}>
      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '2rem' }}>
        <div style={{ flex: 1, overflowY: 'auto', paddingRight: '1rem' }}>
          {messages.length === 0 ? (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
              Ask a question to search the documentation...
            </div>
          ) : (
            messages.map((m, i) => <MessageBubble key={i} message={m} />)
          )}
          {isLoading && (
            <div style={{ color: 'var(--accent-glow)', fontStyle: 'italic', marginBottom: '1.5rem' }}>
              DocuMind is thinking...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input Area */}
        <div style={{ marginTop: '1rem' }}>
          <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '1rem' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Urban Flow AI, Climate OS, Flutter attendance, Web3..."
              style={{
                flex: 1,
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--surface-color-light)',
                color: 'var(--text-primary)',
                fontSize: '1rem'
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                padding: '1rem 2rem',
                borderRadius: '8px',
                backgroundColor: 'var(--accent-color)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '600',
                opacity: (isLoading || !input.trim()) ? 0.5 : 1
              }}
            >
              Send
            </button>
          </form>
        </div>
      </div>

      {/* Sources Sidebar */}
      <div style={{ 
        width: '300px', 
        borderLeft: '1px solid var(--border-color)', 
        backgroundColor: 'var(--surface-color)',
        padding: '2rem 1.5rem',
        overflowY: 'auto'
      }}>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Sources Context</h3>
        {sources.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Documentation sources will appear here when you ask a question.
          </p>
        ) : (
          sources.map((source, i) => (
            <SourceCard key={i} source={source} />
          ))
        )}
      </div>
    </div>
  );
}
