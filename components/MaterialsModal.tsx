import React from 'react';
import { Subject } from '../types';

const MaterialsModal: React.FC<any> = ({ isOpen, onClose, subject, theme }) => {
  if (!isOpen) return null;
  const isDark = theme === 'dark';

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className={`relative w-full max-w-md rounded-3xl shadow-2xl p-6 ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
        <h3 className="text-lg font-bold mb-4 uppercase">Tài liệu {subject}</h3>
        <div className="space-y-3">
          <div className="p-4 border rounded-2xl flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer">
            <span className="text-sm font-bold">📄 Slide Bài giảng 2024</span>
            <span className="text-red-600 text-xs font-black">TẢI VỀ</span>
          </div>
          <div className="p-4 border rounded-2xl flex items-center justify-between hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer">
            <span className="text-sm font-bold">📝 Tổng hợp Đề thi cuối kỳ</span>
            <span className="text-red-600 text-xs font-black">TẢI VỀ</span>
          </div>
        </div>
        <button onClick={onClose} className="w-full mt-6 py-3 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold uppercase">Đóng</button>
      </div>
    </div>
  );
};

export default MaterialsModal;
