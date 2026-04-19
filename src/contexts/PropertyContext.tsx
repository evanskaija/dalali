import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProperties, type Property } from '../mockData/properties';
import { mockAgents, type Agent } from '../mockData/agents';
import { getProperties, saveProperties, getAgents } from '../utils/db';

interface PropertyContextType {
  properties: Property[];
  agents: Agent[];
  addProperty: (property: Property) => void;
  orderProperty: (propertyId: string, userId: string) => Promise<void>;
  finalizeProperty: (propertyId: string) => Promise<void>;
  cancelOrder: (propertyId: string) => Promise<void>;
  refreshAgents: () => Promise<void>;
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>(mockAgents);
  const [isLoading, setIsLoading] = useState(true);

  const loadAgents = async () => {
    try {
      const savedAgents = await getAgents();
      // Merge mock agents with registered agents
      const allAgents = [...mockAgents];
      savedAgents.forEach(sa => {
        if (!allAgents.find(ma => ma.id === sa.id)) {
          allAgents.push(sa);
        }
      });
      setAgents(allAgents);
    } catch (err) {
      console.error("Failed to load agents:", err);
    }
  };

  useEffect(() => {
    // Load from IndexedDB (High Performance)
    const load = async () => {
      try {
        const saved = await getProperties();
        if (saved && saved.length > 0) {
          setProperties(saved);
        } else {
          setProperties(mockProperties);
        }
        await loadAgents();
      } catch (err) {
        console.error("Failed to load properties:", err);
        setProperties([]);
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const refreshAgents = async () => {
    await loadAgents();
  };

  const addProperty = async (property: Property) => {
    const updated = [property, ...properties];
    setProperties(updated);
    try {
      await saveProperties(updated);
    } catch (err) {
      console.error("Failed to save property:", err);
    }
  };

  const orderProperty = async (propertyId: string, userId: string) => {
    const expires = new Date();
    expires.setDate(expires.getDate() + 2); // 2 days pinning

    const updated = properties.map(p => 
      p.id === propertyId 
        ? { ...p, status: 'ordered' as const, orderedBy: userId, orderedUntil: expires.toISOString() } 
        : p
    );
    setProperties(updated);
    await saveProperties(updated);
  };

  const finalizeProperty = async (propertyId: string) => {
    // If taken, it should be removed (or marked occupied)
    const updated = properties.filter(p => p.id !== propertyId);
    setProperties(updated);
    await saveProperties(updated);
  };

  const cancelOrder = async (propertyId: string) => {
    const updated = properties.map(p => 
      p.id === propertyId 
        ? { ...p, status: 'available' as const, orderedBy: undefined, orderedUntil: undefined } 
        : p
    );
    setProperties(updated);
    await saveProperties(updated);
  };

  // Background check for expired orders
  useEffect(() => {
    const checkExpired = async () => {
      const now = new Date();
      let changed = false;
      const updated = properties.map(p => {
        if (p.status === 'ordered' && p.orderedUntil && new Date(p.orderedUntil) < now) {
          changed = true;
          return { ...p, status: 'available' as const, orderedBy: undefined, orderedUntil: undefined };
        }
        return p;
      });

      if (changed) {
        setProperties(updated);
        await saveProperties(updated);
      }
    };

    const interval = setInterval(checkExpired, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [properties]);

  return (
    <PropertyContext.Provider value={{ 
      properties, 
      agents, 
      addProperty, 
      orderProperty, 
      finalizeProperty, 
      cancelOrder,
      refreshAgents, 
      isLoading 
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (context === undefined) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
