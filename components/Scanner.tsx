
import React, { useState, useRef } from 'react';
import { analyzeCropHealth } from '../services/geminiService';
import { AnalysisResult } from '../types';
import { translations } from '../translations';

// In a real app, use Context. For this file structure, we'll assume App passes lang or we get it from local state management if we had one.
// Since App passes props to pages, let's assume Scanner gets `lang` as prop or we fallback to 'en'.
// But Scanner is rendered in App without props currently. 
// I will update it to accept props, but for now I will default to 'en' if not passed, 
// and in App.tsx I will update the render to pass it.

interface ScannerProps {
  lang?: string;
}

const Scanner: React.FC<ScannerProps> = ({ lang = 'en' }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[lang] || translations['en'];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImage(base64);
        handleAnalyze(base64.split(',')[1]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async (base64: string) => {
    setAnalyzing(true);
    setResult(null);
    try {
      const analysis = await analyzeCropHealth(base64);
      setResult(analysis);
    } catch (error) {
      alert(t.scanner.error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center">
        <h2 className="text-xl font-bold text-neutral-800">{t.scanner.title}</h2>
        <p className="text-sm text-neutral-500">{t.scanner.subtitle}</p>
      </div>

      {/* Upload/Preview Area */}
      <div 
        onClick={() => !analyzing && fileInputRef.current?.click()}
        className={`relative aspect-square rounded-[32px] overflow-hidden border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer active:bg-neutral-100
          ${image ? 'border-transparent shadow-xl' : 'border-neutral-200 bg-neutral-50'}`}
      >
        {image ? (
          <>
            <img src={image} alt="Target" className="w-full h-full object-cover" />
            {analyzing && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-white font-bold text-sm">{t.scanner.analyzing}</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center p-8 animate-in fade-in zoom-in-95 duration-500">
            <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="font-bold text-neutral-700 text-lg">{t.scanner.take_photo}</p>
            <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest">Field diagnosis mode</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          capture="environment" 
          className="hidden" 
        />
      </div>

      {/* Analysis Results */}
      {result && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <div className="p-6 rounded-3xl bg-white border border-neutral-100 shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-neutral-900 text-lg leading-tight">{t.scanner.diagnosis}</h3>
                <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Automated Scan</p>
              </div>
              <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-100 uppercase tracking-widest shadow-sm">
                {Math.round(result.confidence * 100)}% {t.scanner.confidence}
              </span>
            </div>
            
            <p className="text-sm text-neutral-700 font-medium bg-neutral-50/50 p-4 rounded-2xl border border-neutral-50 mb-6 leading-relaxed">
              {result.diagnosis}
            </p>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">{t.scanner.treatment}</h4>
                <div className="p-4 rounded-2xl bg-primary-50/30 border border-primary-100/50">
                  <p className="text-sm text-neutral-800 font-bold leading-relaxed">{result.treatment}</p>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-3">{t.scanner.steps}</h4>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-neutral-600">
                      <div className="w-5 h-5 rounded-full bg-primary-500 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm shadow-primary-200">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="font-medium">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { setImage(null); setResult(null); }}
            className="w-full py-5 bg-neutral-900 text-white rounded-[28px] font-black text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 mb-8"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t.scanner.scan_new}
          </button>
        </div>
      )}
    </div>
  );
};

export default Scanner;
