export type UserRole = 'ANGGOTA' | 'PENGURUS' | 'ADMIN';

export interface UserAccount {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  memberId?: string;
  nama: string;
  avatar?: string;
  phone: string;
  unitKerja: string;
  lastLogin?: string;
}

export type MemberStatus = 'AKTIF' | 'PENDING' | 'NONAKTIF';
export type KolektibilitasType = 'LANCAR' | 'DALAM_PERHATIAN' | 'KURANG_LANCAR' | 'DIRAGUKAN' | 'MACET';

export interface Member {
  id: string;
  noAnggota: string;
  nik: string;
  nama: string;
  email: string;
  phone: string;
  alamat: string;
  tempatLahir?: string;
  tanggalLahir?: string;
  jenisKelamin: 'Laki-laki' | 'Perempuan';
  pekerjaan: string;
  unitKerja: string;
  statusPerkawinan?: 'Belum Menikah' | 'Menikah' | 'Cerai';
  tglGabung: string;
  status: MemberStatus;
  fotoUrl: string;
  ktpUrl: string;
  slipGajiUrl?: string;
  gdriveFolderUrl?: string;
  gformSubmissionId?: string;
  
  // Keuangan & Simpanan
  simpananPokok: number;
  simpananWajib: number;
  simpananSukarela: number;
  totalSimpanan: number;
  
  // Pinjaman
  pinjamanAktif: number;
  sisaPinjaman: number;
  riwayatKolektibilitas: KolektibilitasType;
  
  // SHU & Rating
  shuTahunBerjalan: number;
  ratingKeaktifan: number; // 1 - 5
  tanggalVerifikasi?: string;
  verifikator?: string;
  catatan?: string;
}

export type TransactionType = 
  | 'SIMPANAN_POKOK' 
  | 'SIMPANAN_WAJIB' 
  | 'SIMPANAN_SUKARELA' 
  | 'ANGSURAN_PINJAMAN' 
  | 'PENCAIRAN_PINJAMAN' 
  | 'SHU_DIVIDEN' 
  | 'PENARIKAN';

export type TransactionStatus = 'BERHASIL' | 'MENUNGGU_VERIFIKASI' | 'DITOLAK';

export interface Transaction {
  id: string;
  noTransaksi: string;
  memberId: string;
  memberName: string;
  noAnggota: string;
  type: TransactionType;
  amount: number;
  date: string;
  status: TransactionStatus;
  buktiBayarUrl?: string;
  gdriveFileId?: string;
  keterangan: string;
  paymentMethod: 'TRANSFER_BANK' | 'VIRTUAL_ACCOUNT' | 'TUNAI_KASIR' | 'POTONG_GAJI' | 'QRIS';
  verifiedBy?: string;
}

export type LoanStatus = 
  | 'MENUNGGU_REVIEW' 
  | 'DISETUJUI_PENGURUS' 
  | 'DITOLAK' 
  | 'BERJALAN' 
  | 'LUNAS';

export interface LoanApplication {
  id: string;
  noPengajuan: string;
  memberId: string;
  memberName: string;
  noAnggota: string;
  nominal: number;
  tenorBulan: number;
  bungaPersen: number; // Misal 1.0% per bulan
  angsuranPerBulan: number;
  tujuan: string;
  penghasilanBulanan: number;
  status: LoanStatus;
  tanggalPengajuan: string;
  tanggalPersetujuan?: string;
  berkasDrive: {
    ktp: string;
    slipGaji: string;
    jaminan?: string;
    formulirGForm?: string;
  };
  catatanPengurus?: string;
  skorAnalisisAi?: number;
  rekomendasiAi?: string;
  analisis5C?: {
    character: string;
    capacity: string;
    capital: string;
    collateral: string;
    condition: string;
  };
}

export interface GFormIntegrationConfig {
  formPendaftaranUrl: string;
  formPengurusUrl: string;
  formAspirasiUrl: string;
  webhookEndpoint: string;
  isLiveSync: boolean;
  lastSyncTime: string;
  totalImported: number;
  responseSheetId: string;
  autoApprovePending: boolean;
}

export interface PengurusApplication {
  id: string;
  memberId: string;
  memberName: string;
  noAnggota: string;
  email: string;
  phone: string;
  unitKerja: string;
  divisiDiminati: string;
  visiMisi: string;
  prokerUtama: string;
  pengalamanOrganisasi: string;
  bersediaIkutiMekanisme: boolean;
  patuhHierarki: boolean;
  bebasKonflikKepentingan: boolean;
  tanggalPengajuan: string;
  status: 'MENUNGGU_VERIFIKASI' | 'LOLOS_BERKAS' | 'LOLOS_FIT_PROPER' | 'DITOLAK';
  gformUrl: string;
  catatanPanitia?: string;
}

export interface GDriveIntegrationConfig {
  isConnected: boolean;
  rootFolderId: string;
  rootFolderName: string;
  folderAnggota: string;
  folderBuktiTransaksi: string;
  folderLaporanRat: string;
  totalUsedGb: number;
  maxQuotaGb: number;
  serviceAccountEmail: string;
  lastBackupToDrive: string;
}

export interface GCloudIntegrationConfig {
  isConnected: boolean;
  projectId: string;
  storageBucket: string;
  firestoreDatabase: string;
  region: string;
  backupSchedule: string;
  lastSnapshotTime: string;
  syncStatus: 'SYNCED' | 'SYNCING' | 'OFFLINE';
  latencyMs: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: UserRole;
  action: string;
  ip: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export interface AspirasiItem {
  id: string;
  memberName: string;
  noAnggota: string;
  tanggal: string;
  judul: string;
  isi: string;
  kategori: 'Simpan Pinjam' | 'Pelayanan Pengurus' | 'Unit Usaha' | 'Sistem Aplikasi' | 'Lainnya';
  status: 'MENUNGGU_TANGGAPAN' | 'DIPROSES' | 'SELESAI';
  tanggapanPengurus?: string;
  gformOriginId?: string;
}

export interface RATDocument {
  id: string;
  judul: string;
  tahun: number;
  kategori: 'Laporan Pertanggungjawaban' | 'AD / ART' | 'Hasil Keputusan' | 'Laporan Keuangan Audit';
  fileType: 'PDF' | 'XLSX' | 'DOCX';
  size: string;
  downloadUrl: string;
  gdriveId: string;
  tanggalUpload: string;
  deskripsi: string;
}
