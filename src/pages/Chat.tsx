import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Send, Phone, Image, Check, CheckCheck, Circle, MessageSquare, MessageCircle, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useProperties } from '../contexts/PropertyContext';
import { getChats, saveChats } from '../utils/db';

interface Message {
  id: string;
  senderId: string;
  convoId: string;
  text: string;
  status: 'sent' | 'delivered' | 'seen';
  timestamp: Date;
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

export const Chat: React.FC = () => {
  const { convoId } = useParams<{ convoId?: string }>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvo, setActiveConvo] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const { agents } = useProperties();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedMessages = await getChats().catch(() => []);
        
        // Build conversations from dynamic agents + any saved messages
        const convos: Conversation[] = agents.map(agent => {
          const agentMessages = savedMessages.filter(m => m.convoId === agent.id);
          const lastMsg = agentMessages.length > 0 ? agentMessages[agentMessages.length - 1].text : 'Start a conversation';
          return {
            id: agent.id,
            name: agent.name,
            role: 'Agent',
            avatar: agent.name.split(' ').map(n => n[0]).join(''),
            lastMessage: lastMsg,
            unread: 0,
            phone: agent.phone,
            online: Math.random() > 0.3,
            email: agent.email
          };
        });

        setConversations(convos);
        setMessages(savedMessages);
        
        if (convoId) {
          const found = convos.find(c => c.id === convoId);
          if (found) setActiveConvo(found);
        } else if (convos.length > 0 && !activeConvo) {
          setActiveConvo(convos[0]);
        }
      } catch (err) {
        console.error("Chat loading failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [convoId, agents]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeConvo]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeConvo) return;
    
    const msg: Message = {
      id: `m${Date.now()}`,
      senderId: 'me',
      convoId: activeConvo.id,
      text: newMessage,
      status: 'sent',
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, msg];
    setMessages(updatedMessages);
    setNewMessage('');
    await saveChats(updatedMessages);

    // Update last message in sidebar
    setConversations(prev => prev.map(c => c.id === activeConvo.id ? { ...c, lastMessage: msg.text } : c));

    // Simulate agent reply
    setTimeout(async () => {
      const reply: Message = {
        id: `r${Date.now()}`,
        senderId: activeConvo.id,
        convoId: activeConvo.id,
        text: 'Received! I will get back to you shortly.',
        status: 'delivered',
        timestamp: new Date(),
      };
      const withReply = [...updatedMessages, reply];
      setMessages(withReply);
      await saveChats(withReply);
      setConversations(prev => prev.map(c => c.id === activeConvo.id ? { ...c, lastMessage: reply.text } : c));
    }, 1500);
  };

  const formatTime = (date: any) => {
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) return <div style={{ paddingTop: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>Preparing your Chat...</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: '76px', overflow: 'hidden', background: 'var(--bg-color)' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Sidebar - Conversations */}
        <div style={{ 
          width: isMobile ? '100%' : '320px', 
          borderRight: '1px solid var(--border-color)', 
          flexDirection: 'column', 
          background: 'var(--bg-color)',
          display: activeConvo && isMobile ? 'none' : 'flex'
        }} className="chat-sidebar">
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <h2 style={{ margin: 0, fontSize: '1.3rem' }}>{t('chat.messages')}</h2>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Direct Agents & Owners</p>
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
                  
                  {/* Quick Contact Actions */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <a 
                      href={`https://wa.me/${convo.phone.replace(/\+/g, '')}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(37, 211, 102, 0.1)', color: '#25D366', fontSize: '0.7rem', textDecoration: 'none', fontWeight: 600 }}
                    >
                      WhatsApp
                    </a>
                    <a 
                      href={`tel:${convo.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      style={{ padding: '4px 8px', borderRadius: '4px', background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', fontSize: '0.7rem', textDecoration: 'none', fontWeight: 600 }}
                    >
                      Call
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Window */}
        <div style={{ 
          flex: 1, 
          display: !activeConvo && isMobile ? 'none' : 'flex', 
          flexDirection: 'column', 
          overflow: 'hidden',
          background: 'var(--bg-secondary)'
        }}>
          {activeConvo ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {/* Chat Header */}
              <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--bg-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => setActiveConvo(null)} style={{ display: isMobile ? 'flex' : 'none', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><ArrowLeft /></button>
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
                <a 
                  href={`https://wa.me/${activeConvo.phone.replace(/\+/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary" 
                  style={{ background: '#25D366', border: 'none', textDecoration: 'none', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '20px', fontSize: '0.85rem' }}
                >
                  <MessageCircle size={16} /> WhatsApp
                </a>
                <a href={`tel:${activeConvo.phone}`} title="Call" className="btn-outline" style={{ textDecoration: 'none', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '20px', fontSize: '0.85rem' }}>
                  <Phone size={16} /> {t('chat.call')}
                </a>
              </div>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.filter(m => m.convoId === activeConvo.id).map(msg => {
                const isMe = msg.senderId === 'me';
                return (
                  <div key={msg.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '75%',
                      background: isMe ? 'var(--primary-color)' : 'rgba(255,255,255,0.07)',
                      color: isMe ? 'white' : 'var(--text-main)',
                      padding: '0.85rem 1.2rem',
                      borderRadius: isMe ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.5 }}>{msg.text}</p>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', marginTop: '6px' }}>
                        <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>{formatTime(msg.timestamp)}</span>
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

            {/* Quick Reply Suggestions */}
            <div style={{ padding: '0.5rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem', overflowX: 'auto', background: 'rgba(255,255,255,0.02)' }}>
              {['Is this still available?', 'Can I visit today?', 'What is the price?', 'Send me more photos', 'I am interested'].map(q => (
                <button key={q} onClick={() => { setNewMessage(q); }} style={{ padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--border-color)', background: 'rgba(16,185,129,0.08)', color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: 0 }}>{q}</button>
              ))}
            </div>

            {/* Message Input */}
            <div style={{ padding: '1.2rem 1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.8rem', alignItems: 'center', background: 'var(--bg-color)' }}>
              <button className="glass" style={{ width: '42px', height: '42px', borderRadius: '50%', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <Image size={20} />
              </button>
              <input
                type="text"
                placeholder={t('chat.placeholder')}
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                style={{ flex: 1, padding: '0.85rem 1.5rem', borderRadius: '30px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', outline: 'none', fontSize: '1rem' }}
              />
              <button
                onClick={sendMessage}
                style={{ background: 'var(--primary-color)', border: 'none', borderRadius: '50%', width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white', boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)' }}
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.03)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={40} strokeWidth={1} />
            </div>
            <p>Select an agent to start a professional conversation</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
