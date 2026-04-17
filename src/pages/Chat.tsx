import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { Send, Phone, Image, Check, CheckCheck, Circle, MessageSquare, MessageCircle, Mail } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Message {
  id: string;
  senderId: string;
  text: string;
  status: 'sent' | 'delivered' | 'seen';
  timestamp: Date;
  imageUrl?: string;
}

interface Conversation {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  phone: string;
  online: boolean;
  email: string;
}

const mockConversations: Conversation[] = [
  { id: 'c1', name: 'Juma Hassan', role: 'Dalali', avatar: 'JH', lastMessage: 'The room is still available', unread: 2, phone: '+255792546865', online: true, email: 'evanskaija1576@gmail.com' },
  { id: 'c2', name: 'Fatma Said', role: 'Landlord', avatar: 'FS', lastMessage: 'When can you come see it?', unread: 0, phone: '+255792546865', online: true, email: 'evapedri20@gmail.com' },
  { id: 'c3', name: 'Baraka Mushi', role: 'Dalali', avatar: 'BM', lastMessage: 'Price is negotiable', unread: 1, phone: '+255792546865', online: false, email: 'info@dalali.co.tz' },
];

const mockMessages: Message[] = [
  { id: 'm1', senderId: 'c1', text: 'Habari, nyumba ipo bado?', status: 'seen', timestamp: new Date(Date.now() - 3600000) },
  { id: 'm2', senderId: 'me', text: 'Ndio, ipo bado. Bei ni shilingi 350,000 kwa mwezi.', status: 'seen', timestamp: new Date(Date.now() - 3400000) },
  { id: 'm3', senderId: 'c1', text: 'Ninaweza kuja kuangalia lini?', status: 'seen', timestamp: new Date(Date.now() - 3200000) },
  { id: 'm4', senderId: 'me', text: 'Unaweza kuja kesho asubuhi saa tatu.', status: 'seen', timestamp: new Date(Date.now() - 3000000) },
  { id: 'm5', senderId: 'c1', text: 'Sawa sana, nitakuwa hapo!', status: 'seen', timestamp: new Date(Date.now() - 600000) },
  { id: 'm6', senderId: 'c1', text: 'The room is still available', status: 'delivered', timestamp: new Date(Date.now() - 120000) },
];

export const Chat: React.FC = () => {
  const [conversations] = useState(mockConversations);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(mockConversations[0]);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      text: newMessage,
      status: 'sent',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, msg]);
    setNewMessage('');
    // Simulate reply
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: `m${Date.now()}`, senderId: activeConvo?.id || 'c1', text: 'Asante, nitafikiri...', status: 'delivered', timestamp: new Date() }
      ]);
    }, 2000);
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: '76px', overflow: 'hidden', background: 'var(--bg-color)' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar - Conversations */}
        <div style={{ width: '320px', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', background: 'var(--bg-color)' }}>
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{t('chat.messages')}</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Chat with Dalalis & Landlords</p>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map(convo => (
              <div
                key={convo.id}
                onClick={() => setActiveConvo(convo)}
                style={{
                  padding: '1rem 1.5rem',
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  cursor: 'pointer',
                  background: activeConvo?.id === convo.id ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                  borderLeft: activeConvo?.id === convo.id ? '3px solid var(--primary-color)' : '3px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.9rem' }}>
                    {convo.avatar}
                  </div>
                  {convo.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '12px', height: '12px', background: '#10b981', borderRadius: '50%', border: '2px solid var(--bg-color)' }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{convo.name}</span>
                    {convo.unread > 0 && (
                      <span style={{ background: 'var(--primary-color)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700 }}>{convo.unread}</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-color)', marginBottom: '2px' }}>{convo.role}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{convo.lastMessage}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Window */}
        {activeConvo ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Chat Header */}
            <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'white', fontSize: '0.85rem' }}>
                  {activeConvo.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700 }}>{activeConvo.name}</div>
                  <div style={{ fontSize: '0.8rem', color: activeConvo.online ? '#10b981' : 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Circle size={8} fill="currentColor" />
                    {activeConvo.online ? t('chat.online') : t('chat.offline')}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <a href={`sms:${activeConvo.phone}?body=Habari ${activeConvo.name.split(' ')[0]},`} title="Normal SMS" style={{ background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', padding: '0.5rem', borderRadius: '50%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageSquare size={18} />
                </a>
                <a href={`https://wa.me/${activeConvo.phone.replace(/\+/g, '').replace(/^0+/, '255')}?text=Habari ${activeConvo.name.split(' ')[0]},`} target="_blank" rel="noreferrer" title="WhatsApp" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem', borderRadius: '50%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MessageCircle size={18} />
                </a>
                <a href={`mailto:${activeConvo.email}`} title="Email" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.5rem', borderRadius: '50%', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Mail size={18} />
                </a>
                <a href={`tel:${activeConvo.phone}`} title="Call" style={{ background: 'var(--primary-color)', color: 'white', padding: '0.5rem 1rem', borderRadius: '20px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600, marginLeft: '4px' }}>
                  <Phone size={16} /> {t('chat.call')}
                </a>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {messages.map(msg => {
                const isMe = msg.senderId === 'me';
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '70%',
                      background: isMe ? 'var(--primary-color)' : 'rgba(255,255,255,0.07)',
                      color: isMe ? 'white' : 'var(--text-main)',
                      padding: '0.75rem 1rem',
                      borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      border: isMe ? 'none' : '1px solid var(--border-color)',
                    }}>
                      <p style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.5 }}>{msg.text}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '4px' }}>
                        <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{formatTime(msg.timestamp)}</span>
                        {isMe && (
                          msg.status === 'seen' ? <CheckCheck size={14} style={{ opacity: 0.9 }} /> :
                          msg.status === 'delivered' ? <CheckCheck size={14} style={{ opacity: 0.5 }} /> :
                          <Check size={14} style={{ opacity: 0.5 }} />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem', alignItems: 'center', background: 'var(--bg-color)' }}>
              <button style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <Image size={18} />
              </button>
              <input
                type="text"
                placeholder={t('chat.placeholder')}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                style={{ flex: 1, padding: '0.75rem 1.25rem', borderRadius: '25px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-main)', outline: 'none', fontSize: '0.95rem' }}
              />
              <button
                onClick={sendMessage}
                style={{ background: 'var(--primary-color)', border: 'none', borderRadius: '50%', width: '42px', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', boxShadow: '0 4px 12px rgba(16, 185, 129, 0.4)' }}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>Select a conversation to start chatting</div>
        )}
      </div>
    </div>
  );
};
