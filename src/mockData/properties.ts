export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  type: 'apartment' | 'house' | 'room' | 'master-room' | 'plot' | 'hall';
  bedrooms: number;
  bathrooms: number;
  images: string[];
  video?: string;
  status: 'available' | 'occupied' | 'ordered';
  distance?: number;
  latitude: number;
  longitude: number;
  agentId: string;
  orderedBy?: string; // User ID who ordered it
  orderedUntil?: string; // ISO date string when order expires
  isPremium: boolean;
  amenities?: {
    electricity?: 'private' | 'sharable';
    water?: 'dawasa' | 'borehole' | 'tank';
    fenced?: boolean;
    electricFence?: boolean;
    cctv?: boolean;
    securityGuard?: boolean;
    tiled?: boolean;
    gypsum?: boolean;
    ac?: boolean;
    aluminumWindows?: boolean;
    measurements?: string; // e.g. "20m x 30m" for Kiwanja
    capacity?: number; // for Halls
    sizeSqm?: number; // for Apartments/Houses
    soundSystem?: boolean; // for Halls
    kitchen?: boolean; 
  };
}

export const mockProperties: Property[] = [
  {
    id: '001',
    title: '001 - Modern Apartment',
    price: 1200000,
    location: 'Sinza / Mori',
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800'],
    status: 'available',
    latitude: -6.7824,
    longitude: 39.2283,
    agentId: 'a1',
    isPremium: true,
    amenities: { tiled: true, parking: true }
  },
  {
    id: '004',
    title: '004 - Luxury Beach Villa',
    price: 15000000,
    location: 'Mbezi Beach / Africana',
    type: 'house',
    bedrooms: 5,
    bathrooms: 4,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-interior-view-28203-large.mp4',
    status: 'available',
    latitude: -6.7224,
    longitude: 39.2183,
    agentId: 'a1',
    isPremium: true,
    amenities: { cctv: true, swimmingPool: true as any }
  },
  {
    id: '008',
    title: '008 - Executive Residence',
    price: 12000000,
    location: 'Kigamboni / Kibada',
    type: 'house',
    bedrooms: 4,
    bathrooms: 3,
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-in-a-mountainous-landscape-34571-large.mp4',
    status: 'available',
    latitude: -6.8324,
    longitude: 39.3183,
    agentId: 'a1',
    isPremium: true,
    amenities: { fenced: true, securityGuard: true }
  },
  {
    id: 'Kiwanja-Somangila',
    title: 'Kiwanja - Somangila',
    price: 120000000,
    location: 'Somangila, Kigamboni',
    type: 'plot',
    bedrooms: 0,
    bathrooms: 0,
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'],
    status: 'available',
    latitude: -6.8524,
    longitude: 39.3383,
    agentId: 'a1',
    isPremium: false,
    amenities: { measurements: '25m x 40m' }
  }
];
