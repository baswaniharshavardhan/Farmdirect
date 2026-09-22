import React, { useState, useRef } from 'react';
import {
  Sparkles,
  CheckCircle2,
  User,
  Flag,
  ShieldCheck,
  IndianRupee,
  Leaf,
  Layers,
  Thermometer,
  Award,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface HeroEcosystem3DProps {
  onOpenProfile: () => void;
  onOpenReport: () => void;
}

export const HeroEcosystem3D: React.FC<HeroEcosystem3DProps> = ({
  onOpenProfile,
  onOpenReport,
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [activeTabMetric, setActiveTabMetric] = useState<'payout' | 'organic' | 'coldchain'>('payout');
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation limits (-8deg to 8deg)
    const rotateY = ((x - centerX) / centerX) * 7;
    const rotateX = -((y - centerY) / centerY) * 7;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full perspective-1200 transition-all duration-300 py-2"
      id="hero-ecosystem-3d-stage"
    >
      {/* 3D Transform Main Container */}
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) scale3d(1.01, 1.01, 1.01)`
            : 'rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
          transformStyle: 'preserve-3d',
          transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-[#06382b] to-slate-950 border-2 border-emerald-500/30 p-6 sm:p-8 md:p-10 shadow-[0_25px_60px_-15px_rgba(6,78,59,0.35),0_0_50px_rgba(16,185,129,0.15)] text-white"
      >
        {/* Background 3D Perspective Grid & Ambient Lighting Spheres */}
        <div
          style={{ transform: 'translateZ(-20px)' }}
          className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px]"
        />
        <div
          style={{ transform: 'translateZ(-10px)' }}
          className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"
        />
        <div
          style={{ transform: 'translateZ(-10px)' }}
          className="absolute -bottom-24 -left-24 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"
        />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Attractive Editorial Typography & Value Proposition */}
          <div className="lg:col-span-7 space-y-5" style={{ transform: 'translateZ(30px)' }}>
            {/* Top Shimmering Network Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-400/40 text-emerald-200 text-xs shadow-lg shadow-emerald-950/60 backdrop-blur-md">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
              </span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="font-mono tracking-wider uppercase text-[11px] font-semibold text-emerald-300">
                Direct Farm-to-Consumer Ecosystem
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ZERO MIDDLEMEN
              </span>
            </div>

            {/* Main Display Headline with Editorial Typography */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-script text-2xl sm:text-3xl font-bold text-amber-300 drop-shadow-sm rotate-[-1.5deg] inline-block tracking-wide">
                  🌿 100% Direct From Soil to Kitchen
                </span>
                <span className="hidden sm:inline text-emerald-400/40">•</span>
                <span className="font-mono text-[11px] font-semibold text-emerald-300 tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-emerald-900/60 border border-emerald-500/30">
                  Batch #NSK-2026-N9
                </span>
              </div>

              <h1 className="attractive-headline text-3xl sm:text-5xl lg:text-[46px] font-normal text-white drop-shadow-md">
                Fresh Local Harvest,{' '}
                <span className="block sm:inline font-editorial italic font-light text-amber-200/95 pr-1">
                  Direct from{' '}
                </span>
                <span className="font-serif-harvest font-bold bg-gradient-to-r from-emerald-200 via-amber-200 to-amber-100 bg-clip-text text-transparent">
                  Regional Farms
                </span>
              </h1>

              <p className="text-emerald-100/90 text-xs sm:text-sm md:text-[15px] leading-relaxed max-w-2xl font-sans font-normal">
                Order directly from regional family farms with total economic transparency:{' '}
                <span className="text-amber-300 font-semibold font-mono bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/30 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                  88% of your payment
                </span>{' '}
                goes directly into the farmer's pocket, while refrigerated smart-batch routing brings dawn-harvested
                produce right to your door.
              </p>
            </div>

            {/* 3D Interactive Feature Badges with Attractive Tactile Depth */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              {/* Badge 1: 88% Direct Payout */}
              <button
                type="button"
                onClick={() => setActiveTabMetric('payout')}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  activeTabMetric === 'payout'
                    ? 'bg-gradient-to-br from-emerald-900/90 to-teal-950/90 border-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50'
                    : 'bg-emerald-950/40 border-emerald-800/60 hover:bg-emerald-900/50 hover:border-emerald-600'
                }`}
                style={{ transform: activeTabMetric === 'payout' ? 'translateZ(20px)' : 'translateZ(10px)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-xs text-white block">88% Direct Payout</span>
                    <span className="font-mono text-[11px] text-emerald-300/90 block">₹88/₹100 net to Kisan</span>
                  </div>
                </div>
              </button>

              {/* Badge 2: Certified Organic */}
              <button
                type="button"
                onClick={() => setActiveTabMetric('organic')}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  activeTabMetric === 'organic'
                    ? 'bg-gradient-to-br from-emerald-900/90 to-teal-950/90 border-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50'
                    : 'bg-emerald-950/40 border-emerald-800/60 hover:bg-emerald-900/50 hover:border-emerald-600'
                }`}
                style={{ transform: activeTabMetric === 'organic' ? 'translateZ(20px)' : 'translateZ(10px)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center flex-shrink-0">
                    <Award className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-xs text-white block">FPO Lab Certified</span>
                    <span className="font-sans text-[11px] text-emerald-200/80 block">NPOP &amp; PGS-India</span>
                  </div>
                </div>
              </button>

              {/* Badge 3: Doorstep Cold-Chain Delivery */}
              <button
                type="button"
                onClick={() => setActiveTabMetric('coldchain')}
                className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                  activeTabMetric === 'coldchain'
                    ? 'bg-gradient-to-br from-emerald-900/90 to-teal-950/90 border-emerald-400 shadow-[0_10px_25px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50'
                    : 'bg-emerald-950/40 border-emerald-800/60 hover:bg-emerald-900/50 hover:border-emerald-600'
                }`}
                style={{ transform: activeTabMetric === 'coldchain' ? 'translateZ(20px)' : 'translateZ(10px)' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-sky-500/20 text-sky-300 flex items-center justify-center flex-shrink-0">
                    <Thermometer className="w-4 h-4 text-sky-400" />
                  </div>
                  <div>
                    <span className="font-display font-bold text-xs text-white block">Doorstep Cold Delivery</span>
                    <span className="font-mono text-[11px] text-sky-200/80 block">Under 4°C active cooling</span>
                  </div>
                </div>
              </button>
            </div>

            {/* Quick Customer Action Buttons with Tactile Elevation */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-emerald-800/50">
              <button
                type="button"
                onClick={onOpenProfile}
                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-emerald-400/40 shadow-[0_4px_14px_rgba(6,78,59,0.4)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                id="btn-customer-profile-open"
              >
                <User className="w-4 h-4 text-amber-300" />
                <span className="font-display tracking-wide">My Profile</span>
              </button>

              <button
                type="button"
                onClick={onOpenReport}
                className="px-4 py-2.5 bg-white/10 hover:bg-rose-950/60 text-neutral-200 hover:text-rose-200 rounded-xl text-xs font-bold backdrop-blur-md flex items-center gap-2 border border-white/20 hover:border-rose-400/40 shadow-[0_4px_12px_rgba(0,0,0,0.25)] hover:shadow-[0_8px_20px_rgba(225,29,72,0.25)] transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                id="btn-customer-report-issue"
              >
                <Flag className="w-4 h-4 text-rose-400" />
                <span className="font-display tracking-wide">Report an Issue</span>
              </button>

              <div className="text-[11px] text-emerald-300/90 font-medium ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-sans">Live Harvest Linked · Nashik Agro Hub</span>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Ecosystem Transparency & Cold-Chain Ledger */}
          <div
            className="lg:col-span-5 flex justify-center"
            style={{ transform: 'translateZ(50px)' }}
          >
            <div className="relative w-full max-w-sm rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-emerald-900/90 via-[#052f23] to-slate-950 border-2 border-emerald-400/40 shadow-[0_25px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl space-y-4">
              {/* Top Card Badge */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="font-display uppercase tracking-wider text-[11px]">
                    Direct Farm Integrity Ledger
                  </span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  88% DIRECT
                </span>
              </div>

              {/* Value Split Display Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/20 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-neutral-300 font-medium">Direct Producer Share</span>
                  <div className="text-right">
                    <span className="font-mono text-3xl font-black text-amber-300 flex items-center justify-end">
                      <IndianRupee className="w-6 h-6 -mr-0.5" />88.00
                    </span>
                    <span className="font-mono text-xs text-emerald-300/70 font-semibold">/ ₹100.00 Gross</span>
                  </div>
                </div>

                {/* Progress bar showing 88% direct payout */}
                <div className="space-y-1.5 pt-1">
                  <div className="h-2.5 w-full bg-neutral-800 rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-l-full transition-all duration-500" style={{ width: '88%' }} />
                    <div className="h-full bg-sky-500" style={{ width: '7%' }} />
                    <div className="h-full bg-purple-500 rounded-r-full" style={{ width: '5%' }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-neutral-400 font-mono pt-0.5">
                    <span className="text-emerald-300 font-bold">88% Farmer Net</span>
                    <span className="text-sky-300">7% Cold Van</span>
                    <span className="text-purple-300">5% FPO Hub</span>
                  </div>
                </div>
              </div>

              {/* Live Status Indicators */}
              <div className="grid grid-cols-2 gap-2.5 text-xs">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-sky-400/30 transition-colors">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                    <Thermometer className="w-3.5 h-3.5 text-sky-400" />
                    <span>Cold Chain Transit</span>
                  </div>
                  <div className="font-mono font-bold text-sky-300 text-sm">3.4°C Chilled</div>
                  <div className="text-[10px] text-neutral-400">Under 4°C active reefers</div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1 hover:border-emerald-400/30 transition-colors">
                  <div className="flex items-center gap-1.5 text-neutral-400 text-[10px]">
                    <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Dawn Harvest</span>
                  </div>
                  <div className="font-mono font-bold text-emerald-300 text-sm">6:30 AM Today</div>
                  <div className="text-[10px] text-neutral-400">Direct to doorstep delivery</div>
                </div>
              </div>

              {/* Verification Stamp */}
              <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span className="text-emerald-100 font-medium font-sans">Nashik Agro Collective Cluster</span>
                </div>
                <span className="font-mono text-[10px] font-bold text-amber-300 px-2 py-0.5 bg-black/40 rounded-md border border-amber-400/30">
                  FPO-VERIFIED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
