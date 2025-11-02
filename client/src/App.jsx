import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, Spin } from 'antd';
import { Toaster } from 'react-hot-toast';
import './styles/App.css';

// Lazy load pages for code splitting
const Dashboard = lazy(() => import('./pages/Dashboard'));
const VirtualHQPage = lazy(() => import('./pages/VirtualHQPage'));
const CollaborationPage = lazy(() => import('./pages/CollaborationPage'));
const PartnersPage = lazy(() => import('./pages/PartnersPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));

// Common components
import AppHeader from './components/common/AppHeader';
import AppSidebar from './components/common/AppSidebar';

const { Content } = Layout;

/**
 * Main Application Component
 * 
 * Handles routing and layout structure.
 * Uses lazy loading for code splitting and improved initial load time.
 * 
 * Route structure:
 * - / - Dashboard (default)
 * - /virtual-hq - 3D virtual headquarters tour
 * - /collaborate - Real-time collaboration hub
 * - /partners - Global partner map
 * - /analytics - Impact metrics and analytics
 * - /profile - User profile and settings
 * - /login - Authentication page
 * 
 * Protected routes should check authentication state (add auth middleware).
 */

const LoadingFallback = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh' 
  }}>
    <Spin size="large" tip="Loading..." />
  </div>
);

function App() {
  const [collapsed, setCollapsed] = React.useState(false);

  // TODO: Add authentication state management
  // const { isAuthenticated, user } = useAuth();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Toast notifications */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Sidebar Navigation */}
      <AppSidebar collapsed={collapsed} />

      <Layout>
        {/* Top Navigation Bar */}
        <AppHeader 
          collapsed={collapsed} 
          onToggle={() => setCollapsed(!collapsed)} 
        />

        {/* Main Content Area */}
        <Content style={{ margin: '24px 16px 0' }}>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />

              {/* Protected Routes */}
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/virtual-hq" element={<VirtualHQPage />} />
              <Route path="/collaborate" element={<CollaborationPage />} />
              <Route path="/partners" element={<PartnersPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/profile" element={<ProfilePage />} />

              {/* Catch-all redirect */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;

/**
 * Future Enhancements:
 * 
 * 1. Authentication:
 *    - Implement protected route wrapper
 *    - Add login/logout functionality
 *    - JWT token management
 *    - Refresh token rotation
 * 
 * 2. State Management:
 *    - Add Redux slices for different features
 *    - Implement persistent state (localStorage)
 *    - Add optimistic updates for better UX
 * 
 * 3. Performance:
 *    - Implement route-based code splitting
 *    - Add service worker for offline support
 *    - Prefetch critical resources
 *    - Implement virtual scrolling for long lists
 * 
 * 4. User Experience:
 *    - Add loading skeletons
 *    - Implement error boundaries
 *    - Add keyboard shortcuts
 *    - Implement dark mode
 * 
 * 5. Analytics:
 *    - Add page view tracking
 *    - Implement user behavior analytics
 *    - Add performance monitoring
 */
