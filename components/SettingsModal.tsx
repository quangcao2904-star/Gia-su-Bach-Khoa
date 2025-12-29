import React, { useState } from 'react';
import { Theme, Subject, SubjectConfig, SubjectGroups } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  subjectConfigs: Record<Subject, SubjectConfig>;
  onUpdateConfig: (sub: Subject, cfg: SubjectConfig) => void;
  isAdmin: boolean;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, onClose, theme, onThemeChange, subjectConfigs, onUpdateConfig, isAdmin
}) => {
  const [activeTab, setActiveTab] = useState<Subject>(Subject.GT1);

  if (!isOpen) return null;

  const currentCfg = subjectConfigs[activeTab];

  const updatePart = (parts: Partial<SubjectConfig>) => {
    if (!isAdmin) return;
    onUpdateConfig(activeTab, { ...currentCfg, ...parts });
  };

  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay làm mờ nền */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      {/* Modal Container */}
      <div className={`relative w-full max-w-3xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
        
        {/* Header */}
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold">Cài đặt hệ thống</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">✕</button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Cài đặt bên trái */}
          <div className="w-1/3 border-r dark:border-slate-800 p-4 space-y-6 bg-slate-50/50 dark:bg-slate-950/20 overflow-y-auto">
            <div>
              <p className="text-[10px] font-black uppercase text-red-600 mb-3 tracking-widest">Giao diện</p>
              <button 
                onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
                className={`w-full text-left p-3 rounded-xl border text-sm font-bold flex items-center gap-2 transition-all ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 shadow-sm'}`}
              >
                {isDark ? '☀️ Chế độ sáng' : '🌙 Chế độ tối'}
              </button>
            </div>

            {isAdmin && (
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-red-600 mb-3 tracking-widest">Cấu hình môn học</p>
                {Object.entries(SubjectGroups).map(([group, subjects]) => (
                  <div key={group} className="space-y-1">
                    <p className="text-[8px] font-black opacity-40 uppercase ml-2">{group}</p>
                    {subjects.map(sub => (
                      <button
                        key={sub}
                        onClick={() => setActiveTab(sub)}
                        className={`w-full text-left p-2.5 rounded-lg text-[11px] font-bold transition-all ${activeTab === sub ? 'bg-red-600 text-white shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-800'}`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Nội dung chi tiết bên phải */}
          <div className="flex-1 p-8 overflow-y-auto">
            {!isAdmin ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-60">
                <div className="text-6xl">🎓</div>
                <div>
                  <h4 className="font-black text-red-600 uppercase text-sm tracking-widest">Dành cho Sinh viên</h4>
                  <p className="text-xs font-medium max-w-[200px] mt-2">Dữ liệu và cấu hình được quản lý bởi hệ thống Gia Sư BK.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex items-center gap-3 border-b pb-4 dark:border-slate-800">
                  <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white text-xl">⚙️</div>
                  <div>
                    <h4 className="font-black text-lg">{activeTab}</h4>
                    <p className="text-[10px] opacity-50 uppercase font-bold">Cấu hình Engine AI</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase text-red-600 mb-3 tracking-widest">AI Provider</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['gemini', 'custom'].map((p) => (
                        <button 
                          key={p}
                          onClick={() => updatePart({ provider: p as any })}
                          className={`p-3 border-2 rounded-2xl text-xs font-black uppercase transition-all ${currentCfg.provider === p ? 'bg-red-600 text-white border-red-600 shadow-lg' : 'hover:bg-slate-50 dark:hover:bg-slate-800 border-transparent bg-slate-100 dark:bg-slate-800'}`}
                        >
                          {p === 'gemini' ? 'Google Gemini' : 'Custom API'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-black uppercase opacity-40 mb-2 ml-1">Model Name / ID</label>
                      <input 
                        type="text" 
                        value={currentCfg.modelId}
                        onChange={(e) => updatePart({ modelId: e.target.value })}
                        className={`w-full p-4 rounded-2xl border-2 outline-none font-bold text-sm transition-all focus:border-red-600 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                        placeholder="Ví dụ: gemini-3-pro-preview"
                      />
                    </div>

                    {currentCfg.provider === 'custom' && (
                      <div className="animate-in slide-in-from-top-2">
                        <label className="block text-[10px] font-black uppercase opacity-40 mb-2 ml-1">Endpoint URL</label>
                        <input 
                          type="text" 
                          value={currentCfg.apiUrl || ''}
                          onChange={(e) => updatePart({ apiUrl: e.target.value })}
                          className={`w-full p-4 rounded-2xl border-2 outline-none font-bold text-sm focus:border-red-600 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                          placeholder="https://api.yourdomain.com/v1"
                        />
                      </div>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30">
                    <p className="text-[9px] text-red-600 font-bold leading-relaxed">
                      LƯU Ý: Thay đổi cấu hình sẽ ảnh hưởng trực tiếp đến chất lượng phản hồi của môn {activeTab}. Hãy đảm bảo Model ID chính xác.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
