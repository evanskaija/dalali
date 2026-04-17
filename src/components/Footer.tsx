import React from 'react';
import { Home, Mail, Phone, MapPin, Share2, Globe, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  
  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div className="footer-content" style={{ display: 'grid', gridTemplateColumns: 'minmax(250px, 2fr) repeat(auto-fit, minmax(180px, 1fr))', gap: '3rem' }}>
          
          <div className="footer-col">
            <Link to="/" className="nav-logo" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
              <Home className="text-gradient" size={28} />
              <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>Dalali<span className="text-gradient">App</span></span>
            </Link>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', paddingRight: '1rem' }}>
              The smartest and safest way to find, rent, and manage property in Tanzania. Verified agents, escrow protection, and real-time map discovery.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <a href="#" className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Facebook"><Globe size={18} /></a>
              <a href="#" className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Instagram"><Share2 size={18} /></a>
              <a href="#" className="btn-outline" style={{ padding: '0.5rem', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Twitter"><Share2 size={18} /></a>
            </div>
          </div>
          
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Services</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><Link to="/residential" style={{ color: 'var(--text-muted)' }}>Residential Property</Link></li>
              <li><Link to="/commercial" style={{ color: 'var(--text-muted)' }}>Commercial Leases</Link></li>
              <li><Link to="/plots" style={{ color: 'var(--text-muted)' }}>Plots & Land</Link></li>
              <li><Link to="/short-stays" style={{ color: 'var(--text-muted)' }}>Short-Term Stays</Link></li>
              <li><Link to="/escrow" style={{ color: 'var(--text-muted)' }}>Escrow Services</Link></li>
              <li><Link to="/cities" style={{ color: 'var(--text-muted)' }}>Cities</Link></li>
            </ul>
          </div>
          
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Partner with us</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><Link to="/partner/dalali" style={{ color: 'var(--text-muted)' }}>Register as a Dalali</Link></li>
              <li><Link to="/partner/landlord" style={{ color: 'var(--text-muted)' }}>Register as a Landlord</Link></li>
              <li><Link to="/partner/agency" style={{ color: 'var(--text-muted)' }}>Register as an Agency</Link></li>
              <li><Link to="/franchise" style={{ color: 'var(--text-muted)' }}>Franchise</Link></li>
              <li><Link to="/business" style={{ color: 'var(--text-muted)' }}>Business Accounts</Link></li>
            </ul>
          </div>
          
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Company</h4>
            <ul className="footer-links" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <li><Link to="/about" style={{ color: 'var(--text-muted)' }}>About Us</Link></li>
              <li><Link to="/careers" style={{ color: 'var(--text-muted)' }}>Careers</Link></li>
              <li><Link to="/sustainability" style={{ color: 'var(--text-muted)' }}>Sustainability at DalaliApp</Link></li>
              <li><Link to="/press" style={{ color: 'var(--text-muted)' }}>Press</Link></li>
              <li><Link to="/blog" style={{ color: 'var(--text-muted)' }}>Blog</Link></li>
              <li><Link to="/brand" style={{ color: 'var(--text-muted)' }}>Brand Guidelines</Link></li>
            </ul>
          </div>
          
        </div>
        
        <div className="footer-bottom" style={{ marginTop: '4rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>© {new Date().getFullYear()} DalaliApp Tanzania. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
