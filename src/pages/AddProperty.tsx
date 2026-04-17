import React, { useState, useCallback, useRef } from 'react';
import { Navbar } from '../components/Navbar';
import { Navigation, Upload, CheckCircle, Plus, Trash2, Home, Receipt, Image as ImageIcon, Video, X } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ImageCropper } from '../components/ImageCropper';
import { useProperties } from '../contexts/PropertyContext';
import type { Property } from '../mockData/properties';

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
}

const NEIGHBORHOOD_COORDINATES: Record<string, { lat: number, lng: number }> = {
  'Mikocheni': { lat: -6.7601, lng: 39.2393 },
  'Masaki': { lat: -6.7368, lng: 39.2785 },
  'Sinza': { lat: -6.7865, lng: 39.2274 },
  'Ubungo': { lat: -6.7905, lng: 39.2079 },
  'Kijitonyama': { lat: -6.7798, lng: 39.2443 },
  'Oyster Bay': { lat: -6.7570, lng: 39.2740 },
  'Kigamboni': { lat: -6.8200, lng: 39.3000 },
  'Mbezi Beach': { lat: -6.7200, lng: 39.2300 },
  'Tegeta': { lat: -6.6800, lng: 39.1900 },
  'Bunju': { lat: -6.6200, lng: 39.1500 },
  'Kariakoo': { lat: -6.8211, lng: 39.2784 },
  'Posta (CBD)': { lat: -6.8161, lng: 39.2903 },
};

