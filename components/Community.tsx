
import React, { useState, useEffect, useRef } from 'react';
import { Post } from '../types';
import { translations } from '../translations';

const INITIAL_POSTS: (Post & { avatar: string, cropTags?: string[] })[] = [
  {
    id: '1',
    type: 'expert',
    author: 'Dr. Rajesh Patil',
    role: 'Agricultural Scientist',
    time: '2 hours ago',
    tag: 'Alert',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150',
    content: 'Heavy rainfall expected this week. All Wheat and Cotton farmers should ensure proper drainage immediately.',
    likes: 45,
    comments: 12,
    cropTags: ['Wheat', 'Cotton']
  },
  {
    id: '2',
    type: 'official',
    author: 'AgriSmart Admin',
    role: 'Official News',
    time: '5 hours ago',
    tag: 'Subsidy',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    content: 'New 50% subsidy for drip irrigation announced. Apply by Jan 15th via the Irrigation dashboard.',
    likes: 128,
    comments: 34,
    cropTags: ['All']
  },
  {
    id: '3',
    type: 'farmer',
    author: 'Suresh Kumar',
    role: 'Wheat Farmer',
    time: '1 day ago',
    tag: 'Question',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    content: 'Best time for urea application on 40-day wheat? Seeing some yellow tips lately.',
    likes: 8,
    comments: 15,
    cropTags: ['Wheat']
  }
];

const AI_INSIGHTS = [
  {
    tag: "Fertilizer Tip",
    content: "Urea absorption is highest when applied during late evening hours (18:00 - 20:00).",
    icon: "🧪"
  },
  {
    tag: "Market Alert",
    content: "Global demand for Basmati Rice is rising. Holding stock for 15 more days could yield 8% higher returns.",
    icon: "📈"
  },
  {
    tag: "Pest Warning",
    content: "High humidity alert! Monitor potato crops for late blight fungal signs. Early spray can save 30% yield.",
    icon: "🦠"
  },
  {
    tag: "Smart Irrigation",
    content: "Soil moisture levels in Hinjewadi are at 42%. Next scheduled irrigation can be reduced by 20% to save water.",
    icon: "💧"
  }
];

interface CommunityProps {
  onNotify: (notif: { type: any; title: string; message: string }) => void;
  lang?: string;
  activeCrop: string | null;
}

