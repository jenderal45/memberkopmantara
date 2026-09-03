import React from 'react';
import {
  Building2,
  ShieldCheck,
  UserCheck,
  Users,
  LogOut,
  Sparkles,
  Cloud,
  FileSpreadsheet,
  HardDrive,
  RefreshCw,
  CreditCard,
  ChevronDown
} from 'lucide-react';
import { UserAccount, UserRole, GFormIntegrationConfig, GDriveIntegrationConfig, GCloudIntegrationConfig } from '../types';

interface NavbarProps {
  currentUser: UserAccount | null;
  currentView?: 'front' | 'portal';
  onSelectView?: (view: 'front' | 'portal') => void;
  onOpenAuth: (defaultRole?: UserRole) => void;
  onLogout: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenGoogleHub: (tab?: 'gform' | 'gdrive' | 'gcloud') => void;
  onOpenAIAdvisor: () => void;
  onOpenKTA?: () => void;
  onOpenPengurusCandidacy?: () => void;
  gformConfig?: GFormIntegrationConfig;
  gdriveConfig?: GDriveIntegrationConfig;
  gcloudConfig?: GCloudIntegrationConfig;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentView = 'front',
  onSelectView,
  onOpenAuth,
  onLogout,
  onSwitchRole,
  onOpenGoogleHub,
  onOpenAIAdvisor,
  onOpenKTA,
  onOpenPengurusCandidacy,
  gformConfig,
  gdriveConfig,
  gcloudConfig
}) => {
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);
  const driveUsageGb = gdriveConfig?.totalUsedGb ?? 4.82;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'ADMIN':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <ShieldCheck className="w-3.5 h-3.5 text-rose-600" />
            Super Admin
          </span>
        );
      case 'PENGURUS':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
            <UserCheck className="w-3.5 h-3.5 text-blue-700" />
            Dewan Pengurus
          </span>
        );
      case 'ANGGOTA':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <Users className="w-3.5 h-3.5 text-emerald-700" />
            Anggota Aktif
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectView?.('front')}
              className="flex items-center gap-3 text-left group cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-950 flex items-center justify-center text-white shadow-md shadow-blue-950/30 border border-blue-400/40 relative group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6 text-amber-300" />
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white ring-1 ring-blue-900"></span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-extrabold tracking-tight text-blue-950 font-serif">
                    KOPMANTARA
                  </span>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 shadow-2xs">
                    member.kopmantara.co.id
                  </span>
                </div>
                <p className="text-xs text-slate-700 hidden sm:block font-medium">
                  Portal Resmi Anggota • NIK: 3276010020038
                </p>
              </div>
            </button>
          </div>

          {/* Navigation View Switcher (Beranda Depan vs Dashboard Portal) */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => onSelectView?.('front')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentView === 'front'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              Beranda Portal
            </button>

            <button
              onClick={() => onSelectView?.('portal')}
              className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                currentView === 'portal'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/60'
              }`}
            >
              Dashboard {currentUser?.role === 'ANGGOTA' ? 'Anggota' : currentUser?.role === 'PENGURUS' ? 'Pengurus' : 'Admin'}
            </button>

            {onOpenPengurusCandidacy && (
              <button
                onClick={onOpenPengurusCandidacy}
                className="px-3 py-1.5 rounded-xl text-amber-900 hover:bg-amber-100/80 transition-colors flex items-center gap-1 cursor-pointer"
                title="Pencalonan Calon Dewan Pengurus 2026–2029"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                <span>Pencalonan Pengurus</span>
              </button>
            )}
          </div>

          {/* Center: Live Google Integrations Status Pills */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/60 text-xs">
            {/* GForm Status */}
            <button
              onClick={() => onOpenGoogleHub('gform')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-slate-700 hover:bg-white hover:text-emerald-700 hover:shadow-xs transition-all"
              title="Integrasi Google Forms - Pendaftaran & Aspirasi"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>G-Forms</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </button>

            <span className="text-slate-300">|</span>

            {/* GDrive Status */}
            <button
              onClick={() => onOpenGoogleHub('gdrive')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-slate-700 hover:bg-white hover:text-sky-700 hover:shadow-xs transition-all"
              title="Google Drive Vault - Berkas KTP & Bukti Setor"
            >
              <HardDrive className="w-3.5 h-3.5 text-sky-600" />
              <span>G-Drive ({driveUsageGb} GB)</span>
            </button>

            <span className="text-slate-300">|</span>

            {/* GCloud Status */}
            <button
              onClick={() => onOpenGoogleHub('gcloud')}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-medium text-slate-700 hover:bg-white hover:text-indigo-700 hover:shadow-xs transition-all"
              title="Google Cloud Storage & Automated Backup"
            >
              <Cloud className="w-3.5 h-3.5 text-indigo-600" />
              <span>G-Cloud Synced</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* AI Assistant Button */}
            <button
              onClick={onOpenAIAdvisor}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-950 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl border border-blue-200 transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span className="hidden sm:inline">AI Mantara</span>
            </button>

            {currentUser ? (
              <div className="flex items-center gap-2">
                {/* Role Switcher Demo Control */}
                <div className="relative">
                  <button
                    onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                    className="flex items-center gap-2 pl-2.5 pr-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-medium text-slate-700 transition-colors"
                  >
                    {getRoleBadge(currentUser.role)}
                    <ChevronDown className="w-3.5 h-3.5 text-slate-700" />
                  </button>

                  {roleDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                        Ganti Peran Portal (Demo Switcher)
                      </div>
                      <button
                        onClick={() => {
                          onSwitchRole('ANGGOTA');
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          currentUser.role === 'ANGGOTA' ? 'bg-sky-50 font-bold text-sky-900' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-sky-600" />
                          <div>
                            <div>Portal Anggota</div>
                            <div className="text-[10px] text-slate-700 font-normal">Ahmad Fauzi (KOP-2023-0089)</div>
                          </div>
                        </div>
                        {currentUser.role === 'ANGGOTA' && <span className="text-sky-600 text-xs">● Aktif</span>}
                      </button>

                      <button
                        onClick={() => {
                          onSwitchRole('PENGURUS');
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          currentUser.role === 'PENGURUS' ? 'bg-emerald-50 font-bold text-emerald-900' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <UserCheck className="w-4 h-4 text-emerald-600" />
                          <div>
                            <div>Portal Pengurus</div>
                            <div className="text-[10px] text-slate-700 font-normal">Siti Rahmawati (Bendahara)</div>
                          </div>
                        </div>
                        {currentUser.role === 'PENGURUS' && <span className="text-emerald-600 text-xs">● Aktif</span>}
                      </button>

                      <button
                        onClick={() => {
                          onSwitchRole('ADMIN');
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 transition-colors ${
                          currentUser.role === 'ADMIN' ? 'bg-rose-50 font-bold text-rose-900' : 'text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-rose-600" />
                          <div>
                            <div>Portal Admin IT</div>
                            <div className="text-[10px] text-slate-700 font-normal">Budi Santoso (Super Admin)</div>
                          </div>
                        </div>
                        {currentUser.role === 'ADMIN' && <span className="text-rose-600 text-xs">● Aktif</span>}
                      </button>
                    </div>
                  )}
                </div>

                {/* Anggota KTA Fast Trigger */}
                {currentUser.role === 'ANGGOTA' && onOpenKTA && (
                  <button
                    onClick={onOpenKTA}
                    className="p-2 text-slate-600 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors"
                    title="Buka Kartu Tanda Anggota (KTA)"
                  >
                    <CreditCard className="w-5 h-5" />
                  </button>
                )}

                {/* User Info & Logout */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                  <div className="hidden md:block text-right">
                    <div className="text-xs font-bold text-slate-900 truncate max-w-[150px]">
                      {currentUser.nama.split(' ')[0]}
                    </div>
                    <div className="text-[10px] text-slate-700 truncate max-w-[150px]">
                      {currentUser.unitKerja.split(' ')[0]}
                    </div>
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-2 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                    title="Keluar / Ganti Akun"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('ANGGOTA')}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Login Anggota
                </button>
                <button
                  onClick={() => onOpenAuth('PENGURUS')}
                  className="px-3 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors"
                >
                  Masuk Portal
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
