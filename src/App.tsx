import React, { useState } from 'react';
import {
  UserAccount,
  UserRole,
  Member,
  Transaction,
  LoanApplication,
  RATDocument,
  AspirasiItem,
  AuditLog,
  GFormIntegrationConfig,
  GDriveIntegrationConfig,
  GCloudIntegrationConfig,
  PengurusApplication
} from './types';
import {
  INITIAL_USERS,
  INITIAL_MEMBERS,
  INITIAL_TRANSACTIONS,
  INITIAL_LOANS,
  INITIAL_RAT_DOCS,
  INITIAL_ASPIRASI,
  INITIAL_AUDIT_LOGS,
  INITIAL_GFORM_CONFIG,
  INITIAL_GDRIVE_CONFIG,
  INITIAL_GCLOUD_CONFIG,
  INITIAL_PENGURUS_APPLICATIONS
} from './data/mockData';

import { Navbar } from './components/Navbar';
import { MemberFrontPage } from './components/MemberFrontPage';
import { MemberPortal } from './components/member/MemberPortal';
import { PengurusPortal } from './components/pengurus/PengurusPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { MemberCardModal } from './components/MemberCardModal';
import { GoogleIntegrationsModal } from './components/GoogleIntegrationsModal';
import { AIAdvisorModal } from './components/AIAdvisorModal';
import { AuthModal } from './components/AuthModal';
import { PengurusApplicationModal } from './components/member/PengurusApplicationModal';
import { PengurusPernyataanModal } from './components/pengurus/PengurusPernyataanModal';
import { WhatsAppSupportWidget } from './components/WhatsAppSupportWidget';

