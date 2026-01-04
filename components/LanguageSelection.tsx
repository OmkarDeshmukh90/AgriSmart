
import React from 'react';

interface LanguageSelectionProps {
  onSelect: (lang: string) => void;
}

const LanguageSelection: React.FC<LanguageSelectionProps> = ({ onSelect }) => {
  const langs = [
    { name: 'हिंदी', sub: 'Hindi', code: 'hi' },
    { name: 'मराठी', sub: 'Marathi', code: 'mr' },
    { name: 'English', sub: 'English', code: 'en' }
  ];

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col px-8 py-12 animate-in fade-in duration-500">
      <div className="flex-1 flex flex-col justify-center space-y-8">
        <div className="space-y-3">
          <div className="w-16 h-16 bg-primary-600 rounded-3xl flex items-center justify-center shadow-xl shadow-primary-200 mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M10.472 12c.2-1.015.39-2.072.548-3.116m-2.02 0c.2-1.015.39-2.072.548-3.116M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M10.472 12c.2-1.015.39-2.072.548-3.116m-2.02 0c.2-1.015.39-2.072.548-3.116" />
            </svg>
          </div>
          <h2 className="text-4xl font-black text-neutral-900 leading-tight tracking-tight">Select your language</h2>
          <p className="text-neutral-500 font-medium">अपनी भाषा चुनें • आपली भाषा निवडा</p>
        </div>

        <div className="space-y-4">
          {langs.map((lang) => (
            <button
              key={lang.code}
              onClick={() => onSelect(lang.code)}
              className="w-full flex items-center justify-between p-6 bg-white border-2 border-neutral-100 rounded-[32px] hover:border-primary-500 hover:bg-primary-50 active:scale-[0.98] transition-all group shadow-sm"
            >
              <div className="text-left">
                <span className="block text-2xl font-black text-neutral-800 group-hover:text-primary-700">{lang.name}</span>
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">{lang.sub}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-neutral-50 group-hover:bg-primary-500 flex items-center justify-center transition-colors">
                <svg className="w-6 h-6 text-neutral-300 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <p className="text-center text-[10px] text-neutral-300 font-black uppercase tracking-widest mt-8">Powered by HarvestHub Global</p>
    </div>
  );
};

export default LanguageSelection;
