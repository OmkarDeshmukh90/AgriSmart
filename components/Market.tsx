
import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MarketPrice } from '../types';
import { translations } from '../translations';
import { storage } from '../utils/storage';

const INITIAL_MOCK_MARKET_DATA: MarketPrice[] = [
  {
    name: "Wheat",
    price: 2450.50,
    change: +2.4,
    unit: "Quintal",
    mandi: "Pune APMC",
    recommendation: 'SELL',
    reason: "Prices are at a 60-day high due to low regional supply. Market analysts expect a slight dip next week.",
    img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=200',
    history: [
      { date: 'Oct 01', value: 2350 }, { date: 'Oct 03', value: 2380 }, 
      { date: 'Oct 05', value: 2410 }, { date: 'Oct 07', value: 2400 },
      { date: 'Oct 09', value: 2380 }, { date: 'Oct 11', value: 2420 },
      { date: 'Oct 13', value: 2450 }, { date: 'Oct 15', value: 2460 },
    ],
    storageAdvice: {
      safeDuration: "3 Weeks",
      projectedGain: "+₹120/Q",
      condition: "Low moisture detected. Safe to store."
    },
    alternatives: [
      { mandi: "Sangli Mandi", price: 2600.00, distance: "45km" },
      { mandi: "Satara Market", price: 2480.00, distance: "20km" }
    ]
  },
  {
    name: "Soybean",
    price: 4820.20,
    change: -1.2,
    unit: "Quintal",
    mandi: "Akola Mandi",
    recommendation: 'WAIT',
    reason: "Current downward trend is temporary. Export demand is projected to rise by 15% in the next two weeks.",
    img: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=200',
    history: [
      { date: 'Oct 01', value: 4920 }, { date: 'Oct 03', value: 4900 },
      { date: 'Oct 05', value: 4880 }, { date: 'Oct 07', value: 4850 },
      { date: 'Oct 09', value: 4830 }, { date: 'Oct 11', value: 4840 },
      { date: 'Oct 13', value: 4820 }, { date: 'Oct 15', value: 4810 }
    ],
    storageAdvice: {
      safeDuration: "2 Months",
      projectedGain: "+₹450/Q",
      condition: "Global demand rising. Hold stock."
    },
    alternatives: [
      { mandi: "Nagpur APMC", price: 4850.00, distance: "120km" }
    ]
  },
  {
    name: "Corn",
    price: 1882.00,
    change: +0.5,
    unit: "Quintal",
    mandi: "Sangli Mandi",
    recommendation: 'SELL',
    reason: "Stable prices right now. While no major surge is expected, current rates cover a healthy margin above the MSP.",
    img: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=200',
    history: [
      { date: 'Oct 01', value: 1850 }, { date: 'Oct 03', value: 1860 },
      { date: 'Oct 05', value: 1870 }, { date: 'Oct 07', value: 1865 },
      { date: 'Oct 09', value: 1875 }, { date: 'Oct 11', value: 1880 },
      { date: 'Oct 13', value: 1882 }, { date: 'Oct 15', value: 1885 }
    ]
  }
];

interface MarketProps {
  onNotify: (notif: { type: any; title: string; message: string }) => void;
  lang?: string;
  activeCrop: string | null;
}

