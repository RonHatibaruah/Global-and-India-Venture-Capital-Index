import React, { useState } from 'react';
import { X, Star, ExternalLink, Share2, Check, Sparkles, Building2, Globe, Award, TrendingUp, Layers, Users, DollarSign, Scale, Lock } from 'lucide-react';
import { getTierBadgeStyle, getStageBadgeStyle, slugify } from '../data/categories';
import { LinkedInIcon, XIcon } from './Icons';
import { useAuth } from '../context/AuthContext';

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
  const { currentUser, requireAuth } = useAuth();

  if (!isOpen || !fund) return null;

  const handleCopy = () => {
    const shareUrl = `${window.location.origin}/fund/${slugify(fund.name)}`;
    const text = `${fund.name} (#${fund.rank} Global & India VC | ${fund.tier})\nAUM: ${fund.aum} | Stage: ${fund.primaryStage}\nTop Exits: ${fund.notableExits.join(', ')}\nDetails: ${shareUrl}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExternalLink = (e, url, label) => {
    requireAuth(e, url, {
      title: `Sign In to Access ${fund.name} ${label}`,
      message: `Please sign in or register with Google to access ${fund.name}'s official ${label.toLowerCase()} portal and verified contacts.`
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Top Accent Gradient Bar based on Tier */}
        <div
          className="h-2 w-full shrink-0"
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

        {/* Modal Header */}
        <div className="p-6 sm:px-8 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getTierBadgeStyle(fund.tier)}`}>
              <Award className="w-3.5 h-3.5 mr-1" />
              {fund.tier}
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-bold bg-slate-900 text-white">
              Global Rank #{fund.rank}
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {fund.primaryStage}
            </span>
            {fund.hasIndiaInvestments && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                🇮🇳 India Active
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {/* Compare Toggle */}
            <button
              onClick={() => onToggleCompare(fund)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isCompared
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-indigo-600'
              }`}
              title={isCompared ? 'Remove from comparison' : 'Add to side-by-side compare'}
            >
              <Scale className="w-4 h-4" />
            </button>

            {/* Favorite Toggle */}
            <button
              onClick={() => onToggleFavorite(fund.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFavorite
                  ? 'bg-amber-50 text-amber-600 border-amber-300'
                  : 'bg-white text-slate-500 border-slate-200 hover:text-amber-600'
              }`}
              title={isFavorite ? 'Saved to target list' : 'Save to target list'}
            >
              <Star className={`w-4 h-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
            </button>

            {/* Share Link */}
            <button
              onClick={handleCopy}
              className="p-2 rounded-xl border bg-white text-slate-500 border-slate-200 hover:text-slate-900 transition-all cursor-pointer"
              title="Copy shareable link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          {/* Main Title & Key Numbers */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black font-heading text-xl shadow-md shrink-0"
                style={{ backgroundColor: fund.logoColor || '#0F172A' }}
              >
                #{fund.rank}
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight">
                  {fund.name}
                </h3>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 font-medium">
                  <span className="flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    {fund.hq}
                  </span>
                  <span>•</span>
                  <span>Founded in {fund.founded}</span>
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
              <Sparkles className="w-4 h-4 text-indigo-600" /> Investment Thesis &amp; Market Prestige Overview
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
              <Award className="w-4 h-4 text-amber-600" /> Generation-Defining Exits &amp; Multi-Billion IPOs
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

          {/* Active Unicorn Portfolio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" /> Active Unicorn &amp; Growth Portfolio Backed
            </h4>
            <div className="flex flex-wrap gap-2">
              {fund.activePortfolio.map((co, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-indigo-50/70 text-indigo-950 border border-indigo-200 shadow-2xs"
                >
                  {co}
                </span>
              ))}
            </div>
          </div>

          {/* Detailed Criteria Matrix Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Investment Stages & Sector Themes */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-600" /> Stage Mandate &amp; Sectors
              </h5>
              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Stages Backed:</span>
                  <div className="flex flex-wrap gap-1">
                    {fund.stage.map((stg, stgIdx) => (
                      <span key={stgIdx} className="px-2 py-0.5 rounded bg-indigo-100/80 text-indigo-800 text-[10px] font-bold">
                        {stg}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block mb-1">Core Sectors:</span>
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
                <Users className="w-3.5 h-3.5 text-indigo-600" /> General Partners &amp; Offices
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

        {/* Modal Footer with Protected External Links */}
        <div className="p-5 sm:px-8 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            {fund.website && (
              <button
                onClick={(e) => handleExternalLink(e, fund.website, 'Official Website')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-sm cursor-pointer"
              >
                <span>Visit Official Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
            {fund.linkedin && (
              <button
                onClick={(e) => handleExternalLink(e, fund.linkedin, 'LinkedIn')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer"
              >
                <LinkedInIcon className="w-3.5 h-3.5" />
                <span>LinkedIn</span>
              </button>
            )}
            {fund.twitter && (
              <button
                onClick={(e) => handleExternalLink(e, fund.twitter, 'Twitter / X')}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors cursor-pointer"
              >
                <XIcon className="w-3.5 h-3.5" />
                <span>Twitter / X</span>
              </button>
            )}
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {currentUser ? 'Verified Access' : 'Google Auth Protected'}
          </span>
        </div>
      </div>
    </div>
  );
}
