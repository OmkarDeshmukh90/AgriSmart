
import React, { useState } from 'react';
import { translations } from '../translations';

interface LoginScreenProps {
  onContinue: (phone: string) => void;
  onBack: () => void;
  lang?: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onContinue, onBack, lang = 'en' }) => {
  const [phone, setPhone] = useState('');
  const t = translations[lang] || translations['en'];

  const isValid = phone.length === 10;

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col px-8 py-12 animate-in slide-in-from-right-8 duration-500">
      <button onClick={onBack} className="w-12 h-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400 mb-8">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="flex-1 space-y-8">
        <div className="space-y-3">
          <h2 className="text-4xl font-black text-neutral-900 leading-tight tracking-tight">{t.login.title}</h2>
          <p className="text-neutral-500 font-medium leading-relaxed">{t.login.subtitle}</p>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-6 border-r border-neutral-200">
            <span className="text-lg font-black text-neutral-400">+91</span>
          </div>
          <input
            type="tel"
            maxLength={10}
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder={t.login.placeholder}
            className="w-full pl-20 pr-6 py-6 bg-neutral-50 border-2 border-neutral-100 rounded-[28px] text-2xl font-black tracking-widest text-neutral-800 focus:bg-white focus:border-primary-500 outline-none transition-all placeholder:text-neutral-200"
            autoFocus
          />
        </div>
      </div>

      <div className="space-y-6 safe-bottom">
        <p className="text-[10px] text-neutral-400 font-bold text-center leading-relaxed">
          {t.login.terms}
        </p>
        <button
          onClick={() => isValid && onContinue(phone)}
          disabled={!isValid}
          className={`w-full py-5 rounded-[28px] font-black text-lg transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
            ${isValid ? 'bg-neutral-900 text-white shadow-neutral-200' : 'bg-neutral-100 text-neutral-300 cursor-not-allowed'}`}
        >
          {t.login.btn}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default LoginScreen;
