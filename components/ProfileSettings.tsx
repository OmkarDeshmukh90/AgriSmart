
import React, { useState } from 'react';
import { FarmerProfile } from '../types';
import { translations } from '../translations';

interface ProfileSettingsProps {
  profile: FarmerProfile | null;
  onBack: () => void;
  onUpdateProfile: (profile: FarmerProfile) => void;
  lang?: string;
  onLanguageChange?: (lang: string) => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onBack, onUpdateProfile, lang = 'en', onLanguageChange }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const t = translations[lang] || translations['en'];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'Hindi' },
    { code: 'mr', name: 'Marathi' }
  ];

  const currentLangName = languages.find(l => l.code === lang)?.name || 'English';

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  if (!profile) return null;

  return (
    <div className="space-y-8 py-4 animate-in slide-in-from-right-6 duration-500 pb-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:bg-neutral-200 active:scale-90 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h2 className="text-2xl font-black text-neutral-900">{t.settings.title}</h2>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-xl shadow-neutral-200/40 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-3xl rounded-full"></div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="w-24 h-24 rounded-[32px] bg-primary-100 border-4 border-white shadow-lg flex items-center justify-center text-4xl font-black text-primary-700">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{profile.name}</h3>
            <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest">{profile.village}, MH</p>
          </div>
          
          <div className="flex gap-4 w-full pt-4 border-t border-neutral-50">
            <div className="flex-1">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Land Size</p>
              <p className="text-lg font-black text-neutral-800">{profile.landSize} <span className="text-xs font-bold text-neutral-400">{profile.unit}</span></p>
            </div>
            <div className="w-px h-10 bg-neutral-100 my-auto"></div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Irrigation</p>
              <p className="text-lg font-black text-neutral-800">{profile.irrigationType}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-2">{t.settings.app_section}</h3>
          
          <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm">
            {/* Language Setting */}
            <button 
              onClick={() => setShowLanguageModal(true)}
              className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors border-b border-neutral-50"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M10.472 12c.2-1.015.39-2.072.548-3.116m-2.02 0c.2-1.015.39-2.072.548-3.116M3 5h12M9 3v2m1.048 9.5a18.022 18.022 0 01-3.827-5.802M10.472 12c.2-1.015.39-2.072.548-3.116m-2.02 0c.2-1.015.39-2.072.548-3.116" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-neutral-800">{t.settings.lang}</p>
                  <p className="text-xs text-neutral-400 font-bold">{currentLangName}</p>
                </div>
              </div>
              <svg className="w-5 h-5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Notifications Toggle */}
            <div className="w-full flex items-center justify-between p-5 border-b border-neutral-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-alert-50 rounded-xl flex items-center justify-center text-alert-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-neutral-800">{t.settings.notifications}</p>
                  <p className="text-xs text-neutral-400 font-bold">Alerts and reminders</p>
                </div>
              </div>
              <button 
                onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-12 h-7 rounded-full transition-all flex items-center px-1 shadow-inner
                  ${notificationsEnabled ? 'bg-primary-500 justify-end' : 'bg-neutral-200 justify-start'}`}
              >
                <div className="w-5 h-5 bg-white rounded-full shadow-md"></div>
              </button>
            </div>

            {/* Offline Sync Status */}
            <div className="w-full flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-sm font-black text-neutral-800">{t.settings.data_sync}</p>
                  <p className="text-xs text-neutral-400 font-bold">Offline mode available</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${isSyncing ? 'bg-blue-100 text-blue-600' : 'bg-primary-100 text-primary-600'}`}>
                  {isSyncing ? 'Syncing...' : 'Synced'}
                </span>
                <button 
                  onClick={handleSync}
                  className="text-[9px] font-black text-neutral-400 underline hover:text-neutral-600 uppercase tracking-widest"
                >
                  Force Sync
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-2">{t.settings.support_section}</h3>
          <div className="bg-white rounded-3xl border border-neutral-100 overflow-hidden shadow-sm divide-y divide-neutral-50">
            {['Help Center', 'About AgriSmart', 'Privacy Policy'].map(item => (
              <button 
                key={item}
                className="w-full flex items-center justify-between p-5 hover:bg-neutral-50 transition-colors"
              >
                <span className="text-sm font-black text-neutral-700">{item}</span>
                <svg className="w-4 h-4 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        <button className="w-full py-5 bg-neutral-900 text-white font-black rounded-[28px] text-lg active:scale-95 transition-all shadow-xl">
          {t.settings.sign_out}
        </button>
      </div>

      <p className="text-center text-[10px] text-neutral-300 font-black uppercase tracking-widest pt-4">Version 2.4.0 (Stable)</p>

      {/* Language Modal Overlay */}
      {showLanguageModal && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-black text-neutral-900">Select Language</h4>
              <button onClick={() => setShowLanguageModal(false)} className="p-2 bg-neutral-100 rounded-full">
                <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {languages.map(l => (
                <button 
                  key={l.code}
                  onClick={() => {
                    if (onLanguageChange) onLanguageChange(l.code);
                    setShowLanguageModal(false);
                  }}
                  className={`py-4 rounded-2xl font-black text-sm border-2 transition-all active:scale-95
                    ${lang === l.code ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-lg' : 'border-neutral-100 text-neutral-600'}`}
                >
                  {l.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
