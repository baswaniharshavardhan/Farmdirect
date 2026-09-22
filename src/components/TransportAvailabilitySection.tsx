import React, { useState } from 'react';
import {
  Truck,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Navigation,
  DollarSign,
  User,
  Check,
  ChevronRight,
  Package,
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { Transporter, TransportBookingRequest } from '../types';

interface TransportAvailabilitySectionProps {
  onBookingSuccess?: () => void;
  className?: string;
}

export const TransportAvailabilitySection: React.FC<TransportAvailabilitySectionProps> = ({
  onBookingSuccess,
  className = '',
}) => {
  const {
    transporters,
    transportBookings,
    bookTransport,
    registerTransporter,
    toggleTransporterAvailability,
    activeFarm,
    products,
  } = useMarketplace();

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedTransporter, setSelectedTransporter] = useState<Transporter | null>(null);
  const [isRegisterDriverOpen, setIsRegisterDriverOpen] = useState(false);

  // Booking Form State
  const [pickupLocation, setPickupLocation] = useState(
    activeFarm?.locationName || 'Farm Gate, Dindori, Nashik'
  );
  const [destinationPreset, setDestinationPreset] = useState<
    'apmc' | 'fpo_hub' | 'bulk_buyer' | 'custom'
  >('apmc');
  const [destinationAddress, setDestinationAddress] = useState(
    'Nashik APMC Mandi, Yard #4, Panchavati'
  );
  const [cargoDescription, setCargoDescription] = useState('Heirloom Tomatoes & Organic Apples');
  const [estimatedWeightKg, setEstimatedWeightKg] = useState(250);
  const [pickupTime, setPickupTime] = useState('Within 45 mins (Urgent)');
  const [notes, setNotes] = useState('Keep crates stacked upright; fragile organic harvest.');

  // Driver / Vehicle Owner Registration Form State
  const [newDriverName, setNewDriverName] = useState('');
  const [newDriverPhone, setNewDriverPhone] = useState('+91 98220 ');
  const [newVehicleType, setNewVehicleType] = useState('Tata Ace (Chota Hathi)');
  const [newVehicleNumber, setNewVehicleNumber] = useState('MH-15-EG-');
  const [newBaseLocation, setNewBaseLocation] = useState('Dindori / Nashik Agro-Belt');
  const [newCapacityKg, setNewCapacityKg] = useState(750);
  const [newPricePerKm, setNewPricePerKm] = useState(18);

  const farmProducts = products.filter((p) => p.farmId === activeFarm?.id);

  // Quick preset selector
  const handleDestinationPresetChange = (preset: 'apmc' | 'fpo_hub' | 'bulk_buyer' | 'custom') => {
    setDestinationPreset(preset);
    if (preset === 'apmc') {
      setDestinationAddress('Nashik APMC Mandi, Yard #4, Panchavati, Nashik');
    } else if (preset === 'fpo_hub') {
      setDestinationAddress('Sahyadri Regional Cold Storage & FPO Packhouse, Dindori');
    } else if (preset === 'bulk_buyer') {
      setDestinationAddress('Green Leaf Cafe & Wholesale Grocers, Commercial Lane 2');
    } else {
      setDestinationAddress('');
    }
  };

  const openBookingFor = (transporter: Transporter) => {
    setSelectedTransporter(transporter);
    setIsBookingModalOpen(true);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTransporter) return;

    const estimatedKm = destinationPreset === 'apmc' ? 14 : destinationPreset === 'fpo_hub' ? 8 : 22;
    const estFare = estimatedKm * selectedTransporter.pricePerKmRupees;

    bookTransport({
      transporterId: selectedTransporter.id,
      transporterName: selectedTransporter.name,
      vehicleType: selectedTransporter.vehicleType,
      vehicleNumber: selectedTransporter.vehicleNumber,
      transporterPhone: selectedTransporter.phone,
      farmerId: activeFarm?.id || 'farm-1',
      farmerName: activeFarm?.name || 'Local Producer',
      pickupLocation,
      dropoffDestination: destinationAddress,
      cargoDescription,
      estimatedWeightKg,
      pickupTime,
      estimatedFareRupees: estFare,
      notes,
    });

    setIsBookingModalOpen(false);
    setSelectedTransporter(null);
    if (onBookingSuccess) onBookingSuccess();
  };

  const handleRegisterDriverSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDriverName.trim() || !newVehicleNumber.trim()) return;

    registerTransporter({
      name: newDriverName.trim(),
      phone: newDriverPhone.trim(),
      vehicleType: newVehicleType,
      vehicleNumber: newVehicleNumber.trim(),
      baseLocation: newBaseLocation.trim(),
      distanceFromFarmKm: 1.2,
      capacityKg: newCapacityKg,
      pricePerKmRupees: newPricePerKm,
      availableNow: true,
    });

    setIsRegisterDriverOpen(false);
    setNewDriverName('');
    setNewVehicleNumber('MH-15-EG-');
  };

  return (
    <div className={`space-y-6 ${className}`} id="transport-availability-section">
      {/* Top Banner with High-Contrast Highlight */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-neutral-900 text-white p-5 rounded-2xl border-2 border-emerald-500 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-700/80 border border-emerald-400/50 flex items-center justify-center flex-shrink-0 text-emerald-200 shadow-xs">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800 text-emerald-300 text-[10px] font-bold uppercase tracking-wider mb-1 border border-emerald-600">
                <Navigation className="w-3 h-3" />
                <span>Nearby Rural Transport Network</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black tracking-tight">
                Nearby Transport Availability &amp; Vehicle Dispatch
              </h2>
              <p className="text-xs text-emerald-200/90 mt-0.5 max-w-2xl">
                Local vehicle owners (Tata Ace, Bolero Maxi, Pickups) logged into the platform to haul your harvested produce directly to Mandis, FPO Cold Hubs, or Bulk Buyers at fair per-km rates in Rupees (₹).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              type="button"
              onClick={() => setIsRegisterDriverOpen(true)}
              className="px-3.5 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              id="btn-register-vehicle-partner"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              <span>Register Your Vehicle / Driver</span>
            </button>
          </div>
        </div>
      </div>

      {/* Active Transport Bookings Alert (if any) */}
      {transportBookings.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Transport Dispatches ({transportBookings.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {transportBookings.map((b) => (
              <div
                key={b.id}
                className="bg-white border-2 border-emerald-300 rounded-xl p-4 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-bold text-xs text-neutral-900 flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      {b.vehicleType} · {b.vehicleNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      Confirmed Dispatch
                    </span>
                  </div>

                  <div className="text-xs text-neutral-700 font-semibold">{b.cargoDescription}</div>
                  <div className="text-[11px] text-neutral-500 mt-1">
                    Destination: <span className="font-medium text-neutral-800">{b.dropoffDestination}</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-0.5 flex items-center gap-2">
                    <span>Driver: <strong className="text-neutral-800">{b.transporterName}</strong></span>
                    <span>·</span>
                    <a
                      href={`tel:${b.transporterPhone}`}
                      className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" />
                      {b.transporterPhone}
                    </a>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-150 flex items-center justify-between text-xs">
                  <span className="text-neutral-500">Weight: <strong>{b.estimatedWeightKg} kg</strong></span>
                  <span className="text-emerald-800 font-bold">Fare: ₹{b.estimatedFareRupees.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Transporters Table with Highlighted Columns */}
      <div className="bg-white border-2 border-neutral-300 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 bg-neutral-50 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>Available Vehicles Near Your Farm</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-semibold">
                {transporters.filter((t) => t.availableNow).length} Online Now
              </span>
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Call or book with 1 click to haul today's harvest to any mandi or buyer warehouse.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-100 text-neutral-700 font-bold border-b-2 border-neutral-300 uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4 bg-emerald-50/80 border-r border-neutral-200 text-emerald-950">
                  1. Vehicle &amp; Driver
                </th>
                <th className="py-3.5 px-4 bg-amber-50/80 border-r border-neutral-200 text-amber-950">
                  2. Vehicle Type &amp; Reg No
                </th>
                <th className="py-3.5 px-4 bg-blue-50/80 border-r border-neutral-200 text-blue-950">
                  3. Distance from Farm
                </th>
                <th className="py-3.5 px-4 bg-purple-50/80 border-r border-neutral-200 text-purple-950">
                  4. Load Capacity
                </th>
                <th className="py-3.5 px-4 bg-emerald-50/80 border-r border-neutral-200 text-emerald-950">
                  5. Price per Km (Rupees ₹)
                </th>
                <th className="py-3.5 px-4 bg-neutral-100 border-r border-neutral-200 text-neutral-800">
                  6. Availability Status
                </th>
                <th className="py-3.5 px-4 bg-neutral-100 text-right text-neutral-900">
                  7. Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-neutral-200">
              {transporters.map((t) => {
                const isAvail = t.availableNow;
                return (
                  <tr
                    key={t.id}
                    className={`hover:bg-neutral-50 transition-colors ${
                      !isAvail ? 'opacity-60 bg-neutral-50/40' : ''
                    }`}
                  >
                    {/* Column 1: Driver */}
                    <td className="py-3.5 px-4 border-r border-neutral-200 font-medium">
                      <div className="flex items-center gap-3">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-9 h-9 rounded-full object-cover border-2 border-emerald-600 flex-shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="font-bold text-neutral-900 flex items-center gap-1.5">
                            <span>{t.name}</span>
                            {t.verifiedDriver && (
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" title="Verified Driver" />
                            )}
                          </div>
                          <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-neutral-400" />
                            <span>{t.phone}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Column 2: Vehicle & Plate */}
                    <td className="py-3.5 px-4 border-r border-neutral-200">
                      <div className="font-bold text-neutral-900">{t.vehicleType}</div>
                      <div className="text-[11px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded inline-block mt-0.5 border border-neutral-200">
                        {t.vehicleNumber}
                      </div>
                    </td>

                    {/* Column 3: Distance */}
                    <td className="py-3.5 px-4 border-r border-neutral-200">
                      <div className="flex items-center gap-1.5 font-bold text-neutral-800">
                        <MapPin className="w-3.5 h-3.5 text-blue-600" />
                        <span>{t.distanceFromFarmKm} km away</span>
                      </div>
                      <div className="text-[10px] text-neutral-400">{t.baseLocation}</div>
                    </td>

                    {/* Column 4: Capacity */}
                    <td className="py-3.5 px-4 border-r border-neutral-200">
                      <div className="font-bold text-neutral-900">{t.capacityKg} kg</div>
                      <div className="text-[10px] text-neutral-400">
                        Approx ~{(t.capacityKg / 20).toFixed(0)} vegetable crates
                      </div>
                    </td>

                    {/* Column 5: Price per km */}
                    <td className="py-3.5 px-4 border-r border-neutral-200">
                      <div className="text-sm font-black text-emerald-800">
                        ₹{t.pricePerKmRupees.toFixed(2)}
                        <span className="text-[11px] font-normal text-neutral-500"> / km</span>
                      </div>
                      <div className="text-[10px] text-emerald-700">Fair Rural Fare</div>
                    </td>

                    {/* Column 6: Status Toggle */}
                    <td className="py-3.5 px-4 border-r border-neutral-200">
                      <button
                        type="button"
                        onClick={() => toggleTransporterAvailability(t.id)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border cursor-pointer transition-all flex items-center gap-1.5 ${
                          isAvail
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                            : 'bg-neutral-200 text-neutral-600 border-neutral-300 hover:bg-neutral-300'
                        }`}
                        title="Click to toggle status (used by drivers)"
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isAvail ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-400'
                          }`}
                        />
                        <span>{isAvail ? 'Available Now' : 'On Trip / Busy'}</span>
                      </button>
                    </td>

                    {/* Column 7: Action */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`tel:${t.phone}`}
                          className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg border border-neutral-200 transition-colors"
                          title="Call Driver"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          disabled={!isAvail}
                          onClick={() => openBookingFor(t)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                            isAvail
                              ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                              : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                          }`}
                          id={`btn-book-transporter-${t.id}`}
                        >
                          <span>Book Vehicle</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Book Transport for Delivery */}
      {isBookingModalOpen && selectedTransporter && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Book Transport for Farm Delivery
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Vehicle: {selectedTransporter.vehicleType} ({selectedTransporter.vehicleNumber})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4 mt-4 text-xs">
              {/* Destination Preset Selector */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1.5">
                  Where do you want to send your goods? <span className="text-emerald-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDestinationPresetChange('apmc')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      destinationPreset === 'apmc'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <div>Local APMC Mandi</div>
                    <div className="text-[10px] text-neutral-400 font-normal">Panchavati Market Yard (~14 km)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDestinationPresetChange('fpo_hub')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      destinationPreset === 'fpo_hub'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <div>FPO Cold Hub</div>
                    <div className="text-[10px] text-neutral-400 font-normal">Sahyadri Packhouse (~8 km)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDestinationPresetChange('bulk_buyer')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      destinationPreset === 'bulk_buyer'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <div>Bulk Buyer Store</div>
                    <div className="text-[10px] text-neutral-400 font-normal">Green Leaf Grocers (~22 km)</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDestinationPresetChange('custom')}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                      destinationPreset === 'custom'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold shadow-2xs'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-neutral-300'
                    }`}
                  >
                    <div>Custom Location</div>
                    <div className="text-[10px] text-neutral-400 font-normal">Enter custom street address</div>
                  </button>
                </div>
              </div>

              {/* Exact Destination Input */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Delivery Destination Address
                </label>
                <input
                  type="text"
                  required
                  value={destinationAddress}
                  onChange={(e) => setDestinationAddress(e.target.value)}
                  placeholder="e.g. Shop 12, Market Yard, Nashik"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  id="input-transport-destination"
                />
              </div>

              {/* Cargo Description & Weight */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Produce / Cargo Description
                  </label>
                  <input
                    type="text"
                    required
                    value={cargoDescription}
                    onChange={(e) => setCargoDescription(e.target.value)}
                    placeholder="e.g. 15 crates of Heirloom Tomatoes"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Approx Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedTransporter.capacityKg}
                    value={estimatedWeightKg}
                    onChange={(e) => setEstimatedWeightKg(parseInt(e.target.value, 10) || 100)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-neutral-400">Max: {selectedTransporter.capacityKg} kg</span>
                </div>
              </div>

              {/* Pickup Timing */}
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Pickup Timing
                </label>
                <select
                  value={pickupTime}
                  onChange={(e) => setPickupTime(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  <option value="Within 45 mins (Urgent)">Within 45 mins (Urgent pickup at farm)</option>
                  <option value="Today at 11:00 AM">Today at 11:00 AM</option>
                  <option value="Today at 4:00 PM (Evening Mandi Run)">Today at 4:00 PM (Evening Mandi Run)</option>
                  <option value="Tomorrow Dawn at 6:00 AM">Tomorrow Dawn at 6:00 AM</option>
                </select>
              </div>

              {/* Fare Calculation Preview in Rupees */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-emerald-800 font-medium">Estimated Transport Fare:</div>
                  <div className="text-[10px] text-emerald-600">
                    Rate: ₹{selectedTransporter.pricePerKmRupees}/km · Direct payout to driver
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-black text-emerald-900">
                    ₹{(
                      (destinationPreset === 'apmc' ? 14 : destinationPreset === 'fpo_hub' ? 8 : 22) *
                      selectedTransporter.pricePerKmRupees
                    ).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-emerald-700 font-semibold">Includes loading help</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  id="btn-confirm-transport-dispatch"
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Transport Dispatch</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Register New Transport Vehicle / Driver */}
      {isRegisterDriverOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">
                    Register Transport Vehicle Partner
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Log in your vehicle so nearby farmers can book delivery trips
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsRegisterDriverOpen(false)}
                className="text-neutral-400 hover:text-neutral-600 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterDriverSubmit} className="space-y-3.5 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-700 mb-1">
                  Driver / Owner Full Name <span className="text-emerald-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newDriverName}
                  onChange={(e) => setNewDriverName(e.target.value)}
                  placeholder="e.g. Dnyaneshwar Patil"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  id="input-driver-name"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Mobile Phone <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newDriverPhone}
                    onChange={(e) => setNewDriverPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Base Location
                  </label>
                  <input
                    type="text"
                    value={newBaseLocation}
                    onChange={(e) => setNewBaseLocation(e.target.value)}
                    placeholder="e.g. Dindori, Nashik"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Vehicle Type
                  </label>
                  <select
                    value={newVehicleType}
                    onChange={(e) => setNewVehicleType(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option value="Tata Ace (Chota Hathi)">Tata Ace (Chota Hathi)</option>
                    <option value="Mahindra Bolero Maxi Truck">Mahindra Bolero Maxi Truck</option>
                    <option value="Piaggio Ape 3-Wheeler Loader">Piaggio Ape 3-Wheeler Loader</option>
                    <option value="Electric Cargo E-Rickshaw">Electric Cargo E-Rickshaw</option>
                    <option value="Refrigerated Van">Refrigerated Van</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Vehicle Plate # <span className="text-emerald-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newVehicleNumber}
                    onChange={(e) => setNewVehicleNumber(e.target.value)}
                    placeholder="MH-15-EG-8821"
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Payload Capacity (kg)
                  </label>
                  <input
                    type="number"
                    min="100"
                    value={newCapacityKg}
                    onChange={(e) => setNewCapacityKg(parseInt(e.target.value, 10) || 750)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-neutral-700 mb-1">
                    Rate per Km (Rupees ₹)
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={newPricePerKm}
                    onChange={(e) => setNewPricePerKm(parseFloat(e.target.value) || 18)}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRegisterDriverOpen(false)}
                  className="px-4 py-2 text-neutral-600 hover:bg-neutral-100 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold transition-all shadow-xs cursor-pointer"
                  id="btn-submit-register-driver"
                >
                  Register Vehicle Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
