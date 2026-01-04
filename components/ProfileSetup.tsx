
import React, { useState, useRef } from 'react';
import { FarmerProfile } from '../types';
import { translations } from '../translations';

interface ProfileSetupProps {
  onComplete: (profile: FarmerProfile) => void;
  lang?: string;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, lang = 'en' }) => {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Partial<FarmerProfile>>({
    name: '',
    village: '',
    landSize: 0,
    unit: 'Acres',
    irrigationType: 'Drip',
    waterSource: 'Well/Borewell',
    location: { lat: 18.5204, lng: 73.8567 },
    soil: { n: '', p: '', k: '', ph: '', cardImage: null }
  });
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const t = translations[lang] || translations['en'];

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleComplete = () => {
    onComplete(profile as FarmerProfile);
  };

  const handleSoilImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({
          ...prev,
          soil: { ...prev.soil!, cardImage: reader.result as string }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const detectLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setTimeout(() => {
            const mockCity = "Hinjewadi, Pune"; 
            setProfile({
              ...profile,
              village: profile.village || mockCity, 
              location: {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
            });
            setLocationDetected(true);
            setIsDetectingLocation(false);
          }, 1500);
        },
        (error) => {
          console.error("Error detecting location:", error);
          alert("Could not detect location. Using default coordinates.");
          setIsDetectingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
      setIsDetectingLocation(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-black text-neutral-900 leading-tight">{t.setup.step1.title}</h2>
              <p className="text-neutral-500 font-medium">{t.setup.step1.subtitle}</p>
            </div>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{t.setup.step1.name}</label>
                <input 
                  type="text"
                  placeholder="e.g. Rahul Sharma"
                  value={profile.name}
                  onChange={e => setProfile({...profile, name: e.target.value})}
                  className="w-full px-6 py-5 bg-neutral-50 border-2 border-neutral-100 rounded-[24px] focus:border-primary-500 focus:bg-white transition-all outline-none text-neutral-900 font-bold text-lg"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{t.setup.step1.village}</label>
                <div className="relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-xl bg-alert-50 border border-alert-100 shadow-sm">
                    <svg className="w-5 h-5 text-alert-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input 
                    type="text"
                    placeholder="Search your village..."
                    value={profile.village}
                    onChange={e => setProfile({...profile, village: e.target.value})}
                    className="w-full px-6 py-5 pl-20 bg-neutral-50 border-2 border-neutral-100 rounded-[24px] focus:border-primary-500 focus:bg-white transition-all outline-none text-neutral-900 font-bold text-lg placeholder:font-medium placeholder:text-neutral-300"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <button 
                      onClick={detectLocation}
                      disabled={isDetectingLocation}
                      className="text-[10px] font-black uppercase text-primary-600 tracking-wider bg-white border border-primary-100 px-3 py-2 rounded-xl shadow-sm hover:bg-primary-50 active:scale-95 transition-all flex items-center gap-1"
                    >
                      {isDetectingLocation ? (
                        <>
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Detecting
                        </>
                      ) : (
                        'DETECT'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 max-h-[70vh] overflow-y-auto pb-6 pr-1 no-scrollbar">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-black text-neutral-900 leading-tight">{t.setup.step2.title}</h2>
              <p className="text-neutral-500 font-medium">{t.setup.step2.subtitle}</p>
            </div>

            <div className="space-y-8">
              {/* Land Size */}
              <div className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t.setup.step2.size}</label>
                  <div className="bg-neutral-100 p-1 rounded-xl flex">
                    {(['Acres', 'Hectares'] as const).map(u => (
                      <button
                        key={u}
                        type="button"
                        onClick={() => setProfile({...profile, unit: u})}
                        className={`px-4 py-1.5 text-[10px] font-bold rounded-lg transition-all ${profile.unit === u ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
                <input 
                  type="number"
                  inputMode="decimal"
                  pattern="[0-9]*"
                  placeholder="0.00"
                  value={profile.landSize || ''}
                  onChange={e => setProfile({...profile, landSize: parseFloat(e.target.value)})}
                  className="w-full text-5xl font-black text-neutral-900 px-0 py-2 border-b-2 border-neutral-100 focus:border-primary-500 transition-all outline-none bg-transparent placeholder:text-neutral-200"
                />
              </div>

              {/* Source of Water */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{t.setup.step2.source}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Well/Borewell', label: 'Borewell', icon: '🕳️' },
                    { id: 'Canal', label: 'Canal', icon: '🛣️' },
                    { id: 'River/Pond', label: 'River/Pond', icon: '🌊' },
                    { id: 'Rain-fed', label: 'Rain-fed', icon: '🌧️' }
                  ].map(source => (
                    <button
                      key={source.id}
                      type="button"
                      onClick={() => setProfile({...profile, waterSource: source.id})}
                      className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all active:scale-[0.98] min-h-[100px] justify-center
                        ${profile.waterSource === source.id ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-100' : 'border-neutral-100 bg-white shadow-sm'}`}
                    >
                      <span className="text-3xl">{source.icon}</span>
                      <span className={`text-xs font-black ${profile.waterSource === source.id ? 'text-primary-700' : 'text-neutral-600'}`}>{source.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Irrigation Type */}
              <div className="space-y-4">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{t.setup.step2.type}</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Drip', label: 'Drip', icon: '💧' },
                    { id: 'Sprinkler', label: 'Sprinkler', icon: '💦' },
                    { id: 'Surface', label: 'Surface', icon: '🏞️' },
                    { id: 'Manual', label: 'Manual', icon: '🪣' }
                  ].map(type => (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setProfile({...profile, irrigationType: type.id})}
                      className={`p-4 rounded-3xl border-2 flex flex-col items-center gap-2 transition-all active:scale-[0.98] min-h-[100px] justify-center
                        ${profile.irrigationType === type.id ? 'border-primary-500 bg-primary-50 shadow-md shadow-primary-100' : 'border-neutral-100 bg-white shadow-sm'}`}
                    >
                      <span className="text-3xl">{type.icon}</span>
                      <span className={`text-xs font-black ${profile.irrigationType === type.id ? 'text-primary-700' : 'text-neutral-600'}`}>{type.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 3: // Soil Step
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500 max-h-[70vh] overflow-y-auto pb-6 pr-1 no-scrollbar">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-black text-neutral-900 leading-tight">{t.setup.step3.title}</h2>
              <p className="text-neutral-500 font-medium">{t.setup.step3.subtitle}</p>
            </div>

            <div className="space-y-8">
              {/* Photo Upload */}
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-full aspect-video rounded-3xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all active:scale-[0.98]
                  ${profile.soil?.cardImage ? 'border-transparent shadow-xl' : 'border-primary-200 bg-primary-50 hover:bg-primary-100/50'}`}
              >
                {profile.soil?.cardImage ? (
                  <>
                    <img src={profile.soil.cardImage} alt="Soil Card" className="w-full h-full object-cover rounded-3xl" />
                    <div className="absolute inset-0 bg-black/30 rounded-3xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold text-sm">Tap to change</p>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
                      <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <p className="font-black text-primary-700 text-sm">{t.setup.step3.upload_btn}</p>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleSoilImageUpload} 
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="h-px bg-neutral-200 flex-1"></div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t.setup.step3.or}</span>
                <div className="h-px bg-neutral-200 flex-1"></div>
              </div>

              {/* Manual Inputs Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'n', label: t.setup.step3.n, placeholder: '00' },
                  { id: 'p', label: t.setup.step3.p, placeholder: '00' },
                  { id: 'k', label: t.setup.step3.k, placeholder: '00' },
                  { id: 'ph', label: t.setup.step3.ph, placeholder: '7.0' }
                ].map(field => (
                  <div key={field.id} className="space-y-1">
                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{field.label}</label>
                    <input 
                      type="number"
                      placeholder={field.placeholder}
                      value={profile.soil?.[field.id as keyof typeof profile.soil] || ''}
                      onChange={e => setProfile({...profile, soil: { ...profile.soil!, [field.id]: e.target.value }})}
                      className="w-full px-4 py-3 bg-neutral-50 border-2 border-neutral-100 rounded-2xl focus:border-primary-500 focus:bg-white transition-all outline-none text-neutral-900 font-bold text-center"
                    />
                  </div>
                ))}
              </div>

              <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 text-center">
                <p className="text-xs text-neutral-400 font-bold">{t.setup.step3.default_msg}</p>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8 animate-in slide-in-from-right-8 duration-500">
            <div className="space-y-2 text-center">
              <h2 className="text-3xl font-black text-neutral-900 leading-tight">{t.setup.step4.title}</h2>
              <p className="text-neutral-500 font-medium">{t.setup.step4.subtitle}</p>
            </div>

            <div className="relative aspect-square rounded-[40px] overflow-hidden shadow-2xl group border-[6px] border-white ring-1 ring-neutral-200">
              {/* Satellite Map View */}
              <img 
                src="https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&q=80&w=800" 
                className={`w-full h-full object-cover transition-all duration-1000 transform hover:scale-110 ${isDetectingLocation ? 'blur-sm' : ''}`}
                alt="Satellite Map"
              />
              
              {/* Map UI Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10 pointer-events-none"></div>
              
              {/* Center Pin & Radar Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
                 <div className="w-4 h-4 bg-primary-500 rounded-full border-[3px] border-white shadow-lg z-10"></div>
                 <div className="absolute w-32 h-32 bg-primary-500/20 rounded-full animate-ping"></div>
                 <div className="absolute w-64 h-64 bg-primary-500/10 rounded-full animate-pulse"></div>
              </div>

              {/* Location Details Card Overlay */}
              <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-xl p-4 rounded-3xl shadow-xl flex items-center justify-between animate-in slide-in-from-bottom-6 duration-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Farm Location</p>
                    <p className="text-xs font-black text-neutral-800 tabular-nums">
                      Lat: {profile.location?.lat.toFixed(4)} | Lng: {profile.location?.lng.toFixed(4)}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={detectLocation}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-xl transition-colors active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="bg-warning-50 border border-warning-100 rounded-3xl p-5 flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-warning-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-warning-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="text-xs text-warning-800 font-bold leading-relaxed">{t.setup.step4.warning}</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-white z-[150] flex flex-col pt-8">
      {/* Step Indicator */}
      <div className="px-8 space-y-6">
        <div className="flex justify-between items-center">
          <button 
            type="button"
            onClick={prevStep}
            className={`p-3 -ml-3 rounded-full transition-all active:bg-neutral-100 ${step > 1 ? 'text-neutral-400' : 'opacity-0 pointer-events-none'}`}
            aria-label="Previous Step"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex gap-2.5">
            {[1, 2, 3, 4].map(i => (
              <div 
                key={i} 
                className={`h-1.5 rounded-full transition-all duration-500 ${step === i ? 'w-10 bg-primary-500' : i < step ? 'w-4 bg-primary-200' : 'w-4 bg-neutral-100'}`}
              ></div>
            ))}
          </div>
          <div className="w-10"></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-6 no-scrollbar custom-scroll">
        {renderStep()}
      </div>

      <div className="px-8 py-8 border-t border-neutral-50 safe-bottom bg-white/80 backdrop-blur-md">
        <button 
          onClick={step === 4 ? handleComplete : nextStep}
          disabled={step === 1 && !profile.village}
          className={`w-full py-5 rounded-[28px] font-black text-lg shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-3
            ${(step === 1 && !profile.village) ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' : 'bg-neutral-900 text-white shadow-neutral-300 hover:bg-neutral-800'}`}
        >
          <span>{step === 4 ? t.setup.btn_finish : t.setup.btn_continue}</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ProfileSetup;
