
import React, { useState, useEffect } from 'react';
import { NavTab, WeatherData, ForecastDay } from '../types';
import { translations } from '../translations';

interface DashboardProps {
  activeCrop: string | null;
  onSelectCrop: (crop: string) => void;
  onNavigate: (tab: NavTab) => void;
  lang: string;
  userLocation?: { lat: number; lng: number; village?: string };
}

const Dashboard: React.FC<DashboardProps> = ({ activeCrop, onSelectCrop, onNavigate, lang, userLocation }) => {
  const [taskDone, setTaskDone] = useState(false);
  const [showWeatherDetail, setShowWeatherDetail] = useState(false);
  
  // Initial state set to Trigger "Rainfall Alert" logic for demo purposes
  const [weather, setWeather] = useState<WeatherData>({
    temp: 26,
    condition: 'Heavy Rain',
    humidity: 92,
    wind: 18,
    location: userLocation?.village || 'Hinjewadi, Pune'
  });
  const t = translations[lang] || translations['en'];

  // Effect to fetch weather based on location (Mock update)
  useEffect(() => {
    if (userLocation?.village) {
        setWeather(prev => ({ ...prev, location: userLocation.village! }));
    } else if (userLocation?.lat) {
        setWeather(prev => ({ ...prev, location: `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}` }));
    }
  }, [userLocation]);

  // ACTION TRANSLATION ENGINE
  const getWeatherInsight = (w: WeatherData) => {
    const condition = w.condition.toLowerCase();
    
    // Scenario 1: Rain -> Delay Irrigation
    if (condition.includes('rain') || condition.includes('storm') || condition.includes('drizzle')) {
        return {
            title: t.dashboard.weather_alert, // "Weather Alert"
            subtitle: t.dashboard.high_impact, // "High Impact"
            message: 'Heavy rainfall expected in next 24h. Soil moisture will exceed capacity.',
            action: 'Delay Irrigation',
            reason: 'prevent root rot',
            icon: '🌧️',
            theme: 'alert'
        };
    }
    
    // Scenario 2: High Humidity -> Pest Risk
    if (w.humidity > 85) {
        return {
            title: 'Fungal Risk Alert',
            subtitle: 'Disease Warning',
            message: 'Humidity >85% creates ideal conditions for fungal spores.',
            action: 'Scout for Blight',
            reason: 'catch infection early',
            icon: '🍄',
            theme: 'warning'
        };
    }

    // Scenario 3: Heat Stress
    if (w.temp > 35) {
        return {
            title: 'Heat Stress Warning',
            subtitle: 'Crop Stress',
            message: 'Extreme heat expected. Evapotranspiration rates are critical.',
            action: 'Mulch Soil',
            reason: 'conserve moisture',
            icon: '☀️',
            theme: 'alert'
        };
    }

    // Scenario 4: Cold Stress
    if (w.temp < 10) {
        return {
            title: 'Frost Alert',
            subtitle: 'Cold Stress',
            message: 'Temperatures dropping below optimal range for vegetative growth.',
            action: 'Irrigate Lightly',
            reason: 'insulate roots',
            icon: '❄️',
            theme: 'blue' // Using blue for cold
        };
    }

    // Default
    return {
        title: 'Optimal Conditions',
        subtitle: 'Good Growth',
        message: 'Weather conditions are favorable for crop development.',
        action: 'Standard Care',
        reason: 'maintain growth',
        icon: '🌱',
        theme: 'primary'
    };
  };

  const insight = getWeatherInsight(weather);

  const getThemeStyles = (theme: string) => {
      switch(theme) {
          case 'alert': return { 
              bg: 'bg-alert-50', border: 'border-alert-100', 
              textTitle: 'text-alert-900', textSub: 'text-alert-500', textBody: 'text-alert-700',
              iconBg: 'bg-alert-500', btn: 'bg-alert-600'
          };
          case 'warning': return { 
              bg: 'bg-warning-50', border: 'border-warning-100', 
              textTitle: 'text-warning-900', textSub: 'text-warning-600', textBody: 'text-warning-800',
              iconBg: 'bg-warning-500', btn: 'bg-warning-600'
          };
          case 'blue': return { 
              bg: 'bg-blue-50', border: 'border-blue-100', 
              textTitle: 'text-blue-900', textSub: 'text-blue-500', textBody: 'text-blue-700',
              iconBg: 'bg-blue-500', btn: 'bg-blue-600'
          };
          default: return { 
              bg: 'bg-primary-50', border: 'border-primary-100', 
              textTitle: 'text-primary-900', textSub: 'text-primary-500', textBody: 'text-primary-700',
              iconBg: 'bg-primary-500', btn: 'bg-primary-600'
          };
      }
  };

  const styles = getThemeStyles(insight.theme);

  const getCropImage = (name: string | null) => {
    if (name?.toLowerCase().includes('wheat')) return 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400';
    if (name?.toLowerCase().includes('rice')) return 'https://images.unsplash.com/photo-1536633310979-b854b866ed5f?auto=format&fit=crop&q=80&w=400';
    return 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=400';
  };

  const generateForecast = (): ForecastDay[] => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const forecast: ForecastDay[] = [];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const isRainy = i < 3; // Simulate rain for first 3 days to match "Heavy Rain" context
        forecast.push({
            date: d.getDate().toString(),
            dayName: i === 0 ? t.weather.today : days[d.getDay()],
            icon: isRainy ? '🌧️' : i % 3 === 0 ? '☁️' : '☀️',
            tempMax: 29 + (i % 3),
            tempMin: 22 - (i % 2),
            condition: isRainy ? 'Rain' : 'Cloudy'
        });
    }
    return forecast;
  };

  const forecast = generateForecast();

  if (showWeatherDetail) {
    return (
        <div className="space-y-6 py-4 animate-in slide-in-from-right-8 duration-500 pb-20">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button 
                    onClick={() => setShowWeatherDetail(false)}
                    className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 active:scale-90 transition-all"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-xl font-black text-neutral-900 leading-tight">{t.weather.title}</h2>
            </div>

            {/* Dynamic Advisory Card */}
            <div className={`${styles.bg} border ${styles.border} rounded-[32px] p-6 shadow-sm relative overflow-hidden`}>
                <div className={`absolute top-0 right-0 w-24 h-24 ${styles.textTitle} opacity-10 bg-current rounded-full -mr-8 -mt-8`}></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`w-8 h-8 ${styles.iconBg} rounded-full flex items-center justify-center text-white shadow-md animate-pulse`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        </div>
                        <h3 className={`text-sm font-black ${styles.textTitle} uppercase tracking-widest`}>{insight.title}</h3>
                    </div>
                    <p className={`text-sm font-bold ${styles.textBody} mb-6 leading-relaxed`}>
                        {insight.message}
                    </p>
                    <button className="w-full bg-neutral-900 text-white py-5 rounded-[28px] font-black text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        {t.weather.action_required}: {insight.action}
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                </div>
            </div>

            {/* Current Details */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 text-center shadow-sm">
                    <div className="text-2xl mb-1">💧</div>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wide">{t.weather.humidity}</p>
                    <p className="text-lg font-black text-neutral-800">{weather.humidity}%</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 text-center shadow-sm">
                    <div className="text-2xl mb-1">💨</div>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wide">{t.weather.wind_speed}</p>
                    <p className="text-lg font-black text-neutral-800">{weather.wind} km/h</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-neutral-100 text-center shadow-sm">
                    <div className="text-2xl mb-1">🌧️</div>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-wide">{t.weather.precip}</p>
                    <p className="text-lg font-black text-neutral-800">80%</p>
                </div>
            </div>

            {/* 7-Day Forecast */}
            <div className="space-y-4">
                <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-2">{t.weather.forecast_7_days}</h3>
                <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden">
                    {forecast.map((day, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors">
                            <div className="w-20">
                                <p className={`text-sm font-black ${idx === 0 ? 'text-primary-600' : 'text-neutral-700'}`}>{day.dayName}</p>
                            </div>
                            <div className="flex items-center gap-3 flex-1 justify-center">
                                <span className="text-2xl">{day.icon}</span>
                                <span className="text-xs font-bold text-neutral-400 w-16 text-center">{day.condition}</span>
                            </div>
                            <div className="flex gap-3 w-24 justify-end">
                                <span className="text-sm font-black text-neutral-900">{day.tempMax}°</span>
                                <span className="text-sm font-bold text-neutral-400">{day.tempMin}°</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
  }

  // View A: No Crop Selected OR Main Dashboard View
  if (!activeCrop) {
    return (
      <div className="space-y-8 py-4 animate-in fade-in duration-700">
        {/* Clickable Weather Summary Card */}
        <div 
            onClick={() => setShowWeatherDetail(true)}
            className="flex items-center justify-between bg-white p-6 rounded-[32px] border border-neutral-100 shadow-sm relative overflow-hidden active:scale-[0.98] transition-all cursor-pointer group"
        >
           <div className="absolute inset-0 bg-gradient-to-r from-orange-50/50 via-transparent to-blue-50/20 pointer-events-none group-hover:opacity-80 transition-opacity"></div>
           
          <div className="flex items-center gap-5 relative z-10">
            <div className={`w-16 h-16 ${styles.bg} backdrop-blur-sm rounded-[24px] flex items-center justify-center text-4xl shadow-sm border border-white/50`}>
                {weather.condition.toLowerCase().includes('rain') ? '🌧️' : 
                 weather.condition.toLowerCase().includes('cloud') ? '☁️' : '☀️'}
            </div>
            <div>
              <p className="text-4xl font-black text-neutral-900 tracking-tight">{weather.temp}°<span className="text-xl text-neutral-400 font-bold">C</span></p>
              <p className="text-[10px] text-neutral-500 font-black uppercase tracking-widest mt-1">{weather.condition}</p>
            </div>
          </div>
          <div className="text-right relative z-10 flex flex-col items-end">
            <div className="flex items-center gap-1.5 text-neutral-400 mb-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <p className="text-[9px] font-black uppercase tracking-widest">Region</p>
            </div>
            <p className="text-sm font-black text-neutral-800 max-w-[140px] truncate leading-tight">
                {weather.location}
            </p>
            <div className={`mt-2 text-[9px] font-black ${styles.textTitle} ${styles.bg} px-2 py-1 rounded-lg`}>Tap for details</div>
          </div>
        </div>

        <div className="relative group">
          <div className="bg-neutral-900 rounded-[40px] p-8 text-white shadow-2xl shadow-neutral-900/30 overflow-hidden relative min-h-[360px] flex flex-col justify-end">
            <img 
              src="https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800" 
              className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay scale-110 group-hover:scale-100 transition-transform duration-1000" 
              alt="Farm"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-900/40 to-transparent"></div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-3">
                <h2 className="text-4xl font-black leading-[1.05] tracking-tight">{t.dashboard.ready}</h2>
                <p className="text-neutral-300 text-sm font-medium leading-relaxed max-w-[260px]">{t.dashboard.ready_desc}</p>
              </div>
              <button 
                onClick={() => onNavigate(NavTab.RECOMMENDATION)}
                className="w-full bg-neutral-900 text-white py-5 rounded-[28px] font-black text-lg shadow-xl active:scale-[0.98] transition-all flex items-center justify-center gap-3 border border-white/10 group/btn"
              >
                {t.dashboard.choose_crop}
                <svg className="w-6 h-6 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Actionable Weather Alert in Main View */}
        <div 
            onClick={() => setShowWeatherDetail(true)}
            className={`${styles.bg} border ${styles.border} rounded-[32px] p-6 flex gap-4 cursor-pointer active:scale-95 transition-all`}
        >
            <div className={`w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl shadow-sm`}>{insight.icon}</div>
            <div className="flex-1 space-y-1">
            <div className="flex justify-between items-center">
                <h4 className={`font-black ${styles.textTitle} uppercase text-[10px] tracking-widest`}>{insight.title}</h4>
                <span className={`text-[9px] font-black ${styles.textSub} uppercase`}>{insight.subtitle}</span>
            </div>
            <p className={`text-xs ${styles.textBody} leading-relaxed font-bold`}>
                {insight.message.split('.')[0]}. <span className="underline decoration-2">{insight.action}</span> to {insight.reason}.
            </p>
            </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">{t.dashboard.trending}</h3>
            <button onClick={() => onNavigate(NavTab.MARKET)} className="text-[10px] font-bold text-primary-600 uppercase tracking-widest flex items-center gap-1 group">
                {t.dashboard.view_all} 
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Wheat', price: '₹2,450', change: '+2.4%', img: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=100' },
              { name: 'Soybean', price: '₹4,820', change: '-1.2%', img: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=100' }
            ].map(item => (
              <div key={item.name} className="bg-white p-4 rounded-[28px] border border-neutral-100 shadow-sm flex items-center gap-3 hover:shadow-md transition-all active:scale-[0.98]">
                <img src={item.img} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt={item.name} />
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-neutral-400 uppercase truncate mb-0.5">{item.name}</p>
                  <p className="text-lg font-black text-neutral-900 leading-none">{item.price}</p>
                  <span className={`text-[9px] font-bold ${item.change.startsWith('+') ? 'text-primary-600' : 'text-alert-600'}`}>{item.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Active Crop View
  return (
    <div className="space-y-6 py-4 animate-in slide-in-from-bottom-6 duration-700">
      <div className="relative bg-neutral-900 rounded-[32px] p-6 overflow-hidden shadow-xl">
        <img 
          src={getCropImage(activeCrop)} 
          className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
          alt={activeCrop || 'Crop'}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 via-neutral-900/60 to-transparent"></div>
        
        <div className="relative z-10 space-y-5">
          <div className="flex justify-between items-start">
            <div className="flex gap-4">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                🌾
              </div>
              <div>
                <h2 className="text-2xl font-black text-white">{activeCrop} Season</h2>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex h-1.5 w-1.5 rounded-full bg-primary-400 animate-pulse"></span>
                  <p className="text-[10px] text-neutral-300 font-bold uppercase tracking-widest">Vegetative Growth</p>
                </div>
              </div>
            </div>
            <div className="bg-primary-500/20 backdrop-blur-sm px-3 py-1 rounded-full text-[9px] font-black text-primary-400 border border-primary-500/30 uppercase tracking-[0.15em]">Healthy</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-neutral-300 uppercase tracking-widest">
              <span>Day 45 of 120</span>
              <span>38% Progress</span>
            </div>
            <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden">
              <div className="bg-primary-400 h-full w-[38%] rounded-full shadow-[0_0_15px_rgba(52,211,153,0.5)] transition-all duration-1000"></div>
            </div>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-[32px] border-2 transition-all duration-500 ${taskDone ? 'bg-neutral-50 border-neutral-100 opacity-60' : 'bg-white border-primary-500/10 shadow-xl shadow-neutral-200/40'}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-inner">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t.dashboard.priority_task}</p>
              <h3 className="text-lg font-black text-neutral-900">{activeCrop ? `${activeCrop} Irrigation` : 'Urea Application'}</h3>
            </div>
          </div>
          {!taskDone && <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-3 py-1 rounded-lg uppercase tracking-wider">{t.dashboard.urgent}</span>}
        </div>
        <p className="text-sm text-neutral-500 mb-6 font-medium leading-relaxed italic">Apply {activeCrop?.includes('Wheat') ? '25kg/acre' : 'standard dose'} today between <span className="font-black text-neutral-800">18:00 - 20:00</span> for optimal absorption.</p>
        <button 
          onClick={() => setTaskDone(!taskDone)}
          className={`w-full py-5 rounded-[28px] font-black text-lg transition-all active:scale-[0.98]
            ${taskDone ? 'bg-neutral-200 text-neutral-400' : 'bg-neutral-900 text-white shadow-xl'}`}
        >
          {taskDone ? t.dashboard.task_completed : t.dashboard.mark_done}
        </button>
      </div>

      <div 
        onClick={() => setShowWeatherDetail(true)}
        className={`${styles.bg} border ${styles.border} rounded-[32px] p-6 flex gap-4 cursor-pointer active:scale-95 transition-all`}
      >
        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 text-3xl shadow-sm">{insight.icon}</div>
        <div className="flex-1 space-y-1">
          <div className="flex justify-between items-center">
            <h4 className={`font-black ${styles.textTitle} uppercase text-[10px] tracking-widest`}>{insight.title}</h4>
            <span className={`text-[9px] font-black ${styles.textSub} uppercase`}>{insight.subtitle}</span>
          </div>
          <p className={`text-xs ${styles.textBody} leading-relaxed font-bold`}>
            {insight.message} <span className="underline decoration-2">{insight.action}</span> to {insight.reason}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
