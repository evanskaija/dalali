import React, { useState, useEffect } from 'react';
import { Navbar } from '../components/Navbar';
import { PropertyCard } from '../components/PropertyCard';
import { Trash2, Bookmark, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProperties } from '../contexts/PropertyContext';
import type { Property } from '../mockData/properties';

export const SavedProperties: React.FC = () => {
  const { properties } = useProperties();
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [savedProperties, setSavedProperties] = useState<Property[]>([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_properties') || '[]');
    setSavedIds(saved);
  }, []);

  useEffect(() => {
    setSavedProperties(properties.filter(p => savedIds.includes(p.id)));
  }, [savedIds, properties]);

  const removeSaved = (id: string) => {
    const updated = savedIds.filter(sid => sid !== id);
    setSavedIds(updated);
    localStorage.setItem('saved_properties', JSON.stringify(updated));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '100px' }}>
      <Navbar />
      <div className="container" style={{ flex: 1, padding: '2rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
          <Bookmark size={32} color="var(--primary-color)" />
          <h1 style={{ margin: 0 }}>Saved <span className="text-gradient">Properties</span></h1>
        </div>

        {savedProperties.length === 0 ? (
          <div className="glass" style={{ textAlign: 'center', padding: '5rem 2rem', borderRadius: 'var(--border-radius)' }}>
            <HomeIcon size={64} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: '1.5rem' }} />
            <h3>No saved properties yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Start exploring the map to find your favorite rooms and houses!</p>
            <Link to="/search" className="btn-primary" style={{ textDecoration: 'none', padding: '1rem 2rem' }}>
              Explore Map
            </Link>
          </div>
        ) : (
          <div className="property-grid">
            {savedProperties.map((property, idx) => (
              <div key={property.id} style={{ position: 'relative' }}>
                <PropertyCard property={property} index={idx} />
                <button 
                  onClick={() => removeSaved(property.id)}
                  style={{ 
                    position: 'absolute', 
                    top: '15px', 
                    right: '15px', 
                    background: 'rgba(239,68,68,0.9)', 
                    color: 'white', 
                    border: 'none', 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '50%', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 10,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
                  }}
                  title="Remove from saved"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
