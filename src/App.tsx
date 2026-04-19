import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
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
import { SearchPortal } from './pages/SearchPortal';

// Security Filter: Only allows specific roles to see these pages
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    const roleParam = allowedRoles?.includes('agent') ? 'role=agent' : 'role=tenant';
    return <Navigate to={`/login?${roleParam}`} state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-color)', color: 'var(--text-main)', padding: '2rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '4rem' }}>🚫</h1>
        <h2>Access Denied</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '2rem' }}>
          This page is reserved for Property Owners and Registered Agents only.
        </p>
        <Link to="/" className="btn-primary" style={{ textDecoration: 'none' }}>Return Home</Link>
      </div>
    );
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
                  <Route path="/search" element={<ProtectedRoute><MapSearch /></ProtectedRoute>} />
                  <Route path="/seeker-search" element={<ProtectedRoute><SearchPortal /></ProtectedRoute>} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/support" element={<Support />} />
                  
                  {/* Corporate & Service Pages */}
                  {['/about', '/careers', '/sustainability', '/press', '/blog', '/brand', '/partner/:type', '/cities', '/short-stays', '/escrow', '/franchise', '/business', '/residential', '/commercial', '/plots', '/category/:type'].map(path => (
                    <Route key={path} path={path} element={<DynamicPage />} />
                  ))}

                  {/* SECURED ROUTES: Requires Registration */}
                  <Route path="/add" element={<ProtectedRoute allowedRoles={['agent', 'landlord']}><AddProperty /></ProtectedRoute>} />
                  <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                  <Route path="/chat/:convoId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
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
