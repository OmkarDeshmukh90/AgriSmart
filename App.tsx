
import React, { useState, useEffect, useCallback } from 'react';
import { NavTab, AppNotification, FarmerProfile } from './types';
import Dashboard from './components/Dashboard';
import Scanner from './components/Scanner';
import Market from './components/Market';
import Irrigation from './components/Irrigation';
import Community from './components/Community';
import CropPlan from './components/CropPlan';
import Notifications from './components/Notifications';
import SplashScreen from './components/SplashScreen';
import ProfileSetup from './components/ProfileSetup';
import CropRecommendation from './components/CropRecommendation';
import ProfileSettings from './components/ProfileSettings';
import LanguageSelection from './components/LanguageSelection';
import LoginScreen from './components/LoginScreen';
import OtpScreen from './components/OtpScreen';
import { translations } from './translations';
import { storage } from './utils/storage';

type OnboardingStage = 'splash' | 'language' | 'login' | 'otp' | 'profileSetup' | 'ready';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>(NavTab.DASHBOARD);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);
  const [onboardingStage, setOnboardingStage] = useState<OnboardingStage>('splash');
  const [userProfile, setUserProfile] = useState<FarmerProfile | null>(null);
  
  // Persist Active Crop
  const [activeCrop, setActiveCrop] = useState<string | null>(() => storage.get<string>('active_crop'));

  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const t = translations[selectedLanguage] || translations['en'];

  // Persist Active Crop Effect
  useEffect(() => {
    if (activeCrop) {
      storage.save('active_crop', activeCrop);
    }
  }, [activeCrop]);

  const addNotification = useCallback((notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    setActiveToast(newNotif);
    
    setTimeout(() => {
      setActiveToast(current => current?.id === newNotif.id ? null : current);
    }, 4000);
  }, []);

  // Offline/Online Handling & Sync
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto Sync Logic
      addNotification({
        type: 'system',
        title: 'Connection Restored',
        message: 'Syncing offline data with cloud...',
        avatar: '🔄'
      });
      
      // Simulate Sync Delay
      setTimeout(() => {
         addNotification({
          type: 'system',
          title: 'Sync Complete',
          message: 'All task lists and market data updated.',
          avatar: '✅'
        });
      }, 2500);
    };

    const handleOffline = () => {
      setIsOnline(false);
      addNotification({
        type: 'system',
        title: 'Offline Mode Active',
        message: 'You can still view plans and tasks. Changes will save locally.',
        avatar: '📡'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [addNotification]);

  // Notification Simulation Engine
  useEffect(() => {
    if (onboardingStage !== 'ready') return;

    // Simulate Weather Alert after 10 seconds
    const weatherTimer = setTimeout(() => {
      addNotification({
        type: 'system',
        title: t.dashboard.weather_alert,
        message: 'High wind speeds detected (25km/h). Avoid spraying pesticides today.',
        avatar: '💨'
      });
    }, 10000);

    // Simulate Task Reminder after 20 seconds
    const taskTimer = setTimeout(() => {
      addNotification({
        type: 'system', // Using system for task alert
        title: 'Task Reminder',
        message: 'You have 1 pending task for today: Irrigation Zone A.',
        avatar: '⏰'
      });
    }, 20000);

    return () => {
      clearTimeout(weatherTimer);
      clearTimeout(taskTimer);
    };
  }, [onboardingStage, addNotification, t]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOnboardingStage('language');
    }, 3200); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const initialNotifs: AppNotification[] = [
      {
        id: '1',
        type: 'system',
        title: 'Weekly Report Ready',
        message: 'Your farm sustainability score increased by 5% this week!',
        timestamp: new Date(),
        read: false
      },
      {
        id: '2',
        type: 'post',
        title: 'Market Alert',
        message: 'Wheat prices reached a 30-day high in your local market.',
        timestamp: new Date(Date.now() - 3600000 * 2),
        read: true
      }
    ];
    setNotifications(initialNotifs);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;
  const markAllAsRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  const removeNotification = (id: string) => setNotifications(prev => prev.filter(n => n.id !== id));
  const clearAllNotifications = () => setNotifications([]);

  const handleProfileSetupComplete = (profile: FarmerProfile) => {
    setUserProfile(profile);
    setOnboardingStage('ready');
    addNotification({
      type: 'system',
      title: t.welcome,
      message: `Profile complete for ${profile.name || 'your farm'} in ${profile.village}.`
    });
  };

  const renderMainContent = () => {
    switch (activeTab) {
      case NavTab.DASHBOARD: 
        return <Dashboard 
          activeCrop={activeCrop} 
          onSelectCrop={() => setActiveTab(NavTab.RECOMMENDATION)} 
          onNavigate={setActiveTab} 
          lang={selectedLanguage}
          userLocation={userProfile?.location} 
        />;
      case NavTab.SCANNER: return <Scanner />;
      case NavTab.MARKET: return <Market onNotify={addNotification} activeCrop={activeCrop} />;
      case NavTab.IRRIGATION: return <Irrigation onNotify={addNotification} />;
      case NavTab.COMMUNITY: return <Community onNotify={addNotification} activeCrop={activeCrop} />;
      case NavTab.CROP_PLAN: return <CropPlan activeCrop={activeCrop} onNotify={addNotification} profile={userProfile} />;
      case NavTab.NOTIFICATIONS: return (
        <Notifications notifications={notifications} onMarkRead={markAllAsRead} onRemove={removeNotification} onClearAll={clearAllNotifications} />
      );
      case NavTab.RECOMMENDATION: return (
        <CropRecommendation 
          profile={userProfile}
          onSelect={(crop) => {
            setActiveCrop(crop);
            setActiveTab(NavTab.CROP_PLAN); 
            addNotification({
              type: 'system',
              title: t.season_started || 'Season Started',
              message: `Your ${crop} plan has been generated successfully.`
            });
          }}
          onBack={() => setActiveTab(NavTab.DASHBOARD)}
          lang={selectedLanguage}
        />
      );
      case NavTab.PROFILE: return <ProfileSettings profile={userProfile} onBack={() => setActiveTab(NavTab.DASHBOARD)} onUpdateProfile={(updated) => setUserProfile(updated)} lang={selectedLanguage} onLanguageChange={setSelectedLanguage} />;
      default: return <Dashboard activeCrop={activeCrop} onSelectCrop={() => setActiveTab(NavTab.RECOMMENDATION)} onNavigate={setActiveTab} lang={selectedLanguage} userLocation={userProfile?.location} />;
    }
  };

  if (onboardingStage === 'splash') return <SplashScreen />;
  if (onboardingStage === 'language') return <LanguageSelection onSelect={(lang) => { setSelectedLanguage(lang); setOnboardingStage('login'); }} />;
  if (onboardingStage === 'login') return <LoginScreen lang={selectedLanguage} onContinue={(phone) => { setPhoneNumber(phone); setOnboardingStage('otp'); }} onBack={() => setOnboardingStage('language')} />;
  if (onboardingStage === 'otp') return <OtpScreen lang={selectedLanguage} phone={phoneNumber} onVerify={() => setOnboardingStage('profileSetup')} onBack={() => setOnboardingStage('login')} />;
  if (onboardingStage === 'profileSetup') return <ProfileSetup onComplete={handleProfileSetupComplete} />;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-white shadow-xl relative overflow-hidden">
      {/* Offline Banner */}
      {!isOnline && (
        <div className="bg-neutral-800 text-white text-[10px] font-bold uppercase tracking-widest text-center py-2 animate-in slide-in-from-top-0 z-50">
          ⚠️ Offline Mode • Using Saved Data
        </div>
      )}

      {activeToast && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-[340px] z-[100] animate-in slide-in-from-top-12 duration-500">
          <div className="bg-neutral-900/95 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3 border border-white/10">
            <div className={`p-2 rounded-xl flex-shrink-0 ${
              activeToast.type === 'like' ? 'bg-alert-500' :
              activeToast.type === 'comment' ? 'bg-blue-500' :
              'bg-primary-500'
            }`}>
              {activeToast.type === 'like' && <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>}
              {activeToast.type === 'comment' && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
              {(activeToast.type === 'post' || activeToast.type === 'system') && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-primary-400 uppercase tracking-wider">{activeToast.title}</p>
              <p className="text-sm text-neutral-200 mt-0.5 line-clamp-2">{activeToast.message}</p>
            </div>
            <button onClick={() => setActiveToast(null)} className="text-neutral-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>
      )}

      <header className="px-6 pt-6 pb-4 bg-white z-30 flex justify-between items-center relative shadow-sm">
        <div className="cursor-pointer flex-1 min-w-0" onClick={() => setActiveTab(NavTab.DASHBOARD)}>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
            <svg className="w-6 h-6 flex-shrink-0" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 85C50 85 75 70 75 45C75 25 55 15 50 15C45 15 25 25 25 45C25 70 50 85 50 85Z" fill="#10b981" />
              <path d="M30 65C30 65 15 55 15 35C15 20 25 15 30 15C35 15 45 20 45 35C45 55 30 65 30 65Z" fill="#84cc16" />
            </svg>
            {t.app_name}
          </h1>
          <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest pl-7.5 truncate">HarvestHub Ecosystem</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <button onClick={() => { setActiveTab(NavTab.NOTIFICATIONS); markAllAsRead(); }} className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${activeTab === NavTab.NOTIFICATIONS ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {unreadCount > 0 && activeTab !== NavTab.NOTIFICATIONS && <span className="absolute top-0 right-0 w-4 h-4 bg-alert-500 border-2 border-white rounded-full flex items-center justify-center"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-alert-400 opacity-75"></span></span>}
          </button>
          <div onClick={() => setActiveTab(NavTab.PROFILE)} className={`w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm overflow-hidden cursor-pointer transition-all ${activeTab === NavTab.PROFILE ? 'border-primary-500 ring-2 ring-primary-200' : 'border-white bg-primary-100'}`}>
            {userProfile ? <span className="text-primary-700 font-bold text-xs">{(userProfile.name || 'F').charAt(0).toUpperCase()}</span> : <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          </div>
        </div>
      </header>

      <main className="flex-1 pb-28 overflow-y-auto px-6 pt-2">{renderMainContent()}</main>

      {/* Floating Glassmorphism Navbar */}
      <nav className="fixed bottom-4 left-4 right-4 max-w-[calc(100%-2rem)] mx-auto bg-white/80 backdrop-blur-xl border border-white/40 flex justify-around items-center py-2 px-2 z-30 shadow-2xl rounded-[32px]">
        <NavButton active={activeTab === NavTab.DASHBOARD || activeTab === NavTab.RECOMMENDATION} onClick={() => setActiveTab(NavTab.DASHBOARD)} label={t.nav.home} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />} />
        <NavButton active={activeTab === NavTab.SCANNER} onClick={() => setActiveTab(NavTab.SCANNER)} label={t.nav.scan} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />} />
        <NavButton active={activeTab === NavTab.CROP_PLAN} onClick={() => setActiveTab(NavTab.CROP_PLAN)} label={t.nav.plan} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />} />
        <NavButton active={activeTab === NavTab.MARKET} onClick={() => setActiveTab(NavTab.MARKET)} label={t.nav.market} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />} />
        <NavButton active={activeTab === NavTab.COMMUNITY} onClick={() => setActiveTab(NavTab.COMMUNITY)} label={t.nav.social} icon={<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />} />
      </nav>
    </div>
  );
};

interface NavButtonProps { active: boolean; onClick: () => void; label: string; icon: React.ReactNode; }
const NavButton: React.FC<NavButtonProps> = ({ active, onClick, label, icon }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1 min-w-[50px] group">
    <div className={`p-2.5 rounded-full transition-all duration-300 flex items-center justify-center 
      ${active ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 -translate-y-1' : 'text-neutral-400 group-hover:text-neutral-600'}`}>
      <div className={`w-5 h-5 ${active ? 'scale-110' : 'scale-100'} transition-transform`}>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
      </div>
    </div>
    <span className={`text-[9px] font-black tracking-wide uppercase transition-all duration-300 ${active ? 'text-primary-700 font-extrabold translate-y-0' : 'text-neutral-400 scale-90'}`}>{label}</span>
  </button>
);

export default App;
