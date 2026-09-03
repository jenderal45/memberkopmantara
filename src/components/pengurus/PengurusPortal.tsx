import React, { useState } from 'react';
import {
  Member,
  Transaction,
  LoanApplication,
  AspirasiItem,
  GFormIntegrationConfig,
  GDriveIntegrationConfig,
  GCloudIntegrationConfig,
  PengurusApplication
} from '../../types';
import { OFFICIAL_WHATSAPP } from '../../data/mockData';
import {
  Users,
  UserCheck,
  PiggyBank,
  Calculator,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Sparkles,
  FileSpreadsheet,
  HardDrive,
  Cloud,
  FileText,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  MessageSquare,
  Search,
  Filter,
  Eye,
  Check,
  ExternalLink,
  ChevronRight,
  Award,
  MessageCircle
} from 'lucide-react';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';

interface PengurusPortalProps {
  members: Member[];
  transactions: Transaction[];
  loans: LoanApplication[];
  aspirasiList: AspirasiItem[];
  pengurusApplications?: PengurusApplication[];
  gformConfig: GFormIntegrationConfig;
  gdriveConfig: GDriveIntegrationConfig;
  gcloudConfig: GCloudIntegrationConfig;
  onApproveMember: (memberId: string) => void;
  onRejectMember: (memberId: string) => void;
  onApproveLoan: (loanId: string) => void;
  onRejectLoan: (loanId: string) => void;
  onVerifyTransaction: (txId: string) => void;
  onRespondAspirasi: (aspId: string, tanggapan: string) => void;
  onUpdatePengurusApplicationStatus?: (appId: string, status: 'LOLOS_BERKAS' | 'LOLOS_FIT_PROPER' | 'DITOLAK', catatan?: string) => void;
  onOpenGoogleHub: (tab?: 'gform' | 'gdrive' | 'gcloud') => void;
  onOpenAIAdvisor: () => void;
}

