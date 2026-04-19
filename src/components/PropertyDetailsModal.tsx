import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Property, Review, Report, VisitBooking } from '../mockData/properties';
import { useProperties } from '../contexts/PropertyContext';
import { useAuth } from '../contexts/AuthContext';
import { X, MapPin, BedDouble, Bath, Car, ChevronLeft, ChevronRight, Video, Phone, MessageCircle, MessageSquare, Zap, Droplets, CheckCircle, Maximize2, Users as UsersIcon, Calendar, AlertTriangle, ShieldCheck, ShieldAlert } from 'lucide-react';

interface Props {
  property: Property;
  onClose: () => void;
}

export const PropertyDetailsModal: React.FC<Props> = ({ property, onClose }) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'details'|'reviews'|'booking'|'report'>('details');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [visitDate, setVisitDate] = useState('');
  const [visitTime, setVisitTime] = useState('10:00');
  const [visitMsg, setVisitMsg] = useState('');
  const [reportReason, setReportReason] = useState<Report['reason']>('scam');
  const [reportDetails, setReportDetails] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const { agents, orderProperty, finalizeProperty, cancelOrder, addReview, reportProperty, bookVisit } = useProperties();
  const { user } = useAuth();
  const agent = agents.find(a => a.id === property.agentId);

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
              <div style={{ textTransform: 'uppercase', color: 'var(--primary-color)', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '1px', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {property.type.replace('-', ' ')}
                {property.isVerified
                  ? <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:'rgba(16,185,129,0.15)', color:'#10b981', padding:'2px 10px', borderRadius:'20px', fontSize:'0.72rem', fontWeight:700 }}><ShieldCheck size={12} /> Verified</span>
                  : <span style={{ display:'inline-flex', alignItems:'center', gap:'4px', background:'rgba(239,68,68,0.1)', color:'#ef4444', padding:'2px 10px', borderRadius:'20px', fontSize:'0.72rem', fontWeight:700 }}><ShieldAlert size={12} /> Unverified</span>
                }
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

          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
            
            {/* Conditional Features based on type */}
            {property.type === 'plot' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '150px' }}>
                <div style={{ background: 'var(--bg-color)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Maximize2 size={20} color="var(--primary-color)" />
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{property.amenities?.measurements || 'Contact Agent'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Measurements</div>
                </div>
              </div>
            )}

            {property.type === 'hall' && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '150px' }}>
                <div style={{ background: 'var(--bg-color)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <UsersIcon size={20} color="var(--primary-color)" />
                </div>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{property.amenities?.capacity || '0'}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Capacity</div>
                </div>
              </div>
            )}

            {property.type !== 'plot' && property.type !== 'hall' && (
              <>
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
              </>
            )}

            {/* Common Feature: Parking/Accessibility */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: '100px' }}>
              <div style={{ background: 'var(--bg-color)', width: '45px', height: '45px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Car size={20} color="var(--primary-color)" />
              </div>
              <div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{property.amenities?.fenced ? 'Yes' : (property.type === 'plot' ? 'Available' : 'Open')}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{property.type === 'plot' ? 'Accessibility' : 'Parking/Fence'}</div>
              </div>
            </div>
          </div>

          {/* Utilities Quick View */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
            {property.type !== 'plot' && (
              <>
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
              </>
            )}
            {property.amenities?.sizeSqm ? (
              <div className="glass" style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                <Maximize2 size={18} color="var(--primary-color)" />
                <div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Structure Size</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{property.amenities.sizeSqm} SQM</div>
                </div>
              </div>
            ) : null}
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
                  { key: 'aluminumWindows', label: 'Aluminum Windows' },
                  { key: 'ac', label: 'Air Conditioning' },
                  { key: 'soundSystem', label: 'Professional Sound System' },
                  { key: 'kitchen', label: 'Kitchen Area' },
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
              {property.description || `This beautifully appointed ${property.type.replace('-', ' ')} located in the heart of ${property.location.split(',')[0]} offers the perfect blend of comfort and convenience.`}
            </p>
          </div>

          {/* Map Directions Button */}
          <div style={{ marginBottom: '2rem', padding: '1.5rem', borderRadius: '16px', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, color: '#3b82f6', marginBottom: '4px' }}>How to get there?</h4>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Get precise turn-by-turn road map directions to this property.</p>
              </div>
              <a 
                href={`https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
                style={{ background: '#3b82f6', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', borderRadius: '12px' }}
              >
                <MapPin size={18} /> Get Road Map
              </a>
            </div>
          </div>

          {/* Agent Box */}
          {agent && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                    {agent.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{agent.name}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Dalali • {agent.rating}★ Rating</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
                  <a href={`tel:${agent.phone}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--primary-color)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                    <Phone size={16} /> Call
                  </a>
                  <Link to={`/chat/${agent.id}`} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.05)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem', border: '1px solid var(--border-color)' }}>
                    <MessageSquare size={16} /> Chat
                  </Link>
                  <a href={`https://wa.me/${agent.phone.replace(/\+/g, '').replace(/\s/g, '')}`} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#25D366', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '30px', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' }}>
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Order / Pin Logic */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: '0.5rem' }}>
                {property.status === 'ordered' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    <div style={{ background: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={16} /> This room is currently <strong>Pinned (Ordered)</strong>. 
                      It will be released in {Math.ceil((new Date(property.orderedUntil!).getTime() - new Date().getTime()) / (1000 * 60 * 60))} hours if not taken.
                    </div>
                    {user?.id === property.agentId ? (
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button onClick={() => { finalizeProperty(property.id); onClose(); }} className="btn-primary" style={{ flex: 1, background: '#10b981' }}>Mark as Taken (Remove)</button>
                        <button onClick={() => cancelOrder(property.id)} className="btn-outline" style={{ flex: 1 }}>Cancel Order</button>
                      </div>
                    ) : (
                      <button disabled className="btn-outline" style={{ width: '100%', opacity: 0.5, cursor: 'not-allowed' }}>Currently Reserved</button>
                    )}
                  </div>
                ) : (
                  <button 
                    onClick={() => {
                      if (!user) {
                        alert("Please login to order this property.");
                        return;
                      }
                      orderProperty(property.id, user.id);
                    }}
                    className="btn-primary" 
                    style={{ width: '100%', padding: '1rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', fontWeight: 800, fontSize: '1rem' }}
                  >
                    Order & Pin Room (for 2 Days)
                  </button>
                )}
              </div>
            </div>
          )}

          {/* ── Tab Bar ── */}
          <div style={{display:'flex',gap:'0.5rem',marginTop:'1rem',borderBottom:'1px solid var(--border-color)',paddingBottom:'0.5rem',overflowX:'auto'}}>
            {(['details','reviews','booking','report'] as const).map(tab=>(
              <button key={tab} onClick={()=>{setActiveTab(tab);setSuccessMsg('');}} style={{padding:'0.5rem 1rem',borderRadius:'20px',border:'none',cursor:'pointer',fontWeight:600,fontSize:'0.82rem',background:activeTab===tab?'var(--primary-color)':'rgba(255,255,255,0.05)',color:activeTab===tab?'white':'var(--text-muted)',whiteSpace:'nowrap'}}>
                {tab==='reviews'?`⭐ Reviews (${property.reviews?.length||0})`:tab==='booking'?'📅 Book Visit':tab==='report'?'🚨 Report':'📋 Details'}
              </button>
            ))}
          </div>

          {successMsg&&<div style={{background:'rgba(16,185,129,0.1)',border:'1px solid #10b981',color:'#10b981',padding:'0.75rem 1rem',borderRadius:'10px',marginTop:'1rem',fontWeight:600}}>{successMsg}</div>}

          {/* ── Reviews Tab ── */}
          {activeTab==='reviews'&&(
            <div style={{marginTop:'1.5rem'}}>
              <h3 style={{marginBottom:'1rem'}}>⭐ Ratings & Reviews</h3>
              {property.reviews&&property.reviews.length>0?(
                <div style={{display:'flex',flexDirection:'column',gap:'1rem',marginBottom:'1.5rem',maxHeight:'200px',overflowY:'auto'}}>
                  {property.reviews.map(r=>(
                    <div key={r.id} style={{padding:'1rem',background:'rgba(255,255,255,0.03)',borderRadius:'10px',border:'1px solid var(--border-color)'}}>
                      <div style={{display:'flex',justifyContent:'space-between',marginBottom:'0.4rem'}}>
                        <strong>{r.userName}</strong>
                        <span style={{color:'#fbbf24'}}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                      </div>
                      <p style={{margin:0,color:'var(--text-muted)',fontSize:'0.85rem'}}>{r.comment}</p>
                    </div>
                  ))}
                </div>
              ):(<p style={{color:'var(--text-muted)',marginBottom:'1rem'}}>No reviews yet. Be the first!</p>)}
              {user&&(
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem',padding:'1rem',background:'rgba(255,255,255,0.03)',borderRadius:'10px',border:'1px solid var(--border-color)'}}>
                  <div style={{display:'flex',gap:'6px'}}>
                    {[1,2,3,4,5].map(s=>(
                      <button key={s} onClick={()=>setReviewRating(s)} style={{background:'none',border:'none',cursor:'pointer',fontSize:'1.5rem',color:s<=reviewRating?'#fbbf24':'var(--border-color)'}}>{s<=reviewRating?'★':'☆'}</button>
                    ))}
                  </div>
                  <textarea value={reviewComment} onChange={e=>setReviewComment(e.target.value)} placeholder="Write your review..." rows={3} style={{width:'100%',resize:'vertical',padding:'0.75rem',borderRadius:'8px',background:'var(--bg-color)',border:'1px solid var(--border-color)',color:'var(--text-main)'}} />
                  <button onClick={async()=>{
                    if(!reviewComment.trim())return;
                    const rev:Review={id:Date.now().toString(),userId:user.id,userName:user.name,rating:reviewRating,comment:reviewComment,date:new Date().toLocaleDateString()};
                    await addReview(property.id,rev);
                    setReviewComment('');setSuccessMsg('Review submitted! Thank you.');
                  }} className="btn-primary" style={{width:'100%'}}>Submit Review</button>
                </div>
              )}
            </div>
          )}

          {/* ── Booking Tab ── */}
          {activeTab==='booking'&&(
            <div style={{marginTop:'1.5rem'}}>
              <h3 style={{marginBottom:'0.5rem'}}>📅 Schedule a Property Visit</h3>
              <p style={{color:'var(--text-muted)',fontSize:'0.85rem',marginBottom:'1rem'}}>Pick a date and time. The agent will confirm your visit.</p>
              {property.visitBookings&&property.visitBookings.length>0&&(
                <div style={{marginBottom:'1rem',padding:'0.75rem',background:'rgba(59,130,246,0.08)',borderRadius:'8px',border:'1px solid rgba(59,130,246,0.2)'}}>
                  <strong style={{fontSize:'0.85rem',color:'#3b82f6'}}>Existing bookings: {property.visitBookings.length}</strong>
                </div>
              )}
              {user?(
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.75rem'}}>
                    <div><label style={{fontSize:'0.8rem',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Date</label><input type="date" value={visitDate} min={new Date().toISOString().split('T')[0]} onChange={e=>setVisitDate(e.target.value)} style={{width:'100%',padding:'0.6rem',borderRadius:'8px',background:'var(--bg-color)',border:'1px solid var(--border-color)',color:'var(--text-main)'}} /></div>
                    <div><label style={{fontSize:'0.8rem',color:'var(--text-muted)',display:'block',marginBottom:'4px'}}>Time</label><input type="time" value={visitTime} onChange={e=>setVisitTime(e.target.value)} style={{width:'100%',padding:'0.6rem',borderRadius:'8px',background:'var(--bg-color)',border:'1px solid var(--border-color)',color:'var(--text-main)'}} /></div>
                  </div>
                  <textarea value={visitMsg} onChange={e=>setVisitMsg(e.target.value)} placeholder="Optional message to agent..." rows={2} style={{width:'100%',resize:'none',padding:'0.75rem',borderRadius:'8px',background:'var(--bg-color)',border:'1px solid var(--border-color)',color:'var(--text-main)'}} />
                  <button onClick={async()=>{
                    if(!visitDate)return;
                    const bk:VisitBooking={id:Date.now().toString(),userId:user.id,userName:user.name,userPhone:'',date:visitDate,time:visitTime,status:'pending',message:visitMsg};
                    await bookVisit(property.id,bk);
                    setVisitDate('');setVisitMsg('');setSuccessMsg('Visit booked! The agent will confirm shortly.');
                  }} className="btn-primary" style={{width:'100%',background:'#3b82f6'}}><Calendar size={16} style={{display:'inline',marginRight:'6px'}}/>Confirm Visit Booking</button>
                </div>
              ):(<p style={{color:'var(--text-muted)'}}>Please <Link to="/login" style={{color:'var(--primary-color)'}}>login</Link> to book a visit.</p>)}
            </div>
          )}

          {/* ── Report Tab ── */}
          {activeTab==='report'&&(
            <div style={{marginTop:'1.5rem'}}>
              <h3 style={{marginBottom:'0.5rem',color:'#ef4444'}}>🚨 Report this Listing</h3>
              <p style={{color:'var(--text-muted)',fontSize:'0.85rem',marginBottom:'1rem'}}>Help keep Nyumba safe. Report scams or fake listings.</p>
              {property.reports&&property.reports.length>0&&(<div style={{marginBottom:'1rem',padding:'0.75rem',background:'rgba(239,68,68,0.08)',borderRadius:'8px',border:'1px solid rgba(239,68,68,0.2)'}}><strong style={{fontSize:'0.85rem',color:'#ef4444'}}>⚠️ {property.reports.length} report(s) already filed on this listing.</strong></div>)}
              {user?(
                <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
                  <select value={reportReason} onChange={e=>setReportReason(e.target.value as Report['reason'])} style={{width:'100%',padding:'0.7rem',borderRadius:'8px',background:'var(--bg-color)',border:'1px solid var(--border-color)',color:'var(--text-main)'}}>
                    <option value="scam">Scam / Fraud</option>
                    <option value="fake_photos">Fake Photos</option>
                    <option value="wrong_location">Wrong Location</option>
                    <option value="duplicate">Duplicate Listing</option>
                    <option value="other">Other</option>
                  </select>
                  <textarea value={reportDetails} onChange={e=>setReportDetails(e.target.value)} placeholder="Describe the problem..." rows={3} style={{width:'100%',resize:'vertical',padding:'0.75rem',borderRadius:'8px',background:'var(--bg-color)',border:'1px solid var(--border-color)',color:'var(--text-main)'}} />
                  <button onClick={async()=>{
                    if(!reportDetails.trim())return;
                    const rep:Report={id:Date.now().toString(),userId:user.id,reason:reportReason,details:reportDetails,date:new Date().toLocaleDateString()};
                    await reportProperty(property.id,rep);
                    setReportDetails('');setSuccessMsg('Report submitted. Our team will review it.');
                  }} className="btn-primary" style={{width:'100%',background:'#ef4444'}}><AlertTriangle size={16} style={{display:'inline',marginRight:'6px'}}/>Submit Report</button>
                </div>
              ):(<p style={{color:'var(--text-muted)'}}>Please <Link to="/login" style={{color:'var(--primary-color)'}}>login</Link> to report.</p>)}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
