import React, { useState } from 'react';
import { Search, Download, Star, LayoutGrid, Table, BarChart3, Scale, Layers, Globe, Filter, X, Mail, Sparkles, LogOut, UserCheck, ShieldAlert } from 'lucide-react';
import { PRESTIGE_TIERS, REGIONS, INVESTMENT_STAGES, SECTORS } from '../data/vcFunds';
import { useAuth } from '../context/AuthContext';
import { GoogleLogo } from './AuthModal';

export default function Header({
  searchTerm,
  setSearchTerm,
  selectedTier,
  setSelectedTier,
  selectedRegion,
  setSelectedRegion,
  selectedStage,
  setSelectedStage,
  selectedSector,
  setSelectedSector,
  indiaFilterOnly,
  setIndiaFilterOnly,
  viewMode,
  setViewMode,
  showFavoritesOnly,
  setShowFavoritesOnly,
  favoritesCount,
  comparedFundsCount,
  onOpenCompare,
  totalFunds,
  filteredCount,
  onExportJson,
  onExportCsv,
  onOpenContact,
  onResetFilters
}) {
  const { currentUser, isAdmin, setAdminModalOpen, openAuthModal, signOut, requireAuth } = useAuth();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isAnyFilterActive =
    searchTerm ||
    selectedTier !== 'All Tiers' ||
    selectedRegion !== 'All Regions' ||
    selectedStage !== 'All Stages' ||
    selectedSector !== 'All Sectors' ||
    indiaFilterOnly ||
    showFavoritesOnly;

  const handleExportJsonClick = (e) => {
    requireAuth(e, () => onExportJson(), {
      title: 'Sign In to Export Database (JSON)',
      message: 'Please sign in or register with Google to download the complete VC fund database in JSON format.'
    });
  };

  const handleExportCsvClick = (e) => {
    requireAuth(e, () => onExportCsv(), {
      title: 'Sign In to Export Investor Pipeline (CSV)',
      message: 'Please sign in or register with Google to download the VC funds spreadsheet in CSV format for your CRM.'
    });
  };

  return (
    <header className="relative border-b border-slate-200 bg-white/95 backdrop-blur-xl sticky top-0 z-30 shadow-xs">
      {/* Top highlight gradient line */}
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-indigo-600 to-amber-500"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Top bar: Brand + Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* Logo Icon */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-slate-900 shadow-md text-white font-extrabold text-xl tracking-tight">
              <span className="bg-gradient-to-tr from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">VC</span>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full ring-2 ring-white animate-pulse"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-heading text-slate-900 tracking-tight">
                  Global &amp; India <span className="text-indigo-600">Venture Capital</span> Index
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Sovereign Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Ranked by Assets Under Management (AUM), Historical Returns, and Decacorn Track Record
              </p>
            </div>
          </div>

          {/* Quick Actions / Compare / Target List / Export / User Auth / Admin */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Admin Dashboard Pill for kalyanjit@gmail.com */}
            {isAdmin && (
              <button
                onClick={() => setAdminModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition-all cursor-pointer ring-2 ring-purple-400/40 animate-in fade-in"
                title="Admin Control Center (kalyanjit@gmail.com)"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin Panel</span>
              </button>
            )}

            {/* India Active Investments Filter Quick Button */}
            <button
              onClick={() => setIndiaFilterOnly(!indiaFilterOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                indiaFilterOnly
                  ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/20'
                  : 'bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100/80'
              }`}
              title="Filter VC funds with active India investments"
            >
              <span>🇮🇳 India Active Funds</span>
            </button>

            {/* Compare Drawer Button */}
            {comparedFundsCount > 0 && (
              <button
                onClick={onOpenCompare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all cursor-pointer animate-in fade-in"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Compare ({comparedFundsCount})</span>
              </button>
            )}

            {/* Saved Target List Button */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                showFavoritesOnly
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              title="Filter target list"
            >
              <Star className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-amber-500 text-amber-500' : 'text-slate-400'}`} />
              <span>Target List</span>
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-white text-[11px] font-mono border border-slate-200">
                {favoritesCount}
              </span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center rounded-xl bg-slate-100 p-0.5 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 font-bold shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-indigo-600 font-bold shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Table Matrix View"
              >
                <Table className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('analytics')}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  viewMode === 'analytics'
                    ? 'bg-white text-indigo-600 font-bold shadow-xs border border-slate-200/80'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Analytics & Leaderboard View"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>

            {/* Export Buttons (Protected with Auth) */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleExportJsonClick}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="Export fund database as JSON"
              >
                <Download className="w-3.5 h-3.5 text-indigo-600" />
                <span className="hidden sm:inline">JSON</span>
              </button>
              <button
                onClick={handleExportCsvClick}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                title="Export fund database as CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">CSV</span>
              </button>
            </div>

            {/* User Profile / Google Sign-In Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-xs font-semibold text-slate-800 transition-all cursor-pointer"
                >
                  {currentUser.photoURL ? (
                    <img
                      src={currentUser.photoURL}
                      alt={currentUser.displayName || 'User Avatar'}
                      className="w-5 h-5 rounded-full ring-1 ring-white"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                      {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="max-w-[100px] truncate hidden sm:inline">
                    {currentUser.displayName ? currentUser.displayName.split(' ')[0] : 'Account'}
                  </span>
                  {isAdmin && (
                    <span className="px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 text-[10px] font-black uppercase">
                      Admin
                    </span>
                  )}
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3.5 py-2 border-b border-slate-100">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {currentUser.displayName || 'Registered User'}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {currentUser.email}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <UserCheck className="w-3 h-3" /> Verified Google Account
                        </div>
                      </div>

                      {/* Admin Panel Direct Action in Dropdown */}
                      {isAdmin && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            setAdminModalOpen(true);
                          }}
                          className="w-full px-3.5 py-2 text-left text-xs font-bold text-purple-700 hover:bg-purple-50 flex items-center gap-2 transition-colors cursor-pointer border-b border-slate-100"
                        >
                          <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                          <span>Admin Control Center</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          signOut();
                        }}
                        className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button
                onClick={() => openAuthModal({
                  title: 'Sign In with Google',
                  message: 'Sign in to unlock direct fund links, verified investor contacts, and CSV/JSON export tools.'
                })}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 shadow-2xs transition-all cursor-pointer hover:border-slate-400"
              >
                <GoogleLogo className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Suggest Update */}
            <button
              onClick={onOpenContact}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Suggest Update</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Multi-Dimensional Filters */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Fund (Peak XV, Accel), Portfolio (Zomato, Swiggy, Razorpay, Zepto)..."
              className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Dropdowns: Region, Stage, Sector */}
          <div className="md:col-span-6 flex flex-wrap items-center gap-2 justify-start md:justify-end">
            {/* Region Select */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {REGIONS.map((reg) => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>

            {/* Stage Select */}
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {INVESTMENT_STAGES.map((stg) => (
                <option key={stg} value={stg}>{stg}</option>
              ))}
            </select>

            {/* Sector Select */}
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 focus:outline-none focus:border-indigo-500"
            >
              {SECTORS.map((sec) => (
                <option key={sec} value={sec}>{sec}</option>
              ))}
            </select>

            {/* Reset Button if filtered */}
            {isAnyFilterActive && (
              <button
                onClick={onResetFilters}
                className="px-2.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors cursor-pointer flex items-center gap-1"
                title="Reset all filters"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}

            {/* Count Badge */}
            <div className="text-xs text-slate-600 font-mono px-2.5 py-2 bg-slate-100 rounded-xl border border-slate-200">
              <strong className="text-indigo-600">{filteredCount}</strong> of {totalFunds}
            </div>
          </div>
        </div>

        {/* Prestige Tier Navigation Pills */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-500 font-bold whitespace-nowrap mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-indigo-600" /> Prestige Tiers:
          </span>
          {PRESTIGE_TIERS.map((tier) => {
            const isActive = selectedTier === tier;
            return (
              <button
                key={tier}
                onClick={() => setSelectedTier(tier)}
                className={`whitespace-nowrap px-3 py-1 rounded-xl font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-2xs'
                }`}
              >
                {tier}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
