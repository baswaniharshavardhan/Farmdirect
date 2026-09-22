/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Tractor,
  ShieldCheck,
  LogOut,
  Columns,
  Zap,
  CheckCircle2,
  Leaf,
  ChevronRight,
  Truck,
  ArrowLeftRight,
  UserCheck,
  Lock,
  Type,
} from 'lucide-react';
import { MarketplaceProvider, useMarketplace } from './context/MarketplaceContext';
import { ConsumerView } from './components/ConsumerView';
import { FarmerPortal } from './components/FarmerPortal';
import { LogisticsMap } from './components/LogisticsMap';
import { VerificationPanel } from './components/VerificationPanel';
import { AdminPortal } from './components/AdminPortal';
import { LoginPortal } from './components/LoginPortal';
import { ProtectedRoute } from './components/ProtectedRoute';
import { FocusedDeliveryMap } from './components/FocusedDeliveryMap';
import { KisanSetuDashboard } from './components/KisanSetuDashboard';
import { UserRole } from './types';

const FONT_THEMES = [
  {
    id: 'organic',
    name: 'Organic Harvest',
    tag: 'Fraunces Serif',
    desc: 'Earthy warm optical serif with handcrafted notes & monospace telemetry',
    sample: 'Fresh Ratnagiri Alphonso',
    badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300 font-serif-harvest',
    headingFont: 'font-serif-harvest',
  },
  {
    id: 'modern',
    name: 'Modern Geometric',
    tag: 'Outfit Grotesque',
    desc: 'High-contrast clean tech geometry with Plus Jakarta Sans body and mono metrics',
    sample: 'Fresh Ratnagiri Alphonso',
    badgeClass: 'bg-blue-100 text-blue-800 border-blue-300 font-display',
    headingFont: 'font-display',
  },
  {
    id: 'editorial',
    name: 'Artisan Editorial',
    tag: 'DM Serif Display',
    desc: 'Refined culinary magazine styling with italic accents and structured typography',
    sample: 'Fresh Ratnagiri Alphonso',
    badgeClass: 'bg-amber-100 text-amber-800 border-amber-300 font-editorial',
    headingFont: 'font-editorial',
  },
  {
    id: 'kisan',
    name: 'Rustic Kisan',
    tag: 'Caveat Script & Serif',
    desc: 'Grassroots Indian farm collective feel with expressive handwritten harvest seals',
    sample: 'Fresh Ratnagiri Alphonso',
    badgeClass: 'bg-orange-100 text-orange-800 border-orange-300 font-script font-bold',
    headingFont: 'font-script text-base',
  },
] as const;

type FontThemeId = (typeof FONT_THEMES)[number]['id'];

