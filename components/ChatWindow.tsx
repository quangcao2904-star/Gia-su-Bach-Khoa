import React, { useState, useRef, useEffect } from 'react';
import { Message, Subject, Theme, SubjectConfig } from '../types';
import { generateTutorResponse } from '../services/gemini';

const ChatWindow: React.FC<any> = ({ subject, theme, messages, config, onUpdateMessages, onClearHistory, onOpenSidebar }) => {
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim() && !attachedImage) return;
    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText, image: attachedImage || undefined, timestamp: Date.now() };
    const newMsgs = [...messages, userMsg];
    onUpdateMessages(newMsgs);
    setInputText(''); setAttachedImage(null); setIsTyping(true);

    try {
      const history = newMsgs.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      const res = await generateTutorResponse(userMsg.text, subject, history, config, userMsg.image);
      onUpdateMessages([...newMsgs, { id: (Date.now()+1).toString(), role: 'model', text: res || '', timestamp: Date.now() }]);
    } catch (e) {
      console.error(e);
    } finally { setIsTyping(false); }
  };

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
       {/* UI code here (giống bản trước nhưng lược bớt cho gọn) */}
       <div className="flex-1 overflow-y-auto p-4 space-y-4">
         {messages.map(m => (
           <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
             <div className={`p-3 rounded-2xl max-w-[80%] ${m.role === 'user' ? 'bg-red-600 text-white' : 'bg-white dark:bg-slate-900 border'}`}>
               {m.text}
             </div>
           </div>
         ))}
         <div ref={messagesEndRef} />
       </div>
       <div className="p-4 border-t">
         <input 
           value={inputText} 
           onChange={e => setInputText(e.target.value)} 
           onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
           className="w-full p-3 rounded-xl border dark:bg-slate-800"
           placeholder="Hỏi bài tập..."
         />
       </div>
    </div>
  );
};

export default ChatWindow;
