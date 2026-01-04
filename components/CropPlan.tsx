
import React, { useState, useEffect } from 'react';
import { CropStage, FarmTask, TaskStatus } from '../types';
import { translations } from '../translations';
import { storage } from '../utils/storage';

interface CropPlanProps {
  onNotify: (notif: { type: any; title: string; message: string }) => void;
  activeCrop: string | null;
  lang?: string;
}

// Helper to format date relative to today
const getDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
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

const CropPlan: React.FC<CropPlanProps> = ({ onNotify, activeCrop, lang = 'en' }) => {
  const [view, setView] = useState<'overview' | 'calendar' | 'tasks'>('overview');
  const [taskView, setTaskView] = useState<'today' | 'history'>('today');
  const [stages, setStages] = useState<(CropStage & { thumb: string })[]>([]);
  const [tasks, setTasks] = useState<FarmTask[]>([]);
  const t = translations[lang] || translations['en'];

  useEffect(() => {
    if (!activeCrop) return;

    // Load tasks from offline storage if available
    const storageKey = `plan_tasks_${activeCrop}`;
    const savedTasks = storage.get<FarmTask[]>(storageKey);

    const template = CROP_TEMPLATES[activeCrop] || DEFAULT_PLAN;
    
    // 1. Generate Stages
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

    // 2. Load Tasks (Stored vs Generated)
    if (savedTasks && savedTasks.length > 0) {
        setTasks(savedTasks);
    } else {
        const generatedTasks = template.tasks.map((task, index) => {
            const dateStr = getDate(task.dayOffset);
            let status = TaskStatus.PENDING;
            
            if (task.dayOffset < 0) {
                 status = Math.random() > 0.4 ? TaskStatus.COMPLETED : TaskStatus.MISSED;
            } else if (task.dayOffset === 0) {
                 status = TaskStatus.PENDING;
            } else {
                 status = TaskStatus.UPCOMING;
            }
            
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

  // Save tasks to offline storage whenever they change
  useEffect(() => {
    if (activeCrop && tasks.length > 0) {
        storage.save(`plan_tasks_${activeCrop}`, tasks);
    }
  }, [tasks, activeCrop]);

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
              <button 
                onClick={() => handleTaskAction(task.id, TaskStatus.COMPLETED)}
                className="flex-1 py-5 bg-neutral-900 text-white rounded-[28px] font-black text-lg shadow-xl active:scale-[0.98] transition-all"
              >
                {t.plan.mark_done}
              </button>
              <button 
                onClick={() => handleTaskAction(task.id, TaskStatus.REMIND)}
                className="flex-1 py-5 border-2 border-neutral-100 text-neutral-500 rounded-[28px] font-black text-lg active:scale-95 transition-all"
              >
                {t.plan.remind_later}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderTaskHistory = () => {
    const historyTasks = tasks.filter(t => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.MISSED);

    if (historyTasks.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-400 font-bold text-sm">No history yet.</p>
            </div>
        )
    }

    return (
      <div className="space-y-3">
        {historyTasks.map(task => (
          <div key={task.id} className={`rounded-2xl border p-4 flex items-center justify-between ${task.status === TaskStatus.MISSED ? 'bg-alert-50 border-alert-100' : 'bg-white border-neutral-50'}`}>
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${task.status === TaskStatus.COMPLETED ? 'bg-primary-50 text-primary-600' : 'bg-alert-100 text-alert-600'}`}>
                {task.status === TaskStatus.COMPLETED ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                )}
              </div>
              <div>
                <h4 className={`text-sm font-black ${task.status === TaskStatus.MISSED ? 'text-alert-900' : 'text-neutral-800'}`}>{task.title}</h4>
                <p className={`text-[10px] font-bold uppercase ${task.status === TaskStatus.MISSED ? 'text-alert-400' : 'text-neutral-400'}`}>{task.date}</p>
              </div>
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${task.status === TaskStatus.COMPLETED ? 'bg-primary-100 text-primary-700' : 'bg-alert-200 text-alert-700'}`}>
              {task.status}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const activeStage = stages.find(s => s.status === 'active') || stages[0];
  const template = CROP_TEMPLATES[activeCrop] || DEFAULT_PLAN;

  return (
    <div className="space-y-6 py-4 pb-12 animate-in fade-in duration-500">
      <div className="text-center space-y-5">
        <div>
          <h2 className="text-3xl font-black text-neutral-900 tracking-tight">{activeCrop}</h2>
          <p className="text-xs text-neutral-400 font-black uppercase tracking-[0.2em]">{template.duration} {t.plan.days} Full Cycle</p>
        </div>

        <div className="flex bg-neutral-100 p-1.5 rounded-2xl mx-2">
          <button 
            onClick={() => setView('overview')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${view === 'overview' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
          >
            {t.plan.tabs.overview}
          </button>
          <button 
            onClick={() => setView('calendar')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${view === 'calendar' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
          >
            {t.plan.tabs.calendar}
          </button>
          <button 
            onClick={() => setView('tasks')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${view === 'tasks' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
          >
            {t.plan.tabs.tasks}
          </button>
        </div>
      </div>

      {view === 'overview' ? (
        <div className="space-y-6 animate-in slide-in-from-left-4 duration-500">
          <div className="bg-white rounded-[32px] p-8 border border-neutral-100 shadow-xl shadow-neutral-200/40 relative overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&q=80&w=400" 
              className="absolute inset-0 w-full h-full object-cover opacity-[0.03] scale-150"
              alt="bg"
            />
            <div className="relative z-10 flex flex-col items-center gap-8">
              <div className="relative w-44 h-44">
                <svg className="w-full h-full -rotate-90">
                  <circle cx="88" cy="88" r="78" fill="none" stroke="#f1f5f9" strokeWidth="12" />
                  <circle 
                    cx="88" cy="88" r="78" 
                    fill="none" stroke="#10b981" 
                    strokeWidth="12"
                    strokeDasharray="490"
                    strokeDashoffset={490 - (490 * 0.05)} // Assuming 5% progress for new plan
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-5xl font-black text-neutral-900">5%</span>
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t.plan.complete}</span>
                </div>
              </div>

              <div className="w-full grid grid-cols-2 gap-4">
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t.plan.elapsed}</p>
                  <p className="text-xl font-black text-neutral-800">5 <span className="text-xs font-bold text-neutral-400">{t.plan.days}</span></p>
                </div>
                <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{t.plan.remaining}</p>
                  <p className="text-xl font-black text-neutral-800">{template.duration - 5} <span className="text-xs font-bold text-neutral-400">{t.plan.days}</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-primary-600 rounded-[32px] text-white shadow-xl shadow-primary-200 flex items-center gap-5">
            <img 
              src={activeStage?.thumb} 
              className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
              alt="Active"
            />
            <div>
              <h3 className="font-black text-lg">{activeStage?.name || 'Sowing'}</h3>
              <p className="text-xs text-primary-100/90 font-medium">{activeStage?.description}</p>
            </div>
          </div>
          
          <button 
            onClick={() => setView('tasks')}
            className="w-full p-6 bg-neutral-900 rounded-[32px] text-white flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
              </div>
              <div className="text-left">
                <h4 className="font-black text-sm">{tasks.filter(t => t.status === TaskStatus.PENDING).length} {t.plan.pending_tasks}</h4>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest">Next: {tasks.find(t => t.status === TaskStatus.PENDING)?.title || 'Check status'}</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>
      ) : view === 'calendar' ? (
        <div className="px-1 space-y-6 animate-in slide-in-from-right-4 duration-500">
          <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-2">{t.plan.roadmap}</h3>
          <div className="relative pl-8 space-y-10">
            <div className="absolute left-8 top-8 bottom-8 w-1 bg-neutral-100 -translate-x-1/2 rounded-full"></div>
            
            {stages.map((stage, idx) => (
              <div key={stage.id} className="relative">
                <div className={`absolute left-0 top-0 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center -translate-x-1/2 z-10 shadow-lg transition-all
                  ${stage.status === 'completed' ? 'bg-primary-500' : stage.status === 'active' ? 'bg-primary-600 scale-125' : 'bg-neutral-200'}`}>
                  {stage.status === 'completed' ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  ) : (
                    <span className={`text-[11px] font-black ${stage.status === 'active' ? 'text-white' : 'text-neutral-400'}`}>{idx + 1}</span>
                  )}
                </div>

                <div className={`ml-10 rounded-[32px] overflow-hidden border transition-all ${stage.status === 'active' ? 'bg-white border-primary-500 shadow-2xl shadow-primary-500/10' : 'bg-white border-neutral-100'}`}>
                  <div className="h-32 relative">
                    <img src={stage.thumb} className="w-full h-full object-cover" alt={stage.name} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-5">
                      <h4 className="font-black text-white text-lg">{stage.name}</h4>
                      <p className="text-[10px] font-black text-white/80 uppercase tracking-widest">{stage.duration}</p>
                    </div>
                  </div>
                  
                  <div className="p-5 space-y-4">
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">{stage.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {stage.tasks.map((task, i) => (
                        <span key={i} className="text-[9px] font-black px-3 py-1.5 bg-neutral-50 text-neutral-400 rounded-lg uppercase tracking-wider">
                          {task}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* TASK MANAGEMENT VIEW */
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
          <div className="flex bg-neutral-100 p-1.5 rounded-2xl mx-1 shadow-inner">
            <button 
              onClick={() => setTaskView('today')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${taskView === 'today' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
            >
              {t.plan.today}
            </button>
            <button 
              onClick={() => setTaskView('history')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${taskView === 'history' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
            >
              {t.plan.history}
            </button>
          </div>

          {taskView === 'today' ? renderTodayTasks() : renderTaskHistory()}
        </div>
      )}
    </div>
  );
};

export default CropPlan;
