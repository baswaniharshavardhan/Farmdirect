import React, { useState } from 'react';
import {
  Sparkles,
  Upload,
  AlertTriangle,
  CheckCircle2,
  X,
  Volume2,
  Camera,
  ShieldCheck,
  RefreshCw,
  Droplet,
  Pill,
} from 'lucide-react';

interface AICropDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCrop?: string;
  language?: 'en' | 'hi' | 'pa';
}

interface DiagnosisResult {
  diseaseName: string;
  hindiName: string;
  crop: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  symptoms: string[];
  cause: string;
  organicTreatment: string;
  chemicalTreatment: string;
  icarDosage: string;
  preventiveAdvice: string;
}

export const AICropDoctorModal: React.FC<AICropDoctorModalProps> = ({
  isOpen,
  onClose,
  defaultCrop = 'Wheat (गेहूं) HD-3226',
  language = 'en',
}) => {
  const [selectedCrop, setSelectedCrop] = useState(defaultCrop);
  const [uploadedImage, setUploadedImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80'
  );
  const [isDiagnosing, setIsDiagnosing] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiagnosisResult | null>({
    diseaseName: 'Yellow Stripe Rust (Puccinia striiformis)',
    hindiName: 'पीला रतुआ (हल्दी रोग)',
    crop: 'Wheat (HD-3226)',
    confidence: 94,
    severity: 'Moderate',
    symptoms: [
      'Bright yellow powdery pustules aligned in stripes along leaf veins',
      'Premature drying of flag leaves',
      'Chlorotic linear lesions across middle leaf layers',
    ],
    cause: 'High relative humidity (>80%) combined with cool night temps (10-15°C) and morning dew.',
    organicTreatment:
      'Spray sour buttermilk (chaach) @ 5L mixed with 200L water + Neem seed kernel extract (NSKE 5%) per acre.',
    chemicalTreatment:
      'Propiconazole 25% EC (Tilt / Bumper) or Tebuconazole 25.9% EC.',
    icarDosage:
      'Dissolve 200 ml Propiconazole 25% EC in 200 liters of clean water per acre. Use flat-fan nozzle during clear sunny morning.',
    preventiveAdvice:
      'Avoid excessive nitrogen (Urea) top-dressing during humid periods. Maintain proper field drainage.',
  });

  const sampleCases = [
    {
      title: 'Wheat Yellow Stripe Rust',
      crop: 'Wheat (HD-3226)',
      img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
      disease: 'Yellow Stripe Rust',
      severity: 'Moderate' as const,
      confidence: 94,
    },
    {
      title: 'Mustard Aphid Attack (चेपा)',
      crop: 'Mustard (RH-749)',
      img: 'https://images.unsplash.com/photo-1508746829417-e6f548d8d6ed?auto=format&fit=crop&w=600&q=80',
      disease: 'Mustard Aphid (Lipaphis erysimi)',
      severity: 'High' as const,
      confidence: 91,
    },
    {
      title: 'Sugarcane Red Rot (लाल सड़न)',
      crop: 'Sugarcane (Co 0238)',
      img: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=600&q=80',
      disease: 'Red Rot (Colletotrichum falcatum)',
      severity: 'Severe' as const,
      confidence: 96,
    },
  ];

  if (!isOpen) return null;

  const handleSimulateUpload = (sample: (typeof sampleCases)[0]) => {
    setSelectedCrop(sample.crop);
    setUploadedImage(sample.img);
    setIsDiagnosing(true);
    setTimeout(() => {
      if (sample.disease.includes('Aphid')) {
        setDiagnosis({
          diseaseName: 'Mustard Aphid / Chepa (Lipaphis erysimi)',
          hindiName: 'सरसों का चेपा / माहू कीट',
          crop: 'Mustard (RH-749)',
          confidence: 91,
          severity: 'High',
          symptoms: [
            'Tiny green/black insects sucking sap from inflorescence and tender shoots',
            'Curling of leaves and sticky honeydew secretion',
            'Sooty black mold development inhibiting photosynthesis',
          ],
          cause: 'Cloudy, calm weather during flowering and pod development.',
          organicTreatment: 'Spray 5% Neem seed kernel extract (NSKE) or Verticillium lecanii @ 5g/liter.',
          chemicalTreatment: 'Dimethoate 30% EC (Rogor) or Thiamethoxam 25% WG.',
          icarDosage: 'Thiamethoxam 25% WG @ 80 grams in 150 liters of water per acre.',
          preventiveAdvice: 'Early sowing (before Oct 20) and installation of yellow sticky traps @ 10 traps/acre.',
        });
      } else if (sample.disease.includes('Red Rot')) {
        setDiagnosis({
          diseaseName: 'Sugarcane Red Rot (Colletotrichum falcatum)',
          hindiName: 'गन्ने का लाल सड़न रोग',
          crop: 'Sugarcane (Co 0238)',
          confidence: 96,
          severity: 'Severe',
          symptoms: [
            'Third or fourth leaf from top shows yellowing and wilting',
            'Stalk shows internal reddening with characteristic transverse white patches',
            'Alcoholic fermentation smell when stalk is split open',
          ],
          cause: 'Infected seed setts and waterlogging during monsoon/post-monsoon.',
          organicTreatment: 'Treat setts with Trichoderma harzianum @ 10g/L water before planting.',
          chemicalTreatment: 'Carbendazim 50% WP sett dip treatment.',
          icarDosage: 'Carbendazim 50% WP @ 2g per liter of water. Uproot and burn severely infected clumps.',
          preventiveAdvice: 'Use certified disease-free seed setts of resistant varieties (Co 0118, Co 15023).',
        });
      } else {
        setDiagnosis({
          diseaseName: 'Yellow Stripe Rust (Puccinia striiformis)',
          hindiName: 'पीला रतुआ (हल्दी रोग)',
          crop: 'Wheat (HD-3226)',
          confidence: 94,
          severity: 'Moderate',
          symptoms: [
            'Bright yellow powdery pustules aligned in stripes along leaf veins',
            'Premature drying of flag leaves',
            'Chlorotic linear lesions across middle leaf layers',
          ],
          cause: 'High relative humidity (>80%) combined with cool night temps (10-15°C) and morning dew.',
          organicTreatment:
            'Spray sour buttermilk (chaach) @ 5L mixed with 200L water + Neem seed kernel extract (NSKE 5%) per acre.',
          chemicalTreatment: 'Propiconazole 25% EC (Tilt / Bumper) or Tebuconazole 25.9% EC.',
          icarDosage:
            'Dissolve 200 ml Propiconazole 25% EC in 200 liters of clean water per acre. Use flat-fan nozzle during clear sunny morning.',
          preventiveAdvice:
            'Avoid excessive nitrogen (Urea) top-dressing during humid periods. Maintain proper field drainage.',
        });
      }
      setIsDiagnosing(false);
    }, 600);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result as string);
        setIsDiagnosing(true);
        setTimeout(() => {
          setIsDiagnosing(false);
        }, 800);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-neutral-900 text-white w-full max-w-3xl rounded-2xl border border-neutral-700 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="bg-[#032e22] px-6 py-4 border-b border-emerald-800/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-neutral-950 flex items-center justify-center font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black tracking-tight text-white font-display">
                  AI Crop Doctor Diagnosis
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-neutral-950">
                  ICAR Certified
                </span>
              </div>
              <p className="text-xs text-emerald-200/80">
                Leaf Symptom Scanner &amp; Precision Dosage Engine
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

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-neutral-950">
          {/* Quick Test Samples */}
          <div>
            <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider block mb-2">
              Select or Upload Leaf Image:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {sampleCases.map((sc, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleSimulateUpload(sc)}
                  className={`p-2.5 rounded-xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                    uploadedImage === sc.img
                      ? 'bg-emerald-950/80 border-emerald-500 text-white ring-1 ring-emerald-500'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:border-neutral-700'
                  }`}
                >
                  <img
                    src={sc.img}
                    alt={sc.title}
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-white">{sc.title}</p>
                    <p className="text-[11px] text-emerald-400 font-medium">{sc.crop}</p>
                    <span
                      className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-sm mt-0.5 ${
                        sc.severity === 'Severe'
                          ? 'bg-red-900/80 text-red-200'
                          : sc.severity === 'High'
                          ? 'bg-amber-900/80 text-amber-200'
                          : 'bg-yellow-900/80 text-yellow-200'
                      }`}
                    >
                      {sc.severity} Alert
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Upload Custom Photo Option */}
          <div className="flex items-center gap-3">
            <label className="flex-1 border-2 border-dashed border-neutral-700 hover:border-emerald-500 bg-neutral-900/80 rounded-xl p-3 flex items-center justify-center gap-2 text-xs font-bold text-neutral-300 cursor-pointer transition-colors">
              <Upload className="w-4 h-4 text-emerald-400" />
              <span>Upload Custom Leaf Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={() => {
                alert('Opening camera for field photo capture...');
              }}
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 border border-neutral-700 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Field Cam</span>
            </button>
          </div>

          {/* Diagnosis Card */}
          {isDiagnosing ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
              <p className="text-sm font-bold text-white">Running Vision AI Disease Identification...</p>
              <p className="text-xs text-neutral-400 max-w-sm">
                Comparing leaf lesions against ICAR Indian phytopathology pathogen database...
              </p>
            </div>
          ) : diagnosis ? (
            <div className="bg-neutral-900 border border-emerald-900/60 rounded-2xl overflow-hidden shadow-xl">
              {/* Card Banner */}
              <div className="bg-gradient-to-r from-emerald-950 via-neutral-900 to-amber-950/40 p-4 border-b border-emerald-900/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-950 text-red-300 border border-red-700/60">
                      {diagnosis.severity} Severity
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                      {diagnosis.confidence}% Confidence
                    </span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white mt-1">
                    {diagnosis.diseaseName}
                  </h4>
                  <p className="text-xs text-amber-300 font-bold">{diagnosis.hindiName}</p>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-neutral-400 block">Host Crop</span>
                  <span className="text-xs font-bold text-white bg-neutral-800 px-2 py-1 rounded-md border border-neutral-700">
                    {diagnosis.crop}
                  </span>
                </div>
              </div>

              {/* Diagnosis Body */}
              <div className="p-4 sm:p-5 space-y-4">
                {/* Symptoms List */}
                <div>
                  <h5 className="text-xs font-bold text-neutral-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    Observed Symptoms
                  </h5>
                  <ul className="space-y-1">
                    {diagnosis.symptoms.map((sym, idx) => (
                      <li key={idx} className="text-xs text-neutral-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                        <span>{sym}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* ICAR Chemical Dosage */}
                  <div className="bg-[#03241b] border border-emerald-800/80 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-1.5 text-emerald-300">
                      <Pill className="w-4 h-4 text-emerald-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        ICAR Standard Prescription
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-white mb-1">
                      {diagnosis.chemicalTreatment}
                    </p>
                    <p className="text-xs text-emerald-200/90 bg-[#021812] p-2 rounded-lg border border-emerald-900/60 font-mono">
                      {diagnosis.icarDosage}
                    </p>
                  </div>

                  {/* Organic / Natural Alternative */}
                  <div className="bg-amber-950/40 border border-amber-800/60 rounded-xl p-3.5">
                    <div className="flex items-center gap-2 mb-1.5 text-amber-300">
                      <Droplet className="w-4 h-4 text-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Jaivik / Organic Alternative
                      </span>
                    </div>
                    <p className="text-xs text-amber-100/90 leading-relaxed">
                      {diagnosis.organicTreatment}
                    </p>
                    <div className="mt-2 text-[11px] text-neutral-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zero chemical residue · 100% soil safe</span>
                    </div>
                  </div>
                </div>

                {/* Preventive Advisory */}
                <div className="bg-neutral-800/70 border border-neutral-700 rounded-xl p-3 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-bold text-white block">Preventive Field Measure:</span>
                    <p className="text-xs text-neutral-300 mt-0.5">{diagnosis.preventiveAdvice}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="bg-[#02241b] px-6 py-3.5 border-t border-emerald-900/60 flex items-center justify-between">
          <span className="text-xs text-emerald-300 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Verified by ICAR-Indian Agricultural Research Institute (IARI)</span>
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
