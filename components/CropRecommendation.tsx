
import React, { useState, useEffect } from 'react';
import { RecommendedCrop, FarmerProfile } from '../types';
import { translations } from '../translations';

// Rule-Based Database
const CROP_DB = [
  { 
    id: '1', name: 'Wheat', seasons: ['Rabi'], waterReq: 'Moderate', 
    baseCost: 12000, marketPrice: 2400, yieldMin: 18, yieldMax: 22, 
    riskBase: 'Low', icon: '🌾', pestSusceptibility: 'Medium', duration: '120 Days',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '2', name: 'Rice (Basmati)', seasons: ['Kharif'], waterReq: 'High', 
    baseCost: 18000, marketPrice: 2800, yieldMin: 20, yieldMax: 25, 
    riskBase: 'Medium', icon: '🍚', pestSusceptibility: 'High', duration: '150 Days',
    image: 'https://images.unsplash.com/photo-1536633310979-b854b866ed5f?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '3', name: 'Cotton', seasons: ['Kharif'], waterReq: 'Moderate', 
    baseCost: 22000, marketPrice: 6000, yieldMin: 8, yieldMax: 12, 
    riskBase: 'High', icon: '☁️', pestSusceptibility: 'High', duration: '180 Days',
    image: 'https://images.unsplash.com/photo-1594903330656-11f26771d906?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '4', name: 'Soybean', seasons: ['Kharif'], waterReq: 'Moderate', 
    baseCost: 14000, marketPrice: 4200, yieldMin: 10, yieldMax: 14, 
    riskBase: 'Low', icon: '🌱', pestSusceptibility: 'Medium', duration: '110 Days',
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '5', name: 'Mustard', seasons: ['Rabi'], waterReq: 'Low', 
    baseCost: 8000, marketPrice: 5000, yieldMin: 6, yieldMax: 9, 
    riskBase: 'Low', icon: '🌼', pestSusceptibility: 'Low', duration: '100 Days',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400' 
  },
  { 
    id: '6', name: 'Maize', seasons: ['Kharif', 'Rabi', 'Zaid'], waterReq: 'Moderate', 
    baseCost: 15000, marketPrice: 2200, yieldMin: 25, yieldMax: 35, 
    riskBase: 'Medium', icon: '🌽', pestSusceptibility: 'Medium', duration: '110 Days',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=400' 
  }
];

interface CropRecommendationProps {
  profile: FarmerProfile | null;
  onSelect: (crop: string) => void;
  onBack: () => void;
  lang?: string;
}

