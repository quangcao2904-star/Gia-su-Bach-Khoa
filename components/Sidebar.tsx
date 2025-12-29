import React, { useState, useEffect } from 'react';
import { Subject, SubjectGroups, Theme, User } from '../types.ts';

interface SidebarProps {
  activeSubject: Subject;
  onSelectSubject: (subject: Subject) => void;
  isOpen: boolean;
  onToggle: () => void;
  theme: Theme;
  onOpenSettings: () => void;
  onOpenGuide: () => void;
  user: User;
  onLogout: () => void;
  isAdminMode: boolean;
  onToggleAdminMode: () => void;
  onClearHistory: (subject?: Subject) => void;
  onOpenMaterials: (subject: Subject) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeSubject, onSelectSubject, isOpen, onToggle, theme, onOpenSettings, onOpenGuide, user, onLogout, isAdminMode, onToggleAdminMode, onClearHistory, onOpenMaterials
}) => {
  const isDark = theme === 'dark';
  
  const getInitialGroup = () => {
    for (const [group, subjects] of Object.entries(SubjectGroups)) {
      if (subjects.includes(activeSubject)) return group;
    }
    return 'Toán - Tin';
  };

  const [expandedGroup, setExpandedGroup] = useState<string | null>(getInitialGroup());
  const [expandedSubject, setExpandedSubject] = useState<Subject | null>(activeSubject);

  useEffect(() => {
    const group = getInitialGroup();
    if (group !== expandedGroup) setExpandedGroup(group);
    setExpandedSubject(activeSubject);
  }, [activeSubject]);

  const toggleGroup = (groupName: string) => {
    setExpandedGroup(expandedGroup === groupName ? null : groupName);
  };

  const handleSubjectClick = (sub: Subject) => {
    // Nếu click vào môn đang mở thì đóng lại, nếu không thì mở môn mới và chọn môn đó
    if (expandedSubject === sub) {
      setExpandedSubject(null);
    } else {
      setExpandedSubject(sub);
      onSelectSubject(sub);
    }
  };

  const handleAction = (action: 'enter' | 'clear' | 'materials', sub: Subject) => {
    if (action === 'enter') {
      onSelectSubject(sub);
      if (window.innerWidth < 768) onToggle();
    } else if (action === 'materials') {
      onOpenMaterials(sub);
    } else {
      if (confirm(`Xóa toàn bộ lịch sử chat môn ${sub}?`)) {
        onClearHistory(sub);
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-[45] md:hidden" onClick={onToggle} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r transition-all duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'} ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="flex flex-col h-full">
          <div className={`p-6 border-b flex justify-between items-center ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-md">BK</div>
              <div>
                <h1 className={`font-bold text-lg italic ${isDark ? 'text-white' : 'text-slate-900'}`}>Gia Sư BK</h1>
                <p className="text-[8px] text-red-600 uppercase font-bold tracking-widest">HUST AI Tutor</p>
              </div>
            </div>
            <button onClick={onToggle} className="md:hidden p-2 text-slate-400 hover:text-red-600 transition-colors">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {Object.entries(SubjectGroups).map(([groupName, groupSubjects]) => {
              const isGroupExpanded = expandedGroup === groupName;
              
              return (
                <div key={groupName} className={`rounded-2xl transition-all duration-300 ${isGroupExpanded ? (isDark ? 'bg-slate-900/40' : 'bg-slate-50/50') : ''}`}>
                  <button 
                    onClick={() => toggleGroup(groupName)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${isGroupExpanded ? 'text-red-600' : (isDark ? 'text-slate-400 hover:bg-slate-900' : 'text-slate-500 hover:bg-slate-100')}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-1.5 h-1.5 rounded-full ${isGroupExpanded ? 'bg-red-600 animate-pulse' : 'bg-slate-400'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest">{groupName}</span>
                    </div>
                    <svg className={`w-3 h-3 transition-transform duration-300 ${isGroupExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                      <path d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div className={`overflow-hidden transition-all duration-300 ${isGroupExpanded ? 'max-h-[1000px] opacity-100 pb-2' : 'max-h-0 opacity-0'}`}>
                    <div className="px-2 space-y-1">
                      {groupSubjects.map((sub) => {
                        const isExpanded = expandedSubject === sub;
                        const isActive = activeSubject === sub;

                        return (
                          <div key={sub} className="space-y-1">
                            <button 
                              onClick={() => handleSubjectClick(sub)}
                              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${isActive ? (isDark ? 'bg-red-600/10 text-red-500' : 'bg-red-50 text-red-700 shadow-sm') : (isDark ? 'text-slate-400 hover:bg-slate-900' : 'text-slate-600 hover:bg-slate-100')}`}
                            >
                              <span className={`flex-1 text-left text-xs font-bold uppercase tracking-tight`}>{sub}</span>
                              <svg className={`w-2.5 h-2.5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                <path d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>

                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-40 opacity-100 mb-1' : 'max-h-0 opacity-0 pointer-events-none'}`}>
                              <div className="pl-6 pr-2 py-0.5 space-y-0.5 flex flex-col">
                                <button onClick={() => handleAction('enter', sub)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-white text-slate-500 hover:text-red-600'}`}>
                                  💬 Gia sư {sub}
                                </button>
                                <button onClick={() => handleAction('materials', sub)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-white text-slate-500 hover:text-red-600'}`}>
                                  📚 Tài liệu học tập
                                </button>
                                <button onClick={() => handleAction('clear', sub)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${isDark ? 'hover:bg-red-950/30 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-700'}`}>
                                  🗑️ Xóa lịch sử
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={`p-4 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <button onClick={onOpenSettings} className="py-2.5 rounded-xl text-[10px] font-black uppercase border dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">⚙️ Cài đặt</button>
              <button onClick={onOpenGuide} className="py-2.5 rounded-xl text-[10px] font-black uppercase border dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">❓ Trợ giúp</button>
            </div>
            
            <button onClick={onLogout} className="w-full mb-4 py-2.5 rounded-xl text-[10px] font-black uppercase border border-red-100 dark:border-red-900/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-all">🚪 Đăng xuất</button>
            
            <div className={`p-3 rounded-2xl border flex items-center gap-3 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
              <img src={user.avatar} className="w-8 h-8 rounded-full ring-2 ring-red-600/10" alt="avt" />
              <div className="min-w-0">
                <p className="text-[10px] font-black truncate uppercase dark:text-white">{user.username}</p>
                <p className="text-[7px] text-red-600 font-black uppercase tracking-tighter">{user.role}</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
