import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BookingModalProps {
  propertyTitle: string;
  agentName?: string;
  agentPhone?: string;
  onClose: () => void;
  onBooked: (date: string, time: string) => void;
}

const TIME_SLOTS = ['08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];

export const BookingModal: React.FC<BookingModalProps> = ({ propertyTitle, agentName, onClose, onBooked }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [note, setNote] = useState('');
  const [booked, setBooked] = useState(false);
  const { t } = useLanguage();

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1);
    return { value: d.toISOString().split('T')[0], label: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) };
  });

  const handleBook = () => {
    if (!selectedDate || !selectedTime) return;
    setBooked(true);
    setTimeout(() => {
      onBooked(selectedDate, selectedTime);
      onClose();
    }, 2000);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(8px)' }}>
      <div className="glass" style={{ width: '100%', maxWidth: '500px', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ margin: 0 }}>{t('book.title')}</h3>
            <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{propertyTitle}</p>
          </div>
          <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        {booked ? (
          <div style={{ padding: '3rem', textAlign: 'center' }}>
            <CheckCircle size={56} color="#10b981" style={{ margin: '0 auto 1rem', display: 'block' }} />
            <h3>{t('book.success')}</h3>
            <p style={{ color: 'var(--text-muted)' }}>Your request has been sent to {agentName || 'the agent'}. You will receive an SMS confirmation shortly.</p>
          </div>
        ) : (
          <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Date Selection */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '0.75rem' }}>
                <Calendar size={16} color="var(--primary-color)" /> {t('book.date')}
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                {dates.map(d => (
                  <button key={d.value} onClick={() => setSelectedDate(d.value)}
                    style={{
                      padding: '0.6rem 1rem', borderRadius: '10px', border: `1px solid ${selectedDate === d.value ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      background: selectedDate === d.value ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                      color: selectedDate === d.value ? 'white' : 'var(--text-main)',
                      cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.82rem', fontWeight: selectedDate === d.value ? 700 : 400,
                      transition: 'all 0.2s'
                    }}>
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600, marginBottom: '0.75rem' }}>
                <Clock size={16} color="var(--primary-color)" /> {t('book.time')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {TIME_SLOTS.map(time => (
                  <button key={time} onClick={() => setSelectedTime(time)}
                    style={{
                      padding: '0.6rem', borderRadius: '8px', border: `1px solid ${selectedTime === time ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      background: selectedTime === time ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.03)',
                      color: selectedTime === time ? 'var(--primary-color)' : 'var(--text-main)',
                      cursor: 'pointer', fontSize: '0.82rem', fontWeight: selectedTime === time ? 700 : 400,
                      transition: 'all 0.2s'
                    }}>
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.5rem' }}>{t('book.note')}</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="e.g. I'll be coming with my family to view the property..."
                rows={3}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.03)', color: 'var(--text-main)', resize: 'none', outline: 'none', fontSize: '0.9rem', boxSizing: 'border-box' }}
              />
            </div>

            <button
              className="btn-primary"
              style={{ padding: '1rem', opacity: (!selectedDate || !selectedTime) ? 0.5 : 1, cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer' }}
              onClick={handleBook}
              disabled={!selectedDate || !selectedTime}
            >
              {t('book.confirm')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
