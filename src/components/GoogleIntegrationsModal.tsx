import React, { useState } from 'react';
import {
  GFormIntegrationConfig,
  GDriveIntegrationConfig,
  GCloudIntegrationConfig,
  Member
} from '../types';
import {
  INITIAL_GFORM_CONFIG,
  INITIAL_GDRIVE_CONFIG,
  INITIAL_GCLOUD_CONFIG
} from '../data/mockData';
import {
  X,
  FileSpreadsheet,
  HardDrive,
  Cloud,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  UploadCloud,
  FolderOpen,
  FileText,
  ShieldCheck,
  Database,
  ArrowDownToLine,
  Play,
  Check,
  AlertCircle,
  Copy
} from 'lucide-react';
import { exportToCSV, formatDateIndo } from '../utils/formatters';

interface GoogleIntegrationsModalProps {
  initialTab?: 'gform' | 'gdrive' | 'gcloud';
  gformConfig?: GFormIntegrationConfig;
  gdriveConfig?: GDriveIntegrationConfig;
  gcloudConfig?: GCloudIntegrationConfig;
  members?: Member[];
  onUpdateGFormConfig?: (newConfig: GFormIntegrationConfig) => void;
  onUpdateGDriveConfig?: (newConfig: GDriveIntegrationConfig) => void;
  onUpdateGCloudConfig?: (newConfig: GCloudIntegrationConfig) => void;
  onImportNewMembersFromGForm?: (newMembers: Partial<Member>[]) => void;
  onSyncGForm?: () => void;
  onSyncGDrive?: () => void;
  onSyncGCloud?: () => void;
  onClose: () => void;
}

