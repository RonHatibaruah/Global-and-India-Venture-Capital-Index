import React from 'react';
import { Mail, ExternalLink, ShieldCheck, Globe, Award, TrendingUp, Layers } from 'lucide-react';

export default function Footer({ onOpenContact }) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 mt-auto">
      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Overview */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                <span className="bg-gradient-to-tr from-emerald-400 to-cyan-400 bg-clip-text text-transparent">VC</span>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 font-heading tracking-tight">
                  Global <span className="text-indigo-600">Venture Capital</span> Index
                </div>
                <div className="text-xs text-slate-500">
                  Global Sovereign Database & Fund Performance Benchmark
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              An independent, comprehensive ranking of the world's most prestigious Venture Capital firms, categorized by Assets Under Management (AUM), historical DPI/IRR returns, investment stages, and track record of backing generation-defining tech giants.
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="font-medium text-slate-700">Verified Database:</span>
                <span className="font-mono text-indigo-600 font-semibold">Tier 1 - Tier 6 Global Funds</span>
              </span>
            </div>
          </div>

          {/* Ranking Methodology Highlights */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Ranking & Evaluation Methodology
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Market Prestige & Sovereign Standing:</strong> Multi-decade reputation, institutional LP demand, and lead term sheet preference.</span>
              </li>
              <li className="flex items-start gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Historical Returns &amp; DPI:</strong> Track record of producing decacorn exits (&gt; $10B+ market cap) and fund return multiples.</span>
              </li>
              <li className="flex items-start gap-2">
                <Layers className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <span><strong>Assets Under Management (AUM):</strong> Institutional capital deployed across active flagships, growth funds, and frontier vehicles.</span>
              </li>
            </ul>
          </div>

          {/* Quick Actions & Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Database Resources
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={onOpenContact}
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1.5 text-left cursor-pointer"
                >
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Submit VC Profile Update</span>
                </button>
              </li>
              <li>
                <a
                  href="https://news.ycombinator.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                >
                  <Globe className="w-3.5 h-3.5 text-orange-500" />
                  <span>Tech Ecosystem News</span>
                </a>
              </li>
              <li>
                <a
                  href="https://sec.gov/edgar/searchedgar/companysearch"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  <span>SEC Form ADV / 13F Filings</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Integrity Note */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-[11px] leading-relaxed text-slate-500 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-800 font-bold uppercase tracking-wide text-[10px]">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Editorial Integrity & Information Purpose</span>
            </div>
            <p>
              The Global Venture Capital Index is compiled for educational, research, and startup fundraising intelligence purposes. All trademarks, company names, logos, and registered marks remain the property of their respective venture capital firms and portfolio organizations.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-500 text-center sm:text-left">
            © {currentYear} <strong>Global Venture Capital Index</strong>. All rights reserved.
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <span>Built for Founders & Investors</span>
            <span>•</span>
            <span>Silicon Valley • London • Global Hubs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
