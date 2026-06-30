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
      <style dangerouslySetInnerHTML={{ __html: `
        .live-chat-container { position: fixed; bottom: 24px; right: 24px; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
        .live-chat-fab { width: 60px; height: 60px; border-radius: 50%; background: #25D366; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(37, 211, 102, 0.4); cursor: pointer; border: none; transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease; position: relative; }
        .live-chat-fab:hover { transform: scale(1.1); box-shadow: 0 6px 16px rgba(37, 211, 102, 0.5); }
        .live-chat-fab.has-unread::after { content: ''; position: absolute; top: 0; right: 0; width: 14px; height: 14px; background: #ff3b30; border-radius: 50%; border: 2px solid white; }
        .live-chat-window { position: absolute; bottom: 80px; right: 0; width: 350px; height: 500px; max-height: calc(100vh - 120px); background: #efeae2; border-radius: 16px; box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.05); display: flex; flex-direction: column; overflow: hidden; transform-origin: bottom right; animation: chat-pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; opacity: 0; }
        .live-chat-window.closing { animation: chat-pop-out 0.2s ease-in forwards; }
        @keyframes chat-pop-in { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes chat-pop-out { 0% { transform: scale(1); opacity: 1; } 100% { transform: scale(0.8); opacity: 0; } }
        .chat-header { background: #008069; color: white; padding: 16px; display: flex; align-items: center; justify-content: space-between; }
        .chat-header-info { display: flex; align-items: center; gap: 12px; }
        .chat-avatar { width: 40px; height: 40px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #008069; }
        .chat-title { font-weight: 600; font-size: 16px; margin: 0; }
        .chat-subtitle { font-size: 12px; margin: 0; color: rgba(255, 255, 255, 0.8); }
        .chat-close-btn { background: none; border: none; color: white; cursor: pointer; opacity: 0.8; transition: opacity 0.2s; padding: 4px; }
        .chat-close-btn:hover { opacity: 1; }
        .chat-body { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; background-image: url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23d0d8ce" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E'); }
        .pre-chat-body { background: #ffffff; padding: 24px; }
        .pre-chat-intro h3 { margin: 0 0 8px 0; color: #111111; font-size: 20px; }
        .pre-chat-intro p { color: #64748b; font-size: 14px; margin: 0 0 24px 0; line-height: 1.5; }
        .pre-chat-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #475569; }
        .form-group select, .form-group input { padding: 10px 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 14px; outline: none; background: #f8fafc; transition: border-color 0.2s; }
        .form-group select:focus, .form-group input:focus { border-color: #008069; background: #ffffff; }
        .start-chat-btn { background: #008069; color: white; border: none; padding: 12px; border-radius: 8px; font-weight: 600; font-size: 15px; cursor: pointer; margin-top: 8px; transition: background 0.2s; }
        .start-chat-btn:hover { background: #006b58; }
        .chat-spinner { width: 32px; height: 32px; border: 4px solid #cbd5e1; border-top: 4px solid #008069; border-radius: 50%; animation: spin 1s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .chat-bubble { max-width: 80%; padding: 8px 12px; border-radius: 8px; font-size: 14px; line-height: 1.4; position: relative; box-shadow: 0 1px 0.5px rgba(11,20,26,.13); word-wrap: break-word; }
        .chat-bubble.sent { align-self: flex-end; background: #d9fdd3; border-top-right-radius: 0; }
        .chat-bubble.received { align-self: flex-start; background: #ffffff; border-top-left-radius: 0; }
        .chat-time { font-size: 10px; color: rgba(0,0,0,0.45); text-align: right; margin-top: 4px; display: block; }
        .chat-footer { padding: 12px; background: #f0f2f5; display: flex; align-items: center; gap: 8px; }
        .chat-input { flex: 1; border: none; padding: 12px 16px; border-radius: 24px; background: white; font-size: 14px; outline: none; }
        .chat-send-btn { background: #00a884; color: white; border: none; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: background 0.2s; }
        .chat-send-btn:hover { background: #008f6f; }
        .chat-send-btn:disabled { background: #cccccc; cursor: not-allowed; }
      `}} />
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
