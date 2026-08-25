import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import StatsBar from './components/StatsBar';
import VCCard from './components/VCCard';
import VCTable from './components/VCTable';
import VCModal from './components/VCModal';
import CompareModal from './components/CompareModal';
import AnalyticsView from './components/AnalyticsView';
import ContactModal from './components/ContactModal';
import AuthModal from './components/AuthModal';
import Footer from './components/Footer';
import { AuthProvider, useAuth } from './context/AuthContext';
import { VC_FUNDS } from './data/vcFunds';
import { slugify } from './data/categories';
import { Search, Sparkles, ArrowUp, Scale } from 'lucide-react';

const BASE_ORIGIN = 'https://topvc.flugelsoft.com';

export function updateSEO({ title, description, canonicalUrl, fund = null }) {
  document.title = title;

  const setMeta = (selector, attr, value) => {
    const el = document.querySelector(selector);
    if (el) el.setAttribute(attr, value);
  };

  setMeta('meta[name="description"]', 'content', description);
  setMeta('meta[name="title"]', 'content', title);
  setMeta('link[rel="canonical"]', 'href', canonicalUrl);
  setMeta('meta[property="og:title"]', 'content', title);
  setMeta('meta[property="og:description"]', 'content', description);
  setMeta('meta[property="og:url"]', 'content', canonicalUrl);

  setMeta('meta[name="twitter:title"]', 'content', title);
  setMeta('meta[name="twitter:description"]', 'content', description);
  setMeta('meta[name="twitter:url"]', 'content', canonicalUrl);

  // Dynamic Schema.org JSON-LD injection
  let scriptEl = document.getElementById('dynamic-vc-schema');
  if (fund) {
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'dynamic-vc-schema';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    scriptEl.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FinancialService',
      'name': fund.name,
      'description': fund.description,
      'url': fund.website || canonicalUrl,
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': fund.hq
      },
      'knowsAbout': fund.sectors,
      'member': fund.keyPartners.map((name) => ({
        '@type': 'Person',
        'name': name
      }))
    });
  } else if (scriptEl) {
    scriptEl.remove();
  }
}

