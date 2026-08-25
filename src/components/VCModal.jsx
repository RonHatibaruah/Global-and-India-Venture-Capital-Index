import React, { useState } from 'react';
import { X, Star, ExternalLink, Share2, Check, Sparkles, Building2, Globe, Award, TrendingUp, Layers, Users, DollarSign, Scale } from 'lucide-react';
import { getTierBadgeStyle, getStageBadgeStyle, slugify } from '../data/categories';
import { LinkedInIcon, XIcon } from './Icons';

export default function VCModal({
  fund,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  isCompared,
  onToggleCompare
}) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !fund) return null;

  const shareUrl = `${window.location.origin}/fund/${slugify(fund.name)}`;

  const handleCopy = () => {
    const text = `${fund.name} (#${fund.rank} Global VC)\nTier: ${fund.tier} | AUM: ${fund.aum}\nCheck Size: ${fund.checkSize}\nKey Exits: ${fund.notableExits.join(', ')}\nDetails: ${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden z-10 animate-in zoom-in-95 duration-200 my-auto max-h-[92vh] flex flex-col">
        {/* Header Ribbon Banner */}
        <div className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 flex items-center justify-between text-white shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-lg bg-white/10 backdrop-blur-md text-xs font-mono font-bold text-emerald-400 border border-white/10">
              GLOBAL RANK #{fund.rank}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${getTierBadgeStyle(fund.tier)}`}>
              {fund.tier}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleCompare(fund)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isCompared
                  ? 'bg-indigo-600 text-white border-indigo-400 font-bold'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Add to side-by-side compare'}
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={() => onToggleFavorite(fund.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-md'
                  : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
              }`}
              title="Save to target list"
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleCopy}
              className="p-2 rounded-xl border bg-white/10 text-white hover:bg-white/20 border-white/20 transition-all cursor-pointer"
              title="Share fund link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl border bg-white/10 text-white hover:bg-white/20 border-white/20 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Main Title & Key Stats */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl font-heading shadow-md"
                  style={{ backgroundColor: fund.logoColor || '#0F172A' }}
                >
                  {fund.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    {fund.name}
                  </h2>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mt-0.5">
                    <span className="flex items-center gap-1">
                      <Globe className="w-3.5 h-3.5 text-slate-400" />
                      {fund.hq}
                    </span>
                    <span>•</span>
                    <span>Founded in {fund.founded}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AUM & Check Size Summary Card */}
            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200 shrink-0">
              <div className="text-center px-3 border-r border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400">Total AUM</div>
                <div className="text-base font-extrabold font-mono text-slate-900">{fund.aum}</div>
              </div>
              <div className="text-center px-3">
                <div className="text-[10px] uppercase font-bold text-slate-400">Check Size</div>
                <div className="text-xs font-bold text-indigo-700">{fund.checkSize}</div>
              </div>
            </div>
          </div>

          {/* Investment Thesis & Historical Track Record */}
          <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Investment Thesis & Market Prestige Overview
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {fund.description}
            </p>
            <div className="pt-2 border-t border-slate-200/80 flex items-start gap-2 text-xs text-emerald-800 font-medium">
              <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Historical Return Profile:</strong> {fund.historicalReturnProfile}</span>
            </div>
          </div>

          {/* Generation-Defining Exits & IPOs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-600" /> Generation-Defining Exits & Multi-Billion IPOs
            </h4>
            <div className="flex flex-wrap gap-2">
              {fund.notableExits.map((exit, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-900 border border-slate-300 shadow-2xs hover:border-slate-500 transition-colors"
                >
                  {exit}
                </span>
              ))}
            </div>
          </div>

          {/* Active Unicorn & Frontier AI Portfolio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Active Unicorn Portfolio & AI Investments
            </h4>
            <div className="flex flex-wrap gap-2">
              {fund.activePortfolio.map((co, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50 text-indigo-900 border border-indigo-200/80"
                >
                  {co}
                </span>
              ))}
            </div>
          </div>

          {/* Grid of Key Metadata: Stages, Sectors, Offices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Stages & Sectors */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" /> Stages & Sectors
              </h5>
              <div className="space-y-2">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Stages</div>
                  <div className="flex flex-wrap gap-1">
                    {fund.stage.map((stg, sIdx) => (
                      <span key={sIdx} className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getStageBadgeStyle(stg)}`}>
                        {stg}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Core Sectors</div>
                  <div className="flex flex-wrap gap-1">
                    {fund.sectors.map((sec, secIdx) => (
                      <span key={secIdx} className="px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 text-[10px] font-medium">
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* General Partners & Global Presence */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" /> General Partners & Offices
              </h5>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Prominent GPs / Partners</div>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">
                  {fund.keyPartners.join(' • ')}
                </p>
              </div>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-bold mb-1">Global Office Presence</div>
                <p className="text-xs text-slate-600 font-mono">
                  {fund.globalPresence.join(' | ')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer with External Links */}
        <div className="p-5 sm:px-8 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {fund.website && (
              <a
                href={fund.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {fund.linkedin && (
              <a
                href={fund.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </a>
            )}
            {fund.twitter && (
              <a
                href={fund.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors"
              >
                <XIcon className="w-3.5 h-3.5" />
                <span>Twitter / X</span>
              </a>
            )}
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            Global VC Intelligence DB
          </span>
        </div>
      </div>
    </div>
  );
}
