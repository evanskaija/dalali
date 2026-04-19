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
    parking?: boolean;
    swimmingPool?: boolean;
  };
}

export const mockProperties: Property[] = [];