const MainLayout: React.FC = () => {
  const {
    isLoggedIn,
    login,
    logout,
    currentUser,
    users,
    orders,
    systemNotification,
    setSystemNotification,
    runSimulatedBatchOrder,
    isSimulating,
    currentRoute,
    navigate,
    authToken,
  } = useMarketplace();

  // Font Theme State
  const [fontTheme, setFontTheme] = useState<FontThemeId>(() => {
    return (localStorage.getItem('farmdirect_font_theme') as FontThemeId) || 'organic';
  });
  const [isFontMenuOpen, setIsFontMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.remove(
      'font-theme-organic',
      'font-theme-modern',
      'font-theme-editorial',
      'font-theme-kisan'
    );
    document.body.classList.add(`font-theme-${fontTheme}`);
    localStorage.setItem('farmdirect_font_theme', fontTheme);
  }, [fontTheme]);

  // Find active order for customer
  const customerActiveOrder = orders.find(
    (o) =>
      (o.buyerName.toLowerCase().includes(currentUser?.name?.toLowerCase() || '') ||
        o.buyerAddress.toLowerCase().includes(currentUser?.address?.toLowerCase() || '')) &&
      o.status !== 'Delivered' &&
      o.status !== 'cancelled'
  ) || (orders.length > 0 && orders[0].status === 'out_for_delivery' ? orders[0] : null);

  // Sub-tabs for the active role
  const [consumerTab, setConsumerTab] = useState<'market' | 'map'>('market');
  const [farmerTab, setFarmerTab] = useState<'portal' | 'collection' | 'verify'>('portal');
  const [adminTab, setAdminTab] = useState<'governance' | 'health' | 'network'>('governance');
  const [isDualView, setIsDualView] = useState(false);

  // If user is not logged in or on the login route, display the Three-Login Portal
  if (!isLoggedIn || currentRoute === '/login') {
    return <LoginPortal />;
  }

  // If farmer is logged in and not in dual view, display the KisanSetu Smart Agri Dashboard
  if (currentUser.role === 'farmer' && !isDualView) {
    return <KisanSetuDashboard />;
  }

  return (
    <div className="min-h-screen bg-[#f7faf8] bg-grid-3d text-neutral-900 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* 3D Elevated Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-emerald-950/10 shadow-[0_4px_20px_-4px_rgba(6,78,59,0.08)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4">
            {/* App Brand & Role Indicator */}
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-md flex-shrink-0 border border-white/20 ${
                  currentUser.role === 'consumer' || currentUser.role === 'customer'
                    ? 'bg-gradient-to-tr from-emerald-800 to-teal-600 shadow-emerald-900/30'
                    : currentUser.role === 'farmer'
                    ? 'bg-gradient-to-tr from-amber-700 to-orange-600 shadow-amber-900/30'
                    : 'bg-gradient-to-tr from-neutral-900 to-purple-900 shadow-purple-900/30'
                }`}
              >
                {currentUser.role === 'consumer' || currentUser.role === 'customer' ? (
                  <ShoppingBag className="w-5 h-5" />
                ) : currentUser.role === 'farmer' ? (
                  <Tractor className="w-5 h-5" />
                ) : (
                  <ShieldCheck className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-lg sm:text-xl font-black tracking-tight text-neutral-900 leading-none">
                    FarmDirect
                  </h1>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      currentUser.role === 'consumer' || currentUser.role === 'customer'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : currentUser.role === 'farmer'
                        ? 'bg-amber-100 text-amber-900 border-amber-200'
                        : 'bg-purple-100 text-purple-900 border-purple-200'
                    }`}
                  >
                    {currentUser.role === 'consumer' || currentUser.role === 'customer'
                      ? currentUser.buyerType === 'bulk'
                        ? 'Bulk Commercial Buyer'
                        : 'Customer (Normal Buyer)'
                      : currentUser.role === 'farmer'
                      ? 'Farmer Portal'
                      : 'Admin Governance'}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-500 hidden md:block">
                  {(currentUser.role === 'consumer' || currentUser.role === 'customer') &&
                    '88% Direct Producer Take-Home · Cold-Chain Delivery'}
                  {currentUser.role === 'farmer' &&
                    'Sunrise Organic Orchards · Real-Time Inventory & Dispatches'}
                  {currentUser.role === 'admin' &&
                    'Platform Moderation, Ledger Audit & API Sandbox'}
                </p>
              </div>
            </div>

            {/* Role-Specific Sub-Navigation (Hidden in Dual View) */}
            {!isDualView && (
              <nav className="hidden md:flex items-center gap-1 bg-neutral-100/90 p-1 rounded-xl border border-neutral-200">
                {/* 1. Customer Sub-tabs */}
                {(currentUser.role === 'consumer' || currentUser.role === 'customer') && (
                  <>
                    <button
                      type="button"
                      onClick={() => setConsumerTab('market')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        consumerTab === 'market'
                          ? 'bg-white text-emerald-800 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                      id="tab-customer-market"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Produce Market</span>
                    </button>

                    {/* Live delivery tracking is removed for sample normal buyers, only available for bulk commercial buyers */}
                    {currentUser.buyerType === 'bulk' && (
                      <button
                        type="button"
                        onClick={() => setConsumerTab('map')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                          consumerTab === 'map'
                            ? 'bg-white text-emerald-800 shadow-xs'
                            : 'text-neutral-600 hover:text-neutral-900'
                        }`}
                        id="tab-customer-map"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Live Delivery Tracking</span>
                        {customerActiveOrder && (
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        )}
                      </button>
                    )}
                  </>
                )}

                {/* 2. Farmer Sub-tabs */}
                {currentUser.role === 'farmer' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setFarmerTab('portal')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        farmerTab === 'portal'
                          ? 'bg-white text-amber-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                      id="tab-farmer-portal"
                    >
                      <Tractor className="w-3.5 h-3.5" />
                      <span>Daily Farm, Transport &amp; Payouts</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFarmerTab('collection')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        farmerTab === 'collection'
                          ? 'bg-white text-amber-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                      id="tab-farmer-collection"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Pickup Route &amp; Hub</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setFarmerTab('verify')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        farmerTab === 'verify'
                          ? 'bg-white text-amber-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                      id="tab-farmer-verify"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>88% Payout Audit &amp; Integrity</span>
                    </button>
                  </>
                )}

                {/* 3. Admin Sub-tabs */}
                {currentUser.role === 'admin' && (
                  <>
                    <button
                      type="button"
                      onClick={() => setAdminTab('governance')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        adminTab === 'governance'
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                      id="tab-admin-governance"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>Approvals &amp; Ledger Audit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdminTab('health')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        adminTab === 'health'
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                      id="tab-admin-health"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>API Testing &amp; System Health</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAdminTab('network')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        adminTab === 'network'
                          ? 'bg-white text-neutral-900 shadow-xs'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                      id="tab-admin-network"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Logistics Network Ops</span>
                    </button>
                  </>
                )}
              </nav>
            )}

            {/* User Controls & Fast Role Switching */}
            <div className="flex items-center gap-2">
              {/* Font Style Picker Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsFontMenuOpen(!isFontMenuOpen)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors shadow-2xs cursor-pointer ${
                    isFontMenuOpen
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                  }`}
                  title="Choose Font Style (Organic Serif, Modern Geometric, Artisan Editorial, Rustic Kisan)"
                  id="btn-font-switcher"
                >
                  <Type className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="hidden sm:inline">Font:</span>
                  <span className="font-semibold text-emerald-900">
                    {FONT_THEMES.find((t) => t.id === fontTheme)?.name.split(' ')[0]}
                  </span>
                </button>

                {isFontMenuOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl border border-neutral-200 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150"
                    id="font-styles-dropdown"
                  >
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-150">
                      <div>
                        <div className="text-xs font-bold text-neutral-900 flex items-center gap-1.5">
                          <Type className="w-4 h-4 text-emerald-700" />
                          <span>Typography Personality</span>
                        </div>
                        <p className="text-[11px] text-neutral-500">Live preview of diverse font styles</p>
                      </div>
                      <span className="text-[10px] font-mono font-bold bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-md">
                        4 Styles
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {FONT_THEMES.map((theme) => {
                        const isSelected = fontTheme === theme.id;
                        return (
                          <button
                            key={theme.id}
                            type="button"
                            onClick={() => {
                              setFontTheme(theme.id);
                              setIsFontMenuOpen(false);
                            }}
                            className={`w-full p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-50/80 border-emerald-400 shadow-xs ring-1 ring-emerald-400/40'
                                : 'bg-neutral-50/60 border-neutral-200/80 hover:bg-neutral-100 hover:border-neutral-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-neutral-900">{theme.name}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${theme.badgeClass}`}>
                                {theme.tag}
                              </span>
                            </div>
                            <div className="text-[11px] text-neutral-500 mt-1 line-clamp-1">{theme.desc}</div>
                            {/* Live Typographic Sample Display */}
                            <div className="mt-2 pt-2 border-t border-neutral-200/60 flex items-baseline justify-between">
                              <span className={`text-sm font-bold text-neutral-800 ${theme.headingFont}`}>
                                {theme.sample}
                              </span>
                              <span className="font-mono text-xs font-bold text-emerald-700">₹140.00</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Dual View Toggle */}
              <button
                type="button"
                onClick={() => setIsDualView(!isDualView)}
                className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                  isDualView
                    ? 'bg-emerald-700 text-white border-emerald-600 shadow-xs'
                    : 'bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50'
                }`}
                title="View Farmer & Customer side-by-side to witness real-time inventory synchronization"
                id="btn-dual-view-toggle"
              >
                <Columns className="w-3.5 h-3.5" />
                <span>{isDualView ? 'Exit Dual-View' : 'Dual Split-View'}</span>
              </button>

              {/* Active User Profile Pill */}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-100 border border-neutral-200">
                {currentUser.role === 'farmer' && currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-6 h-6 rounded-full object-cover border border-amber-500 shadow-xs"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div
                    className={`w-5 h-5 rounded-full text-white flex items-center justify-center text-[10px] font-bold ${
                      currentUser.role === 'admin'
                        ? 'bg-purple-800'
                        : 'bg-emerald-800'
                    }`}
                  >
                    {currentUser.name.charAt(0)}
                  </div>
                )}
                <div className="text-left hidden sm:block">
                  <div className="text-xs font-bold text-neutral-800 leading-tight">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] text-neutral-500 font-semibold capitalize">
                    {currentUser.role === 'consumer' ? 'Customer' : currentUser.role}
                  </div>
                </div>
              </div>

              {/* Log Out Button */}
              <button
                type="button"
                onClick={logout}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-rose-50 text-neutral-700 hover:text-rose-700 rounded-lg text-xs font-bold border border-neutral-200 hover:border-rose-200 transition-colors shadow-xs cursor-pointer"
                title="Log out and return to the Login Page"
                id="btn-logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Floating System Toast Notification */}
      {systemNotification && (
        <div className="fixed bottom-5 right-5 z-50 bg-neutral-950 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center justify-between gap-3 text-xs max-w-md border border-neutral-800 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{systemNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setSystemNotification(null)}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main View Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* DUAL SPLIT-VIEW MODE */}
        {isDualView ? (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Split View Header */}
            <div className="bg-emerald-800 text-white p-4 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <Columns className="w-5 h-5 text-emerald-300 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-bold">
                    Dual Split-View: Real-Time Central Inventory Demonstration
                  </h3>
                  <p className="text-xs text-emerald-200">
                    Edit produce stock or prices in the <strong>Farmer Portal (Left)</strong>, or
                    place orders in the <strong>Customer App (Right)</strong> to watch the central
                    database synchronize instantly!
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDualView(false)}
                className="px-3 py-1.5 bg-white text-emerald-900 text-xs font-bold rounded-lg hover:bg-emerald-50 self-end sm:self-auto cursor-pointer"
              >
                Return to {currentUser.role.toUpperCase()} View
              </button>
            </div>

            {/* 2-Column Split Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 overflow-y-auto max-h-[85vh]">
                <div className="sticky top-0 z-20 bg-neutral-900 text-white px-3 py-2 rounded-xl mb-3 flex items-center justify-between text-xs font-bold shadow-xs">
                  <span className="flex items-center gap-1.5">
                    <Tractor className="w-4 h-4 text-amber-400" />
                    Left Pane: Farmer Portal (Thomas Thorne)
                  </span>
                  <span className="text-[10px] text-amber-400 font-mono">Live Central DB Link</span>
                </div>
                <FarmerPortal />
              </div>

              <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-200 overflow-y-auto max-h-[85vh]">
                <div className="sticky top-0 z-20 bg-emerald-900 text-white px-3 py-2 rounded-xl mb-3 flex items-center justify-between text-xs font-bold shadow-xs">
                  <span className="flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-300" />
                    Right Pane: Customer View (Elena Rostova)
                  </span>
                  <span className="text-[10px] text-emerald-300 font-mono">Live Central DB Link</span>
                </div>
                <ConsumerView />
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* 1. CUSTOMER DASHBOARD ROUTE */}
            {currentRoute === '/customer-dashboard' && (
              <ProtectedRoute
                allowedRoles={['customer', 'consumer']}
                targetPath="/customer-dashboard"
              >
                <div className="space-y-8 animate-in fade-in duration-150">
                  {consumerTab === 'market' && (
                    <div className="space-y-8">
                      <ConsumerView />
                    </div>
                  )}

                  {consumerTab === 'map' && (
                    <div className="space-y-6">
                      {customerActiveOrder ? (
                        <>
                          <div className="bg-white p-5 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                            <div>
                              <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-neutral-900">
                                  Live Delivery Tracking · Order #{customerActiveOrder.id}
                                </h2>
                                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold border border-emerald-200">
                                  {customerActiveOrder.status.replace('_', ' ').toUpperCase()}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-500 mt-1">
                                Real-time final-mile tracking directly to your doorstep with electric cold-van dispatch, live ETA, and continuous temperature monitoring.
                              </p>
                            </div>
                            <div className="text-xs text-right">
                              <span className="text-neutral-400 block font-semibold uppercase text-[10px]">Estimated Arrival</span>
                              <span className="text-emerald-700 font-bold text-sm">{customerActiveOrder.deliveryEta || '20-25 Mins'}</span>
                            </div>
                          </div>
                          <FocusedDeliveryMap
                            order={customerActiveOrder}
                            customerName={customerActiveOrder.buyerName}
                            customerAddress={customerActiveOrder.buyerAddress}
                          />
                        </>
                      ) : (
                        <div className="bg-white p-8 rounded-2xl border border-neutral-200 text-center max-w-md mx-auto space-y-4 shadow-xs">
                          <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                            <Truck className="w-7 h-7" />
                          </div>
                          <div>
                            <h3 className="font-bold text-neutral-900 text-base">
                              Order-Triggered Live Tracking
                            </h3>
                            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                              Real-time delivery routing activates automatically whenever you place an order. Browse the fresh dawn-harvested produce from regional family farms and place an order to track your cold-chain van!
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setConsumerTab('market')}
                            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                          >
                            Explore Produce Market
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </ProtectedRoute>
            )}

            {/* 2. FARMER DASHBOARD ROUTE */}
            {currentRoute === '/farmer-dashboard' && (
              <ProtectedRoute allowedRoles={['farmer']} targetPath="/farmer-dashboard">
                <div className="space-y-8 animate-in fade-in duration-150">
                  {farmerTab === 'portal' && <FarmerPortal />}

                  {farmerTab === 'collection' && (
                    <div className="space-y-6">
                      <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                        <h2 className="text-lg font-bold text-neutral-900 mb-1">
                          Rural Collection Logistics &amp; Pickup Stop
                        </h2>
                        <p className="text-xs text-neutral-500">
                          View how refrigerated electric collection vans pick up your harvested crates
                          in the Nashik agro-cluster and route them to the central consolidation hub.
                        </p>
                      </div>
                      <LogisticsMap height="600px" />
                    </div>
                  )}

                  {farmerTab === 'verify' && (
                    <div className="space-y-6">
                      {/* Farmer Educational Banner: What is Producer Verification & Why is it Used? */}
                      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-neutral-900 text-white p-5 rounded-2xl border-2 border-emerald-500 shadow-md">
                        <div className="flex items-start gap-3.5">
                          <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-400/50 flex items-center justify-center flex-shrink-0 text-emerald-200 shadow-xs">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                          <div>
                            <h2 className="text-base sm:text-lg font-black tracking-tight">
                              What is Producer Verification &amp; System Integrity?
                            </h2>
                            <p className="text-xs text-emerald-200/95 mt-1 leading-relaxed">
                              <strong>Why it is used:</strong> In traditional agricultural markets, middlemen and commission agents deduct 50% to 70% of consumer spend in hidden fees. <strong>Producer Verification &amp; System Integrity</strong> is an automated mathematical proof engine built into FarmDirect. It executes 14 automated health tests to guarantee:
                            </p>
                            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3 text-[11px] text-emerald-100">
                              <li className="bg-white/10 p-2 rounded-lg border border-white/15">
                                <strong>1. 88% Direct Payout:</strong> Verifies that every single rupee from buyer checkout routes 88% net to your bank account without deductions.
                              </li>
                              <li className="bg-white/10 p-2 rounded-lg border border-white/15">
                                <strong>2. Organic Certification:</strong> Validates NPOP &amp; PGS-India organic standards so uncertified fake sellers cannot undercut you.
                              </li>
                              <li className="bg-white/10 p-2 rounded-lg border border-white/15">
                                <strong>3. Cold-Chain Integrity:</strong> Confirms refrigeration telemetry during transit to ensure zero spoilage disputes.
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                        <h3 className="text-base font-bold text-neutral-900 mb-1">
                          Automated Escrow &amp; Integrity Test Results
                        </h3>
                        <p className="text-xs text-neutral-500">
                          Real-time cryptographic verification tests confirming database transactions and direct 88% bank payouts.
                        </p>
                      </div>
                      <VerificationPanel />
                    </div>
                  )}
                </div>
              </ProtectedRoute>
            )}

            {/* 3. ADMIN DASHBOARD ROUTE */}
            {currentRoute === '/admin-dashboard' && (
              <ProtectedRoute allowedRoles={['admin']} targetPath="/admin-dashboard">
                <div className="space-y-8 animate-in fade-in duration-150">
                  {adminTab === 'governance' && <AdminPortal />}

                  {adminTab === 'health' && (
                    <div className="space-y-6">
                      <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                        <h2 className="text-lg font-bold text-neutral-900 mb-1">
                          System Health &amp; Automated Verification Suite
                        </h2>
                        <p className="text-xs text-neutral-500">
                          Simulate end-to-end multi-farm order batching, automated escrow payouts, and
                          route optimization calculations.
                        </p>
                      </div>
                      <VerificationPanel />
                    </div>
                  )}

                  {adminTab === 'network' && (
                    <div className="space-y-6">
                      <div className="bg-white p-5 rounded-2xl border border-neutral-200">
                        <h2 className="text-lg font-bold text-neutral-900 mb-1">
                          Full Regional Logistics Network Map
                        </h2>
                        <p className="text-xs text-neutral-500">
                          Central Emeryville Cold-Chain Hub operations, rural farm cluster pickups, and
                          urban delivery route efficiency tracking.
                        </p>
                      </div>
                      <LogisticsMap height="600px" />
                    </div>
                  )}
                </div>
              </ProtectedRoute>
            )}

            {/* Fallback for unmapped routes */}
            {currentRoute !== '/customer-dashboard' &&
              currentRoute !== '/farmer-dashboard' &&
              currentRoute !== '/admin-dashboard' && (
                <div className="text-center py-16 bg-white rounded-3xl border border-neutral-200 p-8 shadow-xs max-w-lg mx-auto">
                  <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-neutral-600">
                    <ShieldCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-neutral-900 mb-1">
                    Route Not Found
                  </h3>
                  <p className="text-xs text-neutral-500 mb-6">
                    Path <code className="bg-neutral-100 px-1.5 py-0.5 rounded font-mono text-amber-700">{currentRoute}</code> does not match a standard dashboard.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      const cleanRole =
                        currentUser.role === 'consumer' ? 'customer' : currentUser.role;
                      navigate(`/${cleanRole}-dashboard`);
                    }}
                    className="py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                  >
                    Open {currentUser.role.toUpperCase()} Workspace
                  </button>
                </div>
              )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-neutral-200 bg-white py-5 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-800">FarmDirect Platform</span>
            <span>·</span>
            <span>Logged in as {currentUser.name} ({currentUser.role.toUpperCase()})</span>
            <span>·</span>
            <span className="text-emerald-700 font-semibold">Direct Farm-to-Consumer</span>
          </div>
          <div className="flex items-center gap-3 text-neutral-500 text-[11px]">
            <button
              type="button"
              onClick={logout}
              className="text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
            >
              Switch Account / Log Out
            </button>
            <span>·</span>
            <span className="font-mono">Central Real-Time State Synced</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <MarketplaceProvider>
      <MainLayout />
    </MarketplaceProvider>
  );
}
