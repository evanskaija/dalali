import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { Icon, divIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navbar } from '../components/Navbar';
import { useProperties } from '../contexts/PropertyContext';
import type { Property } from '../mockData/properties';
import { mockAgents } from '../mockData/agents';
import type { Agent } from '../mockData/agents';
import { MapPin, User, Star, Phone, Home as HomeIcon, SlidersHorizontal } from 'lucide-react';
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
  const [agentsDisplay, setAgentsDisplay] = useState<Agent[]>(mockAgents);
  const [searchRadius, setSearchRadius] = useState<number>(50); // Increased default to 50km for better coverage
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(50000000); // Increased default for luxury properties
  const [amenityFilters, setAmenityFilters] = useState({ water: false, electricity: false, parking: false });
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-6.7924, 39.2083]);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedWard, setSelectedWard] = useState<string>('');
  
  const { t } = useLanguage();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const { addNotification } = useNotifications();
  const { properties } = useProperties();
  
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
      
      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden', flexDirection: isMobile ? 'column' : 'row' }}>
        {/* Left Sidebar - Search & List */}
        <div style={{ 
          width: isMobile ? '100%' : '400px', 
          height: isMobile ? '60%' : '100%',
          order: isMobile ? 2 : 1,
          background: 'var(--bg-color)', 
          borderRight: isMobile ? 'none' : '1px solid var(--border-color)',
          borderTop: isMobile ? '1px solid var(--border-color)' : 'none',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 10,
          boxShadow: '4px 0 15px rgba(0,0,0,0.1)'
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
                style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border-color)', fontSize: '0.85rem', marginBottom: '8px' }}
              >
                <option value="">All Categories</option>
                <option value="room">Single Room</option>
                <option value="master-room">Master Room</option>
                <option value="house">Full House</option>
                <option value="apartment">Apartments</option>
                <option value="plot">Compounds / Kiwanja</option>
                <option value="hall">Halls / Ukumbi</option>
              </select>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <select 
                  value={selectedDistrict} 
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
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
                  style={{ flex: 1, padding: '0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', color: 'white', border: '1px solid var(--border-color)', fontSize: '0.85rem' }}
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
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                    <span>{t('map.priceRange')}</span>
                    <span style={{ color: 'var(--primary-color)', fontWeight: 600 }}>TZS {minPrice.toLocaleString()} – {maxPrice.toLocaleString()}</span>
                  </div>
                  <input type="range" min="0" max="10000000" step="100000" value={minPrice} onChange={e => setMinPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)', marginBottom: '6px' }} />
                  <input type="range" min="100000" max="100000000" step="500000" value={maxPrice} onChange={e => setMaxPrice(Number(e.target.value))} style={{ width: '100%', accentColor: 'var(--primary-color)' }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.85rem', marginBottom: '8px', fontWeight: 600 }}>{t('map.amenities')}</div>
                  {(['water', 'electricity', 'parking'] as const).map(a => (
                    <label key={a} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', marginBottom: '6px', cursor: 'pointer' }}>
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
              <>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '-0.5rem' }}>{t('map.nearbyProp')} ({filteredProperties.length})</h3>
                {filteredProperties.length > 0 ? (
                  filteredProperties.map((property, idx) => (
                    <div key={property.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
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
                      {/* Booking logic shown only when active */}
                      {activeProperty?.id === property.id && (
                        <button 
                          onClick={() => handleBookProperty(property)}
                          className="btn-primary" 
                          style={{ width: '100%', background: '#10b981', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)', padding: '0.6rem', fontSize: '0.9rem' }}
                        >
                          {t('map.applyThis')}
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="glass" style={{ padding: '2rem', textAlign: 'center', borderRadius: '12px', marginTop: '1rem' }}>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No properties found in this area. Try increasing the search radius or checking another location.</p>
                  </div>
                )}
              </>
            )}

            {/* Agents List */}
            {(viewMode === 'all' || viewMode === 'agents') && (
              <>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '-0.5rem', marginTop: viewMode === 'all' ? '1rem' : '0' }}>{t('map.activeDalalis')} ({agentsDisplay.length})</h3>
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
                      gap: '0.5rem'
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
                  </div>
                ))}
              </>
            )}

          </div>
        </div>

        {/* Right Area - The Map */}
        {(!isMobile || !selectedProperty) && (
          <div style={{ 
            flex: isMobile ? 'none' : 1, 
            height: isMobile ? '35%' : '100%',
            order: isMobile ? 1 : 2,
            position: 'relative',
            padding: isMobile ? '0.5rem' : '1rem',
            boxSizing: 'border-box'
          }}>
            <div style={{ 
              height: '100%', 
              width: '100%', 
              borderRadius: '24px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
              border: '1px solid var(--border-color)' 
            }}>
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                key={mapCenter.join(',')}
              >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Draw Properties - Clustered */}
            {(viewMode === 'all' || viewMode === 'properties') && (
              <MarkerClusterGroup chunkedLoading>
                {filteredProperties.map((property) => (
                  <Marker 
                    key={property.id} 
                    position={[property.latitude, property.longitude]}
                    icon={propertyIcon}
                    eventHandlers={{
                      click: () => { setActiveProperty(property); setActiveAgent(null); },
                    }}
                  >
                    <Popup className="custom-popup">
                      <div style={{ width: '200px' }}>
                        <div style={{ position: 'relative' }}>
                          <img 
                            src={property.images[0]} 
                            alt={property.title} 
                            style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '8px' }} 
                          />
                          <div style={{ position: 'absolute', bottom: '16px', left: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem', backdropFilter: 'blur(4px)' }}>
                            {property.images.length} Photos
                          </div>
                          {property.video && (
                            <div style={{ position: 'absolute', bottom: '16px', right: '8px', background: 'rgba(239, 68, 68, 0.8)', color: 'white', padding: '2px 6px', borderRadius: '10px', fontSize: '0.7rem', backdropFilter: 'blur(4px)' }}>
                              Video
                            </div>
                          )}
                        </div>
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#111827' }}>{property.title}</h4>
                        <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: 'var(--primary-color)' }}>TZS {property.price.toLocaleString()}</p>
                        <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} /> {property.location}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <button 
                            onClick={() => handleBookProperty(property)}
                            style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%', fontWeight: '600' }}
                          >
                            <HomeIcon size={14} /> {t('map.orderApply')}
                          </button>
                          <a 
                            href="tel:0792546865"
                            style={{ background: 'rgba(59,130,246,0.1)', color: '#3b82f6', border: '1px solid #3b82f6', textDecoration: 'none', padding: '6px 16px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', width: '100%', fontWeight: '600', boxSizing: 'border-box' }}
                          >
                            <Phone size={14} /> {t('map.contact')} Agent
                          </a>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
            )}

            {/* Draw Agents */}
            {(viewMode === 'all' || viewMode === 'agents') && agentsDisplay.map((agent) => (
              <Marker 
                key={agent.id} 
                position={[agent.latitude, agent.longitude]}
                icon={createAgentIcon()}
                eventHandlers={{
                  click: () => { setActiveAgent(agent); setActiveProperty(null); },
                }}
              >
                <Popup className="custom-popup">
                  <div style={{ padding: '8px', textAlign: 'center' }}>
                    <div style={{ background: '#f3f4f6', width: '50px', height: '50px', borderRadius: '50%', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={24} color={'var(--primary-color)'} />
                    </div>
                    <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', color: '#111827' }}>{agent.name}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', margin: '0 0 8px 0', fontSize: '0.9rem', color: '#fbbf24' }}>
                      <Star size={14} fill="currentColor" /> {agent.rating}
                    </div>
                    <a href={`tel:${agent.phone}`} style={{ 
                      background: 'var(--primary-color)', 
                      color: 'white', 
                      textDecoration: 'none',
                      border: 'none', 
                      padding: '6px 16px', 
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      margin: '0 auto',
                      width: 'fit-content'
                    }}>
                      <Phone size={14} /> {t('map.contact')}
                    </a>
                  </div>
                </Popup>
              </Marker>
            ))}

          </MapContainer>
            </div>
          </div>
        )}
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
