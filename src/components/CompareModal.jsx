import React from 'react';
import { X, Scale, ExternalLink, Award, TrendingUp, Sparkles, Building2, Trash2 } from 'lucide-react';
import { getTierBadgeStyle, getStageBadgeStyle } from '../data/categories';

export default function CompareModal({
  isOpen,
  onClose,
  comparedFunds,
  onRemoveFund,
  onClearCompare,
  onSelectFund
}) {
  if (!isOpen || comparedFunds.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Comparison Dialog */}
      <div className="relative w-full max-w-6xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:px-8 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30 text-indigo-300">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg sm:text-xl">
                Side-by-Side Venture Capital Comparison
              </h3>
              <p className="text-xs text-slate-300">
                Comparing {comparedFunds.length} global VC fund{comparedFunds.length > 1 ? 's' : ''} across AUM, Check Sizes, Prestige Tiers, and Track Record
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClearCompare}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-400/30 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl border bg-white/10 text-white hover:bg-white/20 border-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="p-6 sm:p-8 overflow-y-auto overflow-x-auto">
          <div
            className="grid gap-4 min-w-[700px]"
            style={{ gridTemplateColumns: `repeat(${comparedFunds.length}, minmax(240px, 1fr))` }}
          >
            {comparedFunds.map((fund) => (
              <div
                key={fund.id}
                className="rounded-2xl border border-slate-200 bg-slate-50/70 p-5 flex flex-col justify-between space-y-5"
              >
                {/* Top Card */}
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-10 h-10 rounded-xl text-white font-extrabold text-sm flex items-center justify-center shrink-0"
                        style={{ backgroundColor: fund.logoColor || '#0F172A' }}
                      >
                        #{fund.rank}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-heading font-extrabold text-base text-slate-900 truncate">
                          {fund.name}
                        </h4>
                        <div className="text-xs text-slate-500 truncate">{fund.hq}</div>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemoveFund(fund.id)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove from compare"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Tier & AUM */}
                  <div className="space-y-2 mb-4">
                    <div>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getTierBadgeStyle(fund.tier)}`}>
                        {fund.tier}
                      </span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-xs text-slate-500 font-bold uppercase">AUM</span>
                      <span className="font-mono font-extrabold text-slate-900 text-sm">{fund.aum}</span>
                    </div>
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200">
                      <span className="text-xs text-slate-500 font-bold uppercase">Check Size</span>
                      <span className="text-xs font-bold text-indigo-700">{fund.checkSize}</span>
                    </div>
                  </div>

                  {/* Stage Focus */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      Investment Stages
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {fund.stage.map((stg, i) => (
                        <span key={i} className={`px-2 py-0.5 rounded text-[10px] font-medium border ${getStageBadgeStyle(stg)}`}>
                          {stg}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top Exits */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-emerald-600" /> Marquee Exits
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {fund.notableExits.slice(0, 6).map((exit, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-800 text-[11px] font-medium border border-slate-200">
                          {exit}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Active Unicorns */}
                  <div className="mb-4">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-indigo-600" /> Active Unicorns
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {fund.activePortfolio.slice(0, 5).map((co, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[10px] font-medium border border-indigo-100">
                          {co}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Key Partners */}
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Key Partners
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {fund.keyPartners.slice(0, 3).join(', ')}
                    </p>
                  </div>
                </div>

                {/* Fund CTA */}
                <button
                  onClick={() => {
                    onClose();
                    onSelectFund(fund);
                  }}
                  className="w-full py-2 rounded-xl text-xs font-bold bg-white hover:bg-indigo-600 hover:text-white text-slate-800 border border-slate-200 hover:border-indigo-600 transition-all cursor-pointer shadow-2xs text-center"
                >
                  View Full Intelligence
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
