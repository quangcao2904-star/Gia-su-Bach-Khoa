import React from 'react';

const GuideModal: React.FC<any> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className={`relative w-full max-w-lg rounded-[2.5rem] p-8 text-center ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-white text-slate-800'}`}>
        <div className="text-4xl mb-4">🎓</div>
        <h3 className="text-xl font-black italic mb-2">Chào mừng đến với Gia Sư BK!</h3>
        <p className="text-sm opacity-70 mb-6">Bạn có thể hỏi AI về bất kỳ bài tập nào, gửi ảnh đề thi để nhận lời giải chi tiết hoặc tải tài liệu học tập ngay trong ứng dụng.</p>
        <button onClick={onClose} className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl uppercase">Bắt đầu học ngay</button>
      </div>
    </div>
  );
};

export default GuideModal;
