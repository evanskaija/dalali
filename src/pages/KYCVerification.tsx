import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Upload, CheckCircle, Clock, Shield, Camera, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type KYCStep = 'intro' | 'id' | 'selfie' | 'submitted';

export const KYCVerification: React.FC = () => {
  const [step, setStep] = useState<KYCStep>('intro');
  const [idType, setIdType] = useState('nida');
  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const { t } = useLanguage();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'id' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (type === 'id') setIdPreview(url);
    else setSelfiePreview(url);
  };

  const steps = [
    { key: 'intro', label: 'Get Started', icon: <Shield size={18} /> },
    { key: 'id', label: 'Upload ID', icon: <FileText size={18} /> },
    { key: 'selfie', label: 'Take Selfie', icon: <Camera size={18} /> },
    { key: 'submitted', label: 'Submitted', icon: <CheckCircle size={18} /> },
  ];
  const stepIndex = steps.findIndex(s => s.key === step);

  if (step === 'submitted') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)' }}>
        <Navbar />
        <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '80px' }}>
          <div className="glass" style={{ padding: '4rem 2.5rem', textAlign: 'center', borderRadius: 'var(--border-radius)', maxWidth: '500px', width: '100%' }}>
            <div style={{ background: 'rgba(16,185,129,0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-color)' }}>
              <Clock size={40} />
            </div>
            <h2>Under Review</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Your KYC documents have been submitted successfully. Our admin team will review your information within <strong style={{ color: 'var(--primary-color)' }}>24-48 hours</strong>.
            </p>
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid var(--primary-color)', borderRadius: '12px', padding: '1rem', marginBottom: '2rem' }}>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>You will receive an SMS notification once your account is verified.</p>
            </div>
            <button className="btn-primary" onClick={() => setStep('intro')}>Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', paddingBottom: '4rem' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '700px', marginTop: '100px', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '2rem' }}>
          <h1>{t('kyc.title')}</h1>
          <p className="text-muted">{t('kyc.subtitle')}</p>
        </div>

        {/* Progress Steps */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: 0 }}>
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: i <= stepIndex ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                  border: `2px solid ${i <= stepIndex ? 'var(--primary-color)' : 'var(--border-color)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: i <= stepIndex ? 'white' : 'var(--text-muted)',
                  transition: 'all 0.3s ease'
                }}>
                  {s.icon}
                </div>
                <span style={{ fontSize: '0.7rem', color: i <= stepIndex ? 'var(--primary-color)' : 'var(--text-muted)', fontWeight: i === stepIndex ? 700 : 400, whiteSpace: 'nowrap' }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{ flex: 1, height: '2px', background: i < stepIndex ? 'var(--primary-color)' : 'var(--border-color)', margin: '0 0 20px', transition: 'all 0.3s ease' }} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius)' }}>
          {/* Step: Intro */}
          {step === 'intro' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(16,185,129,0.1)', padding: '1rem', borderRadius: '12px', color: 'var(--primary-color)' }}><Shield size={32} /></div>
                <div>
                  <h3 style={{ margin: 0 }}>Why we verify your identity</h3>
                  <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>To protect all users from scammers and fraudulent listings.</p>
                </div>
              </div>
              {[
                { icon: <FileText size={20} />, title: 'Government ID', desc: 'NIDA Card, Passport, or Driving License' },
                { icon: <Camera size={20} />, title: 'Live Selfie', desc: 'A clear photo of your face for identity matching' },
                { icon: <Clock size={20} />, title: '24-48 Hour Review', desc: 'Admin approves or rejects your verification request' },
              ].map(item => (
                <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', marginBottom: '0.75rem' }}>
                  <div style={{ color: 'var(--primary-color)' }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '2px' }}>{item.title}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
              <button className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1.5rem' }} onClick={() => setStep('id')}>
                Start Verification
              </button>
            </div>
          )}

          {/* Step: Upload ID */}
          {step === 'id' && (
            <div>
              <h3 style={{ marginTop: 0 }}>Upload Government ID</h3>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>ID Type</label>
                <select value={idType} onChange={e => setIdType(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)' }}>
                  <option value="nida">NIDA Card</option>
                  <option value="passport">Passport</option>
                  <option value="driving">Driving License</option>
                </select>
              </div>
              <label style={{ display: 'block', cursor: 'pointer' }}>
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', transition: 'all 0.2s' }}>
                  {idPreview ? (
                    <img src={idPreview} alt="ID Preview" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }} />
                  ) : (
                    <>
                      <Upload size={36} style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--primary-color)' }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>Click to upload your {idType === 'nida' ? 'NIDA Card' : idType === 'passport' ? 'Passport' : 'Driving License'}</p>
                      <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>JPG, PNG or PDF up to 5MB</p>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*,.pdf" style={{ display: 'none' }} onChange={e => handleFileChange(e, 'id')} />
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn-outline" style={{ flex: 1, padding: '0.85rem' }} onClick={() => setStep('intro')}>Back</button>
                <button className="btn-primary" style={{ flex: 1, padding: '0.85rem' }} onClick={() => setStep('selfie')} disabled={!idPreview}>
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step: Selfie */}
          {step === 'selfie' && (
            <div>
              <h3 style={{ marginTop: 0 }}>Take a Selfie</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Ensure your face is clearly visible and matches your ID document.</p>
              <label style={{ display: 'block', cursor: 'pointer' }}>
                <div style={{ border: '2px dashed var(--border-color)', borderRadius: '12px', padding: '2rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)' }}>
                  {selfiePreview ? (
                    <img src={selfiePreview} alt="Selfie Preview" style={{ maxWidth: '200px', height: '200px', objectFit: 'cover', borderRadius: '50%', margin: '0 auto', display: 'block' }} />
                  ) : (
                    <>
                      <Camera size={36} style={{ margin: '0 auto 1rem', display: 'block', color: 'var(--primary-color)' }} />
                      <p style={{ margin: 0, fontWeight: 600 }}>Upload a clear selfie photo</p>
                      <p style={{ margin: '6px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>Hold the camera at eye level in good lighting</p>
                    </>
                  )}
                </div>
                <input type="file" accept="image/*" capture="user" style={{ display: 'none' }} onChange={e => handleFileChange(e, 'selfie')} />
              </label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button className="btn-outline" style={{ flex: 1, padding: '0.85rem' }} onClick={() => setStep('id')}>Back</button>
                <button className="btn-primary" style={{ flex: 1, padding: '0.85rem' }} onClick={() => setStep('submitted')} disabled={!selfiePreview}>
                  Submit for Review
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
