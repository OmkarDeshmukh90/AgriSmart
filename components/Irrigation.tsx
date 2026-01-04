
import React, { useState } from 'react';
import { translations } from '../translations';

interface IrrigationProps {
  onNotify: (notif: { type: any; title: string; message: string }) => void;
  lang?: string;
}

const Irrigation: React.FC<IrrigationProps> = ({ onNotify, lang = 'en' }) => {
  const t = translations[lang] || translations['en'];
  
  const [zones, setZones] = useState([
    { id: 1, name: t.irrigation.zones.north, moisture: 32, active: true, nextSchedule: '06:00 AM', img: 'https://images.unsplash.com/photo-1592939331610-85f269a9b251?auto=format&fit=crop&q=80&w=200' },
    { id: 2, name: t.irrigation.zones.east, moisture: 45, active: false, nextSchedule: '08:00 AM', img: 'https://images.unsplash.com/photo-1464306208223-e0b4495a5553?auto=format&fit=crop&q=80&w=200' },
    { id: 3, name: t.irrigation.zones.greenhouse, moisture: 68, active: false, nextSchedule: 'Manual', img: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=200' },
  ]);

  const toggleZone = (id: number) => {
    setZones(zones.map(z => z.id === id ? { ...z, active: !z.active } : z));
  };

  const applyRecommendation = () => {
    setZones(zones.map(z => z.id <= 2 ? { ...z, nextSchedule: 'Delayed (Rain)' } : z));
    onNotify({
      type: 'system',
      title: 'Auto-Adjust Complete',
      message: 'Zone schedules updated based on incoming storm forecast.'
    });
  };

  return (
    <div className="space-y-6 py-4">
      <div className="text-center">
        <h2 className="text-2xl font-black text-neutral-900">{t.irrigation.title}</h2>
        <p className="text-sm text-neutral-500 font-medium">{t.irrigation.subtitle}</p>
      </div>

      <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full"></div>
        <div className="relative z-10 flex justify-between items-center">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-blue-100">{t.irrigation.savings}</p>
            <h3 className="text-4xl font-black">1,240L</h3>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center border border-white/20">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-1">{t.irrigation.field_status}</h3>
        {zones.map(zone => (
          <div key={zone.id} className="p-4 bg-white rounded-[32px] border border-neutral-100 shadow-sm flex items-center gap-4">
            <img src={zone.img} className="w-16 h-16 rounded-2xl object-cover shadow-inner" alt={zone.name} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <h4 className="font-black text-neutral-900">{zone.name}</h4>
                {zone.active && <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>}
              </div>
              <div className="flex gap-4">
                <div><p className="text-[9px] font-black text-neutral-400 uppercase">{t.irrigation.soil}</p><p className="text-xs font-black text-neutral-800">{zone.moisture}%</p></div>
                <div><p className="text-[9px] font-black text-neutral-400 uppercase">{t.irrigation.next}</p><p className="text-xs font-black text-neutral-800">{zone.nextSchedule}</p></div>
              </div>
            </div>
            <button 
              onClick={() => toggleZone(zone.id)}
              className={`w-14 h-8 rounded-full p-1 transition-all flex items-center shadow-inner
                ${zone.active ? 'bg-blue-600 justify-end' : 'bg-neutral-200 justify-start'}`}
            >
              <div className="w-6 h-6 bg-white rounded-full shadow-md"></div>
            </button>
          </div>
        ))}
      </div>

      <div className="bg-primary-50 border border-primary-100 rounded-[32px] p-6 space-y-4">
        <div className="flex gap-4">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-2xl flex-shrink-0">🌩️</div>
          <div>
            <h5 className="font-black text-primary-900 uppercase text-[10px] tracking-widest mb-1">{t.irrigation.ai_rec}</h5>
            <p className="text-xs text-primary-700 font-bold leading-relaxed">{t.irrigation.rec_msg}</p>
          </div>
        </div>
        <button onClick={applyRecommendation} className="w-full py-5 bg-neutral-900 text-white rounded-[28px] font-black text-lg shadow-xl shadow-neutral-200 active:scale-95 transition-all">{t.irrigation.apply_adj}</button>
      </div>
    </div>
  );
};

export default Irrigation;
