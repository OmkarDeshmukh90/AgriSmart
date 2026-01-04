
import React, { useState, useEffect } from 'react';
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
  },
  {
    id: '4',
    type: 'expert',
    author: 'Anita Deshmukh',
    role: 'Plant Pathologist',
    time: '3 hours ago',
    tag: 'Pest Control',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150',
    content: 'Yellowing in wheat tips could be initial signs of Rust. Recommend a preventive spray of Mancozeb.',
    likes: 22,
    comments: 4,
    cropTags: ['Wheat']
  },
  {
    id: '5',
    type: 'farmer',
    author: 'Vikram Singh',
    role: 'Rice Farmer',
    time: '6 hours ago',
    tag: 'Question',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    content: 'Is anyone else using the new organic pesticide from AgriSmart? Looking for feedback on effectiveness.',
    likes: 3,
    comments: 2,
    cropTags: ['Rice', 'General']
  }
];

const AI_INSIGHTS = [
  "Urea absorption is highest when applied during late evening hours (18:00 - 20:00).",
  "Drip irrigation subsidies closing in 5 days. Apply now for priority processing.",
  "High humidity alert! Monitor potato crops for late blight fungal signs.",
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
  const t = translations[lang] || translations['en'];
  
  // Create Post Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');

  // Determine Group Name
  const groupName = activeCrop ? `${activeCrop} Farmers Group` : 'General Agri Hub';

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setInsightIndex((prev) => (prev + 1) % AI_INSIGHTS.length);
        setIsAnimating(false);
      }, 500);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

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
    onNotify({
      type: 'system',
      title: 'Question Posted',
      message: 'Your query is now visible to other farmers.'
    });
  };

  // 1. Crop Filtering: Filter posts relevant to the active crop (or general)
  const relevantPosts = posts.filter(p => {
      if (!activeCrop) return true; // Show all if no crop selected
      return p.cropTags?.includes(activeCrop) || p.cropTags?.includes('All') || p.cropTags?.includes('General');
  });

  // 2. Tab Filtering: Strict Separation
  const filteredPosts = relevantPosts.filter(p => {
    if (activeTab === 'advisory') {
      return p.type === 'expert' || p.type === 'official';
    }
    if (activeTab === 'qa') {
      return p.type === 'farmer';
    }
    return true;
  });

  return (
    <div className="space-y-6 py-4 animate-in fade-in duration-500">
      <div className="text-center space-y-1">
        <h2 className="text-2xl font-black text-neutral-900">{groupName}</h2>
        <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">{t.community.subtitle}</p>
      </div>

      {/* Strict Tab Switcher */}
      <div className="flex bg-neutral-100 p-1.5 rounded-2xl shadow-inner mx-1">
        <button 
          onClick={() => setActiveTab('advisory')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2
            ${activeTab === 'advisory' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
        >
          <span>📢</span> {t.community.filters.advisory}
        </button>
        <button 
          onClick={() => setActiveTab('qa')}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2
            ${activeTab === 'qa' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500'}`}
        >
          <span>🙋‍♂️</span> {t.community.filters.questions}
        </button>
      </div>

      {/* Dynamic AI Banner (Visible in both, but styled) */}
      <div className="bg-neutral-900 rounded-[32px] p-6 text-white relative shadow-2xl overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-[60px] rounded-full group-hover:bg-primary-500/30 transition-all duration-700"></div>
        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/40">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h4 className="font-black text-[10px] uppercase tracking-widest text-primary-400">Daily Insight</h4>
          </div>
          <p className={`text-sm text-neutral-200 font-bold leading-relaxed transition-all duration-500 ${isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
            "{AI_INSIGHTS[insightIndex]}"
          </p>
        </div>
      </div>

      {/* Post Feed */}
      <div className="space-y-4 pb-20">
        {filteredPosts.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto border-2 border-dashed border-neutral-200">
              <span className="text-2xl opacity-30">📭</span>
            </div>
            <p className="text-neutral-400 font-bold text-sm">No updates in this channel yet.</p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <div key={post.id} className={`rounded-[28px] p-5 transition-all animate-in slide-in-from-bottom-4 duration-500 shadow-sm relative overflow-hidden
              ${activeTab === 'advisory' ? 'bg-white border-l-4 border-l-primary-500 border-y border-r border-neutral-100' : 'bg-white border border-neutral-100'}`}>
              
              <div className="flex gap-4 mb-3">
                <img src={post.avatar} className="w-10 h-10 rounded-xl object-cover shadow-sm" alt={post.author} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-black text-neutral-900 text-sm leading-tight flex items-center gap-1">
                        {post.author}
                        {activeTab === 'advisory' && <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>}
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-bold uppercase">{post.role}</p>
                    </div>
                    <span className="text-[9px] font-bold text-neutral-300">{post.time}</span>
                  </div>
                </div>
              </div>

              <p className={`text-sm leading-relaxed ${activeTab === 'advisory' ? 'font-bold text-neutral-800' : 'text-neutral-600 font-medium'}`}>
                {post.content}
              </p>

              {/* Interaction Bar - Simplified to reduce noise */}
              {activeTab === 'qa' && (
                 <div className="flex items-center gap-4 mt-4 pt-3 border-t border-neutral-50">
                    <button className="text-[10px] font-black text-neutral-400 uppercase tracking-widest hover:text-primary-600">Reply</button>
                    <div className="ml-auto flex items-center gap-1 text-neutral-300">
                       <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" /></svg>
                       <span className="text-[10px] font-bold">{post.likes}</span>
                    </div>
                 </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Floating Action Button - Only for Q&A */}
      {activeTab === 'qa' && (
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="fixed bottom-28 right-6 bg-neutral-900 text-white px-5 py-4 rounded-full shadow-2xl flex items-center gap-3 active:scale-95 transition-all z-40 hover:bg-neutral-800"
        >
          <span className="text-xs font-black uppercase tracking-widest">Ask Question</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {/* Create Post Modal / Drawer */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-neutral-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white rounded-t-[40px] p-8 pb-12 shadow-2xl animate-in slide-in-from-bottom-20 duration-500">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-black text-neutral-900">{t.community.modal.title}</h3>
                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Posting to: {groupName}</p>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 bg-neutral-100 rounded-full text-neutral-400 hover:text-neutral-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">{t.community.modal.label_msg}</label>
                <textarea 
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={t.community.modal.placeholder}
                  className="w-full h-32 p-4 bg-neutral-50 border-2 border-neutral-100 rounded-2xl focus:border-primary-500 focus:bg-white transition-all outline-none text-sm font-medium resize-none"
                />
              </div>

              <div className="bg-primary-50 p-4 rounded-2xl border border-primary-100 flex gap-3">
                 <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <p className="text-[10px] font-bold text-primary-800 leading-relaxed">
                    Text-only mode is active to keep the community fast and focused on farming advice.
                 </p>
              </div>

              <button 
                onClick={handleCreatePost}
                disabled={!newPostContent.trim()}
                className={`w-full py-5 rounded-[28px] font-black text-lg transition-all active:scale-[0.98] shadow-xl flex items-center justify-center gap-2
                  ${newPostContent.trim() ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'}`}
              >
                {t.community.modal.btn_publish}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Community;