export const GoogleIntegrationsModal: React.FC<GoogleIntegrationsModalProps> = ({
  initialTab = 'gform',
  gformConfig = INITIAL_GFORM_CONFIG,
  gdriveConfig = INITIAL_GDRIVE_CONFIG,
  gcloudConfig = INITIAL_GCLOUD_CONFIG,
  members = [],
  onUpdateGFormConfig = (_newConfig?: GFormIntegrationConfig) => {},
  onUpdateGDriveConfig = (_newConfig?: GDriveIntegrationConfig) => {},
  onUpdateGCloudConfig = (_newConfig?: GCloudIntegrationConfig) => {},
  onImportNewMembersFromGForm = (_newMembers?: Partial<Member>[]) => {},
  onSyncGForm,
  onSyncGDrive,
  onSyncGCloud,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'gform' | 'gdrive' | 'gcloud'>(initialTab);
  const [isSyncingGForm, setIsSyncingGForm] = useState(false);
  const [isBackingUpCloud, setIsBackingUpCloud] = useState(false);
  const [cloudBackupLogs, setCloudBackupLogs] = useState<string[]>([
    '[2026-08-30 01:00:00] GCloud Scheduler: Triggered nightly snapshot job.',
    '[2026-08-30 01:00:02] Cloud Storage: Encrypting 5.2 MB payload with AES-256.',
    '[2026-08-30 01:00:05] Cloud Storage: Uploaded to gs://kopmantara-secure-data-backup/daily/2026-08-30.enc.',
    '[2026-08-30 01:00:05] Firestore DB: Indexes validated and integrity check passed.'
  ]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Form State
  const [formUrl, setFormUrl] = useState(gformConfig.formPendaftaranUrl);
  const [aspirasiUrl, setAspirasiUrl] = useState(gformConfig.formAspirasiUrl);
  const [sheetId, setSheetId] = useState(gformConfig.responseSheetId);

  // Dummy uploaded drive files preview
  const [driveFiles, setDriveFiles] = useState([
    { id: '1', name: 'KTP_AhmadFauzi_327301150489.pdf', folder: '1_Berkas_KTP_Anggota', size: '1.2 MB', date: '2026-08-25' },
    { id: '2', name: 'SlipGaji_AhmadFauzi_Agustus2026.pdf', folder: '1_Berkas_KTP_Anggota', size: '890 KB', date: '2026-08-25' },
    { id: '3', name: 'BuktiTransfer_SimpananWajib_TRX0091.jpg', folder: '2_Bukti_Setoran_Transfer', size: '450 KB', date: '2026-08-25' },
    { id: '4', name: 'LPJ_Pengurus_RAT_KOPMANTARA_2025.pdf', folder: '3_Arsip_Laporan_RAT', size: '4.8 MB', date: '2026-02-15' },
    { id: '5', name: 'AD_ART_Koperasi_Mantara_Resmi.pdf', folder: '3_Arsip_Laporan_RAT', size: '2.1 MB', date: '2024-05-10' }
  ]);

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSyncGForm = () => {
    setIsSyncingGForm(true);
    setTimeout(() => {
      // Simulate receiving 1 new Google Form submission
      const dummyGFormApplicant: Partial<Member> = {
        id: `mem_gform_${Date.now()}`,
        noAnggota: `PENDING-2026-00${members.length + 1}`,
        nik: `32730${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        nama: 'Wahyu Hidayat, S.T.',
        email: 'wahyu.hidayat@gmail.com',
        phone: '0813-8899-7711',
        alamat: 'Jl. Kemang Timur No. 15A, Jakarta Selatan',
        tempatLahir: 'Semarang',
        tanggalLahir: '1993-07-12',
        jenisKelamin: 'Laki-laki',
        pekerjaan: 'Staf IT Konsultan',
        unitKerja: 'Divisi Teknik & Pengadaan',
        statusPerkawinan: 'Menikah',
        tglGabung: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
        ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        slipGajiUrl: 'https://drive.google.com/file/d/slip_gform_sync/view',
        gdriveFolderUrl: 'https://drive.google.com/drive/folders/1WahyuHidayat_Kopmantara',
        gformSubmissionId: `gform_resp_${Math.floor(100000 + Math.random() * 900000)}`,
        simpananPokok: 500000,
        simpananWajib: 0,
        simpananSukarela: 0,
        totalSimpanan: 500000,
        pinjamanAktif: 0,
        sisaPinjaman: 0,
        riwayatKolektibilitas: 'LANCAR',
        shuTahunBerjalan: 0,
        ratingKeaktifan: 3,
        catatan: 'Hasil sinkronisasi formulir pendaftaran Google Form (G-Form Sync Live).'
      };

      onImportNewMembersFromGForm([dummyGFormApplicant]);
      onUpdateGFormConfig({
        ...gformConfig,
        lastSyncTime: new Date().toLocaleString('id-ID'),
        totalImported: gformConfig.totalImported + 1
      });
      setIsSyncingGForm(false);
      alert('Berhasil mensinkronkan data dari Google Form Spreadsheet! 1 Pendaftar baru berhasil diimpor ke data antrean verifikasi.');
    }, 1500);
  };

  const handleTriggerGCloudBackup = () => {
    setIsBackingUpCloud(true);
    const now = new Date();
    const timeStr = now.toLocaleTimeString('id-ID');

    setTimeout(() => {
      const newLogs = [
        `[${now.toISOString().split('T')[0]} ${timeStr}] Google Cloud Snapshot initiated by Operator.`,
        `[${now.toISOString().split('T')[0]} ${timeStr}] Cloud Storage: Creating binary dump of members, loans, & ledgers.`,
        `[${now.toISOString().split('T')[0]} ${timeStr}] Bucket Sync: gs://kopmantara-secure-data-backup/snapshots/snapshot-${Date.now()}.json.gz (Uploaded 5.4 MB)`,
        `[${now.toISOString().split('T')[0]} ${timeStr}] Cloud Health: Sync completed in 1.42s with 0 errors. Status: OK.`,
        ...cloudBackupLogs
      ];
      setCloudBackupLogs(newLogs);
      onUpdateGCloudConfig({
        ...gcloudConfig,
        lastSnapshotTime: `${now.toISOString().split('T')[0]} ${timeStr} WIB`,
        syncStatus: 'SYNCED'
      });
      setIsBackingUpCloud(false);
    }, 1800);
  };

  const handleSimulateDriveUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const newFileObj = {
        id: String(Date.now()),
        name: file.name,
        folder: '1_Berkas_KTP_Anggota',
        size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        date: new Date().toISOString().split('T')[0]
      };
      setDriveFiles([newFileObj, ...driveFiles]);
      onUpdateGDriveConfig({
        ...gdriveConfig,
        totalUsedGb: parseFloat((gdriveConfig.totalUsedGb + 0.01).toFixed(2)),
        lastBackupToDrive: new Date().toLocaleString('id-ID')
      });
      alert(`File "${file.name}" berhasil diunggah dan disimpan ke folder Google Drive KOPMANTARA Cloud Vault.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-indigo-800 flex items-center justify-center text-white shadow-md">
              <Cloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                Pusat Integrasi Ekosistem Google
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  G-Suite Connected
                </span>
              </h3>
              <p className="text-xs text-slate-700">
                Google Forms • Google Drive Vault • Google Cloud Storage & Firestore Sync
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-100/70 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('gform')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'gform'
                ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-xs'
                : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Google Forms Integration</span>
          </button>

          <button
            onClick={() => setActiveTab('gdrive')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'gdrive'
                ? 'bg-white text-sky-700 border-slate-200 border-b-white -mb-px shadow-xs'
                : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <HardDrive className="w-4 h-4 text-sky-600" />
            <span>Google Drive Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('gcloud')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'gcloud'
                ? 'bg-white text-indigo-700 border-slate-200 border-b-white -mb-px shadow-xs'
                : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <Cloud className="w-4 h-4 text-indigo-600" />
            <span>Google Cloud Backup & Sync</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: GOOGLE FORMS */}
          {activeTab === 'gform' && (
            <div className="space-y-6">
              {/* Top Banner Status */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-emerald-950">
                      Sinkronisasi Formulir Pendaftaran & Aspirasi Online
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Terhubung dengan Google Sheet responses ID: <code className="bg-emerald-100/80 px-1 py-0.5 rounded text-[11px] font-mono">{sheetId.substring(0, 16)}...</code>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full md:w-auto">
                  <button
                    onClick={handleSyncGForm}
                    disabled={isSyncingGForm}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncingGForm ? 'animate-spin' : ''}`} />
                    <span>{isSyncingGForm ? 'Menarik Data...' : 'Tarik Data Respons Baru'}</span>
                  </button>
                </div>
              </div>

              {/* Form Links & Config Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pendaftaran Anggota Form */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Form Pendaftaran Anggota (GForm)
                    </span>
                    <a
                      href={gformConfig.formPendaftaranUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      Buka Form <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  />
                  <p className="text-[11px] text-slate-700">
                    Formulir publik tempat calon anggota mengisi NIK, Data Pribadi, dan mengunggah foto KTP.
                  </p>
                </div>

                {/* Aspirasi Anggota Form */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Form Aspirasi & Pengaduan Anggota
                    </span>
                    <a
                      href={gformConfig.formAspirasiUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      Buka Form <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <input
                    type="url"
                    value={aspirasiUrl}
                    onChange={(e) => setAspirasiUrl(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    placeholder="https://docs.google.com/forms/d/e/.../viewform"
                  />
                  <p className="text-[11px] text-slate-700">
                    Formulir saluran aspirasi, usulan program simpan pinjam, dan evaluasi pengurus.
                  </p>
                </div>
              </div>

              {/* Webhook & Google Apps Script Ingestion */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3">
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Webhook Ingestion URL (Google Apps Script trigger)
                </h5>
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={gformConfig.webhookEndpoint}
                    className="flex-1 text-xs font-mono px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                  />
                  <button
                    onClick={() => copyToClipboard(gformConfig.webhookEndpoint, 'webhook')}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs font-medium text-slate-700 flex items-center gap-1 transition-colors"
                  >
                    {copiedKey === 'webhook' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey === 'webhook' ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-700">
                  Pasang URL ini pada Google Apps Script pada formulir Anda untuk mengirim payload otomatis setiap ada respons baru tanpa perlu polling manual.
                </p>
              </div>

              {/* Field Mapping Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <h5 className="text-xs font-bold text-slate-900">Pemetaan Kolom Google Form &rarr; Database KOPMANTARA</h5>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-700 font-mono">GForm: "Nama Lengkap"</div>
                    <div className="font-semibold text-emerald-700">&rarr; member.nama</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-700 font-mono">GForm: "Nomor NIK KTP"</div>
                    <div className="font-semibold text-emerald-700">&rarr; member.nik</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-700 font-mono">GForm: "Upload Foto KTP"</div>
                    <div className="font-semibold text-emerald-700">&rarr; gdrive.ktpUrl</div>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200">
                    <div className="text-[10px] text-slate-700 font-mono">GForm: "Unit Kerja/Cabang"</div>
                    <div className="font-semibold text-emerald-700">&rarr; member.unitKerja</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: GOOGLE DRIVE */}
          {activeTab === 'gdrive' && (
            <div className="space-y-6">
              {/* Storage Capacity Gauge */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-5 h-5 text-sky-600" />
                    <h4 className="text-sm font-bold text-sky-950">
                      Google Drive Cloud Document Vault KOPMANTARA
                    </h4>
                  </div>
                  <p className="text-xs text-sky-800">
                    Kapasitas Terpakai: <span className="font-bold">{gdriveConfig.totalUsedGb} GB</span> dari {gdriveConfig.maxQuotaGb} GB ({((gdriveConfig.totalUsedGb / gdriveConfig.maxQuotaGb) * 100).toFixed(1)}%)
                  </p>
                  <div className="w-64 h-2 bg-sky-200 rounded-full overflow-hidden mt-2">
                    <div
                      className="h-full bg-sky-600 rounded-full"
                      style={{ width: `${(gdriveConfig.totalUsedGb / gdriveConfig.maxQuotaGb) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors">
                    <UploadCloud className="w-4 h-4" />
                    <span>Upload Dokumen ke G-Drive</span>
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleSimulateDriveUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Folder Structure */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <FolderOpen className="w-6 h-6 text-amber-500" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">1_Berkas_KTP_Anggota</div>
                    <div className="text-[10px] text-slate-700">148 File Dokumen</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <FolderOpen className="w-6 h-6 text-amber-500" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">2_Bukti_Setoran_Transfer</div>
                    <div className="text-[10px] text-slate-700">320 Bukti Pembayaran</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <FolderOpen className="w-6 h-6 text-amber-500" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-800 truncate">3_Arsip_Laporan_RAT</div>
                    <div className="text-[10px] text-slate-700">12 Berkas Resmi</div>
                  </div>
                </div>
              </div>

              {/* File List */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span>Daftar Berkas Terenkripsi di Google Drive</span>
                  <span className="text-[11px] text-slate-700 font-normal">Sinkronisasi Realtime</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto">
                  {driveFiles.map((file) => (
                    <div key={file.id} className="p-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <FileText className="w-4 h-4 text-sky-600 shrink-0" />
                        <div className="truncate">
                          <div className="font-semibold text-slate-800 truncate">{file.name}</div>
                          <div className="text-[10px] text-slate-700">Folder: {file.folder} • {file.size}</div>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-700 whitespace-nowrap">{file.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GOOGLE CLOUD */}
          {activeTab === 'gcloud' && (
            <div className="space-y-6">
              {/* Google Cloud Overview Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-sm font-bold text-indigo-950">
                      Google Cloud Storage & Automated Database Backup
                    </h4>
                  </div>
                  <p className="text-xs text-indigo-800">
                    Project ID: <code className="bg-indigo-100 px-1 py-0.5 rounded font-mono">{gcloudConfig.projectId}</code> • Region: {gcloudConfig.region}
                  </p>
                  <p className="text-[11px] text-indigo-700">
                    Snapshot Terakhir: <span className="font-semibold">{gcloudConfig.lastSnapshotTime}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleTriggerGCloudBackup}
                    disabled={isBackingUpCloud}
                    className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors disabled:opacity-50"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>{isBackingUpCloud ? 'Membuat Snapshot...' : 'Trigger Backup ke GCloud'}</span>
                  </button>
                </div>
              </div>

              {/* Real-time Cloud Health Indicators */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-700 text-[10px]">Cloud Bucket Status</div>
                  <div className="font-bold text-emerald-700 flex items-center gap-1 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    ONLINE (gs://bucket)
                  </div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-700 text-[10px]">Firestore / DB Replication</div>
                  <div className="font-bold text-slate-800 mt-1">Dual-Region Sync</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-700 text-[10px]">Average Latency</div>
                  <div className="font-bold text-emerald-700 mt-1">{gcloudConfig.latencyMs} ms (Jakarta)</div>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="text-slate-700 text-[10px]">Automated Snapshot</div>
                  <div className="font-bold text-indigo-700 mt-1">Pukul 01:00 WIB</div>
                </div>
              </div>

              {/* Live Terminal Log Viewer */}
              <div className="rounded-2xl bg-slate-950 text-slate-200 p-4 font-mono text-[11px] shadow-inner space-y-1.5 max-h-56 overflow-y-auto">
                <div className="text-slate-500 pb-1 border-b border-slate-800 flex items-center justify-between">
                  <span>Google Cloud Platform (GCP) Live Backup Stream</span>
                  <span className="text-emerald-400">● LIVE</span>
                </div>
                {cloudBackupLogs.map((log, index) => (
                  <div key={index} className="leading-relaxed">
                    <span className="text-emerald-400">&gt;</span> {log}
                  </div>
                ))}
              </div>

              {/* Data Export Action */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-slate-900">Ekspor Data Lengkap Koperasi</h5>
                  <p className="text-[11px] text-slate-700">Unduh data master anggota, simpanan, dan pinjaman dalam format CSV/Excel.</p>
                </div>
                <button
                  onClick={() => {
                    exportToCSV(`KOPMANTARA_Database_Master_${new Date().toISOString().split('T')[0]}.csv`, members);
                  }}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 transition-colors shadow-xs"
                >
                  <ArrowDownToLine className="w-4 h-4 text-slate-600" />
                  <span>Download Master CSV</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Semua data terenkripsi sesuai standar keamanan perbankan & perkoperasian nasional.</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
