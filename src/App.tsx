import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from './pages/Home';
import { MapSearch } from './pages/MapSearch';
import { AddProperty } from './pages/AddProperty';
import { SavedProperties } from './pages/SavedProperties';
import { Login } from './pages/Login';
import { Chat } from './pages/Chat';
import { AdminDashboard } from './pages/AdminDashboard';
import { KYCVerification } from './pages/KYCVerification';
import { Payment } from './pages/Payment';
import { ThemeProvider } from './contexts/ThemeContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { PropertyProvider } from './contexts/PropertyContext';
import { Support } from './pages/Support';
import { DynamicPage } from './pages/DynamicPage';

// Security Filter: Only allows registered users to see these pages
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    // Access Denied: Send back to login
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ThemeProvider>
          <LanguageProvider>
            <PropertyProvider>
              <Router>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<MapSearch />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/support" element={<Support />} />
                  
                  {/* Corporate & Service Pages */}
                  {['/about', '/careers', '/sustainability', '/press', '/blog', '/brand', '/partner/:type', '/cities', '/short-stays', '/escrow', '/franchise', '/business', '/residential', '/commercial', '/plots', '/category/:type'].map(path => (
                    <Route key={path} path={path} element={<DynamicPage />} />
                  ))}

                  {/* SECURED ROUTES: Requires Registration */}
                  <Route path="/add" element={<ProtectedRoute><AddProperty /></ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                  <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                  <Route path="/kyc" element={<ProtectedRoute><KYCVerification /></ProtectedRoute>} />
                  <Route path="/payment" element={<ProtectedRoute><Payment /></ProtectedRoute>} />
                  <Route path="/saved" element={<ProtectedRoute><SavedProperties /></ProtectedRoute>} />
                </Routes>
              </Router>
            </PropertyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
