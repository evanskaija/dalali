import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Mail, Lock, User, AlertCircle, CheckCircle, Phone, Search, PlusCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useProperties } from '../contexts/PropertyContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const forcedRole = queryParams.get('role'); // 'agent' or 'tenant'

  const [isAgent, setIsAgent] = useState(forcedRole === 'agent');
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const { t } = useLanguage();
  const { login, register } = useAuth();
  const { refreshAgents } = useProperties();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    if (isSignUp) {
      const role = isAgent ? 'agent' : 'tenant';
      const result = register({ name, phone, email, role, password });
      
      if (result.success) {
        setSuccess(result.message);
        // Important: Refresh agents in context so the new agent shows up immediately
        if (role === 'agent') await refreshAgents();
        setIsSignUp(false);
        setEmailOrPhone(email);
      } else {
        setError(result.message);
      }
      setIsLoading(false);
    } else {
      const result = login(emailOrPhone, password);
      setIsLoading(false);

      if (result.success) {
        const from = (location.state as any)?.from?.pathname || (result.user?.role === 'agent' || result.user?.role === 'landlord' ? '/add' : '/seeker-search');
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    }
  };

  return (
    <div className="login-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', position: 'relative', overflow: 'hidden' }}>
      <Navbar />
      
      <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '80px', padding: '2rem 1rem' }}>
        <div className="glass animate-fade-in-up" style={{ width: '100%', maxWidth: '480px', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p className="text-muted">
              {forcedRole === 'agent' ? 'Sign in to list your properties' : 
               forcedRole === 'tenant' ? 'Sign in to start searching' : 
               'Choose your path to get started'}
            </p>
          </div>

          {/* TWO PATHS SELECTOR - Only show if no forced role */}
          {!forcedRole && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
            <div 
              onClick={() => setIsAgent(false)}
              style={{
                padding: '1.25rem',
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'center',
                border: `2px solid ${!isAgent ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)'}`,
                background: !isAgent ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <Search size={24} color={!isAgent ? 'var(--primary-color)' : 'var(--text-muted)'} style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: !isAgent ? 'white' : 'var(--text-muted)' }}>Searching</div>
            </div>

            <div 
              onClick={() => setIsAgent(true)}
              style={{
                padding: '1.25rem',
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'center',
                border: `2px solid ${isAgent ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)'}`,
                background: isAgent ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                transition: 'all 0.3s ease'
              }}
            >
              <PlusCircle size={24} color={isAgent ? 'var(--primary-color)' : 'var(--text-muted)'} style={{ marginBottom: '8px' }} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isAgent ? 'white' : 'var(--text-muted)' }}>Listing</div>
            </div>
          </div>
          )}

          {forcedRole && (
            <div style={{ marginBottom: '2rem', textAlign: 'center', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', color: 'var(--primary-color)', fontWeight: 700 }}>
                {forcedRole === 'agent' ? <PlusCircle size={20} /> : <Search size={20} />}
                {forcedRole === 'agent' ? 'AGENT / OWNER ACCOUNT' : 'PROPERTY SEEKER ACCOUNT'}
              </div>
            </div>
          )}

          {success && <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.75rem', borderRadius: '12px', color: '#10b981', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}><CheckCircle size={16} /> {success}</div>}
          {error && <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '12px', color: '#f87171', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}><AlertCircle size={16} /> {error}</div>}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {isSignUp && (
              <>
                <div className="search-input-group">
                  <User size={18} className="text-muted" />
                  <input type="text" placeholder={t('login.fullName')} value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="search-input-group">
                  <Phone size={18} className="text-muted" />
                  <input type="tel" placeholder={t('login.phone')} value={phone} onChange={(e) => setPhone(e.target.value)} required />
                </div>
                <div className="search-input-group">
                  <Mail size={18} className="text-muted" />
                  <input type="email" placeholder={t('login.email')} value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </>
            )}

            {!isSignUp && (
              <div className="search-input-group">
                <Mail size={18} className="text-muted" />
                <input type="text" placeholder={t('login.emailOrPhone')} value={emailOrPhone} onChange={(e) => setEmailOrPhone(e.target.value)} required />
              </div>
            )}
            
            <div className="search-input-group">
              <Lock size={18} className="text-muted" />
              <input type="password" placeholder={t('login.password')} value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1.1rem', fontWeight: 700, opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Verifying...' : (isSignUp ? 'Join as ' + (isAgent ? 'Agent' : 'Tenant') : 'Sign In')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.95rem' }}>
            <span className="text-muted">{isSignUp ? t('login.alreadyHave') : t('login.dontHave')}</span>
            <button type="button" onClick={() => { setIsSignUp(!isSignUp); setError(null); }} style={{ background: 'none', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', padding: '0 0 0 6px', textDecoration: 'underline' }}>{isSignUp ? t('login.logIn') : t('login.signUp')}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
