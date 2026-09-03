import React from 'react';
import { UserAccount, UserRole } from '../types';
import { Users, Shield, ArrowRight } from 'lucide-react';

interface MemberFrontPageProps {
  currentUser?: UserAccount;
  gformUrl?: string;
  onOpenDashboard: () => void;
  onEnterMemberPortal: () => void;
  onEnterAdminPortal: () => void;
}

export const MemberFrontPage: React.FC<MemberFrontPageProps> = ({
  gformUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1',
  onOpenDashboard,
  onEnterMemberPortal,
  onEnterAdminPortal
}) => {
  const [showMemberRedirectNotice, setShowMemberRedirectNotice] = React.useState(false);

  const handleMemberPortalClick = () => {
    // Direct directly to Google Form as requested by user
    try {
      window.open(gformUrl, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = gformUrl;
    }
    setShowMemberRedirectNotice(true);
  };
  return (
    <div
      id="kopmantara-welcome-gateway"
      className="min-h-screen w-full bg-[#F8F8F5] text-slate-900 flex flex-col justify-center items-center px-3.5 sm:px-6 py-8 selection:bg-[#C59E58]/30 font-sans"
    >
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Kopmantara Group Official Logo */}
        <div className="mb-6 flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            {/* Custom SVG Emblem matching Kopmantara Group identity */}
            <svg
              className="w-10 h-10 text-[#1E3A2B]"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="Kopmantara Group Logo"
            >
              <rect width="48" height="48" rx="12" fill="#14281D" />
              {/* Geometric stylized K with gold and emerald accents */}
              <path
                d="M14 12V36"
                stroke="#F3E5AB"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M32 14L21 24L33 35"
                stroke="#C59E58"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="34" cy="14" r="3" fill="#34D399" />
            </svg>
            <span className="text-base sm:text-lg font-black tracking-wider text-[#14281D] font-serif">
              KOPMANTARA
            </span>
          </div>
          <span className="text-[10px] tracking-widest uppercase font-semibold text-slate-400">
            Kopmantara Group
          </span>
        </div>

        {/* Welcome Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-slate-900 mb-2.5">
          Welcome to Kopmantara
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-8 sm:mb-10 px-2">
          Please select your portal to continue. Secure access is monitored and logged.
        </p>

        {/* Two Portal Cards Grid - 2 columns on mobile as requested in screenshot */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6 w-full text-left">
          {/* 1. Portal Anggota Card */}
          <div
            id="card-portal-anggota"
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div>
              {/* Icon in soft neutral container */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3.5 sm:mb-5">
                <Users className="w-5 h-5 text-slate-800" />
              </div>

              {/* Title */}
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 leading-tight">
                Portal Anggota
              </h2>

              {/* Description */}
              <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 leading-relaxed min-h-[3.5rem] sm:min-h-[4.5rem]">
                Access your member dashboard to view cooperative status, manage savings, and explore member benefits.
              </p>
            </div>

            {/* Dark Action Button */}
            <button
              id="btn-enter-member-portal"
              onClick={handleMemberPortalClick}
              className="mt-4 sm:mt-6 w-full py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg bg-[#111827] hover:bg-black text-white text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              <span>Enter Member Portal</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>

          {/* 2. Portal Pengurus Card */}
          <div
            id="card-portal-pengurus"
            className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col justify-between transition-transform duration-200 hover:-translate-y-0.5"
          >
            <div>
              {/* Icon in soft golden/tan container */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#F6EDE0] text-[#9A702C] flex items-center justify-center mb-3.5 sm:mb-5">
                <Shield className="w-5 h-5 text-[#9A702C]" />
              </div>

              {/* Title */}
              <h2 className="text-sm sm:text-lg font-bold text-slate-900 mb-1.5 sm:mb-2 leading-tight">
                Portal Pengurus
              </h2>

              {/* Description */}
              <p className="text-[11px] sm:text-xs md:text-sm text-slate-500 leading-relaxed min-h-[3.5rem] sm:min-h-[4.5rem]">
                Secure administrative access for group officials to manage cooperative operations, investments, and member data.
              </p>
            </div>

            {/* Warm Gold/Tan Action Button */}
            <button
              id="btn-enter-admin-portal"
              onClick={onEnterAdminPortal}
              className="mt-4 sm:mt-6 w-full py-2.5 sm:py-3 px-2 sm:px-4 rounded-lg bg-[#C59E58] hover:bg-[#B38C46] text-slate-950 font-semibold text-[10px] sm:text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap shadow-xs"
            >
              <span>Enter Admin Portal</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>

            {/* Small note on requirement */}
            <p className="mt-2 text-[10px] text-amber-800/80 text-center">
              Wajib menyertakan usulan proker &amp; pakta integritas
            </p>
          </div>
        </div>

        {/* Modal/Prompt if user clicked member portal */}
        {showMemberRedirectNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 text-left shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="font-bold text-slate-900 text-sm">
                  Google Form Member KOPMANTARA
                </h3>
                <button
                  onClick={() => setShowMemberRedirectNotice(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Tautan formulir resmi telah dibuka pada tab baru. Jika peramban memblokir pop-up, Anda dapat menekan tombol di bawah:
              </p>

              <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-100 text-[11px] text-blue-900 break-all">
                {gformUrl}
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={gformUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-lg bg-[#111827] text-white text-xs font-bold text-center hover:bg-black transition-colors"
                >
                  Buka Google Form Anggota &rarr;
                </a>
                <button
                  onClick={() => setShowMemberRedirectNotice(false)}
                  className="w-full py-2 px-3 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs text-center transition-colors"
                >
                  Tutup Notifikasi
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Discreet Legal & Official Identity Footer */}
        <div className="mt-10 sm:mt-12 text-center text-[11px] text-slate-400 space-y-1">
          <p>
            KOPMANTARA • Koperasi Pengusaha Muda Nusantara • NIK: 3276010020038
          </p>
          <p className="text-[10px] text-slate-400/80">
            Protected by Cloud Identity &amp; Google Workspace Security Protocol
          </p>
        </div>
      </div>
    </div>
  );
};
