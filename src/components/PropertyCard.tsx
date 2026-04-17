import React, { useState, useEffect } from 'react';
import type { Property } from '../mockData/properties';
import { MapPin, BedDouble, Bath, Car, Camera, Video, Bookmark, Mail, MessageSquare, MessageCircle } from 'lucide-react';
import { mockAgents } from '../mockData/agents';
import { PropertyDetailsModal } from './PropertyDetailsModal';

interface Props {
  property: Property;
  index: number;
  onOpenDetails?: (p: Property) => void;
}

export const PropertyCard: React.FC<Props> = ({ property, index, onOpenDetails }) => {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('saved_properties') || '[]');
    setIsSaved(saved.includes(property.id));
  }, [property.id]);

  const agent = mockAgents.find(a => a.id === property.agentId);
  
  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agent) {
      window.open(`https://wa.me/${agent.phone.replace(/\+/g, '').replace(/^0+/, '255')}?text=Habari, nimeona nyumba yako (${property.title}) kwenye DalaliApp.`, '_blank');
    }
  };

  const handleSMS = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agent) {
      window.location.href = `sms:${agent.phone}?body=Habari, nimeona nyumba yako (${property.title}) kwenye DalaliApp.`;
    }
  };

  const handleEmail = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (agent && agent.email) {
      window.location.href = `mailto:${agent.email}?subject=Inquiry about ${property.title}`;
    }
  };

  const toggleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    const saved = JSON.parse(localStorage.getItem('saved_properties') || '[]');
    let updated;
    if (isSaved) {
      updated = saved.filter((id: string) => id !== property.id);
    } else {
      updated = [...saved, property.id];
    }
    localStorage.setItem('saved_properties', JSON.stringify(updated));
    setIsSaved(!isSaved);
  };

  return (
    <div 
      className={`property-card animate-fade-in-up delay-${(index % 3 + 1) * 100}`}
      onClick={() => onOpenDetails ? onOpenDetails(property) : null}
      style={{ cursor: 'pointer' }}
    >
      <div className="property-image" style={{ position: 'relative' }}>
        <img src={property.images[0]} alt={property.title} />
        
        {/* Save/Bookmark Button */}
        <button 
          onClick={toggleSave}
          style={{ 
            position: 'absolute', 
            top: '12px', 
            right: '12px', 
            background: isSaved ? 'var(--primary-color)' : 'rgba(0,0,0,0.5)', 
            border: 'none', 
            borderRadius: '50%', 
            width: '36px', 
            height: '36px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            cursor: 'pointer',
            color: 'white',
            backdropFilter: 'blur(4px)',
            transition: 'all 0.3s ease',
            zIndex: 5
          }}
        >
          <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
        </button>

        {/* Media indicators overlay */}
        <div style={{ position: 'absolute', bottom: '10px', left: '10px', display: 'flex', gap: '8px' }}>
          <div style={{ background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)' }}>
            <Camera size={12} /> {property.images.length}
          </div>
          {property.video && (
            <div style={{ background: 'rgba(239, 68, 68, 0.8)', color: 'white', padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', backdropFilter: 'blur(4px)' }}>
              <Video size={12} /> Video
            </div>
          )}
        </div>

        <div className={`property-badge ${property.status}`}>
          {property.status === 'available' ? 'Available' : 'Occupied'}
        </div>
      </div>
      
      <div className="property-content">
        <div className="property-price">
          TZS {property.price.toLocaleString()} <span>/ month</span>
        </div>
        <h3 className="property-title" title={property.title}>
          {property.title}
        </h3>
        
        <div className="property-location">
          <MapPin size={16} />
          {property.location}
          {property.distance && ` (${property.distance} km away)`}
        </div>
        
        <div className="property-features">
          <div className="feature-item">
            <BedDouble size={18} />
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="feature-item">
            <Bath size={18} />
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="feature-item">
            <Car size={18} />
            <span>1 Parking</span>
          </div>
        </div>
        
        {/* Contact Links */}
        {agent && (
          <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Contact {agent.name.split(' ')[0]}</span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button 
                onClick={handleSMS} 
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(99, 102, 241, 0.1)', color: 'var(--primary-color)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Normal SMS"
              >
                <MessageSquare size={16} />
              </button>
              <button 
                onClick={handleWhatsApp} 
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="WhatsApp"
              >
                <MessageCircle size={16} />
              </button>
              <button 
                onClick={handleEmail} 
                style={{ width: '32px', height: '32px', borderRadius: '50%', border: 'none', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                title="Email"
              >
                <Mail size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
