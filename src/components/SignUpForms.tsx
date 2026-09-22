import React, { useState } from 'react';
import {
  ShoppingBag,
  Tractor,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  MapPin,
  ShieldCheck,
  Building2,
  DollarSign,
  Phone,
  Mail,
  Lock,
  User as UserIcon,
  HelpCircle,
  Check,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { CustomerSignUpData, FarmerSignUpData } from '../types';
import { PhoneOtpVerification } from './PhoneOtpVerification';

interface SignUpFormsProps {
  initialRole?: 'consumer' | 'farmer';
  onSwitchToLogin: () => void;
}

const COMMON_CROPS = [
  'Heirloom Tomatoes',
  'Organic Apples',
  'Strawberries',
  'Kale & Chard',
  'Romanesco & Broccoli',
  'Pasture Eggs',
  'Artisan Raw Honey',
  'Meyer Lemons',
  'Stone Fruit',
  'Wild Foraged Mushrooms',
];

export const SignUpForms: React.FC<SignUpFormsProps> = ({
  initialRole = 'consumer',
  onSwitchToLogin,
}) => {
  const { registerCustomer, registerFarmer } = useMarketplace();

  const [role, setRole] = useState<'consumer' | 'farmer'>(initialRole);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Phone OTP Verification States
  const [customerPhoneVerified, setCustomerPhoneVerified] = useState(false);
  const [farmerPhoneVerified, setFarmerPhoneVerified] = useState(false);

  // Customer Form State
  const [customerData, setCustomerData] = useState<CustomerSignUpData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    streetAddress: '',
    city: 'Nashik',
    zipCode: '422001',
    deliveryNotes: 'Leave with security / doorstep',
    preferredPaymentMethod: 'upi',
    buyerType: 'individual',
    businessName: '',
    gstNumber: '',
    orderVolume: '10-30 kg / week',
  });

  // Farmer Form State
  const [farmerData, setFarmerData] = useState<FarmerSignUpData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    farmName: '',
    farmLocation: 'Dindori, Nashik Agro-Belt, MH',
    bio: '',
    certifiedOrganic: true,
    certificationNumber: '',
    primaryCrops: ['Organic Apples', 'Heirloom Tomatoes'],
    acreage: 28,
    payoutMethod: 'direct_ach',
    bankRoutingNumber: 'SBIN0001234',
    bankAccountNumber: '9876543210',
    fpoCode: 'FPO-MH-2024-8842',
    fpoName: 'Sahyadri Farmers Producer Co. Ltd.',
    fpoCluster: 'Nashik Horticulture Cluster',
  });

  // Pre-fill Sample Customer
  const fillSampleCustomer = (type: 'individual' | 'bulk' = 'individual') => {
    const isBulk = type === 'bulk';
    setCustomerData({
      name: isBulk ? 'Rajesh Verma (Green Leaf Grocers)' : 'Julian Davies',
      email: isBulk ? `rajesh.bulk.${Math.floor(Math.random() * 900 + 100)}@greenleaf.in` : `julian.${Math.floor(Math.random() * 900 + 100)}@sfbay.org`,
      password: 'SecurePassword123!',
      phone: isBulk ? '+91 98220 11223' : '+91 98765 43210',
      streetAddress: isBulk ? 'Plot 14, Commercial Market Yard' : 'Flat 402, Royal Palms',
      city: 'Nashik',
      zipCode: '422003',
      deliveryNotes: isBulk ? 'Unload at rear warehouse bay 2; forklift available' : 'Leave at doorstep; ring buzzer upon arrival',
      preferredPaymentMethod: 'upi',
      buyerType: type,
      businessName: isBulk ? 'Green Leaf Wholesale Organics & Retail' : '',
      gstNumber: isBulk ? '27AAAAA0000A1Z5' : '',
      orderVolume: isBulk ? '250-500 kg / week' : '10-25 kg / month',
    });
    setCustomerPhoneVerified(true);
    setErrorMsg(null);
  };

  // Pre-fill Sample Farmer
  const fillSampleFarmer = () => {
    const randomId = Math.floor(Math.random() * 900 + 100);
    setFarmerData({
      name: 'Maya Lin',
      email: `maya@goldenridge.${randomId}.farm`,
      password: 'FarmPassword2026!',
      phone: '+91 98231 77412',
      farmName: 'Golden Ridge Biodynamic Farm',
      farmLocation: 'Dindori Valley, Nashik, MH',
      bio: 'Family-run certified organic orchard and heirloom vegetable acreage practicing no-till regenerative agriculture.',
      certifiedOrganic: true,
      certificationNumber: `NPOP-ORG-MH-${randomId}`,
      primaryCrops: ['Heirloom Tomatoes', 'Strawberries', 'Kale & Chard'],
      acreage: 34,
      payoutMethod: 'direct_ach',
      bankRoutingNumber: 'SBIN0001234',
      bankAccountNumber: '4488220019',
      fpoCode: `FPO-MH-2024-${randomId}`,
      fpoName: 'Sahyadri Farmers Producer Co. Ltd.',
      fpoCluster: 'Nashik Horticulture Cluster',
    });
    setFarmerPhoneVerified(true);
    setErrorMsg(null);
  };

  const handleCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerData.name.trim() || !customerData.email.trim() || !customerData.streetAddress.trim()) {
      setErrorMsg('Please fill in your name, email, and delivery street address.');
      return;
    }
    if (!customerData.phone?.trim()) {
      setErrorMsg('Please enter your mobile phone number.');
      return;
    }
    if (!customerPhoneVerified) {
      setErrorMsg('Please verify your mobile number with the SMS OTP code before completing registration.');
      return;
    }
    setErrorMsg(null);
    const res = await registerCustomer({
      ...customerData,
      phoneVerified: customerPhoneVerified,
    });
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    } else {
      setIsSuccess(true);
    }
  };

  const handleFarmerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !farmerData.name.trim() ||
      !farmerData.email.trim() ||
      !farmerData.farmName.trim() ||
      !farmerData.certificationNumber.trim()
    ) {
      setErrorMsg('Please fill in your name, email, farm name, and certification number.');
      return;
    }
    if (!farmerData.phone?.trim()) {
      setErrorMsg('Please enter your grower mobile phone number.');
      return;
    }
    if (!farmerPhoneVerified) {
      setErrorMsg('Please verify your mobile phone number with the SMS OTP code before submitting application.');
      return;
    }
    setErrorMsg(null);
    const res = await registerFarmer({
      ...farmerData,
      phoneVerified: farmerPhoneVerified,
    });
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    } else {
      setIsSuccess(true);
    }
  };

  const toggleCrop = (crop: string) => {
    setFarmerData((prev) => {
      const exists = prev.primaryCrops.includes(crop);
      return {
        ...prev,
        primaryCrops: exists
          ? prev.primaryCrops.filter((c) => c !== crop)
          : [...prev.primaryCrops, crop],
      };
    });
  };

  return (
    <div className="max-w-3xl w-full mx-auto bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-2xl animate-in fade-in duration-200">
      {/* Header Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold uppercase tracking-wider mb-1.5">
            <Sparkles className="w-3 h-3" />
            <span>New Account Registration</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Create Your FarmDirect Account
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Join the decentralized local food network with transparent 88% direct grower pricing.
          </p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-800">
          <button
            type="button"
            onClick={() => {
              setRole('consumer');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              role === 'consumer'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
            id="btn-tab-signup-customer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Sign Up</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('farmer');
              setErrorMsg(null);
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
              role === 'farmer'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
            id="btn-tab-signup-farmer"
          >
            <Tractor className="w-4 h-4" />
            <span>Farmer Sign Up</span>
          </button>
        </div>
      </div>

      {/* Error Notification */}
      {errorMsg && (
        <div className="my-4 p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 1. CUSTOMER SIGN UP FORM */}
      {role === 'consumer' && (
        <form onSubmit={handleCustomerSubmit} className="mt-6 space-y-6">
          {/* Quick Demo Pre-fill Banner */}
          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-900/80 text-emerald-300 flex items-center justify-center flex-shrink-0 border border-emerald-700/50">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-emerald-200">
                  Quick Customer Account Fill
                </div>
                <div className="text-[11px] text-neutral-400">
                  Populate realistic Normal Buyer (Household) or Bulk Buyer (Restaurant/Wholesale) profile.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 self-stretch sm:self-auto">
              <button
                type="button"
                onClick={() => fillSampleCustomer('individual')}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                id="btn-prefill-customer-normal"
              >
                Sample Normal Buyer
              </button>
              <button
                type="button"
                onClick={() => fillSampleCustomer('bulk')}
                className="flex-1 sm:flex-initial px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer text-center"
                id="btn-prefill-customer-bulk"
              >
                Sample Bulk Buyer
              </button>
            </div>
          </div>

          {/* Buyer Category Selection: Normal vs Bulk Buyer */}
          <div className="p-4 bg-neutral-950/80 border border-neutral-800 rounded-2xl space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300">
              Who are you? Select Buyer Type <span className="text-emerald-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCustomerData({ ...customerData, buyerType: 'individual' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  customerData.buyerType !== 'bulk'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-xs'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
                id="btn-select-buyer-normal"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-300">Normal Buyer</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                    Household / Family
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Daily farm-fresh fruits, vegetables &amp; greens delivered directly to your doorstep.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setCustomerData({ ...customerData, buyerType: 'bulk' })}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  customerData.buyerType === 'bulk'
                    ? 'bg-teal-950/60 border-teal-500 text-white shadow-xs'
                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                }`}
                id="btn-select-buyer-bulk"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-teal-300">Bulk Buyer</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-teal-900/60 text-teal-300 border border-teal-700/50">
                    Commercial / Wholesale
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400">
                  Restaurants, cafes, caterers, grocery stores &amp; hostels buying 50+ kg crate batches.
                </p>
              </button>
            </div>

            {/* If Bulk Buyer is selected, show commercial fields */}
            {customerData.buyerType === 'bulk' && (
              <div className="pt-3 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in duration-150">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Business / Restaurant Name <span className="text-teal-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerData.businessName || ''}
                    onChange={(e) => setCustomerData({ ...customerData, businessName: e.target.value })}
                    placeholder="e.g. Green Leaf Cafe"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500"
                    id="input-customer-businessname"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    GST / Trade License ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={customerData.gstNumber || ''}
                    onChange={(e) => setCustomerData({ ...customerData, gstNumber: e.target.value })}
                    placeholder="e.g. 27AAAAA0000A1Z5"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-teal-500"
                    id="input-customer-gst"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Expected Volume
                  </label>
                  <input
                    type="text"
                    value={customerData.orderVolume || ''}
                    onChange={(e) => setCustomerData({ ...customerData, orderVolume: e.target.value })}
                    placeholder="e.g. 100-300 kg / week"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-teal-500"
                    id="input-customer-ordervolume"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Personal Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>1. Buyer Profile &amp; Contact</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Full Name <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={customerData.name}
                    onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                    placeholder="e.g. Julian Davies"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    id="input-customer-name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Email Address <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    placeholder="name@domain.com"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    id="input-customer-email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Account Password <span className="text-emerald-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={customerData.password}
                    onChange={(e) => setCustomerData({ ...customerData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    id="input-customer-password"
                  />
                </div>
              </div>

              {/* Mobile Number & OTP Verification */}
              <div className="sm:col-span-2 pt-1 border-t border-neutral-800/80">
                <PhoneOtpVerification
                  phone={customerData.phone || ''}
                  onPhoneChange={(phone) => setCustomerData((prev) => ({ ...prev, phone }))}
                  isVerified={customerPhoneVerified}
                  onVerifiedChange={setCustomerPhoneVerified}
                  accentColor="emerald"
                  required={true}
                  idPrefix="customer"
                />
              </div>
            </div>
          </div>

          {/* Delivery Address & Cold-Chain Details */}
          <div className="pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>2. Delivery Address &amp; Drop-off Notes</span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Street Address <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerData.streetAddress}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, streetAddress: e.target.value })
                  }
                  placeholder="e.g. 742 Valencia St, Apt 4B"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  id="input-customer-address"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">City</label>
                  <input
                    type="text"
                    value={customerData.city}
                    onChange={(e) => setCustomerData({ ...customerData, city: e.target.value })}
                    placeholder="San Francisco"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    id="input-customer-city"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    value={customerData.zipCode}
                    onChange={(e) => setCustomerData({ ...customerData, zipCode: e.target.value })}
                    placeholder="94110"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                    id="input-customer-zip"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Drop-off / Cold-Box Handling Instructions
                </label>
                <input
                  type="text"
                  value={customerData.deliveryNotes}
                  onChange={(e) =>
                    setCustomerData({ ...customerData, deliveryNotes: e.target.value })
                  }
                  placeholder="e.g. Leave in porch insulated cooler, ring buzzer upon arrival"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
                  id="input-customer-notes"
                />
              </div>
            </div>
          </div>

          {/* Submit Button & Switch Link */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs text-neutral-400 hover:text-neutral-200 underline cursor-pointer"
            >
              Already have an account? Sign In here
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              id="btn-submit-customer-signup"
            >
              <span>Complete Customer Registration</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* 2. FARMER SIGN UP FORM */}
      {role === 'farmer' && (
        <form onSubmit={handleFarmerSubmit} className="mt-6 space-y-6">
          {/* Quick Demo Pre-fill Banner */}
          <div className="bg-amber-950/40 border border-amber-800/60 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-900/80 text-amber-300 flex items-center justify-center flex-shrink-0 border border-amber-700/50">
                <Tractor className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-200">
                  Quick Farmer Producer Fill
                </div>
                <div className="text-[11px] text-neutral-400">
                  Pre-fills a realistic organic orchard, license number, and direct ACH payout
                  details.
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={fillSampleFarmer}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer self-stretch sm:self-auto text-center"
              id="btn-prefill-farmer"
            >
              Pre-fill Sample Farmer
            </button>
          </div>

          {/* Producer Profile & Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <UserIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>1. Farmer / Producer Contact Info</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Grower Full Name <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={farmerData.name}
                  onChange={(e) => setFarmerData({ ...farmerData, name: e.target.value })}
                  placeholder="e.g. Maya Lin"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  id="input-farmer-name"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Farm Contact Email <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={farmerData.email}
                  onChange={(e) => setFarmerData({ ...farmerData, email: e.target.value })}
                  placeholder="contact@farmname.com"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  id="input-farmer-email"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Portal Password <span className="text-amber-400">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={farmerData.password}
                  onChange={(e) => setFarmerData({ ...farmerData, password: e.target.value })}
                  placeholder="••••••••••••"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  id="input-farmer-password"
                />
              </div>

              {/* Grower Mobile Number & OTP Verification */}
              <div className="sm:col-span-2 pt-1 border-t border-neutral-800/80">
                <PhoneOtpVerification
                  phone={farmerData.phone || ''}
                  onPhoneChange={(phone) => setFarmerData((prev) => ({ ...prev, phone }))}
                  isVerified={farmerPhoneVerified}
                  onVerifiedChange={setFarmerPhoneVerified}
                  accentColor="amber"
                  required={true}
                  idPrefix="farmer"
                />
              </div>
            </div>
          </div>

          {/* Farm Location & Production */}
          <div className="pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>2. Farm Profile &amp; Cultivation</span>
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Official Farm / Orchard Name <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerData.farmName}
                    onChange={(e) => setFarmerData({ ...farmerData, farmName: e.target.value })}
                    placeholder="e.g. Golden Ridge Biodynamic Farm"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    id="input-farmer-farmname"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Plot Location / County <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerData.farmLocation}
                    onChange={(e) => setFarmerData({ ...farmerData, farmLocation: e.target.value })}
                    placeholder="e.g. Graton, Sonoma County, CA"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    id="input-farmer-farmlocation"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Farm Story / Growing Philosophy
                </label>
                <textarea
                  rows={2}
                  value={farmerData.bio}
                  onChange={(e) => setFarmerData({ ...farmerData, bio: e.target.value })}
                  placeholder="Describe your soil stewardship, irrigation, and harvest practices..."
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  id="textarea-farmer-bio"
                />
              </div>

              {/* Primary Crop Tags */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Primary Crops Cultivated (Select all that apply)
                </label>
                <div className="flex flex-wrap gap-2">
                  {COMMON_CROPS.map((crop) => {
                    const isSelected = farmerData.primaryCrops.includes(crop);
                    return (
                      <button
                        key={crop}
                        type="button"
                        onClick={() => toggleCrop(crop)}
                        className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-amber-600 border-amber-500 text-white font-bold'
                            : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{crop}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FPO Affiliation & Registration */}
          <div className="pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>3. FPO Code &amp; Organization Affiliation</span>
            </h3>
            <div className="p-4 bg-amber-950/30 border border-amber-800/50 rounded-2xl space-y-3">
              <div className="text-xs text-neutral-300">
                <span className="font-bold text-amber-300">Farmer Producer Organization (FPO):</span>{' '}
                Enter your registered FPO code for collective collection van pickup and priority fair-trade MSP advances.
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    FPO Code <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={farmerData.fpoCode || ''}
                    onChange={(e) => setFarmerData({ ...farmerData, fpoCode: e.target.value })}
                    placeholder="e.g. FPO-MH-2024-8842"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-amber-500"
                    id="input-farmer-fpocode"
                  />
                  <p className="text-[10px] text-neutral-500 mt-1">NABARD / SFAC registered FPO ID</p>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    FPO Name
                  </label>
                  <input
                    type="text"
                    value={farmerData.fpoName || ''}
                    onChange={(e) => setFarmerData({ ...farmerData, fpoName: e.target.value })}
                    placeholder="e.g. Sahyadri Farmers Producer Co."
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    id="input-farmer-fponame"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Agro Cluster / District
                  </label>
                  <input
                    type="text"
                    value={farmerData.fpoCluster || ''}
                    onChange={(e) => setFarmerData({ ...farmerData, fpoCluster: e.target.value })}
                    placeholder="e.g. Nashik Valley Horticulture"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                    id="input-farmer-fpocluster"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Organic Accreditation & License */}
          <div className="pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>4. Organic Certification &amp; Producer Verification</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Organic Certification ID / License # <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={farmerData.certificationNumber}
                  onChange={(e) =>
                    setFarmerData({ ...farmerData, certificationNumber: e.target.value })
                  }
                  placeholder="e.g. NPOP-ORG-MH-88419"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 font-mono"
                  id="input-farmer-cert"
                />
                <p className="text-[10px] text-neutral-500 mt-1">
                  Audited by the FPO &amp; Governance team before active verified producer badge is issued.
                </p>
              </div>

              <div className="flex items-center">
                <label className="flex items-center gap-2 p-3 bg-neutral-950 border border-neutral-800 rounded-xl cursor-pointer w-full">
                  <input
                    type="checkbox"
                    checked={farmerData.certifiedOrganic}
                    onChange={(e) =>
                      setFarmerData({ ...farmerData, certifiedOrganic: e.target.checked })
                    }
                    className="w-4 h-4 text-amber-600 rounded bg-neutral-900 border-neutral-700"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">NPOP / PGS-India Certified Organic</div>
                    <div className="text-[10px] text-neutral-400">
                      Produce grown with zero synthetic pesticides or chemical fertilizers
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* 88% Direct Payout Setup in Rupees */}
          <div className="pt-4 border-t border-neutral-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-3 flex items-center gap-1.5">
              <span className="text-amber-400 font-bold text-sm">₹</span>
              <span>5. 88% Direct Escrow Payout Account (Rupees ₹)</span>
            </h3>
            <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 space-y-3">
              <div className="text-xs text-neutral-300">
                <span className="font-bold text-emerald-400">88% Direct Grower Economics in Rupees (₹):</span>{' '}
                When buyers purchase produce, 88% of rupees are held in automated escrow and paid
                directly to your registered bank account without middleman commission markups.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Bank IFSC Code
                  </label>
                  <input
                    type="text"
                    value={farmerData.bankRoutingNumber}
                    onChange={(e) =>
                      setFarmerData({ ...farmerData, bankRoutingNumber: e.target.value })
                    }
                    placeholder="SBIN0001234"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white font-mono"
                    id="input-farmer-routing"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-400 mb-1">
                    Bank Account Number (₹ Direct Deposit)
                  </label>
                  <input
                    type="text"
                    value={farmerData.bankAccountNumber}
                    onChange={(e) =>
                      setFarmerData({ ...farmerData, bankAccountNumber: e.target.value })
                    }
                    placeholder="••••••••••"
                    className="w-full px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs text-white font-mono"
                    id="input-farmer-account"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button & Switch Link */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-neutral-800">
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-xs text-neutral-400 hover:text-neutral-200 underline cursor-pointer"
            >
              Already have an account? Sign In here
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold shadow-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
              id="btn-submit-farmer-signup"
            >
              <span>Submit Farmer Application</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
