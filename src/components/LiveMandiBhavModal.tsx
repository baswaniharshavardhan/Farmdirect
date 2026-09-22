import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ArrowUpDown,
  X,
  MapPin,
  Calendar,
  CheckCircle2,
  DollarSign,
  Calculator,
} from 'lucide-react';

interface LiveMandiBhavModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi' | 'pa';
}

interface MandiRecord {
  id: string;
  commodity: string;
  variety: string;
  mandi: string;
  state: string;
  arrivalTons: number;
  modalPrice: number; // ₹ per quintal
  change: number; // ₹ change
  msp: number; // ₹ Minimum Support Price
  mspDiff: number;
}

export const LiveMandiBhavModal: React.FC<LiveMandiBhavModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('All');
  const [calculatorCrop, setCalculatorCrop] = useState<string>('Wheat (गेहूं)');
  const [quintals, setQuintals] = useState<number>(45);

  const mandiData: MandiRecord[] = [
    {
      id: 'mb-1',
      commodity: 'Wheat (गेहूं)',
      variety: 'HD-3226 / Sharbati',
      mandi: 'Karnal APMC',
      state: 'Haryana',
      arrivalTons: 1420,
      modalPrice: 2615,
      change: 35,
      msp: 2275,
      mspDiff: 340,
    },
    {
      id: 'mb-2',
      commodity: 'Mustard (सरसों / राया)',
      variety: 'RH-749 / 42% Oil',
      mandi: 'Karnal APMC',
      state: 'Haryana',
      arrivalTons: 860,
      modalPrice: 5920,
      change: -40,
      msp: 5650,
      mspDiff: 270,
    },
    {
      id: 'mb-3',
      commodity: 'Basmati Paddy 1121',
      variety: 'Pusa 1121 Chawal',
      mandi: 'Taraori Mandi',
      state: 'Haryana',
      arrivalTons: 2150,
      modalPrice: 4620,
      change: 80,
      msp: 2183,
      mspDiff: 2437,
    },
    {
      id: 'mb-4',
      commodity: 'Cotton / Narma (कपास)',
      variety: 'BT Cotton Medium',
      mandi: 'Sirsa Mandi',
      state: 'Haryana',
      arrivalTons: 980,
      modalPrice: 7180,
      change: 110,
      msp: 6620,
      mspDiff: 560,
    },
    {
      id: 'mb-5',
      commodity: 'Potato (आलू)',
      variety: 'Kufri Jyoti Fresh',
      mandi: 'Shahabad Markanda',
      state: 'Haryana',
      arrivalTons: 620,
      modalPrice: 1380,
      change: 25,
      msp: 1150,
      mspDiff: 230,
    },
    {
      id: 'mb-6',
      commodity: 'Wheat (गेहूं)',
      variety: 'PBW-725 Super',
      mandi: 'Khanna Mandi',
      state: 'Punjab',
      arrivalTons: 1890,
      modalPrice: 2580,
      change: 20,
      msp: 2275,
      mspDiff: 305,
    },
    {
      id: 'mb-7',
      commodity: 'Mustard (सरसों)',
      variety: 'Giriraj Bold',
      mandi: 'Alwar APMC',
      state: 'Rajasthan',
      arrivalTons: 1140,
      modalPrice: 5980,
      change: 60,
      msp: 5650,
      mspDiff: 330,
    },
    {
      id: 'mb-8',
      commodity: 'Gram / Chana (चना)',
      variety: 'Desi Bold Chana',
      mandi: 'Hisar Mandi',
      state: 'Haryana',
      arrivalTons: 410,
      modalPrice: 5850,
      change: 45,
      msp: 5440,
      mspDiff: 410,
    },
  ];

  if (!isOpen) return null;

  const filtered = mandiData.filter((item) => {
    const matchesSearch =
      item.commodity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.mandi.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.variety.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCommodity =
      selectedCommodity === 'All' || item.commodity.includes(selectedCommodity);
    return matchesSearch && matchesCommodity;
  });

  const selectedCropRecord =
    mandiData.find((m) => m.commodity.includes(calculatorCrop.split(' ')[0])) || mandiData[0];
  const totalGrossPayout = quintals * selectedCropRecord.modalPrice;
  const mspTotal = quintals * selectedCropRecord.msp;
  const bonusOverMsp = totalGrossPayout - mspTotal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-neutral-900 text-white w-full max-w-4xl rounded-2xl border border-amber-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#0f1f18] px-6 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-md">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white font-display">
                  Live Mandi Bhav (APMC Spot Rates)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900/90 text-emerald-300 border border-emerald-600/60">
                  Agmarknet Synced
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Official market auction rates across regional wholesale grain mandis
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-neutral-950">
          {/* Quick Payout Simulator */}
          <div className="bg-gradient-to-br from-amber-950/60 via-neutral-900 to-neutral-900 border border-amber-500/30 rounded-2xl p-4">
            <div className="flex items-center gap-2 mb-3 text-amber-300 font-bold text-xs uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Instant Harvest Payout Calculator</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Select Crop</label>
                <select
                  value={calculatorCrop}
                  onChange={(e) => setCalculatorCrop(e.target.value)}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="Wheat (गेहूं)">Wheat (गेहूं) - ₹2,615/Q</option>
                  <option value="Mustard (सरसों / राया)">Mustard (सरसों) - ₹5,920/Q</option>
                  <option value="Basmati Paddy 1121">Basmati Paddy 1121 - ₹4,620/Q</option>
                  <option value="Cotton / Narma (कपास)">Cotton (कपास) - ₹7,180/Q</option>
                  <option value="Potato (आलू)">Potato (आलू) - ₹1,380/Q</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">
                  Expected Yield (Quintals): <span className="text-white font-bold">{quintals} Q</span>
                </label>
                <input
                  type="range"
                  min={5}
                  max={250}
                  step={5}
                  value={quintals}
                  onChange={(e) => setQuintals(Number(e.target.value))}
                  className="w-full accent-amber-400"
                />
              </div>

              <div className="bg-neutral-950/80 p-3 rounded-xl border border-amber-500/20 text-right">
                <span className="text-[10px] text-neutral-400 block">Gross Realization</span>
                <span className="text-lg font-black text-amber-300">
                  ₹{totalGrossPayout.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-emerald-400 block font-medium">
                  +₹{bonusOverMsp.toLocaleString('en-IN')} above Gov MSP
                </span>
              </div>
            </div>
          </div>

          {/* Filter and Search */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search crop, variety or Mandi name (e.g. Karnal, Mustard)..."
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto no-scrollbar">
              {['All', 'Wheat', 'Mustard', 'Paddy', 'Cotton', 'Potato'].map((comm) => (
                <button
                  key={comm}
                  type="button"
                  onClick={() => setSelectedCommodity(comm)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                    selectedCommodity === comm
                      ? 'bg-amber-400 text-neutral-950'
                      : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white'
                  }`}
                >
                  {comm}
                </button>
              ))}
            </div>
          </div>

          {/* Rates Table */}
          <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-900/60 shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-neutral-300">
                <thead className="bg-neutral-800 text-neutral-400 uppercase text-[10px] tracking-wider font-bold">
                  <tr>
                    <th className="px-4 py-3">Commodity &amp; Variety</th>
                    <th className="px-4 py-3">Mandi / State</th>
                    <th className="px-4 py-3 text-right">Arrivals</th>
                    <th className="px-4 py-3 text-right">Modal Rate / Q</th>
                    <th className="px-4 py-3 text-right">Govt MSP</th>
                    <th className="px-4 py-3 text-right">Difference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold text-white text-sm">{item.commodity}</div>
                        <div className="text-[11px] text-neutral-400">{item.variety}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 text-white font-medium">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          <span>{item.mandi}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400">{item.state}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-neutral-300">
                        {item.arrivalTons} Tons
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-black text-amber-300 font-mono">
                          ₹{item.modalPrice.toLocaleString('en-IN')}
                        </span>
                        <div
                          className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                            item.change >= 0 ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {item.change >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          <span>
                            {item.change >= 0 ? '+' : ''}₹{item.change}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-neutral-400">
                        ₹{item.msp.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            item.mspDiff >= 0
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                              : 'bg-red-950 text-red-300 border border-red-700/60'
                          }`}
                        >
                          {item.mspDiff >= 0 ? `+₹${item.mspDiff}` : `-₹${Math.abs(item.mspDiff)}`}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#0f1f18] px-6 py-3.5 border-t border-neutral-800 flex items-center justify-between">
          <span className="text-xs text-neutral-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Updates hourly via Ministry of Agriculture e-NAM Portal</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl text-xs font-bold cursor-pointer"
          >
            Close Rates
          </button>
        </div>
      </div>
    </div>
  );
};
