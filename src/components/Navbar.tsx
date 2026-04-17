import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Moon, Sun, Globe, LogOut, MessageSquare, ShieldCheck, Bookmark, HelpCircle, Menu, X } from 'lucide-react';
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
          <Home className="text-gradient" size={28} />
          <span>Dalali<span className="text-gradient">App</span></span>
        </Link>
        
        <button className="mobile-menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            <Home size={20} /> {t('nav.home')}
          </Link>
          <Link to="/search" className={`nav-link ${location.pathname === '/search' ? 'active' : ''}`}>
            <MapPin size={20} /> {t('nav.search')}
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
          
          {(!user || user.role === 'agent') && (
            <Link to="/add" className="btn-primary" style={{ marginTop: 'auto' }}>
              <Plus size={20} /> {t('nav.post')}
            </Link>
          )}
          
          <div className="nav-actions">
            <button onClick={toggleLanguage} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex' }} title={language === 'en' ? 'Switch to Swahili' : 'Badili kwenda Kiingereza'}>
              <Globe size={18} />
              <span style={{ fontSize: '0.7rem', fontWeight: 'bold', marginLeft: '4px' }}>{language.toUpperCase()}</span>
            </button>
            
            <button onClick={toggleTheme} className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', display: 'flex' }} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
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
