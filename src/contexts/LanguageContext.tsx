import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'sw';

interface Translations {
  [key: string]: { en: string; sw: string };
}

const translations: Translations = {
  // Navbar
  'nav.home': { en: 'Home', sw: 'Nyumbani' },
  'nav.search': { en: 'Search for Property', sw: 'Tafuta Nyumba' },
  'nav.post': { en: 'Post Property', sw: 'Weka Nyumba' },
  'nav.login': { en: 'Login', sw: 'Ingia' },
  'nav.chat': { en: 'Chat', sw: 'Mazungumzo' },
  'nav.saved': { en: 'Saved', sw: 'Zilizohifadhiwa' },
  'nav.support': { en: 'Help Center', sw: 'Msaada' },

  // Hero
  'hero.title.1': { en: 'Find your perfect ', sw: 'Pata ' },
  'hero.title.2': { en: 'home', sw: 'nyumba yako kamili' },
  'hero.subtitle': { en: 'The smartest way to rent rooms, apartments, and houses directly from trusted landlords and agents. No hassle, just moving.', sw: 'Njia bora ya kupanga vyumba na nyumba moja kwa moja kutoka kwa wamiliki na madalali waaminifu. Hakuna usumbufu.' },
  'hero.searchPlaceholder': { en: 'Where do you want to live?', sw: 'Unataka kuishi wapi?' },
  'hero.searchBtn': { en: 'Search', sw: 'Tafuta' },
  'hero.addedToday': { en: 'Homes added today', sw: 'Nyumba zilizowekwa leo' },

  // Categories
  'cat.fullHouse': { en: 'Full House', sw: 'Nyumba Nzima' },
  'cat.apartments': { en: 'Apartments', sw: 'Apartmenti' },
  'cat.rooms': { en: 'Single Room', sw: 'Chumba Kimoja' },
  'cat.masterRoom': { en: 'Master Room', sw: 'Chumba Kikubwa' },
  'cat.plots': { en: 'Compounds / Kiwanja', sw: 'Viwanja' },
  'cat.halls': { en: 'Halls / Ukumbi', sw: 'Kumbi za Sherehe' },

  // Sections
  'home.nearby': { en: 'Nearby Properties', sw: 'Nyumba Zilizo Karibu' },
  'home.viewAll': { en: 'View All', sw: 'Tazama Zote' },
  'home.howItWorks': { en: 'How NyumbaApp Works', sw: 'Jinsi NyumbaApp Inavyofanya Kazi' },
  'home.step1.title': { en: '1. Search Location', sw: '1. Tafuta Eneo' },
  'home.step1.desc': { en: 'Find properties near you using our map-based search.', sw: 'Tafuta nyumba karibu nawe ukitumia ramani.' },
  'home.step2.title': { en: '2. Request Viewing', sw: '2. Omba Kuona' },
  'home.step2.desc': { en: 'Contact the landlord or agent directly through the app.', sw: 'Wasiliana na mmiliki au dalali moja kwa moja kupitia app.' },
  'home.step3.title': { en: '3. Move In', sw: '3. Hamia' },
  'home.step3.desc': { en: 'Pay rent securely and track your lease on the dashboard.', sw: 'Lipa kodi kwa usalama na fuatilia mkataba wako.' },

  // Footer
  'footer.desc': { en: 'The leading platform connecting tenants directly to verified property owners in Tanzania.', sw: 'Mtandao unaoongoza kuunganisha wapangaji na wamiliki nchini Tanzania.' },
  'footer.tenants': { en: 'For Tenants', sw: 'Kwa Wapangaji' },
  'footer.mapView': { en: 'Map View', sw: 'Ramani' },
  'footer.saved': { en: 'Saved Properties', sw: 'Nyumba Zilizohifadhiwa' },
  'footer.landlords': { en: 'For Landlords', sw: 'Kwa Wamiliki' },
  'footer.addProp': { en: 'Add Property', sw: 'Ongeza Nyumba' },
  'footer.manage': { en: 'Manage Requests', sw: 'Simamia Maombi' },
  'footer.payments': { en: 'Payments', sw: 'Malipo' },

  // Map Search
  'map.search': { en: 'Map Search', sw: 'Tafuta Kwenye Ramani' },
  'map.all': { en: 'All', sw: 'Zote' },
  'map.properties': { en: 'Properties', sw: 'Nyumba' },
  'map.liveAgents': { en: 'Live Agents', sw: 'Madalali Wapya' },
  'map.allStreets': { en: 'All Streets / Areas', sw: 'Mitaa Yote / Maeneo' },
  'map.nearbyProp': { en: 'Nearby Properties', sw: 'Nyumba za Karibu' },
  'map.activeDalalis': { en: 'Active Dalalis', sw: 'Madalali Wenye Kumulika' },
  'map.propertiesListed': { en: 'properties listed', sw: 'Kazi zinazopatikana' },
  'map.lastSeen': { en: 'Last seen', sw: 'Ilionekana mwisho' },
  'map.orderApply': { en: 'Order / Apply', sw: 'Agiza / Omba' },
  'map.applyThis': { en: 'Apply / Book this Property', sw: 'Omba / Kitabu Nyumba Hii' },
  'map.contact': { en: 'Contact', sw: 'Wasiliana' },
  'map.radius': { en: 'Search Radius', sw: 'Eneo la Kutafuta' },
  'map.max': { en: 'Max', sw: 'Ukomo' },
  'map.advancedFilters': { en: 'Advanced Filters', sw: 'Vichujio Zaidi' },
  'map.priceRange': { en: 'Price Range', sw: 'Kiwango cha Bei' },
  'map.amenities': { en: 'Amenities', sw: 'Huduma' },
  'map.water': { en: 'Water', sw: 'Maji' },
  'map.electricity': { en: 'Electricity', sw: 'Umeme' },
  'map.parking': { en: 'Parking', sw: 'Maegesho' },
  
  // Login
  'login.welcome': { en: 'Welcome Back', sw: 'Karibu Tena' },
  'login.createAccount': { en: 'Create Account', sw: 'Tengeneza Akaunti' },
  'login.tenant': { en: 'Tenant', sw: 'Mpangaji' },
  'login.dalali': { en: 'Dalali / Landlord', sw: 'Dalali / Mmiliki' },
  'login.fullName': { en: 'Full Name', sw: 'Jina Kamili' },
  'login.phone': { en: 'Phone Number', sw: 'Namba ya Simu' },
  'login.email': { en: 'Email Address', sw: 'Barua Pepe' },
  'login.emailOrPhone': { en: 'Email or Phone', sw: 'Barua Pepe au Simu' },
  'login.password': { en: 'Password', sw: 'Nenosiri' },
  'login.signUp': { en: 'Sign Up', sw: 'Jisajili' },
  'login.logIn': { en: 'Log In', sw: 'Ingia' },
  'login.alreadyHave': { en: 'Already have an account? ', sw: 'Tayari una akaunti? ' },
  'login.dontHave': { en: "Don't have an account? ", sw: 'Hauna akaunti? ' },

  // Chat
  'chat.messages': { en: 'Messages', sw: 'Ujumbe' },
  'chat.placeholder': { en: 'Type a message...', sw: 'Andika ujumbe...' },
  'chat.call': { en: 'Call', sw: 'Piga Simu' },
  'chat.online': { en: 'Online', sw: 'Hapo' },
  'chat.offline': { en: 'Offline', sw: 'Hayupo' },

  // Admin
  'admin.dashboard': { en: 'Admin Dashboard', sw: 'Dashibodi ya Admin' },
  'admin.monitor': { en: 'Monitor users, listings, and platform activity.', sw: 'Fuatilia watumiaji, nyumba, na shughuli za mtandao.' },
  'admin.totalUsers': { en: 'Total Users', sw: 'Watumiaji Jumla' },
  'admin.activeListings': { en: 'Active Listings', sw: 'Nyumba Zilizopo' },
  'admin.fraudAlerts': { en: 'Fraud Alerts', sw: 'Tahadhari za Utapeli' },
  'admin.pendingKyc': { en: 'Pending KYC', sw: 'KYC Inayosubiri' },

  // KYC
  'kyc.title': { en: 'KYC Verification', sw: 'Uhakiki wa Utambuzi (KYC)' },
  'kyc.subtitle': { en: 'Verify your identity to gain full access.', sw: 'Hakiki utambulisho wako ili kupata huduma zote.' },
  'kyc.uploadId': { en: 'Upload Government ID', sw: 'Weka Kitambulisho' },
  'kyc.takeSelfie': { en: 'Take a Selfie', sw: 'Piga Selfie' },
  'kyc.review': { en: 'Under Review', sw: 'Inahakikiwa' },

  // Payment
  'pay.secure': { en: 'Secure Payment', sw: 'Malipo Salama' },
  'pay.escrow': { en: 'Funds held in escrow', sw: 'Pesa zinatunzwa kwa usalama' },
  'pay.summary': { en: 'Payment Summary', sw: 'Muhtasari wa Malipo' },
  'pay.total': { en: 'Total', sw: 'Jumla' },
  'pay.confirm': { en: 'Confirm Payment', sw: 'Thibitisha Malipo' },

  // Home Extras
  'home.aiRecs': { en: 'Smart Matches', sw: 'Mapendekezo Poa' },
  'home.trending': { en: 'Trending Areas', sw: 'Maeneo Yanayovuma' },
  'home.reviews': { en: 'What Tenants Say', sw: 'Maoni ya Wapangaji' },

  // Booking
  'book.title': { en: 'Schedule a Viewing', sw: 'Panga Muda wa Kuona' },
  'book.success': { en: 'Viewing Scheduled!', sw: 'Nafasi Imepangwa!' },
  'book.date': { en: 'Select Date', sw: 'Chagua Tarehe' },
  'book.time': { en: 'Select Time', sw: 'Chagua Muda' },
  'book.note': { en: 'Message to Agent (Optional)', sw: 'Ujumbe kwa Dalali (Sio Lazima)' },
  'book.confirm': { en: 'Confirm Viewing Request', sw: 'Thibitisha Ombi la Kuona' },

  // Negotiation
  'neg.title': { en: 'Direct Negotiation', sw: 'Mazungumzo ya Bei' },
  'neg.makeOffer': { en: 'Make Offer', sw: 'Toa Ofa' },
  'neg.nego': { en: 'Negotiate', sw: 'Gusa Bei' },
  'neg.enterAmount': { en: 'Enter your offer amount...', sw: 'Weka kiasi cha ofa yako...' },
  'neg.yourCounter': { en: 'Enter counter-offer...', sw: 'Weka ofa ya kukabiliana...' },
  'neg.addMessage': { en: 'Add a message (optional)', sw: 'Ongeza ujumbe (sio lazima)' },
  'neg.sendOffer': { en: 'Send Offer', sw: 'Tuma Ofa' },
  'neg.counter': { en: 'Counter', sw: 'Ofa Mpya' },
  'neg.accept': { en: 'Accept', sw: 'Kubali' },
  'neg.startTitle': { en: 'Start Negotiation', sw: 'Anza Mazungumzo' },
  'neg.startDesc': { en: 'Message the agent with your best price. You can bid directly on this property.', sw: 'Mtumie dalali bei yako bora. Unaweza kuomba kupunguziwa bei hapa.' },
  'neg.aiSuggested': { en: 'AI Price Analysis', sw: 'Uchunguzi wa Bei wa AI' },
  'neg.lowBall': { en: 'Aggressive', sw: 'Ofa ya Chini' },
  'neg.fair': { en: 'Fair Market', sw: 'Bei ya Soko' },
  'neg.safe': { en: 'Safe / Fast', sw: 'Ofa ya Haraka' },
  'neg.dealDone': { en: 'Agreement Reached!', sw: 'Mmekubaliana!' },
  'neg.dealMsg': { en: 'The agent has accepted your offer. You can now proceed to book a viewing or pay.', sw: 'Dalali amekubali ofa yako. Sasa unaweza kupanga muda wa kuona au kulipia.' },

  // Market Insights
  'market.title': { en: 'Market Insights', sw: 'Hali ya Soko' },
  'market.avgRent': { en: 'Average Rent', sw: 'Wastani wa Kodi' },
  'market.trends': { en: 'Trends', sw: 'Mielekeo' },
  'market.listingDaily': { en: 'listings today', sw: 'nyumba mpya leo' },

  // Anti-Scam
  'scam.report': { en: 'Report Listing', sw: 'Ripoti Nyumba Hii' },
  'scam.reason': { en: 'Reason for report', sw: 'Sababu ya kuripoti' },
  'scam.verifiedOnly': { en: 'Verified Only', sw: 'Iliyohakikiwa Pekee' },
  'scam.protected': { en: 'Protected Payment', sw: 'Malipo Salama' },

  // Chat Local
  'chat.hidePhone': { en: 'Privacy Mode (Hide Phone)', sw: 'Ficha Namba ya Simu' },

  // Common
  'common.back': { en: 'Back', sw: 'Rudi Nyuma' },
  'common.share': { en: 'Share', sw: 'Shiriki' },
  'common.save': { en: 'Save', sw: 'Hifadhi' },
  'common.continue': { en: 'Continue', sw: 'Endelea' },
  'common.cancel': { en: 'Cancel', sw: 'Ghairi' },
  
  // Search Portal
  'search.title': { en: 'Search Property', sw: 'Tafuta Nyumba' },
  'search.step': { en: 'Step', sw: 'Hatua ya' },
  'search.of': { en: 'of', sw: 'kati ya' },
  'search.selectCategory': { en: 'Select a category', sw: 'Chagua aina ya nyumba' },
  'search.selectLocation': { en: 'Select a location', sw: 'Chagua eneo' },
  'search.changeCategory': { en: 'Change Category', sw: 'Badilisha Aina' },
  'search.generalInfo': { en: 'General Property Info', sw: 'Taarifa za Nyumba kwa Ujumla' },
  'search.streetName': { en: 'Street or Compound Name', sw: 'Jina la Mtaa au Eneo' },
  'search.selectStreet': { en: 'Select a Street...', sw: 'Chagua Mtaa...' },
  'search.showAll': { en: 'Show All', sw: 'Onyesha Zote' },
  'search.changeSelection': { en: 'Change Selection', sw: 'Badilisha Maamuzi' },
};

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'en' ? 'sw' : 'en'));
  };

  const t = (key: string): string => {
    return translations[key] ? translations[key][language] : key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
