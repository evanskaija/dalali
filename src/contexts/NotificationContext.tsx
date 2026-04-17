import React, { createContext, useContext, useState, type ReactNode } from 'react';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'property' | 'booking' | 'payment' | 'system';
  read: boolean;
  createdAt: Date;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => void;
  markAllRead: () => void;
  markRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'New property near you!', message: 'A new Single Room has been listed in Kijitonyama, 2.4km from you.', type: 'property', read: false, createdAt: new Date(Date.now() - 120000) },
  { id: 'n2', title: 'Booking Confirmed ✓', message: 'Juma Hassan approved your viewing for April 3rd at 10:00 AM.', type: 'booking', read: false, createdAt: new Date(Date.now() - 3600000) },
  { id: 'n3', title: 'Payment Received', message: 'Your escrow payment of TZS 350,000 is being held securely.', type: 'payment', read: true, createdAt: new Date(Date.now() - 7200000) },
  { id: 'n4', title: 'Account Verified ✓', message: 'Your KYC verification has been approved. You can now post listings!', type: 'system', read: true, createdAt: new Date(Date.now() - 86400000) },
];

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (n: Omit<Notification, 'id' | 'read' | 'createdAt'>) => {
    setNotifications(prev => [{ ...n, id: `n${Date.now()}`, read: false, createdAt: new Date() }, ...prev]);
  };

  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAllRead, markRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};
