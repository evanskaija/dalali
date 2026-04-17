import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { HelpCircle, MessageCircle, Phone, Book, ChevronDown, ChevronUp, Search, Shield, User, Home } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Footer } from '../components/Footer';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass" style={{ marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden', border: `1px solid ${isOpen ? 'var(--primary-color)' : 'var(--border-color)'}` }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ width: '100%', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--text-main)', fontWeight: 600 }}
      >
        <span>{question}</span>
        {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 1.5rem 1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.6' }}>
          {answer}
        </div>
      )}
    </div>
  );
};

export const Support: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<'tenant' | 'dalali' | 'payment'>('tenant');
  const { t } = useLanguage();

  const faqs = {
    tenant: [
      { q: 'How do I book a viewing?', a: 'Find a house on the map, click "Apply / Book", and select your preferred date and time. The agent will receive your request instantly.' },
      { q: 'Is my payment safe?', a: 'Yes! All payments are held in escrow. The Dalali only receives the funds once you confirm you have moved into the house.' },
      { q: 'Can I contact the landlord directly?', a: 'Some listings are posted by landlords directly, while others are via verified Dalalis. You can see the provider details on the property card.' },
    ],
    dalali: [
      { q: 'How do I get verified (KYC)?', a: 'Go to your profile, click "Verify Identity", and upload a clear photo of your ID (NIDA/Voters Card) and a selfie. Approval takes 24-48 hours.' },
      { q: 'Can I list multiple rooms in one property?', a: 'Yes! On the "Post Property" page, use the "Add Another Unit" button to list many rooms with their own prices and details.' },
      { q: 'What is the platform fee?', a: 'We charge a small 5% service fee on every successful payment to cover platform maintenance and marketing.' },
    ],
    payment: [
      { q: 'Which mobile networks are supported?', a: 'We currently support M-Pesa, Airtel Money, and all major Credit/Debit cards.' },
      { q: 'What if the dalali disappears after payment?', a: 'Because of our Escrow system, your money is safe. If the move-in fails, you can raise a dispute, and we will refund your money.' },
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'var(--bg-color)', paddingTop: '76px' }}>
      <Navbar />
      
      {/* Header */}
      <section style={{ padding: '4rem 0', background: 'rgba(16,185,129,0.05)', textAlign: 'center' }}>
        <div className="container">
          <HelpCircle size={48} color="var(--primary-color)" style={{ marginBottom: '1.5rem' }} />
          <h1>{t('nav.support')} Center</h1>
          <p className="text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>Everything you need to know about using DalaliApp safely and efficiently.</p>
          
          <div style={{ position: 'relative', maxWidth: '500px', margin: '2rem auto 0' }}>
            <Search size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search for answers..." 
              style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '30px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-main)', boxSizing: 'border-box' }}
            />
          </div>
        </div>
      </section>

      <section className="container" style={{ padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: 'minmax(250px, 1fr) 3fr', gap: '3rem' }}>
        {/* Sidebar categories */}
        <aside style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
          <button 
            onClick={() => setActiveCategory('tenant')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px', border: 'none', background: activeCategory === 'tenant' ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)', color: activeCategory === 'tenant' ? 'white' : 'var(--text-main)', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
          >
            <User size={20} /> For Tenants
          </button>
          <button 
            onClick={() => setActiveCategory('dalali')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px', border: 'none', background: activeCategory === 'dalali' ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)', color: activeCategory === 'dalali' ? 'white' : 'var(--text-main)', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
          >
            <Home size={20} /> For Dalalis & Landlords
          </button>
          <button 
            onClick={() => setActiveCategory('payment')}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '1rem', borderRadius: '12px', border: 'none', background: activeCategory === 'payment' ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)', color: activeCategory === 'payment' ? 'white' : 'var(--text-main)', cursor: 'pointer', textAlign: 'left', fontWeight: 600 }}
          >
            <Shield size={20} /> Payments & Safety
          </button>

          <div className="glass" style={{ marginTop: '2rem', padding: '1.5rem', borderRadius: '15px', border: '1px solid var(--primary-color)' }}>
            <h4 style={{ margin: '0 0 1rem' }}>Need Direct Help?</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href="tel:+2557000000" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                <Phone size={18} color="var(--primary-color)" /> +255 700 000 000
              </a>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-main)', fontSize: '0.9rem' }}>
                <MessageCircle size={18} color="var(--primary-color)" /> Open Live Support
              </div>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div>
          <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Book size={28} color="var(--primary-color)" /> 
            Frequently Asked Questions
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {faqs[activeCategory].map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>

          <div className="glass" style={{ marginTop: '3rem', padding: '2.5rem', borderRadius: '20px', textAlign: 'center' }}>
            <h3>Still have questions?</h3>
            <p className="text-muted" style={{ marginBottom: '2rem' }}>Our support team is available 24/7 to assist you with any issues.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" style={{ padding: '1rem 2rem' }}>Email Support</button>
              <button className="btn-outline" style={{ padding: '1rem 2rem' }}>Chat on WhatsApp</button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ padding: '4rem 0', background: 'rgba(255,255,255,0.02)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          {['Escrow Protected', 'NIDA Verified', '24/7 Support', 'M-Pesa Integrated'].map(badge => (
            <div key={badge} style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>
              <Shield size={20} color="var(--primary-color)" /> {badge}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};
