import { Globe, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  
  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--border-color)', background: 'var(--bg-secondary)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">

        {/* About Section */}
        <div style={{ marginBottom: '3rem', padding: '2rem', background: 'rgba(255,255,255,0.02)', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ marginBottom: '1rem' }}>About Us</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '0.5rem' }}>
            NyumbaApp simplifies the process of finding and acquiring plots and houses for rent or purchase in Tanzania. Use our services efficiently and find your choice quickly.
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
            Our platform serves to connect customers with sellers or brokers of houses and plots, to ease the process of acquiring accommodation. We provide verified listings, GPS-based search, visit booking, and anti-scam protection.
          </p>
        </div>

        <div className="footer-content" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
          
          {/* Plots Column */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Plots</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/search?type=plot" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Residential Plots</Link></li>
              <li><Link to="/search?type=plot&intent=commercial" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Commercial Plots</Link></li>
              <li><Link to="/search?type=farm" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Farms</Link></li>
              <li><Link to="/search?type=plot&installment=true" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Pay by Installments</Link></li>
            </ul>
          </div>

          {/* Houses Column */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Houses</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/search?type=room&intent=rent" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Houses for Rent</Link></li>
              <li><Link to="/search?type=house&intent=buy" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Houses for Sale</Link></li>
              <li><Link to="/search?type=retail" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Retail Space</Link></li>
              <li><Link to="/search?type=office" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Office Space</Link></li>
            </ul>
          </div>

          {/* Contacts Column */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Contacts</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><a href="https://wa.me/255692184008" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}><MessageCircle size={14} /> WhatsApp</a></li>
              <li><a href="tel:+255692184008" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Phone size={14} /> +255 692 184 008</a></li>
              <li><a href="mailto:info@nyumbaapp.com" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Mail size={14} /> info@nyumbaapp.com</a></li>
              <li><a href="https://instagram.com/nyumbaapp" target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '6px' }}><Globe size={14} /> Instagram</a></li>
            </ul>
          </div>
          
          {/* More Column */}
          <div className="footer-col" style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{ fontSize: '1rem', marginBottom: '1rem' }}>More</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link to="/search" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Find by Location</Link></li>
              <li><Link to="/about" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>About Us</Link></li>
              <li><Link to="/support" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Support</Link></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Privacy Policy</a></li>
              <li><a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>Terms of Service</a></li>
            </ul>
          </div>
          
        </div>

        {/* Language Toggle */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content' }}>
          <Globe size={16} color="var(--text-muted)" />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Language :</span>
          <a href="#" style={{ color: 'var(--primary-color)', fontWeight: 600, fontSize: '0.85rem' }}>English</a>
          <span style={{ color: 'var(--text-muted)' }}>|</span>
          <a href="#" style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Swahili</a>
        </div>
        
        <div className="footer-bottom" style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>© {new Date().getFullYear()} NyumbaApp Tanzania. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy Policy</a>
            <a href="#" style={{ color: 'var(--text-muted)' }}>Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
