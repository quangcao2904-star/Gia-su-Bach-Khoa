import React, { useState } from 'react';
import { Subject, SubjectGroups, Theme, User } from '../types';

const Sidebar: React.FC<any> = ({ activeSubject, onSelectSubject, isOpen, onToggle, theme, onOpenSettings, onOpenGuide, user, onLogout, onClearHistory, onOpenMaterials }) => {
  const isDark = theme === 'dark';
  const [expandedGroup, setExpandedGroup] = useState<string | null>(Object.keys(SubjectGroups)[0]);

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-[45] md:hidden" onClick={onToggle} />}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r transition-transform md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg">BK</div>
              <h1 className="font-bold text-lg italic">Gia Sư BK</h1>
            </div>
            <button onClick={onToggle} className="md:hidden">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {Object.entries(SubjectGroups).map(([group, subjects]) => (
              <div key={group}>
                <button onClick={() => setExpandedGroup(expandedGroup === group ? null : group)} className="w-full flex justify-between p-3 text-[10px] font-black uppercase text-red-600">
                  {group} <span>{expandedGroup === group ? '−' : '+'}</span>
                </button>
                {expandedGroup === group && subjects.map(sub => (
                  <button key={sub} onClick={() => onSelectSubject(sub)} className={`w-full text-left p-3 rounded-xl text-xs font-bold transition-all ${activeSubject === sub ? 'bg-red-50 text-red-700 dark:bg-red-600/10' : 'hover:bg-slate-100 dark:hover:bg-slate-900 opacity-60'}`}>
                    {sub}
                  </button>
                ))}
              </div>
            ))}
          </div>
          <div className="p-4 border-t space-y-2">
            <button onClick={onOpenSettings} className="w-full p-3 text-[10px] font-black uppercase border rounded-xl">⚙️ Cài đặt</button>
            <button onClick={onLogout} className="w-full p-3 text-[10px] font-black uppercase border border-red-100 text-red-500 rounded-xl">🚪 Đăng xuất</button>
            <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl">
              <img src={user.avatar} className="w-8 h-8 rounded-full" alt="u" />
              <div className="text-[10px] font-black uppercase">{user.username}</div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
