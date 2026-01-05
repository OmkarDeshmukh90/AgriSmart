
import React, { useState, useEffect } from 'react';
import { CropStage, FarmTask, TaskStatus, FarmerProfile } from '../types';
import { translations } from '../translations';
import { storage } from '../utils/storage';

interface CropPlanProps {
  onNotify: (notif: { type: any; title: string; message: string }) => void;
  activeCrop: string | null;
  lang?: string;
  profile?: FarmerProfile | null;
}

// Helper to format date relative to today
const getDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const getLongDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
};

// Plan Data Types
type PlanTemplate = {
  duration: number; // Total days
  stages: {
    id: string;
    nameKey: string; // key for translations or raw string
    duration: string;
    startDay: number;
    icon: string;
    thumb: string;
    description: string;
    tasks: string[];
  }[];
  tasks: {
    dayOffset: number;
    title: string;
    description: string;
    quantity: string;
    category: 'fertilizer' | 'irrigation' | 'pesticide' | 'harvest';
  }[];
};

const CROP_TEMPLATES: Record<string, PlanTemplate> = {
  'Wheat': {
    duration: 120,
    stages: [
      { id: '1', nameKey: 'Sowing', duration: '20 Days', startDay: 0, icon: '🚜', thumb: 'https://images.unsplash.com/photo-1592939331610-85f269a9b251?auto=format&fit=crop&q=80&w=200', description: 'Soil prep and seed sowing.', tasks: ['Soil Tilling', 'Seed Treatment', 'Sowing'] },
      { id: '2', nameKey: 'Crown Root', duration: '20-25 Days', startDay: 20, icon: '🌱', thumb: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=200', description: 'Critical stage for irrigation.', tasks: ['First Irrigation', 'Nitrogen Top Dressing'] },
      { id: '3', nameKey: 'Flowering', duration: '60-80 Days', startDay: 60, icon: '🌸', thumb: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&q=80&w=200', description: 'Grain setting begins.', tasks: ['Fungicide Spray', 'Check Moisture'] },
      { id: '4', nameKey: 'Harvest', duration: '110-120 Days', startDay: 110, icon: '🌾', thumb: 'https://images.unsplash.com/photo-1530507629858-e4977d30e9e0?auto=format&fit=crop&q=80&w=200', description: 'Grain maturation complete.', tasks: ['Harvesting'] }
    ],
    tasks: [
      { dayOffset: -2, title: 'Basal Dose', description: 'Apply DAP and Potash before sowing.', quantity: '50kg/acre', category: 'fertilizer' },
      { dayOffset: 0, title: 'Sowing', description: 'Sow seeds at 5cm depth.', quantity: '40kg/acre', category: 'harvest' },
      { dayOffset: 21, title: 'CRI Irrigation', description: 'Most critical irrigation stage for root development.', quantity: 'Field Capacity', category: 'irrigation' },
      { dayOffset: 25, title: 'Weed Control', description: 'Apply herbicide for broadleaf weeds.', quantity: 'As needed', category: 'pesticide' },
      { dayOffset: 45, title: 'Urea Top Dressing', description: 'Boost vegetative growth.', quantity: '25kg/acre', category: 'fertilizer' }
    ]
  },
  'Rice (Basmati)': {
    duration: 140,
    stages: [
      { id: '1', nameKey: 'Nursery', duration: '25 Days', startDay: 0, icon: '🌱', thumb: 'https://images.unsplash.com/photo-1599583198650-68897597950c?auto=format&fit=crop&q=80&w=200', description: 'Preparing seedlings.', tasks: ['Seed Bed Prep', 'Sowing'] },
      { id: '2', nameKey: 'Transplanting', duration: 'Day 25', startDay: 25, icon: '🚜', thumb: 'https://images.unsplash.com/photo-1625246333195-5840507c8870?auto=format&fit=crop&q=80&w=200', description: 'Moving to main field.', tasks: ['Puddling', 'Transplanting'] },
      { id: '3', nameKey: 'Tillering', duration: '30-60 Days', startDay: 30, icon: '🌿', thumb: 'https://images.unsplash.com/photo-1536633310979-b854b866ed5f?auto=format&fit=crop&q=80&w=200', description: 'Active growth phase.', tasks: ['Water Level Maintenance', 'Weeding'] },
      { id: '4', nameKey: 'Harvest', duration: '130-140 Days', startDay: 130, icon: '🍚', thumb: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200', description: 'Grains golden yellow.', tasks: ['Drain Water', 'Harvest'] }
    ],
    tasks: [
      { dayOffset: -5, title: 'Seed Treatment', description: 'Treat seeds with Carbendazim.', quantity: '2g/kg seed', category: 'pesticide' },
      { dayOffset: 0, title: 'Transplanting', description: 'Transplant 2-3 seedlings per hill.', quantity: 'Main Field', category: 'harvest' },
      { dayOffset: 5, title: 'Maintain Water', description: 'Keep 2-3cm water level.', quantity: 'Continuous', category: 'irrigation' },
      { dayOffset: 45, title: 'Zinc Application', description: 'Prevent Khaira disease.', quantity: '5kg/acre', category: 'fertilizer' },
      { dayOffset: 70, title: 'Stem Borer Check', description: 'Look for dead hearts in crop.', quantity: 'Visual', category: 'pesticide' }
    ]
  },
  'Cotton': {
    duration: 160,
    stages: [
      { id: '1', nameKey: 'Sowing', duration: '10 Days', startDay: 0, icon: '🌱', thumb: 'https://images.unsplash.com/photo-1594903330656-11f26771d906?auto=format&fit=crop&q=80&w=200', description: 'Germination phase.', tasks: ['Dibbling'] },
      { id: '2', nameKey: 'Vegetative', duration: '45 Days', startDay: 15, icon: '🌿', thumb: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&q=80&w=200', description: 'Branching starts.', tasks: ['Thinning', 'Weeding'] },
      { id: '3', nameKey: 'Flowering', duration: '60-90 Days', startDay: 60, icon: '🌼', thumb: 'https://images.unsplash.com/photo-1593348637654-e06927909247?auto=format&fit=crop&q=80&w=200', description: 'Square formation.', tasks: ['Pest Control'] },
      { id: '4', nameKey: 'Boll Burst', duration: '140+ Days', startDay: 140, icon: '☁️', thumb: 'https://images.unsplash.com/photo-1582236893779-199677579893?auto=format&fit=crop&q=80&w=200', description: 'Ready for picking.', tasks: ['Picking'] }
    ],
    tasks: [
      { dayOffset: 0, title: 'Sowing', description: 'Sow Bt Cotton seeds.', quantity: '2 packets/acre', category: 'harvest' },
      { dayOffset: 20, title: 'Gap Filling', description: 'Re-sow where germination failed.', quantity: '-', category: 'harvest' },
      { dayOffset: 45, title: 'Sucking Pest Spray', description: 'Control Aphids/Jassids.', quantity: 'Neem Oil', category: 'pesticide' },
      { dayOffset: 60, title: 'Magnesium Sulfate', description: 'Correct reddening of leaves.', quantity: '10kg/acre', category: 'fertilizer' },
      { dayOffset: 90, title: 'Pink Bollworm Trap', description: 'Install Pheromone traps.', quantity: '5/acre', category: 'pesticide' }
    ]
  },
  'Soybean': {
    duration: 100,
    stages: [
      { id: '1', nameKey: 'Sowing', duration: '5 Days', startDay: 0, icon: '🌱', thumb: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=200', description: 'Seed germination.', tasks: [] },
      { id: '2', nameKey: 'Vegetative', duration: '30 Days', startDay: 10, icon: '🌿', thumb: 'https://images.unsplash.com/photo-1615485925694-a03cb797d542?auto=format&fit=crop&q=80&w=200', description: 'Leaf growth.', tasks: ['Weed Control'] },
      { id: '3', nameKey: 'Pod Formation', duration: '60 Days', startDay: 50, icon: '🥜', thumb: 'https://images.unsplash.com/photo-1526346698789-22fd84314424?auto=format&fit=crop&q=80&w=200', description: 'Pod filling.', tasks: ['Insect Control'] },
      { id: '4', nameKey: 'Maturity', duration: '95-100 Days', startDay: 95, icon: '🍂', thumb: 'https://images.unsplash.com/photo-1626262923675-296439294522?auto=format&fit=crop&q=80&w=200', description: 'Leaves yellowing.', tasks: ['Harvest'] }
    ],
    tasks: [
      { dayOffset: 0, title: 'Sowing', description: 'Ensure adequate soil moisture.', quantity: '30kg/acre', category: 'harvest' },
      { dayOffset: 15, title: 'Post-Emerge Herbicide', description: 'Control broadleaf weeds.', quantity: 'Imazethapyr', category: 'pesticide' },
      { dayOffset: 35, title: 'Flower Initiation', description: 'Monitor for caterpillars.', quantity: 'Visual', category: 'pesticide' },
      { dayOffset: 60, title: 'Pod Borer Spray', description: 'Apply if threshold crossed.', quantity: 'Quinalphos', category: 'pesticide' }
    ]
  },
  'Mustard': {
    duration: 110,
    stages: [
      { id: '1', nameKey: 'Sowing', duration: '5 Days', startDay: 0, icon: '🌱', thumb: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=200', description: 'Sowing time.', tasks: [] },
      { id: '2', nameKey: 'Rosette', duration: '25 Days', startDay: 20, icon: '🥬', thumb: 'https://images.unsplash.com/photo-1591192866976-5917865239a5?auto=format&fit=crop&q=80&w=200', description: 'Leaf development.', tasks: ['Thinning'] },
      { id: '3', nameKey: 'Flowering', duration: '50-60 Days', startDay: 50, icon: '🌼', thumb: 'https://images.unsplash.com/photo-1460500063983-994d4c27756c?auto=format&fit=crop&q=80&w=200', description: 'Yellow bloom.', tasks: ['Aphid Watch'] },
      { id: '4', nameKey: 'Pod Fill', duration: '80-100 Days', startDay: 80, icon: '🌾', thumb: 'https://images.unsplash.com/photo-1473215260273-df2fb7072a2a?auto=format&fit=crop&q=80&w=200', description: 'Siliqua formation.', tasks: ['Irrigation Stop'] }
    ],
    tasks: [
      { dayOffset: 0, title: 'Sowing', description: 'Line sowing is preferred.', quantity: '2kg/acre', category: 'harvest' },
      { dayOffset: 25, title: 'Thinning', description: 'Maintain plant population.', quantity: '15cm gap', category: 'harvest' },
      { dayOffset: 35, title: 'First Irrigation', description: 'Before flowering starts.', quantity: 'Moderate', category: 'irrigation' },
      { dayOffset: 55, title: 'Aphid Control', description: 'Spray if infestation seen.', quantity: 'Dimethoate', category: 'pesticide' }
    ]
  },
  'Maize': {
    duration: 110,
    stages: [
      { id: '1', nameKey: 'Sowing', duration: '5 Days', startDay: 0, icon: '🌽', thumb: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&q=80&w=200', description: 'Seed planting.', tasks: [] },
      { id: '2', nameKey: 'Knee High', duration: '30-40 Days', startDay: 35, icon: '🌿', thumb: 'https://images.unsplash.com/photo-1622115277334-a2928c049b43?auto=format&fit=crop&q=80&w=200', description: 'Rapid growth.', tasks: ['Top Dressing'] },
      { id: '3', nameKey: 'Tasseling', duration: '55-65 Days', startDay: 60, icon: '🌾', thumb: 'https://images.unsplash.com/photo-1614266395982-d82054238779?auto=format&fit=crop&q=80&w=200', description: 'Male flower emergence.', tasks: ['Irrigation'] },
      { id: '4', nameKey: 'Harvest', duration: '100+ Days', startDay: 100, icon: '🌽', thumb: 'https://images.unsplash.com/photo-1597816760432-6a8dd2df74b2?auto=format&fit=crop&q=80&w=200', description: 'Cob maturity.', tasks: ['Harvest'] }
    ],
    tasks: [
      { dayOffset: 0, title: 'Sowing', description: 'Ridge and furrow method.', quantity: '8kg/acre', category: 'harvest' },
      { dayOffset: 20, title: 'Fall Armyworm Check', description: 'Check whorls for larva.', quantity: 'Visual', category: 'pesticide' },
      { dayOffset: 30, title: 'Urea Application', description: 'Knee high stage.', quantity: '30kg/acre', category: 'fertilizer' },
      { dayOffset: 60, title: 'Critical Irrigation', description: 'Silking/Tasseling stage.', quantity: 'High', category: 'irrigation' }
    ]
  }
};

// Fallback for unknown crops
const DEFAULT_PLAN = CROP_TEMPLATES['Wheat'];

const CropPlan: React.FC<CropPlanProps> = ({ onNotify, activeCrop, lang = 'en', profile }) => {
  const [view, setView] = useState<'overview' | 'calendar' | 'tasks'>('overview');
  const [taskView, setTaskView] = useState<'today' | 'history'>('today');
  const [stages, setStages] = useState<(CropStage & { thumb: string })[]>([]);
  const [tasks, setTasks] = useState<FarmTask[]>([]);
  const [calDate, setCalDate] = useState(new Date());
  const [selectedCalDate, setSelectedCalDate] = useState<Date | null>(new Date());
  
  const t = translations[lang] || translations['en'];

  useEffect(() => {
    if (!activeCrop) return;

    const storageKey = `plan_tasks_${activeCrop}`;
    const savedTasks = storage.get<FarmTask[]>(storageKey);
    const template = CROP_TEMPLATES[activeCrop] || DEFAULT_PLAN;
    
    const generatedStages = template.stages.map(s => {
        const isCompleted = s.startDay < 0; 
        const isActive = s.startDay === 0 || (s.startDay <= 10 && s.startDay >= 0); 
        return {
            ...s,
            name: s.nameKey, 
            progress: isActive ? 10 : isCompleted ? 100 : 0,
            status: isCompleted ? 'completed' : isActive ? 'active' : 'upcoming',
        } as (CropStage & { thumb: string });
    });
    setStages(generatedStages);

    if (savedTasks && savedTasks.length > 0) {
        setTasks(savedTasks);
    } else {
        const generatedTasks = template.tasks.map((task, index) => {
            const dateStr = getDate(task.dayOffset);
            let status = TaskStatus.PENDING;
            if (task.dayOffset < 0) status = Math.random() > 0.4 ? TaskStatus.COMPLETED : TaskStatus.MISSED;
            else if (task.dayOffset === 0) status = TaskStatus.PENDING;
            else status = TaskStatus.UPCOMING;
            
            return {
                id: `gen_${index}`,
                title: task.title,
                description: task.description,
                quantitySuggestion: task.quantity,
                status: status,
                date: dateStr,
                category: task.category
            };
        });
        setTasks(generatedTasks);
    }
  }, [activeCrop]);

  useEffect(() => {
    if (activeCrop && tasks.length > 0) {
        storage.save(`plan_tasks_${activeCrop}`, tasks);
    }
  }, [tasks, activeCrop]);

  const getFertilizerAdvice = () => {
    if (!activeCrop || !stages.length) return null;
    const activeStage = stages.find(s => s.status === 'active') || stages[0];
    const soil = profile?.soil;
    let advice = "";
    let highlights = [];

    if (activeStage.name.toLowerCase().includes('sowing') || activeStage.name.toLowerCase().includes('nursery')) {
      advice = "Apply 50% Nitrogen and 100% Phosphorus/Potassium as basal dose.";
    } else if (activeStage.name.toLowerCase().includes('root') || activeStage.name.toLowerCase().includes('tillering')) {
      advice = "Critical growth stage: High Nitrogen demand. Top-dress with Urea.";
    } else {
      advice = "Focus on micronutrients (Zinc/Boron) to improve grain/fruit quality.";
    }

    if (soil) {
      const n = parseInt(soil.n);
      const p = parseInt(soil.p);
      const k = parseInt(soil.k);
      if (n < 280) highlights.push("Low N: Increase Urea by 15-20kg/acre.");
      if (p < 12) highlights.push("Low P: Use DAP (Di-Ammonium Phosphate).");
      if (k < 140) highlights.push("Low K: Supplement with MOP.");
    } else {
        highlights.push("No soil data available. Using regional averages.");
    }
    return { advice, highlights };
  };

  const fertilizerAdvisory = getFertilizerAdvice();

  if (!activeCrop) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <div className="w-24 h-24 bg-neutral-50 rounded-full flex items-center justify-center mb-6 border-2 border-dashed border-neutral-200">
          <span className="text-4xl opacity-40">🗓️</span>
        </div>
        <h3 className="text-xl font-bold text-neutral-800 mb-2">{t.plan.no_plan_title}</h3>
        <p className="text-sm text-neutral-500 max-w-[240px] leading-relaxed">
          {t.plan.no_plan_desc}
        </p>
      </div>
    );
  }

  const handleTaskAction = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    if (newStatus === TaskStatus.COMPLETED) {
      onNotify({ type: 'system', title: 'Task Done', message: 'Task marked as completed. Progress updated!' });
    }
  };

  const renderTodayTasks = () => {
    const todayTasks = tasks.filter(t => t.status === TaskStatus.PENDING || t.status === TaskStatus.REMIND);
    if (todayTasks.length === 0) {
      return (
        <div className="text-center py-12 bg-white rounded-[32px] border border-neutral-100">
          <p className="text-neutral-400 font-bold">All tasks finished for today! 🎉</p>
          <button onClick={() => setTaskView('history')} className="text-primary-600 text-xs font-black uppercase mt-4 tracking-widest">{t.plan.view_history || "View History"}</button>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {todayTasks.map(task => (
          <div key={task.id} className="bg-white rounded-[32px] border border-neutral-100 p-6 shadow-sm space-y-4 animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${task.status === TaskStatus.REMIND ? 'bg-warning-500' : 'bg-blue-500'}`}></div>
                  <h4 className="font-black text-neutral-900">{task.title}</h4>
                </div>
                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{task.category}</p>
              </div>
              <div className="bg-neutral-50 px-3 py-1 rounded-xl">
                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">{t.plan.quantity}</p>
                <p className="text-xs font-black text-primary-600">{task.quantitySuggestion}</p>
              </div>
            </div>
            <p className="text-sm text-neutral-500 font-medium leading-relaxed">{task.description}</p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => handleTaskAction(task.id, TaskStatus.COMPLETED)} className="flex-1 py-5 bg-neutral-900 text-white rounded-[28px] font-black text-lg shadow-xl active:scale-[0.98] transition-all">{t.plan.mark_done}</button>
              <button onClick={() => handleTaskAction(task.id, TaskStatus.REMIND)} className="flex-1 py-5 border-2 border-neutral-100 text-neutral-500 rounded-[28px] font-black text-lg active:scale-95 transition-all">{t.plan.remind_later}</button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTaskHistory = () => {
    const historyTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.MISSED);
    if (historyTasks.length === 0) return <div className="text-center py-12"><p className="text-neutral-400 font-bold text-sm">No history yet.</p></div>;
    return (
      <div className="space-y-3">
        {historyTasks.map(task => (
          <div key={task.id} className={`rounded-2xl border p-4 flex items-center justify-between ${task.status === TaskStatus.MISSED ? 'bg-alert-50 border-alert-100' : 'bg-white border-neutral-50'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.status === TaskStatus.COMPLETED ? 'bg-primary-50 text-primary-600' : 'bg-alert-100 text-alert-600'}`}>
                {task.status === TaskStatus.COMPLETED ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg> : <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>}
              </div>
              <div>
                <h4 className={`text-sm font-black ${task.status === TaskStatus.MISSED ? 'text-alert-900' : 'text-neutral-800'}`}>{task.title}</h4>
                <p className={`text-[10px] font-bold uppercase ${task.status === TaskStatus.MISSED ? 'text-alert-400' : 'text-neutral-400'}`}>{task.date}</p>
              </div>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${task.status === TaskStatus.COMPLETED ? 'bg-primary-100 text-primary-700' : 'bg-alert-200 text-alert-700'}`}>{task.status}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCalendar = () => {
    const year = calDate.getFullYear();
    const month = calDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthName = calDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });
    const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getTasksForDate = (date: Date) => {
      const dateStr = date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
      return tasks.filter(t => t.date === dateStr);
    };

    const nextMonth = () => setCalDate(new Date(year, month + 1, 1));
    const prevMonth = () => setCalDate(new Date(year, month - 1, 1));

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="h-14"></div>);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(year, month, d);
      const dayTasks = getTasksForDate(dateObj);
      const isSelected = selectedCalDate?.toDateString() === dateObj.toDateString();
      const isToday = new Date().toDateString() === dateObj.toDateString();

      days.push(
        <button
          key={d}
          onClick={() => setSelectedCalDate(dateObj)}
          className={`relative h-14 w-full flex flex-col items-center justify-center rounded-2xl transition-all active:scale-90 
            ${isSelected ? 'bg-primary-500 text-white shadow-lg shadow-primary-200 scale-105 z-10' : isToday ? 'bg-neutral-100 text-neutral-900 font-black ring-2 ring-primary-500 ring-inset' : 'bg-white text-neutral-600 hover:bg-neutral-50'}`}
        >
          <span className="text-sm font-black">{d}</span>
          <div className="flex gap-0.5 mt-1">
            {dayTasks.map((t, idx) => (
              <div key={idx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : t.category === 'irrigation' ? 'bg-blue-500' : t.category === 'fertilizer' ? 'bg-primary-500' : t.category === 'pesticide' ? 'bg-alert-500' : 'bg-warning-500'}`}></div>
            ))}
          </div>
        </button>
      );
    }

    const selectedTasks = selectedCalDate ? getTasksForDate(selectedCalDate) : [];

    return (
      <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
        <div className="bg-white rounded-[40px] p-6 border border-neutral-100 shadow-xl shadow-neutral-200/40">
          <div className="flex items-center justify-between mb-8 px-2">
            <h3 className="text-lg font-black text-neutral-900">{monthName}</h3>
            <div className="flex gap-2">
              <button onClick={prevMonth} className="p-2.5 bg-neutral-50 rounded-xl text-neutral-400 hover:text-neutral-600 active:scale-95 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg></button>
              <button onClick={nextMonth} className="p-2.5 bg-neutral-50 rounded-xl text-neutral-400 hover:text-neutral-600 active:scale-95 transition-all"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-4">
            {dayLabels.map(l => <div key={l} className="text-[10px] font-black text-neutral-300 uppercase text-center tracking-widest">{l}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Activities for {selectedCalDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</h4>
            <span className="text-[9px] font-bold text-primary-600 uppercase bg-primary-50 px-2 py-0.5 rounded-md">{selectedTasks.length} {selectedTasks.length === 1 ? 'Task' : 'Tasks'}</span>
          </div>
          {selectedTasks.length > 0 ? (
            <div className="space-y-3">
              {selectedTasks.map(t => (
                <div key={t.id} className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex items-center gap-4 animate-in slide-in-from-bottom-2">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner
                    ${t.category === 'irrigation' ? 'bg-blue-50 text-blue-500' : t.category === 'fertilizer' ? 'bg-primary-50 text-primary-500' : t.category === 'pesticide' ? 'bg-alert-50 text-alert-500' : 'bg-warning-50 text-warning-500'}`}>
                    {t.category === 'irrigation' ? '💧' : t.category === 'fertilizer' ? '🧪' : t.category === 'pesticide' ? '🛡️' : '🌾'}
                  </div>
                  <div className="flex-1">
                    <h5 className="font-black text-neutral-900 text-sm">{t.title}</h5>
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">{t.category} • {t.quantitySuggestion}</p>
                  </div>
                  <button onClick={() => setView('tasks')} className="p-2 text-neutral-300"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-50 rounded-[32px] border border-dashed border-neutral-200">
               <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest">No activities scheduled</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const activeStage = stages.find(s => s.status === 'active') || stages[0];
  const template = CROP_TEMPLATES[activeCrop] || DEFAULT_PLAN;

  return (
    <div className="space-y-6 py-4 pb-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <div>
          <h2 className="text-4xl font-black text-neutral-900 tracking-tight leading-none mb-1">{activeCrop}</h2>
          <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em]">{template.duration} {t.plan.days} Full Cycle</p>
        </div>
        <div className="flex bg-neutral-100 p-1.5 rounded-3xl mx-2 shadow-inner border border-neutral-200/50">
          <button onClick={() => setView('overview')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${view === 'overview' ? 'bg-white text-primary-600 shadow-lg shadow-neutral-200/50 scale-[1.02]' : 'text-neutral-500 hover:text-neutral-700'}`}>{t.plan.tabs.overview}</button>
          <button onClick={() => setView('calendar')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${view === 'calendar' ? 'bg-white text-primary-600 shadow-lg shadow-neutral-200/50 scale-[1.02]' : 'text-neutral-500 hover:text-neutral-700'}`}>{t.plan.tabs.calendar}</button>
          <button onClick={() => setView('tasks')} className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all ${view === 'tasks' ? 'bg-white text-primary-600 shadow-lg shadow-neutral-200/50 scale-[1.02]' : 'text-neutral-500 hover:text-neutral-700'}`}>{t.plan.tabs.tasks}</button>
        </div>
      </div>

      {view === 'overview' ? (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
          <div className="bg-white rounded-[40px] p-8 border border-neutral-100 shadow-2xl shadow-neutral-200/40 space-y-8">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Est. Harvest Window</p>
                    <h3 className="text-2xl font-black text-neutral-900 leading-tight">{getLongDate(template.duration - 5)}</h3>
                </div>
                <div className="w-12 h-12 bg-primary-50 rounded-2xl flex items-center justify-center text-2xl shadow-inner">🏁</div>
            </div>
            <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Growth Journey</p>
                    <span className="text-[10px] font-black text-primary-600 uppercase tracking-widest bg-primary-50 px-2 py-0.5 rounded-md">Healthy Crop</span>
                </div>
                <div className="relative h-12 flex items-center">
                    <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-1.5 bg-neutral-100 rounded-full w-full"></div>
                    <div className="absolute inset-0 top-1/2 -translate-y-1/2 h-1.5 bg-primary-500 rounded-full w-[5%] shadow-[0_0_10px_rgba(16,185,129,0.3)]"></div>
                    <div className="relative w-full flex justify-between">
                        {template.stages.map((s, idx) => (
                            <div key={s.id} className="relative flex flex-col items-center">
                                <div className={`w-8 h-8 rounded-full border-4 border-white shadow-md flex items-center justify-center transition-all duration-700 ${idx === 0 ? 'bg-primary-500 scale-110' : 'bg-neutral-200'}`}><span className="text-xs">{s.icon}</span></div>
                                <span className={`absolute -bottom-6 text-[8px] font-black uppercase tracking-tighter whitespace-nowrap ${idx === 0 ? 'text-primary-700' : 'text-neutral-400'}`}>{s.nameKey}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-neutral-50/80 p-5 rounded-[28px] border border-neutral-100"><p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">Days Passed</p><p className="text-2xl font-black text-neutral-900">5 <span className="text-[10px] font-bold text-neutral-400">of {template.duration}</span></p></div>
              <div className="bg-neutral-50/80 p-5 rounded-[28px] border border-neutral-100"><p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">Yield Factor</p><p className="text-2xl font-black text-primary-600">92% <span className="text-[10px] font-bold text-neutral-400 uppercase">Optimal</span></p></div>
            </div>
          </div>
          {fertilizerAdvisory && (
            <div className="bg-warning-50 border-2 border-warning-100/50 rounded-[40px] p-8 shadow-sm relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-warning-200/20 blur-3xl rounded-full group-hover:scale-125 transition-transform duration-1000"></div>
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-warning-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-warning-200/50"><svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg></div>
                    <h4 className="text-xs font-black text-warning-800 uppercase tracking-[0.15em]">Fertilizer Advisory</h4>
                </div>
                <p className="text-lg font-black text-warning-900 leading-tight mb-5">{fertilizerAdvisory.advice}</p>
                <div className="space-y-3">{fertilizerAdvisory.highlights.map((h, i) => (<div key={i} className="flex items-start gap-3 bg-white/60 p-4 rounded-2xl border border-warning-200/30"><span className="text-warning-600 text-lg mt-0.5">•</span><p className="text-sm font-bold text-warning-800 leading-relaxed">{h}</p></div>))}</div>
            </div>
          )}
          <div className="p-8 bg-primary-600 rounded-[40px] text-white shadow-2xl shadow-primary-200 flex items-center gap-6 group active:scale-[0.98] transition-all">
            <div className="relative"><img src={activeStage?.thumb} className="w-20 h-20 rounded-[28px] object-cover border-4 border-white/20 shadow-2xl group-hover:scale-105 transition-transform" alt="Active" /><span className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-lg"><span className="flex h-3 w-3 rounded-full bg-primary-500 animate-pulse"></span></span></div>
            <div className="flex-1"><p className="text-[10px] font-black text-primary-100 uppercase tracking-widest mb-1 opacity-80">{t.plan.growth_stage}</p><h3 className="font-black text-2xl leading-none">{activeStage?.name || 'Sowing'}</h3><p className="text-xs text-primary-100/90 font-medium mt-1.5 line-clamp-2">{activeStage?.description}</p></div>
          </div>
          <button onClick={() => setView('tasks')} className="w-full p-8 bg-neutral-900 rounded-[40px] text-white flex items-center justify-between shadow-2xl shadow-neutral-900/20 active:scale-[0.98] transition-all"><div className="flex items-center gap-5"><div className="w-14 h-14 bg-primary-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary-500/20"><svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg></div><div className="text-left"><h4 className="font-black text-lg">{tasks.filter(t => t.status === TaskStatus.PENDING).length} {t.plan.pending_tasks}</h4><p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-0.5">Next: {tasks.find(t => t.status === TaskStatus.PENDING)?.title || 'All caught up'}</p></div></div><svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg></button>
        </div>
      ) : view === 'calendar' ? (
        renderCalendar()
      ) : (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="flex bg-neutral-100 p-1.5 rounded-2xl mx-1 shadow-inner"><button onClick={() => setTaskView('today')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${taskView === 'today' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}>{t.plan.today}</button><button onClick={() => setTaskView('history')} className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${taskView === 'history' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}>{t.plan.history}</button></div>
          {taskView === 'today' ? renderTodayTasks() : renderTaskHistory()}
        </div>
      )}
    </div>
  );
};

export default CropPlan;