import {
  Building2,
  Sparkles,
  FileSpreadsheet,
  HardDrive,
  Cloud,
  CheckCircle2,
  CreditCard,
  HeartHandshake,
  ShieldCheck,
  PhoneCall,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Global State
  const [users, setUsers] = useState<UserAccount[]>(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState<UserAccount>(INITIAL_USERS[0]); // Default to Ahmad Fauzi (Anggota)
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [loans, setLoans] = useState<LoanApplication[]>(INITIAL_LOANS);
  const [ratDocs, setRatDocs] = useState<RATDocument[]>(INITIAL_RAT_DOCS);
  const [aspirasiList, setAspirasiList] = useState<AspirasiItem[]>(INITIAL_ASPIRASI);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Integration Configs
  const [gformConfig, setGformConfig] = useState<GFormIntegrationConfig>(INITIAL_GFORM_CONFIG);
  const [gdriveConfig, setGdriveConfig] = useState<GDriveIntegrationConfig>(INITIAL_GDRIVE_CONFIG);
  const [gcloudConfig, setGcloudConfig] = useState<GCloudIntegrationConfig>(INITIAL_GCLOUD_CONFIG);

  // Modals Visibility
  const [showKTA, setShowKTA] = useState(false);
  const [showGoogleHub, setShowGoogleHub] = useState(false);
  const [googleHubTab, setGoogleHubTab] = useState<'gform' | 'gdrive' | 'gcloud'>('gform');
  const [showAIAdvisor, setShowAIAdvisor] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalRole, setAuthModalRole] = useState<UserRole>('ANGGOTA');

  // member.kopmantara.co.id View Navigation & Candidacy State
  const [viewMode, setViewMode] = useState<'front' | 'portal'>('front');
  const [pengurusApps, setPengurusApps] = useState<PengurusApplication[]>(INITIAL_PENGURUS_APPLICATIONS);
  const [showPengurusModal, setShowPengurusModal] = useState(false);
  const [showPengurusPernyataanModal, setShowPengurusPernyataanModal] = useState(false);

  // Currently authenticated member object (if role is ANGGOTA)
  const activeMember = members.find((m) => m.id === currentUser.memberId) || members[0];

  // LOG HELPER
  const addAuditLog = (action: string, details: string) => {
    const newLog: AuditLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor: currentUser.nama,
      role: currentUser.role,
      action,
      details,
      ip: '103.144.17.82',
      status: 'SUCCESS'
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // AUTH HANDLERS
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    addAuditLog('LOGIN_USER', `Pengguna berhasil login dengan peran ${user.role}.`);
  };

  const handleRoleChange = (role: UserRole) => {
    const targetUser = users.find((u) => u.role === role) || users[0];
    setCurrentUser(targetUser);
    addAuditLog('ROLE_SWITCH', `Mengganti tampilan peran aktif menjadi ${role}.`);
  };

  const handleOpenAuthForRole = (role: UserRole) => {
    setAuthModalRole(role);
    setShowAuthModal(true);
  };

  // MEMBER MANAGEMENT HANDLERS
  const handleAddMember = (newMem: Member) => {
    setMembers((prev) => [newMem, ...prev]);
    addAuditLog('ADD_MEMBER', `Menambahkan anggota baru: ${newMem.nama} (${newMem.noAnggota}).`);
  };

  const handleUpdateMember = (updated: Member) => {
    setMembers((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
    addAuditLog('UPDATE_MEMBER', `Memperbarui data anggota: ${updated.nama} (${updated.noAnggota}).`);
  };

  const handleDeleteMember = (memberId: string) => {
    const target = members.find((m) => m.id === memberId);
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    addAuditLog('DELETE_MEMBER', `Menghapus anggota: ${target?.nama} (${target?.noAnggota}).`);
  };

  const handleRegisterMember = (newMemberData: Partial<Member>) => {
    const newMem = newMemberData as Member;
    setMembers((prev) => [newMem, ...prev]);
    addAuditLog('REGISTER_MEMBER', `Pendaftaran calon anggota baru via portal: ${newMem.nama}.`);
  };

  const handleApproveMember = (memberId: string) => {
    const assignedNo = `KOP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: 'AKTIF',
              noAnggota: assignedNo,
              simpananPokok: 500000,
              totalSimpanan: 500000
            }
          : m
      )
    );
    addAuditLog('APPROVE_MEMBER', `Menyetujui pendaftaran dan menerbitkan nomor anggota ${assignedNo}.`);
  };

  const handleRejectMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
    addAuditLog('REJECT_MEMBER', `Menolak berkas pendaftaran calon anggota ID: ${memberId}.`);
  };

  // LOAN HANDLERS
  const handleSubmitLoan = (loanData: Partial<LoanApplication>) => {
    const newLoan = loanData as LoanApplication;
    setLoans((prev) => [newLoan, ...prev]);
    addAuditLog('APPLY_LOAN', `Mengajukan pinjaman baru sebesar Rp ${newLoan.nominal.toLocaleString('id-ID')}.`);
  };

  const handleApproveLoan = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: 'BERJALAN' as const } : l))
    );
    const targetLoan = loans.find((l) => l.id === loanId);
    if (targetLoan) {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === targetLoan.memberId
            ? { ...m, pinjamanAktif: targetLoan.nominal, sisaPinjaman: targetLoan.nominal }
            : m
        )
      );
    }
    addAuditLog('APPROVE_LOAN', `Menyetujui pembiayaan pinjaman ID: ${loanId}.`);
  };

  const handleRejectLoan = (loanId: string) => {
    setLoans((prev) =>
      prev.map((l) => (l.id === loanId ? { ...l, status: 'DITOLAK' as const } : l))
    );
    addAuditLog('REJECT_LOAN', `Menolak pembiayaan pinjaman ID: ${loanId}.`);
  };

  // TRANSACTION & DEPOSIT HANDLERS
  const handleDepositSimpanan = (txData: Partial<Transaction>) => {
    const newTx = txData as Transaction;
    setTransactions((prev) => [newTx, ...prev]);
    addAuditLog('DEPOSIT_SUBMIT', `Setoran simpanan ${newTx.type} sebesar Rp ${newTx.amount.toLocaleString('id-ID')} diajukan.`);
  };

  const handleVerifyTransaction = (txId: string) => {
    const targetTx = transactions.find((t) => t.id === txId);
    if (!targetTx) return;

    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'BERHASIL' as const } : t))
    );

    // Update member balance
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === targetTx.memberId) {
          const isPokok = targetTx.type === 'SIMPANAN_POKOK';
          const isWajib = targetTx.type === 'SIMPANAN_WAJIB';
          const isSukarela = targetTx.type === 'SIMPANAN_SUKARELA';

          const newPokok = isPokok ? m.simpananPokok + targetTx.amount : m.simpananPokok;
          const newWajib = isWajib ? m.simpananWajib + targetTx.amount : m.simpananWajib;
          const newSukarela = isSukarela ? m.simpananSukarela + targetTx.amount : m.simpananSukarela;

          return {
            ...m,
            simpananPokok: newPokok,
            simpananWajib: newWajib,
            simpananSukarela: newSukarela,
            totalSimpanan: newPokok + newWajib + newSukarela
          };
        }
        return m;
      })
    );

    addAuditLog('VERIFY_TRANSACTION', `Kasir memvalidasi setoran ${targetTx.noTransaksi} senilai Rp ${targetTx.amount.toLocaleString('id-ID')}.`);
  };

  // ASPIRASI HANDLERS
  const handleSubmitAspirasi = (aspData: Partial<AspirasiItem>) => {
    const newAsp = aspData as AspirasiItem;
    setAspirasiList((prev) => [newAsp, ...prev]);
    addAuditLog('SUBMIT_ASPIRASI', `Aspirasi baru disampaikan: "${newAsp.judul}".`);
  };

  const handleRespondAspirasi = (aspId: string, tanggapan: string) => {
    setAspirasiList((prev) =>
      prev.map((a) =>
        a.id === aspId
          ? {
              ...a,
              tanggapanPengurus: tanggapan,
              status: 'SELESAI' as const
            }
          : a
      )
    );
    addAuditLog('RESPOND_ASPIRASI', `Pengurus memberikan tanggapan resmi pada aspirasi ID: ${aspId}.`);
  };

  // PENGURUS CANDIDACY HANDLERS (2026-2029)
  const handleSubmitPengurusApp = (newAppData: Partial<PengurusApplication>) => {
    const fullApp: PengurusApplication = {
      id: newAppData.id || `app_${Date.now()}`,
      memberId: newAppData.memberId || activeMember.id,
      memberName: newAppData.memberName || activeMember.nama,
      noAnggota: newAppData.noAnggota || activeMember.noAnggota,
      email: newAppData.email || activeMember.email,
      phone: newAppData.phone || activeMember.phone,
      unitKerja: newAppData.unitKerja || activeMember.unitKerja,
      divisiDiminati: newAppData.divisiDiminati || 'Divisi Pembiayaan & Kemitraan',
      visiMisi: newAppData.visiMisi || 'Mewujudkan koperasi mandiri yang transparan dan berdaya saing tinggi.',
      prokerUtama: newAppData.prokerUtama || '',
      pengalamanOrganisasi: newAppData.pengalamanOrganisasi || '',
      bersediaIkutiMekanisme: newAppData.bersediaIkutiMekanisme ?? true,
      patuhHierarki: newAppData.patuhHierarki ?? true,
      bebasKonflikKepentingan: newAppData.bebasKonflikKepentingan ?? true,
      tanggalPengajuan: newAppData.tanggalPengajuan || new Date().toISOString().slice(0, 10),
      status: newAppData.status || 'MENUNGGU_VERIFIKASI',
      gformUrl: newAppData.gformUrl || gformConfig.formPengurusUrl || 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1',
      catatanPanitia: newAppData.catatanPanitia || 'Berkas digital telah diterima.'
    };

    setPengurusApps((prev) => {
      const idx = prev.findIndex(
        (p) => p.id === fullApp.id || (fullApp.memberId && p.memberId === fullApp.memberId)
      );
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], ...fullApp };
        return copy;
      }
      return [fullApp, ...prev];
    });
    addAuditLog('PENGURUS_APPLICATION', `Pendaftaran calon dewan pengurus 2026-2029: ${fullApp.memberName} (${fullApp.divisiDiminati}).`);
  };

  const handleUpdatePengurusApplicationStatus = (
    appId: string,
    status: PengurusApplication['status'],
    catatan?: string
  ) => {
    setPengurusApps((prev) =>
      prev.map((a) =>
        a.id === appId ? { ...a, status, catatanPanitia: catatan || a.catatanPanitia } : a
      )
    );
    addAuditLog('PENGURUS_STATUS_UPDATE', `Status seleksi calon pengurus ID ${appId} diubah menjadi ${status}.`);
  };

  // GOOGLE INTEGRATION SYNC HANDLERS
  const handleSyncGForm = async () => {
    try {
      const res = await fetch('/api/gform/sync', { method: 'POST' });
      const data = await res.json();
      setGformConfig((prev) => ({
        ...prev,
        lastSync: 'Baru saja',
        totalResponses: prev.totalResponses + 2
      }));
      addAuditLog('GFORM_SYNC', 'Menyinkronkan data Google Forms ke database KOPMANTARA.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncGDrive = async () => {
    try {
      const res = await fetch('/api/gdrive/sync', { method: 'POST' });
      const data = await res.json();
      setGdriveConfig((prev) => ({
        ...prev,
        lastSync: 'Baru saja',
        totalFilesSynced: prev.totalFilesSynced + 5
      }));
      addAuditLog('GDRIVE_SYNC', 'Menyinkronkan Google Drive Vault berkas dan KTP anggota.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleSyncGCloud = async () => {
    try {
      const res = await fetch('/api/gcloud/replicate', { method: 'POST' });
      const data = await res.json();
      setGcloudConfig((prev) => ({
        ...prev,
        lastBackup: 'Baru saja'
      }));
      addAuditLog('GCLOUD_BACKUP', 'Replikasi data real-time ke Google Cloud Storage & Firestore selesai.');
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenGoogleHub = (tab: 'gform' | 'gdrive' | 'gcloud' = 'gform') => {
    setGoogleHubTab(tab);
    setShowGoogleHub(true);
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-emerald-200">
      {/* Conditionally Render Front Gate OR Internal Portal Ecosystem */}
      {viewMode === 'front' ? (
        <MemberFrontPage
          currentUser={currentUser}
          gformUrl={gformConfig.formPengurusUrl || gformConfig.formPendaftaranUrl || 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1'}
          onOpenDashboard={() => setViewMode('portal')}
          onEnterMemberPortal={() => {
            handleRoleChange('ANGGOTA');
            setViewMode('portal');
          }}
          onEnterAdminPortal={() => {
            setShowPengurusPernyataanModal(true);
          }}
        />
      ) : (
        <>
          {/* 1. Main Navigation Header */}
          <Navbar
            currentUser={currentUser}
            currentView={viewMode}
            onSelectView={(v) => setViewMode(v)}
            onOpenAuth={handleOpenAuthForRole}
            onLogout={() => {
              handleOpenAuthForRole('ANGGOTA');
              setViewMode('front');
            }}
            onSwitchRole={handleRoleChange}
            onOpenGoogleHub={handleOpenGoogleHub}
            onOpenAIAdvisor={() => setShowAIAdvisor(true)}
            onOpenKTA={() => setShowKTA(true)}
            onOpenPengurusCandidacy={() => setShowPengurusModal(true)}
            gformConfig={gformConfig}
            gdriveConfig={gdriveConfig}
            gcloudConfig={gcloudConfig}
          />

          {/* 2. Top System Quick Access Bar */}
          <div className="bg-slate-900 border-b border-blue-950 text-slate-300 text-xs py-2 px-4">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                <span className="font-semibold text-white">kopmantara.co.id Portal:</span>
                <span className="text-slate-300">
                  Google Workspace • Drive Vault • GCP Jakarta • Bunga Pinjaman 1% • WA CS Vania
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleOpenGoogleHub('gform')}
                  className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                  <span>G-Forms</span>
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => handleOpenGoogleHub('gdrive')}
                  className="text-[11px] font-bold text-sky-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <HardDrive className="w-3.5 h-3.5 text-sky-400" />
                  <span>Drive KTP Vault</span>
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => handleOpenGoogleHub('gcloud')}
                  className="text-[11px] font-bold text-indigo-300 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Cloud className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Cloud Backup</span>
                </button>
              </div>
            </div>
          </div>

          {/* 3. Main Portal Workspace */}
          <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
            {/* Top Return to Front Page Bar */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setViewMode('front')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 hover:bg-blue-100 font-bold text-xs transition-colors cursor-pointer"
                >
                  <span>← Kembali ke Pilihan Portal (kopmantara.co.id)</span>
                </button>
                <span className="text-slate-300 hidden sm:inline">|</span>
                <span className="text-xs text-slate-700 font-medium hidden sm:inline">
                  Anda sedang membuka Dashboard Internal Koperasi
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-700 font-medium">Peran Aktif:</span>
                <span className="text-xs font-bold text-blue-950 bg-blue-100/70 px-2.5 py-1 rounded-lg">
                  {currentUser.role === 'ANGGOTA' ? 'Portal Anggota' : currentUser.role === 'PENGURUS' ? 'Portal Pengurus' : 'Admin IT'}
                </span>
              </div>
            </div>

            {currentUser.role === 'ANGGOTA' && (
              <MemberPortal
                member={activeMember}
                transactions={transactions}
                loans={loans}
                ratDocs={ratDocs}
                aspirasiList={aspirasiList}
                gformConfig={gformConfig}
                gdriveConfig={gdriveConfig}
                pengurusApplications={pengurusApps}
                onOpenKTA={() => setShowKTA(true)}
                onOpenGoogleHub={handleOpenGoogleHub}
                onDepositSimpanan={handleDepositSimpanan}
                onSubmitLoan={handleSubmitLoan}
                onSubmitAspirasi={handleSubmitAspirasi}
                onOpenPengurusCandidacyModal={() => setShowPengurusModal(true)}
              />
            )}

            {currentUser.role === 'PENGURUS' && (
              <PengurusPortal
                members={members}
                transactions={transactions}
                loans={loans}
                aspirasiList={aspirasiList}
                gformConfig={gformConfig}
                gdriveConfig={gdriveConfig}
                gcloudConfig={gcloudConfig}
                pengurusApplications={pengurusApps}
                onApproveMember={handleApproveMember}
                onRejectMember={handleRejectMember}
                onApproveLoan={handleApproveLoan}
                onRejectLoan={handleRejectLoan}
                onVerifyTransaction={handleVerifyTransaction}
                onRespondAspirasi={handleRespondAspirasi}
                onOpenGoogleHub={handleOpenGoogleHub}
                onOpenAIAdvisor={() => setShowAIAdvisor(true)}
                onUpdatePengurusApplicationStatus={handleUpdatePengurusApplicationStatus}
              />
            )}

            {currentUser.role === 'ADMIN' && (
              <AdminPortal
                members={members}
                users={users}
                auditLogs={auditLogs}
                gformConfig={gformConfig}
                gdriveConfig={gdriveConfig}
                gcloudConfig={gcloudConfig}
                onAddMember={handleAddMember}
                onUpdateMember={handleUpdateMember}
                onDeleteMember={handleDeleteMember}
                onUpdateGFormConfig={(c) => {
                  setGformConfig(c);
                  addAuditLog('UPDATE_CONFIG', 'Memperbarui parameter konfigurasi Google Forms.');
                }}
                onUpdateGDriveConfig={(c) => {
                  setGdriveConfig(c);
                  addAuditLog('UPDATE_CONFIG', 'Memperbarui parameter konfigurasi Google Drive.');
                }}
                onUpdateGCloudConfig={(c) => {
                  setGcloudConfig(c);
                  addAuditLog('UPDATE_CONFIG', 'Memperbarui parameter konfigurasi Google Cloud.');
                }}
                onOpenGoogleHub={handleOpenGoogleHub}
              />
            )}
          </main>

          {/* 4. Portal Footer */}
          <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-10 px-4 mt-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 text-amber-300 flex items-center justify-center font-extrabold font-serif shadow-xs border border-blue-400/30">
                    M
                  </div>
                  <span className="font-bold text-white text-sm font-serif">KOPMANTARA</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Koperasi Mandiri Artha Nusantara (kopmantara.co.id). Menghadirkan solusi finansial terpercaya, pembiayaan, simpanan, dan layanan digital modern berbasis tata kelola profesional dan amanah.
                </p>
                <div className="text-[11px] text-blue-400 font-mono">
                  NIK: 3276010020038 • AHU-0004921.AH.01.26
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Layanan Utama</h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li>• Pembiayaan Pensiunan &amp; Karyawan</li>
                  <li>• Simpanan Mantara Sejahtera &amp; SHU</li>
                  <li>• Penjualan Kredit Non-Gadai Elektronik</li>
                  <li>• PPOB &amp; Pembayaran Tagihan Digital</li>
                  <li>• Mantara Tour, Travel &amp; Umroh</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Infrastruktur Digital</h4>
                <ul className="space-y-1.5 text-xs text-slate-400">
                  <li className="flex items-center gap-1.5">
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Google Forms &amp; Google Sheets API</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5 text-sky-400" />
                    <span>Google Drive Vault Storage</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Cloud className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Google Cloud Platform Multi-Region</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gemini AI 5C Credit Scoring</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Kantor &amp; Kontak Resmi</h4>
                <div className="space-y-1 text-xs text-slate-400">
                  <p className="flex items-start gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-300 shrink-0 mt-0.5" />
                    <span>Graha Mantara, Jl. RS Fatmawati Raya No. 15, Cilandak, Jakarta Selatan</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <PhoneCall className="w-3.5 h-3.5 text-slate-300" />
                    <span>(021) 7590-8822 / 0811-1829-4500</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-300" />
                    <span>info@mantara.id • info@kopmantara.co.id</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto border-t border-slate-800/80 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
              <div>
                © {new Date().getFullYear()} Koperasi Mandiri Artha Nusantara (KOPMANTARA - kopmantara.co.id). Seluruh Hak Cipta Dilindungi.
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>Portal Versi 2.4-Production</span>
                <span>Region: asia-southeast2 (Jakarta)</span>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* 5. MODALS */}
      {/* Digital Member Card (KTA) */}
      {showKTA && (
        <MemberCardModal member={activeMember} onClose={() => setShowKTA(false)} />
      )}

      {/* Central Google Integrations Hub (GForm, GDrive, GCloud) */}
      {showGoogleHub && (
        <GoogleIntegrationsModal
          gformConfig={gformConfig}
          gdriveConfig={gdriveConfig}
          gcloudConfig={gcloudConfig}
          initialTab={googleHubTab}
          members={members}
          onUpdateGFormConfig={(c) => {
            setGformConfig(c);
            addAuditLog('UPDATE_CONFIG', 'Memperbarui konfigurasi Google Forms.');
          }}
          onUpdateGDriveConfig={(c) => {
            setGdriveConfig(c);
            addAuditLog('UPDATE_CONFIG', 'Memperbarui konfigurasi Google Drive.');
          }}
          onUpdateGCloudConfig={(c) => {
            setGcloudConfig(c);
            addAuditLog('UPDATE_CONFIG', 'Memperbarui konfigurasi Google Cloud.');
          }}
          onImportNewMembersFromGForm={(newMems) => {
            newMems.forEach((nm) => handleRegisterMember(nm));
          }}
          onSyncGForm={handleSyncGForm}
          onSyncGDrive={handleSyncGDrive}
          onSyncGCloud={handleSyncGCloud}
          onClose={() => setShowGoogleHub(false)}
        />
      )}

      {/* AI Advisor Modal (5C Scoring & Document Draft) */}
      {showAIAdvisor && (
        <AIAdvisorModal
          members={members}
          loans={loans}
          onClose={() => setShowAIAdvisor(false)}
        />
      )}

      {/* Authentication & Role Portal Login Modal */}
      {showAuthModal && (
        <AuthModal
          defaultRole={authModalRole}
          users={users}
          members={members}
          formPendaftaranUrl={gformConfig.formPendaftaranUrl}
          onLogin={handleLogin}
          onRegisterMember={handleRegisterMember}
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {/* 6. PENGURUS CANDIDACY 2026-2029 APPLICATION MODAL */}
      {showPengurusModal && (
        <PengurusApplicationModal
          member={currentUser.role === 'ANGGOTA' ? activeMember : null}
          formPengurusUrl={gformConfig.formPengurusUrl || 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1'}
          existingApplication={pengurusApps.find(
            (app) => app.memberId === activeMember.id || app.noAnggota === activeMember.noAnggota
          )}
          onSubmitApplication={handleSubmitPengurusApp}
          onOpenAuthForMember={() => handleOpenAuthForRole('ANGGOTA')}
          onClose={() => setShowPengurusModal(false)}
        />
      )}

      {/* 6B. PERNYATAAN & PAKTA INTEGRITAS DEWAN PENGURUS MODAL -> WHATSAPP ADMIN */}
      {showPengurusPernyataanModal && (
        <PengurusPernyataanModal
          currentUser={currentUser}
          onSubmitPernyataan={(data) => {
            handleSubmitPengurusApp(data);
          }}
          onEnterDashboard={() => {
            handleRoleChange('PENGURUS');
            setViewMode('portal');
          }}
          onClose={() => setShowPengurusPernyataanModal(false)}
        />
      )}

      {/* 7. OFFICIAL WHATSAPP ASSISTANCE WIDGET (Kak Vania +62 857-8245-0816) */}
      <WhatsAppSupportWidget
        currentUserName={currentUser.nama}
        currentUserNoAnggota={currentUser.role === 'ANGGOTA' ? activeMember.noAnggota : undefined}
      />
    </div>
  );
}
