
import React from 'react';
import { AppNotification } from '../types';

interface NotificationsProps {
  notifications: AppNotification[];
  onMarkRead: () => void;
  onRemove: (id: string) => void;
  onClearAll: () => void;
}

// Fixed: Moved NotificationCard outside to resolve TypeScript "key" prop errors and improve performance
const NotificationCard: React.FC<{ notif: AppNotification; onRemove: (id: string) => void }> = ({ notif, onRemove }) => (
  <div 
    className={`group relative p-4 rounded-3xl border transition-all duration-300 animate-in slide-in-from-right-4 
      ${notif.read ? 'bg-white border-neutral-100' : 'bg-primary-50/50 border-primary-100 shadow-sm shadow-primary-50'}`}
  >
    <div className="flex gap-4">
      {/* Type Icon */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm 
        ${notif.type === 'like' ? 'bg-alert-100 text-alert-600' : 
          notif.type === 'comment' ? 'bg-blue-100 text-blue-600' : 
          notif.type === 'post' ? 'bg-warning-100 text-warning-600' : 
          'bg-primary-100 text-primary-600'}`}>
        {notif.type === 'like' && <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" /></svg>}
        {notif.type === 'comment' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>}
        {notif.type === 'post' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>}
        {notif.type === 'system' && <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
      </div>

      {/* Content */}
      <div className="flex-1 pr-6">
        <div className="flex justify-between items-start mb-1">
          <h4 className={`text-sm font-bold tracking-tight ${notif.read ? 'text-neutral-800' : 'text-neutral-900'}`}>{notif.title}</h4>
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider tabular-nums">
            {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${notif.read ? 'text-neutral-500' : 'text-neutral-700 font-medium'}`}>{notif.message}</p>
      </div>

      {/* Action Button (Delete) */}
      <button 
        onClick={() => onRemove(notif.id)}
        className="absolute top-4 right-4 text-neutral-300 hover:text-alert-500 transition-colors opacity-0 group-hover:opacity-100"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    {!notif.read && (
      <div className="absolute top-4 right-4 w-2 h-2 bg-primary-500 rounded-full group-hover:hidden"></div>
    )}
  </div>
);

const Notifications: React.FC<NotificationsProps> = ({ 
  notifications, 
  onMarkRead, 
  onRemove, 
  onClearAll 
}) => {
  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
  };

  const todayNotifs = notifications.filter(n => isToday(new Date(n.timestamp)));
  const earlierNotifs = notifications.filter(n => !isToday(new Date(n.timestamp)));

  return (
    <div className="space-y-6 py-4 pb-12">
      {/* Page Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">Notifications</h2>
          <p className="text-sm text-neutral-500">You have {notifications.filter(n => !n.read).length} unread updates.</p>
        </div>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <button 
              onClick={onClearAll}
              className="p-2 text-neutral-400 hover:text-alert-500 transition-colors"
              title="Clear All"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-700">
          <div className="w-20 h-20 bg-neutral-50 rounded-full flex items-center justify-center mb-6 border border-neutral-100">
            <svg className="w-10 h-10 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <h3 className="text-lg font-bold text-neutral-800 mb-1">Quiet Day!</h3>
          <p className="text-sm text-neutral-500 max-w-[200px]">No new updates for your farm right now.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {todayNotifs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] px-2">Today</h3>
              <div className="space-y-3">
                {/* Fixed: Passing key prop to properly typed component */}
                {todayNotifs.map(notif => (
                  <NotificationCard key={notif.id} notif={notif} onRemove={onRemove} />
                ))}
              </div>
            </div>
          )}

          {earlierNotifs.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold text-neutral-400 uppercase tracking-[0.2em] px-2">Earlier</h3>
              <div className="space-y-3">
                {/* Fixed: Passing key prop to properly typed component */}
                {earlierNotifs.map(notif => (
                  <NotificationCard key={notif.id} notif={notif} onRemove={onRemove} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Footer Info */}
      <div className="text-center py-6 border-t border-neutral-50 mt-8">
        <p className="text-[10px] font-bold text-neutral-300 uppercase tracking-widest">Auto-clears alerts after 30 days</p>
      </div>
    </div>
  );
};

export default Notifications;
