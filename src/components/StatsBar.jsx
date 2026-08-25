import React from 'react';
import { DollarSign, Award, Globe, TrendingUp, Sparkles, Building2 } from 'lucide-react';

export default function StatsBar({ funds }) {
  const totalAumBillions = funds.reduce((acc, f) => acc + (f.aumNumeric / 1000), 0);
  const totalFunds = funds.length;
  const indiaFundsCount = funds.filter(f => f.hasIndiaInvestments).length;
  const allUniqueExits = new Set(funds.flatMap(f => f.notableExits)).size;
  const allHubs = new Set(funds.map(f => f.hq.split(',')[0].trim())).size;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Aggregate AUM */}
        <div className="bg-white p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              ${totalAumBillions.toFixed(0)}B+
            </div>
            <div className="text-xs text-slate-500 font-medium">Tracked Global &amp; India AUM</div>
          </div>
        </div>

        {/* India Active Investments */}
        <div className="bg-white p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              {indiaFundsCount} Funds
            </div>
            <div className="text-xs text-slate-500 font-medium">🇮🇳 Active India Investments</div>
          </div>
        </div>

        {/* Generation-Defining Exits Backed */}
        <div className="bg-white p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              {allUniqueExits}+
            </div>
            <div className="text-xs text-slate-500 font-medium">Mega IPO &amp; M&amp;A Exits</div>
          </div>
        </div>

        {/* Global & Indian Startup Hubs */}
        <div className="bg-white p-4 rounded-2xl flex items-center gap-3.5 border border-slate-200 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="p-2.5 rounded-xl bg-cyan-50 text-cyan-700 border border-cyan-200">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black font-heading text-slate-900">
              {allHubs}+ Hubs
            </div>
            <div className="text-xs text-slate-500 font-medium">Bengaluru • Mumbai • Silicon Valley</div>
          </div>
        </div>
      </div>
    </div>
  );
}
