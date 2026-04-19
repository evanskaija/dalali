import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Moon, Sun, Globe, LogOut, MessageSquare, ShieldCheck, Bookmark, HelpCircle, Menu, X, MapPin, Plus } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { NotificationBell } from './NotificationBell';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-content">
        <Link to="/" className="nav-logo" style={{ marginRight: '3rem' }}>
          <img src="/assets/logo.png" alt="Nyumba App" style={{ height: '40px', objectFit: 'contain' }} />
          <span>Nyumba<span className="text-gradient">App</span></span>
        </Link>
        
        <button 
          className="mobile-menu-btn" 
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ color: menuOpen ? 'var(--danger)' : 'var(--text-main)' }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Home size={20} /> {t('nav.home')}
          </Link>
          <Link 
            to="/seeker-search" 
            className={`nav-link ${location.pathname === '/seeker-search' ? 'active' : ''}`}
            style={{ 
              background: '#10b981', 
              color: 'white', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.2)',
              transition: 'all 0.3s ease'
            }}
          >
            <MapPin size={20} color="white" /> {t('nav.search')}
          </Link>
          <Link to="/chat" className={`nav-link ${location.pathname === '/chat' ? 'active' : ''}`}>
            <MessageSquare size={20} /> {t('nav.chat')}
          </Link>
          <Link to="/saved" className={`nav-link ${location.pathname === '/saved' ? 'active' : ''}`}>
            <Bookmark size={20} /> {t('nav.saved')}
          </Link>
          <Link to="/support" className={`nav-link ${location.pathname === '/support' ? 'active' : ''}`}>
            <HelpCircle size={20} /> {t('nav.support')}
          </Link>
          
          {(!user || user.role === 'agent' || user.role === 'landlord') && (
            <Link 
              to="/add" 
              style={{ 
                background: '#3b82f6', 
                color: 'white', 
                padding: '0.6rem 1.2rem', 
                borderRadius: '12px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                textDecoration: 'none', 
                fontWeight: 700,
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.2)'
              }}
            >
              <Plus size={20} /> {t('nav.post')}
            </Link>
          )}
          
          <div className="nav-actions">
            <button 
              onClick={toggleLanguage} 
              style={{ 
                padding: '0.5rem 0.8rem', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                border: '1px solid var(--border-color)',
                color: 'var(--primary-color)',
                background: 'rgba(79, 70, 229, 0.1)',
                fontWeight: 800,
                fontSize: '0.75rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                minWidth: '85px',
                justifyContent: 'center'
              }} 
              title={language === 'en' ? 'Switch to Swahili' : 'Badili kwenda Kiingereza'}
            >
              <Globe size={16} color="var(--primary-color)" />
              <span>{language === 'en' ? 'EN' : 'SW'}</span>
            </button>
            
            <button 
              onClick={toggleTheme} 
              style={{ 
                padding: '0.5rem 0.8rem', 
                borderRadius: '20px', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                border: '1px solid var(--border-color)',
                color: theme === 'dark' ? '#fbbf24' : '#6366f1',
                background: theme === 'dark' ? 'rgba(251, 191, 36, 0.15)' : 'rgba(99, 102, 241, 0.1)',
                fontWeight: 800,
                fontSize: '0.75rem',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                boxShadow: theme === 'dark' ? '0 0 15px rgba(251, 191, 36, 0.2)' : 'none',
                minWidth: '85px',
                justifyContent: 'center'
              }} 
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={16} fill="#fbbf24" />
                  <span>LIGHT</span>
                </>
              ) : (
                <>
                  <Moon size={16} fill="#6366f1" />
                  <span>DARK</span>
                </>
              )}
            </button>

            <NotificationBell />

            {user && (
              <Link to="/admin" title="Admin" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', textDecoration: 'none' }}>
                <ShieldCheck size={18} />
              </Link>
            )}

            {user ? (
              <button onClick={logout} className="btn-outline flex items-center gap-2" style={{ marginLeft: '0.5rem', cursor: 'pointer', border: 'none', background: 'transparent' }}>
                <LogOut size={18} /> {user.name}
              </button>
            ) : (
              <Link to="/login" className="btn-outline flex items-center gap-2" style={{ textDecoration: 'none', marginLeft: '0.5rem' }}>
                <User size={18} /> {t('nav.login')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
