import React, { useState } from 'react';
import { User, UserRole } from '../types';

const PRESET_ACCOUNTS = [
  { user: "20251234", pass: "123456", name: "Sinh viên BK" }
];

const AuthModal: React.FC<{ onLogin: (user: User) => void; theme: 'light' | 'dark' }> = ({ onLogin, theme }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isDark = theme === 'dark';

  const handleAuth = () => {
    if (!username || !password) return alert("Vui lòng điền đủ thông tin");
    // Demo login logic
    onLogin({ 
      id: Date.now().toString(), 
      username, 
      role: 'user', 
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}` 
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <div className={`w-full max-w-md p-8 rounded-[2.5rem] shadow-2xl border ${isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100'}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white text-3xl font-black mx-auto mb-4">BK</div>
          <h2 className="text-2xl font-black italic">Gia Sư Bách Khoa</h2>
          <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest mt-1">Hệ thống hỗ trợ học tập AI</p>
        </div>

        <div className="space-y-4">
          <input 
            type="text" placeholder="MSSV / Tên đăng nhập" value={username} onChange={e => setUsername(e.target.value)}
            className={`w-full p-4 rounded-2xl border-2 outline-none focus:border-red-600 font-bold ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          />
          <input 
            type="password" placeholder="Mật khẩu" value={password} onChange={e => setPassword(e.target.value)}
            className={`w-full p-4 rounded-2xl border-2 outline-none focus:border-red-600 font-bold ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}
          />
          <button onClick={handleAuth} className="w-full py-4 bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-600/20 active:scale-95 transition-all uppercase">
            {isRegister ? 'Khởi tạo tài khoản' : 'Vào học ngay'}
          </button>
          <button onClick={() => setIsRegister(!isRegister)} className="w-full text-xs font-bold opacity-50 uppercase">
            {isRegister ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Đăng ký'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
