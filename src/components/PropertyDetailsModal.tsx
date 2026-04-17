import React, { useState } from 'react';
import type { Property } from '../mockData/properties';
import { X, MapPin, BedDouble, Bath, Car, ChevronLeft, ChevronRight, Video, Phone, MessageCircle, Zap, Shield, Droplets, CheckCircle } from 'lucide-react';
import { mockAgents } from '../mockData/agents';

interface Props {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailsModal: React.FC<Props> = ({ property, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const agent = mockAgents.find(a => a.id === property.agentId);

  // Combine images and videos into one media array
  const mediaList = [...property.images];
  if (property.video) {
    mediaList.push(property.video); // The last one will be a video if it exists
  }

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaList.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + mediaList.length) % mediaList.length);
  };

  const isVideo = (url: string) => url?.endsWith('.mp4') || url?.startsWith('data:video/');

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999999,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)',
        padding: '1rem', overflowY: 'auto'
    }}>
      <div 
        className="glass" 
        onClick={(e) => e.stopPropagation()}
        style={{
        width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto',
        borderRadius: '16px', position: 'relative', display: 'flex', flexDirection: 'column',
        background: 'var(--bg-color)', color: 'var(--text-main)', border: '1px solid var(--border-color)'
      }}>
        
        {/* Close button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute', top: '15px', right: '15px', zIndex: 10,
            background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none',
            borderRadius: '50%', width: '40px', height: '40px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
          }}
        >
          <X size={24} />
        </button>

        {/* Media Gallery */}
        <div style={{ position: 'relative', height: '450px', backgroundColor: '#000', borderRadius: '16px 16px 0 0', overflow: 'hidden' }}>
          {isVideo(mediaList[currentMediaIndex]) ? (
            <video 
              src={mediaList[currentMediaIndex]} 
              controls autoPlay loop
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          ) : (
            <img 
              src={mediaList[currentMediaIndex]} 
              alt={`Media ${currentMediaIndex + 1}`} 
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          )}

          {/* Gallery Navigation */}
          {mediaList.length > 1 && (
            <>
              <button onClick={prevMedia} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
                <ChevronLeft size={28} />
              </button>
              <button onClick={nextMedia} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)', color: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 2 }}>
                <ChevronRight size={28} />
              </button>
              
              <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isVideo(mediaList[currentMediaIndex]) ? <Video size={14} /> : null}
                {currentMediaIndex + 1} / {mediaList.length}
              </div>
            </>
          )}
        </div>

        {/* Property Info */}
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ textTransform: 'uppercase', color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem' }}>
                {property.type.replace('-', ' ')}
              </div>
              <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>{property.title}</h2>
              <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', gap: '6px', fontSize: '0.95rem' }}>
                <MapPin size={16} /> {property.location}
              </div>
            </div>
            
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                TZS {property.price.toLocaleString()} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 400 }}>/ mo</span>
              </div>
              <div style={{ display: 'inline-block', marginTop: '0.5rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '4px 12px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600 }}>
                {property.status === 'available' ? 'Available Now' : 'Occupied'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', margin: '2rem 0', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '100px' }}>
              <div style={{ background: 'var(--bg-color)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BedDouble size={20} color="var(--primary-color)" />
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{property.bedrooms}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bedrooms</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '100px' }}>
              <div style={{ background: 'var(--bg-color)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bath size={20} color="var(--primary-color)" />
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{property.bathrooms}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bathrooms</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '100px' }}>
              <div style={{ background: 'var(--bg-color)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={20} color="var(--primary-color)" />
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{property.amenities?.fenced ? 'Yes' : 'Open'}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Parking/Fence</div>
              </div>
            </div>
          </div>

          {/* Utilities Quick View */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            <div className="glass" style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Zap size={18} color="var(--primary-color)" />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Electricity</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{property.amenities?.electricity === 'sharable' ? 'Sharable Luku' : 'Private Meter'}</div>
              </div>
            </div>
            <div className="glass" style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
              <Droplets size={18} color="var(--primary-color)" />
              <div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Water Source</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{property.amenities?.water?.toUpperCase() || 'DAWASA'}</div>
              </div>
            </div>
            {property.amenities?.ac && (
              <div className="glass" style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <Shield size={18} color="var(--primary-color)" />
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Comfort</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Air Conditioned</div>
                </div>
              </div>
            )}
          </div>

          {/* Amenities Checklist */}
          {property.amenities && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Additional Features</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {[
                  { key: 'electricFence', label: 'Electric Fence' },
                  { key: 'cctv', label: 'CCTV Security' },
                  { key: 'securityGuard', label: '24/7 Security Guard' },
                  { key: 'tiled', label: 'Tiled Floors' },
                  { key: 'gypsum', label: 'Gypsum Ceiling' },
                ].filter(item => (property.amenities as any)[item.key]).map(item => (
                  <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                    <CheckCircle size={16} color="#10b981" /> {item.label}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem' }}>Description</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
              This beautifully appointed {property.type.replace('-', ' ')} located in the heart of {property.location.split(',')[0]} offers the perfect blend of comfort and convenience. 
              Featuring {property.bedrooms} spacious bedrooms, {property.bathrooms} modern bathrooms, and secure parking. 
              {property.isPremium && " As a premium listing, it also includes backup electricity, continuous water supply, and top-tier security."}
              <br/><br/>
              With over {property.images.length} photos and videos provided by the landlord, you can see every detail of this property before scheduling a visit. High-speed internet is pre-wired, and the community is extremely welcoming.
            </p>
          </div>

          {/* Agent Box */}
          {agent && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'var(--primary-color)', color: 'white', borderRadius: '12px', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800 }}>
                  {agent.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{agent.name}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>Dalali • {agent.rating}★ Rating</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a href={`tel:${agent.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'white', color: 'var(--primary-color)', padding: '0.6rem 1.2rem', borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                  <Phone size={16} /> Call
                </a>
                <a href={`https://wa.me/${agent.phone.replace(/\+/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#25D366', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
