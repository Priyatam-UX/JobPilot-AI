import { useState } from 'react';
import {
  FileQuestion,
  Sparkles,
  Loader2,
  Award,
  ChevronRight,
} from 'lucide-react';

interface MockQuestion {
  id: string;
  category: 'behavioral' | 'technical' | 'hr';
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function InterviewPrep() {
  const [selectedCategory, setSelectedCategory] = useState<'behavioral' | 'technical' | 'hr'>('behavioral');
  const [activeQuestion, setActiveQuestion] = useState<MockQuestion | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [feedback, setFeedback] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const mockQuestions: MockQuestion[] = [
    { id: '1', category: 'behavioral', question: 'Tell me about a time you resolved a major bug in production under tight deadlines.', difficulty: 'medium' },
    { id: '2', category: 'behavioral', question: 'Describe a situation where you had a conflict with a product manager and how you handled it.', difficulty: 'medium' },
    { id: '3', category: 'technical', question: 'Explain how you would design a highly concurrent rate limiter for API endpoints.', difficulty: 'hard' },
    { id: '4', category: 'hr', question: 'Why do you want to join Stripe and how do you align with our core operating principles?', difficulty: 'easy' },
  ];

  const handleSelectQuestion = (q: MockQuestion) => {
    setActiveQuestion(q);
    setAnswerText('');
    setFeedback(null);
  };

  const handleGenerateFeedback = () => {
    if (!answerText.trim()) return;
    setLoading(true);
    // Simulate AI feedback generation
    setTimeout(() => {
      setFeedback({
        score: 88,
        starAnalysis: {
          situation: 'Excellent detail establishing context regarding critical payment failures.',
          task: 'Clearly identified task of restoring transactions and preventing double charges.',
          action: 'Strong explanation of troubleshooting database locks using indexes.',
          result: 'Quantified result of reducing processing delays by 40% and saving $14k.',
        },
        suggestions: [
          'Add details on how you communicated updates to stakeholders during downtime.',
          'Specify the exact database indexes or system architectural designs used.',
        ],
      });
      setLoading(false);
    }, 1500);
  };

  const filteredQuestions = mockQuestions.filter((q) => q.category === selectedCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn h-full items-stretch">
      {/* Sidebar - Category & Questions list */}
      <div className="glass rounded-3xl p-6 shadow-md flex flex-col justify-between h-full">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-2">
            <FileQuestion className="w-5 h-5 text-indigo-400" />
            Interview Coach
          </h3>

          {/* Categories Toggle */}
          <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-900 mb-6">
            {(['behavioral', 'technical', 'hr'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setActiveQuestion(null);
                  setFeedback(null);
                }}
                className={`flex-1 py-1.5 text-xs font-semibold capitalize rounded-lg transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Questions list */}
          <div className="space-y-3 overflow-y-auto max-h-[400px] pr-1">
            {filteredQuestions.map((q) => (
              <button
                key={q.id}
                onClick={() => handleSelectQuestion(q)}
                className={`w-full text-left p-4 rounded-xl border text-xs leading-relaxed transition-all ${
                  activeQuestion?.id === q.id
                    ? 'bg-indigo-900/10 border-indigo-500/30 text-indigo-200 font-semibold'
                    : 'bg-slate-900/40 border-slate-900 hover:border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {q.question}
                <div className="flex items-center justify-between mt-3 text-[10px] uppercase font-bold text-slate-500">
                  <span>Difficulty: {q.difficulty}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-6 border-t border-slate-900/60 text-xs text-slate-500 mt-8">
          Answers analyzed via GPT models structure STAR responses (Situation, Task, Action, Result) automatically.
        </div>
      </div>

      {/* Main Workspace - Answer builder & STAR feedback */}
      <div className="lg:col-span-2 space-y-6">
        {activeQuestion ? (
          <div className="glass rounded-3xl p-6 shadow-md space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Selected Question</span>
                <p className="text-sm font-bold text-white leading-relaxed mt-1">{activeQuestion.question}</p>
              </div>

              {/* Text Area */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Your STAR Answer</label>
                <textarea
                  rows={6}
                  placeholder="Structure your answer: state the Situation, Task, your Actions, and key Results..."
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none text-slate-100 text-sm transition-all duration-300"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-900 flex justify-between items-center gap-4">
              <button
                onClick={handleGenerateFeedback}
                disabled={loading || !answerText.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/10 transition-all duration-300 flex items-center gap-2 hover:scale-[1.01]"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Analyze Response
              </button>
            </div>

            {/* AI STAR Feedback Panel */}
            {feedback && (
              <div className="mt-8 p-6 rounded-2xl bg-indigo-950/10 border border-indigo-500/15 space-y-4 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-500/10">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    Response Analysis
                  </h4>
                  <div className="flex items-center gap-1 text-emerald-400 font-extrabold text-sm">
                    <Award className="w-4 h-4" />
                    Score: {feedback.score}/100
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">STAR Method Check</h5>
                    <ul className="space-y-2 text-xs leading-relaxed text-slate-300">
                      <li><strong>S:</strong> {feedback.starAnalysis.situation}</li>
                      <li><strong>T:</strong> {feedback.starAnalysis.task}</li>
                      <li><strong>A:</strong> {feedback.starAnalysis.action}</li>
                      <li><strong>R:</strong> {feedback.starAnalysis.result}</li>
                    </ul>
                  </div>

                  <div className="space-y-3 border-l border-slate-900/60 pl-4">
                    <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Improvements</h5>
                    <ul className="space-y-2 text-xs text-slate-400 list-disc list-inside leading-relaxed">
                      {feedback.suggestions.map((s: string, idx: number) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 text-center shadow-md flex flex-col items-center justify-center h-full min-h-[350px]">
            <Sparkles className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
            <h4 className="text-sm font-bold text-white">Select a mock question to begin coaching</h4>
            <p className="text-xs text-slate-500 mt-1.5 max-w-sm leading-relaxed">
              Coaching session models will review answers against industry principles, suggest structural changes, and build STAR responses.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
