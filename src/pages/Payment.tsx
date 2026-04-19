import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Phone, CreditCard, Shield, CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from '../contexts/NotificationContext';

type PayStep = 'details' | 'confirm' | 'processing' | 'success';

interface PaymentPageProps {
  propertyTitle?: string;
  amount?: number;
}

export const Payment: React.FC<PaymentPageProps> = ({
  propertyTitle = 'Modern Studio Apartment - Kijitonyama',
  amount = 350000,
}) => {
  const [step, setStep] = useState<PayStep>('details');
  const [method, setMethod] = useState<'mpesa' | 'airtel' | 'card'>('mpesa');
  const [phone, setPhone] = useState('');
  const { addNotification } = useNotifications();
  const { t } = useLanguage();

  const serviceFee = Math.round(amount * 0.05);
  const total = amount + serviceFee;

  const handleConfirm = () => {
    setStep('processing');
    setTimeout(() => {
      setStep('success');
      addNotification({
        title: 'Payment Confirmed 🎉',
        message: `TZS ${total.toLocaleString()} held in escrow for "${propertyTitle}". Funds release upon move-in confirmation.`,
        type: 'payment',
      });
    }, 3000);
  };

  const methodOptions = [
    { id: 'mpesa', label: 'M-Pesa', color: '#00a651', icon: '📱' },
    { id: 'airtel', label: 'Airtel Money', color: '#e40000', icon: '📲' },
    { id: 'card', label: 'Card', color: '#1a56db', icon: '💳' },
  ];

  if (step === 'processing') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', alignItems: 'center', justifyContent: 'center' }}>
        <Navbar />
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '80px', height: '80px', border: '4px solid var(--border-color)', borderTop: '4px solid var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 2rem' }} />
          <h2>Processing Payment...</h2>
          <p style={{ color: 'var(--text-muted)' }}>Please wait. Do not close this page.</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1rem' }}>🔒 Secured by 256-bit SSL encryption</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '76px' }}>
        <Navbar />
        <div className="container" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="glass" style={{ padding: '4rem 2.5rem', textAlign: 'center', borderRadius: 'var(--border-radius)', maxWidth: '480px', width: '100%' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(16,185,129,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'var(--primary-color)' }}>
              <CheckCircle size={48} />
            </div>
            <h2>Payment Secured!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>TZS {total.toLocaleString()} is now held in <strong style={{ color: 'var(--primary-color)' }}>escrow</strong>. Funds will be released to your landlord once you confirm your successful move-in.</p>
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', padding: '1rem', textAlign: 'left', marginBottom: '2rem' }}>
              {[
                { label: 'Property', val: propertyTitle },
                { label: 'Amount Held', val: `TZS ${total.toLocaleString()}` },
                { label: 'Payment Method', val: method.charAt(0).toUpperCase() + method.slice(1) },
                { label: 'Status', val: '🔒 In Escrow' },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{r.label}</span>
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.val}</span>
                </div>
              ))}
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '1rem' }} onClick={() => setStep('details')}>
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', paddingBottom: '4rem', paddingTop: '76px' }}>
      <Navbar />
      <div className="container" style={{ maxWidth: '600px', padding: '2rem 1.5rem' }}>
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Lock size={28} color="var(--primary-color)" />
          <div>
            <h1 style={{ margin: 0 }}>{t('pay.secure')}</h1>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{t('pay.escrow')}</p>
          </div>
        </div>

        {step === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Property Summary */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <h3 style={{ margin: '0 0 1rem' }}>{t('pay.summary')}</h3>
              {[
                { label: 'Property', val: propertyTitle },
                { label: 'Monthly Rent', val: `TZS ${amount.toLocaleString()}` },
                { label: 'Service Fee (5%)', val: `TZS ${serviceFee.toLocaleString()}` },
              ].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid var(--border-color)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                  <span style={{ fontWeight: 500 }}>{r.val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.8rem 0 0', fontWeight: 800, fontSize: '1.1rem' }}>
                <span>{t('pay.total')}</span>
                <span style={{ color: 'var(--primary-color)' }}>TZS {total.toLocaleString()}</span>
              </div>
            </div>

            {/* Escrow Explainer */}
            <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '12px', padding: '1rem', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <Shield size={20} color="#3b82f6" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <strong style={{ color: 'var(--text-main)' }}>Escrow Protection:</strong> Your money is held securely. It is only released to the landlord after <em>you</em> confirm a successful move-in. If anything goes wrong, you get a full refund.
              </div>
            </div>

            {/* Payment Method */}
            <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--border-radius)' }}>
              <h3 style={{ margin: '0 0 1rem' }}>Payment Method</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {methodOptions.map(m => (
                  <button key={m.id} onClick={() => setMethod(m.id as never)}
                    style={{ padding: '0.75rem', borderRadius: '10px', border: `2px solid ${method === m.id ? m.color : 'var(--border-color)'}`, background: method === m.id ? m.color + '15' : 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
                    <span style={{ fontSize: '1.4rem' }}>{m.icon}</span>
                    <span style={{ fontSize: '0.78rem', fontWeight: method === m.id ? 700 : 400, color: method === m.id ? m.color : 'var(--text-muted)' }}>{m.label}</span>
                  </button>
                ))}
              </div>

              {(method === 'mpesa' || method === 'airtel') && (
                <div>
                  <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
                    <Phone size={14} style={{ verticalAlign: 'middle', marginRight: '6px' }} />
                    {method === 'mpesa' ? 'M-Pesa' : 'Airtel Money'} Phone Number
                  </label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="e.g. 0712 345 678"
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', boxSizing: 'border-box', fontSize: '0.95rem', outline: 'none' }} />
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '6px 0 0' }}>You will receive a push notification to confirm payment on your phone.</p>
                </div>
              )}

              {method === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <input type="text" placeholder="Card Number" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', boxSizing: 'border-box', outline: 'none' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <input type="text" placeholder="MM/YY" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', outline: 'none' }} />
                    <input type="text" placeholder="CVV" style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', outline: 'none' }} />
                  </div>
                </div>
              )}
            </div>

            <button className="btn-primary" style={{ padding: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '1rem' }} onClick={() => setStep('confirm')}>
              {t('pay.confirm')} <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 'confirm' && (
          <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--border-radius)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
              <CreditCard size={28} color="var(--primary-color)" />
              <h3 style={{ margin: 0 }}>Confirm Payment</h3>
            </div>
            {[
              { label: 'Property', val: propertyTitle },
              { label: 'Total Amount', val: `TZS ${total.toLocaleString()}` },
              { label: 'Payment via', val: method.charAt(0).toUpperCase() + method.slice(1) },
              { label: 'Phone/Card', val: phone || '****' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
                <span style={{ color: 'var(--text-muted)' }}>{r.label}</span>
                <span style={{ fontWeight: 600 }}>{r.val}</span>
              </div>
            ))}
            <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '0.75rem', margin: '1.5rem 0', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
              <Shield size={16} color="#10b981" style={{ flexShrink: 0 }} />
              By confirming, you agree to hold this payment in escrow until move-in confirmation. 100% refundable if property is misrepresented.
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn-outline" style={{ flex: 1, padding: '0.85rem' }} onClick={() => setStep('details')}>Back</button>
              <button className="btn-primary" style={{ flex: 1, padding: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={handleConfirm}>
                <Lock size={16} /> Pay & Hold in Escrow
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
