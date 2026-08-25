import React from 'react';
import { TrendingUp, PieChart, BarChart3, Globe, Award, Sparkles, Building, Layers } from 'lucide-react';
import { getTierBadgeStyle } from '../data/categories';

export default function AnalyticsView({ funds, onSelectFund }) {
  // Aggregate stats
  const totalAumBillions = funds.reduce((acc, f) => acc + (f.aumNumeric / 1000), 0);

  // Funds by Tier
  const tierDistribution = funds.reduce((acc, f) => {
    acc[f.tierShort] = (acc[f.tierShort] || 0) + 1;
    return acc;
  }, {});

  // Funds by Region
  const regionDistribution = funds.reduce((acc, f) => {
    acc[f.region] = (acc[f.region] || 0) + 1;
    return acc;
  }, {});

  // Top 10 by AUM
  const topAumFunds = [...funds].sort((a, b) => b.aumNumeric - a.aumNumeric).slice(0, 10);

  // Top Exits Frequency across all tracked funds
  const exitCounts = {};
  funds.forEach((f) => {
    f.notableExits.forEach((exit) => {
      exitCounts[exit] = (exitCounts[exit] || 0) + 1;
    });
  });
  const topBackedExits = Object.entries(exitCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  // Top Active AI & Unicorn Portfolio
  const activeCounts = {};
  funds.forEach((f) => {
    f.activePortfolio.forEach((co) => {
      activeCounts[co] = (activeCounts[co] || 0) + 1;
    });
  });
  const topActiveUnicorns = Object.entries(activeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner Analytics Summary */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Global VC Intelligence Insights</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
            Venture Capital Capital Deployment & Performance Dynamics
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Statistical breakdown of the world's highest performing venture firms. Analyzing ${totalAumBillions.toFixed(0)}B+ in tracked Assets Under Management, regional clusters, and syndicate backing for decacorns.
          </p>
        </div>
      </div>

      {/* Grid of Analytical Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard: Top 10 by AUM */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>Top 10 Global Funds by Assets Under Management</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Ranked by AUM</span>
          </div>

          <div className="space-y-3 pt-2">
            {topAumFunds.map((fund, idx) => {
              const maxAum = topAumFunds[0].aumNumeric;
              const percent = (fund.aumNumeric / maxAum) * 100;

              return (
                <div
                  key={fund.id}
                  onClick={() => onSelectFund(fund)}
                  className="group cursor-pointer hover:bg-slate-50 p-2 rounded-xl transition-all"
                >
                  <div className="flex items-center justify-between text-xs font-semibold mb-1">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-mono text-slate-400 w-4">#{idx + 1}</span>
                      <span className="text-slate-900 group-hover:text-indigo-600 truncate">{fund.name}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] ${getTierBadgeStyle(fund.tier)}`}>
                        {fund.tierShort}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{fund.aum}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full group-hover:opacity-90 transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Most Backed Generation-Defining Companies */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>Most Backed Tech Companies (Syndicate Overlap)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">By Top VC Backers</span>
          </div>

          <p className="text-xs text-slate-500">
            Number of top-ranked global venture firms holding early-stage or growth positions in each titan:
          </p>

          <div className="grid grid-cols-2 gap-2.5 pt-1">
            {topBackedExits.map(([company, count], idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between"
              >
                <div>
                  <div className="font-heading font-bold text-slate-900 text-sm">{company}</div>
                  <div className="text-[11px] text-slate-500 font-medium">Generation Exit</div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 text-xs">
                    {count} Funds
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <span>Regional Capital Concentration</span>
          </h3>

          <div className="space-y-3 pt-2">
            {Object.entries(regionDistribution).map(([reg, count], idx) => {
              const pct = Math.round((count / funds.length) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-800">{reg}</span>
                    <span className="font-mono text-slate-500">{count} Funds ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Active AI & Frontier Unicorns */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-2xs space-y-4">
          <h3 className="font-heading font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Hottest Active Unicorns (Multi-VC Portfolio)</span>
          </h3>

          <div className="grid grid-cols-2 gap-2.5 pt-2">
            {topActiveUnicorns.map(([company, count], idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-center justify-between"
              >
                <div>
                  <div className="font-heading font-bold text-slate-900 text-sm">{company}</div>
                  <div className="text-[10px] text-indigo-700 font-semibold">Active Unicorn</div>
                </div>
                <span className="font-mono font-bold text-xs text-indigo-800 bg-white px-2 py-0.5 rounded border border-indigo-200">
                  {count} VCs
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
