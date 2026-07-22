'use client';

import React, { useState, useEffect, useRef } from 'react';

import { sendChatMessage, pollChatMessages, getConversation, startConversation, getCustomerOrders } from '@/actions/chat';

export function LiveChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [guestToken, setGuestToken] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Pre-chat form state
  const [view, setView] = useState<'pre-chat' | 'chat' | 'loading'>('loading');
  const [category, setCategory] = useState('Order Tracking');
  const [orderId, setOrderId] = useState('');
  const [orders, setOrders] = useState<any[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize Guest Token & Check Conversation
  useEffect(() => {
    let token = localStorage.getItem('live_chat_token');
    if (!token) {
      token = crypto.randomUUID();
      localStorage.setItem('live_chat_token', token);
    }
    setGuestToken(token);
    
    getConversation(token).then((res) => {
      if (res.success && res.conversation) {
        setMessages(res.conversation.messages || []);
        setView('chat');
      } else {
        setView('pre-chat');
      }
    });
    
    getCustomerOrders().then((res) => {
      if (res.success && res.orders) {
        setOrders(res.orders);
      }
    });
  }, []);

  // Global Event Listener to open chat from other components
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsClosing(false);
      setUnreadCount(0);
    };
    window.addEventListener('open-live-chat', handleOpenChat);
    return () => window.removeEventListener('open-live-chat', handleOpenChat);
  }, []);

  // Polling for new messages
  useEffect(() => {
    if (!guestToken || view !== 'chat') return;

    const fetchMessages = async () => {
      const res = await pollChatMessages(guestToken);
      if (res.success && res.messages) {
        setMessages(prev => {
          if (!isOpen && res.messages.length > prev.length) {
            const newMsgs = res.messages.slice(prev.length);
            const hasAdminMsg = newMsgs.some((m: any) => m.senderType === 'ADMIN');
            if (hasAdminMsg) {
              setUnreadCount(c => c + 1);
            }
          }
          return res.messages;
        });
      }
    };

    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [guestToken, isOpen, view]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (isOpen && view === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, view]);

  const handleOpen = () => {
    setIsOpen(true);
    setIsClosing(false);
    setUnreadCount(0);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 200); 
  };

  const handleStartChat = async (e: React.FormEvent) => {
    e.preventDefault();
    setView('loading');
    const res = await startConversation(guestToken, { 
      category, 
      orderId, 
      subject: `Live Chat: ${category}` 
    });
    if (res.success) {
      setView('chat');
    } else {
      setView('pre-chat');
      alert("Failed to start chat. Please try again.");
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !guestToken || sending) return;

    const tempText = inputText;
    setInputText('');
    setSending(true);

    const optimisticMsg = {
      id: Date.now().toString(),
      senderType: 'GUEST',
      body: tempText,
      createdAt: new Date().toISOString()
    };
    setMessages(prev => [...prev, optimisticMsg]);

    await sendChatMessage(guestToken, tempText);
    setSending(false);
  };

  return (
    <div className="live-chat-container">
      
      {isOpen ? (
        <div className={`live-chat-window ${isClosing ? 'closing' : ''}`}>
          <div className="chat-header">
            <div className="chat-header-info">
              <div className="chat-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              </div>
              <div>
                <p className="chat-title">Customer Support</p>
                <p className="chat-subtitle">Typically replies in a few minutes</p>
              </div>
            </div>
            <button className="chat-close-btn" onClick={handleClose}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>

          {view === 'loading' && (
            <div className="chat-body" style={{ justifyContent: 'center', alignItems: 'center' }}>
              <div className="chat-spinner"></div>
            </div>
          )}

          {view === 'pre-chat' && (
            <div className="chat-body pre-chat-body">
              <div className="pre-chat-intro">
                <h3>Welcome! 👋</h3>
                <p>Please provide a few details so we can connect you with the right agent.</p>
              </div>
              <form onSubmit={handleStartChat} className="pre-chat-form">
                <div className="form-group">
                  <label>What do you need help with?</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                    <option value="Order Tracking">Order Tracking</option>
                    <option value="Refund / Return">Refund / Return</option>
                    <option value="Product Question">Product Question</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Order Number (Optional)</label>
                  {orders.length > 0 ? (
                    <select value={orderId} onChange={(e) => setOrderId(e.target.value)}>
                      <option value="">Select an order...</option>
                      {orders.map(o => (
                        <option key={o.orderNumber} value={o.orderNumber}>
                          {o.orderNumber} ({new Date(o.createdAt).toLocaleDateString()})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      placeholder="e.g. ORD-12345" 
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                    />
                  )}
                </div>
                <button type="submit" className="start-chat-btn">Start Chat</button>
              </form>
            </div>
          )}

          {view === 'chat' && (
            <>
              <div className="chat-body">
                <div className="chat-bubble received">
                  Hello! 👋 How can we help you today?
                  <span className="chat-time">Automated</span>
                </div>
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-bubble ${msg.senderType === 'ADMIN' ? 'received' : 'sent'}`}>
                    {msg.body}
                    <span className="chat-time">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <form className="chat-footer" onSubmit={handleSend}>
                <input 
                  type="text" 
                  className="chat-input"
                  placeholder="Type a message..." 
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={sending}
                />
                <button type="submit" className="chat-send-btn" disabled={!inputText.trim() || sending}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                </button>
              </form>
            </>
          )}
        </div>
      ) : null}
    </div>
  );
}
