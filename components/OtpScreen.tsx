
import React, { useState, useEffect } from 'react';
import { translations } from '../translations';

interface OtpScreenProps {
  phone: string;
  onVerify: () => void;
  onBack: () => void;
  lang?: string;
}

const OtpScreen: React.FC<OtpScreenProps> = ({ phone, onVerify, onBack, lang = 'en' }) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [timer, setTimer] = useState(30);
  const t = translations[lang] || translations['en'];

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[value.length - 1];
    const newOtp = [...otp];
    newOtp[index] = value.replace(/\D/g, '');
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const isComplete = otp.every((v) => v !== '');

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col px-8 py-12 animate-in slide-in-from-right-8 duration-500">
      <button onClick={onBack} className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mb-8">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex-1 space-y-12">
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-neutral-900 leading-tight tracking-tight">{t.otp.title}</h2>
          <p className="text-neutral-500 font-medium leading-relaxed">{t.otp.subtitle} <span className="text-neutral-900 font-black">+91 {phone}</span></p>
        </div>

        <div className="flex justify-between gap-4">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="tel"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="w-full aspect-square bg-neutral-50 border-4 border-neutral-100 rounded-[28px] text-4xl font-black text-center text-neutral-900 focus:bg-white focus:border-primary-500 outline-none transition-all"
              autoFocus={idx === 0}
            />
          ))}
        </div>

        <div className="text-center">
          {timer > 0 ? (
            <p className="text-sm text-neutral-400 font-bold">{t.otp.resend_in} <span className="text-neutral-900">{timer}s</span></p>
          ) : (
            <button className="text-sm text-primary-600 font-black uppercase tracking-widest border-b-2 border-primary-100 pb-1">{t.otp.resend}</button>
          )}
        </div>
      </div>

      <div className="safe-bottom">
        <button
          onClick={() => isComplete && onVerify()}
          disabled={!isComplete}
          className={`w-full py-5 rounded-[28px] font-black text-lg transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
            ${isComplete ? 'bg-neutral-900 text-white shadow-neutral-200' : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'}`}
        >
          {t.otp.btn}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default OtpScreen;
