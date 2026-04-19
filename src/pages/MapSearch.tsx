import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';

import { Icon, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navbar } from '../components/Navbar';
import { useProperties } from '../contexts/PropertyContext';
import type { Property } from '../mockData/properties';
import type { Agent } from '../mockData/agents';
import { User, Star, Phone, Home as HomeIcon, SlidersHorizontal } from 'lucide-react';
import { PropertyCard } from '../components/PropertyCard';
import { useLanguage } from '../contexts/LanguageContext';
import { BookingModal } from '../components/BookingModal';
import { useNotifications } from '../contexts/NotificationContext';
import { PropertyDetailsModal } from '../components/PropertyDetailsModal';
import { DAR_LOCATIONS } from '../mockData/locations';

// Default property icon
const propertyIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const createAgentIcon = () => divIcon({
  className: 'agent-marker',
  html: `<div style="background-color: var(--primary-color); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Haversine formula to calculate distance between two GPS coordinates in kilometers
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

export const MapSearch: React.FC = () => {
  const navigate = useNavigate();
  const [activeProperty, setActiveProperty] = useState<Property | null>(null);
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'properties' | 'agents'>('all');
  const [agentsDisplay, setAgentsDisplay] = useState<Agent[]>([]);
  const [searchRadius, setSearchRadius] = useState<number>(50); // Increased default to 50km for better coverage
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000); // Increased default for luxury properties
  const [amenityFilters, setAmenityFilters] = useState({ water: false, electricity: false, parking: false });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  const [, setIsMobile] = useState(window.innerWidth <= 768);
  const [, setMapCenter] = useState<[number, number]>([-6.7924, 39.2083]);
  const [, setBookingSuccess] = useState<string | null>(null);
  
  const { t } = useLanguage();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const { addNotification } = useNotifications();
  const { properties, agents } = useProperties();
  useEffect(() => {
    setAgentsDisplay(agents);
  }, [agents]);

  // Dar es Salaam center
  const centerPosition: [number, number] = [-6.7924, 39.2083];

  // Map category strings from home page to the ones mockData uses
  const locationObj = useLocation();
  const searchParams = new URLSearchParams(locationObj.search);
  const typeFilter = searchParams.get('type') || ''; // 'houses', 'apartments', 'rooms'
  const textFilter = searchParams.get('q') || ''; // 'Mikocheni', 'Sinza', etc.

  // Determine filtered properties based on category and street
  const filteredProperties = properties.filter((property) => {
    // 1. Filter by category
    let typeMatches = true;
    if (typeFilter) {
      const normalizedFilter = typeFilter === 'rooms' ? 'room' : 
                               typeFilter === 'houses' ? 'house' : 
                               typeFilter === 'apartments' ? 'apartment' : 
                               typeFilter === 'plots' ? 'plot' : 
                               typeFilter === 'halls' ? 'hall' : typeFilter;
      
      if (property.type !== normalizedFilter) typeMatches = false;
    }

    // 2. GPS Radius
    const distance = calculateDistance(centerPosition[0], centerPosition[1], property.latitude, property.longitude);
    const radiusMatches = distance <= searchRadius;

    // 3. Price Range
    const priceMatches = property.price >= minPrice && property.price <= maxPrice;

    // 4. Text (Location or Title) Match
    const textMatches = textFilter === '' || 
      property.location.toLowerCase().includes(textFilter.toLowerCase()) ||
      property.title.toLowerCase().includes(textFilter.toLowerCase());

    return typeMatches && radiusMatches && priceMatches && textMatches;
  });

  const handleBookProperty = (property: Property) => {
    setBookingProperty(property);
  };

  const handleBookingConfirmed = (date: string, time: string) => {
    setBookingSuccess(`Viewing confirmed for ${date} at ${time}!`);
    addNotification({ title: 'Booking Confirmed ✓', message: `Your viewing for "${bookingProperty?.title}" is set for ${date} at ${time}.`, type: 'booking' });
    setTimeout(() => setBookingSuccess(null), 5000);
  };

  // Automatically switch viewMode to properties if a specific property type was selected from Home
  useEffect(() => {
    if (typeFilter) {
      setViewMode('properties');
    }
  }, [typeFilter]);

  // Simulate Agent movement (Real-time tracking effect)
  useEffect(() => {
    const interval = setInterval(() => {
      setAgentsDisplay(currentAgents => 
        currentAgents.map(agent => {
          // Add a tiny random offset to latch/lng to simulate walking/driving
          const latOffset = (Math.random() - 0.5) * 0.0002;
          const lngOffset = (Math.random() - 0.5) * 0.0002;
          return {
            ...agent,
            latitude: agent.latitude + latOffset,
            longitude: agent.longitude + lngOffset,
          };
        })
      );
    }, 3000); // update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleWardChange = (wardName: string) => {
    setSelectedWard(wardName);
    const loc = DAR_LOCATIONS.find(l => l.name === wardName);
    if (loc) {
      setMapCenter([loc.lat, loc.lng]);
    }
  };

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedWard('');
    // Focus on district center (approx)
    const districtCenters: Record<string, [number, number]> = {
      'Kinondoni': [-6.78, 39.24],
      'Ilala': [-6.82, 39.27],
      'Temeke': [-6.85, 39.28],
      'Ubungo': [-6.79, 39.21],
      'Kigamboni': [-6.83, 39.31]
    };
    if (districtCenters[district]) {
      setMapCenter(districtCenters[district]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', paddingTop: '76px', overflow: 'hidden' }}>
      <Navbar />
      
      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Main Content Area - Full Width */}
        <div style={{ 
          flex: 1,
          background: 'var(--bg-color)', 
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
        }} className="sidebar">
          
          <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>{t('search.title')}</h2>
              <button 
                onClick={() => navigate('/seeker-search')}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--primary-color)', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
              >
                {t('search.changeSelection')}
              </button>
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <select 
                value={searchParams.get('type') || ''} 
                onChange={(e) => {
                  const newParams = new URLSearchParams(locationObj.search);
                  if (e.target.value) newParams.set('type', e.target.value);
                  else newParams.delete('type');
                  window.history.replaceState(null, '', `?${newParams.toString()}`);
                  // Force re-render by navigating to current URL
                  window.location.href = `/search?${newParams.toString()}`;
                }}
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem', marginBottom: '8px' }}
              >
                <option value="">All Categories</option>
                <option value="house">Buy House (For Sale)</option>
                <option value="room">Rent House/Room (For Rent)</option>
                <option value="plot">Buy Plot (Viwanja)</option>
                <option value="farm">Buy Farms (Mashamba)</option>
                <option value="retail">Retail Space (Commercial)</option>
                <option value="office">Office Space (Business)</option>
              </select>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <select 
                  value={selectedDistrict} 
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                >
                  <option value="">District</option>
                  <option value="Kinondoni">Kinondoni</option>
                  <option value="Ilala">Ilala</option>
                  <option value="Temeke">Temeke</option>
                  <option value="Ubungo">Ubungo</option>
                  <option value="Kigamboni">Kigamboni</option>
                </select>
                <select 
                  value={selectedWard} 
                  onChange={(e) => handleWardChange(e.target.value)}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
                  disabled={!selectedDistrict}
                >
                  <option value="">Ward/Street</option>
                  {DAR_LOCATIONS.filter(l => l.district === selectedDistrict).map(loc => (
                    <option key={loc.name} value={loc.name}>{loc.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="search-input-group" style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 'bold' }}>
                <span>{t('map.radius')} (GPS)</span>
                <span className="text-gradient">{t('map.max')}: {searchRadius}km</span>
              </div>
              <input 
                type="range" min="1" max="50" value={searchRadius} 
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--primary-color)' }}
              />
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: showFilters ? 'rgba(16,185,129,0.1)' : 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.6rem 1rem', cursor: 'pointer', color: showFilters ? 'var(--primary-color)' : 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem', width: '100%' }}
            >
              <SlidersHorizontal size={16} />
              {t('map.advancedFilters')} {showFilters ? '▲' : '▼'}
            </button>

            {showFilters && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px', color: 'var(--text-main)' }}>
                    <span>{t('map.priceRange')}</span>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>TZS {minPrice.toLocaleString()} – {maxPrice.toLocaleString()}</span>
                  </div>
                  <input type="range" min="0" max="10000000" step="100000" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)', marginBottom: '6px' }} />
                  <input type="range" min="100000" max="100000000" step="500000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600, color: 'var(--text-main)' }}>{t('map.amenities')}</div>
                  {(['water', 'electricity', 'parking'] as const).map(a => (
                    <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '6px', cursor: 'pointer', color: 'var(--text-main)' }}>
                      <input type="checkbox" checked={amenityFilters[a]} onChange={() => setAmenityFilters(prev => ({ ...prev, [a]: !prev[a] }))} style={{ accentColor: 'var(--primary-color)', width: '16px', height: '16px' }} />
                      {t(`map.${a}`)}
                    </label>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex gap-2" style={{ overflowX: 'auto', paddingBottom: '0.5rem', scrollbarWidth: 'none' }}>
              <button 
                onClick={() => setViewMode('all')}
                className="glass" 
                style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', whiteSpace: 'nowrap', border: viewMode === 'all' ? '1px solid var(--primary-color)' : 'none', color: viewMode === 'all' ? 'var(--primary-color)' : 'inherit' }}
              >
                {t('map.all')}
              </button>
              <button 
                onClick={() => setViewMode('properties')}
                className="glass" 
                style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', whiteSpace: 'nowrap', border: viewMode === 'properties' ? '1px solid var(--primary-color)' : 'none', color: viewMode === 'properties' ? 'var(--primary-color)' : 'inherit' }}
              >
                <HomeIcon size={14} style={{ display: 'inline', marginRight: '4px' }}/>
                {t('map.properties')}
              </button>
              <button 
                onClick={() => setViewMode('agents')}
                className="glass" 
                style={{ padding: '0.5rem 1rem', borderRadius: '20px', fontSize: '0.8rem', whiteSpace: 'nowrap', border: viewMode === 'agents' ? '1px solid var(--primary-color)' : 'none', color: viewMode === 'agents' ? 'var(--primary-color)' : 'inherit' }}
              >
                <User size={14} style={{ display: 'inline', marginRight: '4px' }}/>
                {t('map.liveAgents')}
              </button>
            </div>
          </div>
          
          <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Properties List */}
            {(viewMode === 'all' || viewMode === 'properties') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('map.nearbyProp')} ({filteredProperties.length})</h3>
                {filteredProperties.length > 0 ? (
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
                    gap: '1.5rem' 
                  }}>
                    {filteredProperties.map((property, idx) => (
                      <div 
                        key={property.id} 
                        style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '0.5rem',
                          gridColumn: activeProperty?.id === property.id ? 'span 1' : 'auto'
                        }}
                      >
                        <div 
                          onClick={() => { setActiveProperty(property); setActiveAgent(null); }}
                          style={{ 
                            cursor: 'pointer',
                            border: activeProperty?.id === property.id ? '2px solid var(--primary-color)' : '1px solid transparent',
                            borderRadius: 'var(--border-radius)',
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <PropertyCard 
                            property={property} 
                            index={idx} 
                            onOpenDetails={(p) => {
                              setSelectedProperty(p);
                              setActiveProperty(p);
                            }}
                          />
                        </div>
                        {/* Map appears below chosen item */}
                        {activeProperty?.id === property.id && (
                          <div className="animate-fade-in" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ 
                              height: '300px', 
                              width: '100%', 
                              borderRadius: '16px', 
                              overflow: 'hidden', 
                              border: '1px solid var(--border-color)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}>
                              <MapContainer 
                                center={[property.latitude, property.longitude]} 
                                zoom={15} 
                                style={{ height: '100%', width: '100%' }}
                                zoomControl={false}
                              >
                                <TileLayer
                                  attribution='&copy; OpenStreetMap contributors'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={[property.latitude, property.longitude]} icon={propertyIcon} />
                              </MapContainer>
                            </div>
                            
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button 
                                onClick={() => handleBookProperty(property)}
                                className="btn-primary" 
                                style={{ flex: 1, background: '#10b981', padding: '0.8rem' }}
                              >
                                <HomeIcon size={18} /> {t('map.applyThis')}
                              </button>
                              <button 
                                onClick={() => setSelectedProperty(property)}
                                className="btn-outline" 
                                style={{ flex: 1, padding: '0.8rem' }}
                              >
                                View Details
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: '12px', marginTop: '1rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No properties found in this area. Try increasing the search radius or checking another location.</p>
                  </div>
                )}
              </div>
            )}

            {/* Agents List */}
            {(viewMode === 'all' || viewMode === 'agents') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: viewMode === 'all' ? '2rem' : '0' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t('map.activeDalalis')} ({agentsDisplay.length})</h3>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
                  gap: '1.5rem' 
                }}>
                  {agentsDisplay.map((agent) => (
                    <div 
                      key={agent.id}
                      onClick={() => { setActiveAgent(agent); setActiveProperty(null); }}
                      className="glass p-4"
                      style={{
                        cursor: 'pointer',
                        border: activeAgent?.id === agent.id ? '2px solid var(--primary-color)' : '1px solid transparent',
                        borderRadius: 'var(--border-radius)',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem',
                        gridColumn: activeAgent?.id === agent.id ? 'span 1' : 'auto'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '10px', height: '10px', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                          {agent.name}
                        </h4>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#fbbf24' }}>
                          <Star size={14} fill="currentColor" /> {agent.rating}
                        </div>
                      </div>
                      <a href={`tel:${agent.phone}`} style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
                        <Phone size={14} /> {agent.phone}
                      </a>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        <span>{agent.propertiesCount} {t('map.propertiesListed')}</span>
                        <span>{t('map.lastSeen')}: {agent.lastSeen}</span>
                      </div>

                      {/* Map appears below chosen agent */}
                      {activeAgent?.id === agent.id && (
                        <div className="animate-fade-in" style={{ marginTop: '1rem' }}>
                          <div style={{ 
                            height: '200px', 
                            width: '100%', 
                            borderRadius: '16px', 
                            overflow: 'hidden', 
                            border: '1px solid var(--border-color)' 
                          }}>
                            <MapContainer 
                              center={[agent.latitude, agent.longitude]} 
                              zoom={15} 
                              style={{ height: '100%', width: '100%' }}
                              zoomControl={false}
                            >
                              <TileLayer
                                attribution='&copy; OpenStreetMap contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              />
                              <Marker position={[agent.latitude, agent.longitude]} icon={createAgentIcon()} />
                            </MapContainer>
                          </div>
                          <a 
                            href={`tel:${agent.phone}`} 
                            className="btn-primary" 
                            style={{ width: '100%', marginTop: '1rem', padding: '0.8rem' }}
                          >
                            <Phone size={18} /> {t('map.contact')} Agent
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>


      </div>

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal 
          property={selectedProperty} 
          onClose={() => setSelectedProperty(null)} 
        />
      )}

      {/* Booking Modal */}
      {bookingProperty && (
        <BookingModal
          propertyTitle={bookingProperty.title}
          agentName="Juma Hassan"
          agentPhone="0792546865"
          onClose={() => setBookingProperty(null)}
          onBooked={handleBookingConfirmed}
        />
      )}
    </div>
  );
};