const CropRecommendation: React.FC<CropRecommendationProps> = ({ profile, onSelect, onBack, lang = 'en' }) => {
  const [view, setView] = useState<'list' | 'comparison' | 'confirmation'>('list');
  const [selectedCropId, setSelectedCropId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<RecommendedCrop[]>([]);
  const t = translations[lang] || translations['en'];

  // Engine Logic
  useEffect(() => {
    if (!profile) return;

    // 1. Determine Season (Mocking June for Demo to show mixed variety if current date is tricky, 
    //    but let's use real date logic adjusted for "Next Season Planning")
    const month = new Date().getMonth(); // 0-11
    // Simple Mapping: 
    // Jan-Apr (0-3) -> Zaid/Early Kharif -> Show Zaid + Kharif
    // May-Aug (4-7) -> Kharif -> Show Kharif + Early Rabi
    // Sep-Dec (8-11) -> Rabi -> Show Rabi
    
    // For MVP, to ensure we always show data, let's treat "Kharif" as default if it's summer, "Rabi" if winter.
    // However, to make the demo robust, I will select crops that match EITHER the current season OR the upcoming one.
    let currentSeasons = [];
    if (month >= 3 && month <= 6) currentSeasons = ['Zaid', 'Kharif']; // Apr-Jul
    else if (month >= 7 && month <= 10) currentSeasons = ['Kharif', 'Rabi']; // Aug-Nov
    else currentSeasons = ['Rabi', 'Zaid']; // Dec-Mar

    const calculatedCrops = CROP_DB.filter(crop => 
      crop.seasons.some(s => currentSeasons.includes(s)) || crop.seasons.includes('Kharif') // Fallback to ensure we have data
    ).map(crop => {
      // 2. Risk Calculation
      let riskLevel: 'Low' | 'Medium' | 'High' = crop.riskBase as any;
      
      // Water Risk
      if (profile.waterSource === 'Rain-fed' && crop.waterReq === 'High') {
        riskLevel = 'High';
      } else if (profile.waterSource === 'Canal' && crop.waterReq === 'High') {
        // Canal is reliable but maybe not as much as Borewell
        if (riskLevel === 'Low') riskLevel = 'Medium';
      }

      // 3. Yield Adjustment based on Soil N
      // Default N assumed 300 if missing
      const nVal = profile.soil?.n ? parseInt(profile.soil.n) : 300;
      let yieldFactor = 1.0;
      
      if (nVal < 250) yieldFactor = 0.9; // Low N reduces yield
      if (nVal > 450) yieldFactor = 1.1; // High N increases yield

      const expYieldMin = Math.round(crop.yieldMin * yieldFactor);
      const expYieldMax = Math.round(crop.yieldMax * yieldFactor);
      const avgYield = (expYieldMin + expYieldMax) / 2;

      // 4. Financials
      // Revenue = Yield (Quintals) * Market Price
      const revenue = avgYield * crop.marketPrice;
      const profit = Math.round(revenue - crop.baseCost);

      return {
        id: crop.id,
        name: crop.name,
        icon: crop.icon,
        image: crop.image,
        expectedProfit: `₹${profit.toLocaleString()}`,
        riskLevel,
        duration: crop.duration,
        cost: `₹${crop.baseCost.toLocaleString()}`,
        waterRequirement: crop.waterReq,
        pestSusceptibility: crop.pestSusceptibility,
        yield: `${expYieldMin}-${expYieldMax} Q/acre`,
        sellingPrice: `₹${crop.marketPrice}/Q`,
        // Store raw profit for sorting
        rawProfit: profit
      } as RecommendedCrop & { rawProfit: number };
    });

    // Sort by Profit Descending
    calculatedCrops.sort((a, b) => b.rawProfit - a.rawProfit);

    setRecommendations(calculatedCrops.slice(0, 5)); // Top 5
  }, [profile]);

  const selectedCrop = recommendations.find(c => c.id === selectedCropId);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-primary-600 bg-primary-50';
      case 'Medium': return 'text-warning-600 bg-warning-50';
      case 'High': return 'text-alert-600 bg-alert-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getPestColor = (level: string) => {
    switch (level) {
      case 'Low': return 'bg-primary-100 text-primary-800';
      case 'Medium': return 'bg-warning-100 text-warning-800';
      case 'High': return 'bg-alert-100 text-alert-800';
      default: return 'bg-neutral-100 text-neutral-800';
    }
  };

  const handleInitialSelect = (id: string) => {
    setSelectedCropId(id);
    setView('confirmation');
  };

  const handleConfirm = () => {
    if (selectedCrop) {
      onSelect(selectedCrop.name);
    }
  };

  if (!profile) return <div className="p-8 text-center text-neutral-500">Loading Profile...</div>;

  if (view === 'confirmation' && selectedCrop) {
    return (
      <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-8 duration-500">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView('list')}
            className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 active:scale-90 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-black text-neutral-900 leading-tight">{t.recommendation.confirmation.title}</h2>
            <p className="text-xs text-neutral-500 font-medium">{t.recommendation.confirmation.subtitle}</p>
          </div>
        </div>

        {/* Hero Crop Image & Overview */}
        <div className="relative rounded-[32px] overflow-hidden bg-neutral-900 shadow-2xl">
          <img 
            src={selectedCrop.image} 
            alt={selectedCrop.name} 
            className="w-full h-56 object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{selectedCrop.icon}</span>
              <h3 className="text-3xl font-black text-white">{selectedCrop.name}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-white/20">
                {selectedCrop.duration}
              </span>
              <span className="px-3 py-1 bg-primary-500/80 backdrop-blur-md rounded-lg text-xs font-bold text-white border border-primary-400/50">
                {selectedCrop.expectedProfit} <span className="opacity-80 font-medium">profit/acre</span>
              </span>
            </div>
          </div>
        </div>

        {/* Risk & Duration Warning */}
        <div className="space-y-4">
          <div className={`p-5 rounded-2xl border-l-4 shadow-sm ${selectedCrop.riskLevel === 'High' ? 'bg-alert-50 border-alert-500' : selectedCrop.riskLevel === 'Medium' ? 'bg-warning-50 border-warning-500' : 'bg-primary-50 border-primary-500'}`}>
            <h4 className={`text-xs font-black uppercase tracking-widest mb-2 ${selectedCrop.riskLevel === 'High' ? 'text-alert-700' : selectedCrop.riskLevel === 'Medium' ? 'text-warning-700' : 'text-primary-700'}`}>
              {t.recommendation.confirmation.risk_warning}
            </h4>
            <div className="flex items-start gap-3">
              <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${selectedCrop.riskLevel === 'High' ? 'text-alert-500' : selectedCrop.riskLevel === 'Medium' ? 'text-warning-500' : 'text-primary-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className={`text-sm font-medium leading-relaxed ${selectedCrop.riskLevel === 'High' ? 'text-alert-800' : selectedCrop.riskLevel === 'Medium' ? 'text-warning-800' : 'text-primary-800'}`}>
                {selectedCrop.riskLevel === 'High' 
                  ? `This crop has a High risk profile due to ${selectedCrop.pestSusceptibility.toLowerCase()} pest susceptibility. Strict monitoring required.` 
                  : selectedCrop.riskLevel === 'Medium'
                  ? "Moderate risk. Ensure timely irrigation and fertilization."
                  : "Low risk crop. Suitable for consistent yields with standard care."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t.recommendation.table.yield}</p>
                <p className="text-lg font-black text-neutral-800">{selectedCrop.yield}</p>
             </div>
             <div className="p-4 bg-white rounded-2xl border border-neutral-100 shadow-sm">
                <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t.recommendation.table.price}</p>
                <p className="text-lg font-black text-neutral-800">{selectedCrop.sellingPrice}</p>
             </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col gap-3 safe-bottom">
          <button 
            onClick={handleConfirm}
            className="w-full py-5 bg-neutral-900 text-white rounded-[28px] font-black text-lg shadow-xl shadow-neutral-300 hover:bg-neutral-800 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
          >
            {t.recommendation.confirmation.start_plan}
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
          <button 
            onClick={() => setView('list')}
            className="w-full py-4 bg-transparent text-neutral-400 font-bold text-sm active:text-neutral-600 transition-colors"
          >
            {t.recommendation.confirmation.cancel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="p-2 -ml-2 text-neutral-400 hover:text-neutral-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-xl font-bold text-neutral-800 flex-1 text-center pr-10">{t.recommendation.title}</h2>
      </div>

      <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 flex gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white flex-shrink-0">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <p className="text-xs text-primary-800 font-medium leading-relaxed">
          {t.recommendation.insight}
        </p>
      </div>

      <div className="flex bg-neutral-100 p-1 rounded-2xl">
        <button 
          onClick={() => setView('list')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${view === 'list' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
        >
          {t.recommendation.tabs.list}
        </button>
        <button 
          onClick={() => setView('comparison')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${view === 'comparison' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
        >
          {t.recommendation.tabs.compare}
        </button>
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          {recommendations.map((crop) => (
            <div key={crop.id} className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
              <div className="relative h-32 overflow-hidden">
                <img src={crop.image} alt={crop.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-3 left-4 flex items-center gap-2">
                  <span className="text-2xl">{crop.icon}</span>
                  <h3 className="text-lg font-bold text-white">{crop.name}</h3>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-0.5">{t.recommendation.profit}</p>
                    <p className="text-xl font-extrabold text-primary-600">{crop.expectedProfit}<span className="text-xs font-normal text-neutral-400"> / acre</span></p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getRiskColor(crop.riskLevel)}`}>
                    {crop.riskLevel} {t.recommendation.risk}
                  </div>
                </div>

                {/* Added Yield Info in List View */}
                <div className="flex items-center gap-2 bg-neutral-50 p-2 rounded-lg">
                   <span className="text-lg">⚖️</span>
                   <div>
                      <p className="text-[9px] font-black text-neutral-400 uppercase">Est. Yield</p>
                      <p className="text-xs font-bold text-neutral-800">{crop.yield}</p>
                   </div>
                </div>

                <div className="flex gap-3">
                  <button 
                    onClick={() => setView('comparison')}
                    className="flex-1 py-3 px-4 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-600 hover:bg-neutral-50 active:scale-95 transition-all"
                  >
                    {t.recommendation.compare_btn}
                  </button>
                  <button 
                    onClick={() => handleInitialSelect(crop.id)}
                    className="flex-1 py-3 px-4 bg-neutral-900 rounded-xl text-xs font-bold text-white shadow-lg active:scale-95 transition-all"
                  >
                    {t.recommendation.select_btn}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm animate-in zoom-in-95 duration-300">
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100">
                  <th className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest sticky left-0 bg-neutral-50 z-10">{t.recommendation.table.crop}</th>
                  <th className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">{t.recommendation.table.profit}</th>
                  <th className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">{t.recommendation.table.yield}</th>
                  <th className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">{t.recommendation.table.cost}</th>
                  <th className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-center">{t.recommendation.table.water}</th>
                  <th className="px-4 py-4 text-[10px] font-black text-neutral-400 uppercase tracking-widest text-right pr-6">{t.recommendation.table.price}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {recommendations.map((crop) => (
                  <tr key={crop.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-4 sticky left-0 bg-white z-10 border-r border-neutral-50/50">
                      <div className="flex items-center gap-3">
                        <img src={crop.image} className="w-8 h-8 rounded-lg object-cover shadow-sm" alt={crop.name} />
                        <div>
                          <span className="text-xs font-black text-neutral-800 block leading-tight">{crop.name}</span>
                          <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-tighter">{crop.duration}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-xs font-black text-primary-600">{crop.expectedProfit}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-[11px] font-bold text-neutral-700">{crop.yield}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className="text-[11px] font-bold text-neutral-500">{crop.cost}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <svg className={`w-3 h-3 mb-0.5 ${crop.waterRequirement === 'High' ? 'text-blue-600' : crop.waterRequirement === 'Moderate' ? 'text-blue-400' : 'text-blue-200'}`} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 21.5c-4.142 0-7.5-3.358-7.5-7.5 0-4.142 7.5-12 7.5-12s7.5 7.858 7.5 12c0 4.142-3.358 7.5-7.5 7.5z" />
                        </svg>
                        <span className="text-[9px] font-black text-blue-800 uppercase tracking-tighter">{crop.waterRequirement}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right pr-6">
                      <span className="text-[11px] font-bold text-neutral-700">{crop.sellingPrice}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-neutral-50">
            <button 
              onClick={() => setView('list')}
              className="w-full py-3 bg-white border border-neutral-200 rounded-xl text-xs font-black text-neutral-500 uppercase tracking-widest shadow-sm active:scale-95 transition-all"
            >
              {t.recommendation.back_btn}
            </button>
          </div>
        </div>
      )}

      {view !== 'confirmation' && (
        <div className="p-6 bg-neutral-900 rounded-[32px] text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="font-black text-sm uppercase tracking-widest">{t.recommendation.expert}</h4>
            </div>
            <p className="text-xs text-neutral-400 font-medium leading-relaxed">
              Recommendations are optimized for your <span className="text-white font-bold">{profile.soil?.n ? 'Soil Health Card data' : 'regional average soil data'}</span> and <span className="text-white font-bold">{profile.waterSource}</span> water source.
            </p>
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full"></div>
        </div>
      )}
    </div>
  );
};

export default CropRecommendation;
