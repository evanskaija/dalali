import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockProperties } from '../mockData/properties';
import type { Property } from '../mockData/properties';

interface PropertyContextType {
  properties: Property[];
  addProperty: (property: Property) => void;
  isLoading: boolean;
}

const PropertyContext = createContext<PropertyContextType | undefined>(undefined);

export const PropertyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load from local storage or use mock data if empty
    const saved = localStorage.getItem('dalali_properties_v3');
    if (saved) {
      setProperties(JSON.parse(saved));
    } else {
      setProperties(mockProperties);
    }
    setIsLoading(false);
  }, []);

  const addProperty = (property: Property) => {
    const updated = [property, ...properties];
    setProperties(updated);
    localStorage.setItem('dalali_properties_v3', JSON.stringify(updated));
  };

  return (
    <PropertyContext.Provider value={{ properties, addProperty, isLoading }}>
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
