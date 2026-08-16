import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import QuickViewModal from './components/QuickViewModal';
import HomePage from './pages/HomePage';
import CategoryLandingPage from './pages/CategoryLandingPage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SellerLoginPage from './pages/seller/SellerLoginPage';
import SellerLayout from './pages/seller/SellerLayout';
import SellerHome from './pages/seller/SellerHome';
import SalesPerformance from './pages/seller/SalesPerformance';
import AIForecast from './pages/seller/AIForecast';
import DynamicPricing from './pages/seller/DynamicPricing';
import AICopilot from './pages/seller/AICopilot';
import Actions from './pages/seller/Actions';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SellerAuthProvider } from './context/SellerAuthContext';
import AriesChatbot from './components/AriesChatbot';
import AriesLauncher from './components/AriesLauncher';
import type { Product } from './data/products';

function Storefront() {
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [ariesOpen, setAriesOpen] = useState(false);

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-white font-body">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<HomePage onQuickView={setQuickViewProduct} />} />
              <Route path="/product/:productId" element={<ProductDetailPage />} />
              <Route path="/:gender" element={<CategoryLandingPage />} />
              <Route path="/:gender/:category" element={<ProductListingPage onQuickView={setQuickViewProduct} />} />
            </Routes>
          </main>
          <Footer />
          <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
          <AriesGate onOpen={() => setAriesOpen(true)} />
          {ariesOpen && <AriesChatbot onClose={() => setAriesOpen(false)} />}
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

function AriesGate({ onOpen }: { onOpen: () => void }) {
  const { user } = useAuth();
  const prevUser = useRef<string | null>(null);

  useEffect(() => {
    const currentUid = user?.uid ?? null;
    if (prevUser.current === null && currentUid !== null) {
      const timer = setTimeout(() => onOpen(), 800);
      prevUser.current = currentUid;
      return () => clearTimeout(timer);
    }
    prevUser.current = currentUid;
  }, [user, onOpen]);

  if (!user) return null;
  return <AriesLauncher onClick={onOpen} />;
}

function SellerPage({ children }: { children: React.ReactNode }) {
  return (
    <SellerAuthProvider>
      <SellerLayout>{children}</SellerLayout>
    </SellerAuthProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/seller/login" element={<SellerAuthProvider><SellerLoginPage /></SellerAuthProvider>} />
        <Route path="/seller/dashboard" element={<SellerPage><SellerHome /></SellerPage>} />
        <Route path="/seller/dashboard/home" element={<SellerPage><SellerHome /></SellerPage>} />
        <Route path="/seller/dashboard/performance" element={<SellerPage><SalesPerformance /></SellerPage>} />
        <Route path="/seller/dashboard/forecast" element={<SellerPage><AIForecast /></SellerPage>} />
        <Route path="/seller/dashboard/pricing" element={<SellerPage><DynamicPricing /></SellerPage>} />
        <Route path="/seller/dashboard/copilot" element={<SellerPage><AICopilot /></SellerPage>} />
        <Route path="/seller/dashboard/actions" element={<SellerPage><Actions /></SellerPage>} />
        <Route path="*" element={<Storefront />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
