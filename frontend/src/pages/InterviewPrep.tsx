import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest } from '../services/api';
import {
  FileQuestion,
  Sparkles,
  Loader2,
  Award,
  ChevronRight,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

interface Question {
  id: string;
  category: string;
  question: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
}

interface FeedbackResult {
  score: number;
  star_analysis: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  strengths: string[];
  improvements: string[];
  keywords_used: string[];
  word_count: number;
  quantification_count: number;
}

const DIFFICULTY_COLOR = {
  easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  hard: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const SCORE_COLOR = (score: number) => {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-red-400';
};

export function InterviewPrep() {
  const [selectedCategory, setSelectedCategory] = useState<'behavioral' | 'technical' | 'hr'>('behavioral');
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [answerText, setAnswerText] = useState('');
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);

  // Fetch questions from real backend
  const { data: questions = [], isLoading: loadingQuestions, refetch } = useQuery<Question[]>({
    queryKey: ['interviewQuestions', selectedCategory],
    queryFn: () => apiRequest<Question[]>(`/interview/questions?category=${selectedCategory}&limit=10`),
  });

  // STAR feedback mutation
  const feedbackMutation = useMutation({
    mutationFn: ({ question, answer }: { question: string; answer: string }) =>
      apiRequest<FeedbackResult>('/interview/feedback', {
        method: 'POST',
        body: JSON.stringify({ question, answer }),
      }),
    onSuccess: (data) => setFeedback(data),
  });

  const handleSelectQuestion = (q: Question) => {
    setActiveQuestion(q);
    setAnswerText('');
    setFeedback(null);
  };

  const handleGenerateFeedback = () => {
    if (!answerText.trim() || !activeQuestion) return;
    feedbackMutation.mutate({ question: activeQuestion.question, answer: answerText });
  };

  // Change category
  const handleCategoryChange = (cat: 'behavioral' | 'technical' | 'hr') => {
    setSelectedCategory(cat);
    setActiveQuestion(null);
    setFeedback(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn h-full items-stretch">
      {/* Sidebar */}
      <div className="glass rounded-3xl p-6 shadow-md flex flex-col h-full">
        <h3 className="text-lg font-bold tracking-tight text-white mb-4 flex items-center gap-2">
          <FileQuestion className="w-5 h-5 text-indigo-400" />
          Interview Coach
        </h3>

        {/* Category toggle */}
        <div className="flex bg-slate-950 p-1.5 rounded-xl border border-slate-900 mb-4">
          {(['behavioral', 'technical', 'hr'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
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

        {/* Reload questions */}
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-indigo-400 transition-colors mb-4 self-end"
        >
          <RefreshCw className="w-3 h-3" /> Refresh questions
        </button>

        {/* Questions list */}
        <div className="flex-1 space-y-3 overflow-y-auto pr-1">
          {loadingQuestions ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-xs text-slate-500 text-center py-8">No questions found.</div>
          ) : (
            questions.map((q) => (
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
                <div className="flex items-center justify-between mt-3">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${DIFFICULTY_COLOR[q.difficulty]}`}>
                    {q.difficulty}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
                </div>
              </button>
            ))
          )}
        </div>

        <div className="pt-4 border-t border-slate-900/60 text-xs text-slate-500 mt-4">
          {questions.length} questions loaded from question bank. STAR analysis is AI-powered.
        </div>
      </div>

      {/* Main workspace */}
      <div className="lg:col-span-2 space-y-6">
        {activeQuestion ? (
          <div className="glass rounded-3xl p-6 shadow-md space-y-6">
            {/* Question display */}
            <div className="p-4 bg-slate-950/60 border border-slate-900 rounded-2xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">Question</span>
                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${DIFFICULTY_COLOR[activeQuestion.difficulty]}`}>
                  {activeQuestion.difficulty}
                </span>
              </div>
              <p className="text-sm font-bold text-white leading-relaxed">{activeQuestion.question}</p>
              {activeQuestion.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {activeQuestion.tags.map((tag) => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 bg-slate-900 border border-slate-800 text-slate-400 rounded-full">{tag}</span>
                  ))}
                </div>
              )}
            </div>

            {/* STAR hint */}
            <div className="grid grid-cols-4 gap-2 text-[10px]">
              {[
                { label: 'Situation', desc: 'Set the context' },
                { label: 'Task', desc: 'Your role' },
                { label: 'Action', desc: 'What you did' },
                { label: 'Result', desc: 'Measurable impact' },
              ].map((item) => (
                <div key={item.label} className="p-2.5 bg-slate-950/60 border border-slate-900 rounded-xl text-center">
                  <p className="font-bold text-indigo-400">{item.label[0]}</p>
                  <p className="text-slate-300 font-semibold mt-0.5">{item.label}</p>
                  <p className="text-slate-600 mt-0.5">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Answer textarea */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Your STAR Answer
              </label>
              <textarea
                rows={7}
                placeholder="Situation: When I was at [Company]...&#10;Task: My responsibility was to...&#10;Action: I specifically...&#10;Result: This resulted in..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none text-slate-100 text-sm transition-all duration-300 resize-none"
              />
              <div className="flex justify-between text-xs text-slate-600">
                <span>{answerText.split(/\s+/).filter(Boolean).length} words</span>
                <span>Aim for 150–250 words</span>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() => { setAnswerText(''); setFeedback(null); }}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleGenerateFeedback}
                disabled={feedbackMutation.isPending || !answerText.trim()}
                className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/10 transition-all duration-300 flex items-center gap-2 disabled:opacity-50"
              >
                {feedbackMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Analyze My Answer
              </button>
            </div>

            {/* Real AI STAR Feedback */}
            {feedback && (
              <div className="mt-2 p-6 rounded-2xl bg-indigo-950/10 border border-indigo-500/15 space-y-5 animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-indigo-500/10">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    STAR Analysis
                  </h4>
                  <div className={`flex items-center gap-1.5 font-extrabold text-lg ${SCORE_COLOR(feedback.score)}`}>
                    <Award className="w-5 h-5" />
                    {feedback.score}/100
                  </div>
                </div>

                {/* Score bar */}
                <div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        feedback.score >= 80 ? 'bg-emerald-500' : feedback.score >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${feedback.score}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-600 mt-1">
                    <span>{feedback.word_count} words</span>
                    <span>{feedback.quantification_count} quantified result{feedback.quantification_count !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* STAR breakdown */}
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold text-indigo-300 uppercase tracking-widest">STAR Breakdown</h5>
                    <div className="space-y-2.5">
                      {Object.entries(feedback.star_analysis).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="text-indigo-400 font-bold text-xs w-4 shrink-0">{key[0].toUpperCase()}</span>
                          <p className="text-xs text-slate-300 leading-relaxed">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Strengths */}
                    {feedback.strengths.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-2">Strengths</h5>
                        <ul className="space-y-1.5">
                          {feedback.strengths.map((s, idx) => (
                            <li key={idx} className="flex gap-2 text-xs text-slate-300">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements */}
                    {feedback.improvements.length > 0 && (
                      <div>
                        <h5 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-2">Improvements</h5>
                        <ul className="space-y-1.5">
                          {feedback.improvements.map((s, idx) => (
                            <li key={idx} className="flex gap-2 text-xs text-slate-400">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                              {s}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action verbs used */}
                    {feedback.keywords_used.length > 0 && (
                      <div>
                        <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Action Verbs Detected</h5>
                        <div className="flex flex-wrap gap-1">
                          {feedback.keywords_used.map((kw) => (
                            <span key={kw} className="text-[10px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full capitalize">{kw}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass rounded-3xl p-12 text-center shadow-md flex flex-col items-center justify-center min-h-[400px]">
            <Sparkles className="w-12 h-12 text-slate-700 mb-3 animate-pulse" />
            <h4 className="text-sm font-bold text-white">Select a question to start coaching</h4>
            <p className="text-xs text-slate-500 mt-2 max-w-sm leading-relaxed">
              Choose a behavioral, technical, or HR question from the panel. Type your answer and get real AI-powered STAR method feedback instantly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
