import React, { useState } from 'react';
import {
  Sprout,
  Droplet,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  MapPin,
  Clock,
  Thermometer,
  ShieldCheck,
  RefreshCw,
  Plus,
} from 'lucide-react';

interface MyFarmPlotsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language?: 'en' | 'hi' | 'pa';
}

interface PlotData {
  id: string;
  name: string;
  hindiName: string;
  variety: string;
  plotName: string;
  acres: number;
  sowingDate: string;
  daysAfterSowing: number;
  healthPercent: number;
  irrigationDaysLeft: number;
  soilMoisture: number;
  stage: string;
  image: string;
  nextTask: string;
}

export const MyFarmPlotsModal: React.FC<MyFarmPlotsModalProps> = ({
  isOpen,
  onClose,
  language = 'en',
}) => {
  const [plots, setPlots] = useState<PlotData[]>([
    {
      id: 'plot-1',
      name: 'Wheat',
      hindiName: 'गेहूं',
      variety: 'HD-3226 (Pusa Yashasvi)',
      plotName: 'North Field - Plot 1',
      acres: 3.5,
      sowingDate: 'Nov 12, 2025',
      daysAfterSowing: 42,
      healthPercent: 94,
      irrigationDaysLeft: 2,
      soilMoisture: 64,
      stage: 'Tillering & Crown Root Initiation',
      image:
        'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=500&q=80',
      nextTask: '2nd Irrigation followed by 1 bottle Nano Urea spray per acre.',
    },
    {
      id: 'plot-2',
      name: 'Mustard',
      hindiName: 'सरसों',
      variety: 'RH-749 (Giriraj)',
      plotName: 'South Canal Plot',
      acres: 2.5,
      sowingDate: 'Oct 20, 2025',
      daysAfterSowing: 65,
      healthPercent: 89,
      irrigationDaysLeft: 7,
      soilMoisture: 58,
      stage: 'Pod Formation & Siliqua Filling',
      image:
        'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=500&q=80',
      nextTask: 'Inspect for Mustard Aphids (चेपा) on lower foliage; install yellow sticky traps.',
    },
    {
      id: 'plot-3',
      name: 'Sugarcane',
      hindiName: 'गन्ना',
      variety: 'Co 0238 (Karan 4)',
      plotName: 'Tube-well Field Plot 3',
      acres: 2.5,
      sowingDate: 'March 15, 2025',
      daysAfterSowing: 285,
      healthPercent: 96,
      irrigationDaysLeft: 4,
      soilMoisture: 72,
      stage: 'Grand Growth & Stalk Elongation',
      image:
        'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=500&q=80',
      nextTask: 'Earthing-up and wrapping clumps to protect against lodging during high winds.',
    },
  ]);

  const [selectedPlot, setSelectedPlot] = useState<PlotData>(plots[0]);
  const [logIrrigationSuccess, setLogIrrigationSuccess] = useState(false);

  if (!isOpen) return null;

  const handleLogIrrigation = (plotId: string) => {
    setPlots((prev) =>
      prev.map((p) =>
        p.id === plotId
          ? {
              ...p,
              irrigationDaysLeft: 14,
              soilMoisture: 88,
            }
          : p
      )
    );
    setSelectedPlot((prev) => ({
      ...prev,
      irrigationDaysLeft: 14,
      soilMoisture: 88,
    }));
    setLogIrrigationSuccess(true);
    setTimeout(() => setLogIrrigationSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-neutral-900 text-white w-full max-w-4xl rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#032e22] px-6 py-4 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center font-bold shadow-md">
              <Sprout className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white font-display">
                  My Standing Crops &amp; Field Plots
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-900 text-emerald-300 border border-emerald-600/60">
                  8.5 Acres Active
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Nilokheri, Tehsil Karnal, Haryana · Satellite Crop Canopy Monitored
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
          {logIrrigationSuccess && (
            <div className="bg-emerald-950 border border-emerald-500/50 p-3 rounded-xl text-xs text-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                Irrigation logged successfully for {selectedPlot.plotName}! Moisture updated to 88% and next watering reset to 14 days.
              </span>
            </div>
          )}

          {/* Plots Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {plots.map((plot) => (
              <button
                key={plot.id}
                type="button"
                onClick={() => setSelectedPlot(plot)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  selectedPlot.id === plot.id
                    ? 'bg-emerald-950/80 border-amber-400 ring-1 ring-amber-400 text-white'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-900/90 text-emerald-300 border border-emerald-600/60">
                      {plot.healthPercent}% Healthy
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-950 text-blue-300 border border-blue-700/60">
                      सिंचाई: {plot.irrigationDaysLeft} दिन
                    </span>
                  </div>

                  <h4 className="font-black text-white text-base">
                    {plot.name} ({plot.hindiName})
                  </h4>
                  <p className="text-xs text-amber-300 font-medium">{plot.variety}</p>
                  <p className="text-[11px] text-neutral-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-neutral-500" />
                    <span>{plot.plotName}</span>
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                  <span className="text-neutral-400">{plot.acres} Acres</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    Moisture: {plot.soilMoisture}%
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Selected Plot View */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  Selected Field Plot Telemetry
                </span>
                <h3 className="text-xl font-black text-white">
                  {selectedPlot.name} ({selectedPlot.hindiName}) · {selectedPlot.plotName}
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Variety: <span className="text-neutral-200 font-bold">{selectedPlot.variety}</span> · Sown on {selectedPlot.sowingDate} ({selectedPlot.daysAfterSowing} Days Ago)
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleLogIrrigation(selectedPlot.id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-md"
              >
                <Droplet className="w-4 h-4" />
                <span>Log Irrigation Completed</span>
              </button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">Growth Stage</span>
                <span className="text-xs font-bold text-white block mt-1">
                  {selectedPlot.stage}
                </span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">Soil Moisture Level</span>
                <span className="text-lg font-black text-blue-400 font-mono block mt-0.5">
                  {selectedPlot.soilMoisture}%
                </span>
                <span className="text-[10px] text-emerald-400">Optimal Root Zone</span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">Irrigation Countdown</span>
                <span className="text-lg font-black text-amber-400 font-mono block mt-0.5">
                  {selectedPlot.irrigationDaysLeft} Days Left
                </span>
                <span className="text-[10px] text-neutral-400">Morning Slot</span>
              </div>

              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <span className="text-[11px] text-neutral-400 block">Overall Canopy Health</span>
                <span className="text-lg font-black text-emerald-400 font-mono block mt-0.5">
                  {selectedPlot.healthPercent}%
                </span>
                <span className="text-[10px] text-neutral-400">NDVI Satellite Scan</span>
              </div>
            </div>

            {/* Next Recommended Task */}
            <div className="bg-[#032e22] border border-emerald-700/60 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-300 block">
                  Next Agronomy Action for this Plot:
                </span>
                <p className="text-xs text-emerald-100 mt-1 leading-relaxed">
                  {selectedPlot.nextTask}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-[#032e22] px-6 py-3.5 border-t border-emerald-800/60 flex items-center justify-between">
          <span className="text-xs text-emerald-300">
            Karnal District Agriculture Department &amp; ICAR Land Registry
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
