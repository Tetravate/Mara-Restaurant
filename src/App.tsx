import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { CaseStudyModal } from './components/modals/CaseStudyModal';
import { RestaurantDataProvider } from './context/RestaurantDataContext';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/cart/CheckoutModal';

import { HomePage } from './pages/Home';
import { MenuPage } from './pages/Menu';
import { StoryPage } from './pages/Story';
import { GalleryPage } from './pages/Gallery';
import { PrivateDiningPage } from './pages/PrivateDining';
import { ReservationsPage } from './pages/Reservations';
import { ContactPage } from './pages/Contact';
import { DishDetailPage } from './pages/DishDetail';
import { AdminPage } from './pages/Admin';
import { LoginPage } from './pages/Auth/LoginPage';

// Gatekeeper component that prompts Login if not authenticated
const AppRoutes: React.FC<{ onOpenCaseStudy: () => void }> = ({ onOpenCaseStudy }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  const isLoginPage = location.pathname === '/login';

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-ivory-100 selection:bg-amber-500 selection:text-dark-950 font-sans antialiased">
      {/* Show Navbar only when not directly on fullscreen login page, or always show for quick navigation */}
      {!isLoginPage && <Navbar onOpenCaseStudy={onOpenCaseStudy} />}

      {/* Main Routed Content Landmark */}
      <main id="main-content" className="flex-grow">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Main Website Routes (Protected by Auth Gate) */}
          <Route
            path="/"
            element={
              !isAuthenticated ? (
                <LoginPage />
              ) : (
                <HomePage />
              )
            }
          />
          <Route
            path="/menu"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" state={{ from: location }} replace />
              ) : (
                <MenuPage />
              )
            }
          />
          <Route
            path="/our-story"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" state={{ from: location }} replace />
              ) : (
                <StoryPage />
              )
            }
          />
          <Route
            path="/gallery"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" state={{ from: location }} replace />
              ) : (
                <GalleryPage />
              )
            }
          />
          <Route
            path="/private-dining"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" state={{ from: location }} replace />
              ) : (
                <PrivateDiningPage />
              )
            }
          />
          <Route
            path="/reservations"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" state={{ from: location }} replace />
              ) : (
                <ReservationsPage />
              )
            }
          />
          <Route
            path="/contact"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" state={{ from: location }} replace />
              ) : (
                <ContactPage />
              )
            }
          />
          <Route
            path="/dish/:slug"
            element={
              !isAuthenticated ? (
                <Navigate to="/login" state={{ from: location }} replace />
              ) : (
                <DishDetailPage />
              )
            }
          />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer & Floating CTAs (hidden on login page) */}
      {!isLoginPage && (
        <>
          <Footer onOpenCaseStudy={onOpenCaseStudy} />
          <FloatingWhatsApp />
          <CartDrawer />
          <CheckoutModal />
        </>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  const [isCaseStudyOpen, setIsCaseStudyOpen] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <RestaurantDataProvider>
          <CartProvider>
            <ScrollToTop />
            <AppRoutes onOpenCaseStudy={() => setIsCaseStudyOpen(true)} />
            {/* Interactive Case Study Modal */}
            <CaseStudyModal
              isOpen={isCaseStudyOpen}
              onClose={() => setIsCaseStudyOpen(false)}
            />
          </CartProvider>
        </RestaurantDataProvider>
      </AuthProvider>
    </Router>
  );
};
