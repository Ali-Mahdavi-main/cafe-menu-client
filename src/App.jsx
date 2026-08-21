import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import CategoriesPage from './pages/CategoriesPage';
import MenuItemsPage from './pages/MenuItemsPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import PublicMenuPage from './pages/PublicMenuPage';
import AdminCreateCafePage from './pages/AdminCreateCafePage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminCafesListPage from './pages/AdminCafesListPage';
import AdminEditCafePage from './pages/AdminEditCafePage';
import AdminSubscriptionPage from './pages/AdminSubscriptionPage';
import SubscriptionPage from './pages/SubscriptionPage';
import EventsPage from './pages/EventsPage';
import QRLandingPage from './pages/QRLandingPage';
import PublicEventsPage from './pages/PublicEventsPage';
import RootFallbackPage from './pages/RootFallbackPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public root domain fallback */}
          <Route path="/" element={<RootFallbackPage />} />
          {/* Café login */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected café dashboard */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="menu-items" element={<MenuItemsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="subscription" element={<SubscriptionPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route
            path="/admin/create-cafe"
            element={
              <AdminProtectedRoute>
                <AdminCreateCafePage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/cafes"
            element={
              <AdminProtectedRoute>
                <AdminCafesListPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/cafes/:id/edit"
            element={
              <AdminProtectedRoute>
                <AdminEditCafePage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/subscription"
            element={
              <AdminProtectedRoute>
                <AdminSubscriptionPage />
              </AdminProtectedRoute>
            }
          />

          {/* Public-facing QR experience */}
          <Route path="/qr/:cafeId/:accessKey" element={<QRLandingPage />} />
          <Route path="/menu/:cafeId/:accessKey" element={<PublicMenuPage />} />
          <Route path="/events/:cafeId/:accessKey" element={<PublicEventsPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}