export const PengurusPortal: React.FC<PengurusPortalProps> = ({
  members,
  transactions,
  loans,
  aspirasiList,
  pengurusApplications = [],
  gformConfig,
  gdriveConfig,
  gcloudConfig,
  onApproveMember,
  onRejectMember,
  onApproveLoan,
  onRejectLoan,
  onVerifyTransaction,
  onRespondAspirasi,
  onUpdatePengurusApplicationStatus,
  onOpenGoogleHub,
  onOpenAIAdvisor
}) => {
  const [activeTab, setActiveTab] = useState<'verifikasi' | 'pinjaman' | 'kasir' | 'shu' | 'aspirasi' | 'calon_pengurus'>('verifikasi');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKtpMember, setSelectedKtpMember] = useState<Member | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<PengurusApplication | null>(null);
  const [candidateCatatan, setCandidateCatatan] = useState('');

  // SHU Calculator state
  const [totalShuTahun, setTotalShuTahun] = useState(480000000);
  const [porsiJasaModal, setPorsiJasaModal] = useState(40);
  const [porsiJasaAnggota, setPorsiJasaAnggota] = useState(30);
  const [porsiCadangan, setPorsiCadangan] = useState(20);
  const [porsiSosial, setPorsiSosial] = useState(10);

  // Aspirasi response modal
  const [respondingAspId, setRespondingAspId] = useState<string | null>(null);
  const [tanggapanText, setTanggapanText] = useState('');

  // Counts & Calculations
  const pendingMembers = members.filter((m) => m.status === 'PENDING');
  const activeMembersCount = members.filter((m) => m.status === 'AKTIF').length;
  const pendingLoans = loans.filter((l) => l.status === 'MENUNGGU_REVIEW');
  const pendingTransactions = transactions.filter((t) => t.status === 'MENUNGGU_VERIFIKASI');
  const pendingAspirasi = aspirasiList.filter((a) => a.status === 'MENUNGGU_TANGGAPAN' || a.status === 'DIPROSES');

  const totalSimpananKoperasi = members.reduce((acc, curr) => acc + curr.totalSimpanan, 0);
  const totalPinjamanBeredar = loans.reduce((acc, curr) => (curr.status === 'BERJALAN' ? acc + curr.nominal : acc), 0);

  const handleSendAspirasiResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (respondingAspId && tanggapanText) {
      onRespondAspirasi(respondingAspId, tanggapanText);
      setRespondingAspId(null);
      setTanggapanText('');
      alert('Tanggapan resmi pengurus berhasil dikirim ke anggota!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Executive Stats with Official Kopmantara Design */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-6 shadow-xl border border-blue-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                Dashboard Dewan Pengurus Harian
              </span>
              <span className="text-xs text-blue-200">Koperasi Mandiri Artha Nusantara • Periode 2024 - 2027</span>
            </div>
            <h2 className="text-2xl font-black text-white font-serif tracking-tight">
              Manajemen & Operasional KOPMANTARA
            </h2>
            <p className="text-xs text-blue-100 max-w-xl">
              Pusat kendali verifikasi berkas anggota, komite kredit pembiayaan pensiunan & karyawan 5C, arus kas simpanan, dan integrasi G-Suite.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenAIAdvisor}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Analisis Kredit AI 5C</span>
            </button>

            <button
              onClick={() => onOpenGoogleHub('gform')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/15 transition-colors cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-sky-300" />
              <span>G-Forms Sync</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 pt-6 border-t border-blue-800/40 text-xs">
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-blue-200 block text-[11px]">Total Kas Simpanan</span>
            <span className="text-lg font-black text-white">{formatRupiah(totalSimpananKoperasi)}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-blue-200 block text-[11px]">Pinjaman Beredar</span>
            <span className="text-lg font-black text-white">{formatRupiah(totalPinjamanBeredar)}</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-blue-200 block text-[11px]">Anggota Aktif Terdaftar</span>
            <span className="text-lg font-black text-white">{activeMembersCount} Orang</span>
          </div>
          <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
            <span className="text-amber-300 block text-[11px]">Menunggu Verifikasi</span>
            <span className="text-lg font-black text-amber-300">
              {pendingMembers.length} Calon Anggota
            </span>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('verifikasi')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'verifikasi'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Verifikasi Anggota Baru</span>
          {pendingMembers.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400 text-slate-950 font-black">
              {pendingMembers.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('pinjaman')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'pinjaman'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Persetujuan Pinjaman</span>
          {pendingLoans.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white font-black">
              {pendingLoans.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('kasir')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'kasir'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span>Validasi Setoran & Kasir</span>
          {pendingTransactions.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-sky-600 text-white font-black">
              {pendingTransactions.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('shu')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'shu'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Alokasi & Pembagian SHU</span>
        </button>

        <button
          onClick={() => setActiveTab('aspirasi')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'aspirasi'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Aspirasi & Saran</span>
          {pendingAspirasi.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-700 text-white font-black">
              {pendingAspirasi.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('calon_pengurus')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'calon_pengurus'
              ? 'border-amber-500 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-slate-700 hover:text-amber-800'
          }`}
        >
          <Award className="w-4 h-4 text-amber-500" />
          <span>Seleksi Calon Pengurus</span>
          {pengurusApplications.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-500 text-slate-950 font-black">
              {pengurusApplications.length}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: VERIFIKASI ANGGOTA BARU */}
      {activeTab === 'verifikasi' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-blue-950">
                Antrean Verifikasi Calon Anggota (Google Forms & Pendaftaran Online)
              </h3>
              <p className="text-xs text-slate-700">
                Review foto KTP di Google Drive, data identitas NIK, dan tetapkan Nomor Anggota resmi KOPMANTARA.
              </p>
            </div>
            <button
              onClick={() => onOpenGoogleHub('gform')}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shrink-0 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Tarik Pendaftar Baru dari G-Form</span>
            </button>
          </div>

          {pendingMembers.length === 0 ? (
            <div className="p-12 bg-white rounded-2xl border border-slate-200 text-center space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <div className="text-sm font-bold text-slate-900">Semua Calon Anggota Telah Diverifikasi</div>
              <p className="text-xs text-slate-700">
                Tidak ada berkas tertunda saat ini. Data pendaftar baru akan otomatis masuk saat sinkronisasi Google Form.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pendingMembers.map((m) => (
                <div
                  key={m.id}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={m.fotoUrl}
                      alt={m.nama}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0 bg-slate-100"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                          {m.noAnggota}
                        </span>
                        <span className="text-xs text-slate-700">Mendaftar: {formatDateIndo(m.tglGabung)}</span>
                      </div>
                      <h4 className="text-base font-bold text-slate-900">{m.nama}</h4>
                      <div className="text-xs text-slate-700 flex flex-wrap items-center gap-2">
                        <span>NIK: {m.nik}</span>
                        <span>•</span>
                        <span>{m.unitKerja}</span>
                        <span>•</span>
                        <span>{m.email}</span>
                      </div>
                      {m.catatan && (
                        <p className="text-xs text-slate-700 italic">"{m.catatan}"</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 w-full md:w-auto">
                    {/* View Document in GDrive */}
                    <button
                      onClick={() => setSelectedKtpMember(m)}
                      className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-slate-700" />
                      <span>Review KTP (GDrive)</span>
                    </button>

                    {/* Reject */}
                    <button
                      onClick={() => {
                        if (window.confirm(`Tolak pendaftaran ${m.nama}?`)) {
                          onRejectMember(m.id);
                        }
                      }}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors cursor-pointer"
                      title="Tolak Pendaftaran"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>

                    {/* Approve */}
                    <button
                      onClick={() => {
                        onApproveMember(m.id);
                        alert(`Pendaftaran ${m.nama} disetujui! Nomor Anggota resmi KOP-2026-${Math.floor(100 + Math.random() * 900)} telah diterbitkan.`);
                      }}
                      className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Setujui & Terbitkan KTA</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: PERSETUJUAN PINJAMAN */}
      {activeTab === 'pinjaman' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-blue-950">
                Komite Persetujuan Pembiayaan & Pinjaman Anggota (kopmantara.co.id)
              </h3>
              <p className="text-xs text-slate-700">
                Lakukan analisis kelayakan 5C (Character, Capacity, Capital, Collateral, Condition) sebelum menyetujui pembiayaan pensiunan & karyawan.
              </p>
            </div>
            <button
              onClick={onOpenAIAdvisor}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-700 to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors shrink-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Buka AI Komite Pinjaman</span>
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {loans.map((loan) => (
              <div key={loan.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[11px] font-mono font-bold text-slate-700">{loan.noPengajuan}</span>
                    <h4 className="text-base font-bold text-slate-900">{loan.memberName} ({loan.noAnggota})</h4>
                    <p className="text-xs text-slate-700">Keperluan: {loan.tujuan}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black self-start md:self-auto ${
                      loan.status === 'BERJALAN' || loan.status === 'DISETUJUI_PENGURUS'
                        ? 'bg-emerald-100 text-emerald-800'
                        : loan.status === 'MENUNGGU_REVIEW'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {loan.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
                  <div>
                    <span className="text-slate-700 text-[11px] block">Plafon Pinjaman:</span>
                    <span className="font-bold text-slate-900 text-sm">{formatRupiah(loan.nominal)}</span>
                  </div>
                  <div>
                    <span className="text-slate-700 text-[11px] block">Tenor & Bunga:</span>
                    <span className="font-bold text-slate-900 text-sm">{loan.tenorBulan} Bulan (1% / bln)</span>
                  </div>
                  <div>
                    <span className="text-slate-700 text-[11px] block">Estimasi Angsuran:</span>
                    <span className="font-bold text-blue-700 text-sm">{formatRupiah(loan.angsuranPerBulan)} / bln</span>
                  </div>
                  <div>
                    <span className="text-slate-700 text-[11px] block">Penghasilan Bulanan:</span>
                    <span className="font-bold text-slate-900 text-sm">{formatRupiah(loan.penghasilanBulanan)}</span>
                  </div>
                </div>

                {/* AI 5C Score Pill if Available */}
                {loan.skorAnalisisAi && (
                  <div className="p-3 bg-blue-50/80 rounded-xl border border-blue-200 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-700" />
                      <span className="font-bold text-blue-950">Skor AI 5C: {loan.skorAnalisisAi}/100</span>
                      <span className="text-blue-800 text-[11px]">({loan.rekomendasiAi})</span>
                    </div>
                    <span className="text-[11px] text-blue-700 font-medium">Analisis Kredit Terlampir</span>
                  </div>
                )}

                {loan.status === 'MENUNGGU_REVIEW' && (
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => onRejectLoan(loan.id)}
                      className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                    >
                      Tolak Pinjaman
                    </button>
                    <button
                      onClick={() => {
                        onApproveLoan(loan.id);
                        alert(`Pinjaman ${loan.noPengajuan} disetujui! SPK otomatis diterbitkan dan dana siap dicairkan.`);
                      }}
                      className="px-5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                    >
                      Setujui & Terbitkan SPK Pinjaman
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: KASIR & VALIDASI SETORAN */}
      {activeTab === 'kasir' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-blue-950">Validasi Setoran Simpanan Kasir & Mutasi</h3>
              <p className="text-xs text-slate-700">Verifikasi bukti transfer dari Google Drive Vault dan perbarui saldo anggota.</p>
            </div>
            <button
              onClick={() => onOpenGoogleHub('gdrive')}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <HardDrive className="w-4 h-4" />
              <span>Folder Bukti Transfer GDrive</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold shrink-0">
                      {tx.type.includes('SIMPANAN') ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        {tx.memberName} ({tx.noAnggota}) • {tx.keterangan}
                      </div>
                      <div className="text-[11px] text-slate-700 flex items-center gap-2">
                        <span>{tx.noTransaksi}</span>
                        <span>•</span>
                        <span>{formatDateIndo(tx.date)}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{tx.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <div className="text-sm font-extrabold text-slate-900">{formatRupiah(tx.amount)}</div>
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          tx.status === 'BERHASIL'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {tx.status}
                      </span>
                    </div>

                    {tx.status === 'MENUNGGU_VERIFIKASI' && (
                      <button
                        onClick={() => {
                          onVerifyTransaction(tx.id);
                          alert(`Transaksi ${tx.noTransaksi} berhasil divalidasi dan saldo anggota telah diperbarui.`);
                        }}
                        className="px-3.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                      >
                        Validasi Saldo
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SHU CALCULATOR */}
      {activeTab === 'shu' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-blue-950">Kalkulator Simulasi Pembagian SHU KOPMANTARA</h3>
              <p className="text-xs text-blue-800">
                Sesuai Keputusan RAT & UU Perkoperasian No. 25 Tahun 1992 (Jasa Modal & Jasa Anggota).
              </p>
            </div>
            <button
              onClick={() => {
                alert('Hasil kalkulasi pembagian SHU berhasil disinkronkan ke ledger dan laporan RAT di Google Drive.');
              }}
              className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Simpan & Sinkronkan ke G-Drive
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Input Parameters */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
              <h4 className="font-bold text-slate-900 text-sm">Parameter Alokasi SHU</h4>
              <div>
                <label className="font-bold text-slate-800 block mb-1">Total SHU Bersih Koperasi (Rp):</label>
                <input
                  type="number"
                  step="1000000"
                  value={totalShuTahun}
                  onChange={(e) => setTotalShuTahun(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono text-sm font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Jasa Modal (%):</label>
                  <input
                    type="number"
                    value={porsiJasaModal}
                    onChange={(e) => setPorsiJasaModal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Jasa Anggota/Usaha (%):</label>
                  <input
                    type="number"
                    value={porsiJasaAnggota}
                    onChange={(e) => setPorsiJasaAnggota(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Dana Cadangan (%):</label>
                  <input
                    type="number"
                    value={porsiCadangan}
                    onChange={(e) => setPorsiCadangan(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Dana Pendidikan/Sosial (%):</label>
                  <input
                    type="number"
                    value={porsiSosial}
                    onChange={(e) => setPorsiSosial(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Output Summary */}
            <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-xl space-y-4 text-xs">
              <h4 className="font-bold text-amber-300 text-sm">Rincian Nominal Pembagian Dana</h4>
              <div className="space-y-3">
                <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between">
                  <span>Jasa Modal ({porsiJasaModal}%)</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {formatRupiah((totalShuTahun * porsiJasaModal) / 100)}
                  </span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between">
                  <span>Jasa Anggota ({porsiJasaAnggota}%)</span>
                  <span className="font-bold text-sky-400 text-sm">
                    {formatRupiah((totalShuTahun * porsiJasaAnggota) / 100)}
                  </span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between">
                  <span>Dana Cadangan ({porsiCadangan}%)</span>
                  <span className="font-bold text-white text-sm">
                    {formatRupiah((totalShuTahun * porsiCadangan) / 100)}
                  </span>
                </div>
                <div className="p-3 bg-white/10 rounded-xl flex items-center justify-between">
                  <span>Dana Pendidikan & Sosial ({porsiSosial}%)</span>
                  <span className="font-bold text-white text-sm">
                    {formatRupiah((totalShuTahun * porsiSosial) / 100)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: ASPIRASI ANGGOTA */}
      {activeTab === 'aspirasi' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-blue-950">Saluran Aspirasi & Umpan Balik Anggota (GForm Sync)</h3>
              <p className="text-xs text-slate-700">Respon dan tanggapi setiap usulan dari anggota untuk meningkatkan pelayanan koperasi.</p>
            </div>
          </div>

          <div className="space-y-3">
            {aspirasiList.map((asp) => (
              <div key={asp.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-semibold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      {asp.kategori}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">{asp.judul}</h4>
                    <p className="text-xs text-slate-700">Oleh: {asp.memberName} ({asp.noAnggota}) • {formatDateIndo(asp.tanggal)}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      asp.status === 'SELESAI'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {asp.status}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl">{asp.isi}</p>

                {asp.tanggapanPengurus ? (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs">
                    <strong className="text-blue-950">Tanggapan Pengurus:</strong>
                    <p className="text-blue-900 mt-0.5">{asp.tanggapanPengurus}</p>
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setRespondingAspId(asp.id);
                        setTanggapanText('');
                      }}
                      className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Beri Tanggapan Resmi</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: SELEKSI CALON PENGURUS & PROKER */}
      {activeTab === 'calon_pengurus' && (
        <div className="space-y-6">
          {/* Header Info Banner */}
          <div className="rounded-3xl bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 text-white p-6 shadow-xl border border-blue-800/40">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      member.kopmantara.co.id
                    </span>
                    <span className="text-xs text-blue-200">
                      Gated Form: Hanya Anggota Berstatus Aktif
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-white mt-1">
                    Panel Verifikasi & Seleksi Calon Dewan Pengurus 2026–2029
                  </h3>
                  <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                    Evaluasi usulan <strong>Program Kerja (Proker)</strong> dan verifikasi penandatanganan pakta integritas
                    <strong> kesediaan mengikuti mekanisme pemilihan RAT serta kepatuhan hierarki organisasi</strong>.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto shrink-0">
                <a
                  href={gformConfig.formPengurusUrl || 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Buka Google Form Seleksi</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                </a>

                <button
                  onClick={() => {
                    const text = `Halo Kak Vania (Sekretariat KOPMANTARA), saya pengurus ingin mengecek rekapitulasi data pendaftar calon pengurus dari Google Form.`;
                    window.open(`https://wa.me/${OFFICIAL_WHATSAPP.numberOnly}?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WA Kak Vania</span>
                </button>
              </div>
            </div>
          </div>

          {/* Candidacy List */}
          {pengurusApplications.length === 0 ? (
            <div className="p-10 bg-white border border-slate-200 rounded-3xl text-center space-y-2">
              <Award className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-sm text-slate-800">Belum Ada Pendaftar Calon Pengurus</h4>
              <p className="text-xs text-slate-700 max-w-md mx-auto">
                Anggota aktif KOPMANTARA dapat mendaftar melalui Member Portal (tab Pencalonan Pengurus) atau via Google Form yang telah disediakan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {pengurusApplications.map((app) => (
                <div
                  key={app.id}
                  className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-blue-300 transition-all space-y-4"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-xs shrink-0">
                        CP
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-sm text-slate-900">{app.nama}</h4>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {app.noAnggota}
                          </span>
                        </div>
                        <p className="text-xs text-slate-700">
                          Minat Divisi: <strong className="text-blue-900">{app.divisiDiminati}</strong> • Diajukan: {app.tanggalPengajuan}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                          app.status === 'LOLOS_FIT_PROPER'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : app.status === 'LOLOS_BERKAS'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : app.status === 'DITOLAK'
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>
                  </div>

                  {/* Pakta Integritas Badge & Verification */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-900">
                      <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                      <div>
                        <div className="font-bold text-[11px]">Pakta Integritas Terverifikasi</div>
                        <div className="text-[10px] text-emerald-800">
                          {app.bersediaHierarki ? '✓ Setuju Mekanisme RAT & Kepatuhan Hierarki' : '✗ Belum Menyetujui'}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                      <div className="text-[11px] text-slate-700">
                        <span>Kontak WhatsApp: </span>
                        <strong className="text-slate-900">{app.nomorWa}</strong>
                      </div>
                      <button
                        onClick={() => {
                          const cleanWa = app.nomorWa.replace(/[^0-9]/g, '');
                          const text = `Halo Bpk/Ibu ${app.nama}, kami dari Panitia Seleksi Dewan Pengurus KOPMANTARA ingin mengonfirmasi berkas pendaftaran dan program kerja Anda.`;
                          window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(text)}`, '_blank');
                        }}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>Chat WA</span>
                      </button>
                    </div>
                  </div>

                  {/* Summary of Proker */}
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-slate-800">Program Kerja (Proker) Utama:</span>
                    <p className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-slate-800 text-[11px] leading-relaxed line-clamp-3">
                      {app.prokerUtama}
                    </p>
                  </div>

                  {app.catatanPanitia && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      <strong>Catatan Panitia:</strong> {app.catatanPanitia}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedCandidate(app);
                        setCandidateCatatan(app.catatanPanitia || '');
                      }}
                      className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review Detail Berkas & Proker</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onUpdatePengurusApplicationStatus?.(app.id, 'LOLOS_BERKAS', 'Berkas dan proker memenuhi syarat administrasi.')}
                        className="px-3 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Loloskan Berkas
                      </button>

                      <button
                        onClick={() => onUpdatePengurusApplicationStatus?.(app.id, 'LOLOS_FIT_PROPER', 'Rekomendasi RAT: Lolos tahapan fit & proper test.')}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Lolos Fit & Proper
                      </button>

                      <button
                        onClick={() => onUpdatePengurusApplicationStatus?.(app.id, 'DITOLAK', 'Belum memenuhi kriteria seleksi periode ini.')}
                        className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Tolak
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL: REVIEW DETAIL CALON PENGURUS & PROKER */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Detail Berkas & Proker Calon Pengurus
                  </h3>
                  <p className="text-xs text-slate-700">
                    {selectedCandidate.nama} ({selectedCandidate.noAnggota}) • {selectedCandidate.divisiDiminati}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="text-slate-700 hover:text-slate-900 cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Pakta Integritas Status */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Pernyataan Pakta Integritas Resmi Calon Pengurus</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-emerald-800">
                  <div>✓ Bersedia mengikuti mekanisme pemilihan RAT</div>
                  <div>✓ Bersedia tunduk pada hierarki AD/ART</div>
                  <div>✓ Menjaga marwah & kerahasiaan koperasi</div>
                  <div>✓ Bebas konflik kepentingan pribadi</div>
                </div>
              </div>

              {/* Visi & Misi */}
              <div className="p-4 bg-slate-50 rounded-2xl space-y-1.5">
                <h5 className="font-bold text-slate-900 uppercase text-[11px]">Visi & Misi Kepengurusan:</h5>
                <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                  {selectedCandidate.visiMisi || 'Visi & Misi belum diisi secara terpisah.'}
                </p>
              </div>

              {/* Proker Utama */}
              <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl space-y-1.5">
                <h5 className="font-bold text-blue-950 uppercase text-[11px]">Program Kerja (Proker) Utama:</h5>
                <p className="text-blue-900 font-mono text-[11px] whitespace-pre-line leading-relaxed">
                  {selectedCandidate.prokerUtama}
                </p>
              </div>

              {/* Catatan Panitia Seleksi */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Catatan Panitia / Dewan Pengurus:</label>
                <textarea
                  rows={3}
                  value={candidateCatatan}
                  onChange={(e) => setCandidateCatatan(e.target.value)}
                  placeholder="Masukkan pertimbangan atau catatan untuk calon pengurus..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                ></textarea>
              </div>

              {/* Status Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    const cleanWa = selectedCandidate.nomorWa.replace(/[^0-9]/g, '');
                    const text = `Halo Bpk/Ibu ${selectedCandidate.nama}, kami ingin menyampaikan kabar mengenai berkas pencalonan pengurus Anda di KOPMANTARA.`;
                    window.open(`https://wa.me/${cleanWa}?text=${encodeURIComponent(text)}`, '_blank');
                  }}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat WhatsApp</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdatePengurusApplicationStatus?.(selectedCandidate.id, 'LOLOS_BERKAS', candidateCatatan);
                      setSelectedCandidate(null);
                    }}
                    className="px-3.5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Loloskan Berkas
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdatePengurusApplicationStatus?.(selectedCandidate.id, 'LOLOS_FIT_PROPER', candidateCatatan);
                      setSelectedCandidate(null);
                    }}
                    className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Lolos Fit & Proper
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdatePengurusApplicationStatus?.(selectedCandidate.id, 'DITOLAK', candidateCatatan);
                      setSelectedCandidate(null);
                    }}
                    className="px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold cursor-pointer"
                  >
                    Tolak
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VIEW KTP REVIEW */}
      {selectedKtpMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Review Berkas KTP Anggota</h3>
                <p className="text-xs text-slate-700">{selectedKtpMember.nama} • {selectedKtpMember.nik}</p>
              </div>
              <button onClick={() => setSelectedKtpMember(null)} className="text-slate-700 hover:text-slate-900 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 p-2">
              <img
                src={selectedKtpMember.ktpUrl}
                alt="Dokumen KTP"
                className="w-full h-64 object-cover rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <a
                href={selectedKtpMember.ktpUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
              >
                <span>Buka di Google Drive Vault</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setSelectedKtpMember(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Tutup Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: RESPON ASPIRASI */}
      {respondingAspId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Tanggapan Resmi Dewan Pengurus</h3>
              <button onClick={() => setRespondingAspId(null)} className="text-slate-700 hover:text-slate-900 cursor-pointer">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSendAspirasiResponse} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Tulis Tanggapan / Keputusan Pengurus:</label>
                <textarea
                  rows={4}
                  required
                  value={tanggapanText}
                  onChange={(e) => setTanggapanText(e.target.value)}
                  placeholder="Jelaskan tindak lanjut yang diambil pengurus..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
              >
                Kirim Tanggapan ke Anggota
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
