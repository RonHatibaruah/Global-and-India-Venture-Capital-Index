import React from 'react';
import { Mail, ExternalLink, ShieldAlert, Globe, Award, TrendingUp, Layers, Users } from 'lucide-react';
import { LinkedInIcon } from './Icons';

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
                <span className="bg-gradient-to-tr from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">VC</span>
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900 font-heading tracking-tight">
                  Global &amp; India <span className="text-indigo-600">Venture Capital</span> Index
                </div>
                <div className="text-xs text-slate-500">
                  Global Sovereign Database &amp; Fund Performance Benchmark
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              An independent, comprehensive ranking of the world's most prestigious Venture Capital firms and India-dedicated funds, categorized by Assets Under Management (AUM), historical DPI/IRR returns, investment stages, and generation-defining tech exits.
            </p>

            {/* Curators Badges & LinkedIn Links */}
            <div className="pt-2 space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-indigo-600" /> Curated By
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <a
                  href="https://www.linkedin.com/in/ronhatibaruah/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all shadow-2xs group cursor-pointer"
                  title="Connect with Ron Hatibaruah on LinkedIn"
                >
                  <LinkedInIcon className="w-3.5 h-3.5 group-hover:text-white text-blue-600" />
                  <span><strong>Ron Hatibaruah</strong></span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </a>

                <a
                  href="https://www.linkedin.com/in/kalyanjit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white border border-blue-200 transition-all shadow-2xs group cursor-pointer"
                  title="Connect with Kalyanjit Hatibaruah on LinkedIn"
                >
                  <LinkedInIcon className="w-3.5 h-3.5 group-hover:text-white text-blue-600" />
                  <span><strong>Kalyanjit Hatibaruah</strong></span>
                  <ExternalLink className="w-3 h-3 opacity-60 ml-0.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Ranking Methodology Highlights */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Ranking &amp; Evaluation Methodology
            </h4>
            <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <Award className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Market Prestige &amp; Sovereign Standing:</strong> Multi-decade reputation, institutional LP demand, and lead term sheet preference.</span>
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
              Database Resources &amp; Connect
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a
                  href="https://www.linkedin.com/in/ronhatibaruah/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <LinkedInIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ron Hatibaruah (LinkedIn)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/in/kalyanjit"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-600 transition-colors flex items-center gap-1.5"
                >
                  <LinkedInIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>Kalyanjit Hatibaruah (LinkedIn)</span>
                </a>
              </li>
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

        {/* Disclaimer & Integrity Box */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <div className="rounded-2xl bg-amber-50/70 p-4 sm:p-5 border border-amber-200/80 text-[11px] leading-relaxed text-amber-950 space-y-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold uppercase tracking-wide text-xs">
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span>Legal Disclaimer &amp; Information Notice</span>
            </div>
            <p>
              The <strong>Global &amp; India Venture Capital Index</strong> is an independent educational, research, and startup fundraising intelligence resource compiled from public SEC filings, verified venture capital disclosures, fund press releases, and market data sources.
            </p>
            <p className="text-amber-900/90">
              This platform does not constitute financial, investment, legal, or tax advice, nor is it an offer, solicitation, or recommendation to invest in any fund, security, or financial instrument. All trademarks, company names, logos, and registered marks remain the exclusive property of their respective venture capital firms, portfolio corporations, and organizations.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-6 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="text-slate-500 text-center sm:text-left">
            © {currentYear} <strong>Global &amp; India Venture Capital Index</strong>. Curated by{' '}
            <a
              href="https://www.linkedin.com/in/ronhatibaruah/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
            >
              Ron Hatibaruah
            </a>{' '}
            &amp;{' '}
            <a
              href="https://www.linkedin.com/in/kalyanjit"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:text-indigo-800 font-semibold hover:underline"
            >
              Kalyanjit Hatibaruah
            </a>
            . All rights reserved.
          </div>

          <div className="flex items-center gap-3 text-slate-500 flex-wrap justify-center sm:justify-end">
            <a
              href="https://www.linkedin.com/in/ronhatibaruah/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <LinkedInIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Ron Hatibaruah</span>
            </a>
            <span>•</span>
            <a
              href="https://www.linkedin.com/in/kalyanjit"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <LinkedInIcon className="w-3.5 h-3.5 text-blue-600" />
              <span>Kalyanjit Hatibaruah</span>
            </a>
            <span>•</span>
            <span>Bengaluru • Silicon Valley • Global Hubs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
