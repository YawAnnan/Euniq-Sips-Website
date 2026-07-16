import React from 'react';
import { Route, Routes, BrowserRouter as Router, useLocation } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import MixPackPage from './pages/MixPackPage.jsx';
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import SuccessPage from './pages/SuccessPage';
import OrderSuccessPage from './pages/OrderSuccessPage.jsx';

// Admin Components
import { AdminAuthProvider } from './contexts/AdminAuthContext.jsx';
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx';
import AdminLayout from './components/AdminLayout.jsx';
import AdminLoginPage from './pages/AdminLoginPage.jsx';
import ForgotPasswordPage from './pages/ForgotPasswordPage.jsx';
import ResetPasswordPage from './pages/ResetPasswordPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminProductsPage from './pages/AdminProductsPage.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage.jsx';

import { CartProvider } from './hooks/useCart';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AdminAuthProvider>
      <CartProvider>
        <Router>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
              <Routes>
                {/* Public Store Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/mix-pack" element={<MixPackPage />} />
                <Route path="/cart" element={<ShoppingCartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/order-tracking" element={<OrderTrackingPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                
                {/* Admin Auth Routes (Unprotected) */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route path="/admin/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/admin/reset-password" element={<ResetPasswordPage />} />

                {/* Protected Admin Routes */}
                <Route path="/admin" element={
                  <AdminProtectedRoute>
                    <AdminLayout />
                  </AdminProtectedRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProductsPage />} />
                  <Route path="orders" element={<AdminOrdersPage />} />
                </Route>

                <Route path="*" element={
                  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-6xl font-bold text-primary mb-4 font-serif">404</h1>
                    <p className="text-xl text-muted-foreground mb-8">Page not found</p>
                    <a href="/" className="text-secondary hover:underline font-medium">Back to home</a>
                  </div>
                } />
              </Routes>
            </main>
            <FooterWrapper />
            <Toaster position="top-center" />
          </div>
        </Router>
      </CartProvider>
    </AdminAuthProvider>
  );
}

// Helper to hide footer on admin routes
function FooterWrapper() {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;
  return <Footer />;
}

export default App;