import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Sparkles,
  Layers,
  Compass,
  Share2,
  Scale,
  TrendingUp,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Award,
  ArrowRight,
  Calculator,
  Mail,
  Users,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  FUNDRAISING_CHAPTERS,
  EMAIL_TEMPLATES,
  READINESS_QUESTIONS
} from '../data/fundraisingGuideData';

export default function FundraisingGuideModal({ isOpen, onClose }) {
  const [activeMainTab, setActiveMainTab] = useState('playbook'); // 'playbook' | 'templates' | 'calculator'
  const [selectedChapterId, setSelectedChapterId] = useState('stage-readiness');
  const [copiedTemplateId, setCopiedTemplateId] = useState(null);

  // Calculator State
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentChapter = FUNDRAISING_CHAPTERS.find((c) => c.id === selectedChapterId) || FUNDRAISING_CHAPTERS[0];

  const handleCopyTemplate = (template) => {
    navigator.clipboard.writeText(`Subject: ${template.subject}\n\n${template.body}`);
    setCopiedTemplateId(template.id);
    setTimeout(() => setCopiedTemplateId(null), 2000);
  };

  const handleSelectQuizOption = (questionId, points) => {
    setQuizAnswers((prev) => ({
      ...prev,
      [questionId]: points
    }));
  };

  const calculateTotalScore = () => {
    return Object.values(quizAnswers).reduce((acc, curr) => acc + curr, 0);
  };

  const totalScore = calculateTotalScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200">
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-indigo-600 to-amber-500 shrink-0" />

        {/* Modal Top Header */}
        <div className="p-5 sm:px-8 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-black font-heading tracking-tight text-white">
                  Founder Playbook: How to Raise VC &amp; Scale
                </h3>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  Full Masterclass
                </span>
              </div>
              <p className="text-xs text-slate-400">
                End-to-end blueprint for pitching Tier 1 VCs, term sheet negotiation, warm intros, and deck structure
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Navigation Tabs */}
        <div className="px-5 sm:px-8 bg-slate-50 border-b border-slate-200 flex items-center gap-2 overflow-x-auto py-2.5 shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveMainTab('playbook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'playbook'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Complete Playbook (5 Chapters)</span>
          </button>

          <button
            onClick={() => setActiveMainTab('templates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'templates'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>2. Copy-Paste Email Scripts &amp; Templates</span>
          </button>

          <button
            onClick={() => setActiveMainTab('calculator')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeMainTab === 'calculator'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>3. Fundraising Readiness Calculator</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 bg-white">
          {activeMainTab === 'playbook' && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Left Sidebar Chapter List */}
              <div className="md:col-span-4 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Playbook Chapters
                </div>
                {FUNDRAISING_CHAPTERS.map((ch) => {
                  const isSelected = ch.id === selectedChapterId;
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChapterId(ch.id)}
                      className={`w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start justify-between gap-2 ${
                        isSelected
                          ? 'bg-indigo-50/90 border-indigo-300 text-indigo-950 shadow-2xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-extrabold font-heading">
                          {ch.title}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                          {ch.subtitle}
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Right Content Area for Selected Chapter */}
              <div className="md:col-span-8 bg-slate-50/70 p-5 sm:p-6 rounded-3xl border border-slate-200/90 space-y-6">
                <div>
                  <h4 className="text-xl font-black font-heading text-slate-900 tracking-tight">
                    {currentChapter.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {currentChapter.subtitle}
                  </p>
                  <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed">
                    💡 <strong>Executive Summary:</strong> {currentChapter.content.overview}
                  </div>
                </div>

                {/* Chapter 1: Benchmarks */}
                {currentChapter.id === 'stage-readiness' && (
                  <div className="space-y-5">
                    <div className="space-y-3">
                      <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
                        Fundraising Valuation &amp; Metric Benchmarks
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {currentChapter.content.sections[0].points.map((pt, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <span className="font-bold text-sm text-indigo-700 font-heading">{pt.stage}</span>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                                  Dilution: {pt.dilution}
                                </span>
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-slate-100 text-slate-800">
                                  Val: {pt.valuation}
                                </span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">
                              <strong>Key Proof Points:</strong> {pt.requirements}
                            </p>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Instrument: {pt.instruments}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-amber-600" /> 4 Golden Rules of Clean Cap Tables
                      </div>
                      <ul className="space-y-1.5 text-xs text-amber-950">
                        {currentChapter.content.sections[1].rules.map((rule, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="font-bold text-amber-700">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Chapter 2: 10-Slide Deck */}
                {currentChapter.id === 'pitch-deck' && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600" /> The Ideal 10-Slide Pitch Deck Framework
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {currentChapter.content.slides.map((slide, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono text-xs font-black flex items-center justify-center">
                              {slide.number}
                            </span>
                            <span className="font-bold text-xs text-slate-900 truncate">
                              {slide.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                            {slide.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chapter 3: Warm Intros */}
                {currentChapter.id === 'networking-intros' && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      The Outreach Hierarchy for Tier 1 VCs
                    </div>
                    <div className="space-y-3">
                      {currentChapter.content.strategies.map((strat, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-indigo-700">{strat.source}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                              {strat.level}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {strat.tactic}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chapter 4: Term Sheets & Red Flags */}
                {currentChapter.id === 'pitching-negotiation' && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-rose-600" /> Critical Term Sheet Red Flags to Negotiate Out
                    </div>
                    <div className="space-y-3">
                      {currentChapter.content.redFlags.map((flag, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-2xs space-y-1.5">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-xs text-rose-700 font-heading">{flag.term}</span>
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[10px] font-bold">
                              Danger Warning
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {flag.danger}
                          </p>
                          <div className="text-xs font-semibold text-emerald-700 pt-1">
                            ✅ Winning Action: {flag.verdict}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Chapter 5: Post-Raise Scaling */}
                {currentChapter.id === 'post-raise' && (
                  <div className="space-y-4">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Execution &amp; Scaling Principles
                    </div>
                    <div className="space-y-3">
                      {currentChapter.content.bestPractices.map((bp, idx) => (
                        <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1.5">
                          <div className="font-bold text-xs text-indigo-900 font-heading">
                            {bp.title}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">
                            {bp.desc}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tab 2: Copy-Paste Email Templates */}
          {activeMainTab === 'templates' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 text-xs text-indigo-950 flex items-center justify-between gap-4">
                <div>
                  <strong>💡 Pro Tip for Founders:</strong> Customize the bracketed fields with real, verifiable metrics. VCs respect brevity and clear traction numbers over fluff.
                </div>
              </div>

              <div className="space-y-5">
                {EMAIL_TEMPLATES.map((tmpl) => (
                  <div key={tmpl.id} className="rounded-3xl border border-slate-200 bg-slate-50/60 p-5 sm:p-6 shadow-2xs space-y-3">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 font-heading">
                          {tmpl.title}
                        </h4>
                        <div className="text-xs text-indigo-700 font-mono mt-0.5">
                          Subject: {tmpl.subject}
                        </div>
                      </div>

                      <button
                        onClick={() => handleCopyTemplate(tmpl)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          copiedTemplateId === tmpl.id
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-300'
                        }`}
                      >
                        {copiedTemplateId === tmpl.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Template</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-2xl bg-white border border-slate-200/80 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed overflow-x-auto shadow-2xs">
                      {tmpl.body}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Fundraising Readiness Calculator */}
          {activeMainTab === 'calculator' && (
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-1">
                <h4 className="text-xl font-black font-heading text-slate-900">
                  Fundraising Readiness Diagnostic
                </h4>
                <p className="text-xs text-slate-500">
                  Answer 4 quick questions to see if your startup is ready to pitch institutional seed/Series A venture capital.
                </p>
              </div>

              <div className="space-y-4">
                {READINESS_QUESTIONS.map((q) => (
                  <div key={q.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                    <div className="text-xs font-bold text-slate-900 font-heading">
                      {q.question}
                    </div>
                    <div className="space-y-1.5">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = quizAnswers[q.id] === opt.points;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuizOption(q.id, opt.points)}
                            className={`w-full text-left p-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer flex items-center justify-between ${
                              isSelected
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-xs'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{opt.label}</span>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white shrink-0 ml-2" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Score Assessment Output */}
              {Object.keys(quizAnswers).length === READINESS_QUESTIONS.length && (
                <div className="p-5 rounded-3xl bg-indigo-50 border-2 border-indigo-200 text-center space-y-3 animate-in zoom-in-95">
                  <div className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                    Your Fundraising Readiness Score
                  </div>
                  <div className="text-4xl font-black font-heading text-indigo-900">
                    {totalScore} / 21
                  </div>
                  <p className="text-xs text-indigo-950 font-medium max-w-md mx-auto leading-relaxed">
                    {totalScore >= 17
                      ? '🚀 Excellent! You have strong traction, team, and materials in place. You are ready to run a competitive 4-week investor sprint with Tier 1 and Tier 2 VCs.'
                      : totalScore >= 11
                      ? '⚡ Good Progress. You have initial traction, but strengthen your warm intro pipeline and 10-slide deck before kicking off broad partner pitches.'
                      : '🔬 Early Stage. Focus 100% of your time on building the MVP, validating customer retention, and getting initial paying customers before formal pitching.'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Global &amp; India VC Index &bull; Founder Acceleration Hub</span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
