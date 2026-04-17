import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Mail, Lock, User, Home as HomeIcon, ChevronRight, ShieldCheck, AlertCircle, CheckCircle, Phone } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

/**
 * PRODUCTION-STYLE SECURE LOGIN
 * Features: Unique Constraints (Phone/Email), Isolated Sessions, Identity Search
 */
export const Login: React.FC = () => {
  // Page State
  const [isAgent, setIsAgent] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form Fields State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState(''); // For unified login
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { t } = useLanguage();
  const { login, register } = useAuth();

  // SECURE AUTH FLOW (Isolated per user)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    setTimeout(() => {
      if (isSignUp) {
        const role = isAgent ? 'agent' : 'tenant';
        const result = register({ name, phone, email, role, password });
        setIsLoading(false);

        if (result.success) {
          setSuccess(result.message);
          setIsSignUp(false);
          // Set login field to help user
          setEmailOrPhone(email);
        } else {
          setError(result.message);
        }
      } else {
        // AUTHENTICATION FLOW: Verify Credentials against Hash/DB
        const result = login(emailOrPhone, password);
        setIsLoading(false);

        if (result.success) {
          // ROLE ISOLATION: Dashboard navigation based on identity
          if (result.user?.role === 'agent' || result.user?.role === 'landlord') {
            navigate('/add'); 
          } else {
            navigate('/search');
          }
        } else {
          setError(result.message);
        }
      }
    }, 1200);
  };

  return (
    <div className="login-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', position: 'relative', overflow: 'hidden' }}>
      <Navbar />
      
      <div className="blob blob-1" style={{ top: '-10%', right: '-10%', width: '400px', height: '400px', opacity: 0.1, background: 'var(--primary-color)' }}></div>
      <div className="blob blob-2" style={{ bottom: '-10%', left: '-10%', width: '300px', height: '300px', opacity: 0.05, background: '#ef4444' }}></div>

      <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '80px', padding: '2rem 1rem' }}>
        <div className="glass animate-fade-in-up" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', position: 'relative' }}>
          
          <div style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.7rem', fontWeight: 700, opacity: 0.8 }}>
            <ShieldCheck size={14} /> SECURED
          </div>
          
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, var(--primary-color) 0%, #818cf8 100%)', width: '64px', height: '64px', borderRadius: '20px', marginBottom: '1.25rem', color: 'white', boxShadow: '0 10px 15px -3px var(--accent-glow)' }}>
              {isAgent ? <HomeIcon size={32} /> : <User size={32} />}
            </div>
            <h2>{isSignUp ? t('login.createAccount') : t('login.welcome')}</h2>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>{isAgent ? 'Strict Identity Check Required' : 'Find your perfect home'}</p>
          </div>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '0.35rem', marginBottom: '1.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
            <button type="button" onClick={() => { setIsAgent(false); setError(null); }} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: !isAgent ? 'var(--primary-color)' : 'transparent', color: 'white', fontWeight: 600, transition: 'all 0.3s ease-out' }}>{t('login.tenant')}</button>
            <button type="button" onClick={() => { setIsAgent(true); setError(null); }} style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', background: isAgent ? 'var(--primary-color)' : 'transparent', color: 'white', fontWeight: 600, transition: 'all 0.3s ease-out' }}>{t('login.dalali')}</button>
          </div>

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

            <button type="submit" className="btn-primary" disabled={isLoading} style={{ width: '100%', padding: '1rem', marginTop: '1rem', fontSize: '1rem', opacity: isLoading ? 0.7 : 1 }}>
              {isLoading ? 'Hashing & Verifying...' : (isSignUp ? t('login.signUp') : t('login.logIn'))}
              {!isLoading && <ChevronRight size={18} style={{ marginLeft: '4px' }} />}
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
