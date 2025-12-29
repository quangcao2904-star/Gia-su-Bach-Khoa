import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import SettingsModal from './components/SettingsModal';
import AuthModal from './components/AuthModal';
import MaterialsModal from './components/MaterialsModal';
import GuideModal from './components/GuideModal';
import { Subject, Theme, Message, SubjectConfig, User } from './types';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('bk_session');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('bk_admin_mode');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [activeSubject, setActiveSubject] = useState<Subject>(Subject.GT1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('bk_theme') as Theme) || 'light');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isMaterialsOpen, setIsMaterialsOpen] = useState(false);
  const [materialsSubject, setMaterialsSubject] = useState<Subject>(Subject.GT1);

  const getWelcomeMessage = (sub: Subject): Message => ({
    id: `w-${sub}-${Date.now()}`,
    role: 'model',
    text: `Chào mừng bạn. Tôi là Gia sư ${sub}. Bạn cần hỗ trợ kiến thức gì về học phần này?`,
    timestamp: Date.now()
  });

  const [subjectConfigs, setSubjectConfigs] = useState<Record<Subject, SubjectConfig>>(() => {
    const saved = localStorage.getItem('bk_configs');
    if (saved) return JSON.parse(saved);
    const configs: any = {};
    Object.values(Subject).forEach(sub => configs[sub] = { provider: 'gemini', modelId: 'gemini-3-pro-preview' });
    return configs;
  });

  const [chatSessions, setChatSessions] = useState<Record<Subject, Message[]>>(() => {
    const saved = localStorage.getItem('bk_chats');
    if (saved) return JSON.parse(saved);
    const initial: any = {};
    Object.values(Subject).forEach(sub => initial[sub] = [getWelcomeMessage(sub)]);
    return initial;
  });

  useEffect(() => localStorage.setItem('bk_configs', JSON.stringify(subjectConfigs)), [subjectConfigs]);
  useEffect(() => localStorage.setItem('bk_chats', JSON.stringify(chatSessions)), [chatSessions]);
  useEffect(() => localStorage.setItem('bk_theme', theme), [theme]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setIsAdminMode(user.role === 'admin');
    localStorage.setItem('bk_session', JSON.stringify(user));
    setIsGuideOpen(true);
  };

  const handleLogout = () => {
    if (window.confirm("Đăng xuất khỏi hệ thống?")) {
      setCurrentUser(null);
      localStorage.removeItem('bk_session');
    }
  };

  const handleClearHistory = (targetSubject?: Subject) => {
    const subToClear = targetSubject || activeSubject;
    setChatSessions(prev => ({ ...prev, [subToClear]: [getWelcomeMessage(subToClear)] }));
  };

  if (!currentUser) return <AuthModal onLogin={handleLogin} theme={theme} />;

  return (
    <div className={`flex h-screen overflow-hidden ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
      <Sidebar 
        activeSubject={activeSubject} onSelectSubject={setActiveSubject}
        isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        theme={theme} onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)} user={currentUser}
        onLogout={handleLogout} isAdminMode={isAdminMode}
        onToggleAdminMode={() => setIsAdminMode(!isAdminMode)}
        onClearHistory={handleClearHistory}
        onOpenMaterials={(sub) => { setMaterialsSubject(sub); setIsMaterialsOpen(true); }}
      />
      <main className="flex-1 flex flex-col relative w-full overflow-hidden">
        <ChatWindow 
          subject={activeSubject} theme={theme} messages={chatSessions[activeSubject]}
          config={subjectConfigs[activeSubject]}
          onUpdateMessages={(msgs) => setChatSessions(prev => ({ ...prev, [activeSubject]: msgs }))}
          onClearHistory={() => handleClearHistory()}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
      </main>
      <SettingsModal 
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} theme={theme}
        onThemeChange={setTheme} subjectConfigs={subjectConfigs}
        onUpdateConfig={(sub, cfg) => setSubjectConfigs(prev => ({ ...prev, [sub]: cfg }))}
        isAdmin={currentUser.role === 'admin' && isAdminMode}
      />
      <MaterialsModal isOpen={isMaterialsOpen} onClose={() => setIsMaterialsOpen(false)} subject={materialsSubject} theme={theme} />
      <GuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} theme={theme} />
    </div>
  );
};

export default App;