export const AddProperty: React.FC = () => {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [success, setSuccess] = useState(false);
  const { addProperty } = useProperties();
  
  const [units, setUnits] = useState<PropertyUnit[]>([
    { id: '1', roomType: 'room', title: '', price: 0, description: '', bedrooms: 1, bathrooms: 1 }
  ]);
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
    const coords = NEIGHBORHOOD_COORDINATES[name];
    if (coords) {
      setPosition([coords.lat, coords.lng]);
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
      { id: Date.now().toString(), roomType: 'room', title: '', price: 0, description: '', bedrooms: 1, bathrooms: 1 }
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
    // In a real app, we would use canvas to get the cropped image blob/base64
    // For this simulation, we'll just add the original image as a "cropped" one
    if (selectedImage) {
      setCroppedImages([...croppedImages, selectedImage]);
    }
    setSelectedImage(null);
  }, [selectedImage, croppedImages]);

  const removeImage = (index: number) => {
    setCroppedImages(croppedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) {
      alert("Please set the property location on the map!");
      return;
    }

    // Prepare property object
    const mainUnit = units[0];
    const newProperty: Property = {
      id: Date.now().toString(),
      title: mainUnit.title || "New Property",
      type: mainUnit.roomType as any,
      price: mainUnit.price,
      location: streetName || "Dar es Salaam", 
      latitude: position[0],
      longitude: position[1],
      images: croppedImages.length > 0 ? croppedImages : ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267"],
      video: videoUrl,
      bedrooms: mainUnit.bedrooms,
      bathrooms: mainUnit.bathrooms,
      status: "available",
      agentId: "a1", // Mock current agent
      isPremium: false,
    };

    addProperty(newProperty);

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
              Your property with {units.length} unit(s) has been successfully listed. GPS location and pricing details are now live.
            </p>
            <button className="btn-primary" onClick={() => { setSuccess(false); setPosition(null); setUnits([{ id: '1', roomType: 'room', title: '', price: 0, description: '', bedrooms: 1, bathrooms: 1 }]); setCroppedImages([]); setVideoUrl(undefined); }}>
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
        <div style={{ marginBottom: '2rem' }}>
          <h1>Add Rooms & <span className="text-gradient">Property details</span></h1>
          <p className="text-muted">Agent Dashboard - List multiple rooms, set pricing, and capture GPS coordinates.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem', alignItems: 'start' }}>
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
                  {Object.keys(NEIGHBORHOOD_COORDINATES).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
                <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                  Selecting a name will automatically update your GPS map pin below.
                </p>
              </div>
            </div>

            {/* Units/Rooms Section */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Receipt size={20} color="var(--primary-color)" />
                  <h3 style={{ margin: 0 }}>Available Units / Rooms</h3>
                </div>
                <button 
                  type="button" 
                  onClick={addUnit}
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', background: 'rgba(16,185,129,0.1)', color: 'var(--primary-color)', border: '1px solid var(--primary-color)', padding: '0.5rem 1rem', borderRadius: '20px', cursor: 'pointer', fontWeight: 700 }}
                >
                  <Plus size={14} /> Add Another Unit
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {units.map((unit, index) => (
                  <div key={unit.id} style={{ padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
                    {units.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeUnit(unit.id)}
                        style={{ position: 'absolute', top: '10px', right: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', opacity: 0.7 }}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <h4 style={{ margin: '0 0 1rem 0', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Unit #{index + 1}
                    </h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.85rem' }}>Unit Title / Identification</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Unit A (Top floor)" 
                          value={unit.title}
                          onChange={(e) => updateUnit(unit.id, 'title', e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.85rem' }}>Unit Type</label>
                        <select 
                          value={unit.roomType}
                          onChange={(e) => updateUnit(unit.id, 'roomType', e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                        >
                          <option value="room">Single Room</option>
                          <option value="master-room">Master Room</option>
                          <option value="apartment">Apartment / Flat</option>
                          <option value="house">Stand-alone</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.85rem' }}>Rent Cash (TZS)</label>
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          value={unit.price || ''}
                          onChange={(e) => updateUnit(unit.id, 'price', Number(e.target.value))}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--primary-color)', fontWeight: 700, boxSizing: 'border-box' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.85rem' }}>Bedrooms</label>
                        <input type="number" value={unit.bedrooms} onChange={(e) => updateUnit(unit.id, 'bedrooms', Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'white', boxSizing: 'border-box' }} />
                      </div>
                      <div>
                        <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.85rem' }}>Bathrooms</label>
                        <input type="number" value={unit.bathrooms} onChange={(e) => updateUnit(unit.id, 'bathrooms', Number(e.target.value))} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'white', boxSizing: 'border-box' }} />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 500, fontSize: '0.85rem' }}>Short Description</label>
                      <textarea 
                        rows={2} 
                        placeholder="Key features (e.g. AC already wired, tiled floors)"
                        value={unit.description}
                        onChange={(e) => updateUnit(unit.id, 'description', e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Side Panel Area - Location & Media */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Location Section */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <h3 style={{ margin: '0 0 1rem 0' }}>GPS Location</h3>
              <button 
                type="button" 
                onClick={handleDetectLocation}
                className="btn-outline" 
                style={{ width: '100%', marginBottom: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: position ? 'rgba(16, 185, 129, 0.1)' : 'transparent', borderColor: position ? '#10b981' : 'var(--border-color)', color: position ? '#10b981' : 'inherit' }}
              >
                <Navigation size={18} className={loadingLocation ? "animate-spin" : ""} />
                {loadingLocation ? "Detecting..." : position ? "Location Captured" : "Auto-Detect My GPS"}
              </button>

              <div style={{ height: '220px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <MapContainer center={centerPosition} zoom={13} style={{ height: '100%', width: '100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationMarker position={position} setPosition={setPosition} />
                </MapContainer>
              </div>
              <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '0.7rem', textAlign: 'center' }}>
                * Click map to set pin manually
              </p>
            </div>

            {/* Media Section */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ImageIcon size={20} color="var(--primary-color)" /> Media
              </h3>
              
              <div 
                onClick={() => fileInputRef.current?.click()}
                style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', marginBottom: '1rem', transition: 'all 0.2s' }}
              >
                <Upload size={28} className="text-muted" style={{ margin: '0 auto 10px' }} />
                <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}>Click to Add Photo</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Upload & Crop your best images</div>
                <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
              </div>

              {croppedImages.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginTop: '1rem' }}>
                  {croppedImages.map((src, i) => (
                    <div key={i} style={{ position: 'relative', width: '100%', paddingTop: '100%', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                      <img src={src} alt="Cropped" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        onClick={() => removeImage(i)}
                        style={{ position: 'absolute', top: '2px', right: '2px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '1.5rem' }}>
                <div 
                  onClick={() => videoInputRef.current?.click()}
                  style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
                >
                  <Video size={24} className="text-muted" />
                  <div style={{ color: 'var(--text-main)', fontSize: '0.85rem', fontWeight: 600 }}>Add Video (Optional)</div>
                  <input type="file" ref={videoInputRef} onChange={handleVideoChange} style={{ display: 'none' }} accept="video/*" />
                </div>
                
                {videoUrl && (
                  <div style={{ marginTop: '1rem', position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <video src={videoUrl} controls style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                    <button 
                      onClick={() => setVideoUrl(undefined)}
                      style={{ position: 'absolute', top: '5px', right: '5px', background: 'rgba(0,0,0,0.5)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10 }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              onClick={handleSubmit}
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.2)' }}
            >
              List Property to Map
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
