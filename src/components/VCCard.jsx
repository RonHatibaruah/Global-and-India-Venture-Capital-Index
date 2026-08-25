import React, { useState } from 'react';
import { Star, ExternalLink, Share2, Check, TrendingUp, Building, Globe, Layers, Award, Sparkles, Scale } from 'lucide-react';
import { getTierBadgeStyle, getStageBadgeStyle, slugify } from '../data/categories';
import { LinkedInIcon, XIcon } from './Icons';

export default function VCCard({
  fund,
  isFavorite,
  onToggleFavorite,
  onSelectFund,
  isCompared,
  onToggleCompare
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/fund/${slugify(fund.name)}`;
    const text = `${fund.name} (#${fund.rank} Global & India VC | ${fund.tier})\nAUM: ${fund.aum} | Stage: ${fund.primaryStage}\nTop Exits: ${fund.notableExits.slice(0, 5).join(', ')}\nDetails: ${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      onClick={() => onSelectFund(fund)}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white border transition-all duration-250 cursor-pointer overflow-hidden p-5.5 hover:-translate-y-1 ${
        isCompared
          ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
          : 'border-slate-200/90 shadow-2xs hover:border-slate-400 hover:shadow-xl'
      }`}
    >
      {/* Top Accent Gradient Bar based on Tier */}
      <div
        className="absolute inset-x-0 top-0 h-1.5 opacity-90 transition-opacity group-hover:opacity-100"
        style={{
          background:
            fund.tier.includes('Tier 1')
              ? 'linear-gradient(90deg, #10B981, #059669)'
              : fund.tier.includes('Tier 2')
              ? 'linear-gradient(90deg, #3B82F6, #1D4ED8)'
              : fund.tier.includes('Tier 3')
              ? 'linear-gradient(90deg, #F59E0B, #D97706)'
              : fund.tier.includes('Tier 4')
              ? 'linear-gradient(90deg, #8B5CF6, #6D28D9)'
              : fund.tier.includes('Tier 5')
              ? 'linear-gradient(90deg, #0EA5E9, #0284C7)'
              : 'linear-gradient(90deg, #F43F5E, #E11D48)'
        }}
      />

      <div>
        {/* Header: Rank + Name + Actions */}
        <div className="flex items-start justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-3">
            {/* Rank Avatar / Badge */}
            <div
              className="flex items-center justify-center w-11 h-11 rounded-xl text-white font-extrabold font-heading text-base shadow-sm shrink-0"
              style={{ backgroundColor: fund.logoColor || '#0F172A' }}
              title={`Rank #${fund.rank}`}
            >
              <span>#{fund.rank}</span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-heading font-extrabold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                  {fund.name}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span className="flex items-center gap-1 truncate">
                  <Globe className="w-3 h-3 text-slate-400" />
                  {fund.hq}
                </span>
                <span>•</span>
                <span>Est. {fund.founded}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Compare Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(fund);
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isCompared
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-indigo-600 hover:border-indigo-200'
              }`}
              title={isCompared ? 'Remove from side-by-side compare' : 'Add to compare'}
            >
              <Scale className="w-3.5 h-3.5" />
            </button>

            {/* Favorite / Bookmark */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(fund.id);
              }}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 text-amber-600 border-amber-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-600 hover:border-amber-200'
              }`}
              title={isFavorite ? 'Saved to target list' : 'Bookmark fund'}
            >
              <Star className={`w-3.5 h-3.5 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            {/* Copy Share Link */}
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg border bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-700 hover:border-slate-300 transition-all cursor-pointer"
              title="Copy link & summary"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Tier & AUM Badges + India Badge */}
        <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs border ${getTierBadgeStyle(fund.tier)}`}>
            <Award className="w-3 h-3 mr-1" />
            {fund.tier}
          </span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-slate-900 text-white shadow-2xs">
            AUM: {fund.aum}
          </span>
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium border ${getStageBadgeStyle(fund.primaryStage)}`}>
            {fund.primaryStage}
          </span>
          {fund.hasIndiaInvestments && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
              🇮🇳 India Active
            </span>
          )}
        </div>

        {/* Brief Thesis */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
          {fund.description}
        </p>

        {/* Generation-Defining Exits Showcase */}
        <div className="mb-3.5 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-600" /> Generation-Defining Exits
          </div>
          <div className="flex flex-wrap gap-1.5">
            {fund.notableExits.slice(0, 6).map((exit, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs"
              >
                {exit}
              </span>
            ))}
            {fund.notableExits.length > 6 && (
              <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono text-slate-500 bg-slate-100">
                +{fund.notableExits.length - 6} more
              </span>
            )}
          </div>
        </div>

        {/* Active Portfolio Unicorns */}
        <div className="mb-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-indigo-500" /> Active Unicorns &amp; AI Portfolio
          </div>
          <div className="flex flex-wrap gap-1">
            {fund.activePortfolio.slice(0, 5).map((co, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-indigo-50 text-indigo-900 border border-indigo-200/60"
              >
                {co}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Key Partners & Deep Dive */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
        <div className="min-w-0">
          <div className="text-[10px] uppercase font-bold text-slate-400">Key Partners</div>
          <div className="text-xs font-semibold text-slate-700 truncate">
            {fund.keyPartners.slice(0, 2).join(', ')}
            {fund.keyPartners.length > 2 ? ` +${fund.keyPartners.length - 2}` : ''}
          </div>
        </div>

        <button
          onClick={() => onSelectFund(fund)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-800 transition-all cursor-pointer shadow-2xs"
        >
          <span>Fund Intelligence</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
