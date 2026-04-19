import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { DAR_LOCATIONS } from '../mockData/locations';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, MapPin, ChevronRight, Home, Building, LayoutGrid, Map as MapIcon, Theater, BedDouble } from 'lucide-react';

export const SearchPortal: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStreet, setSelectedStreet] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const categories = [
    { id: 'room', label: t('cat.rooms'), icon: <BedDouble size={24} />, description: language === 'en' ? 'Private room in a shared compound' : 'Chumba binafsi kwenye fensi' },
    { id: 'master-room', label: t('cat.masterRoom'), icon: <Home size={24} />, description: language === 'en' ? 'Ensuite room with private bath' : 'Chumba chenye choo ndani' },
    { id: 'house', label: t('cat.fullHouse'), icon: <Building size={24} />, description: language === 'en' ? 'Entire house for families' : 'Nyumba nzima kwa ajili ya familia' },
    { id: 'apartment', label: t('cat.apartments'), icon: <LayoutGrid size={24} />, description: language === 'en' ? 'Modern multi-unit complexes' : 'Majengo ya kisasa ya kupanga' },
    { id: 'plot', label: t('cat.plots'), icon: <MapIcon size={24} />, description: language === 'en' ? 'Open land and development plots' : 'Viwanja na maeneo ya wazi' },
    { id: 'hall', label: t('cat.halls'), icon: <Theater size={24} />, description: language === 'en' ? 'Spaces for events and functions' : 'Kumbi kwa ajili ya sherehe' }
  ];

  const { language } = useLanguage();

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    setStep(2);
  };

  const handleFinalSearch = () => {
    if (selectedCategory && selectedStreet) {
      navigate(`/search?type=${selectedCategory}&q=${selectedStreet}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', position: 'relative' }}>
      <Navbar />
      
      {/* Background decoration */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '40%', height: '40%', background: 'var(--primary-color)', opacity: 0.1, filter: 'blur(150px)', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '40%', height: '40%', background: 'var(--accent-color)', opacity: 0.1, filter: 'blur(150px)', zIndex: 0 }}></div>

      <div className="container" style={{ flex: 1, marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 1, paddingBottom: '4rem' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{t('search.title')}</h1>
          <p className="text-muted" style={{ fontSize: '1.1rem' }}>{t('search.step')} {step} {t('search.of')} 2: {step === 1 ? t('search.selectCategory') : t('search.selectLocation')}</p>
        </div>

        {step === 1 ? (
          <div className="animate-fade-in-up" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '1000px' }}>
            {categories.map((cat) => (
              <div 
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className="glass-card"
                style={{
                  padding: '2rem',
                  borderRadius: '24px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = 'var(--primary-color)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                }}
              >
                <div style={{ 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '16px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  marginBottom: '1.5rem',
                  color: 'var(--primary-color)'
                }}>
                  {cat.icon}
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{cat.label}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>{cat.description}</p>
                <div style={{ position: 'absolute', bottom: '20px', right: '20px', color: 'var(--primary-color)', opacity: 0.5 }}>
                  <ChevronRight size={24} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="animate-fade-in-up" style={{ width: '100%', maxWidth: '600px' }}>
            <div className="glass" style={{ padding: '2.5rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <button onClick={() => setStep(1)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', padding: 0, fontWeight: 600 }}>← {t('search.changeCategory')}</button>
                <button 
                  onClick={() => navigate('/')} 
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', cursor: 'pointer', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600 }}
                >
                  {t('common.cancel')}
                </button>
              </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('search.generalInfo')}</h3>
                <p className="text-muted" style={{ marginBottom: '1.5rem' }}>{language === 'en' ? 'Search in:' : 'Tafuta katika:'} {categories.find(c => c.id === selectedCategory)?.label}</p>
                
                <label style={{ display: 'block', marginBottom: '0.6rem', fontWeight: 600, fontSize: '0.9rem' }}>{t('search.streetName')}</label>
              </div>

              <div style={{ position: 'relative', marginBottom: '2rem' }}>
                <MapPin size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary-color)' }} />
                <select 
                  value={selectedStreet}
                  onChange={(e) => setSelectedStreet(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    borderRadius: '12px',
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid var(--border-color)',
                    color: 'white',
                    fontSize: '1rem',
                    appearance: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="">{t('search.selectStreet')}</option>
                  {['Kinondoni', 'Ilala', 'Temeke', 'Ubungo', 'Kigamboni'].map(dist => (
                    <optgroup key={dist} label={dist}>
                      {DAR_LOCATIONS.filter(l => l.district === dist).map(loc => (
                        <option key={loc.name} value={loc.name}>{loc.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              <button 
                onClick={handleFinalSearch}
                disabled={!selectedStreet}
                className="btn-primary"
                style={{ width: '100%', padding: '1.25rem', fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', opacity: !selectedStreet ? 0.5 : 1 }}
              >
                <Search size={20} />
                {t('search.showAll')} {categories.find(c => c.id === selectedCategory)?.label}
              </button>
            </div>
            
            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <p className="text-muted">Want to see everything on the map first?</p>
              <button onClick={() => navigate('/search')} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}>Skip to Full Map</button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
