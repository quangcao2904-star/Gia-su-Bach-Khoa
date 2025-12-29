import React from 'react';
import { Theme, Subject, SubjectConfig, SubjectGroups } from '../types';

const SettingsModal: React.FC<any> = ({ isOpen, onClose, theme, onThemeChange, subjectConfigs, onUpdateConfig, isAdmin }) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
        <div className="p-6 border-b dark:border-slate-800 flex justify-between items-center">
          <h3 className="text-xl font-bold">Cài đặt hệ thống</h3>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-6 overflow-y-auto space-y-6">
          <section>
            <label className="text-xs font-black uppercase text-red-600 block mb-2">Giao diện</ts>
            <button onClick={() => onThemeChange(isDark ? 'light' : 'dark')} className="w-full p-4 rounded-2xl border text-left font-bold shadow-sm">
              {isDark ? '☀️ Chế độ sáng' : '🌙 Chế độ tối'}
            </button>
          </section>

          {isAdmin && (
            <section>
              <label className="text-xs font-black uppercase text-red-600 block mb-2">Cấu hình AI theo môn</label>
              <div className="space-y-2">
                {Object.values(Subject).map(sub => (
                  <div key={sub} className="flex items-center gap-2 p-3 border rounded-xl">
                    <span className="flex-1 text-xs font-bold">{sub}</span>
                    <select 
                      value={subjectConfigs[sub].provider}
                      onChange={(e) => onUpdateConfig(sub, { ...subjectConfigs[sub], provider: e.target.value as any })}
                      className="text-[10px] p-1 border rounded dark:bg-slate-800"
                    >
                      <option value="gemini">Gemini</option>
                      <option value="custom">API Riêng</option>
                    </select>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