const Market: React.FC<MarketProps> = ({ onNotify, lang = 'en', activeCrop }) => {
  const [marketData, setMarketData] = useState<MarketPrice[]>(INITIAL_MOCK_MARKET_DATA);
  const [selectedCrop, setSelectedCrop] = useState<MarketPrice>(INITIAL_MOCK_MARKET_DATA[0]);
  const [activeView, setActiveView] = useState<'trends' | 'helper'>('trends');
  const [isConnecting, setIsConnecting] = useState(false);
  const t = translations[lang] || translations['en'];
  const isOnline = navigator.onLine;

  // Load / Save Market Data based on Connectivity
  useEffect(() => {
    const cachedData = storage.get<MarketPrice[]>('market_data');
    if (cachedData) {
        setMarketData(cachedData);
        // If we have an active crop, try to select it from cached data
        if (activeCrop) {
            const match = cachedData.find(c => activeCrop.toLowerCase().includes(c.name.toLowerCase()));
            if (match) setSelectedCrop(match);
        } else {
             setSelectedCrop(cachedData[0]);
        }
    } else {
        // Fallback to initial mock if no cache
        setMarketData(INITIAL_MOCK_MARKET_DATA);
    }

    // Simulate "Fetching" new data if online and saving to storage
    if (isOnline) {
        // In a real app, fetch here. For now, we save the mock data as "latest".
        storage.save('market_data', INITIAL_MOCK_MARKET_DATA);
    }
  }, [activeCrop, isOnline]);

  const handleConnect = () => {
    setIsConnecting(true);
    setTimeout(() => {
        setIsConnecting(false);
        onNotify({
            type: 'system',
            title: t.market.request_sent,
            message: t.market.request_msg
        });
    }, 1500);
  };

  // Logic to find Best Mandi
  const bestAlternative = selectedCrop.alternatives?.reduce((prev, current) => {
    return (current.price > prev.price) ? current : prev;
  }, { mandi: selectedCrop.mandi, price: selectedCrop.price, distance: '0km' });
  
  const hasBetterMandi = bestAlternative && bestAlternative.price > selectedCrop.price;
  const potentialExtraGain = bestAlternative ? Math.round(bestAlternative.price - selectedCrop.price) : 0;

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-500">
      <div className="text-center">
        <h2 className="text-2xl font-black text-neutral-900">{t.market.title}</h2>
        <p className="text-sm text-neutral-500 font-medium">{t.market.tracking} <span className="text-primary-600 font-bold">{selectedCrop.mandi}</span></p>
        {!isOnline && (
            <span className="inline-block mt-2 px-2 py-0.5 bg-neutral-200 text-neutral-500 text-[9px] font-bold uppercase tracking-widest rounded-md">Last Updated: Today</span>
        )}
      </div>

      {/* View Switcher */}
      <div className="flex bg-neutral-100 p-1.5 rounded-2xl mx-1 shadow-inner">
        <button 
          onClick={() => setActiveView('trends')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeView === 'trends' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
        >
          {t.market.tabs.trends}
        </button>
        <button 
          onClick={() => setActiveView('helper')}
          className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeView === 'helper' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
        >
          {t.market.tabs.advisor}
        </button>
      </div>

      {activeView === 'trends' ? (
        <div className="space-y-6 animate-in slide-in-from-left-4">
          
          {/* Best Mandi Opportunity Card (Dynamic) */}
          {hasBetterMandi && (
             <div className="bg-primary-900 rounded-[32px] p-6 text-white relative overflow-hidden shadow-xl animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/30 blur-3xl rounded-full"></div>
                <div className="relative z-10">
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-white/20 rounded-lg">
                           <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary-200">Price Alert</span>
                      </div>
                      <span className="bg-white text-primary-900 px-3 py-1 rounded-full text-xs font-black">+₹{potentialExtraGain}/Q</span>
                   </div>
                   <h3 className="text-lg font-bold leading-tight mb-1">Higher Rate Available</h3>
                   <p className="text-xs text-primary-100 font-medium mb-4">
                      {bestAlternative.mandi} ({bestAlternative.distance} away) is offering <span className="text-white font-bold">₹{bestAlternative.price}</span>.
                   </p>
                   <button className="w-full py-3 bg-white text-primary-900 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all">
                      View Route
                   </button>
                </div>
             </div>
          )}

          {/* Main Chart Card */}
          <div className="bg-white p-6 rounded-[32px] border border-neutral-100 shadow-xl shadow-neutral-200/40">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] mb-2">{selectedCrop.name} {t.market.price}</h3>
                <p className="text-4xl font-black text-neutral-900">₹{selectedCrop.price.toLocaleString()}</p>
                <p className="text-[10px] text-neutral-400 font-bold mt-1">per {selectedCrop.unit}</p>
              </div>
              <div className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-1 ${selectedCrop.change >= 0 ? 'bg-primary-50 text-primary-600' : 'bg-alert-50 text-alert-600'}`}>
                {selectedCrop.change >= 0 ? 
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" /></svg> : 
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1v-5a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" clipRule="evenodd" /></svg>
                }
                {Math.abs(selectedCrop.change)}%
              </div>
            </div>
            
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={selectedCrop.history}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedCrop.change >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0.4}/>
                      <stop offset="95%" stopColor={selectedCrop.change >= 0 ? "#10b981" : "#f43f5e"} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f8fafc" />
                  <XAxis dataKey="date" hide />
                  <YAxis hide domain={['auto', 'auto']} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    labelStyle={{ fontWeight: '900', fontSize: '12px' }}
                    itemStyle={{ color: selectedCrop.change >= 0 ? '#10b981' : '#f43f5e', fontWeight: 'bold' }}
                  />
                  <Area type="monotone" dataKey="value" stroke={selectedCrop.change >= 0 ? "#10b981" : "#f43f5e"} strokeWidth={4} fillOpacity={1} fill="url(#colorPrice)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="text-[10px] text-center text-neutral-400 font-bold uppercase tracking-widest mt-2">14-Day Price Trend</p>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-1">{t.market.commodities}</h3>
            {marketData.map((crop) => (
              <button 
                key={crop.name}
                onClick={() => setSelectedCrop(crop)}
                className={`w-full flex items-center justify-between p-4 rounded-[28px] border transition-all active:scale-[0.98] ${selectedCrop.name === crop.name ? 'border-primary-500 bg-primary-50 shadow-lg shadow-primary-500/10' : 'border-neutral-100 bg-white shadow-sm'}`}
              >
                <div className="flex items-center gap-4">
                  <img src={crop.img} className="w-14 h-14 rounded-2xl object-cover shadow-inner" alt={crop.name} />
                  <div className="text-left">
                    <h4 className="font-black text-neutral-900 text-lg leading-tight">{crop.name}</h4>
                    <p className="text-[10px] text-neutral-500 font-bold flex items-center gap-1 mt-1">
                      <svg className="w-3 h-3 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {crop.mandi}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-base font-black text-neutral-900">₹{crop.price.toLocaleString()}</p>
                  <div className={`text-[10px] font-black flex items-center justify-end gap-0.5 ${crop.change >= 0 ? 'text-primary-600' : 'text-alert-600'}`}>
                     {crop.change >= 0 ? 
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg> : 
                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                     }
                     {Math.abs(crop.change)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* SELL DECISION HELPER VIEW */
        <div className="space-y-6 animate-in slide-in-from-right-4">
          <div className="bg-white p-8 rounded-[32px] border border-neutral-100 shadow-xl text-center space-y-6">
            <div className="flex flex-col items-center">
              {/* Sell Now / Wait Indicator */}
              <div className={`w-32 h-32 rounded-full flex items-center justify-center mb-6 shadow-2xl animate-pulse ring-8 ring-opacity-20
                ${selectedCrop.recommendation === 'SELL' ? 'bg-primary-500 shadow-primary-200 ring-primary-500' : 'bg-warning-500 shadow-warning-200 ring-warning-500'}`}>
                <div className="text-white flex flex-col items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Advice</span>
                  <span className="font-black text-2xl tracking-tight leading-none mt-1">
                    {selectedCrop.recommendation === 'SELL' ? t.market.recommendation.sell : t.market.recommendation.wait}
                  </span>
                </div>
              </div>
              <h3 className="text-2xl font-black text-neutral-900 leading-tight">{t.market.advisor_title}</h3>
              <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mt-1">{t.market.advisor_subtitle}</p>
            </div>

            {/* Plain-language Reason */}
            <div className="p-6 bg-neutral-50 rounded-[24px] border border-neutral-100 text-left relative">
              <svg className="w-8 h-8 text-neutral-200 absolute top-4 left-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 13.1216 16 12.017 16H9.01699V21H14.017ZM16.017 21H19.017C20.1216 21 21.017 20.1046 21.017 19V17C21.017 15.8954 20.1216 15 19.017 15H16.017V21ZM5.01699 21H7.01699V16H5.01699V21ZM5.01699 23H19.017C21.2261 23 23.017 21.2091 23.017 19V17C23.017 14.7909 21.2261 13 19.017 13H14.9312C14.6599 10.6353 12.6596 8.80757 10.2312 8.80757C7.62535 8.80757 5.51239 10.9205 5.51239 13.5264C5.51239 13.6277 5.51543 13.7279 5.52137 13.8267C3.52967 14.3639 2.01699 16.0963 2.01699 18.2308V20C2.01699 21.6569 3.36014 23 5.01699 23ZM10.2312 10.8076C11.666 10.8076 12.8427 11.9189 12.9859 13.3276C12.9961 13.4284 13.0014 13.5303 13.0014 13.6328V14H10.2312C9.97059 14 9.75924 13.7887 9.75924 13.528C9.75924 13.2674 9.97059 13.056 10.2312 13.056V10.8076ZM8.03154 14H7.23154C7.23154 13.8396 7.24075 13.6811 7.25875 13.5249C7.43343 12.0089 8.7183 10.8076 10.2312 10.8076V13.056C10.2312 13.5772 9.8087 14 9.28754 14H8.03154Z" /></svg>
              <p className="text-sm text-neutral-700 font-bold leading-relaxed pl-10">
                {selectedCrop.reason}
              </p>
            </div>
            
            {/* Storage Advice */}
            {selectedCrop.storageAdvice && (
                <div className="bg-blue-50 border border-blue-100 rounded-3xl p-5 text-left flex items-start gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0 text-blue-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-1">Storage Recommendation</h4>
                        <p className="text-xs text-blue-900 font-bold mb-1">
                            Store for {selectedCrop.storageAdvice.safeDuration} to gain <span className="text-primary-600">{selectedCrop.storageAdvice.projectedGain}</span>.
                        </p>
                        <p className="text-[10px] text-blue-500 font-medium">{selectedCrop.storageAdvice.condition}</p>
                    </div>
                </div>
            )}

            {/* Highlighted Action Button */}
            <button 
              onClick={handleConnect}
              disabled={isConnecting}
              className={`w-full py-5 rounded-[28px] font-black text-lg transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
                ${isConnecting ? 'bg-neutral-800 text-neutral-400 cursor-wait' : 'bg-neutral-900 text-white shadow-neutral-200'}`}
            >
               {isConnecting ? t.market.connecting : t.market.connect_btn}
               {!isConnecting && (
                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                 </svg>
               )}
            </button>
          </div>
          
          <div className="bg-primary-50 border border-primary-100 rounded-[32px] p-6">
            <h4 className="text-[10px] font-black text-primary-800 uppercase tracking-widest mb-3">{t.market.sentiment_title}</h4>
            <div className="flex gap-2">
               {[1,2,3,4,5].map(i => (
                 <div key={i} className={`flex-1 h-2 rounded-full ${i <= 4 ? 'bg-primary-500' : 'bg-neutral-200'}`}></div>
               ))}
            </div>
            <p className="text-[10px] text-primary-600 font-bold mt-2 uppercase tracking-tighter">{t.market.sentiment_desc}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Market;
