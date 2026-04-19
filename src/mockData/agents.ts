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

export const mockAgents: Agent[] = [];
