import React, { useState } from 'react';
import {
  Member,
  Transaction,
  LoanApplication,
  RATDocument,
  AspirasiItem,
  GFormIntegrationConfig,
  GDriveIntegrationConfig,
  PengurusApplication
} from '../../types';
import { OFFICIAL_WHATSAPP } from '../../data/mockData';
import { PengurusApplicationModal } from './PengurusApplicationModal';
import {
  CreditCard,
  Wallet,
  Coins,
  PiggyBank,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  MessageSquarePlus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  Building,
  Upload,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Calculator,
  X,
  Zap,
  Smartphone,
  Plane,
  ShoppingBag,
  ShieldCheck,
  Award,
  HeartHandshake,
  MessageCircle,
  FileSpreadsheet,
  Lock
} from 'lucide-react';
import { formatRupiah, formatDateIndo } from '../../utils/formatters';

interface MemberPortalProps {
  member: Member;
  transactions: Transaction[];
  loans: LoanApplication[];
  ratDocs: RATDocument[];
  aspirasiList: AspirasiItem[];
  pengurusApplications?: PengurusApplication[];
  gformConfig: GFormIntegrationConfig;
  gdriveConfig: GDriveIntegrationConfig;
  onOpenKTA: () => void;
  onOpenGoogleHub: (tab?: 'gform' | 'gdrive' | 'gcloud') => void;
  onDepositSimpanan: (tx: Partial<Transaction>) => void;
  onSubmitLoan: (loan: Partial<LoanApplication>) => void;
  onSubmitAspirasi: (asp: Partial<AspirasiItem>) => void;
  onSubmitPengurusApplication?: (app: Partial<PengurusApplication>) => void;
}

