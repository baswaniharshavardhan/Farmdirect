import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Phone,
  Sprout,
  Mic,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  Sun,
  CloudRain,
  Droplets,
  Wind,
  Thermometer,
  TrendingUp,
  TrendingDown,
  Layers,
  Landmark,
  Tractor,
  ArrowRight,
  CheckCircle2,
  Calendar,
  MapPin,
  RefreshCw,
  LogOut,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { AskKisanAIModal } from './AskKisanAIModal';
import { AICropDoctorModal } from './AICropDoctorModal';
import { LiveMandiBhavModal } from './LiveMandiBhavModal';
import { FertilizerCalculatorModal } from './FertilizerCalculatorModal';
import { MachineryRentalModal } from './MachineryRentalModal';
import { MyFarmPlotsModal } from './MyFarmPlotsModal';
import { FarmerSchemesModal } from './FarmerSchemesModal';
import { FarmerPortal } from './FarmerPortal';
import { UserProfileModal } from './UserProfileModal';

export const KisanSetuDashboard: React.FC = () => {
  const { currentUser, logout } = useMarketplace();

  // Active navigation tab
  const [activeNavTab, setActiveNavTab] = useState<
    'home' | 'crop_doctor' | 'mandi_bhav' | 'my_farm' | 'govt_schemes' | 'chaupal' | 'marketplace'
  >('home');

  // Multi-language state: 'en' | 'hi' | 'pa'
  const [language, setLanguage] = useState<'en' | 'hi' | 'pa'>('en');

  // Selected forecast day
  const [selectedForecastDay, setSelectedForecastDay] = useState(0);

  // Audio bulletin state
  const [isPlayingBulletin, setIsPlayingBulletin] = useState(false);
  const [isPlayingWeather, setIsPlayingWeather] = useState(false);

  // Interactive Modals
  const [isKisanAIOpen, setIsKisanAIOpen] = useState(false);
  const [isCropDoctorOpen, setIsCropDoctorOpen] = useState(false);
  const [isMandiBhavOpen, setIsMandiBhavOpen] = useState(false);
  const [isPlotsModalOpen, setIsPlotsModalOpen] = useState(false);
  const [isFertilizerModalOpen, setIsFertilizerModalOpen] = useState(false);
  const [isSchemesModalOpen, setIsSchemesModalOpen] = useState(false);
  const [isRentalModalOpen, setIsRentalModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const farmerName = currentUser.name || 'Rameshwar Lal Sharma';
  const farmerLocation = 'Karnal, Haryana (8.5 Acre)';

  // 7-day farm forecast
  const forecastDays = [
    { day: 'Mon', dayHi: 'सोम', tempHigh: '26°', tempLow: '14°', icon: Sun, condition: 'Sunny & Pleasant' },
    { day: 'Tue', dayHi: 'मंगल', tempHigh: '27°', tempLow: '15°', icon: Sun, condition: 'Clear Sky' },
    { day: 'Wed', dayHi: 'बुध', tempHigh: '25°', tempLow: '13°', icon: CloudRain, rainChance: '35%', condition: 'Light Dew / Drizzle' },
    { day: 'Thu', dayHi: 'गुरु', tempHigh: '24°', tempLow: '13°', icon: Sun, condition: 'Partly Cloudy' },
    { day: 'Fri', dayHi: 'शुक्र', tempHigh: '25°', tempLow: '13°', icon: Sun, condition: 'Sunny' },
    { day: 'Sat', dayHi: 'शनि', tempHigh: '26°', tempLow: '14°', icon: Sun, condition: 'Sunny & Warm' },
    { day: 'Sun', dayHi: 'रवि', tempHigh: '28°', tempLow: '15°', icon: Sun, condition: 'Clear Sky' },
  ];

  // Speech synthesis for Today's Bulletin
  const handleToggleBulletinSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert("Text-to-speech audio is playing: 'Namaste Rameshwar Lal Sharma! Favorable sunny skies today. Optimal window for second irrigation and nano urea spraying on your wheat crops.'");
      return;
    }

    if (isPlayingBulletin) {
      window.speechSynthesis.cancel();
      setIsPlayingBulletin(false);
      return;
    }

    window.speechSynthesis.cancel();
    const bulletinText =
      language === 'hi'
        ? `नमस्ते ${farmerName}! आज करनाल में मौसम अनुकूल और धूपदार है। आपके गेहूं की फसल में दूसरी सिंचाई और नैनो यूरिया के छिड़काव का सबसे उत्तम समय है। पीला रतुआ और माहू कीट की नियमित जांच करते रहें।`
        : language === 'pa'
        ? `ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ ${farmerName}! ਅੱਜ ਕਰਨਾਲ ਵਿੱਚ ਮੌਸਮ ਅਨੁਕੂਲ ਹੈ। ਤੁਹਾਡੀ ਕਣਕ ਦੀ ਫਸਲ ਵਿੱਚ ਦੂਜੀ ਸਿੰਜਾਈ ਅਤੇ ਨੈਨੋ ਯੂਰੀਆ ਸਪਰੇਅ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਹੈ।`
        : `Namaste, ${farmerName}! Favorable sunny skies today across Karnal with temperatures at 24 degrees Celsius. It is the optimal window for second irrigation and nano urea foliar spraying on your HD-3226 wheat crops. Stay alert for yellow stripe rust and inspect mustard foliage.`;

    const utterance = new SpeechSynthesisUtterance(bulletinText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingBulletin(true);
    utterance.onend = () => setIsPlayingBulletin(false);
    utterance.onerror = () => setIsPlayingBulletin(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleToggleWeatherSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlayingWeather) {
      window.speechSynthesis.cancel();
      setIsPlayingWeather(false);
      return;
    }

    window.speechSynthesis.cancel();
    const weatherText =
      language === 'hi'
        ? `मौसम बुलेटिन करनाल: वर्तमान तापमान 24 डिग्री सेल्सियस, आर्द्रता 58 प्रतिशत, हवा की गति 9 किलोमीटर प्रति घंटा। छिड़काव के लिए स्थिति पूरी तरह अनुकूल है।`
        : `Weather Bulletin for Karnal, Haryana: Current temperature 24 degrees Celsius, humidity 58 percent, wind speed 9 kilometers per hour, soil moisture 64 percent. Optimal window for foliar spray.`;

    const utterance = new SpeechSynthesisUtterance(weatherText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    utterance.rate = 0.95;

    utterance.onstart = () => setIsPlayingWeather(true);
    utterance.onend = () => setIsPlayingWeather(false);
    utterance.onerror = () => setIsPlayingWeather(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="min-h-screen bg-[#f3f7f4] text-neutral-900 flex flex-col font-sans selection:bg-amber-400 selection:text-neutral-950">
      {/* 1. TOP GOVERNMENT & LANGUAGE BAR */}
      <div className="bg-[#022c22] text-white text-[11px] py-2 px-4 border-b border-emerald-900/60 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: ICAR Verification */}
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-emerald-200">
              ICAR &amp; Krishi Mantralaya Verified
            </span>
            <span className="text-emerald-500 hidden sm:inline">•</span>
            <span className="text-emerald-300/90 hidden sm:inline">
              Rabi Season 2026 - Agro Conditions Favorable
            </span>
          </div>

          {/* Right: Kisan Helpline & Language Selector */}
          <div className="flex items-center gap-4">
            <a
              href="tel:1551"
              className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Kisan Helpline: 1551</span>
            </a>

            <div className="flex items-center bg-[#011c16] rounded-lg p-0.5 border border-emerald-800/60 text-[10px] font-bold">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-amber-400 text-neutral-950 shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('hi')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  language === 'hi'
                    ? 'bg-amber-400 text-neutral-950 shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage('pa')}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  language === 'pa'
                    ? 'bg-amber-400 text-neutral-950 shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ਪੰਜਾਬੀ
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN KISANSETU HEADER */}
      <header className="bg-[#033b2e] text-white shadow-md border-b border-emerald-800/80 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5">
          <div className="flex items-center justify-between gap-4">
            {/* Logo and Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-400 text-neutral-950 flex items-center justify-center shadow-lg flex-shrink-0 font-bold">
                <Sprout className="w-6 h-6 text-neutral-950" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white font-display">
                    KisanSetu
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#02261e] text-emerald-400 border border-emerald-600/50 uppercase tracking-wider">
                    SMART AGRI
                  </span>
                </div>
                <p className="text-[11px] text-emerald-300 font-medium">
                  Empowering India's Farmers
                </p>
              </div>
            </div>

            {/* Right Action Buttons: Ask Kisan AI + User Profile */}
            <div className="flex items-center gap-3">
              {/* Ask Kisan AI Button */}
              <button
                type="button"
                onClick={() => setIsKisanAIOpen(true)}
                className="bg-amber-400 hover:bg-amber-300 text-neutral-950 font-bold px-4 py-2 rounded-xl flex items-center gap-2 text-xs sm:text-sm shadow-md transition-all cursor-pointer transform active:scale-95"
                id="btn-ask-kisan-ai"
              >
                <Mic className="w-4 h-4 text-neutral-950" />
                <span className="whitespace-nowrap">Ask Kisan AI</span>
              </button>

              {/* Farmer Profile Badge */}
              <div
                onClick={() => setIsProfileModalOpen(true)}
                className="flex items-center gap-2.5 bg-[#022c22] hover:bg-[#02241b] border border-emerald-700/60 rounded-xl p-1.5 pr-3 transition-colors cursor-pointer"
                title="View Farmer Profile & Settings"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-400 flex-shrink-0 shadow-sm">
                  <img
                    src="/farmer-portrait.jpg"
                    alt={farmerName}
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-xs font-bold text-white leading-tight">{farmerName}</p>
                  <p className="text-[10px] text-emerald-300/90 leading-tight">
                    📍 {farmerLocation}
                  </p>
                </div>
              </div>

              {/* Logout button */}
              <button
                type="button"
                onClick={logout}
                className="p-2 text-emerald-300/80 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 3. SUB-NAVIGATION TABS */}
        <div className="bg-[#022d23] border-t border-emerald-900/60 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveNavTab('home')}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeNavTab === 'home'
                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Home
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNavTab('crop_doctor');
                setIsCropDoctorOpen(true);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeNavTab === 'crop_doctor'
                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Crop Doctor</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNavTab('mandi_bhav');
                setIsMandiBhavOpen(true);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeNavTab === 'mandi_bhav'
                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Mandi Bhav
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNavTab('my_farm');
                setIsPlotsModalOpen(true);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeNavTab === 'my_farm'
                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/5'
              }`}
            >
              My Farm
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNavTab('govt_schemes');
                setIsSchemesModalOpen(true);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeNavTab === 'govt_schemes'
                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Govt Schemes
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveNavTab('chaupal');
                setIsRentalModalOpen(true);
              }}
              className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeNavTab === 'chaupal'
                  ? 'bg-amber-400 text-neutral-950 shadow-xs'
                  : 'text-emerald-200 hover:text-white hover:bg-white/5'
              }`}
            >
              Chaupal &amp; Rentals
            </button>

            <button
              type="button"
              onClick={() => setActiveNavTab('marketplace')}
              className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ml-auto ${
                activeNavTab === 'marketplace'
                  ? 'bg-emerald-500 text-neutral-950 font-black shadow-xs'
                  : 'text-amber-300 hover:text-white hover:bg-white/5 border border-amber-500/40'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Produce Inventory &amp; Orders</span>
            </button>
          </div>
        </div>
      </header>

      {/* RENDER MARKETPLACE TAB IF SELECTED */}
      {activeNavTab === 'marketplace' ? (
        <div className="flex-1">
          <FarmerPortal />
        </div>
      ) : (
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-5 w-full">
          {/* 4. LIVE MANDI TICKER */}
          <div
            onClick={() => setIsMandiBhavOpen(true)}
            className="bg-[#111818] border border-amber-500/30 rounded-xl py-2 px-4 text-xs shadow-inner flex items-center gap-4 overflow-x-auto no-scrollbar cursor-pointer hover:border-amber-400 transition-colors"
            title="Click to view full Mandi Bhav table"
          >
            <span className="text-amber-400 font-black tracking-wide flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
              ⚡ LIVE MANDI TICKER
            </span>

            <div className="flex items-center gap-6 whitespace-nowrap text-neutral-200">
              <span className="flex items-center gap-1">
                <span className="text-white font-bold">Wheat :</span>
                <span className="text-amber-300 font-mono font-bold">₹2615/Q</span>
                <span className="text-emerald-400 flex items-center text-[11px] font-bold">
                  ▲ +₹35
                </span>
              </span>

              <span className="text-neutral-700">•</span>

              <span className="flex items-center gap-1">
                <span className="text-white font-bold">Mustard :</span>
                <span className="text-amber-300 font-mono font-bold">₹5920/Q</span>
                <span className="text-red-400 flex items-center text-[11px] font-bold">
                  ▼ -₹40
                </span>
              </span>

              <span className="text-neutral-700">•</span>

              <span className="flex items-center gap-1">
                <span className="text-white font-bold">Basmati Paddy 1121 :</span>
                <span className="text-amber-300 font-mono font-bold">₹4620/Q</span>
                <span className="text-emerald-400 flex items-center text-[11px] font-bold">
                  ▲ +₹80
                </span>
              </span>

              <span className="text-neutral-700">•</span>

              <span className="flex items-center gap-1">
                <span className="text-white font-bold">Cotton / Narma :</span>
                <span className="text-amber-300 font-mono font-bold">₹7180/Q</span>
                <span className="text-emerald-400 flex items-center text-[11px] font-bold">
                  ▲ +₹110
                </span>
              </span>

              <span className="text-neutral-700">•</span>

              <span className="flex items-center gap-1">
                <span className="text-white font-bold">Potato :</span>
                <span className="text-amber-300 font-mono font-bold">₹1380/Q</span>
                <span className="text-emerald-400 flex items-center text-[11px] font-bold">
                  ▲ +₹25
                </span>
              </span>
            </div>
          </div>

          {/* 5. WELCOME FARMER HERO BANNER */}
          <div className="bg-[#07392b] border border-emerald-700/40 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden text-white">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
              {/* Farmer photo and greeting */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400 shadow-xl bg-neutral-900">
                    <img
                      src="/farmer-portrait.jpg"
                      alt={farmerName}
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-2 inset-x-0 mx-auto w-fit bg-amber-400 text-neutral-950 text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">
                    KISAN
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-300 tracking-wider uppercase mb-1">
                    <span>RABI SEASON 2026</span>
                    <span>•</span>
                    <span>KARNAL</span>
                    <span>•</span>
                    <span>8.5 ACRES FARMLAND</span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-white font-display tracking-tight">
                    {language === 'hi' ? `नमस्ते, ${farmerName}!` : `Namaste, ${farmerName}!`}
                  </h2>

                  <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl leading-relaxed">
                    {language === 'hi'
                      ? 'आज मौसम अनुकूल और धूपदार है। आपके गेहूं की फसल में दूसरी सिंचाई और नैनो यूरिया के छिड़काव का सबसे उत्तम समय है।'
                      : 'Favorable sunny skies today. Optimal window for 2nd irrigation and nano urea spraying on your wheat crops.'}
                  </p>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full md:w-auto">
                {/* Audio Bulletin Button */}
                <button
                  type="button"
                  onClick={handleToggleBulletinSpeech}
                  className={`flex-1 sm:flex-initial px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap ${
                    isPlayingBulletin
                      ? 'bg-amber-300 text-neutral-950 ring-2 ring-amber-400 animate-pulse'
                      : 'bg-amber-400 hover:bg-amber-300 text-neutral-950'
                  }`}
                >
                  {isPlayingBulletin ? (
                    <VolumeX className="w-4 h-4" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                  <span>{isPlayingBulletin ? 'Playing Audio...' : "Listen to Today's Bulletin"}</span>
                </button>

                {/* Chat with Agri-AI */}
                <button
                  type="button"
                  onClick={() => setIsKisanAIOpen(true)}
                  className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#094d3a] hover:bg-[#0c5c47] text-emerald-100 border border-emerald-500/60 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer whitespace-nowrap"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Chat with Agri-AI</span>
                </button>
              </div>
            </div>
          </div>

          {/* 6. ICAR / KVK REGIONAL FIELD ALERT BANNER */}
          <div className="bg-[#fffbeb] border border-amber-300/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h4 className="text-xs font-black text-amber-900 uppercase tracking-wide">
                  ICAR / KVK REGIONAL FIELD ALERT
                </h4>
                <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                  Fluctuating morning dew and temperature spike increase vulnerability to Stripe Rust
                  in Wheat and Aphids in Mustard. Inspect fields closely.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCropDoctorOpen(true)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs whitespace-nowrap cursor-pointer shadow-xs transition-colors self-end sm:self-center"
            >
              Inspect Now
            </button>
          </div>

          {/* 7. AGRO-METEOROLOGY ADVISORY CARD */}
          <div className="bg-[#054332] text-white rounded-2xl p-5 border border-emerald-600/50 shadow-md">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-emerald-700/50 pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-neutral-950 flex items-center justify-center shadow-xs">
                  <Sun className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-tight">
                    Agro-Meteorology Advisory
                  </h3>
                  <p className="text-xs text-emerald-200/80">
                    Karnal, Haryana • Live Satellite Agromet
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleWeatherSpeech}
                className="px-3 py-1.5 bg-[#033427] hover:bg-[#02281e] border border-emerald-600/60 rounded-xl text-xs font-bold text-emerald-200 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-300" />
                <span>{isPlayingWeather ? 'Stop' : 'Listen'}</span>
              </button>
            </div>

            {/* Weather Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Left Temperature Display */}
              <div className="lg:col-span-4 flex items-center gap-4 bg-[#033427] p-4 rounded-xl border border-emerald-800/60">
                <div className="w-14 h-14 rounded-2xl bg-amber-400/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Sun className="w-8 h-8" />
                </div>
                <div>
                  <div className="text-3xl sm:text-4xl font-black text-white font-mono leading-none">
                    24°C
                  </div>
                  <div className="text-xs font-bold text-amber-300 mt-1">Sunny &amp; Pleasant</div>
                  <div className="text-[11px] text-emerald-300/80">Min 14°C • Max 27°C</div>
                </div>
              </div>

              {/* Middle Metrics 4-Grid */}
              <div className="lg:col-span-4 grid grid-cols-2 gap-2.5">
                <div className="bg-[#033427] p-2.5 rounded-xl border border-emerald-800/60">
                  <div className="flex items-center justify-between text-emerald-300 text-[11px]">
                    <span>Humidity</span>
                    <Droplets className="w-3.5 h-3.5 text-blue-400" />
                  </div>
                  <div className="text-lg font-black text-white font-mono mt-0.5">58%</div>
                </div>

                <div className="bg-[#033427] p-2.5 rounded-xl border border-emerald-800/60">
                  <div className="flex items-center justify-between text-emerald-300 text-[11px]">
                    <span>Wind Speed</span>
                    <Wind className="w-3.5 h-3.5 text-teal-400" />
                  </div>
                  <div className="text-lg font-black text-white font-mono mt-0.5">9 km/h</div>
                </div>

                <div className="bg-[#033427] p-2.5 rounded-xl border border-emerald-800/60">
                  <div className="flex items-center justify-between text-emerald-300 text-[11px]">
                    <span>Rain Chance</span>
                    <CloudRain className="w-3.5 h-3.5 text-blue-300" />
                  </div>
                  <div className="text-lg font-black text-white font-mono mt-0.5">5%</div>
                </div>

                <div className="bg-[#033427] p-2.5 rounded-xl border border-emerald-800/60">
                  <div className="flex items-center justify-between text-emerald-300 text-[11px]">
                    <span>Soil Moisture</span>
                    <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="text-lg font-black text-white font-mono mt-0.5">64%</div>
                </div>
              </div>

              {/* Right Foliar Spray Suitability Box */}
              <div className="lg:col-span-4 bg-[#043729] border border-emerald-700/60 p-3.5 rounded-xl flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-white">Foliar Spray Suitability</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-neutral-950">
                      Optimal
                    </span>
                  </div>
                  <p className="text-xs text-emerald-100/90 leading-relaxed">
                    Favorable winds (&lt; 10 km/h) &amp; low humidity. Ideal window for foliar spray
                    and weedicide application.
                  </p>
                </div>
                <div className="mt-2 text-xs font-bold text-amber-300 flex items-center gap-1.5 pt-1.5 border-t border-emerald-800/80">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Best Irrigation Window: Tomorrow morning</span>
                </div>
              </div>
            </div>

            {/* 7-Day Farm Forecast Row */}
            <div className="mt-4 pt-4 border-t border-emerald-700/50">
              <div className="text-xs font-bold text-emerald-300 mb-2">7-Day Farm Forecast</div>
              <div className="grid grid-cols-7 gap-2">
                {forecastDays.map((fd, idx) => {
                  const Icon = fd.icon;
                  const isSelected = selectedForecastDay === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedForecastDay(idx)}
                      className={`p-2 rounded-xl text-center transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-amber-400 text-neutral-950 border-amber-300 shadow-md font-bold'
                          : 'bg-[#033427] text-emerald-100 border-emerald-800/60 hover:bg-[#044030]'
                      }`}
                    >
                      <div className="text-[11px] font-bold">{fd.day}</div>
                      <Icon
                        className={`w-4 h-4 mx-auto my-1 ${
                          isSelected ? 'text-neutral-950' : 'text-amber-400'
                        }`}
                      />
                      <div className="text-xs font-mono font-bold">
                        {fd.tempHigh} / {fd.tempLow}
                      </div>
                      {fd.rainChance && (
                        <div
                          className={`text-[9px] font-bold mt-0.5 ${
                            isSelected ? 'text-neutral-900' : 'text-blue-300'
                          }`}
                        >
                          {fd.rainChance}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 8. QUICK AGRICULTURAL SERVICES (3x2 Grid) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight font-display">
                Quick Agricultural Services
              </h3>
              <span className="text-xs text-neutral-500 font-medium">Tap to open</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* 1. AI Crop Doctor */}
              <div
                onClick={() => setIsCropDoctorOpen(true)}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 hover:shadow-xl hover:border-emerald-500/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-200">
                      AI POWERED
                    </span>
                  </div>

                  <h4 className="text-base font-black text-neutral-900 group-hover:text-emerald-800 transition-colors">
                    AI Crop Doctor
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Snap or upload leaf photo. Instant diagnosis of fungal, bacterial, and nutrient
                    issues with dosage.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-bold text-emerald-700 group-hover:text-emerald-800">
                  <span>Diagnose Plant Health</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* 2. Live Mandi Bhav */}
              <div
                onClick={() => setIsMandiBhavOpen(true)}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 hover:shadow-xl hover:border-amber-500/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                      LIVE APMC
                    </span>
                  </div>

                  <h4 className="text-base font-black text-neutral-900 group-hover:text-amber-800 transition-colors">
                    Live Mandi Bhav
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Daily spot auction rates across regional grain markets with MSP margin and payout
                    calculator.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-bold text-amber-700 group-hover:text-amber-800">
                  <span>View Today's Rates</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* 3. My Crops & Irrigation */}
              <div
                onClick={() => setIsPlotsModalOpen(true)}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 hover:shadow-xl hover:border-teal-500/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold group-hover:bg-teal-600 group-hover:text-white transition-colors">
                      <Sprout className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800 border border-teal-200">
                      8.5 ACRES ACTIVE
                    </span>
                  </div>

                  <h4 className="text-base font-black text-neutral-900 group-hover:text-teal-800 transition-colors">
                    My Crops &amp; Irrigation
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Track tillering, pod filling, days from sowing, and scheduled watering alerts for
                    your plots.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-bold text-teal-700 group-hover:text-teal-800">
                  <span>View Field Plots</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* 4. Fertilizer Calculator */}
              <div
                onClick={() => setIsFertilizerModalOpen(true)}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 hover:shadow-xl hover:border-neutral-500/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-neutral-100 text-neutral-800 flex items-center justify-center font-bold group-hover:bg-neutral-800 group-hover:text-white transition-colors">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-neutral-100 text-neutral-800 border border-neutral-200">
                      ICAR DOSES
                    </span>
                  </div>

                  <h4 className="text-base font-black text-neutral-900 group-hover:text-neutral-800 transition-colors">
                    Fertilizer Calculator
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Calculate exact bags of Urea, DAP, Potash &amp; Zinc for your acreage to save money
                    and boost yields.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-bold text-neutral-700 group-hover:text-neutral-900">
                  <span>Calculate Doses</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* 5. Govt Subsidies & Schemes */}
              <div
                onClick={() => setIsSchemesModalOpen(true)}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 hover:shadow-xl hover:border-blue-500/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                      DBT DIRECT
                    </span>
                  </div>

                  <h4 className="text-base font-black text-neutral-900 group-hover:text-blue-800 transition-colors">
                    Govt Subsidies &amp; Schemes
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    PM-Kisan installment tracker, crop damage claims, and 60% solar pump government
                    subsidies.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-bold text-blue-700 group-hover:text-blue-800">
                  <span>Check Schemes</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>

              {/* 6. Machinery Rental & Forum */}
              <div
                onClick={() => setIsRentalModalOpen(true)}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 hover:shadow-xl hover:border-orange-500/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-700 flex items-center justify-center font-bold group-hover:bg-orange-600 group-hover:text-white transition-colors">
                      <Tractor className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-orange-800 border border-orange-200">
                      4 NEARBY
                    </span>
                  </div>

                  <h4 className="text-base font-black text-neutral-900 group-hover:text-orange-800 transition-colors">
                    Machinery Rental &amp; Forum
                  </h4>
                  <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
                    Rent tractors, spraying drones, and harvesters from neighbors, and discuss
                    agronomy tips.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center text-xs font-bold text-orange-700 group-hover:text-orange-800">
                  <span>View Rentals &amp; Chaupal</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          </div>

          {/* 9. STANDING CROPS IN FIELD SECTION */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-black text-neutral-900 tracking-tight font-display">
                  Standing Crops in Field
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  Nilokheri, Tehsil Karnal • 8.5 Acres
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPlotsModalOpen(true)}
                className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
              >
                <span>View All Plots</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Wheat HD-3226 */}
              <div
                onClick={() => setIsPlotsModalOpen(true)}
                className="bg-white border border-neutral-200/90 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=300&q=80"
                    alt="Wheat HD-3226"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800">
                      94% Healthy
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-800">
                      सिंचाई: 2 दिन
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-neutral-900 truncate">
                    Wheat (गेहूं)
                  </h4>
                  <p className="text-xs text-neutral-600 font-medium truncate">
                    HD-3226 (Pusa Yashasvi)
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    North Field - Plot 1
                  </p>
                </div>
              </div>

              {/* Card 2: Mustard RH-749 */}
              <div
                onClick={() => setIsPlotsModalOpen(true)}
                className="bg-white border border-neutral-200/90 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=300&q=80"
                    alt="Mustard RH-749"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800">
                      89% Healthy
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-800">
                      सिंचाई: 7 दिन
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-neutral-900 truncate">
                    Mustard (सरसों)
                  </h4>
                  <p className="text-xs text-neutral-600 font-medium truncate">
                    RH-749 (Giriraj)
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    South Canal Plot
                  </p>
                </div>
              </div>

              {/* Card 3: Sugarcane Co 0238 */}
              <div
                onClick={() => setIsPlotsModalOpen(true)}
                className="bg-white border border-neutral-200/90 rounded-2xl p-4 hover:shadow-lg transition-all cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border border-neutral-200">
                  <img
                    src="https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=300&q=80"
                    alt="Sugarcane Co 0238"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800">
                      96% Healthy
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-100 text-blue-800">
                      सिंचाई: 4 दिन
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-neutral-900 truncate">
                    Sugarcane (गन्ना)
                  </h4>
                  <p className="text-xs text-neutral-600 font-medium truncate">
                    Co 0238 (Karan 4)
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Tube-well Field Plot 3
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ALL INTERACTIVE MODALS */}
      <AskKisanAIModal
        isOpen={isKisanAIOpen}
        onClose={() => setIsKisanAIOpen(false)}
        farmerName={farmerName}
        language={language}
      />

      <AICropDoctorModal
        isOpen={isCropDoctorOpen}
        onClose={() => setIsCropDoctorOpen(false)}
        language={language}
      />

      <LiveMandiBhavModal
        isOpen={isMandiBhavOpen}
        onClose={() => setIsMandiBhavOpen(false)}
        language={language}
      />

      <FertilizerCalculatorModal
        isOpen={isFertilizerModalOpen}
        onClose={() => setIsFertilizerModalOpen(false)}
        language={language}
      />

      <MachineryRentalModal
        isOpen={isRentalModalOpen}
        onClose={() => setIsRentalModalOpen(false)}
        language={language}
      />

      <MyFarmPlotsModal
        isOpen={isPlotsModalOpen}
        onClose={() => setIsPlotsModalOpen(false)}
        language={language}
      />

      <FarmerSchemesModal
        isOpen={isSchemesModalOpen}
        onClose={() => setIsSchemesModalOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};
