import { useState, useRef, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend = inputText) => {
    if (!textToSend.trim()) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setInputText('');
    setLoading(true);

    // Simulate career coach agent responses based on prompts
    setTimeout(() => {
      let aiResponse = "I have updated your profile context. Let me analyze that.";
      if (textToSend.toLowerCase().includes('roadmap')) {
        aiResponse = "Here is your custom **Golang & Distributed Systems learning roadmap**:\n\n1. **Core Concurrency:** Master Channels, Goroutines, and `sync` primitives (1 week).\n2. **Network Programming:** Build standard HTTP/gRPC multiplexers (1 week).\n3. **Vector/Semantic search databases:** Learn pgvector, Qdrant, and indexes (2 weeks).\n4. **Task queues:** Integrate Celery or temporal workflows (2 weeks).";
      } else if (textToSend.toLowerCase().includes('negotiation')) {
        aiResponse = "Here is your **Salary Negotiation Script** for a Staff Engineer role:\n\n* **Acknowledge offer:** 'Thank you for the offer. I am thrilled about the opportunity to lead the backend scaling efforts at Stripe.'\n* **Anchor the ask:** 'Based on my experience scaling database transactions by 10x and leading a team of 6 engineers, I was expecting base compensation closer to $195k rather than $175k. If we can adjust this, I am ready to sign the agreement today.'";
      } else if (textToSend.toLowerCase().includes('gap')) {
        aiResponse = "Based on your Master Resume and the desired Senior React Role, here is your **Skill Gap Analysis**:\n\n* **High Priority Gaps:** TanStack query optimization, React 19 concurrent features (`useActionState`, `useTransition`), WebSockets state management.\n* **Recommendations:** Complete a mock project implementing real-time feeds using WebSockets and TanStack query caching.";
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse }]);
      setLoading(false);
    }, 1500);
  };

  const quickPrompts = [
    { title: 'Skill Gap Analysis', prompt: 'Analyze my master resume for skill gaps in Senior Backend roles', icon: Award },
    { title: 'Learning Roadmap', prompt: 'Generate a learning roadmap for Golang & pgvector databases', icon: BookOpen },
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
                  {line.startsWith('**') || line.startsWith('*') ? (
                    // Very simple parsing for bold/bullet items
                    <span dangerouslySetInnerHTML={{
                      __html: line
                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                        .replace(/^\*\s(.*)/g, '• $1')
                    }} />
                  ) : (
                    line
                  )}
                </p>
              ))}
            </div>
          </div>
        ))}
        {loading && (
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
            placeholder="Ask your coach anything..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-transparent px-4 py-2.5 outline-none text-slate-100 text-sm"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-850 disabled:text-slate-500 text-white rounded-xl transition-all duration-300"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
