import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  Calculator,
  CheckCircle2,
  AlertCircle,
  X,
  Droplet,
  Package,
  TrendingDown,
  DollarSign,
} from 'lucide-react';

interface FertilizerCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAcreage?: number;
  language?: 'en' | 'hi' | 'pa';
}

export const FertilizerCalculatorModal: React.FC<FertilizerCalculatorModalProps> = ({
  isOpen,
  onClose,
  defaultAcreage = 8.5,
  language = 'en',
}) => {
  const [selectedCrop, setSelectedCrop] = useState('Wheat (गेहूं) HD-3226');
  const [acreage, setAcreage] = useState<number>(defaultAcreage);
  const [stage, setStage] = useState<'basal' | 'first_irrigation' | 'second_irrigation'>('second_irrigation');
  const [useNanoUrea, setUseNanoUrea] = useState<boolean>(true);

  if (!isOpen) return null;

  // ICAR standard recommendations per acre:
  // Wheat: 120 kg N, 60 kg P2O5, 40 kg K2O
  // At 2nd irrigation: 1/3 Nitrogen (approx 40kg N = approx 1 bag urea per acre or 1 bottle nano urea)
  let ureaBagsPerAcre = stage === 'second_irrigation' ? 1 : stage === 'first_irrigation' ? 1.2 : 0.8;
  let dapBagsPerAcre = stage === 'basal' ? 1.5 : 0;
  let mopBagsPerAcre = stage === 'basal' ? 0.8 : 0;
  let zincBagsPerAcre = stage === 'basal' ? 0.2 : 0;

  if (selectedCrop.includes('Mustard')) {
    ureaBagsPerAcre = stage === 'second_irrigation' ? 0.6 : stage === 'first_irrigation' ? 0.8 : 0.6;
    dapBagsPerAcre = stage === 'basal' ? 1.2 : 0;
    mopBagsPerAcre = stage === 'basal' ? 0.4 : 0;
  } else if (selectedCrop.includes('Sugarcane')) {
    ureaBagsPerAcre = stage === 'second_irrigation' ? 1.5 : stage === 'first_irrigation' ? 1.5 : 1.0;
    dapBagsPerAcre = stage === 'basal' ? 2.5 : 0;
    mopBagsPerAcre = stage === 'basal' ? 1.2 : 0;
  }

  const totalUreaBags = Math.round(ureaBagsPerAcre * acreage * 10) / 10;
  const totalDapBags = Math.round(dapBagsPerAcre * acreage * 10) / 10;
  const totalMopBags = Math.round(mopBagsPerAcre * acreage * 10) / 10;
  const totalZincBags = Math.round(zincBagsPerAcre * acreage * 10) / 10;

  // Nano urea substitution (1 bottle 500ml = 1 bag 45kg urea)
  const nanoBottles = Math.ceil(totalUreaBags);
  const regularUreaCost = totalUreaBags * 266; // ₹266 subsidized bag
  const nanoUreaCost = nanoBottles * 225; // ₹225 per bottle
  const savings = Math.max(0, regularUreaCost - nanoUreaCost);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-neutral-900 text-white w-full max-w-3xl rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#032e22] px-6 py-4 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-md">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white font-display">
                  ICAR Precision Fertilizer Calculator
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900 text-emerald-300 border border-emerald-600/60">
                  Soil Health Aligned
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Exact N-P-K &amp; Micronutrient bag doses for Karnal Agro Zone
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
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-900 p-4 rounded-2xl border border-neutral-800">
            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">Select Standing Crop</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Wheat (गेहूं) HD-3226">Wheat (गेहूं) HD-3226</option>
                <option value="Mustard (सरसों) RH-749">Mustard (सरसों) RH-749</option>
                <option value="Sugarcane (गन्ना) Co 0238">Sugarcane (गन्ना) Co 0238</option>
                <option value="Paddy (धान) 1121">Paddy (धान) 1121</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-bold text-neutral-300 mb-1.5">
                <span>Farmland Acreage</span>
                <span className="text-amber-300 font-mono">{acreage} Acres</span>
              </div>
              <input
                type="range"
                min={0.5}
                max={30}
                step={0.5}
                value={acreage}
                onChange={(e) => setAcreage(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-300 block mb-1.5">Crop Stage</label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value as any)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              >
                <option value="second_irrigation">2nd Irrigation (40-45 Days) - Optimal Today</option>
                <option value="first_irrigation">1st Irrigation (21 Days CRI Stage)</option>
                <option value="basal">Sowing / Basal Application</option>
              </select>
            </div>
          </div>

          {/* Doses Summary Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2.5">
              Recommended Doses for {acreage} Acres ({stage.replace('_', ' ').toUpperCase()})
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Urea */}
              <div className="bg-[#032e22] border border-emerald-700/60 p-3.5 rounded-xl">
                <span className="text-[11px] text-emerald-300 font-bold block">Neem Coated Urea (45kg)</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">
                  {totalUreaBags} <span className="text-xs font-normal text-emerald-300">Bags</span>
                </span>
                <span className="text-[10px] text-emerald-400/80 block mt-1">
                  Subsidized: ₹{(totalUreaBags * 266).toFixed(0)}
                </span>
              </div>

              {/* DAP */}
              <div className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl">
                <span className="text-[11px] text-neutral-400 font-bold block">DAP 18:46:0 (50kg)</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">
                  {totalDapBags} <span className="text-xs font-normal text-neutral-400">Bags</span>
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">
                  {totalDapBags > 0 ? `Cost: ₹${(totalDapBags * 1350).toFixed(0)}` : 'Applied at Sowing'}
                </span>
              </div>

              {/* MOP Potash */}
              <div className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl">
                <span className="text-[11px] text-neutral-400 font-bold block">MOP Potash (50kg)</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">
                  {totalMopBags} <span className="text-xs font-normal text-neutral-400">Bags</span>
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">
                  {totalMopBags > 0 ? `Cost: ₹${(totalMopBags * 1700).toFixed(0)}` : 'Applied at Sowing'}
                </span>
              </div>

              {/* Zinc Sulfate */}
              <div className="bg-neutral-900 border border-neutral-800 p-3.5 rounded-xl">
                <span className="text-[11px] text-neutral-400 font-bold block">Zinc 21% (25kg)</span>
                <span className="text-2xl font-black text-white font-mono mt-1 block">
                  {totalZincBags} <span className="text-xs font-normal text-neutral-400">Bags</span>
                </span>
                <span className="text-[10px] text-neutral-500 block mt-1">
                  {totalZincBags > 0 ? `Cost: ₹${(totalZincBags * 850).toFixed(0)}` : 'Basal Dosing'}
                </span>
              </div>
            </div>
          </div>

          {/* IFFCO Nano Urea Upgrade Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-[#033427] to-neutral-900 border border-emerald-600/60 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold flex-shrink-0">
                <Droplet className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-sm font-bold text-white">
                    ICAR Recommended: IFFCO Nano Urea Foliar Spray
                  </h5>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-neutral-950">
                    Saves ₹{savings}
                  </span>
                </div>
                <p className="text-xs text-emerald-200/90 mt-0.5 leading-relaxed">
                  Replace {totalUreaBags} traditional urea bags with{' '}
                  <span className="text-white font-bold">{nanoBottles} bottles</span> (500ml) of Nano Urea.
                  Higher 80% absorption rate, zero groundwater contamination, and easier transport.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                alert(`Added ${nanoBottles} Nano Urea bottles to your Kisan Cooperative cart!`);
              }}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-neutral-950 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer shadow-md"
            >
              Order from PACS / Cooperative
            </button>
          </div>

          {/* Application Technique Guidelines */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 text-xs text-neutral-300 space-y-2">
            <h5 className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Optimal Application Window for Karnal:
            </h5>
            <p>
              • Apply urea top-dressing in the afternoon when leaves are completely dry from morning dew to prevent leaf scorch.
            </p>
            <p>
              • If using Nano Urea, mix 2-4 ml per liter of water. Spray using a flat-fan nozzle within 24 hours of 2nd irrigation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#032e22] px-6 py-3.5 border-t border-emerald-800/60 flex items-center justify-between">
          <span className="text-xs text-emerald-300">
            Validated for Agro-Climatic Zone VI (Trans-Gangetic Plains)
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
