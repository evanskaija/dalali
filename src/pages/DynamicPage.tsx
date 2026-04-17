import React from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { ArrowLeft, Home, Building2, MapPin, Clock, Shield, Globe, Users, Briefcase, Landmark, Leaf, FileText, Zap, PenTool, ChevronRight, CheckCircle, TrendingUp, Heart, Award, Mail, BookOpen, Target, Lightbulb, Handshake, BedDouble, Bath, Car, Star } from 'lucide-react';
import { useProperties } from '../contexts/PropertyContext';
import { PropertyCard } from '../components/PropertyCard';
import { PropertyDetailsModal } from '../components/PropertyDetailsModal';
import type { Property } from '../mockData/properties';

// ─── Shared section styles ────────────────────────────────────────────────
const sectionStyle: React.CSSProperties = { padding: '4rem 0' };
const cardGrid: React.CSSProperties = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' };
const glassCard: React.CSSProperties = { padding: '2rem', borderRadius: '16px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' };
const iconCircle = (bg: string): React.CSSProperties => ({ width: '60px', height: '60px', borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem' });

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Residential Property
// ═══════════════════════════════════════════════════════════════════════════
const ResidentialPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#10b981,#059669)')}><Home size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Residential <span className="text-gradient">Property</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        From single rooms in Sinza to luxury apartments in Masaki — find your ideal home across Dar es Salaam and beyond.
      </p>
    </section>
    <section style={sectionStyle}>
      <h2 style={{ marginBottom: '2rem' }}>What we offer</h2>
      <div style={cardGrid}>
        {[
          { icon: <Home size={24} color="#10b981" />, title: 'Single Rooms', desc: 'Affordable single rooms across all major neighborhoods. Verified listings with GPS.' },
          { icon: <Building2 size={24} color="#3b82f6" />, title: 'Master Rooms', desc: 'Self-contained master bedrooms with ensuite bathrooms. Premium finishes.' },
          { icon: <Landmark size={24} color="#f59e0b" />, title: 'Full Houses', desc: 'Stand-alone 2-5 bedroom houses with parking, garden, and security.' },
          { icon: <Building2 size={24} color="#8b5cf6" />, title: 'Apartments', desc: 'Modern apartments in high-rise and low-rise buildings, pools, gyms & more.' },
        ].map((item, i) => (
          <div key={i} className="glass" style={glassCard}>
            <div style={iconCircle('rgba(16,185,129,0.1)')}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
    <section style={sectionStyle}>
      <div className="glass" style={{ ...glassCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.5rem' }}>Ready to find your home?</h2>
          <p style={{ color: 'var(--text-muted)' }}>Search thousands of verified listings on our interactive map.</p>
        </div>
        <Link to="/search" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem' }}>Browse Properties <ChevronRight size={18} /></Link>
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Commercial Leases
// ═══════════════════════════════════════════════════════════════════════════
const CommercialPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#3b82f6,#1d4ed8)')}><Briefcase size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Commercial <span className="text-gradient">Leases</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Office spaces, retail shops, warehouses, and co-working desks — all verified and ready for business.
      </p>
    </section>
    <section style={sectionStyle}>
      <div style={cardGrid}>
        {[
          { title: 'Office Spaces', desc: 'Modern offices in CBDs. Fiber internet, conference rooms, 24/7 access.', stat: '120+ listings' },
          { title: 'Retail & Shops', desc: 'High-traffic storefronts in malls and arterial roads.', stat: '85+ listings' },
          { title: 'Warehouses', desc: 'Secure storage and industrial space across the port corridor.', stat: '40+ listings' },
          { title: 'Co-Working', desc: 'Flexible hot desks and private offices in shared spaces.', stat: '30+ listings' },
        ].map((item, i) => (
          <div key={i} className="glass" style={glassCard}>
            <div style={{ color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.8rem', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{item.stat}</div>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Plots & Land
// ═══════════════════════════════════════════════════════════════════════════
const PlotsPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#f59e0b,#d97706)')}><MapPin size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Plots & <span className="text-gradient">Land</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Investment-grade plots and compounds across Dar es Salaam, Dodoma, Arusha, and more. All with title deed verification.
      </p>
    </section>
    <section style={sectionStyle}>
      <h2 style={{ marginBottom: '2rem' }}>Why buy land through DalaliApp?</h2>
      <div style={cardGrid}>
        {[
          { icon: <Shield size={24} color="#10b981" />, title: 'Title Deed Verified', desc: 'Every plot listing includes verified ownership documents and survey plans.' },
          { icon: <MapPin size={24} color="#3b82f6" />, title: 'GPS Boundary Maps', desc: 'See exact plot boundaries on our satellite map before you visit.' },
          { icon: <Shield size={24} color="#f59e0b" />, title: 'Escrow Protection', desc: 'Pay through our escrow system. Money released only after deed transfer.' },
          { icon: <TrendingUp size={24} color="#8b5cf6" />, title: 'Market Valuations', desc: 'AI-powered price analysis comparing similar plots within 5km.' },
        ].map((item, i) => (
          <div key={i} className="glass" style={glassCard}>
            <div style={iconCircle('rgba(245,158,11,0.1)')}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
    <section style={sectionStyle}>
      <div className="glass" style={{ ...glassCard, textAlign: 'center' }}>
        <h2>Browse available plots</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Over 200 verified plots across 8 major cities.</p>
        <Link to="/search?type=plots" className="btn-primary" style={{ textDecoration: 'none' }}>View Plots on Map</Link>
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Short-Term Stays
// ═══════════════════════════════════════════════════════════════════════════
const ShortStaysPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#ec4899,#db2777)')}><Clock size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Short-Term <span className="text-gradient">Stays</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Furnished apartments and guest houses for daily, weekly, or monthly stays. Perfect for business travelers, tourists, and relocators.
      </p>
    </section>
    <section style={sectionStyle}>
      <div style={cardGrid}>
        {[
          { title: 'Daily Rentals', desc: 'Fully furnished rooms from TZS 50,000/night. Hotel alternative with kitchen access.', price: 'From 50K/night' },
          { title: 'Weekly Packages', desc: 'Discounted weekly rates. Cleaning service, WiFi, and utilities included.', price: 'From 250K/week' },
          { title: 'Monthly Furnished', desc: 'No commitment. Move-in ready apartments with all furniture and appliances.', price: 'From 800K/month' },
        ].map((item, i) => (
          <div key={i} className="glass" style={glassCard}>
            <div style={{ color: '#ec4899', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{item.price}</div>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Escrow Services
// ═══════════════════════════════════════════════════════════════════════════
const EscrowPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#10b981,#059669)')}><Shield size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Escrow <span className="text-gradient">Services</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Protect your money. Our escrow system holds your payment securely until you've verified the property and moved in successfully.
      </p>
    </section>
    <section style={sectionStyle}>
      <h2 style={{ marginBottom: '2rem' }}>How it works</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        {[
          { step: '1', title: 'Agree on Price', desc: 'Negotiate directly with the landlord or agent through the app.' },
          { step: '2', title: 'Deposit to Escrow', desc: 'Pay securely via M-Pesa, bank transfer, or card. Funds are held by DalaliApp.' },
          { step: '3', title: 'Verify & Move In', desc: 'Visit the property. Confirm it matches the listing description.' },
          { step: '4', title: 'Release Payment', desc: 'Once you approve, the money is released to the landlord. If not, you get a refund.' },
        ].map((item, i) => (
          <div key={i} className="glass" style={{ ...glassCard, textAlign: 'center' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.2rem', fontWeight: 800 }}>{item.step}</div>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
    <section style={sectionStyle}>
      <div className="glass" style={{ ...glassCard, background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <Shield size={48} color="#10b981" />
          <div>
            <h3 style={{ marginBottom: '0.5rem' }}>100% Money-Back Guarantee</h3>
            <p style={{ color: 'var(--text-muted)' }}>If the property doesn't match the listing, you receive a full refund within 48 hours. No questions asked.</p>
          </div>
        </div>
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Cities
// ═══════════════════════════════════════════════════════════════════════════
const CitiesPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#6366f1,#4f46e5)')}><Globe size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Our <span className="text-gradient">Cities</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        DalaliApp is live across Tanzania's fastest-growing urban areas. Browse properties in your city.
      </p>
    </section>
    <section style={sectionStyle}>
      <div style={cardGrid}>
        {[
          { city: 'Dar es Salaam', listings: '2,400+', areas: 'Mikocheni, Masaki, Sinza, Kijitonyama, Mbezi Beach' },
          { city: 'Dodoma', listings: '450+', areas: 'CBD, Nzuguni, Chamwino, Miyuji' },
          { city: 'Arusha', listings: '380+', areas: 'Njiro, Sakina, Tengeru, Sanawari' },
          { city: 'Mwanza', listings: '290+', areas: 'Nyamagana, Ilemela, Pasiansi, Capri Point' },
          { city: 'Zanzibar', listings: '200+', areas: 'Stone Town, Bububu, Mbweni, Fumba' },
          { city: 'Mbeya', listings: '180+', areas: 'Forest Area, Sisimba, Uyole, Nzovwe' },
        ].map((item, i) => (
          <Link key={i} to={`/search?q=${item.city}`} className="glass" style={{ ...glassCard, textDecoration: 'none', color: 'inherit', transition: 'all 0.3s ease' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>{item.city}</h3>
            <div style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '0.5rem' }}>{item.listings} listings</div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.areas}</p>
          </Link>
        ))}
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Partner Registration (Dalali / Landlord / Agency)
// ═══════════════════════════════════════════════════════════════════════════
const PartnerPage = ({ type }: { type: string }) => {
  const roles: Record<string, { title: string; desc: string; benefits: string[] }> = {
    dalali: {
      title: 'Register as a Dalali',
      desc: 'Join our network of verified property agents. Get leads, manage listings, and earn commissions — all from your phone.',
      benefits: ['Receive tenant leads in real-time', 'GPS-verified listings boost trust', 'In-app commission tracking', 'Priority customer support', 'Performance badges & ratings'],
    },
    landlord: {
      title: 'Register as a Landlord',
      desc: 'List your properties directly. No middleman fees. Manage tenants, collect rent, and track occupancy from your dashboard.',
      benefits: ['List unlimited properties for free', 'Direct tenant communication', 'Escrow rent collection', 'Occupancy analytics dashboard', 'Maintenance request system'],
    },
    agency: {
      title: 'Register as an Agency',
      desc: 'Scale your real estate agency on DalaliApp. Manage multiple agents, bulk-list properties, and access enterprise analytics.',
      benefits: ['Multi-agent management portal', 'Bulk property upload via CSV', 'Branded agency profile page', 'Enterprise-grade analytics', 'Dedicated account manager'],
    },
  };
  const role = roles[type] || roles.dalali;

  return (
    <>
      <section style={{ ...sectionStyle, textAlign: 'center' }}>
        <div style={iconCircle('linear-gradient(135deg,#10b981,#059669)')}><Users size={28} color="white" /></div>
        <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>{role.title.split(' ').slice(0, -1).join(' ')} <span className="text-gradient">{role.title.split(' ').pop()}</span></h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>{role.desc}</p>
      </section>
      <section style={sectionStyle}>
        <h2 style={{ marginBottom: '2rem' }}>Benefits</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          {role.benefits.map((b, i) => (
            <div key={i} className="glass" style={{ ...glassCard, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <CheckCircle size={24} color="#10b981" />
              <span style={{ fontSize: '1rem' }}>{b}</span>
            </div>
          ))}
        </div>
      </section>
      <section style={sectionStyle}>
        <div className="glass" style={{ ...glassCard, textAlign: 'center', background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <h2 style={{ marginBottom: '1rem' }}>Get Started Today</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Create your account and start listing properties within minutes.</p>
          <Link to="/login" className="btn-primary" style={{ textDecoration: 'none', padding: '0.8rem 2rem' }}>Create Account <ChevronRight size={18} /></Link>
        </div>
      </section>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Franchise
// ═══════════════════════════════════════════════════════════════════════════
const FranchisePage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#f59e0b,#d97706)')}><Award size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>DalaliApp <span className="text-gradient">Franchise</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Own a DalaliApp franchise in your city. Leverage our technology, brand, and training to build a profitable property management business.
      </p>
    </section>
    <section style={sectionStyle}>
      <h2 style={{ marginBottom: '2rem' }}>Franchise Package Includes</h2>
      <div style={cardGrid}>
        {[
          { icon: <Target size={24} color="#f59e0b" />, title: 'Exclusive Territory', desc: 'Operate as the sole DalaliApp franchise partner in your designated city or region.' },
          { icon: <BookOpen size={24} color="#3b82f6" />, title: 'Full Training', desc: '2-week intensive training covering operations, sales, agent recruitment, and technology.' },
          { icon: <Zap size={24} color="#10b981" />, title: 'Technology Stack', desc: 'Access to our full platform: admin panel, agent apps, analytics, and payment systems.' },
          { icon: <Handshake size={24} color="#8b5cf6" />, title: 'Ongoing Support', desc: 'Dedicated franchise success manager, quarterly reviews, and national marketing campaigns.' },
        ].map((item, i) => (
          <div key={i} className="glass" style={glassCard}>
            <div style={iconCircle('rgba(245,158,11,0.1)')}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
    <section style={sectionStyle}>
      <div className="glass" style={{ ...glassCard, textAlign: 'center' }}>
        <h2>Interested in franchising?</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Contact our business development team to learn about investment requirements and ROI projections.</p>
        <a href="mailto:franchise@dalaliapp.co.tz" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Mail size={18} /> franchise@dalaliapp.co.tz</a>
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Business Accounts
// ═══════════════════════════════════════════════════════════════════════════
const BusinessPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#6366f1,#4f46e5)')}><Briefcase size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Business <span className="text-gradient">Accounts</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Enterprise solutions for companies needing employee housing, corporate relocations, or bulk property management.
      </p>
    </section>
    <section style={sectionStyle}>
      <div style={cardGrid}>
        {[
          { title: 'Corporate Housing', desc: 'Find and manage staff accommodation. Centralized billing and lease management.', icon: <Building2 size={24} color="#6366f1" /> },
          { title: 'Relocation Services', desc: 'Seamless employee relocations with curated shortlists and virtual tours.', icon: <MapPin size={24} color="#10b981" /> },
          { title: 'Bulk Management', desc: 'Manage 50+ properties from a single dashboard. Automated rent collection.', icon: <TrendingUp size={24} color="#f59e0b" /> },
        ].map((item, i) => (
          <div key={i} className="glass" style={glassCard}>
            <div style={iconCircle('rgba(99,102,241,0.1)')}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
    <section style={sectionStyle}>
      <div className="glass" style={{ ...glassCard, textAlign: 'center' }}>
        <h2>Request a Demo</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Our enterprise team will walk you through a personalized demo of DalaliApp Business.</p>
        <a href="mailto:business@dalaliapp.co.tz" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Mail size={18} /> business@dalaliapp.co.tz</a>
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: About Us
// ═══════════════════════════════════════════════════════════════════════════
const AboutPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#10b981,#059669)')}><Globe size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>About <span className="text-gradient">DalaliApp</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Founded in 2024, DalaliApp is Tanzania's fastest-growing property technology platform. We connect tenants directly with verified landlords and agents, eliminating fraud and making house hunting effortless.
      </p>
    </section>
    <section style={sectionStyle}>
      <h2 style={{ marginBottom: '2rem' }}>Our Mission & Values</h2>
      <div style={cardGrid}>
        {[
          { icon: <Target size={24} color="#10b981" />, title: 'Our Mission', desc: 'To make finding and renting property in Africa as simple, transparent, and safe as ordering food online.' },
          { icon: <Heart size={24} color="#ef4444" />, title: 'Trust First', desc: 'Every agent is KYC-verified. Every listing is GPS-confirmed. Every payment is escrow-protected.' },
          { icon: <Lightbulb size={24} color="#f59e0b" />, title: 'Innovation', desc: 'We use AI for price analysis, real-time agent tracking, and smart property matching to serve you better.' },
          { icon: <Users size={24} color="#3b82f6" />, title: 'Community', desc: 'Over 50,000 active users, 5,000 verified agents, and 15,000 listings across 6 Tanzanian cities.' },
        ].map((item, i) => (
          <div key={i} className="glass" style={glassCard}>
            <div style={iconCircle('rgba(16,185,129,0.1)')}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
    <section style={sectionStyle}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', textAlign: 'center' }}>
        {[
          { num: '50K+', label: 'Active Users' },
          { num: '15K+', label: 'Property Listings' },
          { num: '5K+', label: 'Verified Agents' },
          { num: '6', label: 'Cities in Tanzania' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{ ...glassCard, textAlign: 'center' }}>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary-color)' }}>{s.num}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Careers
// ═══════════════════════════════════════════════════════════════════════════
const CareersPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#8b5cf6,#7c3aed)')}><Briefcase size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Join Our <span className="text-gradient">Team</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Help us revolutionize real estate in Africa. We're looking for passionate individuals who want to make a real impact.
      </p>
    </section>
    <section style={sectionStyle}>
      <h2 style={{ marginBottom: '2rem' }}>Open Positions</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          { title: 'Senior React Developer', dept: 'Engineering', loc: 'Dar es Salaam / Remote', type: 'Full-time' },
          { title: 'Product Designer (UI/UX)', dept: 'Design', loc: 'Dar es Salaam', type: 'Full-time' },
          { title: 'Marketing Manager – East Africa', dept: 'Marketing', loc: 'Dar es Salaam', type: 'Full-time' },
          { title: 'Field Operations Lead', dept: 'Operations', loc: 'Dodoma', type: 'Full-time' },
          { title: 'Data Analyst', dept: 'Data Science', loc: 'Remote', type: 'Contract' },
          { title: 'Customer Success Agent', dept: 'Support', loc: 'Dar es Salaam', type: 'Full-time' },
        ].map((job, i) => (
          <div key={i} className="glass" style={{ ...glassCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.3rem' }}>{job.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{job.dept} • {job.loc} • {job.type}</p>
            </div>
            <a href={`mailto:careers@dalaliapp.co.tz?subject=Application: ${job.title}`} className="btn-outline" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '0.5rem 1.2rem' }}>Apply <ChevronRight size={16} /></a>
          </div>
        ))}
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Sustainability
// ═══════════════════════════════════════════════════════════════════════════
const SustainabilityPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#10b981,#059669)')}><Leaf size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Sustainability at <span className="text-gradient">DalaliApp</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        We're committed to building a greener, more sustainable future for Tanzania's housing sector.
      </p>
    </section>
    <section style={sectionStyle}>
      <div style={cardGrid}>
        {[
          { icon: <Leaf size={24} color="#10b981" />, title: 'Paperless Operations', desc: 'All contracts, receipts, and communications are digital. We save over 2 million sheets of paper per year.' },
          { icon: <Globe size={24} color="#3b82f6" />, title: 'Reduced Travel', desc: 'Virtual tours and GPS-verified listings reduce unnecessary property visits by 60%.' },
          { icon: <Home size={24} color="#f59e0b" />, title: 'Green Buildings', desc: 'We flag energy-efficient properties and promote solar-powered listings.' },
          { icon: <Heart size={24} color="#ef4444" />, title: 'Community Impact', desc: '1% of every transaction goes to affordable housing initiatives in underserved communities.' },
        ].map((item, i) => (
          <div key={i} className="glass" style={glassCard}>
            <div style={iconCircle('rgba(16,185,129,0.1)')}>{item.icon}</div>
            <h3>{item.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Press
// ═══════════════════════════════════════════════════════════════════════════
const PressPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#3b82f6,#1d4ed8)')}><FileText size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Press & <span className="text-gradient">Media</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Latest news, press releases, and media resources about DalaliApp.
      </p>
    </section>
    <section style={sectionStyle}>
      <h2 style={{ marginBottom: '2rem' }}>Recent Coverage</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {[
          { date: 'Apr 2026', title: 'DalaliApp Raises $2M Seed Round Led by East Africa Ventures', source: 'TechCrunch Africa' },
          { date: 'Mar 2026', title: 'How DalaliApp is Fighting Rental Fraud in Dar es Salaam', source: 'The Citizen' },
          { date: 'Feb 2026', title: 'DalaliApp Expands to Dodoma and Arusha', source: 'Daily News Tanzania' },
          { date: 'Jan 2026', title: 'PropTech Startup DalaliApp Hits 50,000 Users', source: 'Disrupt Africa' },
          { date: 'Dec 2025', title: 'The Future of House Hunting in Tanzania is Digital', source: 'Mwananchi' },
        ].map((item, i) => (
          <div key={i} className="glass" style={{ ...glassCard, display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.85rem', minWidth: '80px' }}>{item.date}</div>
            <div style={{ flex: 1 }}>
              <h3 style={{ marginBottom: '0.3rem', fontSize: '1.05rem' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.source}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
    <section style={sectionStyle}>
      <div className="glass" style={{ ...glassCard, textAlign: 'center' }}>
        <h3>Media Inquiries</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>For press inquiries, interviews, and media kits:</p>
        <a href="mailto:press@dalaliapp.co.tz" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}><Mail size={18} /> press@dalaliapp.co.tz</a>
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Blog
// ═══════════════════════════════════════════════════════════════════════════
const BlogPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#ec4899,#db2777)')}><PenTool size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>DalaliApp <span className="text-gradient">Blog</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Market insights, rental tips, and community stories from across Tanzania.
      </p>
    </section>
    <section style={sectionStyle}>
      <div style={cardGrid}>
        {[
          { title: '5 Tips for First-Time Renters in Dar es Salaam', category: 'Guides', date: 'Apr 12, 2026', excerpt: 'Moving to Dar? Here is everything you need to know about deposits, contracts, and red flags.' },
          { title: 'Rental Market Report: Q1 2026', category: 'Market Data', date: 'Apr 5, 2026', excerpt: 'Average rents across Dar es Salaam rose 8% in Q1. Mikocheni and Kijitonyama lead the surge.' },
          { title: 'How GPS Verification Eliminates Fake Listings', category: 'Technology', date: 'Mar 28, 2026', excerpt: 'Learn how our GPS-pinning system ensures every property listing corresponds to a real, verifiable location.' },
          { title: 'Meet Amina: A Dalali Success Story', category: 'Community', date: 'Mar 15, 2026', excerpt: 'From 5 properties to 150 — how one agent built her business entirely through DalaliApp.' },
          { title: 'Understanding Escrow Payments in Tanzania', category: 'Finance', date: 'Mar 1, 2026', excerpt: 'What is escrow? How does it protect you? A complete guide to secure property payments.' },
          { title: 'Best Neighborhoods for Students in Dar', category: 'Lifestyle', date: 'Feb 20, 2026', excerpt: 'Affordable, safe, and close to universities — our top picks for student accommodation.' },
        ].map((post, i) => (
          <div key={i} className="glass" style={{ ...glassCard, cursor: 'pointer' }}>
            <div style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem' }}>{post.category} • {post.date}</div>
            <h3 style={{ marginBottom: '0.8rem', fontSize: '1.1rem' }}>{post.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>{post.excerpt}</p>
          </div>
        ))}
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Brand Guidelines
// ═══════════════════════════════════════════════════════════════════════════
const BrandPage = () => (
  <>
    <section style={{ ...sectionStyle, textAlign: 'center' }}>
      <div style={iconCircle('linear-gradient(135deg,#f59e0b,#d97706)')}><Zap size={28} color="white" /></div>
      <h1 style={{ fontSize: '2.8rem', marginBottom: '1rem' }}>Brand <span className="text-gradient">Guidelines</span></h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto 3rem', lineHeight: 1.7 }}>
        Official DalaliApp brand assets, color palette, typography, and usage rules.
      </p>
    </section>
    <section style={sectionStyle}>
      <h2 style={{ marginBottom: '2rem' }}>Color Palette</h2>
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        {[
          { name: 'Primary Green', hex: '#10b981', desc: 'Main brand color' },
          { name: 'Dark BG', hex: '#0f172a', desc: 'Background' },
          { name: 'Accent Gold', hex: '#fbbf24', desc: 'Premium badges' },
          { name: 'Error Red', hex: '#ef4444', desc: 'Alerts & errors' },
          { name: 'Info Blue', hex: '#3b82f6', desc: 'Links & info' },
        ].map((c, i) => (
          <div key={i} className="glass" style={{ ...glassCard, flex: '1', minWidth: '150px', textAlign: 'center' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: c.hex, margin: '0 auto 1rem', boxShadow: `0 4px 15px ${c.hex}40` }}></div>
            <div style={{ fontWeight: 700, marginBottom: '0.3rem' }}>{c.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{c.hex}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{c.desc}</div>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: '2rem' }}>Typography</h2>
      <div className="glass" style={{ ...glassCard, marginBottom: '3rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>PRIMARY FONT</div>
          <div style={{ fontSize: '2rem', fontWeight: 800 }}>Inter / System UI</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div><span style={{ fontWeight: 400 }}>Regular 400</span></div>
          <div><span style={{ fontWeight: 600 }}>Semibold 600</span></div>
          <div><span style={{ fontWeight: 800 }}>Extra Bold 800</span></div>
        </div>
      </div>

      <h2 style={{ marginBottom: '2rem' }}>Logo Usage</h2>
      <div className="glass" style={{ ...glassCard }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '2rem', fontWeight: 800, marginBottom: '1.5rem' }}>
          <Home size={36} color="#10b981" />
          Dalali<span style={{ color: '#10b981' }}>App</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          {['Always maintain clear space around the logo equal to the height of the "D"', 'Never distort, rotate, or recolor the logo', 'Minimum size: 24px height for digital, 10mm for print', 'Use the green variant on dark backgrounds'].map((rule, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <CheckCircle size={16} color="#10b981" /> {rule}
            </div>
          ))}
        </div>
      </div>
    </section>
  </>
);

// ═══════════════════════════════════════════════════════════════════════════
// PAGE: Property Category Landing
// ═══════════════════════════════════════════════════════════════════════════
const CategoryPage = ({ type, properties }: { type: string, properties: any[] }) => {
  const [selectedProperty, setSelectedProperty] = React.useState<any | null>(null);
  const normalizedType = type === 'rooms' ? 'room' : 
                        type === 'master-room' ? 'master-room' : 
                        type === 'houses' ? 'house' : 
                        type === 'apartments' ? 'apartment' : 
                        type === 'plots' ? 'plot' : 
                        type === 'halls' ? 'hall' : type;

  const categoryProps = properties.filter(p => p.type === normalizedType);
  
  const getCatInfo = () => {
    switch(normalizedType) {
      case 'room': return { title: 'Single Rooms', sub: 'Affordable Living in the City', desc: 'Our single rooms are carefully selected for students and young professionals seeking budget-friendly accommodation without sacrificing basic needs.' };
      case 'master-room': return { title: 'Master Rooms', sub: 'Premium & Self-Contained', desc: 'Experience the perfect balance of privacy and affordability. All master rooms include ensuite bathrooms and premium tiling.' };
      case 'house': return { title: 'Full Houses', sub: 'Spacious Family Homes', desc: 'Stand-alone houses and bungalows designed for comfort. Verified ownership and gated security included.' };
      case 'apartment': return { title: 'Modern Apartments', sub: 'Luxury Urban Lifestyle', desc: 'Secure, modern apartment complexes in premium locations like Masaki and Mikocheni. Features pools, gyms, and 24/7 security.' };
      case 'plot': return { title: 'Kiwanja / Plots', sub: 'Secure Land Investment', desc: 'Surveyed plots and compounds with clear title deeds. Perfect for building your future home or commercial project.' };
      case 'hall': return { title: 'Ukumbi / Halls', sub: 'Premium Event Venues', desc: 'Professional venues for weddings, conferences, and celebrations. High capacity with modern acoustics and AC.' };
      default: return { title: 'Property Listings', sub: 'Available Opportunities', desc: 'Explore our verified property listings across Tanzania.' };
    }
  };

  const info = getCatInfo();

  return (
    <>
      <section style={{ ...sectionStyle, textAlign: 'center' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>{info.title.split(' ')[0]} <span className="text-gradient">{info.title.split(' ').slice(1).join(' ')}</span></h1>
        <p style={{ color: 'var(--primary-color)', fontWeight: 700, fontSize: '1.2rem', marginBottom: '1rem' }}>{info.sub}</p>
        <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto 3rem', lineHeight: 1.7 }}>{info.desc}</p>
      </section>

      <section style={sectionStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h2>Available <span className="text-gradient">Listings</span></h2>
          <div style={{ background: 'rgba(16,185,129,0.1)', color: 'var(--primary-color)', padding: '6px 16px', borderRadius: '30px', fontWeight: 600 }}>
            {categoryProps.length} Results Found
          </div>
        </div>

        {categoryProps.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
            {categoryProps.map((p, i) => (
              <PropertyCard 
                key={p.id} 
                property={p} 
                index={i} 
                onOpenDetails={(prop) => setSelectedProperty(prop)} 
              />
            ))}
          </div>
        ) : (
          <div className="glass" style={{ ...glassCard, textAlign: 'center', padding: '5rem' }}>
            <h3>No specific {info.title} available right now.</h3>
            <p style={{ color: 'var(--text-muted)' }}>Check back soon or browse other categories.</p>
            <Link to="/search" className="btn-primary" style={{ textDecoration: 'none', marginTop: '1.5rem', display: 'inline-block' }}>Visit Map Search</Link>
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}

      {/* Extra Info Section */}
      <section style={sectionStyle}>
        <div className="glass" style={{ ...glassCard, padding: '3rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
            <div>
              <CheckCircle color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.8rem' }}>Verified Map</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Every listing is verified with actual GPS coordinates and street-level validation.</p>
            </div>
            <div>
              <Zap color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.8rem' }}>Direct Reach</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Connect with licensed agents (Dalalis) instantly via Call, SMS, or WhatsApp.</p>
            </div>
            <div>
              <Shield color="var(--primary-color)" style={{ marginBottom: '1rem' }} />
              <h4 style={{ marginBottom: '0.8rem' }}>Escrow Safety</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Payments are protected via our secure escrow system to ensure trust and transparency.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN: DynamicPage Router
// ═══════════════════════════════════════════════════════════════════════════
export const DynamicPage: React.FC = () => {
  const { pathname } = useLocation();
  const { type } = useParams<{ type?: string }>();
  const navigate = useNavigate();
  const { properties } = useProperties();
  const path = pathname.toLowerCase();

  const renderContent = () => {
    // Handle category pages
    if (path.startsWith('/category/') && type) {
      return <CategoryPage type={type} properties={properties} />;
    }

    if (path === '/residential') return <ResidentialPage />;
    if (path === '/commercial') return <CommercialPage />;
    if (path === '/plots') return <PlotsPage />;
    if (path === '/short-stays') return <ShortStaysPage />;
    if (path === '/escrow') return <EscrowPage />;
    if (path === '/cities') return <CitiesPage />;
    if (path.startsWith('/partner')) return <PartnerPage type={type || 'dalali'} />;
    if (path === '/franchise') return <FranchisePage />;
    if (path === '/business') return <BusinessPage />;
    if (path === '/about') return <AboutPage />;
    if (path === '/careers') return <CareersPage />;
    if (path === '/sustainability') return <SustainabilityPage />;
    if (path === '/press') return <PressPage />;
    if (path === '/blog') return <BlogPage />;
    if (path === '/brand') return <BrandPage />;
    return <AboutPage />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '76px' }}>
      <Navbar />
      <div className="container" style={{ flex: 1, padding: '2rem 1.5rem' }}>
        <button
          onClick={() => navigate(-1)}
          className="btn-outline"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', background: 'transparent', marginBottom: '2rem', cursor: 'pointer', color: 'var(--text-muted)' }}
        >
          <ArrowLeft size={18} /> Back
        </button>
        {renderContent()}
      </div>
      <Footer />
    </div>
  );
};
