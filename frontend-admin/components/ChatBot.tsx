'use client';

import { useState, useRef, useEffect } from 'react';
import styles from './ChatBot.module.css';

interface Message {
  role: 'user' | 'model';
  content: string;
}

const SUGGESTED = [
  'Which products are low on stock? 📦',
  'Show me best sellers',
  'Total product count?',
  'Electronics category?',
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      content: "Hi! I'm **Nova** 🛡️, your NovaShop admin assistant. Ask me about inventory, products, prices, or stock levels!",
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch(`${API}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't get a response. Please try again.";
      setMessages(prev => [...prev, { role: 'model', content: reply }]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'model', content: "I'm having trouble connecting right now. Please try again in a moment." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const renderText = (text: string) => {
    return text
      .split('\n')
      .map((line, i) => {
        const parts = line.split(/\*\*(.+?)\*\*/g);
        return (
          <span key={i}>
            {parts.map((part, j) =>
              j % 2 === 1 ? <strong key={j}>{part}</strong> : part
            )}
            {i < text.split('\n').length - 1 && <br />}
          </span>
        );
      });
  };

  return (
    <>
      <button
        className={styles.trigger}
        onClick={() => setOpen(o => !o)}
        aria-label="Open admin chat"
        id="admin-chatbot-trigger"
      >
        <span className={styles.triggerIcon}>{open ? '✕' : '🤖'}</span>
        {unread > 0 && !open && <span className={styles.badge}>{unread}</span>}
      </button>

      <div className={`${styles.panel} ${open ? styles.panelOpen : ''}`} role="dialog" aria-label="Admin Chat">
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.avatar}>🛡️</div>
            <div>
              <div className={styles.botName}>Nova Admin AI</div>
              <div className={styles.botStatus}>
                <span className={styles.statusDot} />
                Online · Inventory & Store Assistant
              </div>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close chat">✕</button>
        </div>

        <div className={styles.messages}>
          {messages.map((msg, i) => (
            <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.messageUser : styles.messageBot}`}>
              {msg.role === 'model' && <div className={styles.msgAvatar}>🛡️</div>}
              <div className={`${styles.bubble} ${msg.role === 'user' ? styles.bubbleUser : styles.bubbleBot}`}>
                {renderText(msg.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className={`${styles.message} ${styles.messageBot}`}>
              <div className={styles.msgAvatar}>🛡️</div>
              <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.typing}`}>
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className={styles.suggestions}>
            {SUGGESTED.map(s => (
              <button key={s} className={styles.chip} onClick={() => sendMessage(s)}>
                {s}
              </button>
            ))}
          </div>
        )}

        <form className={styles.inputRow} onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about inventory, stock, products..."
            disabled={loading}
            id="admin-chatbot-input"
            autoComplete="off"
          />
          <button
            type="submit"
            className={styles.sendBtn}
            disabled={loading || !input.trim()}
            id="admin-chatbot-send"
            aria-label="Send"
          >
            ➤
          </button>
        </form>
      </div>
    </>
  );
}
