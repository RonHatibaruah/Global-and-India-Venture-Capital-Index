import { PRESTIGE_TIERS, REGIONS, INVESTMENT_STAGES, SECTORS } from './vcFunds';

export { PRESTIGE_TIERS, REGIONS, INVESTMENT_STAGES, SECTORS };

export function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

export function getTierBadgeStyle(tier) {
  if (tier.includes('Tier 1')) {
    return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
  }
  if (tier.includes('Tier 2')) {
    return 'bg-blue-50 text-blue-800 border-blue-300 font-semibold';
  }
  if (tier.includes('Tier 3')) {
    return 'bg-amber-50 text-amber-800 border-amber-300 font-semibold';
  }
  if (tier.includes('Tier 4')) {
    return 'bg-purple-50 text-purple-800 border-purple-300 font-semibold';
  }
  if (tier.includes('Tier 5')) {
    return 'bg-sky-50 text-sky-800 border-sky-300 font-semibold';
  }
  if (tier.includes('Tier 6')) {
    return 'bg-rose-50 text-rose-800 border-rose-300 font-semibold';
  }
  return 'bg-slate-100 text-slate-700 border-slate-200 font-medium';
}

export function getStageBadgeStyle(stage) {
  switch (stage) {
    case 'Seed / Pre-Seed':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'Early Stage (Series A-B)':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    case 'Growth / Late Stage':
      return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'Multi-Stage Lifecycle':
      return 'bg-cyan-50 text-cyan-800 border-cyan-200';
    case 'Frontier & DeepTech':
      return 'bg-purple-50 text-purple-700 border-purple-200';
    default:
      return 'bg-slate-50 text-slate-700 border-slate-200';
  }
}
