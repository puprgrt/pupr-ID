"use client";

import { Bot, Send, Sparkles, User, BrainCircuit, Loader2, MessageSquare, Plus, Paperclip } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  model?: "gemini" | "chatgpt";
};

export default function AIAssistantPage() {
  const [activeModel, setActiveModel] = useState<"gemini" | "chatgpt">("gemini");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "ai",
      content: "Halo! Saya adalah Asisten AI PUPR Garut. Saya dapat membantu Anda merangkum dokumen, membuat draft laporan, atau menjawab pertanyaan teknis. Ada yang bisa saya bantu hari ini?",
      model: "gemini"
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: `Ini adalah balasan simulasi dari ${activeModel === 'gemini' ? 'Google Gemini 🚀' : 'OpenAI ChatGPT 🧠'}. Di versi produksi, pesan ini akan dihasilkan langsung oleh API kecerdasan buatan sesungguhnya berdasarkan perintah Anda: "${userMsg.content}".`,
        model: activeModel
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] pb-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Model Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-poppins font-bold text-white flex items-center gap-3">
            <Bot className="w-7 h-7 text-[#56CCF2]" />
            AI Assistant
          </h1>
          <p className="text-xs text-slate-400 mt-1">Asisten virtual cerdas terintegrasi untuk produktivitas.</p>
        </div>

        {/* Model Toggle */}
        <div className="flex p-1 bg-slate-900/80 rounded-xl border border-white/10 backdrop-blur-md w-fit">
          <button
            onClick={() => setActiveModel("gemini")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeModel === "gemini" 
                ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-[#56CCF2] shadow-[0_0_15px_rgba(86,204,242,0.15)] border border-[#56CCF2]/30" 
                : "text-slate-500 hover:text-slate-300 transparent border border-transparent"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Gemini
          </button>
          <button
            onClick={() => setActiveModel("chatgpt")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeModel === "chatgpt" 
                ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.15)] border border-emerald-500/30" 
                : "text-slate-500 hover:text-slate-300 transparent border border-transparent"
            }`}
          >
            <BrainCircuit className="w-4 h-4" />
            ChatGPT
          </button>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 glass-panel rounded-2xl border border-white/10 flex flex-col overflow-hidden min-h-0 relative">
        
        {/* Background Decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[100px] transition-colors duration-1000 ${
            activeModel === 'gemini' ? 'bg-[#56CCF2]/20' : 'bg-emerald-500/20'
          }`}></div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar relative z-10 space-y-6">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 max-w-4xl mx-auto ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ${
                msg.role === 'user' 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-500' 
                  : msg.model === 'gemini'
                    ? 'bg-gradient-to-br from-blue-500 to-cyan-400'
                    : 'bg-gradient-to-br from-emerald-500 to-teal-400'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4 text-white" /> : 
                 msg.model === 'gemini' ? <Sparkles className="w-4 h-4 text-white" /> : 
                 <BrainCircuit className="w-4 h-4 text-white" />}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-[#56CCF2] text-[#071A3D] font-medium rounded-tr-sm' 
                    : 'bg-slate-800/80 text-slate-200 border border-white/10 rounded-tl-sm backdrop-blur-md'
                }`}>
                  {msg.content}
                </div>
                {msg.role === 'ai' && (
                  <span className="text-[10px] font-medium text-slate-500 mt-1.5 ml-1 flex items-center gap-1">
                    {msg.model === 'gemini' ? 'Powered by Google Gemini' : 'Powered by OpenAI'}
                  </span>
                )}
              </div>

            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-4 max-w-4xl mx-auto">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg ${
                activeModel === 'gemini' ? 'bg-gradient-to-br from-blue-500 to-cyan-400' : 'bg-gradient-to-br from-emerald-500 to-teal-400'
              }`}>
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              </div>
              <div className="px-5 py-3.5 rounded-2xl bg-slate-800/80 border border-white/10 rounded-tl-sm backdrop-blur-md flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900/60 border-t border-white/10 backdrop-blur-md relative z-10">
          <div className="max-w-4xl mx-auto relative flex items-end gap-2">
            
            <button className="p-3 text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-xl mb-0.5">
              <Plus className="w-5 h-5" />
            </button>

            <div className="flex-1 bg-slate-800/80 border border-white/10 rounded-xl flex items-end focus-within:ring-2 focus-within:ring-[#56CCF2]/50 focus-within:border-[#56CCF2]/50 transition-all">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Tanya ${activeModel === 'gemini' ? 'Gemini' : 'ChatGPT'} sesuatu...`}
                className="w-full bg-transparent text-sm text-white placeholder:text-slate-500 p-3.5 max-h-32 focus:outline-none resize-none custom-scrollbar"
                rows={1}
                style={{ minHeight: '52px' }}
              />
              <button className="p-3 text-slate-400 hover:text-[#56CCF2] transition-colors m-0.5">
                <Paperclip className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="p-3.5 bg-[#56CCF2] hover:bg-[#56CCF2]/90 disabled:bg-slate-700 disabled:text-slate-500 text-[#071A3D] rounded-xl transition-colors shadow-lg shadow-[#56CCF2]/20 mb-0.5"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-center text-[10px] text-slate-500 mt-3 font-medium">
            AI dapat membuat kesalahan. Harap verifikasi informasi penting secara mandiri.
          </p>
        </div>

      </div>
    </div>
  );
}
