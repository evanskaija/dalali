import React, { useState, useCallback, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Navigation, Upload, CheckCircle, Plus, Trash2, Home, Receipt, Image as ImageIcon, Video, X, Zap, Users as UsersIcon, Maximize2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ImageCropper } from '../components/ImageCropper';
import { useProperties } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import { useLanguage } from '../contexts/LanguageContext';
import type { Property } from '../mockData/properties';
import { compressImage } from '../utils/db';
import { DAR_LOCATIONS } from '../mockData/locations';

// Fix for default Leaflet icon
const defaultIcon = new Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ position, setPosition }: { position: [number, number] | null, setPosition: (pos: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position === null ? null : <Marker position={position} icon={defaultIcon} />;
};

interface PropertyUnit {
  id: string;
  roomType: string;
  title: string;
  price: number;
  description: string;
  bedrooms: number;
  bathrooms: number;
  aluminumWindows: boolean;
  tiled: boolean;
  gypsum: boolean;
  ac: boolean;
  measurements: string;
  capacity: number;
  sizeSqm: number;
  soundSystem: boolean;
  kitchen: boolean;
}

// Locations are now imported from locations.ts

export const AddProperty: React.FC = () => {
  const { addProperty } = useProperties();
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [units, setUnits] = useState<PropertyUnit[]>([
    { 
      id: '1', 
      roomType: 'room', 
      title: '', 
      price: 0, 
      description: '', 
      bedrooms: 1, 
      bathrooms: 1,
      aluminumWindows: true,
      tiled: true,
      gypsum: true,
      ac: false,
      measurements: '',
      capacity: 0,
      sizeSqm: 0,
      soundSystem: false,
      kitchen: false
    }
  ]);

  const handleTypeSelect = (type: string) => {
    setSelectedType(type);
    setUnits([{ ...units[0], roomType: type }]);
  };

  const categories = [
    { id: 'house', label: t('cat.house'), icon: '🏠', sub: t('cat.sub.sale') },
    { id: 'room', label: t('cat.room'), icon: '🛏️', sub: t('cat.sub.rent') },
    { id: 'plot', label: t('cat.plots'), icon: '🗺️', sub: t('cat.sub.plots') },
    { id: 'farm', label: t('cat.farms'), icon: '🌾', sub: t('cat.sub.farms') },
    { id: 'retail', label: t('cat.retail'), icon: '🏪', sub: t('cat.sub.commercial') },
    { id: 'office', label: t('cat.office'), icon: '🏢', sub: t('cat.sub.business') }
  ];

  const [amenities, setAmenities] = useState({
    electricity: 'private' as 'private' | 'sharable',
    water: 'dawasa' as 'dawasa' | 'borehole' | 'tank',
    fenced: true,
    electricFence: false,
    cctv: false,
    securityGuard: false,
  });

  const [streetName, setStreetName] = useState('');

  // Image Cropping state
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImages, setCroppedImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const centerPosition: [number, number] = [-6.7924, 39.2083];

  const handleStreetChange = (name: string) => {
    setStreetName(name);
    const loc = DAR_LOCATIONS.find(l => l.name === name);
    if (loc) {
      setPosition([loc.lat, loc.lng]);
    }
  };

  const handleDetectLocation = () => {
    setLoadingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (geoPosition) => {
          setPosition([geoPosition.coords.latitude, geoPosition.coords.longitude]);
          setLoadingLocation(false);
        },
        () => {
          setLoadingLocation(false);
          alert("Could not detect your exact location. Please select it on the map.");
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLoadingLocation(false);
      alert("Geolocation is not supported.");
    }
  };

  const addUnit = () => {
    setUnits([
      ...units,
      { 
        id: Date.now().toString(), 
        roomType: selectedType || 'room', 
        title: '', 
        price: 0, 
        description: '', 
        bedrooms: 1, 
        bathrooms: 1,
        aluminumWindows: true,
        tiled: true,
        gypsum: true,
        ac: false,
        measurements: '',
        capacity: 0,
        sizeSqm: 0,
        soundSystem: false,
        kitchen: false
      }
    ]);
  };

  const removeUnit = (id: string) => {
    if (units.length === 1) return;
    setUnits(units.filter(u => u.id !== id));
  };

  const updateUnit = (id: string, field: keyof PropertyUnit, value: any) => {
    setUnits(units.map(u => u.id === id ? { ...u, [field]: value } : u));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.indexOf('video/') !== 0) {
        alert('Please upload a valid video file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCropComplete = useCallback(async (_croppedAreaPixels: any) => {
    if (selectedImage) {
      setIsCompressing(true);
      try {
        // Compress image before adding to stay within memory limits and ensure high quality but optimized size
        const compressed = await compressImage(selectedImage);
        setCroppedImages(prev => [...prev, compressed]);
      } catch (err) {
        console.error("Compression failed", err);
        setCroppedImages(prev => [...prev, selectedImage]);
      } finally {
        setIsCompressing(false);
        setSelectedImage(null);
      }
    }
  }, [selectedImage]);

  const removeImage = (index: number) => {
    setCroppedImages(croppedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) {
      alert("Please set the property location on the map!");
      return;
    }

    // Save each unit as a separate property listing starting fresh
    units.forEach((unit, idx) => {
      const newProperty: Property = {
        id: `${Date.now()}-${idx}`,
        title: unit.title || `New ${unit.roomType}`,
        type: unit.roomType as any,
        price: unit.price,
        location: streetName || "Dar es Salaam", 
        latitude: position[0],
        longitude: position[1],
        images: croppedImages.length > 0 ? croppedImages : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
        video: videoUrl,
        bedrooms: unit.bedrooms,
        bathrooms: unit.bathrooms,
        status: "available",
        agentId: user?.id || 'a1',
        isPremium: false,
        amenities: {
          ...amenities,
          aluminumWindows: unit.aluminumWindows,
          tiled: unit.tiled,
          gypsum: unit.gypsum,
          ac: unit.ac,
          measurements: unit.measurements,
          capacity: unit.capacity,
          sizeSqm: unit.sizeSqm,
          soundSystem: unit.soundSystem,
          kitchen: unit.kitchen
        }
      };
      addProperty(newProperty);
      
      // Notify all users
      addNotification({
        title: `New ${unit.roomType.charAt(0).toUpperCase() + unit.roomType.slice(1)}!`,
        message: `New listing in ${streetName || 'Dar es Salaam'}: TZS ${unit.price.toLocaleString()}/mo`,
        type: 'property'
      });
    });

    setTimeout(() => {
      setSuccess(true);
      window.scrollTo(0, 0);
    }, 1000);
  };

  if (success) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)' }}>
        <Navbar />
        <div className="container" style={{ marginTop: '120px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: 'var(--border-radius)', maxWidth: '500px', width: '100%' }}>
            <CheckCircle size={64} color="#10b981" style={{ margin: '0 auto 1.5rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>Property Listed!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Your properties have been successfully listed. High-quality media is now being processed for display.
            </p>
            <button className="btn-primary" onClick={() => { setSuccess(false); setPosition(null); setUnits([{ id: '1', roomType: 'room', title: '', price: 0, description: '', bedrooms: 1, bathrooms: 1, aluminumWindows: true, tiled: true, gypsum: true, ac: false, measurements: '', capacity: 0, sizeSqm: 0, soundSystem: false, kitchen: false }]); setCroppedImages([]); setVideoUrl(undefined); }}>
              Post Another Property
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', paddingBottom: '4rem', paddingTop: '76px' }}>
      <Navbar />

      {selectedImage && (
        <ImageCropper 
          image={selectedImage} 
          onCropComplete={handleCropComplete} 
          onCancel={() => setSelectedImage(null)} 
          aspect={4/3}
        />
      )}
      
      <div className="container" style={{ maxWidth: '1100px', padding: '2rem 1.5rem' }}>
        {!selectedType ? (
          <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem 0' }}>
            <h1 style={{ marginBottom: '1rem' }}>What would you like to <span className="text-gradient">do today?</span></h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', maxWidth: '600px', margin: '0 auto 3rem' }}>
              Choose whether you want to list a new property on the platform or search for existing listings.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
              {/* Post Section */}
              <div className="glass" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid var(--primary-color)' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Post / Add Property</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {categories.map(cat => (
                    <button 
                      key={cat.id} 
                      onClick={() => handleTypeSelect(cat.id)}
                      className="glass-card"
                      style={{ padding: '1.5rem 1rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', border: '1px solid rgba(255,255,255,0.05)' }}
                    >
                      <span style={{ fontSize: '2rem' }}>{cat.icon}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Section */}
              <div className="glass" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '1rem' }}>Looking to Rent?</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '2rem' }}>
                  Browse through verified rooms, houses, and plots across Dar es Salaam.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button onClick={() => window.location.href='/search'} className="btn-primary" style={{ width: '100%' }}>
                    Go to Search Map
                  </button>
                  <button onClick={() => window.location.href='/'} className="btn-outline" style={{ width: '100%' }}>
                    Back to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <button onClick={() => setSelectedType(null)} style={{ background: 'transparent', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', marginBottom: '1rem', padding: 0, fontWeight: 600 }}>← Back to Selection</button>
                <h1>Add <span className="text-gradient">{categories.find(c => c.id === selectedType)?.label}</span> details</h1>
                <p className="text-muted">Agent Dashboard - Professional listing for {categories.find(c => c.id === selectedType)?.label}.</p>
              </div>
            </div>

        <div className="responsive-grid-2" style={{ alignItems: 'start' }}>
          {/* Main Form Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* General Info */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <Home size={20} color="var(--primary-color)" />
                <h3 style={{ margin: 0 }}>General Property Info</h3>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Street or Compound Name</label>
                <select 
                  value={streetName}
                  onChange={(e) => handleStreetChange(e.target.value)}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', boxSizing: 'border-box', cursor: 'pointer' }} 
                  required
                >
                  <option value="">-- Scroll to select street --</option>
                  {['Kinondoni', 'Ilala', 'Temeke', 'Ubungo', 'Kigamboni'].map(dist => (
                    <optgroup key={dist} label={dist}>
                      {DAR_LOCATIONS.filter(l => l.district === dist).map(loc => (
                        <option key={loc.name} value={loc.name}>{loc.name}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>

            {/* Units Section */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Receipt size={20} color="var(--primary-color)" />
                  <h3 style={{ margin: 0 }}>Available Units / Rooms</h3>
                </div>
                <button type="button" onClick={addUnit} className="btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                  <Plus size={14} /> Add Unit
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {units.map((unit, _index) => (
                  <div key={unit.id} style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
                    {units.length > 1 && (
                      <button type="button" onClick={() => removeUnit(unit.id)} style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={18} />
                      </button>
                    )}
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Unit Title</label>
                        <input type="text" value={unit.title} onChange={(e) => updateUnit(unit.id, 'title', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'white' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Unit Type</label>
                        <select value={unit.roomType} onChange={(e) => updateUnit(unit.id, 'roomType', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'white' }}>
                          <option value="house">{t('cat.house')} ({t('cat.sub.sale')})</option>
                          <option value="room">{t('cat.room')} ({t('cat.sub.rent')})</option>
                          <option value="plot">{t('cat.plots')} ({t('cat.sub.plots')})</option>
                          <option value="farm">{t('cat.farms')} ({t('cat.sub.farms')})</option>
                          <option value="retail">{t('cat.retail')} ({t('cat.sub.commercial')})</option>
                          <option value="office">{t('cat.office')} ({t('cat.sub.business')})</option>
                        </select>
                      </div>
                    </div>

                    {unit.roomType !== 'plot' && unit.roomType !== 'farm' && unit.roomType !== 'hall' && (
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Bedrooms</label>
                          <input type="number" min="0" value={unit.bedrooms} onChange={(e) => updateUnit(unit.id, 'bedrooms', Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'white' }} />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Bathrooms</label>
                          <input type="number" min="0" value={unit.bathrooms} onChange={(e) => updateUnit(unit.id, 'bathrooms', Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'white' }} />
                        </div>
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Price (TZS)</label>
                        <input type="number" value={unit.price || ''} onChange={(e) => updateUnit(unit.id, 'price', Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--primary-color)', fontWeight: 700 }} />
                      </div>
                      
                      {unit.roomType === 'hall' ? (
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Capacity (People)</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <UsersIcon size={18} color="var(--text-muted)" />
                            <input type="number" value={unit.capacity} onChange={(e) => updateUnit(unit.id, 'capacity', Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'white' }} />
                          </div>
                        </div>
                      ) : (unit.roomType === 'plot' || unit.roomType === 'farm') ? (
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Measurements / Size (e.g. 20m x 30m or 5 Acres)</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Maximize2 size={18} color="var(--text-muted)" />
                            <input type="text" value={unit.measurements} onChange={(e) => updateUnit(unit.id, 'measurements', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'white' }} />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Size (SQM)</label>
                          <input type="number" value={unit.sizeSqm} onChange={(e) => updateUnit(unit.id, 'sizeSqm', Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'white' }} />
                        </div>
                      )}
                    </div>

                    {/* Category specific details */}
                    <div style={{ background: 'rgba(16,185,129,0.05)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                      <p style={{ margin: '0 0 1rem 0', fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary-color)', textTransform: 'uppercase' }}>Building Specifications</p>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                        {unit.roomType !== 'plot' && unit.roomType !== 'farm' && (
                          <>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                              <input type="checkbox" checked={unit.aluminumWindows} onChange={(e) => updateUnit(unit.id, 'aluminumWindows', e.target.checked)} /> Aluminum Windows
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                              <input type="checkbox" checked={unit.tiled} onChange={(e) => updateUnit(unit.id, 'tiled', e.target.checked)} /> Tiled Floors
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                              <input type="checkbox" checked={unit.gypsum} onChange={(e) => updateUnit(unit.id, 'gypsum', e.target.checked)} /> Gypsum Ceiling
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                              <input type="checkbox" checked={unit.ac} onChange={(e) => updateUnit(unit.id, 'ac', e.target.checked)} /> Air Conditioning (AC)
                            </label>
                          </>
                        )}
                        {unit.roomType === 'hall' && (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input type="checkbox" checked={unit.soundSystem} onChange={(e) => updateUnit(unit.id, 'soundSystem', e.target.checked)} /> Sound System
                          </label>
                        )}
                        {(unit.roomType === 'house' || unit.roomType === 'apartment' || unit.roomType === 'room' || unit.roomType === 'office') && (
                          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                            <input type="checkbox" checked={unit.kitchen} onChange={(e) => updateUnit(unit.id, 'kitchen', e.target.checked)} /> Kitchen Area
                          </label>
                        )}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, fontSize: '0.85rem' }}>Short Description</label>
                      <textarea rows={2} value={unit.description} onChange={(e) => updateUnit(unit.id, 'description', e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'white' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* General Amenities */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
                <Zap size={20} color="var(--primary-color)" />
                <h3 style={{ margin: 0 }}>Compounds & Utilities</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                {[
                  { id: 'fenced', label: 'Fenced Compound', key: 'fenced' },
                  { id: 'electricFence', label: 'Electric Fence', key: 'electricFence' },
                  { id: 'cctv', label: 'CCTV Security', key: 'cctv' },
                  { id: 'securityGuard', label: '24/7 Gate Guard', key: 'securityGuard' },
                ].map(item => (
                  <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input type="checkbox" checked={(amenities as any)[item.key]} onChange={(e) => setAmenities({...amenities, [item.key]: e.target.checked})} /> {item.label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel: Location & Media */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>GPS Location</h3>
              <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)', marginBottom: '1rem' }}>
                <MapContainer center={centerPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
              <button 
                type="button" 
                onClick={handleDetectLocation}
                className="btn-outline" 
                style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <Navigation size={18} className={loadingLocation ? "animate-spin" : ""} />
                {loadingLocation ? "Detecting..." : "Auto-Detect My GPS"}
              </button>
            </div>

            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={20} color="var(--primary-color)" /> Media Upload
              </h3>
              <div onClick={() => fileInputRef.current?.click()} style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', marginBottom: '1rem' }}>
                {isCompressing ? (
                  <div style={{ color: 'var(--primary-color)', fontSize: '0.85rem' }}>Processing High Quality Image...</div>
                ) : (
                  <>
                    <Upload size={28} className="text-muted" style={{ margin: '0 auto 10px' }} />
                    <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}>Click to Add Photo</div>
                    <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
                  </>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {croppedImages.map((src, i) => (
                  <div key={i} style={{ position: 'relative', width: '100%', paddingTop: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={src} alt="Uploaded" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    <button onClick={() => removeImage(i)} style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '1.5rem' }}>
                <div onClick={() => videoInputRef.current?.click()} style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <Video size={24} className="text-muted" />
                  <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}>Add High-Quality Video</div>
                  <input type="file" ref={videoInputRef} onChange={handleVideoChange} style={{ display: 'none' }} accept="video/*" />
                </div>
              </div>
            </div>

            <button type="submit" onClick={handleSubmit} className="btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 800 }}>
              List Property to Map
            </button>
          </div>
        </div>
      </>
    )}
      </div>
    </div>
  );
};
