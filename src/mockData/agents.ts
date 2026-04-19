export interface Agent {
  id: string;
  name: string;
  phone: string;
  latitude: number;
  longitude: number;
  lastSeen: string;
  rating: number;
  propertiesCount: number;
  email: string;
}

export const mockAgents: Agent[] = [
  {
    id: "a1",
    name: "Juma Hassan",
    phone: "+255792546865",
    latitude: -6.7820,
    longitude: 39.2480,
    lastSeen: "Just now",
    rating: 4.8,
    propertiesCount: 12,
    email: "evanskaija1576@gmail.com"
  },
  {
    id: "a2",
    name: "Fatma Said",
    phone: "+255792546865",
    latitude: -6.7650,
    longitude: 39.2450,
    lastSeen: "2 mins ago",
    rating: 4.9,
    propertiesCount: 8,
    email: "evapedri20@gmail.com"
  },
  {
    id: "a3",
    name: "Baraka Mushi",
    phone: "+255792546865",
    latitude: -6.7400,
    longitude: 39.2700,
    lastSeen: "Just now",
    rating: 4.5,
    propertiesCount: 20,
    email: "info@dalali.co.tz"
  },
  {
    id: "a4",
    name: "Neema John",
    phone: "+255792546865",
    latitude: -6.7850,
    longitude: 39.2200,
    lastSeen: "5 mins ago",
    rating: 4.7,
    propertiesCount: 5,
    email: "support@dalali.co.tz"
  }
];
