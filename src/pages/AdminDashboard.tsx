import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Users, Home as HomeIcon, AlertTriangle, CheckCircle, XCircle, TrendingUp, Eye, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';


interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'pending' | 'blocked';
  joinedDate: string;
  listings: number;
}

const mockUsers: UserRecord[] = [
  { id: 'u1', name: 'Juma Hassan', email: 'juma@gmail.com', role: 'Agent', status: 'active', joinedDate: '2024-01-15', listings: 12 },
  { id: 'u2', name: 'Fatma Said', email: 'fatma@gmail.com', role: 'Landlord', status: 'pending', joinedDate: '2024-03-20', listings: 3 },
  { id: 'u3', name: 'Baraka Mushi', email: 'baraka@gmail.com', role: 'Agent', status: 'active', joinedDate: '2024-02-10', listings: 20 },
  { id: 'u4', name: 'Neema John', email: 'neema@gmail.com', role: 'Tenant', status: 'active', joinedDate: '2024-04-01', listings: 0 },
  { id: 'u5', name: 'Ahmed Ali', email: 'ahmed@gmail.com', role: 'Agent', status: 'blocked', joinedDate: '2024-01-05', listings: 35 },
];

interface FraudAlert {
  id: string;
  user: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
  date: string;
}

const mockFraudAlerts: FraudAlert[] = [
  { id: 'f1', user: 'Ahmed Ali', reason: '35 listings posted in 24 hours', severity: 'high', date: 'Today 09:11 AM' },
  { id: 'f2', user: 'Unknown User', reason: 'Same phone number used in 5 accounts', severity: 'high', date: 'Today 07:45 AM' },
  { id: 'f3', user: 'Peter M.', reason: 'Listing price 90% below area average', severity: 'medium', date: 'Yesterday 3:20 PM' },
];

import { useProperties } from '../contexts/PropertyContext';

export const AdminDashboard: React.FC = () => {
  const { properties } = useProperties();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'listings' | 'fraud'>('overview');
  const [users, setUsers] = useState(mockUsers);
  const { t } = useLanguage();

  const updateStatus = (id: string, status: UserRecord['status']) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  const stats = [
    { label: t('admin.totalUsers'), value: users.length, icon: <Users size={24} />, color: '#10b981' },
    { label: t('admin.activeListings'), value: properties.length, icon: <HomeIcon size={24} />, color: '#3b82f6' },
    { label: t('admin.fraudAlerts'), value: mockFraudAlerts.filter(f => f.severity === 'high').length, icon: <AlertTriangle size={24} />, color: '#ef4444' },
    { label: t('admin.pendingKyc'), value: users.filter(u => u.status === 'pending').length, icon: <Shield size={24} />, color: '#f59e0b' },
  ];

  const tabStyle = (tab: string) => ({
    padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
    background: activeTab === tab ? 'var(--primary-color)' : 'transparent',
    color: activeTab === tab ? 'white' : 'var(--text-muted)',
    fontWeight: activeTab === tab ? 700 : 400,
    transition: 'all 0.2s',
  });

  const statusBadge = (status: UserRecord['status']) => {
    const colors: Record<string, string> = { active: '#10b981', pending: '#f59e0b', blocked: '#ef4444' };
    return <span style={{ background: colors[status] + '20', color: colors[status], padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600, textTransform: 'capitalize' }}>{status}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '76px' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '1200px', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>{t('admin.dashboard')}</h1>
          <p className="text-muted">{t('admin.monitor')}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
          {stats.map((s, i) => (
            <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: s.color + '20', color: s.color, padding: '0.75rem', borderRadius: '12px' }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: '1.8rem', fontWeight: 800 }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.4rem', borderRadius: '10px', width: 'fit-content' }}>
          {(['overview', 'users', 'listings', 'fraud'] as const).map(tab => (
            <button key={tab} style={tabStyle(tab)} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Users Table */}
        {activeTab === 'users' && (
          <div className="glass" style={{ borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)' }}>
                  {['Name', 'Email', 'Role', 'Listings', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} style={{ padding: '1rem', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 600 }}>{u.name}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{u.email}</td>
                    <td style={{ padding: '1rem' }}><span style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--primary-color)', padding: '2px 10px', borderRadius: '12px', fontSize: '0.75rem' }}>{u.role}</span></td>
                    <td style={{ padding: '1rem', textAlign: 'center' }}>{u.listings}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{u.joinedDate}</td>
                    <td style={{ padding: '1rem' }}>{statusBadge(u.status)}</td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => updateStatus(u.id, 'active')} title="Approve" style={{ background: 'rgba(16,185,129,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#10b981' }}><CheckCircle size={16} /></button>
                        <button onClick={() => updateStatus(u.id, 'blocked')} title="Block" style={{ background: 'rgba(239,68,68,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#ef4444' }}><XCircle size={16} /></button>
                        <button title="View" style={{ background: 'rgba(59,130,246,0.1)', border: 'none', borderRadius: '8px', padding: '6px', cursor: 'pointer', color: '#3b82f6' }}><Eye size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Fraud Alerts */}
        {activeTab === 'fraud' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockFraudAlerts.map(alert => (
              <div key={alert.id} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: `4px solid ${alert.severity === 'high' ? '#ef4444' : alert.severity === 'medium' ? '#f59e0b' : '#3b82f6'}` }}>
                <AlertTriangle size={28} color={alert.severity === 'high' ? '#ef4444' : alert.severity === 'medium' ? '#f59e0b' : '#3b82f6'} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{alert.user}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{alert.reason}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{alert.date}</div>
                </div>
                <span style={{ background: alert.severity === 'high' ? '#ef444420' : '#f59e0b20', color: alert.severity === 'high' ? '#ef4444' : '#f59e0b', padding: '4px 12px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase' }}>{alert.severity}</span>
                <button style={{ background: '#ef444420', border: 'none', color: '#ef4444', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Block User</button>
              </div>
            ))}
          </div>
        )}

        {/* Overview */}
        {activeTab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><TrendingUp size={20} color="var(--primary-color)" /> Platform Health</h3>
              {[
                { label: 'Active Agents', val: '3 / ' + users.filter(u => u.role === 'Agent').length, color: '#10b981' },
                { label: 'Pending Verifications', val: users.filter(u => u.status === 'pending').length, color: '#f59e0b' },
                { label: 'Blocked Users', val: users.filter(u => u.status === 'blocked').length, color: '#ef4444' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontWeight: 700, color: item.color }}>{item.val}</span>
                </div>
              ))}
            </div>
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><AlertTriangle size={20} color="#ef4444" /> Recent Alerts</h3>
              {mockFraudAlerts.slice(0, 3).map(a => (
                <div key={a.id} style={{ display: 'flex', gap: '12px', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)', alignItems: 'center' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: a.severity === 'high' ? '#ef4444' : '#f59e0b', flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{a.user}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.reason}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
