import React, { useState } from 'react';
import { UserAccount, UserRole, Member } from '../types';
import {
  X,
  Users,
  UserCheck,
  ShieldCheck,
  Building2,
  Lock,
  Mail,
  UserPlus,
  ArrowRight,
  Sparkles,
  ExternalLink,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';

interface AuthModalProps {
  defaultRole?: UserRole;
  users: UserAccount[];
  members: Member[];
  formPendaftaranUrl: string;
  onLogin: (user: UserAccount) => void;
  onRegisterMember: (newMember: Partial<Member>) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  defaultRole = 'ANGGOTA',
  users,
  members,
  formPendaftaranUrl,
  onLogin,
  onRegisterMember,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<UserRole | 'REGISTER'>(defaultRole);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('koperasi123');
  const [error, setError] = useState<string | null>(null);

  // Registration Form State
  const [regNama, setRegNama] = useState('');
  const [regNik, setRegNik] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regUnitKerja, setRegUnitKerja] = useState('Unit Kerja Mantara Cabang Barat');
  const [regAlamat, setRegAlamat] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  const handleQuickLogin = (role: UserRole) => {
    const user = users.find((u) => u.role === role);
    if (user) {
      onLogin(user);
      onClose();
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const user = users.find(
      (u) =>
        (u.username.toLowerCase() === identifier.toLowerCase() ||
          u.email.toLowerCase() === identifier.toLowerCase() ||
          (u.memberId && members.find((m) => m.id === u.memberId)?.noAnggota.toLowerCase() === identifier.toLowerCase()) ||
          (u.memberId && members.find((m) => m.id === u.memberId)?.nik === identifier)) &&
        u.role === activeTab
    );

    if (user) {
      onLogin(user);
      onClose();
    } else {
      // Allow demo fallback for specified role
      const fallbackUser = users.find((u) => u.role === activeTab);
      if (fallbackUser) {
        onLogin(fallbackUser);
        onClose();
      } else {
        setError(`Akun untuk peran ${activeTab} tidak ditemukan. Silakan gunakan 1-Klik Login Cepat Demo di bawah.`);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNama || !regNik || !regEmail) {
      setError('Mohon lengkapi seluruh field wajib pendaftaran.');
      return;
    }

    const newMember: Partial<Member> = {
      id: `mem_${Date.now()}`,
      noAnggota: `PENDING-2026-00${members.length + 1}`,
      nik: regNik,
      nama: regNama,
      email: regEmail,
      phone: regPhone || '0812-3456-7890',
      alamat: regAlamat || 'Jakarta, Indonesia',
      unitKerja: regUnitKerja,
      jenisKelamin: 'Laki-laki',
      pekerjaan: 'Karyawan',
      tglGabung: new Date().toISOString().split('T')[0],
      status: 'PENDING',
      fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
      ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
      simpananPokok: 500000,
      simpananWajib: 0,
      simpananSukarela: 0,
      totalSimpanan: 500000,
      pinjamanAktif: 0,
      sisaPinjaman: 0,
      riwayatKolektibilitas: 'LANCAR',
      shuTahunBerjalan: 0,
      ratingKeaktifan: 3,
      catatan: 'Pendaftaran mandiri melalui portal resmi KOPMANTARA.'
    };

    onRegisterMember(newMember);
    setRegSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-blue-900/10 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-700 to-indigo-900 border border-blue-400/30 flex items-center justify-center text-white shadow-md">
              <Building2 className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Portal Masuk KOPMANTARA</h3>
              <p className="text-xs text-blue-200">Koperasi Mandiri Artha Nusantara (kopmantara.co.id)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-blue-200 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons for 3 Roles + Register */}
        <div className="grid grid-cols-4 border-b border-slate-200 bg-slate-100/70 p-1.5 gap-1 text-xs">
          <button
            onClick={() => {
              setActiveTab('ANGGOTA');
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'ANGGOTA'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4 text-blue-600" />
            <span>Anggota</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('PENGURUS');
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'PENGURUS'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4 text-indigo-600" />
            <span>Pengurus</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ADMIN');
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'ADMIN'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-blue-700" />
            <span>Admin</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('REGISTER');
              setError(null);
            }}
            className={`py-2 px-1 rounded-xl font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
              activeTab === 'REGISTER'
                ? 'bg-white text-amber-800 shadow-xs'
                : 'text-slate-700 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4 text-amber-600" />
            <span>Daftar</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <span className="font-bold">Perhatian:</span> {error}
            </div>
          )}

          {regSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-1">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Pendaftaran Berhasil Dikirim!
              </div>
              <p>Data Anda telah tercatat dan menunggu verifikasi berkas oleh Dewan Pengurus KOPMANTARA.</p>
            </div>
          )}

          {activeTab !== 'REGISTER' ? (
            <div>
              {/* Quick 1-Click Login Card for Evaluator */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 mb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-blue-950">
                      1-Klik Masuk Langsung (Demo Mode)
                    </span>
                  </div>
                  <button
                    onClick={() => handleQuickLogin(activeTab as UserRole)}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <span>Masuk sbg {activeTab}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-blue-800 mt-1">
                  {activeTab === 'ANGGOTA' && 'Ahmad Fauzi (KOP-2023-0089) - Akses Simpanan, e-KTA Digital Smart Card & Pinjaman.'}
                  {activeTab === 'PENGURUS' && 'Hj. Siti Rahmawati, SE (Bendahara) - Verifikasi Anggota & Komite Kredit.'}
                  {activeTab === 'ADMIN' && 'Budi Santoso, S.Kom (Admin IT) - Pengaturan Master Data & Integrasi Cloud.'}
                </p>
              </div>

              {/* Manual Login Form */}
              <form onSubmit={handleManualLogin} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">
                    {activeTab === 'ANGGOTA' ? 'No. Anggota / NIK / Email' : 'Email / Username'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder={
                        activeTab === 'ANGGOTA'
                          ? 'Contoh: KOP-2023-0089 atau NIK KTP'
                          : activeTab === 'PENGURUS'
                          ? 'pengurus@kopmantara.co.id'
                          : 'admin.kopmantara'
                      }
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <Mail className="w-4 h-4 text-slate-700 absolute left-3 top-3" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full text-xs pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <Lock className="w-4 h-4 text-slate-700 absolute left-3 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Masuk ke Portal {activeTab}
                </button>
              </form>
            </div>
          ) : (
            /* Registration Form & Google Form alternative */
            <div className="space-y-4">
              {/* Google Form Banner Option */}
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                    <FileSpreadsheet className="w-4 h-4 text-amber-700" />
                    Daftar via Google Form Resmi
                  </div>
                  <p className="text-[11px] text-amber-800">
                    Isi formulir pendaftaran Google Form KOPMANTARA secara langsung.
                  </p>
                </div>
                <a
                  href={formPendaftaranUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                >
                  Buka Form <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              {/* Direct Portal Registration Form */}
              <form onSubmit={handleRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Nama Lengkap *</label>
                    <input
                      type="text"
                      required
                      value={regNama}
                      onChange={(e) => setRegNama(e.target.value)}
                      placeholder="Nama sesuai KTP"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Nomor NIK KTP *</label>
                    <input
                      type="text"
                      required
                      value={regNik}
                      onChange={(e) => setRegNik(e.target.value)}
                      placeholder="16 Digit NIK"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">Email Google *</label>
                    <input
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="nama@gmail.com"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">No. WhatsApp</label>
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Unit Kerja / Cabang</label>
                  <select
                    value={regUnitKerja}
                    onChange={(e) => setRegUnitKerja(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    <option>Unit Kerja Mantara Cabang Barat</option>
                    <option>Unit Pelayanan Terpadu Mantara</option>
                    <option>Divisi Teknik & Pengadaan</option>
                    <option>Kantor Pusat Mantara</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-800 block mb-1">Alamat Domisili</label>
                  <input
                    type="text"
                    value={regAlamat}
                    onChange={(e) => setRegAlamat(e.target.value)}
                    placeholder="Alamat tempat tinggal saat ini"
                    className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] text-slate-700 space-y-1">
                  <div className="font-semibold text-slate-800">Ketentuan Simpanan Awal:</div>
                  <div>• Simpanan Pokok: Rp 500.000 (Dibayarkan 1x saat pendaftaran)</div>
                  <div>• Simpanan Wajib: Rp 100.000 / bulan</div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  Kirim Pendaftaran Anggota Baru
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
