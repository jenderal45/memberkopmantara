import React, { useState } from 'react';
import {
  Member,
  UserAccount,
  UserRole,
  AuditLog,
  GFormIntegrationConfig,
  GDriveIntegrationConfig,
  GCloudIntegrationConfig
} from '../../types';
import {
  Users,
  ShieldCheck,
  FileSpreadsheet,
  HardDrive,
  Cloud,
  Search,
  Filter,
  Plus,
  Edit2,
  Trash2,
  Download,
  Upload,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Key,
  Database,
  ExternalLink,
  Sliders,
  Play,
  Award
} from 'lucide-react';
import { formatRupiah, formatDateIndo, exportToCSV } from '../../utils/formatters';

interface AdminPortalProps {
  members: Member[];
  users: UserAccount[];
  auditLogs: AuditLog[];
  gformConfig: GFormIntegrationConfig;
  gdriveConfig: GDriveIntegrationConfig;
  gcloudConfig: GCloudIntegrationConfig;
  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (memberId: string) => void;
  onUpdateGFormConfig: (newConfig: GFormIntegrationConfig) => void;
  onUpdateGDriveConfig: (newConfig: GDriveIntegrationConfig) => void;
  onUpdateGCloudConfig: (newConfig: GCloudIntegrationConfig) => void;
  onOpenGoogleHub: (tab?: 'gform' | 'gdrive' | 'gcloud') => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  members,
  users,
  auditLogs,
  gformConfig,
  gdriveConfig,
  gcloudConfig,
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onUpdateGFormConfig,
  onUpdateGDriveConfig,
  onUpdateGCloudConfig,
  onOpenGoogleHub
}) => {
  const [activeTab, setActiveTab] = useState<'master' | 'users' | 'integrasi' | 'logs'>('master');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterUnit, setFilterUnit] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Add / Edit Member Modal State
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Member>>({
    nama: '',
    nik: '',
    email: '',
    phone: '',
    unitKerja: 'Unit Kerja Mantara Cabang Barat',
    alamat: '',
    pekerjaan: 'Staf Karyawan',
    jenisKelamin: 'Laki-laki',
    simpananPokok: 500000,
    simpananWajib: 100000,
    simpananSukarela: 0,
    status: 'AKTIF'
  });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      nama: '',
      nik: '',
      email: '',
      phone: '',
      unitKerja: 'Unit Kerja Mantara Cabang Barat',
      alamat: '',
      pekerjaan: 'Staf Karyawan',
      jenisKelamin: 'Laki-laki',
      simpananPokok: 500000,
      simpananWajib: 100000,
      simpananSukarela: 0,
      status: 'AKTIF'
    });
    setShowMemberModal(true);
  };

  const handleOpenEdit = (m: Member) => {
    setEditingMember(m);
    setFormData(m);
    setShowMemberModal(true);
  };

  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nama || !formData.nik) {
      alert('Nama dan NIK wajib diisi!');
      return;
    }

    if (editingMember) {
      const updated: Member = {
        ...editingMember,
        ...formData,
        totalSimpanan:
          Number(formData.simpananPokok || 0) +
          Number(formData.simpananWajib || 0) +
          Number(formData.simpananSukarela || 0)
      } as Member;
      onUpdateMember(updated);
      alert(`Data anggota ${updated.nama} berhasil diperbarui!`);
    } else {
      const newMem: Member = {
        id: `mem_${Date.now()}`,
        noAnggota: `KOP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        nik: formData.nik!,
        nama: formData.nama!,
        email: formData.email || 'anggota@kopmantara.co.id',
        phone: formData.phone || '0812-0000-0000',
        alamat: formData.alamat || 'Jakarta, Indonesia',
        unitKerja: formData.unitKerja || 'Unit Pelayanan Terpadu Mantara',
        jenisKelamin: (formData.jenisKelamin as any) || 'Laki-laki',
        pekerjaan: formData.pekerjaan || 'Karyawan',
        tglGabung: new Date().toISOString().split('T')[0],
        status: (formData.status as any) || 'AKTIF',
        fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80',
        ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        simpananPokok: Number(formData.simpananPokok || 500000),
        simpananWajib: Number(formData.simpananWajib || 100000),
        simpananSukarela: Number(formData.simpananSukarela || 0),
        totalSimpanan:
          Number(formData.simpananPokok || 500000) +
          Number(formData.simpananWajib || 100000) +
          Number(formData.simpananSukarela || 0),
        pinjamanAktif: 0,
        sisaPinjaman: 0,
        riwayatKolektibilitas: 'LANCAR',
        shuTahunBerjalan: 0,
        ratingKeaktifan: 5
      };
      onAddMember(newMem);
      alert(`Anggota baru ${newMem.nama} (${newMem.noAnggota}) berhasil ditambahkan ke master database!`);
    }

    setShowMemberModal(false);
  };

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchSearch =
      m.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.noAnggota.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.nik.includes(searchQuery);
    const matchUnit = filterUnit === 'ALL' || m.unitKerja === filterUnit;
    const matchStatus = filterStatus === 'ALL' || m.status === filterStatus;
    return matchSearch && matchUnit && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner with Official Kopmantara Design */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-6 shadow-xl border border-blue-800/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-950">
                Super Admin Console
              </span>
              <span className="text-xs text-blue-200">Koperasi Mandiri Artha Nusantara (kopmantara.co.id)</span>
            </div>
            <h2 className="text-2xl font-black text-white font-serif tracking-tight">
              Master Control & Integrasi KOPMANTARA
            </h2>
            <p className="text-xs text-blue-100 max-w-xl">
              Kelola basis data anggota, role pengguna, konfigurasi webhook Google Forms, Google Drive Vault, dan sinkronisasi Google Cloud.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenGoogleHub('gcloud')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-blue-200" />
              <span>GCloud Sync Console</span>
            </button>

            <button
              onClick={() => exportToCSV(`KOPMANTARA_Anggota_Export_${Date.now()}.csv`, members)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-xs border border-white/15 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Ekspor Master CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('master')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'master'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Master Data Anggota ({members.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'users'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Hak Akses & Pengguna ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('integrasi')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'integrasi'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Konfigurasi Integrasi Cloud</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 transition-all shrink-0 cursor-pointer ${
            activeTab === 'logs'
              ? 'border-blue-700 text-blue-900'
              : 'border-transparent text-slate-700 hover:text-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Audit Log & Trail ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: MASTER DATA ANGGOTA */}
      {activeTab === 'master' && (
        <div className="space-y-4">
          {/* Action & Filter Toolbar */}
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-700 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari Nama, No. Anggota, NIK..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <select
                value={filterUnit}
                onChange={(e) => setFilterUnit(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
              >
                <option value="ALL">Semua Unit Kerja</option>
                <option value="Unit Kerja Mantara Cabang Barat">Cabang Barat</option>
                <option value="Unit Pelayanan Terpadu Mantara">Pelayanan Terpadu</option>
                <option value="Divisi Teknik & Pengadaan">Teknik & Pengadaan</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
              >
                <option value="ALL">Semua Status</option>
                <option value="AKTIF">Aktif</option>
                <option value="PENDING">Pending</option>
                <option value="NONAKTIF">Nonaktif</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenGoogleHub('gform')}
                className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Import G-Form</span>
              </button>

              <button
                onClick={handleOpenAdd}
                className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Anggota Manual</span>
              </button>
            </div>
          </div>

          {/* Master Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 uppercase font-mono text-[10px]">
                  <tr>
                    <th className="px-4 py-3">No. Anggota / NIK</th>
                    <th className="px-4 py-3">Nama Anggota</th>
                    <th className="px-4 py-3">Unit Kerja</th>
                    <th className="px-4 py-3">Total Simpanan</th>
                    <th className="px-4 py-3">Pinjaman Aktif</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-mono">
                        <div className="font-bold text-slate-900">{m.noAnggota}</div>
                        <div className="text-[10px] text-slate-700">{m.nik}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={m.fotoUrl}
                            alt={m.nama}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0 bg-slate-100"
                          />
                          <div>
                            <div className="font-bold text-slate-900">{m.nama}</div>
                            <div className="text-[10px] text-slate-700">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-700">{m.unitKerja}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">
                        {formatRupiah(m.totalSimpanan)}
                      </td>
                      <td className="px-4 py-3 font-semibold text-slate-700">
                        {m.pinjamanAktif > 0 ? formatRupiah(m.pinjamanAktif) : '-'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            m.status === 'AKTIF'
                              ? 'bg-emerald-100 text-emerald-800'
                              : m.status === 'PENDING'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {m.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(m)}
                            className="p-1.5 text-slate-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Data"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Hapus data anggota ${m.nama}? Data di Google Cloud backup akan diarsipkan.`)) {
                                onDeleteMember(m.id);
                              }
                            }}
                            className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Anggota"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HAK AKSES & USERS */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-slate-900">Manajemen Akun Pengguna & Hak Akses Multi-Role</h3>
              <p className="text-slate-700">Atur kredensial Super Admin, Dewan Pengurus, dan Anggota Koperasi.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {users.map((u) => (
              <div key={u.id} className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                      u.role === 'ADMIN'
                        ? 'bg-blue-100 text-blue-900'
                        : u.role === 'PENGURUS'
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    ROLE: {u.role}
                  </span>
                  <span className="text-[11px] text-slate-700">Login Terakhir: {u.lastLogin || '-'}</span>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-900">{u.nama}</h4>
                  <p className="text-xs text-slate-700 font-mono">{u.email}</p>
                  <p className="text-xs text-slate-700">{u.unitKerja}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-700">Username: <code className="font-bold text-slate-800">{u.username}</code></span>
                  <button
                    onClick={() => alert(`Instruksi reset password untuk ${u.email} telah dikirim ke Google Mail.`)}
                    className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: KONFIGURASI INTEGRASI CLOUD */}
      {activeTab === 'integrasi' && (
        <div className="space-y-6">
          {/* GForm Config Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <h4 className="font-bold text-slate-900 text-sm">Konfigurasi Google Forms & Sheets Sync</h4>
              </div>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                ACTIVE
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">URL Google Form Pendaftaran:</label>
                <input
                  type="url"
                  value={gformConfig.formPendaftaranUrl}
                  onChange={(e) => onUpdateGFormConfig({ ...gformConfig, formPendaftaranUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">URL Google Form Aspirasi:</label>
                <input
                  type="url"
                  value={gformConfig.formAspirasiUrl}
                  onChange={(e) => onUpdateGFormConfig({ ...gformConfig, formAspirasiUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* GDrive Config Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-5 h-5 text-sky-600" />
                <h4 className="font-bold text-slate-900 text-sm">Konfigurasi Google Drive Vault</h4>
              </div>
              <span className="text-sky-700 font-bold bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                CONNECTED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">Root Folder ID Google Drive:</label>
                <input
                  type="text"
                  value={gdriveConfig.rootFolderId}
                  onChange={(e) => onUpdateGDriveConfig({ ...gdriveConfig, rootFolderId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Service Account Email:</label>
                <input
                  type="email"
                  value={gdriveConfig.serviceAccountEmail}
                  onChange={(e) => onUpdateGDriveConfig({ ...gdriveConfig, serviceAccountEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>
          </div>

          {/* GCloud Config Card */}
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <Cloud className="w-5 h-5 text-indigo-600" />
                <h4 className="font-bold text-slate-900 text-sm">Konfigurasi Google Cloud Storage & Firestore</h4>
              </div>
              <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                SYNCED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="font-bold text-slate-800 block mb-1">GCP Project ID:</label>
                <input
                  type="text"
                  value={gcloudConfig.projectId}
                  onChange={(e) => onUpdateGCloudConfig({ ...gcloudConfig, projectId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Storage Bucket URI:</label>
                <input
                  type="text"
                  value={gcloudConfig.storageBucket}
                  onChange={(e) => onUpdateGCloudConfig({ ...gcloudConfig, storageBucket: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Region:</label>
                <input
                  type="text"
                  value={gcloudConfig.region}
                  onChange={(e) => onUpdateGCloudConfig({ ...gcloudConfig, region: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs">
            <div>
              <h3 className="font-bold text-slate-900">Audit Trail Keamanan & Riwayat Aktivitas Sistem</h3>
              <p className="text-slate-700">Merekam setiap aktivitas login, perubahan saldo, ekspor data, dan sinkronisasi Google Cloud.</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs hover:bg-slate-50">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{log.action}</span>
                      <span
                        className={`px-2 py-0.2 rounded text-[10px] font-bold ${
                          log.role === 'ADMIN'
                            ? 'bg-blue-100 text-blue-900'
                            : log.role === 'PENGURUS'
                            ? 'bg-indigo-100 text-indigo-900'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {log.role}
                      </span>
                    </div>
                    <p className="text-slate-700">{log.details}</p>
                    <div className="text-[10px] text-slate-700 flex items-center gap-2">
                      <span>Pelaku: {log.actor}</span>
                      <span>•</span>
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>

                  <span className="text-[11px] text-slate-700 font-mono whitespace-nowrap self-end md:self-auto">
                    {log.timestamp}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT MEMBER */}
      {showMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {editingMember ? `Edit Data: ${editingMember.nama}` : 'Tambah Anggota Koperasi Baru'}
              </h3>
              <button onClick={() => setShowMemberModal(false)} className="text-slate-700 hover:text-slate-900 cursor-pointer">
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMember} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={formData.nama || ''}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Nomor NIK KTP *</label>
                  <input
                    type="text"
                    required
                    value={formData.nik || ''}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">No. Handphone / WhatsApp</label>
                  <input
                    type="tel"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Unit Kerja / Cabang</label>
                <select
                  value={formData.unitKerja || 'Unit Kerja Mantara Cabang Barat'}
                  onChange={(e) => setFormData({ ...formData, unitKerja: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option>Unit Kerja Mantara Cabang Barat</option>
                  <option>Unit Pelayanan Terpadu Mantara</option>
                  <option>Divisi Teknik & Pengadaan</option>
                  <option>Kantor Pusat Mantara</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Alamat Domisili</label>
                <input
                  type="text"
                  value={formData.alamat || ''}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Simpanan Pokok</label>
                  <input
                    type="number"
                    value={formData.simpananPokok ?? 500000}
                    onChange={(e) => setFormData({ ...formData, simpananPokok: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Simpanan Wajib</label>
                  <input
                    type="number"
                    value={formData.simpananWajib ?? 100000}
                    onChange={(e) => setFormData({ ...formData, simpananWajib: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Simpanan Sukarela</label>
                  <input
                    type="number"
                    value={formData.simpananSukarela ?? 0}
                    onChange={(e) => setFormData({ ...formData, simpananSukarela: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-800 block mb-1">Status Keanggotaan</label>
                <select
                  value={formData.status || 'AKTIF'}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                >
                  <option value="AKTIF">AKTIF (Berhak Layanan Pinjaman & RAT)</option>
                  <option value="PENDING">PENDING (Menunggu Verifikasi KTP)</option>
                  <option value="NONAKTIF">NONAKTIF (Mengundurkan Diri)</option>
                </select>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {editingMember ? 'Simpan Perubahan Data' : 'Simpan Data Anggota Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
