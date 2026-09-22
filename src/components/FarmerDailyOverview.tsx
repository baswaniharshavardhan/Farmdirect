import React from 'react';
import {
  Sun,
  CloudRain,
  Droplets,
  Wind,
  Calendar,
  Clock,
  Truck,
  Package,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Phone,
  AlertCircle,
  Plus,
  CheckCircle2,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

interface FarmerDailyOverviewProps {
  onNavigateTab: (tab: 'inventory' | 'orders' | 'payouts' | 'transport') => void;
  onOpenAddProduce: () => void;
  onOpenSchemes: () => void;
}

export const FarmerDailyOverview: React.FC<FarmerDailyOverviewProps> = ({
  onNavigateTab,
  onOpenAddProduce,
  onOpenSchemes,
}) => {
  const { activeFarm, products, orders, payoutRecords, transporters, updateProductStock } =
    useMarketplace();

  if (!activeFarm) return null;

  const farmProducts = products.filter((p) => p.farmId === activeFarm.id);
  const pendingOrders = orders.filter(
    (o) =>
      o.items.some((item) => item.farmId === activeFarm.id) &&
      (o.status === 'Pending' || o.status === 'order_placed')
  );
  const availableTransporters = transporters.filter((t) => t.availableNow);

  // Daily Farm Advisory & Weather
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6" id="farmer-daily-overview">
      {/* 1. Daily Farm Advisory Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white rounded-2xl p-5 sm:p-6 border-2 border-emerald-600 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-2 border border-emerald-700/60">
              <Calendar className="w-3.5 h-3.5" />
              <span>{today} · Daily Farm Advisory</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Good Morning, {activeFarm.name}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-2xl leading-relaxed">
              Today's weather is optimal for dawn harvest. Your registered FPO collection van is scheduled to stop at farm gate at <strong>10:45 AM</strong>. Keep harvest crates tagged.
            </p>
          </div>

          {/* Quick Weather Strip */}
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/20">
            <div className="flex items-center gap-2 pr-3 border-r border-white/20">
              <Sun className="w-6 h-6 text-amber-300" />
              <div>
                <div className="text-sm font-bold">26°C</div>
                <div className="text-[10px] text-emerald-200">Sunny</div>
              </div>
            </div>
            <div className="flex items-center gap-2 pr-3 border-r border-white/20">
              <Droplets className="w-4 h-4 text-sky-300" />
              <div>
                <div className="text-xs font-bold">58%</div>
                <div className="text-[10px] text-emerald-200">Humidity</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-emerald-300" />
              <div>
                <div className="text-xs font-bold">8 km/h</div>
                <div className="text-[10px] text-emerald-200">Light Breeze</div>
              </div>
            </div>
          </div>
        </div>

        {/* Advisory Action Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-emerald-700/60 text-xs">
          <div className="flex items-center gap-2 text-emerald-100">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span><strong>Harvest Window:</strong> 6:00 AM - 8:30 AM (Peak Crispness)</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-100">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            <span><strong>Irrigation:</strong> Soil moisture 64% · Run drip pulse for 25 mins</span>
          </div>
          <div className="flex items-center gap-2 text-emerald-100">
            <span className="w-2 h-2 rounded-full bg-sky-400 inline-block" />
            <span><strong>FPO Van:</strong> Tata Ace Refrigerated (#MH-15-EG-8821) on route</span>
          </div>
        </div>
      </div>

      {/* 2. THE 4 ESSENTIAL DAILY FARM COLUMNS (Highlighted, Clear, Simple) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* COLUMN 1: Today's Fair-Trade Rates vs Mandi (Rupees ₹) */}
        <div className="bg-white border-2 border-emerald-500 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b-2 border-emerald-200 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-950 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
                1. Today's Crop Rates (₹)
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md border border-emerald-300">
                88% Net
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {farmProducts.slice(0, 3).map((prod) => {
                const mandiRate = Math.round(prod.pricePerUnit * 0.58);
                const farmerShare = (prod.pricePerUnit * 0.88).toFixed(2);
                return (
                  <div
                    key={prod.id}
                    className="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-200"
                  >
                    <div className="font-bold text-neutral-900">{prod.name}</div>
                    <div className="flex items-center justify-between mt-1 text-[11px]">
                      <span className="text-neutral-500">Mandi: ₹{mandiRate}/{prod.unit}</span>
                      <span className="font-black text-emerald-800 text-xs">
                        You Get: ₹{farmerShare}/{prod.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 mt-3">
            <div className="text-[11px] text-emerald-700 font-semibold mb-2">
              ✨ +73% higher income vs traditional middlemen
            </div>
            <button
              type="button"
              onClick={() => onNavigateTab('inventory')}
              className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Update Crop Rates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* COLUMN 2: Today's Harvest Ready Inventory */}
        <div className="bg-white border-2 border-amber-500 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b-2 border-amber-200 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600 inline-block" />
                2. Live Harvest Stock
              </span>
              <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md border border-amber-300">
                {farmProducts.length} Crops
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {farmProducts.slice(0, 3).map((prod) => (
                <div
                  key={prod.id}
                  className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between"
                >
                  <div>
                    <div className="font-bold text-neutral-900">{prod.name}</div>
                    <div className="text-[11px] text-neutral-500">{prod.harvestDate}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updateProductStock(prod.id, Math.max(0, prod.stockQuantity - 5))}
                      className="w-6 h-6 rounded-lg bg-white border border-amber-300 font-bold text-neutral-700 flex items-center justify-center hover:bg-amber-100 cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-black text-amber-950 px-1 text-xs">
                      {prod.stockQuantity} {prod.unit}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateProductStock(prod.id, prod.stockQuantity + 5)}
                      className="w-6 h-6 rounded-lg bg-white border border-amber-300 font-bold text-neutral-700 flex items-center justify-center hover:bg-amber-100 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 mt-3">
            <button
              type="button"
              onClick={onOpenAddProduce}
              className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List New Harvest Item</span>
            </button>
          </div>
        </div>

        {/* COLUMN 3: Pending Buyer Orders */}
        <div className="bg-white border-2 border-blue-500 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b-2 border-blue-200 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block" />
                3. Orders to Pack
              </span>
              <span className="text-[10px] font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded-md border border-blue-300">
                {pendingOrders.length} Pending
              </span>
            </div>

            {pendingOrders.length === 0 ? (
              <div className="p-4 text-center rounded-xl bg-neutral-50 text-neutral-500 text-xs">
                All incoming crates have been packed and dispatched!
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {pendingOrders.slice(0, 2).map((o) => {
                  const farmItems = o.items.filter((i) => i.farmId === activeFarm.id);
                  const payout = farmItems.reduce((acc, i) => acc + i.farmerPayout, 0);
                  return (
                    <div
                      key={o.id}
                      className="p-2.5 rounded-xl bg-blue-50/60 border border-blue-200"
                    >
                      <div className="flex items-center justify-between font-bold text-neutral-900">
                        <span>Order #{o.id}</span>
                        <span className="text-emerald-800">₹{payout.toFixed(2)}</span>
                      </div>
                      <div className="text-[11px] text-neutral-600 mt-1">
                        Buyer: <strong>{o.buyerName}</strong>
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {farmItems.map((i) => `${i.quantity}x ${i.productName}`).join(', ')}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-neutral-200 mt-3">
            <button
              type="button"
              onClick={() => onNavigateTab('orders')}
              className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>View Packlist &amp; Labels</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* COLUMN 4: Nearby Transport Vehicles on Standby */}
        <div className="bg-white border-2 border-violet-500 rounded-2xl p-4 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2.5 border-b-2 border-violet-200 mb-3">
              <span className="text-xs font-black uppercase tracking-wider text-violet-950 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-600 inline-block" />
                4. Nearby Vehicles
              </span>
              <span className="text-[10px] font-bold bg-violet-100 text-violet-900 px-2 py-0.5 rounded-md border border-violet-300">
                {availableTransporters.length} Standby
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {availableTransporters.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-xl bg-violet-50/60 border border-violet-200"
                >
                  <div className="flex items-center justify-between font-bold text-neutral-900">
                    <span>{t.vehicleType}</span>
                    <span className="text-emerald-800 text-[11px]">₹{t.pricePerKmRupees}/km</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-neutral-600 mt-1">
                    <span>Driver: {t.name}</span>
                    <span className="text-violet-800 font-bold">{t.distanceFromFarmKm} km away</span>
                  </div>
                  <div className="text-[10px] text-neutral-500 font-mono mt-0.5">
                    Plate: {t.vehicleNumber} · Cap: {t.capacityKg} kg
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-200 mt-3">
            <button
              type="button"
              onClick={() => onNavigateTab('transport')}
              className="w-full py-2 px-3 bg-violet-700 hover:bg-violet-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              id="btn-daily-book-transport"
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Book Vehicle to Send Goods</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Horizontal Navigation Guide / Swipe Indicator */}
      <div className="bg-neutral-900 text-white p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 font-bold text-xs">
            👉
          </div>
          <div>
            <div className="text-xs font-bold text-emerald-300">
              Scroll Left or Click Below to View Remaining Farm Details
            </div>
            <div className="text-[11px] text-neutral-400">
              Easily navigate between Transport Booking, Live Produce Catalog, Pickups, and Bank Escrow Payouts.
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => onNavigateTab('transport')}
            className="px-3 py-1.5 rounded-lg bg-violet-900/80 hover:bg-violet-800 border border-violet-600 text-violet-200 text-xs font-bold cursor-pointer"
          >
            🚚 Nearby Transport
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('inventory')}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-200 text-xs font-bold cursor-pointer"
          >
            📦 Full Produce Stock
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('orders')}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-200 text-xs font-bold cursor-pointer"
          >
            📋 Orders &amp; Pickups
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('payouts')}
            className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-neutral-200 text-xs font-bold cursor-pointer"
          >
            💰 ₹ Bank Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
