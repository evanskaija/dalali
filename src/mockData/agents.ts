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
  { id: 'a1', name: 'Juma Hassan', phone: '+255792546865', latitude: -6.7924, longitude: 39.2083, lastSeen: '2 mins ago', rating: 4.8, propertiesCount: 12, email: 'evanskaija1576@gmail.com' },
  { id: 'a2', name: 'Fatma Said', phone: '+255792546865', latitude: -6.7824, longitude: 39.2183, lastSeen: '5 mins ago', rating: 4.9, propertiesCount: 8, email: 'evapedri20@gmail.com' },
  { id: 'a3', name: 'Baraka Mushi', phone: '+255792546865', latitude: -6.7724, longitude: 39.2283, lastSeen: '1 hour ago', rating: 4.5, propertiesCount: 25, email: 'info@dalali.co.tz' },
];
