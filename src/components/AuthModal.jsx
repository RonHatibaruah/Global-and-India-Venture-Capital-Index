import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, ShieldCheck, Sparkles, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export function GoogleLogo({ className = "w-5 h-5" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function AuthModal() {
  const { authModalOpen, authIntent, closeAuthModal, signInGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!authModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const { user, error } = await signInGoogle();
      if (error) {
        if (error.code === 'auth/popup-closed-by-user') {
          setErrorMsg('Sign-in popup was closed before finishing.');
        } else if (error.code === 'auth/unauthorized-domain') {
          setErrorMsg('Domain unauthorized in Firebase console. Please ensure your domain is added to authorized domains.');
        } else {
          setErrorMsg(error.message || 'Failed to sign in with Google. Please try again.');
        }
      }
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred during sign-in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={closeAuthModal}
        className="fixed inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Accent Gradient Line */}
        <div className="h-1.5 w-full bg-gradient-to-r from-emerald-400 via-indigo-600 to-amber-500" />

        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          {/* Header Icon + Brand */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-slate-900 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
              <span className="bg-gradient-to-tr from-emerald-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">VC</span>
            </div>
            <div>
              <div className="text-base font-extrabold text-slate-900 font-heading">
                Global &amp; India <span className="text-indigo-600">VC Index</span>
              </div>
              <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Founder &amp; Investor Intelligence
              </div>
            </div>
          </div>

          {/* Dynamic Intent Title & Message */}
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-black font-heading text-slate-900 tracking-tight leading-snug">
              {authIntent.title || 'Google Authentication & Registration Required'}
            </h3>
            <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
              {authIntent.message || 'Please sign in or register with Google to unlock official fund links, verified partner directories, and CSV/JSON export tools.'}
            </p>
          </div>

          {/* Unlocked Benefits */}
          <div className="mb-6 rounded-2xl bg-slate-50 p-4 border border-slate-200/80 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Unlocked Free Member Benefits:
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Direct links to <strong>official VC portals &amp; pitch links</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                <span><strong>Key General Partner profiles</strong> &amp; LinkedIn socials</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span><strong>1-Click CSV &amp; JSON</strong> investor target list export</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0" />
                <span>Unlimited <strong>side-by-side fund comparisons</strong></span>
              </div>
            </div>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 leading-relaxed animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Google Sign-in Action Button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm shadow-xs transition-all duration-200 hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {loading ? (
              <div className="flex items-center gap-2 text-slate-600">
                <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                <span>Connecting with Google...</span>
              </div>
            ) : (
              <>
                <GoogleLogo className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Continue with Google</span>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform ml-auto" />
              </>
            )}
          </button>

          {/* Trust Notice */}
          <div className="mt-4 text-center">
            <p className="text-[11px] text-slate-400 leading-normal">
              Zero spam. We only verify your email to prevent automated scraping of investor data.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
