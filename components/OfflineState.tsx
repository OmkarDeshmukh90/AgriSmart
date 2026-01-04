
import React from 'react';
import { translations } from '../translations';

interface OfflineStateProps {
  onRetry: () => void;
  lang?: string;
}

const OfflineState: React.FC<OfflineStateProps> = ({ onRetry, lang = 'en' }) => {
  const t = translations[lang] || translations['en'];

  return (
    <div className="fixed inset-0 z-[300] bg-neutral-50 flex flex-col items-center justify-center px-8 animate-in fade-in duration-500">
      <div className="w-full max-w-sm bg-white rounded-[40px] p-10 border border-neutral-100 shadow-2xl text-center space-y-8 relative overflow-hidden">
        {/* Subtle Decorative Background */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-neutral-50 blur-3xl rounded-full -mr-16 -mt-16"></div>
        
        <div className="relative">
          <div className="w-24 h-24 bg-neutral-100 rounded-[32px] flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse">
            <svg className="w-12 h-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">{t.offline.title}</h2>
          <p className="text-sm text-neutral-500 font-medium mt-2 leading-relaxed italic">
            "{t.offline.quote}"
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-5 bg-primary-50 rounded-3xl border border-primary-100">
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="h-2 w-2 bg-primary-500 rounded-full animate-pulse"></span>
              <p className="text-xs font-black text-primary-800 uppercase tracking-widest">{t.offline.active}</p>
            </div>
            <p className="text-xs text-primary-600 font-bold leading-relaxed">
              {t.offline.desc}
            </p>
          </div>

          <button 
            onClick={onRetry}
            className="w-full py-5 bg-neutral-900 text-white rounded-[28px] font-black text-lg shadow-xl hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {t.offline.retry}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        <p className="text-[10px] text-neutral-300 font-black uppercase tracking-[0.2em]">AgriSmart Sync Engine v2.4</p>
      </div>
    </div>
  );
};

export default OfflineState;
