import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  X,
  ShieldAlert,
  Users,
  Activity,
  Download,
  Search,
  RefreshCw,
  Clock,
  ExternalLink,
  Mail,
  UserCheck,
  Award,
  Sparkles,
  TrendingUp,
  FileSpreadsheet,
  FileCode,
  Star,
  Scale
} from 'lucide-react';
import { getRegisteredUsers, getUserActivities } from '../services/firebase';

export default function AdminModal({ isOpen, onClose }) {
  const { currentUser, isAdmin, adminEmail } = useAuth();
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'activities'
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('ALL');

  const fetchData = async () => {
    setLoadingData(true);
    try {
      const [fetchedUsers, fetchedActs] = await Promise.all([
        getRegisteredUsers(),
        getUserActivities()
      ]);
      setUsers(fetchedUsers);
      setActivities(fetchedActs);
    } catch (e) {
      console.error('Error fetching admin data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchData();
    }
  }, [isOpen, isAdmin]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;
    const q = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        (u.displayName && u.displayName.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.uid && u.uid.toLowerCase().includes(q))
    );
  }, [users, searchTerm]);

  // Filtered activities
  const filteredActivities = useMemo(() => {
    return activities.filter((act) => {
      if (selectedActionFilter !== 'ALL' && act.actionType !== selectedActionFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const inUser = act.userName?.toLowerCase().includes(q) || act.userEmail?.toLowerCase().includes(q);
        const inAction = act.actionType?.toLowerCase().includes(q);
        const inDetails = JSON.stringify(act.details || {}).toLowerCase().includes(q);
        return inUser || inAction || inDetails;
      }
      return true;
    });
  }, [activities, selectedActionFilter, searchTerm]);

  // Action Badge styling helper
  const getActionBadge = (actionType) => {
    switch (actionType) {
      case 'LOGIN':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">LOGIN</span>;
      case 'FUND_VIEW':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">VIEW PROFILE</span>;
      case 'EXTERNAL_LINK':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">LINK CLICK</span>;
      case 'EXPORT_CSV':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-100 text-cyan-800 border border-cyan-200">EXPORT CSV</span>;
      case 'EXPORT_JSON':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">EXPORT JSON</span>;
      case 'BOOKMARK':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">BOOKMARK</span>;
      case 'COMPARE':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">COMPARE</span>;
      case 'CONTACT_SUBMIT':
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200">CONTACT</span>;
      default:
        return <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-800">{actionType}</span>;
    }
  };

  const handleExportUsersCsv = () => {
    const headers = ['User ID', 'Name', 'Email', 'Registration Date', 'Last Login', 'Login Count', 'Provider'];
    const rows = users.map((u) => [
      `"${u.uid || ''}"`,
      `"${(u.displayName || '').replace(/"/g, '""')}"`,
      `"${(u.email || '').replace(/"/g, '""')}"`,
      `"${u.registeredAt || ''}"`,
      `"${u.lastLoginAt || ''}"`,
      u.loginCount || 1,
      `"${u.provider || 'google.com'}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `vc_registered_users_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleExportActivitiesCsv = () => {
    const headers = ['Activity ID', 'Timestamp', 'User Name', 'User Email', 'Action Type', 'Details'];
    const rows = activities.map((a) => [
      `"${a.id || ''}"`,
      `"${a.timestamp || ''}"`,
      `"${(a.userName || '').replace(/"/g, '""')}"`,
      `"${(a.userEmail || '').replace(/"/g, '""')}"`,
      `"${a.actionType || ''}"`,
      `"${JSON.stringify(a.details || {}).replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `vc_user_activities_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (!isOpen) return null;

  // Access check
  if (!isAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div onClick={onClose} className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm" />
        <div className="relative w-full max-w-md bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl text-center z-10">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Admin Access Restricted</h3>
          <p className="text-xs text-slate-500 mt-2 mb-4">
            Only the administrator ({adminEmail}) can access the user activity dashboard.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Main Admin Dialog */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Accent Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-500 via-indigo-600 to-amber-500 shrink-0" />

        {/* Modal Header */}
        <div className="p-5 sm:px-8 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black font-heading tracking-tight text-white">
                  Admin Control &amp; User Intelligence Center
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                  ADMIN: {currentUser?.email}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Real-time user registrations, session analytics, and user activity stream
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              disabled={loadingData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all cursor-pointer disabled:opacity-50"
              title="Refresh real-time data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="p-4 sm:px-8 bg-slate-50 border-b border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-3 shrink-0">
          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-indigo-600" /> Total Registered Users
            </div>
            <div className="text-xl font-black font-heading text-slate-900 mt-1">
              {users.length}
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-600" /> Logged Activities
            </div>
            <div className="text-xl font-black font-heading text-slate-900 mt-1">
              {activities.length}
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" /> Link Clicks Handled
            </div>
            <div className="text-xl font-black font-heading text-slate-900 mt-1">
              {activities.filter(a => a.actionType === 'EXTERNAL_LINK').length}
            </div>
          </div>

          <div className="p-3 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-cyan-600" /> CSV / JSON Exports
            </div>
            <div className="text-xl font-black font-heading text-slate-900 mt-1">
              {activities.filter(a => a.actionType === 'EXPORT_CSV' || a.actionType === 'EXPORT_JSON').length}
            </div>
          </div>
        </div>

        {/* Navigation Tabs & Controls */}
        <div className="p-4 sm:px-8 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Registered Users ({users.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('activities')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'activities'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Live Activity Stream ({activities.length})</span>
            </button>
          </div>

          {/* Search & Export */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search user or activity..."
                className="pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>

            {activeTab === 'activities' && (
              <select
                value={selectedActionFilter}
                onChange={(e) => setSelectedActionFilter(e.target.value)}
                className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 focus:outline-none"
              >
                <option value="ALL">All Actions</option>
                <option value="LOGIN">Logins</option>
                <option value="FUND_VIEW">Fund Views</option>
                <option value="EXTERNAL_LINK">Link Clicks</option>
                <option value="EXPORT_CSV">CSV Exports</option>
                <option value="EXPORT_JSON">JSON Exports</option>
                <option value="BOOKMARK">Bookmarks</option>
                <option value="COMPARE">Comparisons</option>
                <option value="CONTACT_SUBMIT">Contact Submissions</option>
              </select>
            )}

            <button
              onClick={activeTab === 'users' ? handleExportUsersCsv : handleExportActivitiesCsv}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors cursor-pointer"
              title="Export table as CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Scrollable Tab Content */}
        <div className="p-4 sm:px-8 overflow-y-auto flex-1">
          {loadingData ? (
            <div className="text-center py-16 text-slate-500">
              <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-xs font-semibold">Loading user intelligence &amp; activity logs...</p>
            </div>
          ) : activeTab === 'users' ? (
            /* Users Directory Table */
            filteredUsers.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Users className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold">No registered users found matching your search.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Email</th>
                      <th className="py-3 px-4">Registered At</th>
                      <th className="py-3 px-4">Last Active / Login</th>
                      <th className="py-3 px-4 text-center">Login Sessions</th>
                      <th className="py-3 px-4 text-center">Auth Provider</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user, idx) => (
                      <tr key={user.uid || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            {user.photoURL ? (
                              <img
                                src={user.photoURL}
                                alt={user.displayName || 'Avatar'}
                                className="w-7 h-7 rounded-full ring-1 ring-slate-200"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
                              </div>
                            )}
                            <div>
                              <div className="font-bold text-slate-900">{user.displayName || 'Google User'}</div>
                              <div className="text-[10px] text-slate-400 font-mono">UID: {user.uid ? user.uid.substring(0, 10) + '...' : 'N/A'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-700">
                          {user.email}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {user.registeredAt ? new Date(user.registeredAt).toLocaleString() : 'Recent'}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Recent'}
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-indigo-600">
                          {user.loginCount || 1}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Google Verified
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            /* Live Activity Stream Table */
            filteredActivities.length === 0 ? (
              <div className="text-center py-16 text-slate-500">
                <Activity className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-semibold">No activity logs found for this filter.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 font-bold uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-4">User</th>
                      <th className="py-3 px-4">Action Type</th>
                      <th className="py-3 px-4">Event Details &amp; Payload</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono">
                    {filteredActivities.map((act, idx) => (
                      <tr key={act.id || idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                          {act.timestamp ? new Date(act.timestamp).toLocaleTimeString() + ' ' + new Date(act.timestamp).toLocaleDateString() : 'Now'}
                        </td>
                        <td className="py-3 px-4 font-sans font-semibold text-slate-800 whitespace-nowrap">
                          <div>{act.userName || 'Anonymous'}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{act.userEmail}</div>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getActionBadge(act.actionType)}
                        </td>
                        <td className="py-3 px-4 text-slate-700 font-sans text-xs">
                          {act.details?.fundName && (
                            <span className="font-bold text-slate-900 mr-1.5">[{act.details.fundName}]</span>
                          )}
                          {act.details?.url && (
                            <a
                              href={act.details.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-indigo-600 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                            >
                              <span>{act.details.url}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                          {act.details?.message && (
                            <span className="text-slate-600">{act.details.message}</span>
                          )}
                          {act.details?.query && (
                            <span className="text-slate-600">Searched: <strong>"{act.details.query}"</strong></span>
                          )}
                          {act.details?.tier && (
                            <span className="text-slate-600">Tier: {act.details.tier}</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-8 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Admin Session Active for <strong>{currentUser?.email}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close Admin Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