export const MemberPortal: React.FC<MemberPortalProps> = ({
  member,
  transactions,
  loans,
  ratDocs,
  aspirasiList,
  pengurusApplications = [],
  gformConfig,
  gdriveConfig,
  onOpenKTA,
  onOpenGoogleHub,
  onDepositSimpanan,
  onSubmitLoan,
  onSubmitAspirasi,
  onSubmitPengurusApplication
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'transaksi' | 'pinjaman' | 'rat' | 'aspirasi' | 'pencalonan'>('overview');
  const [showPengurusModal, setShowPengurusModal] = useState(false);

  // Check if this member has submitted a candidacy
  const myCandidacy = pengurusApplications.find((app) => app.memberId === member.id || app.noAnggota === member.noAnggota);

  // Deposit Modal State
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositType, setDepositType] = useState<'SIMPANAN_WAJIB' | 'SIMPANAN_SUKARELA'>('SIMPANAN_WAJIB');
  const [depositAmount, setDepositAmount] = useState(100000);
  const [depositMethod, setDepositMethod] = useState<'TRANSFER_BANK' | 'QRIS' | 'POTONG_GAJI'>('TRANSFER_BANK');
  const [depositKeterangan, setDepositKeterangan] = useState('');
  const [depositProofName, setDepositProofName] = useState<string | null>(null);

  // Loan Application Modal State
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [loanCategory, setLoanCategory] = useState<'PENSIUNAN' | 'KARYAWAN' | 'KREDIT_BARANG'>('PENSIUNAN');
  const [loanNominal, setLoanNominal] = useState(10000000);
  const [loanTenor, setLoanTenor] = useState(12);
  const [loanTujuan, setLoanTujuan] = useState('Pembiayaan Multiguna Pensiunan / Karyawan');
  const [loanGaji, setLoanGaji] = useState(6500000);

  // PPOB Interactive Simulation Modal
  const [showPpobModal, setShowPpobModal] = useState(false);
  const [ppobType, setPpobType] = useState<'PLN' | 'PULSA' | 'BPJS' | 'PDAM'>('PLN');
  const [ppobNumber, setPpobNumber] = useState('');
  const [ppobNominal, setPpobNominal] = useState(100000);
  const [ppobSuccessMsg, setPpobSuccessMsg] = useState<string | null>(null);

  // Umroh & Travel Modal
  const [showTravelModal, setShowTravelModal] = useState(false);

  // Aspirasi Modal State
  const [showAspirasiModal, setShowAspirasiModal] = useState(false);
  const [aspJudul, setAspJudul] = useState('');
  const [aspIsi, setAspIsi] = useState('');
  const [aspKategori, setAspKategori] = useState<'Simpan Pinjam' | 'Pelayanan Pengurus' | 'Unit Usaha' | 'Sistem Aplikasi'>('Simpan Pinjam');

  // Filtered transactions for this member
  const memberTransactions = transactions.filter((t) => t.memberId === member.id);
  const memberLoans = loans.filter((l) => l.memberId === member.id);
  const memberAspirasi = aspirasiList.filter((a) => a.noAnggota === member.noAnggota);

  // Loan Calculator helper
  const loanBungaBulan = 0.01; // 1.0% flat per bulan
  const totalBunga = loanNominal * loanBungaBulan * loanTenor;
  const angsuranPokokPerBulan = loanNominal / loanTenor;
  const angsuranBungaPerBulan = loanNominal * loanBungaBulan;
  const totalAngsuranPerBulan = angsuranPokokPerBulan + angsuranBungaPerBulan;

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (depositAmount <= 0) return;

    const newTx: Partial<Transaction> = {
      id: `trx_${Date.now()}`,
      noTransaksi: `TRX-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
      memberId: member.id,
      memberName: member.nama,
      noAnggota: member.noAnggota,
      type: depositType,
      amount: Number(depositAmount),
      date: new Date().toISOString().split('T')[0],
      status: 'MENUNGGU_VERIFIKASI',
      paymentMethod: depositMethod,
      keterangan: depositKeterangan || `Setoran ${depositType.replace('_', ' ')} manual`,
      buktiBayarUrl: depositProofName ? `https://drive.google.com/file/d/proof_${Date.now()}/view` : undefined,
      gdriveFileId: `gdrive_bukti_${Date.now()}`
    };

    onDepositSimpanan(newTx);
    setShowDepositModal(false);
    setDepositKeterangan('');
    setDepositProofName(null);
    alert('Konfirmasi setoran berhasil dikirim! Pengurus akan memverifikasi mutasi Anda.');
  };

  const handleLoanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loanNominal <= 0) return;

    const newLoan: Partial<LoanApplication> = {
      id: `loan_${Date.now()}`,
      noPengajuan: `PINJ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      memberId: member.id,
      memberName: member.nama,
      noAnggota: member.noAnggota,
      nominal: Number(loanNominal),
      tenorBulan: Number(loanTenor),
      bungaPersen: 1.0,
      angsuranPerBulan: Math.round(totalAngsuranPerBulan),
      tujuan: `[${loanCategory}] ${loanTujuan}`,
      penghasilanBulanan: Number(loanGaji),
      status: 'MENUNGGU_REVIEW',
      tanggalPengajuan: new Date().toISOString().split('T')[0],
      berkasDrive: {
        ktp: member.ktpUrl,
        slipGaji: member.slipGajiUrl || 'https://drive.google.com/file/d/slip_gaji/view',
        formulirGForm: gformConfig.formPendaftaranUrl
      }
    };
    onSubmitLoan(newLoan);
    setShowLoanModal(false);
    alert('Pengajuan pembiayaan berhasil dikirim! Dewan Pengurus KOPMANTARA akan memproses analisis 5C.');
  };

  const handlePpobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ppobNumber) return;
    setPpobSuccessMsg(`Transaksi ${ppobType} nomor ${ppobNumber} sebesar ${formatRupiah(ppobNominal)} berhasil diproses dengan diskon cashback anggota!`);
    setTimeout(() => {
      setPpobSuccessMsg(null);
      setShowPpobModal(false);
      setPpobNumber('');
    }, 2500);
  };

  const handleAspirasiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aspJudul || !aspIsi) return;
    const newAsp: Partial<AspirasiItem> = {
      id: `asp_${Date.now()}`,
      memberName: member.nama,
      noAnggota: member.noAnggota,
      tanggal: new Date().toISOString().split('T')[0],
      judul: aspJudul,
      isi: aspIsi,
      kategori: aspKategori,
      status: 'MENUNGGU_TANGGAPAN'
    };
    onSubmitAspirasi(newAsp);
    setShowAspirasiModal(false);
    setAspJudul('');
    setAspIsi('');
    alert('Aspirasi Anda telah tersimpan dan disinkronkan ke Google Sheet pengurus KOPMANTARA.');
  };

  return (
    <div className="space-y-6">
      {/* 1. Official Kopmantara Top Member Card Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-6 shadow-xl border border-blue-800/40 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={member.fotoUrl}
              alt={member.nama}
              className="w-18 h-18 rounded-2xl object-cover border-2 border-amber-400 shadow-lg bg-slate-800"
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded bg-amber-400 text-slate-950">
                  {member.noAnggota}
                </span>
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Anggota Resmi Kopmantara
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white tracking-tight">{member.nama}</h2>
              <div className="text-xs text-blue-200 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-blue-300" />
                <span>{member.unitKerja}</span>
                <span>•</span>
                <span>NIK: {member.nik}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Open Digital KTA & Layanan */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <button
              onClick={onOpenKTA}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <CreditCard className="w-4 h-4 text-slate-950" />
              <span>e-KTA Mantara Smart Card</span>
            </button>

            <button
              onClick={() => onOpenGoogleHub('gdrive')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/15 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-sky-300" />
              <span>G-Drive Berkas</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. 5 Pilar Koperasi Mantara (kopmantara.co.id identity) */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-2xl p-4 text-white shadow-xs border border-blue-800/50">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-bold text-amber-300">5 Pilar KOPMANTARA:</span>
            <span className="text-slate-200 hidden sm:inline">Kebersamaan • Amanah • Sinergi • Profesionalisme • Inovasi</span>
          </div>
          <div className="text-[11px] text-blue-200 flex items-center gap-2">
            <span>Portal Resmi:</span>
            <a href="https://kopmantara.co.id" target="_blank" rel="noreferrer" className="text-amber-300 font-bold hover:underline">
              kopmantara.co.id
            </a>
          </div>
        </div>
      </div>

      {/* 2.1. RECRUITMENT BANNER: Pencalonan Pengurus KOPMANTARA (Exclusive for Members) */}
      <div className="rounded-2xl p-5 bg-gradient-to-r from-amber-500/15 via-blue-900/10 to-indigo-900/20 border-2 border-amber-400/50 shadow-sm relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/30 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                  Open Recruitment Pengurus
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  Khusus Anggota Aktif KOPMANTARA
                </span>
                {myCandidacy && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Anda Sudah Mendaftar: {myCandidacy.status}
                  </span>
                )}
              </div>
              <h3 className="text-sm font-extrabold text-blue-950">
                Seleksi Calon Dewan Pengurus KOPMANTARA Periode 2026–2029
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed max-w-2xl">
                Diberikan kesempatan bagi Anggota Koperasi untuk mencalonkan diri menjadi Pengurus. Fokus pada penyusunan
                <strong> Program Kerja (Proker)</strong> serta penandatanganan pakta integritas
                <strong> kesediaan mengikuti mekanisme pemilihan & hierarki organisasi</strong> yang berlaku.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto shrink-0">
            <button
              onClick={() => {
                setActiveSubTab('pencalonan');
                setShowPengurusModal(true);
              }}
              className="flex-1 lg:flex-initial px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{myCandidacy ? 'Lihat / Edit Proker' : 'Daftar Calon Pengurus'}</span>
            </button>

            <a
              href={gformConfig.formPengurusUrl || 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1'}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-blue-950 border border-slate-300 text-xs font-bold transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Google Form</span>
              <ExternalLink className="w-3 h-3 text-slate-700" />
            </a>

            <button
              onClick={() => {
                const text = `Halo Kak Vania (Koperasi Mantara), saya ${member.nama} (${member.noAnggota}) ingin bertanya perihal pendaftaran calon pengurus dan panduan program kerja (proker).`;
                window.open(`https://wa.me/${OFFICIAL_WHATSAPP.numberOnly}?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
              title="Konsultasi WhatsApp Kak Vania"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WA Vania</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Financial Summary Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Simpanan */}
        <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-950">Total Simpanan</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-blue-950">
            {formatRupiah(member.totalSimpanan)}
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>Pokok + Wajib + Sukarela</span>
          </div>
        </div>

        {/* Simpanan Wajib */}
        <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-950">Simpanan Wajib</span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-800 flex items-center justify-center">
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-blue-950">
            {formatRupiah(member.simpananWajib)}
          </div>
          <div className="text-[11px] text-slate-700">
            Rp 100.000 / bulan
          </div>
        </div>

        {/* Simpanan Sukarela */}
        <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-950">Simpanan Sukarela</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-amber-900">
            {formatRupiah(member.simpananSukarela)}
          </div>
          <div className="text-[11px] text-amber-800 font-semibold">
            Bisa ditarik sewaktu-waktu
          </div>
        </div>

        {/* Estimasi SHU Dividen */}
        <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-950">Estimasi SHU 2026</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-extrabold text-indigo-700">
            {formatRupiah(member.shuTahunBerjalan)}
          </div>
          <div className="text-[11px] text-slate-700">
            Jasa Modal & Partisipasi Transaksi
          </div>
        </div>
      </div>

      {/* 4. Layanan Unggulan Kopmantara (Interactive Hub matching kopmantara.co.id) */}
      <div className="bg-white rounded-3xl p-6 border border-blue-100 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-extrabold text-blue-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Layanan Utama Koperasi Mandiri Artha Nusantara
            </h3>
            <p className="text-xs text-slate-700">Produk finansial dan kemudahan transaksi digital untuk seluruh anggota</p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-900 border border-blue-200">
            kopmantara.co.id
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* 1. Pembiayaan Pensiunan & Karyawan */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-100 hover:border-blue-300 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-blue-950">Pembiayaan Pensiunan & Karyawan</h4>
              <p className="text-[11px] text-slate-700 leading-tight">
                Plafon s/d Rp 50 Juta, bunga flat 1.0%/bln, syarat mudah & cepat.
              </p>
            </div>
            <button
              onClick={() => setShowLoanModal(true)}
              className="w-full py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Ajukan Pembiayaan
            </button>
          </div>

          {/* 2. Simpanan Mantara Sejahtera */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100 hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <PiggyBank className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-emerald-950">Simpanan Mantara Sejahtera</h4>
              <p className="text-[11px] text-slate-700 leading-tight">
                Simpanan Pokok, Wajib & Sukarela dengan imbal hasil SHU kompetitif.
              </p>
            </div>
            <button
              onClick={() => setShowDepositModal(true)}
              className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Setor Simpanan
            </button>
          </div>

          {/* 3. Penjualan Kredit Non-Gadai */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100 hover:border-amber-300 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-amber-950">Kredit Non-Gadai Elektronik</h4>
              <p className="text-[11px] text-slate-700 leading-tight">
                Cicilan barang, laptop, smartphone & sepeda motor tanpa agunan sertifikat.
              </p>
            </div>
            <button
              onClick={() => {
                setLoanCategory('KREDIT_BARANG');
                setLoanTujuan('Pembelian Laptop & Perangkat Elektronik Non-Gadai');
                setShowLoanModal(true);
              }}
              className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Katalog Cicilan
            </button>
          </div>

          {/* 4. Layanan PPOB Mantara Digital */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 hover:border-sky-300 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-sky-600 text-white flex items-center justify-center shadow-xs">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-sky-950">Layanan PPOB Digital</h4>
              <p className="text-[11px] text-slate-700 leading-tight">
                Bayar Listrik PLN, BPJS, PDAM, pulsa & kuota data dengan harga anggota.
              </p>
            </div>
            <button
              onClick={() => setShowPpobModal(true)}
              className="w-full py-1.5 bg-sky-700 hover:bg-sky-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Bayar Tagihan
            </button>
          </div>

          {/* 5. Mantara Travel & Umroh */}
          <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-100 hover:border-purple-300 transition-all flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="w-9 h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                <Plane className="w-5 h-5" />
              </div>
              <h4 className="text-xs font-bold text-purple-950">Mantara Travel & Umroh</h4>
              <p className="text-[11px] text-slate-700 leading-tight">
                Paket Umroh berizin resmi dan wisata halal dengan cicilan syariah.
              </p>
            </div>
            <button
              onClick={() => setShowTravelModal(true)}
              className="w-full py-1.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Lihat Paket
            </button>
          </div>
        </div>
      </div>

      {/* 5. Main Subtabs Header */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'overview'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          Riwayat Mutasi Transaksi
        </button>

        <button
          onClick={() => setActiveSubTab('pinjaman')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeSubTab === 'pinjaman'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <span>Pembiayaan & Pinjaman</span>
          {memberLoans.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-100 text-blue-900 font-bold">
              {memberLoans.length}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('rat')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'rat'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          Dokumen RAT & AD/ART
        </button>

        <button
          onClick={() => setActiveSubTab('aspirasi')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeSubTab === 'aspirasi'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          Aspirasi & Saran Anggota
        </button>

        <button
          onClick={() => setActiveSubTab('pencalonan')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
            activeSubTab === 'pencalonan'
              ? 'border-amber-500 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-slate-700 hover:text-amber-800'
          }`}
        >
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <span>Pencalonan Pengurus</span>
          {myCandidacy && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-100 text-emerald-800 font-bold">
              Terdaftar
            </span>
          )}
        </button>
      </div>

      {/* Subtab 1: Mutasi & Transaksi */}
      {activeSubTab === 'overview' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Buku Mutasi Simpan Pinjam Anggota</h3>
            <span className="text-xs text-slate-700">Tersinkronisasi dengan Database Koperasi</span>
          </div>

          <div className="divide-y divide-slate-100">
            {memberTransactions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-700">
                Belum ada mutasi transaksi pada periode ini.
              </div>
            ) : (
              memberTransactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        tx.type.includes('SIMPANAN') || tx.type === 'SHU_DIVIDEN'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {tx.type.includes('SIMPANAN') ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900">{tx.keterangan}</div>
                      <div className="text-[11px] text-slate-700 flex items-center gap-2">
                        <span>{tx.noTransaksi}</span>
                        <span>•</span>
                        <span>{formatDateIndo(tx.date)}</span>
                        <span>•</span>
                        <span className="font-semibold text-slate-700">{tx.paymentMethod}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-extrabold ${
                        tx.type.includes('SIMPANAN') || tx.type === 'SHU_DIVIDEN'
                          ? 'text-blue-900'
                          : 'text-slate-900'
                      }`}
                    >
                      {tx.type.includes('SIMPANAN') || tx.type === 'SHU_DIVIDEN' ? '+' : '-'} {formatRupiah(tx.amount)}
                    </div>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        tx.status === 'BERHASIL'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : tx.status === 'MENUNGGU_VERIFIKASI'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {tx.status === 'BERHASIL'
                        ? 'Tervalidasi'
                        : tx.status === 'MENUNGGU_VERIFIKASI'
                        ? 'Menunggu Review'
                        : 'Ditolak'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Subtab 2: Pinjaman Saya */}
      {activeSubTab === 'pinjaman' && (
        <div className="space-y-4">
          {memberLoans.length === 0 ? (
            <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-3">
              <Calculator className="w-10 h-10 text-slate-400 mx-auto" />
              <div className="text-sm font-bold text-slate-800">Anda Belum Memiliki Pinjaman Aktif</div>
              <p className="text-xs text-slate-700 max-w-md mx-auto">
                Koperasi Mantara (kopmantara.co.id) menyediakan fasilitas pembiayaan pensiunan dan karyawan dengan bunga ringan 1% per bulan flat.
              </p>
              <button
                onClick={() => setShowLoanModal(true)}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                Ajukan Pinjaman Sekarang
              </button>
            </div>
          ) : (
            memberLoans.map((loan) => (
              <div key={loan.id} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-slate-700 font-bold">{loan.noPengajuan}</span>
                    <h4 className="text-base font-bold text-slate-900">{loan.tujuan}</h4>
                    <p className="text-xs text-slate-700">Tanggal Pengajuan: {formatDateIndo(loan.tanggalPengajuan)}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black ${
                      loan.status === 'BERJALAN' || loan.status === 'DISETUJUI_PENGURUS'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : loan.status === 'MENUNGGU_REVIEW'
                        ? 'bg-amber-50 text-amber-800 border border-amber-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {loan.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-700 block text-[11px]">Plafon Pinjaman</span>
                    <span className="font-bold text-slate-900 text-sm">{formatRupiah(loan.nominal)}</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block text-[11px]">Tenor Waktu</span>
                    <span className="font-bold text-slate-900 text-sm">{loan.tenorBulan} Bulan</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block text-[11px]">Angsuran / Bulan</span>
                    <span className="font-bold text-blue-800 text-sm">{formatRupiah(loan.angsuranPerBulan)}</span>
                  </div>
                  <div>
                    <span className="text-slate-700 block text-[11px]">Sisa Pinjaman</span>
                    <span className="font-bold text-slate-900 text-sm">{formatRupiah(member.sisaPinjaman)}</span>
                  </div>
                </div>

                {loan.catatanPengurus && (
                  <div className="text-xs text-slate-700 bg-amber-50/60 p-3 rounded-xl border border-amber-200">
                    <strong className="text-amber-900">Catatan Pengurus:</strong> {loan.catatanPengurus}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab 3: Dokumen & Laporan RAT */}
      {activeSubTab === 'rat' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-blue-950">Arsip Digital RAT & Dokumen Koperasi</h4>
              <p className="text-[11px] text-slate-700">Tersimpan di Google Drive Vault KOPMANTARA</p>
            </div>
            <button
              onClick={() => onOpenGoogleHub('gdrive')}
              className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Buka Drive Vault</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ratDocs.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                      {doc.fileType}
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{doc.judul}</h5>
                      <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                        {doc.kategori}
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-700">{doc.deskripsi}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-700 text-[11px]">Ukuran: {doc.size}</span>
                  <a
                    href={doc.downloadUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                  >
                    <span>Unduh dari Drive</span>
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subtab 4: Aspirasi Saya */}
      {activeSubTab === 'aspirasi' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900">Riwayat Aspirasi & Pengaduan Anggota</h4>
            <button
              onClick={() => setShowAspirasiModal(true)}
              className="px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4" />
              <span>Tulis Aspirasi Baru</span>
            </button>
          </div>

          {memberAspirasi.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-700">
              Anda belum pernah mengirimkan aspirasi. Aspirasi Anda akan langsung diteruskan ke Dewan Pengurus KOPMANTARA.
            </div>
          ) : (
            memberAspirasi.map((asp) => (
              <div key={asp.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">{asp.judul}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      asp.status === 'SELESAI'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {asp.status}
                  </span>
                </div>
                <p className="text-xs text-slate-700">{asp.isi}</p>
                {asp.tanggapanPengurus && (
                  <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs">
                    <strong className="text-blue-950">Tanggapan Dewan Pengurus:</strong>
                    <p className="text-blue-900 mt-0.5">{asp.tanggapanPengurus}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Subtab 5: Pencalonan Dewan Pengurus & Portofolio Proker */}
      {activeSubTab === 'pencalonan' && (
        <div className="space-y-6">
          {/* Top Status & Overview Card */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-6 shadow-xl border border-blue-800/40 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/20 shrink-0">
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                      member.kopmantara.co.id
                    </span>
                    <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Gated Access: Anggota Resmi
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-white mt-1">
                    Seleksi & Rekrutmen Dewan Pengurus KOPMANTARA 2026–2029
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-1">
                    Sesuai Anggaran Dasar & Anggaran Rumah Tangga (AD/ART), formulir ini dikhususkan bagi anggota yang ingin mencalonkan diri menjadi pengurus dengan fokus pada penyusunan
                    <strong> Program Kerja (Proker)</strong> serta penandatanganan pakta integritas
                    <strong> kesediaan mengikuti mekanisme pemilihan dan tunduk pada hierarki</strong> organisasi.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
                <button
                  onClick={() => setShowPengurusModal(true)}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>{myCandidacy ? 'Perbarui Portofolio Proker' : 'Isi Form Proker & Pakta'}</span>
                </button>

                <a
                  href={gformConfig.formPengurusUrl || 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1'}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Buka Google Form</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                </a>
              </div>
            </div>
          </div>

          {/* Candidacy Status Card (If already submitted) */}
          {myCandidacy ? (
            <div className="p-5 bg-white border-2 border-emerald-300 rounded-3xl shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Berkas Pencalonan Anda Telah Terdaftar di Panitia Seleksi
                    </h4>
                    <span className="text-xs text-slate-700">
                      Diajukan pada tanggal: <strong>{myCandidacy.tanggalPengajuan}</strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                    Status: {myCandidacy.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 uppercase">Divisi / Bidang yang Diminati</span>
                  <div className="font-bold text-blue-950 text-xs">{myCandidacy.divisiDiminati}</div>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl space-y-1">
                  <span className="text-[11px] font-bold text-slate-700 uppercase">Status Pakta Integritas</span>
                  <div className="text-emerald-700 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Mekanisme Pemilihan & Hierarki Disetujui</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-900">Ringkasan Program Kerja (Proker) Utama:</div>
                <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-2xl text-blue-950 whitespace-pre-line font-mono text-[11px] leading-relaxed">
                  {myCandidacy.prokerUtama}
                </div>
              </div>

              {myCandidacy.catatanPanitia && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <strong>Catatan Panitia Seleksi:</strong> {myCandidacy.catatanPanitia}
                </div>
              )}
            </div>
          ) : (
            <div className="p-5 bg-amber-50/70 border border-amber-200 rounded-3xl text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="font-bold text-xs flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Anda belum mengajukan portofolio Program Kerja (Proker) calon pengurus.</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Silakan klik tombol &quot;Isi Form Proker &amp; Pakta&quot; untuk melengkapi gagasan dan menandatangani komitmen kepatuhan hierarki kepengurusan KOPMANTARA.
                </p>
              </div>
              <button
                onClick={() => setShowPengurusModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors shrink-0 cursor-pointer"
              >
                Mulai Pendaftaran
              </button>
            </div>
          )}

          {/* 3 Core Selection Pillars Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                1. Program Kerja (Proker)
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Penilaian difokuskan pada gagasan inovatif, terukur, dan realistis untuk meningkatkan layanan simpan pinjam, permodalan, dan perolehan SHU bagi kesejahteraan anggota.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                2. Kepatuhan Mekanisme & Hierarki
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Calon pengurus menandatangani pakta integritas bersedia mengikuti mekanisme pemilihan demokratis sesuai AD/ART serta tunduk dan patuh pada hierarki struktural kepengurusan koperasi.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide">
                3. Pendampingan WhatsApp Vania
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed">
                Butuh asistensi pengisian format proker atau konfirmasi berkas? Sekretariat Koperasi melalui Kak Vania siap membantu Anda secara langsung via WhatsApp: <strong>{OFFICIAL_WHATSAPP.phone}</strong>.
              </p>
              <button
                onClick={() => {
                  const text = `Halo Kak Vania (Koperasi Mantara), saya ${member.nama} (${member.noAnggota}) ingin berkonsultasi mengenai pendaftaran calon pengurus dan format program kerja.`;
                  window.open(`https://wa.me/${OFFICIAL_WHATSAPP.numberOnly}?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 pt-1 cursor-pointer"
              >
                <span>Chat Kak Vania</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SETOR SIMPANAN */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Setor Simpanan Koperasi</h3>
                <p className="text-[11px] text-slate-700">Koperasi Mandiri Artha Nusantara (KOPMANTARA)</p>
              </div>
              <button onClick={() => setShowDepositModal(false)} className="text-slate-700 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleDepositSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Jenis Simpanan:</label>
                <select
                  value={depositType}
                  onChange={(e) => setDepositType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="SIMPANAN_WAJIB">Simpanan Wajib (Rp 100.000 / bln)</option>
                  <option value="SIMPANAN_SUKARELA">Simpanan Sukarela (Bebas Nominal)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Nominal Setoran (Rp):</label>
                <input
                  type="number"
                  min="50000"
                  step="50000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Metode Pembayaran:</label>
                <select
                  value={depositMethod}
                  onChange={(e) => setDepositMethod(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="TRANSFER_BANK">Transfer Bank (BCA / Mandiri / BRI / BSI)</option>
                  <option value="QRIS">QRIS Statis KOPMANTARA (Semua E-Wallet)</option>
                  <option value="POTONG_GAJI">Potong Gaji Otomatis (Unit Kerja)</option>
                </select>
              </div>

              {/* Upload Proof to Google Drive */}
              <div>
                <label className="font-bold text-slate-800 block mb-1">Upload Bukti Transfer (Drive Sync):</label>
                <div className="p-3 border border-dashed border-slate-300 rounded-xl text-center space-y-1.5">
                  <Upload className="w-5 h-5 text-blue-600 mx-auto" />
                  <div className="text-[11px] text-slate-700">
                    {depositProofName ? (
                      <span className="font-semibold text-blue-700">{depositProofName}</span>
                    ) : (
                      'Klik untuk memilih foto/screenshot bukti transfer'
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setDepositProofName(e.target.files[0].name);
                      }
                    }}
                    className="text-[10px] text-slate-700 mx-auto block cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Keterangan / Catatan:</label>
                <input
                  type="text"
                  value={depositKeterangan}
                  onChange={(e) => setDepositKeterangan(e.target.value)}
                  placeholder="Contoh: Setoran Simpanan Wajib Bulan Ini"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Kirim Konfirmasi Setoran
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: AJUKAN PINJAMAN */}
      {showLoanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Formulir Pembiayaan & Pinjaman</h3>
                <p className="text-[11px] text-slate-700">Koperasi Mandiri Artha Nusantara (Bunga 1% / Bulan Flat)</p>
              </div>
              <button onClick={() => setShowLoanModal(false)} className="text-slate-700 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Loan Simulator Box */}
            <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 space-y-2">
              <div className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-700" />
                Simulasi Angsuran Otomatis (kopmantara.co.id)
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-700 text-[11px] block">Plafon Diajukan:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(loanNominal)}</span>
                </div>
                <div>
                  <span className="text-slate-700 text-[11px] block">Tenor Pembiayaan:</span>
                  <span className="font-bold text-slate-900">{loanTenor} Bulan</span>
                </div>
                <div>
                  <span className="text-slate-700 text-[11px] block">Estimasi Angsuran/Bln:</span>
                  <span className="font-bold text-blue-800 text-sm">{formatRupiah(totalAngsuranPerBulan)}</span>
                </div>
                <div>
                  <span className="text-slate-700 text-[11px] block">Total Pengembalian:</span>
                  <span className="font-bold text-slate-900">{formatRupiah(loanNominal + totalBunga)}</span>
                </div>
              </div>
            </div>

            <form onSubmit={handleLoanSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Kategori Pembiayaan:</label>
                <select
                  value={loanCategory}
                  onChange={(e) => setLoanCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="PENSIUNAN">Pembiayaan Pensiunan</option>
                  <option value="KARYAWAN">Pembiayaan Karyawan</option>
                  <option value="KREDIT_BARANG">Kredit Non-Gadai Elektronik / Sepeda Motor</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Jumlah Nominal Pinjaman (Rp):</label>
                <input
                  type="number"
                  min="1000000"
                  max="50000000"
                  step="500000"
                  value={loanNominal}
                  onChange={(e) => setLoanNominal(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Jangka Waktu / Tenor (Bulan):</label>
                <select
                  value={loanTenor}
                  onChange={(e) => setLoanTenor(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value={6}>6 Bulan</option>
                  <option value={10}>10 Bulan</option>
                  <option value={12}>12 Bulan (1 Tahun)</option>
                  <option value={18}>18 Bulan (1.5 Tahun)</option>
                  <option value={24}>24 Bulan (2 Tahun)</option>
                  <option value={36}>36 Bulan (3 Tahun)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Tujuan / Keperluan Pinjaman:</label>
                <input
                  type="text"
                  required
                  value={loanTujuan}
                  onChange={(e) => setLoanTujuan(e.target.value)}
                  placeholder="Misal: Biaya Pendidikan / Renovasi / Modal Kerja"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Penghasilan / Gaji Bulanan (Rp):</label>
                <input
                  type="number"
                  value={loanGaji}
                  onChange={(e) => setLoanGaji(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 space-y-1">
                <div className="font-semibold text-slate-800">Berkas Terlampir Otomatis dari G-Drive:</div>
                <div>• KTP Anggota: <span className="text-emerald-700 font-semibold">Tersedia</span></div>
                <div>• Riwayat Simpanan: <span className="text-blue-700 font-semibold">{formatRupiah(member.totalSimpanan)}</span></div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
              >
                Kirim Pengajuan Pembiayaan
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PPOB MANTARA DIGITAL */}
      {showPpobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Layanan PPOB Mantara Digital
                </h3>
                <p className="text-[11px] text-slate-700">Bayar Tagihan & Beli Voucher dengan Diskon Anggota</p>
              </div>
              <button onClick={() => setShowPpobModal(false)} className="text-slate-700 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {ppobSuccessMsg ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <div className="text-xs font-bold text-emerald-950">{ppobSuccessMsg}</div>
              </div>
            ) : (
              <form onSubmit={handlePpobSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Pilih Layanan PPOB:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {(['PLN', 'PULSA', 'BPJS', 'PDAM'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setPpobType(t)}
                        className={`py-2 text-center rounded-xl font-bold border transition-colors cursor-pointer ${
                          ppobType === t
                            ? 'bg-blue-700 text-white border-blue-700 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">
                    {ppobType === 'PLN'
                      ? 'ID Pelanggan / Nomor Meter PLN:'
                      : ppobType === 'PULSA'
                      ? 'Nomor Handphone:'
                      : ppobType === 'BPJS'
                      ? 'Nomor Kartu BPJS Kesehatan:'
                      : 'Nomor Pelanggan PDAM:'}
                  </label>
                  <input
                    type="text"
                    required
                    value={ppobNumber}
                    onChange={(e) => setPpobNumber(e.target.value)}
                    placeholder="Masukkan nomor pelanggan / HP"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Nominal / Paket:</label>
                  <select
                    value={ppobNominal}
                    onChange={(e) => setPpobNominal(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option value={50000}>Rp 50.000 (Harga Anggota: Rp 49.000)</option>
                    <option value={100000}>Rp 100.000 (Harga Anggota: Rp 98.000)</option>
                    <option value={200000}>Rp 200.000 (Harga Anggota: Rp 196.000)</option>
                    <option value={500000}>Rp 500.000 (Harga Anggota: Rp 492.000)</option>
                  </select>
                </div>

                <div className="p-3 bg-blue-50 rounded-xl text-[11px] text-blue-900 border border-blue-200">
                  <span>Pembayaran langsung dipotong dari saldo Simpanan Sukarela Anda: </span>
                  <strong>{formatRupiah(member.simpananSukarela)}</strong>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Bayar Transaksi PPOB
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* MODAL: MANTARA TRAVEL & UMROH */}
      {showTravelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Plane className="w-4 h-4 text-purple-600" />
                  Mantara Travel & Umroh
                </h3>
                <p className="text-[11px] text-slate-700">Paket Ibadah & Wisata Halal KOPMANTARA</p>
              </div>
              <button onClick={() => setShowTravelModal(false)} className="text-slate-700 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              {/* Package 1 */}
              <div className="p-4 rounded-2xl bg-purple-50 border border-purple-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-purple-950">Paket Umroh Barokah 9 Hari</span>
                  <span className="font-bold text-purple-700">Rp 28.500.000</span>
                </div>
                <p className="text-[11px] text-slate-700">
                  Hotel Bintang 4 Mekkah & Madinah, Tiket Pesawat Direct, Visa, Muthawif Berpengalaman, dan Manasik.
                </p>
                <div className="text-[10px] text-purple-800 font-semibold">
                  Tersedia fasilitas cicilan talangan syariah tanpa riba untuk anggota aktif.
                </div>
              </div>

              {/* Package 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900">Paket Wisata Halal Turki & Cappadocia</span>
                  <span className="font-bold text-blue-700">Rp 21.000.000</span>
                </div>
                <p className="text-[11px] text-slate-700">
                  10 Hari 7 Malam, Destinasi Istanbul, Bursa, Kusadasi, Pamukkale, Konya, Cappadocia.
                </p>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900">
                Hubungi Divisi Travel & Umroh KOPMANTARA di WhatsApp <strong>0811-1829-4500</strong> untuk konsultasi pendaftaran.
              </div>

              <button
                onClick={() => {
                  setShowTravelModal(false);
                  alert('Permintaan informasi paket Umroh telah dicatat. Customer service KOPMANTARA akan menghubungi Anda via WhatsApp.');
                }}
                className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
              >
                Daftar Minat / Konsultasi Paket
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TULIS ASPIRASI */}
      {showAspirasiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Saluran Aspirasi & Saran Anggota</h3>
              <button onClick={() => setShowAspirasiModal(false)} className="text-slate-700 hover:text-slate-900 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAspirasiSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Kategori Masukan:</label>
                <select
                  value={aspKategori}
                  onChange={(e) => setAspKategori(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="Simpan Pinjam">Layanan Simpan Pinjam</option>
                  <option value="Pelayanan Pengurus">Kinerja & Pelayanan Pengurus</option>
                  <option value="Unit Usaha">Unit Usaha & Toko Koperasi</option>
                  <option value="Sistem Aplikasi">Sistem Aplikasi & Digitalisasi</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Judul Usulan / Topik:</label>
                <input
                  type="text"
                  required
                  value={aspJudul}
                  onChange={(e) => setAspJudul(e.target.value)}
                  placeholder="Tuliskan inti saran Anda"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Detail Saran / Masukan Konstruktif:</label>
                <textarea
                  rows={4}
                  required
                  value={aspIsi}
                  onChange={(e) => setAspIsi(e.target.value)}
                  placeholder="Jelaskan aspirasi Anda secara detail..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
              >
                Kirim Aspirasi ke Pengurus
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: PENDAFTARAN CALON PENGURUS & PROKER */}
      {showPengurusModal && (
        <PengurusApplicationModal
          member={member}
          formPengurusUrl={gformConfig.formPengurusUrl || 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1'}
          existingApplication={myCandidacy}
          onSubmitApplication={(app) => {
            onSubmitPengurusApplication?.(app);
            setShowPengurusModal(false);
          }}
          onOpenAuthForMember={() => {}}
          onClose={() => setShowPengurusModal(false)}
        />
      )}
    </div>
  );
};
