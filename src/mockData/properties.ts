export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Report {
  id: string;
  userId: string;
  reason: 'scam' | 'fake_photos' | 'wrong_location' | 'duplicate' | 'other';
  details: string;
  date: string;
}

export interface VisitBooking {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  date: string; // ISO date string
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  message?: string;
}

export interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  location: string;
  type: 'apartment' | 'house' | 'room' | 'master-room' | 'plot' | 'hall' | 'farm' | 'retail' | 'office';
  bedrooms: number;
  bathrooms: number;
  images: string[];
  video?: string;
  status: 'available' | 'occupied' | 'ordered';
  distance?: number;
  latitude: number;
  longitude: number;
  agentId: string;
  orderedBy?: string;
  orderedUntil?: string;
  isPremium: boolean;
  isVerified?: boolean;        // ✅ Owner/agent is KYC verified
  verifiedBy?: string;         // Admin who verified
  reviews?: Review[];          // ⭐ Ratings & Reviews
  reports?: Report[];          // 🚨 Scam/Fake reports
  visitBookings?: VisitBooking[]; // 📅 Visit scheduling
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
    measurements?: string;
    capacity?: number;
    sizeSqm?: number;
    soundSystem?: boolean;
    kitchen?: boolean;
    parking?: boolean;
    swimmingPool?: boolean;
  };
}

export const mockProperties: Property[] = [];
