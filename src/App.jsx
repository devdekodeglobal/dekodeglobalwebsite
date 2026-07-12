import React, { Suspense, lazy } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import CookieBanner from './components/CookieBanner';
import ScrollToAnchor from './components/ScrollToAnchor';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ── Eagerly import ALL CSS so Vite never splits them into async chunks ──
// This guarantees load order and prevents button/card styles from being overridden
import './pages/Home.css';
import './pages/Bridge.css';
import './components/AnimatedOutcomes.css';
import './components/BridgeTeaser.css';
import './components/DeliveryFlow.css';
import './components/HeroSection.css';
import './components/PortfolioShowcase.css';
import './components/ServicesGrid.css';

import './pages/Contact.css';
import './pages/Discovery.css';
import './pages/FoodManufacture.css';
import './pages/PrimarySchool.css';

// Lazy-load the JS for each page — CSS is already loaded above
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Discovery = lazy(() => import('./pages/Discovery'));
const Bridge = lazy(() => import('./pages/Bridge'));
const Services = lazy(() => import('./pages/Services'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const FoodManufacture = lazy(() => import('./pages/FoodManufacture'));
const PrimarySchool = lazy(() => import('./pages/PrimarySchool'));
const ProposalCFS = lazy(() => import('./pages/proposals/ProposalCFS'));

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ScrollToAnchor />
      <div className="dekode-app">
        <Header />
        <main>
          <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/discovery" element={<Discovery />} />
              <Route path="/bridge" element={<Bridge />} />
              <Route path="/services" element={<Services />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />
              <Route path="/case-study/food-manufacture" element={<FoodManufacture />} />
              <Route path="/case-study/primary-school" element={<PrimarySchool />} />
              <Route path="/proposals/cfs-9x2a4p" element={<ProposalCFS />} />
            </Routes>
          </Suspense>
        </main>
        <CookieBanner />
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
