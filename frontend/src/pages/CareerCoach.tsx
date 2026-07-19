import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../services/api';
import {
  Send,
  Loader2,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export function CareerCoach() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hello! I am your Career Coach AI. I can analyze skill gaps, generate custom learning roadmaps, create salary negotiation scripts, or recommend resume formatting changes. What would you like to build today?' },
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: (message: string) => {
      const history = messages.map(m => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }));
      return apiRequest<{ role: string; content: string }>('/coach/chat', {
        method: 'POST',
        body: JSON.stringify({ message, history }),
      });
    },
    onSuccess: (data) => {
      setMessages((prev) => [...prev, { sender: 'ai', text: data.content }]);
    },
    onError: () => {
      setMessages((prev) => [...prev, { sender: 'ai', text: "I'm having trouble connecting to my knowledge base right now. Please try again." }]);
    }
  });

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim() || chatMutation.isPending) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setInputText('');
    chatMutation.mutate(textToSend);
  };

  const quickPrompts = [
    { title: 'Skill Gap Analysis', prompt: 'Analyze my skills for gaps in Senior Backend roles', icon: Award },
    { title: 'Learning Roadmap', prompt: 'Generate a learning roadmap for Golang & Distributed Systems', icon: BookOpen },
    { title: 'Salary Script', prompt: 'Write a salary negotiation script for Staff Frontend Engineer', icon: TrendingUp },
  ];

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col justify-between animate-fadeIn relative">
      {/* Messages Scroll Box */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 mb-4 select-text">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-2xl px-5 py-3.5 rounded-2xl text-sm leading-relaxed border shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 border-indigo-500 text-white rounded-br-none'
                  : 'bg-slate-900/60 border-slate-900 text-slate-100 rounded-bl-none'
              }`}
            >
              {msg.text.split('\n').map((line, idx) => (
                <p key={idx} className={line ? 'mb-2' : 'h-2'}>
                  {line.startsWith('**') || line.startsWith('*') || line.startsWith('>') || line.startsWith('#') ? (
                    // Very simple parsing for bold/bullet items and basic markdown
                    <span dangerouslySetInnerHTML={{
                      __html: line
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/^\*\s(.*)/g, '• $1')
                        .replace(/^-\s(.*)/g, '• $1')
                        .replace(/^>\s(.*)/g, '<em class="opacity-80 border-l-2 border-indigo-400 pl-2 ml-1 block">$1</em>')
                        .replace(/^###?\s(.*)/g, '<strong class="text-indigo-300 block mt-2">$1</strong>')
                    }} />
                  ) : (
                    <span dangerouslySetInnerHTML={{
                      __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} />
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}
        {chatMutation.isPending && (
          <div className="flex justify-start">
            <div className="bg-slate-900/60 border border-slate-900 rounded-2xl rounded-bl-none px-5 py-3.5 flex items-center gap-2 text-slate-400 text-xs font-semibold">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
              Coach is compiling analysis...
            </div>
          </div>
        )}
        <div ref={scrollRef}></div>
      </div>

      {/* Prompts + Input Bar */}
      <div className="space-y-4 shrink-0">
        {/* Quick actions row */}
        {messages.length === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickPrompts.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={() => handleSend(item.prompt)}
                  className="p-4 rounded-2xl bg-slate-950/60 border border-slate-900 hover:border-slate-800 text-left hover:bg-slate-900 transition-all duration-300 group"
                >
                  <div className="inline-flex p-2 bg-indigo-500/10 rounded-xl group-hover:scale-105 transition-transform duration-300">
                    <Icon className="w-4.5 h-4.5 text-indigo-400" />
                  </div>
                  <h4 className="text-sm font-bold text-white mt-3 leading-snug">{item.title}</h4>
                  <p className="text-[10px] text-slate-500 leading-snug mt-1 truncate">
                    {item.prompt}
                  </p>
                </button>
              );
            })}
          </div>
        )}

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex bg-slate-900 border border-slate-800 rounded-2xl p-2 focus-within:border-indigo-500 transition-colors"
        >
          <input
            type="text"
            placeholder="Ask your coach anything (e.g., 'help me prep for a system design interview')..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={chatMutation.isPending}
            className="flex-1 bg-transparent px-4 py-2.5 outline-none text-slate-100 text-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={chatMutation.isPending || !inputText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 disabled:text-slate-500 text-white rounded-xl transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
