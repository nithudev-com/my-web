'use client';

import { useState, useMemo, useEffect } from 'react';
import { adminReplyMessage, updateConversationStatus } from '../actions';
import { getAdminConversations } from '../api';

type Conversation = any; // simplified for this component

export function AdminInbox({ initialConversations }: { initialConversations: Conversation[] }) {
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [activeFolder, setActiveFolder] = useState<string>('ALL');
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      const freshData = await getAdminConversations();
      if (freshData) {
        setConversations(freshData);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const folders = [
    { id: 'ALL', name: 'All Messages' },
    { id: 'NEW', name: 'New' },
    { id: 'OPEN', name: 'Open' },
    { id: 'AWAITING_CUSTOMER', name: 'Awaiting Customer' },
    { id: 'AWAITING_ADMIN', name: 'Awaiting Admin' },
    { id: 'RESOLVED', name: 'Resolved' },
    { id: 'CLOSED', name: 'Closed' },
  ];

  const filteredConversations = useMemo(() => {
    if (activeFolder === 'ALL') return conversations;
    return conversations.filter((c: any) => c.status === activeFolder);
  }, [conversations, activeFolder]);

  const activeConv = useMemo(() => {
    return conversations.find((c: any) => c.conversationId === activeConvId);
  }, [conversations, activeConvId]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeConvId || !replyText) return;
    
    setLoading(true);
    const formData = new FormData();
    formData.append('conversationId', activeConvId);
    formData.append('message', replyText);
    
    const result = await adminReplyMessage(formData);
    if (result.success) {
      setReplyText('');
      // In a real app we'd fetch the new messages, here we just optimistically update or rely on SSE
    }
    setLoading(false);
  };

  const handleStatusChange = async (status: string) => {
    if (!activeConvId) return;
    const formData = new FormData();
    formData.append('conversationId', activeConvId);
    formData.append('status', status);
    await updateConversationStatus(formData);
  };

  return (
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      
      {/* Left Panel: Folders */}
      <div style={{ width: '240px', background: '#fff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#111111', margin: 0 }}>Inbox</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '0 12px' }}>
          {folders.map(folder => {
            const count = folder.id === 'ALL' ? conversations.length : conversations.filter((c: any) => c.status === folder.id).length;
            const isActive = activeFolder === folder.id;
            return (
              <button 
                key={folder.id}
                onClick={() => { setActiveFolder(folder.id); setActiveConvId(null); }}
                style={{ 
                  width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '10px 12px', borderRadius: '8px', border: 'none', background: isActive ? '#f1f5f9' : 'transparent',
                  cursor: 'pointer', textAlign: 'left', marginBottom: '4px', transition: '0.2s'
                }}
              >
                <span style={{ fontSize: '14px', fontWeight: isActive ? '700' : '500', color: isActive ? '#0f172a' : '#475569' }}>{folder.name}</span>
                {count > 0 && (
                  <span style={{ background: isActive ? '#e2e8f0' : '#f1f5f9', color: '#475569', fontSize: '11px', fontWeight: '700', padding: '2px 8px', borderRadius: '12px' }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Middle Panel: Message List */}
      <div style={{ width: '340px', background: '#f8fafc', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <input type="text" placeholder="Search messages..." style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none' }} />
        </div>
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {filteredConversations.length === 0 ? (
            <div style={{ padding: '40px 24px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>No messages in this folder.</div>
          ) : (
            filteredConversations.map((conv: any) => {
              const isActive = activeConvId === conv.conversationId;
              const name = conv.customerId ? `${conv.customer.firstName} ${conv.customer.lastName}` : conv.guestName;
              return (
                <div 
                  key={conv.conversationId}
                  onClick={() => setActiveConvId(conv.conversationId)}
                  style={{ 
                    padding: '16px 20px', borderBottom: '1px solid #e2e8f0', cursor: 'pointer',
                    background: isActive ? '#fff' : 'transparent',
                    borderLeft: isActive ? '3px solid #D63062' : '3px solid transparent'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#111111', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{new Date(conv.updatedAt).toLocaleDateString()}</div>
                  </div>
                  <div style={{ fontWeight: '600', fontSize: '13px', color: '#0f172a', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{conv.subject}</div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: '#e2e8f0', color: '#475569' }}>{conv.status}</span>
                    <span style={{ fontSize: '10px', fontWeight: '800', padding: '2px 6px', borderRadius: '4px', background: conv.customerId ? '#dbeafe' : '#fef3c7', color: conv.customerId ? '#1e3a8a' : '#92400e' }}>
                      {conv.customerId ? 'Registered' : 'Guest'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Panel: Active Conversation */}
      <div style={{ flex: 1, background: '#fff', display: 'flex', flexDirection: 'column' }}>
        {!activeConv ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748b' }}>
            Select a conversation to view details
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: '0 0 4px 0', fontSize: '20px', fontWeight: '800', color: '#111111' }}>{activeConv.subject}</h2>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  {activeConv.customerId ? `${activeConv.customer.firstName} ${activeConv.customer.lastName} (${activeConv.customer.email})` : `${activeConv.guestName} (${activeConv.guestEmail})`}
                  {' • '}{activeConv.category}
                  {activeConv.orderId && ` • Order: ${activeConv.orderId}`}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <select 
                  value={activeConv.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', fontSize: '13px', fontWeight: '600' }}
                >
                  <option value="NEW">New</option>
                  <option value="OPEN">Open</option>
                  <option value="AWAITING_CUSTOMER">Awaiting Customer</option>
                  <option value="AWAITING_ADMIN">Awaiting Admin</option>
                  <option value="RESOLVED">Resolved</option>
                  <option value="CLOSED">Closed</option>
                  <option value="SPAM">Spam</option>
                </select>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', background: '#f8fafc' }}>
              {activeConv.messages.map((msg: any) => {
                const isAdmin = msg.senderType === 'ADMIN';
                return (
                  <div key={msg.id.toString()} style={{ display: 'flex', flexDirection: 'column', alignItems: isAdmin ? 'flex-end' : 'flex-start' }}>
                    <div style={{ 
                      maxWidth: '70%', 
                      background: isAdmin ? '#0f172a' : '#fff', 
                      color: isAdmin ? '#fff' : '#111111',
                      padding: '16px 20px',
                      borderRadius: '16px',
                      border: isAdmin ? 'none' : '1px solid #e2e8f0',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                      <div style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', color: isAdmin ? '#94a3b8' : '#64748b' }}>
                        {isAdmin ? 'Admin (You)' : (activeConv.customerId ? 'Customer' : 'Guest')} • {new Date(msg.createdAt).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '15px', lineHeight: '1.5', whiteSpace: 'pre-wrap' }}>
                        {msg.body}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Area */}
            <div style={{ padding: '24px', borderTop: '1px solid #e2e8f0', background: '#fff' }}>
              <form onSubmit={handleReply} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <textarea 
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your reply to the customer..."
                  rows={4}
                  style={{ width: '100%', padding: '16px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '15px', outline: 'none', resize: 'vertical' }}
                  required
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Sending a reply automatically sets status to 'Awaiting Customer'</div>
                  <button type="submit" disabled={loading} style={{ background: '#0f172a', color: '#fff', padding: '10px 24px', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Sending...' : 'Send Reply'}
                  </button>
                </div>
              </form>
            </div>
          </>
        )}
      </div>

    </div>
  );
}
