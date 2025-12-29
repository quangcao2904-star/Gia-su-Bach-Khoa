import React, { useState, useRef, useEffect } from 'react';
import { Message, Subject, Theme, SubjectConfig } from '../types';
import { generateTutorResponse } from '../services/gemini';

interface ChatWindowProps {
  subject: Subject; theme: Theme; messages: Message[]; config: SubjectConfig;
  onUpdateMessages: (newMessages: Message[]) => void;
  onClearHistory: () => void; onOpenSidebar: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ subject, theme, messages, config, onUpdateMessages, onClearHistory, onOpenSidebar }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim() && !attachedImage) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText, image: attachedImage || undefined, timestamp: Date.now() };
    const updated = [...messages, userMsg];
    onUpdateMessages(updated);
    setInputText(''); setAttachedImage(null); setIsTyping(true);

    try {
      const history = updated.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const response = await generateTutorResponse(userMsg.text, subject, history, config, userMsg.image);
      onUpdateMessages([...updated, { id: (Date.now()+1).toString(), role: 'model', text: response || "AI không phản hồi.", timestamp: Date.now() }]);
    } catch (e: any) {
      onUpdateMessages([...updated, { id: (Date.now()+2).toString(), role: 'model', text: `Lỗi: ${e.message}`, timestamp: Date.now() }]);
    } finally { setIsTyping(false); }
  };

  const isDark = theme === 'dark';

  return (
    <div className={`flex flex-col h-full w-full ${isDark ? 'bg-slate-950' : 'bg-slate-50'}`}>
      <header className={`px-4 py-3 border-b flex justify-between items-center ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm`}>
        <div className="flex items-center gap-3">
          <button onClick={onOpenSidebar} className="p-2 md:hidden hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
          </button>
          <h2 className="font-bold text-sm md:text-base italic">GIA SƯ {subject.toUpperCase()}</h2>
        </div>
        <button onClick={onClearHistory} className="p-2 text-slate-400 hover:text-red-500">
          <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" /></svg>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-32">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${m.role === 'user' ? 'bg-red-600 text-white rounded-tr-none' : (isDark ? 'bg-slate-900 border border-slate-800 rounded-tl-none' : 'bg-white border rounded-tl-none')}`}>
              {m.image && <img src={m.image} className="rounded-lg mb-2 max-h-60 w-full object-contain" alt="attach" />}
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{m.text}</div>
            </div>
          </div>
        ))}
        {isTyping && <div className="text-xs font-bold text-red-600 animate-pulse px-4">AI ĐANG SUY NGHĨ...</div>}
        <div ref={messagesEndRef} />
      </div>

      <footer className="fixed bottom-0 left-0 right-0 p-4 max-w-4xl mx-auto z-50">
        {attachedImage && <img src={attachedImage} className="w-16 h-16 object-cover rounded-lg border-2 border-red-600 mb-2" alt="p" />}
        <div className={`flex items-center gap-2 p-2 rounded-full border-2 shadow-xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-400 hover:text-red-500">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h7M16 5h5v5M12 12L21 3" /></svg>
            <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) { const r = new FileReader(); r.onload = () => setAttachedImage(r.result as string); r.readAsDataURL(f); }
            }} accept="image/*" />
          </button>
          <input 
            type="text" value={inputText} onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Hỏi bài tập..."
            className="flex-1 bg-transparent py-2 px-1 focus:outline-none text-sm font-semibold"
          />
          <button onClick={handleSendMessage} className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg active:scale-90">
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
          </button>
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;
