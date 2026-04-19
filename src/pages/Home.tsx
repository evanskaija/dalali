import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, X, Zap, Clock, Layers, Smartphone, UploadCloud, Globe, PiggyBank, Crosshair, TrendingUp, CheckCircle, ShieldAlert, ShieldCheck } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { PropertyCard } from '../components/PropertyCard';
import { useProperties } from '../contexts/PropertyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Footer } from '../components/Footer';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { properties } = useProperties();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/search');
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/search?type=${category.toLowerCase()}`);
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-overlay"></div>
        
        <div className="container">
          <div className="hero-content animate-fade-in-up">
            <h1>{t('hero.title.1')}<span className="text-gradient">Nyumba</span> {t('hero.title.2')}</h1>
            <p>
              {t('hero.subtitle')}
            </p>
            
            <form className="search-box glass" onSubmit={handleSearch}>
              <div className="search-input-group">
                <MapPin size={20} className="text-muted" />
                <input 
                  type="text" 
                  name="q"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('hero.searchPlaceholder')} 
                  required
                />
                {searchQuery && (
                  <button 
                    type="button" 
                    onClick={() => setSearchQuery('')}
                    style={{ 
                      background: 'rgba(239, 68, 68, 0.15)', 
                      border: '1px solid rgba(239, 68, 68, 0.2)', 
                      color: '#ef4444', 
                      cursor: 'pointer', 
                      display: 'flex', 
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '6px',
                      borderRadius: '50%',
                      marginRight: '8px'
                    }}
                  >
                    <X size={14} strokeWidth={3} />
                  </button>
                )}
              </div>
              <button type="submit" className="btn-primary">
                <Search size={20} />
                {t('hero.searchBtn')}
              </button>
            </form>

            <div style={{ marginTop: '1rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                Direct Access: What are you looking for?
              </p>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: window.innerWidth < 768 ? 'repeat(2, 1fr)' : 'repeat(auto-fit, minmax(140px, 1fr))', 
                gap: '12px',
                width: '100%'
              }}>
                {[
                  { id: 'room', label: t('cat.rooms'), icon: '🛏️' },
                  { id: 'master-room', label: t('cat.masterRoom'), icon: '🏡' },
                  { id: 'house', label: t('cat.fullHouse'), icon: '🏢' },
                  { id: 'apartment', label: t('cat.apartments'), icon: '🏢' },
                  { id: 'plot', label: t('cat.plots'), icon: '🗺️' },
                  { id: 'hall', label: t('cat.halls'), icon: '🎭' }
                ].map((cat) => (
                  <button 
                    key={cat.id} 
                    onClick={() => handleCategoryClick(cat.id)}
                    className="glass-card" 
                    style={{
                      padding: '1.2rem 0.75rem',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      border: '1px solid rgba(255,255,255,0.08)',
                      background: 'rgba(255,255,255,0.04)',
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }}
                  >
                    <span style={{ fontSize: '1.75rem' }}>{cat.icon}</span>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-main)', textAlign: 'center', lineHeight: 1.2 }}>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Properties Section */}
      <section className="properties-section container">
        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
          <h2>{t('home.nearby').split(' ')[0]} <span className="text-gradient">{t('home.nearby').split(' ').slice(1).join(' ')}</span></h2>
          <Link to="/search" className="btn-outline" style={{ textDecoration: 'none' }}>{t('home.viewAll')}</Link>
        </div>
        
        <div className="property-grid">
          {properties.length > 0 ? (
            properties.slice(0, 6).map((property, idx) => (
              <PropertyCard key={property.id} property={property} index={idx} />
            ))
          ) : (
            <div className="glass" style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--border-radius)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏠</div>
              <h3>No properties listed yet</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Be the first one to post a room or house in your area!</p>
              <Link to="/post" className="btn-primary" style={{ textDecoration: 'none', display: 'inline-block' }}>{t('nav.post')}</Link>
            </div>
          )}
        </div>
      </section>

      {/* AI Smart Recommendations */}
      <section style={{ padding: '3rem 0', background: 'rgba(16,185,129,0.03)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #10b981, #059669)', padding: '10px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.2rem' }}>🤖</span>
            </div>
            <div>
              <h2 style={{ margin: 0 }}>{t('home.aiRecs')}</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>Based on your search history and budget preference</p>
            </div>
          </div>
          {properties.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {properties.slice(0, 3).map((p, i) => {
                const scores = [98, 94, 91];
                const reasons = ['Matches your budget', 'Near your searched area', 'Popular this week'];
                return (
                  <div key={p.id} className="glass" style={{ borderRadius: 'var(--border-radius)', overflow: 'hidden', position: 'relative', border: '1px solid rgba(16,185,129,0.2)' }}>
                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary-color)', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, zIndex: 2 }}>
                      {scores[i]}% Match
                    </div>
                    <img src={p.images[0]} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                    <div style={{ padding: '1rem' }}>
                      <div style={{ fontWeight: 700, marginBottom: '4px', fontSize: '0.95rem' }}>{p.title}</div>
                      <div style={{ color: 'var(--primary-color)', fontWeight: 700, marginBottom: '6px' }}>TZS {p.price.toLocaleString()}/mo</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#10b981', background: 'rgba(16,185,129,0.08)', padding: '4px 10px', borderRadius: '20px', width: 'fit-content' }}>
                        ✓ {reasons[i]}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: 'var(--border-radius)', border: '1px dashed var(--primary-color)' }}>
              <p style={{ color: 'var(--text-muted)', margin: 0 }}>Smart matches will appear here once you start exploring properties.</p>
            </div>
          )}
        </div>
      </section>

      {/* Heatmap Hot Areas */}
      <section className="container" style={{ padding: '3rem 1.5rem' }}>
        <h2 style={{ marginBottom: '0.5rem' }}>🔥 {t('home.trending')}</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Most searched locations in Dar es Salaam this week</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {[
            { name: 'Mikocheni', searches: 1420, heat: 100 },
            { name: 'Kijitonyama', searches: 1180, heat: 83 },
            { name: 'Sinza', searches: 980, heat: 69 },
            { name: 'Masaki', searches: 870, heat: 61 },
            { name: 'Mbezi Beach', searches: 760, heat: 54 },
            { name: 'Ubungo', searches: 640, heat: 45 },
            { name: 'Kigamboni', searches: 520, heat: 37 },
            { name: 'Oyster Bay', searches: 410, heat: 29 },
          ].map(area => (
            <Link
              key={area.name}
              to={`/search?q=${area.name}`}
              style={{
                textDecoration: 'none',
                background: `rgba(239,68,68,${area.heat / 300})`,
                border: `1px solid rgba(239,68,68,${area.heat / 200})`,
                padding: '0.6rem 1.2rem',
                borderRadius: '30px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: area.heat > 70 ? '#ef4444' : 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.88rem',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{area.name}</span>
              <span style={{ background: 'rgba(0,0,0,0.15)', padding: '1px 6px', borderRadius: '10px', fontSize: '0.72rem' }}>{area.searches.toLocaleString()}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Ratings Snapshot */}
      <section style={{ padding: '3rem 0', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>{t('home.reviews')}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {[
              { name: 'Amina J.', rating: 5, text: 'Dalali app imenisaidia kupata chumba kwa muda mfupi sana. GPS system ni bora!', location: 'Kijitonyama' },
              { name: 'Peter M.', rating: 5, text: 'The escrow payment system gave me confidence. I paid and moved in safely.', location: 'Mikocheni' },
              { name: 'Rehema S.', rating: 4, text: 'Kupata dalali halisi kwenye ramani ni jambo zuri. Ninapendekeza!', location: 'Sinza' },
            ].map((r, i) => (
              <div key={i} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '1rem' }}>
                  {Array.from({ length: r.rating }).map((_, si) => (
                    <span key={si} style={{ color: '#fbbf24', fontSize: '1rem' }}>★</span>
                  ))}
                  {Array.from({ length: 5 - r.rating }).map((_, si) => (
                    <span key={si} style={{ color: 'var(--border-color)', fontSize: '1rem' }}>★</span>
                  ))}
                </div>
                <p style={{ margin: '0 0 1rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6, fontStyle: 'italic' }}>"{r.text}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), #059669)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>
                    {r.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{r.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{r.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Nyumba */}
      <section style={{ padding: '4rem 0', background: 'var(--bg-color)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2>Why Choose <span className="text-gradient">Nyumba</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>The smart way to find, rent, and sell properties in Tanzania</p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: <Clock size={24} />, title: 'Easy Access to Properties', desc: 'No need to walk around physically. Saves time and transport costs.', color: '#3b82f6' },
              { icon: <Layers size={24} />, title: 'Wide Variety of Listings', desc: 'Covers many locations and price ranges. Good for users with different budgets.', color: '#10b981' },
              { icon: <CheckCircle size={24} />, title: 'Simple to Use', desc: 'Basic interface and no complicated steps. Even people with low tech skills can use it.', color: '#f59e0b' },
              { icon: <UploadCloud size={24} />, title: 'Fast Posting for Sellers', desc: 'Agents and owners can upload properties quickly. Encourages many listings.', color: '#ef4444' },
              { icon: <Globe size={24} />, title: 'Large Audience Reach', desc: 'Properties get seen by many people online. Better exposure than traditional system.', color: '#8b5cf6' },
              { icon: <PiggyBank size={24} />, title: 'Free or Low Cost', desc: 'Often cheaper than hiring agents traditionally. Attractive to both buyers and sellers.', color: '#14b8a6' },
              { icon: <Crosshair size={24} />, title: 'Central Marketplace', desc: 'Brings buyers and sellers into one place. Reduces randomness of searching.', color: '#f97316' },
              { icon: <Smartphone size={24} />, title: 'Mobile Friendly', desc: 'Works beautifully on phones. Highly accessible to the majority of users.', color: '#ec4899' },
              { icon: <TrendingUp size={24} />, title: 'Real Estate Digitization', desc: 'Moves housing search from offline to online. Important step for tech growth.', color: '#0ea5e9' }
            ].map((feature, idx) => (
              <div key={idx} className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)', display: 'flex', gap: '1rem', alignItems: 'flex-start', transition: 'transform 0.3s ease', border: '1px solid rgba(255,255,255,0.05)' }} onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ background: `${feature.color}15`, color: feature.color, padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {feature.icon}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem', color: 'var(--text-main)' }}>{feature.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The Problem We Solve (Old Way vs Nyumba Way) */}
      <section style={{ padding: '5rem 0', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container" style={{ padding: '0 1.5rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem', maxWidth: '800px', margin: '0 auto 3rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>We Fixed the Broken System</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>
              Traditional property hunting in Tanzania lacks trust, transparency, and security. We built <span className="text-gradient" style={{ fontWeight: 800 }}>Nyumba</span> to be the complete, secure solution you deserve.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            
            {/* The Old Way (Competitors/Traditional) */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', borderTop: '4px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#ef444420', padding: '12px', borderRadius: '12px' }}><ShieldAlert size={28} color="#ef4444" /></div>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>The Old Way</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'No Verification', desc: 'Anyone can post. High risk of scams and fake ads.' },
                  { title: 'Dalali Dependency', desc: 'Hidden fees, duplicate listings, and high broker reliance.' },
                  { title: 'Poor Communication', desc: 'Forced to use phone calls or WhatsApp outside the platform.' },
                  { title: 'Inaccurate Locations', desc: 'No GPS. Just general area names making comparison hard.' },
                  { title: 'Zero Accountability', desc: 'No ratings or reviews for agents or landlords.' },
                  { title: 'Insecure Transactions', desc: 'Everything happens offline with no protection.' },
                  { title: 'Limited Innovation', desc: 'Just a basic "listing board" that doesn\'t hold user attention.' }
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <X size={20} color="#ef4444" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.title}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* The Nyumba Way */}
            <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius-lg)', borderTop: '4px solid #10b981', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', background: 'var(--primary-color)', opacity: 0.1, filter: 'blur(40px)', borderRadius: '50%' }}></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <div style={{ background: '#10b98120', padding: '12px', borderRadius: '12px' }}><ShieldCheck size={28} color="#10b981" /></div>
                <h3 style={{ margin: 0, fontSize: '1.5rem' }}>The Nyumba Way</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'Strong Verification', desc: 'Verified owners and agents with anti-scam protection.' },
                  { title: 'Direct Transparency', desc: 'Direct connections with real owners and clean, unique listings.' },
                  { title: 'In-App Ecosystem', desc: 'Built-in chat, digital bookings, and secure scheduling.' },
                  { title: 'Precise GPS Tracking', desc: 'Exact locations on an interactive map for easy comparison.' },
                  { title: 'Community Ratings', desc: 'Rate and review agents/sellers for complete accountability.' },
                  { title: 'Secure Transactions', desc: 'In-app escrow support to protect your money.' },
                  { title: 'Smart Search Intelligence', desc: 'AI-driven recommendations tailored to your budget.' }
                ].map((item, idx) => (
                  <li key={idx} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                    <CheckCircle size={20} color="#10b981" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <div>
                      <strong style={{ display: 'block', color: 'var(--text-main)', fontSize: '0.95rem' }}>{item.title}</strong>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{item.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container" style={{ padding: '6rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>{t('home.howItWorks')}</h2>
        
        <div className="flex justify-center gap-8" style={{ flexWrap: 'wrap' }}>
          <div className="glass p-6 text-center" style={{ flex: '1', minWidth: '300px', padding: '2rem', borderRadius: 'var(--border-radius)' }}>
            <div style={{ background: 'var(--accent-glow)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Search size={28} style={{ color: 'white' }} />
            </div>
            <h3>{t('home.step1.title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{t('home.step1.desc')}</p>
          </div>
          
          <div className="glass p-6 text-center" style={{ flex: '1', minWidth: '300px', padding: '2rem', borderRadius: 'var(--border-radius)' }}>
            <div style={{ background: 'var(--accent-glow)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Building size={28} style={{ color: 'white' }} />
            </div>
            <h3>{t('home.step2.title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{t('home.step2.desc')}</p>
          </div>
          
          <div className="glass p-6 text-center" style={{ flex: '1', minWidth: '300px', padding: '2rem', borderRadius: 'var(--border-radius)' }}>
            <div style={{ background: 'var(--accent-glow)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <Zap size={28} style={{ color: 'white' }} />
            </div>
            <h3>{t('home.step3.title')}</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{t('home.step3.desc')}</p>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};