const Community: React.FC<CommunityProps> = ({ onNotify, lang = 'en', activeCrop }) => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [activeTab, setActiveTab] = useState<'advisory' | 'qa'>('advisory');
  const [insightIndex, setInsightIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  
  // Pull to Refresh State
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const PULL_THRESHOLD = 80;
  
  const t = translations[lang] || translations['en'];
  const groupName = activeCrop ? `${activeCrop} Farmers Group` : 'General Agri Hub';

  // AI Insight Rotation Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setInsightIndex((prev) => (prev + 1) % AI_INSIGHTS.length);
        setIsAnimating(false);
      }, 500);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Pull to Refresh Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only allow pull to refresh when at the top
    if (scrollContainerRef.current?.scrollTop === 0) {
      touchStartY.current = e.touches[0].clientY;
    } else {
      touchStartY.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === 0 || refreshing) return;
    
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    
    if (diff > 0) {
      // Resistance effect
      const distance = Math.min(diff * 0.4, PULL_THRESHOLD + 20);
      setPullDistance(distance);
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= PULL_THRESHOLD) {
      triggerRefresh();
    } else {
      setPullDistance(0);
    }
    touchStartY.current = 0;
  };

  const triggerRefresh = () => {
    setRefreshing(true);
    setPullDistance(60); // Hold at a specific distance during loading
    
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      setPullDistance(0);
      onNotify({
        type: 'system',
        title: 'Feed Updated',
        message: 'Checked for new advisories and questions.'
      });
    }, 1500);
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    const newPost: Post & { avatar: string, cropTags?: string[] } = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'farmer',
      author: 'You',
      role: activeCrop ? `${activeCrop} Farmer` : 'Farmer',
      time: 'Just now',
      tag: 'Question',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      content: newPostContent,
      likes: 0,
      comments: 0,
      cropTags: activeCrop ? [activeCrop] : ['General']
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setIsCreateModalOpen(false);
    onNotify({ type: 'system', title: 'Question Posted', message: 'Your query is now visible to other farmers.' });
  };

  const filteredPosts = posts.filter(p => {
    const isRelevant = !activeCrop || p.cropTags?.includes(activeCrop) || p.cropTags?.includes('All') || p.cropTags?.includes('General');
    if (!isRelevant) return false;
    return activeTab === 'advisory' ? (p.type === 'expert' || p.type === 'official') : (p.type === 'farmer');
  });

  return (
    <div 
      ref={scrollContainerRef}
      className="h-full overflow-y-auto no-scrollbar relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull to Refresh Indicator */}
      <div 
        className="absolute top-0 left-0 right-0 flex justify-center items-center overflow-hidden transition-all duration-300 pointer-events-none z-[60]"
        style={{ height: `${pullDistance}px`, opacity: pullDistance / PULL_THRESHOLD }}
      >
        <div className={`p-2 bg-white rounded-full shadow-lg border border-neutral-100 flex items-center justify-center ${refreshing ? 'animate-spin' : ''}`}>
          <svg className="w-5 h-5 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: `rotate(${pullDistance * 3}deg)` }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </div>
      </div>

      <div className="space-y-6 py-4 animate-in fade-in duration-500 pb-28">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-neutral-900 tracking-tight">{groupName}</h2>
          <p className="text-xs text-neutral-500 font-bold uppercase tracking-[0.15em]">{t.community.subtitle}</p>
        </div>

        {/* Dynamic AI Banner */}
        <div className="relative group mx-1">
          <div className="bg-neutral-900 rounded-[40px] p-8 text-white shadow-2xl shadow-neutral-900/40 overflow-hidden relative min-h-[180px] flex flex-col justify-center border border-white/5">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary-500/20 blur-[80px] rounded-full animate-pulse"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full"></div>
            
            <div className="relative z-10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-500/20 backdrop-blur-xl border border-primary-500/30 rounded-2xl flex items-center justify-center text-xl shadow-lg">
                    {AI_INSIGHTS[insightIndex].icon}
                  </div>
                  <div>
                    <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-primary-400">Gemini Live Insight</h4>
                    <div className="flex items-center gap-2">
                      <span className="flex h-1.5 w-1.5 rounded-full bg-primary-500 animate-ping"></span>
                      <span className={`text-[9px] font-black uppercase tracking-widest text-neutral-400 transition-all duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
                        {AI_INSIGHTS[insightIndex].tag}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {AI_INSIGHTS.map((_, i) => (
                    <div key={i} className={`h-1 rounded-full transition-all duration-500 ${i === insightIndex ? 'w-4 bg-primary-500' : 'w-1 bg-neutral-700'}`}></div>
                  ))}
                </div>
              </div>

              <p className={`text-base font-bold text-neutral-100 leading-relaxed transition-all duration-500 pr-4 ${isAnimating ? 'opacity-0 -translate-y-2' : 'opacity-100 translate-y-0'}`}>
                "{AI_INSIGHTS[insightIndex].content}"
              </p>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
                <div 
                  key={insightIndex}
                  className="h-full bg-primary-500/50 animate-progress"
                  style={{ animationDuration: '8s' }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-100 p-1.5 rounded-3xl shadow-inner mx-1 border border-neutral-200/50">
          <button 
            onClick={() => setActiveTab('advisory')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2
              ${activeTab === 'advisory' ? 'bg-white text-primary-600 shadow-lg shadow-neutral-200/50 scale-[1.02]' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            📢 {t.community.filters.advisory}
          </button>
          <button 
            onClick={() => setActiveTab('qa')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all flex items-center justify-center gap-2
              ${activeTab === 'qa' ? 'bg-white text-primary-600 shadow-lg shadow-neutral-200/50 scale-[1.02]' : 'text-neutral-500 hover:text-neutral-700'}`}
          >
            🙋‍♂️ {t.community.filters.questions}
          </button>
        </div>

        {/* Post Feed */}
        <div className="space-y-4">
          {filteredPosts.length === 0 ? (
            <div className="py-16 text-center animate-in fade-in duration-700">
              <div className="w-24 h-24 bg-white rounded-[32px] border border-neutral-100 shadow-sm flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl grayscale opacity-40">🚜</span>
              </div>
              <h3 className="text-lg font-black text-neutral-800">Quiet in the fields today</h3>
              <p className="text-sm text-neutral-400 font-medium max-w-[240px] mx-auto mt-1 leading-relaxed">
                No new posts in this channel. Check back later or ask a question to the community.
              </p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className={`rounded-[32px] p-6 transition-all animate-in slide-in-from-bottom-4 duration-500 shadow-sm relative overflow-hidden bg-white border border-neutral-100 group hover:shadow-xl hover:shadow-neutral-200/40
                ${activeTab === 'advisory' ? 'border-l-[6px] border-l-primary-500' : ''}`}>
                
                <div className="flex gap-4 mb-4">
                  <img src={post.avatar} className="w-12 h-12 rounded-2xl object-cover shadow-sm border border-neutral-50" alt={post.author} />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-neutral-900 text-sm leading-tight flex items-center gap-1.5">
                          {post.author}
                          {activeTab === 'advisory' && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                              <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                            </div>
                          )}
                        </h4>
                        <p className="text-[10px] text-neutral-400 font-black uppercase tracking-wider">{post.role}</p>
                      </div>
                      <span className="text-[10px] font-black text-neutral-300 uppercase">{post.time}</span>
                    </div>
                  </div>
                </div>

                <p className={`text-[15px] leading-relaxed ${activeTab === 'advisory' ? 'font-bold text-neutral-800' : 'text-neutral-600 font-medium'}`}>
                  {post.content}
                </p>

                {activeTab === 'qa' && (
                  <div className="flex items-center gap-4 mt-6 pt-4 border-t border-neutral-50">
                      <button className="text-[10px] font-black text-primary-600 uppercase tracking-[0.15em] bg-primary-50 px-4 py-2 rounded-xl active:scale-95 transition-all">Reply</button>
                      <div className="ml-auto flex items-center gap-1 text-neutral-300 hover:text-primary-500 cursor-pointer transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                        <span className="text-xs font-black">{post.likes}</span>
                      </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {activeTab === 'qa' && (
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-28 right-6 bg-neutral-900 text-white px-6 py-5 rounded-[28px] shadow-2xl flex items-center gap-3 active:scale-95 transition-all z-40 border border-white/10"
        >
          <span className="text-xs font-black uppercase tracking-[0.15em]">Ask Question</span>
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </button>
      )}

      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-neutral-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-t-[48px] p-10 pb-12 shadow-2xl animate-in slide-in-from-bottom-full duration-500">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">{t.community.modal.title}</h3>
                <p className="text-[10px] text-neutral-400 font-black uppercase tracking-[0.2em] mt-1">POSTING TO: {groupName}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-3 bg-neutral-100 rounded-full text-neutral-400 active:scale-90 transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest ml-1">{t.community.modal.label_msg}</label>
                <textarea 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={t.community.modal.placeholder}
                  className="w-full h-40 p-6 bg-neutral-50 border-none rounded-[32px] focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all outline-none text-base font-bold resize-none shadow-inner"
                />
              </div>

              <div className="p-5 bg-primary-50 rounded-3xl border border-primary-100 flex gap-4">
                 <div className="text-2xl">🤖</div>
                 <p className="text-xs font-bold text-primary-800 leading-relaxed italic">
                    "AI will automatically tag your post to help experts find it faster."
                 </p>
              </div>

              <button 
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className={`w-full py-5 rounded-[28px] font-black text-lg transition-all active:scale-[0.98] shadow-2xl flex items-center justify-center gap-3
                  ${newPostContent.trim() ? 'bg-neutral-900 text-white shadow-neutral-300' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
              >
                {t.community.modal.btn_publish}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress linear;
        }
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

export default Community;
