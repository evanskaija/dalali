import React, { useState, useRef, useEffect } from 'react';
import { Bell, Home as HomeIcon, Calendar, CreditCard, Settings, X, CheckCheck } from 'lucide-react';
import { useNotifications } from '../contexts/NotificationContext';

export const NotificationBell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, markAllRead, markRead } = useNotifications();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const typeIcon = (type: string) => {
    const style = { flexShrink: 0 };
    if (type === 'property') return <HomeIcon size={16} color="#10b981" style={style} />;
    if (type === 'booking') return <Calendar size={16} color="#3b82f6" style={style} />;
    if (type === 'payment') return <CreditCard size={16} color="#f59e0b" style={style} />;
    return <Settings size={16} color="#8b5cf6" style={style} />;
  };

  const timeAgo = (date: Date) => {
    const diff = Math.floor((Date.now() - date.getTime()) / 1000);
    if (diff < 60) return 'just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', position: 'relative' }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', background: '#ef4444', color: 'white', borderRadius: '50%', width: '18px', height: '18px', fontSize: '0.65rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid var(--bg-color)' }}>
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '48px', right: 0, width: '360px',
          background: 'var(--bg-color)', border: '1px solid var(--border-color)',
          borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          zIndex: 9999, overflow: 'hidden'
        }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontWeight: 700, fontSize: '1rem' }}>Notifications</span>
              {unreadCount > 0 && <span style={{ marginLeft: '8px', background: '#ef4444', color: 'white', borderRadius: '12px', padding: '1px 8px', fontSize: '0.72rem', fontWeight: 700 }}>{unreadCount} new</span>}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {unreadCount > 0 && (
                <button onClick={markAllRead} title="Mark all read" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                  <CheckCheck size={14} /> All read
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}><X size={16} /></button>
            </div>
          </div>

          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No notifications yet</div>
            ) : notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markRead(n.id)}
                style={{
                  padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', cursor: 'pointer',
                  background: n.read ? 'transparent' : 'rgba(16,185,129,0.04)',
                  borderBottom: '1px solid var(--border-color)',
                  borderLeft: n.read ? '3px solid transparent' : '3px solid var(--primary-color)',
                  transition: 'background 0.2s'
                }}
              >
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px' }}>{typeIcon(n.type)}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: n.read ? 500 : 700, fontSize: '0.88rem', marginBottom: '3px' }}>{n.title}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>{n.message}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '5px' }}>{timeAgo(n.createdAt)}</div>
                </div>
                {!n.read && <div style={{ width: '8px', height: '8px', background: 'var(--primary-color)', borderRadius: '50%', marginTop: '4px', flexShrink: 0 }} />}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
