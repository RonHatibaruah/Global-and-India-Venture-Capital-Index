import React, { useState } from 'react';
import { Star, ExternalLink, Share2, Check, ArrowUpDown, Scale, Award, Globe } from 'lucide-react';
import { getTierBadgeStyle, getStageBadgeStyle, slugify } from '../data/categories';

export default function VCTable({
  funds,
  favorites,
  onToggleFavorite,
  onSelectFund,
  comparedFunds,
  onToggleCompare
}) {
  const [copiedId, setCopiedId] = useState(null);
  const [sortField, setSortField] = useState('rank');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc' | 'desc'

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const sortedFunds = [...funds].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (sortField === 'aumNumeric') {
      aVal = a.aumNumeric;
      bVal = b.aumNumeric;
    }

    if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const handleCopy = (fund, e) => {
    e.stopPropagation();
    const text = `${fund.name} (#${fund.rank} Global VC) | Tier: ${fund.tier} | AUM: ${fund.aum} | Notable Exits: ${fund.notableExits.slice(0, 5).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedId(fund.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="rounded-2xl bg-white overflow-hidden border border-slate-200 shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-3 w-10 text-center">Save</th>
              <th className="py-3.5 px-3 w-10 text-center">Comp</th>
              <th
                onClick={() => handleSort('rank')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Rank</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('name')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>VC Fund & HQ</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('tier')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>Prestige Tier</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => handleSort('aumNumeric')}
                className="py-3.5 px-4 cursor-pointer hover:text-slate-800 transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>AUM</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">Investment Stage</th>
              <th className="py-3.5 px-4">Generation-Defining Exits</th>
              <th className="py-3.5 px-4">Active Unicorns</th>
              <th className="py-3.5 px-4">Key Partners</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {sortedFunds.map((fund) => {
              const isFav = favorites.includes(fund.id);
              const isComp = comparedFunds.some((c) => c.id === fund.id);

              return (
                <tr
                  key={fund.id}
                  onClick={() => onSelectFund(fund)}
                  className={`hover:bg-slate-50/90 cursor-pointer transition-colors group ${
                    isComp ? 'bg-indigo-50/40' : ''
                  }`}
                >
                  {/* Bookmark Button */}
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleFavorite(fund.id)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isFav
                          ? 'bg-amber-50 text-amber-600 border-amber-300 shadow-2xs'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-amber-600'
                      }`}
                      title={isFav ? 'Saved' : 'Bookmark'}
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </td>

                  {/* Compare Check */}
                  <td className="py-3 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onToggleCompare(fund)}
                      className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                        isComp
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                          : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-indigo-600'
                      }`}
                      title={isComp ? 'Remove from compare' : 'Compare'}
                    >
                      <Scale className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  {/* Rank */}
                  <td className="py-3 px-4">
                    <span className="font-mono font-extrabold text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-900 border border-slate-200">
                      #{fund.rank}
                    </span>
                  </td>

                  {/* Fund Name & HQ */}
                  <td className="py-3 px-4 min-w-[190px]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg text-white font-extrabold text-xs flex items-center justify-center shrink-0"
                        style={{ backgroundColor: fund.logoColor || '#0F172A' }}
                      >
                        {fund.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <div className="font-heading font-extrabold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                          {fund.name}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 truncate">
                          <Globe className="w-3 h-3 text-slate-400" />
                          {fund.hq}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Prestige Tier */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getTierBadgeStyle(fund.tier)}`}>
                      {fund.tierShort}
                    </span>
                  </td>

                  {/* AUM */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      {fund.aum}
                    </span>
                  </td>

                  {/* Primary Stage */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${getStageBadgeStyle(fund.primaryStage)}`}>
                      {fund.primaryStage}
                    </span>
                  </td>

                  {/* Notable Exits */}
                  <td className="py-3 px-4 min-w-[220px] max-w-[280px]">
                    <div className="flex flex-wrap gap-1">
                      {fund.notableExits.slice(0, 4).map((exit, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-medium">
                          {exit}
                        </span>
                      ))}
                      {fund.notableExits.length > 4 && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          +{fund.notableExits.length - 4}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Active Unicorns */}
                  <td className="py-3 px-4 min-w-[180px]">
                    <div className="flex flex-wrap gap-1">
                      {fund.activePortfolio.slice(0, 3).map((co, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[10px] font-medium border border-indigo-100">
                          {co}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Key Partners */}
                  <td className="py-3 px-4 min-w-[160px]">
                    <span className="text-slate-700 font-medium text-[11px] truncate block">
                      {fund.keyPartners.slice(0, 2).join(', ')}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={(e) => handleCopy(fund, e)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-white text-slate-500 hover:text-slate-900 transition-colors"
                        title="Copy summary"
                      >
                        {copiedId === fund.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => onSelectFund(fund)}
                        className="p-1.5 rounded-lg border border-slate-200 hover:border-indigo-200 bg-white text-slate-700 hover:text-indigo-600 transition-colors"
                        title="View fund intelligence"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