function MainApp() {
  const { currentUser, requireAuth, openAuthModal } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All Tiers');
  const [selectedRegion, setSelectedRegion] = useState('All Regions');
  const [selectedStage, setSelectedStage] = useState('All Stages');
  const [selectedSector, setSelectedSector] = useState('All Sectors');
  const [indiaFilterOnly, setIndiaFilterOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table' | 'analytics'
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedFund, setSelectedFund] = useState(null);
  const [comparedFunds, setComparedFunds] = useState([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Favorites state persisted in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('vc_funds_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('vc_funds_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  // Global Link Click Interceptor: Any link clicked on the homepage requires Google Auth
  useEffect(() => {
    const handleGlobalLinkClick = (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      // If user is not authenticated and clicked any navigation or external link
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        if (!currentUser) {
          e.preventDefault();
          e.stopPropagation();
          openAuthModal({
            targetUrl: href,
            title: 'Google Sign-In Required',
            message: `Sign in or register with Google to access ${href} and unlock full platform features.`
          });
        }
      }
    };

    document.addEventListener('click', handleGlobalLinkClick, true);
    return () => document.removeEventListener('click', handleGlobalLinkClick, true);
  }, [currentUser, openAuthModal]);

  // Handle URL deep-linking on initial mount and browser back/forward
  useEffect(() => {
    const handleUrlParams = () => {
      const pathname = window.location.pathname;
      const params = new URLSearchParams(window.location.search);

      let fundSlug = null;
      if (pathname.startsWith('/fund/')) {
        fundSlug = pathname.replace('/fund/', '').replace(/\/$/, '').toLowerCase();
      }

      if (!fundSlug) {
        fundSlug = params.get('fund') || params.get('vc');
      }

      const queryParam = params.get('q');
      const tierParam = params.get('tier');
      const indiaParam = params.get('india');

      if (indiaParam === 'true') {
        setIndiaFilterOnly(true);
      }

      if (fundSlug) {
        const found = VC_FUNDS.find(
          (f) => slugify(f.name) === fundSlug.toLowerCase() || f.id === fundSlug
        );
        if (found) {
          setSelectedFund(found);
          const slug = slugify(found.name);
          updateSEO({
            title: `${found.name} (#${found.rank} Global & India VC) | Top Venture Capital Funds Directory`,
            description: `${found.name} is ranked in the Global & India VC Index (${found.tier}) with ${found.aum} in AUM. Notable exits: ${found.notableExits.slice(0, 4).join(', ')}.`,
            canonicalUrl: `${BASE_ORIGIN}/fund/${slug}`,
            fund: found
          });
        }
      } else {
        setSelectedFund(null);
        updateSEO({
          title: 'Top Venture Capital (VC) Funds Globally & India | Market Prestige, AUM & Track Record',
          description: 'Comprehensive global and India directory of top Venture Capital (VC) funds categorized by prestige tiers, investment stage, AUM, and track record of backing generation-defining tech companies.',
          canonicalUrl: `${BASE_ORIGIN}/`
        });
      }

      if (queryParam) {
        setSearchTerm(queryParam);
      }
      if (tierParam) {
        const matchedTier = VC_FUNDS.find((f) => slugify(f.tier) === tierParam.toLowerCase());
        if (matchedTier) setSelectedTier(matchedTier.tier);
      }
    };

    handleUrlParams();
    window.addEventListener('popstate', handleUrlParams);
    return () => window.removeEventListener('popstate', handleUrlParams);
  }, []);

  // Scroll to top watcher
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Select Fund (Guarded with Google Auth)
  const handleSelectFund = (fund) => {
    if (!fund) {
      setSelectedFund(null);
      window.history.pushState({}, '', '/');
      updateSEO({
        title: 'Top Venture Capital (VC) Funds Globally & India | Market Prestige, AUM & Track Record',
        description: 'Comprehensive global and India directory of top Venture Capital (VC) funds categorized by prestige tiers, investment stage, AUM, and track record of backing generation-defining tech companies.',
        canonicalUrl: `${BASE_ORIGIN}/`
      });
      return;
    }

    requireAuth(null, () => {
      setSelectedFund(fund);
      const slug = slugify(fund.name);
      window.history.pushState({ fundId: fund.id }, '', `/fund/${slug}`);
      updateSEO({
        title: `${fund.name} (#${fund.rank} Global & India VC) | Top Venture Capital Funds Directory`,
        description: `${fund.name} is ranked in the Global & India VC Index (${fund.tier}) with ${fund.aum} in AUM. Notable exits: ${fund.notableExits.slice(0, 4).join(', ')}.`,
        canonicalUrl: `${BASE_ORIGIN}/fund/${slug}`,
        fund: fund
      });
    }, {
      title: `Sign In to View ${fund.name} Intelligence`,
      message: `Sign in or register with Google to unlock ${fund.name}'s verified investment thesis, return metrics, check sizes, and GP contacts.`
    });
  };

  const toggleFavorite = (id) => {
    requireAuth(null, () => {
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }, {
      title: 'Sign In to Bookmark Fund',
      message: 'Sign in with Google to save and sync your shortlisted VC funds to your personal target list.'
    });
  };

  const toggleCompare = (fund) => {
    requireAuth(null, () => {
      setComparedFunds((prev) => {
        const exists = prev.some((f) => f.id === fund.id);
        if (exists) {
          return prev.filter((f) => f.id !== fund.id);
        }
        if (prev.length >= 4) {
          alert('You can compare up to 4 VC funds simultaneously.');
          return prev;
        }
        return [...prev, fund];
      });
    }, {
      title: 'Sign In to Compare VC Funds',
      message: 'Sign in with Google to compare funds side-by-side on AUM, check sizes, stages, and exits.'
    });
  };

  const handleOpenCompare = () => {
    requireAuth(null, () => {
      setIsCompareOpen(true);
    }, {
      title: 'Sign In to Open Comparison Matrix',
      message: 'Sign in with Google to view your side-by-side VC fund comparison.'
    });
  };

  const handleOpenContact = () => {
    requireAuth(null, () => {
      setIsContactOpen(true);
    }, {
      title: 'Sign In to Contact & Submit Updates',
      message: 'Sign in or register with Google to submit intelligence updates or message the editorial team.'
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedTier('All Tiers');
    setSelectedRegion('All Regions');
    setSelectedStage('All Stages');
    setSelectedSector('All Sectors');
    setIndiaFilterOnly(false);
    setShowFavoritesOnly(false);
  };

  // Filtered VC Funds
  const filteredFunds = useMemo(() => {
    return VC_FUNDS.filter((fund) => {
      // Saved Favorites Filter
      if (showFavoritesOnly && !favorites.includes(fund.id)) {
        return false;
      }

      // India Active Filter
      if (indiaFilterOnly && !fund.hasIndiaInvestments) {
        return false;
      }

      // Tier Filter
      if (selectedTier !== 'All Tiers' && fund.tier !== selectedTier) {
        return false;
      }

      // Region Filter
      if (selectedRegion !== 'All Regions' && fund.region !== selectedRegion) {
        return false;
      }

      // Stage Filter
      if (selectedStage !== 'All Stages') {
        const matchesStage = fund.stage.includes(selectedStage) || fund.primaryStage === selectedStage;
        if (!matchesStage) return false;
      }

      // Sector Filter
      if (selectedSector !== 'All Sectors') {
        const matchesSector = fund.sectors.includes(selectedSector);
        if (!matchesSector) return false;
      }

      // Search Query Filter (Searches Fund Name, Exits, Active Portfolio, Partners, HQ, Description)
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const inName = fund.name.toLowerCase().includes(query);
        const inHq = fund.hq.toLowerCase().includes(query);
        const inTier = fund.tier.toLowerCase().includes(query);
        const inExits = fund.notableExits.some((e) => e.toLowerCase().includes(query));
        const inPortfolio = fund.activePortfolio.some((c) => c.toLowerCase().includes(query));
        const inPartners = fund.keyPartners.some((p) => p.toLowerCase().includes(query));
        const inSectors = fund.sectors.some((s) => s.toLowerCase().includes(query));
        const inDesc = fund.description.toLowerCase().includes(query);

        return inName || inHq || inTier || inExits || inPortfolio || inPartners || inSectors || inDesc;
      }

      return true;
    });
  }, [searchTerm, selectedTier, selectedRegion, selectedStage, selectedSector, indiaFilterOnly, showFavoritesOnly, favorites]);

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(filteredFunds, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `global_india_vc_funds_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['Rank', 'Fund Name', 'Prestige Tier', 'AUM', 'HQ Location', 'Region', 'Has India Investments', 'Primary Stage', 'Check Size', 'Generation-Defining Exits', 'Active Portfolio Unicorns', 'Key Partners', 'Website'];
    const rows = filteredFunds.map((f) => [
      f.rank,
      `"${f.name.replace(/"/g, '""')}"`,
      `"${f.tier.replace(/"/g, '""')}"`,
      `"${f.aum.replace(/"/g, '""')}"`,
      `"${f.hq.replace(/"/g, '""')}"`,
      `"${f.region.replace(/"/g, '""')}"`,
      f.hasIndiaInvestments ? 'Yes' : 'No',
      `"${f.primaryStage.replace(/"/g, '""')}"`,
      `"${f.checkSize.replace(/"/g, '""')}"`,
      `"${f.notableExits.join(' | ').replace(/"/g, '""')}"`,
      `"${f.activePortfolio.join(' | ').replace(/"/g, '""')}"`,
      `"${f.keyPartners.join(' | ').replace(/"/g, '""')}"`,
      `"${f.website}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `global_india_vc_funds_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <Header
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedTier={selectedTier}
        setSelectedTier={setSelectedTier}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        selectedStage={selectedStage}
        setSelectedStage={setSelectedStage}
        selectedSector={selectedSector}
        setSelectedSector={setSelectedSector}
        indiaFilterOnly={indiaFilterOnly}
        setIndiaFilterOnly={setIndiaFilterOnly}
        viewMode={viewMode}
        setViewMode={setViewMode}
        showFavoritesOnly={showFavoritesOnly}
        setShowFavoritesOnly={setShowFavoritesOnly}
        favoritesCount={favorites.length}
        comparedFundsCount={comparedFunds.length}
        onOpenCompare={handleOpenCompare}
        totalFunds={VC_FUNDS.length}
        filteredCount={filteredFunds.length}
        onExportJson={handleExportJson}
        onExportCsv={handleExportCsv}
        onOpenContact={handleOpenContact}
        onResetFilters={handleResetFilters}
      />

      {/* Global Stats Metrics Banner */}
      <StatsBar funds={VC_FUNDS} />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {viewMode === 'analytics' ? (
          /* Analytics & Leaderboard View */
          <AnalyticsView
            funds={filteredFunds.length > 0 ? filteredFunds : VC_FUNDS}
            onSelectFund={handleSelectFund}
          />
        ) : filteredFunds.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 rounded-3xl bg-white border border-slate-200 shadow-sm p-8 my-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center mx-auto text-indigo-600 mb-4">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold font-heading text-slate-900 mb-2">No matching VC funds found</h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              We couldn't find any venture capital firms matching your search query or filter selections. Try resetting filters or searching for portfolio titans like Peak XV, Zomato, Swiggy, or Razorpay.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-500/20 hover:bg-indigo-700 transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFunds.map((fund) => (
              <VCCard
                key={fund.id}
                fund={fund}
                isFavorite={favorites.includes(fund.id)}
                onToggleFavorite={toggleFavorite}
                onSelectFund={handleSelectFund}
                isCompared={comparedFunds.some((c) => c.id === fund.id)}
                onToggleCompare={toggleCompare}
              />
            ))}
          </div>
        ) : (
          /* Table Matrix View */
          <VCTable
            funds={filteredFunds}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSelectFund={handleSelectFund}
            comparedFunds={comparedFunds}
            onToggleCompare={toggleCompare}
          />
        )}
      </main>

      {/* Deep Dive Fund Intelligence Modal */}
      <VCModal
        fund={selectedFund}
        isOpen={Boolean(selectedFund)}
        onClose={() => handleSelectFund(null)}
        isFavorite={selectedFund ? favorites.includes(selectedFund.id) : false}
        onToggleFavorite={toggleFavorite}
        isCompared={selectedFund ? comparedFunds.some((c) => c.id === selectedFund.id) : false}
        onToggleCompare={toggleCompare}
      />

      {/* Side-by-Side Comparison Modal */}
      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        comparedFunds={comparedFunds}
        onRemoveFund={(id) => setComparedFunds((prev) => prev.filter((f) => f.id !== id))}
        onClearCompare={() => setComparedFunds([])}
        onSelectFund={handleSelectFund}
      />

      {/* Contact / Update Request Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Google Authentication & Registration Modal */}
      <AuthModal />

      {/* Scroll to Top Floating Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 p-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-xl shadow-indigo-500/30 transition-all z-40 animate-in fade-in cursor-pointer"
          title="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <Footer onOpenContact={handleOpenContact} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
