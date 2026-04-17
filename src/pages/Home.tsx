import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Building, Activity } from 'lucide-react';
import { Navbar } from '../components/Navbar';
import { PropertyCard } from '../components/PropertyCard';
import { useProperties } from '../contexts/PropertyContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Footer } from '../components/Footer';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { properties } = useProperties();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const q = formData.get('q');
    if (q) {
      navigate(`/search?q=${encodeURIComponent(q.toString())}`);
    } else {
      navigate('/search');
    }
  };

  const handleCategoryClick = (category: string) => {
    // Navigate to specialized pages instead of just search
    if (['rooms', 'master-room', 'houses', 'apartments'].includes(category)) {
      navigate('/residential');
    } else if (category === 'plots') {
      navigate('/plots');
    } else if (category === 'halls') {
      navigate('/search?type=hall'); // Lead to search as specific landing for halls
    } else {
      navigate(`/search?type=${category.toLowerCase()}`);
    }
  };

  return (
    <>
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-image-bg"></div>
        <div className="hero-overlay"></div>
        <div className="blob blob-1"></div>
        
        <div className="container">
          <div className="hero-content animate-fade-in-up">
            <h1>{t('hero.title.1')}<span className="text-gradient">{t('hero.title.2')}</span></h1>
            <p>
              {t('hero.subtitle')}
            </p>
            
            <form className="search-box glass" onSubmit={handleSearch}>
              <div className="search-input-group">
                <MapPin size={20} className="text-muted" />
                <input 
                  type="text" 
                  name="q"
                  placeholder={t('hero.searchPlaceholder')} 
                  required
                />
              </div>
              <button type="submit" className="btn-primary" style={{ height: '100%', padding: '0 2rem' }}>
                <Search size={20} />
                {t('hero.searchBtn')}
              </button>
            </form>
            
            <div className="flex gap-4" style={{ marginTop: '2rem' }}>
              <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)' }}>
                <Activity size={18} className="text-gradient" />
                <span style={{ fontSize: '0.9rem' }}>500+ {t('hero.addedToday')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories quick filter */}
      <section className="container" style={{ padding: '3rem 1.5rem 0' }}>
        <div className="flex gap-4" style={{ overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
          {[
            { id: 'rooms', label: t('cat.rooms') },
            { id: 'master-room', label: t('cat.masterRoom') },
            { id: 'houses', label: t('cat.fullHouse') },
            { id: 'apartments', label: t('cat.apartments') },
            { id: 'plots', label: t('cat.plots') },
            { id: 'halls', label: t('cat.halls') }
          ].map((cat, i) => (
            <button 
              key={i} 
              onClick={() => handleCategoryClick(cat.id)}
              className="glass" 
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '30px',
                whiteSpace: 'nowrap',
                color: i === 0 ? 'var(--primary-color)' : 'var(--text-main)',
                border: i === 0 ? '1px solid var(--primary-color)' : '',
                fontWeight: i === 0 ? 600 : 400
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* Properties Section */}
      <section className="properties-section container">
        <div className="flex justify-between items-center" style={{ marginBottom: '1rem' }}>
          <h2>{t('home.nearby').split(' ')[0]} <span className="text-gradient">{t('home.nearby').split(' ').slice(1).join(' ')}</span></h2>
          <Link to="/search" className="btn-outline" style={{ textDecoration: 'none' }}>{t('home.viewAll')}</Link>
        </div>
        
        <div className="property-grid">
          {properties.slice(0, 6).map((property, idx) => (
            <PropertyCard key={property.id} property={property} index={idx} />
          ))}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
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
              <Activity size={28} style={{ color: 'white' }} />
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
