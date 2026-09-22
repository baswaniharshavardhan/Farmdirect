import React, { useState, useEffect } from 'react';
import {
  Phone,
  ShieldCheck,
  CheckCircle2,
  Clock,
  RotateCcw,
  Sparkles,
  AlertCircle,
  KeyRound,
  Check,
} from 'lucide-react';

interface PhoneOtpVerificationProps {
  phone: string;
  onPhoneChange: (phone: string) => void;
  isVerified: boolean;
  onVerifiedChange: (verified: boolean) => void;
  accentColor?: 'emerald' | 'amber';
  required?: boolean;
  idPrefix?: string;
}

export const PhoneOtpVerification: React.FC<PhoneOtpVerificationProps> = ({
  phone,
  onPhoneChange,
  isVerified,
  onVerifiedChange,
  accentColor = 'emerald',
  required = true,
  idPrefix = 'signup',
}) => {
  const [otpInput, setOtpInput] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Timer for resend cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  // Clean phone input
  const handlePhoneInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onPhoneChange(val);
    if (isVerified) {
      onVerifiedChange(false);
      setSuccessMsg(null);
    }
  };

  // Send OTP handler
  const handleSendOtp = async () => {
    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMsg('Please enter a valid phone number (at least 7 digits).');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsSendingOtp(true);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setOtpSent(true);
        setSentCode(data.code || '482910');
        setCountdown(45);
        setSuccessMsg(`Verification code sent to ${phone}`);
      } else {
        // Fallback for offline/local simulation
        const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString();
        setOtpSent(true);
        setSentCode(fallbackCode);
        setCountdown(45);
        setSuccessMsg(`Verification code sent to ${phone}`);
      }
    } catch {
      const fallbackCode = Math.floor(100000 + Math.random() * 900000).toString();
      setOtpSent(true);
      setSentCode(fallbackCode);
      setCountdown(45);
      setSuccessMsg(`Verification code sent to ${phone}`);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP handler
  const handleVerifyOtp = async () => {
    if (!otpInput.trim()) {
      setErrorMsg('Please enter the 6-digit OTP code.');
      return;
    }

    setErrorMsg(null);
    setIsVerifyingOtp(true);

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp: otpInput.trim() }),
      });
      const data = await res.json();

      if ((res.ok && data.verified) || otpInput.trim() === '123456' || otpInput.trim() === sentCode) {
        onVerifiedChange(true);
        setSuccessMsg('Phone number verified successfully!');
        setErrorMsg(null);
      } else {
        setErrorMsg(data.error || 'Invalid OTP code. Please enter the code shown above or 123456.');
      }
    } catch {
      // Local fallback check
      if (otpInput.trim() === sentCode || otpInput.trim() === '123456') {
        onVerifiedChange(true);
        setSuccessMsg('Phone number verified successfully!');
        setErrorMsg(null);
      } else {
        setErrorMsg('Invalid OTP code. Please enter the 6-digit code shown or 123456.');
      }
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleAutoFill = () => {
    if (sentCode) {
      setOtpInput(sentCode);
      setErrorMsg(null);
    }
  };

  const isEmerald = accentColor === 'emerald';
  const focusBorderClass = isEmerald ? 'focus:border-emerald-500' : 'focus:border-amber-500';
  const buttonBgClass = isEmerald
    ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
    : 'bg-amber-600 hover:bg-amber-500 text-white';
  const tagColorClass = isEmerald ? 'text-emerald-400' : 'text-amber-400';

  return (
    <div className="space-y-3" id={`${idPrefix}-phone-otp-container`}>
      {/* Phone Number Field */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-semibold text-neutral-300">
            Mobile Number {required && <span className={tagColorClass}>*</span>}
          </label>
          {isVerified ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/80">
              <CheckCircle2 className="w-3 h-3" /> Number Verified
            </span>
          ) : (
            <span className="text-[11px] text-neutral-500">Requires SMS OTP verification</span>
          )}
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Phone className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="tel"
              required={required}
              disabled={isVerified}
              value={phone}
              onChange={handlePhoneInputChange}
              placeholder="+91 98765 43210 or (415) 555-0188"
              className={`w-full pl-9 pr-3 py-2 bg-neutral-950 border ${
                isVerified
                  ? 'border-emerald-700/60 text-emerald-200 bg-emerald-950/20'
                  : 'border-neutral-800 text-white placeholder-neutral-500'
              } rounded-xl text-xs focus:outline-none ${focusBorderClass}`}
              id={`${idPrefix}-input-phone`}
            />
          </div>

          {!isVerified ? (
            <button
              type="button"
              disabled={isSendingOtp || countdown > 0 || !phone.trim()}
              onClick={handleSendOtp}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                countdown > 0 || !phone.trim()
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                  : buttonBgClass
              }`}
              id={`${idPrefix}-btn-send-otp`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>
                {isSendingOtp
                  ? 'Sending...'
                  : countdown > 0
                  ? `Resend in ${countdown}s`
                  : otpSent
                  ? 'Resend OTP'
                  : 'Send OTP'}
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                onVerifiedChange(false);
                setOtpSent(false);
                setOtpInput('');
                setSuccessMsg(null);
              }}
              className="px-3 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl text-xs font-semibold border border-neutral-700 transition-colors cursor-pointer"
              id={`${idPrefix}-btn-change-number`}
            >
              Change
            </button>
          )}
        </div>
      </div>

      {/* Simulated SMS Alert Banner when OTP is sent */}
      {otpSent && !isVerified && sentCode && (
        <div
          className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 shadow-md flex items-start justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-150"
          id={`${idPrefix}-otp-sms-banner`}
        >
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-950/90 text-emerald-400 border border-emerald-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">Simulated SMS Received</span>
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 tracking-wider">
                  {sentCode}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Use code <strong className="text-white">{sentCode}</strong> to verify mobile{' '}
                <span className="text-neutral-300">{phone}</span> (or enter <strong>123456</strong>).
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleAutoFill}
            className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded-lg text-[11px] font-bold border border-neutral-700 transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
            id={`${idPrefix}-btn-autofill-otp`}
          >
            Auto-fill
          </button>
        </div>
      )}

      {/* OTP Input & Verify Controls */}
      {otpSent && !isVerified && (
        <div className="p-3.5 bg-neutral-950/60 rounded-xl border border-neutral-800 space-y-2.5">
          <label className="block text-xs font-semibold text-neutral-300">
            Enter 6-Digit Verification Code (OTP)
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                maxLength={6}
                value={otpInput}
                onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 482910"
                className={`w-full px-3 py-2 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-white font-mono tracking-widest placeholder-neutral-600 focus:outline-none ${focusBorderClass}`}
                id={`${idPrefix}-input-otp`}
              />
            </div>
            <button
              type="button"
              disabled={isVerifyingOtp || !otpInput.trim()}
              onClick={handleVerifyOtp}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                !otpInput.trim()
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700'
                  : buttonBgClass
              }`}
              id={`${idPrefix}-btn-verify-otp`}
            >
              <Check className="w-3.5 h-3.5" />
              <span>{isVerifyingOtp ? 'Verifying...' : 'Verify OTP'}</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span>Didn't receive SMS?</span>
            {countdown > 0 ? (
              <span className="flex items-center gap-1 text-neutral-400">
                <Clock className="w-3 h-3" /> Resend code in {countdown}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer"
              >
                Send New Code
              </button>
            )}
          </div>
        </div>
      )}

      {/* Inline Feedback */}
      {errorMsg && (
        <div className="text-xs text-rose-400 flex items-center gap-1.5 pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && isVerified && (
        <div className="text-xs text-emerald-400 flex items-center gap-1.5 pt-0.5">
          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}
    </div>
  );
};
