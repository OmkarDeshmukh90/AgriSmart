
import React, { useEffect, useState } from 'react';

const SplashScreen: React.FC = () => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Start exit animation slightly before the parent removes the component
    const timer = setTimeout(() => setIsExiting(true), 2700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`fixed inset-0 z-[200] flex flex-col items-center justify-center transition-opacity duration-500 overflow-hidden ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center scale-110 animate-pulse-slow"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1600")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center animate-in zoom-in-95 duration-700 ease-out px-6">
        {/* Logo Section */}
        <div className="flex items-center gap-3 mb-4 drop-shadow-2xl">
          {/* Leaf Icon */}
          <div className="relative w-16 h-16 flex items-center justify-center">
             <svg className="w-full h-full text-white" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 85C50 85 75 70 75 45C75 25 55 15 50 15C45 15 25 25 25 45C25 70 50 85 50 85Z" fill="#166534" />
                <path d="M50 85C50 85 68 78 68 55C68 35 55 25 50 25V85Z" fill="#15803d" />
                <path d="M30 65C30 65 15 55 15 35C15 20 25 15 30 15C35 15 45 20 45 35C45 55 30 65 30 65Z" fill="#84cc16" />
                <path d="M70 65C70 65 85 55 85 35C85 20 75 15 70 15C65 15 55 20 55 35C55 55 70 65 70 65Z" fill="#4ade80" />
             </svg>
          </div>
          
          <h1 className="text-5xl font-extrabold tracking-tight flex items-baseline">
            <span className="text-white drop-shadow-lg" style={{ color: '#166534' }}>Harvest</span>
            <span className="text-white drop-shadow-lg" style={{ color: '#84cc16' }}>Hub</span>
          </h1>
        </div>

        {/* Tagline */}
        <p className="text-white text-lg font-medium tracking-wide opacity-90 drop-shadow-md border-t border-white/20 pt-4 mt-2">
          Cultivating a Smarter Future
        </p>

        {/* Loading Indicator */}
        <div className="mt-16 flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/60 animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-bounce"></div>
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1.1); }
          50% { transform: scale(1.15); }
        }
        .animate-pulse-slow {
          animation: pulse-slow 10s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
