import {
  Member,
  Transaction,
  LoanApplication,
  GFormIntegrationConfig,
  GDriveIntegrationConfig,
  GCloudIntegrationConfig,
  AuditLog,
  AspirasiItem,
  RATDocument,
  UserAccount,
  PengurusApplication
} from '../types';

export const OFFICIAL_WHATSAPP = {
  name: 'Vania (Sekretariat Koperasi)',
  phone: '+62 857-8245-0816',
  numberOnly: '6285782450816',
  welcomeText: 'Halo Kak Vania (Koperasi Mantara), saya ingin berkonsultasi mengenai layanan KOPMANTARA.'
};

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'usr_admin',
    username: 'admin.kopmantara',
    email: 'admin@kopmantara.oqline.biz.id',
    role: 'ADMIN',
    nama: 'Budi Santoso, S.Kom (Super Admin)',
    phone: '0812-9876-5432',
    unitKerja: 'Divisi IT & Sistem Koperasi Pusat',
    lastLogin: '2026-08-30 20:45'
  },
  {
    id: 'usr_pengurus',
    username: 'pengurus.keuangan',
    email: 'pengurus@kopmantara.oqline.biz.id',
    role: 'PENGURUS',
    nama: 'Hj. Siti Rahmawati, SE (Bendahara 1)',
    phone: '0813-4455-6677',
    unitKerja: 'Dewan Pengurus Harian KOPMANTARA',
    lastLogin: '2026-08-30 19:20'
  },
  {
    id: 'usr_anggota_1',
    username: 'ahmad.fauzi',
    email: 'ahmad.fauzi@gmail.com',
    role: 'ANGGOTA',
    memberId: 'mem_001',
    nama: 'Ahmad Fauzi Pratama',
    phone: '0857-1122-3344',
    unitKerja: 'Unit Kerja Mantara Cabang Barat',
    lastLogin: '2026-08-30 18:10'
  },
  {
    id: 'usr_anggota_2',
    username: 'dewi.lestari',
    email: 'dewi.lestari@gmail.com',
    role: 'ANGGOTA',
    memberId: 'mem_002',
    nama: 'Dewi Lestari, S.Pd',
    phone: '0878-9988-7766',
    unitKerja: 'Unit Pelayanan Terpadu Mantara',
    lastLogin: '2026-08-29 14:30'
  }
];

export const INITIAL_MEMBERS: Member[] = [
  {
    id: 'mem_001',
    noAnggota: 'KOP-2023-0089',
    nik: '3273011504890003',
    nama: 'Ahmad Fauzi Pratama',
    email: 'ahmad.fauzi@gmail.com',
    phone: '0857-1122-3344',
    alamat: 'Jl. Surya Kencana No. 12, Kebon Jeruk, Jakarta Barat',
    tempatLahir: 'Jakarta',
    tanggalLahir: '1989-04-15',
    jenisKelamin: 'Laki-laki',
    pekerjaan: 'Staf Operasional Logistik',
    unitKerja: 'Unit Kerja Mantara Cabang Barat',
    statusPerkawinan: 'Menikah',
    tglGabung: '2023-03-12',
    status: 'AKTIF',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    slipGajiUrl: 'https://drive.google.com/file/d/kop_slip_0089/view',
    gdriveFolderUrl: 'https://drive.google.com/drive/folders/1AhmadFauzi_Kopmantara',
    gformSubmissionId: 'gform_resp_881923',
    simpananPokok: 500000,
    simpananWajib: 3600000, // 36 bulan x 100rb
    simpananSukarela: 8450000,
    totalSimpanan: 12550000,
    pinjamanAktif: 15000000,
    sisaPinjaman: 6250000,
    riwayatKolektibilitas: 'LANCAR',
    shuTahunBerjalan: 1485000,
    ratingKeaktifan: 5,
    tanggalVerifikasi: '2023-03-15',
    verifikator: 'Hj. Siti Rahmawati, SE',
    catatan: 'Anggota teladan dan aktif bertransaksi serta menghadiri RAT.'
  },
  {
    id: 'mem_002',
    noAnggota: 'KOP-2023-0142',
    nik: '3273026808920005',
    nama: 'Dewi Lestari, S.Pd',
    email: 'dewi.lestari@gmail.com',
    phone: '0878-9988-7766',
    alamat: 'Komplek Griya Indah Blok C3 No. 8, Cilandak, Jakarta Selatan',
    tempatLahir: 'Bandung',
    tanggalLahir: '1992-08-28',
    jenisKelamin: 'Perempuan',
    pekerjaan: 'Tenaga Pendidik / Guru',
    unitKerja: 'Unit Pelayanan Terpadu Mantara',
    statusPerkawinan: 'Menikah',
    tglGabung: '2023-06-20',
    status: 'AKTIF',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    slipGajiUrl: 'https://drive.google.com/file/d/kop_slip_0142/view',
    gdriveFolderUrl: 'https://drive.google.com/drive/folders/1DewiLestari_Kopmantara',
    gformSubmissionId: 'gform_resp_882045',
    simpananPokok: 500000,
    simpananWajib: 3200000,
    simpananSukarela: 14200000,
    totalSimpanan: 17900000,
    pinjamanAktif: 0,
    sisaPinjaman: 0,
    riwayatKolektibilitas: 'LANCAR',
    shuTahunBerjalan: 2150000,
    ratingKeaktifan: 5,
    tanggalVerifikasi: '2023-06-22',
    verifikator: 'Hj. Siti Rahmawati, SE',
    catatan: 'Simpanan sukarela berkala tiap awal bulan.'
  },
  {
    id: 'mem_003',
    noAnggota: 'KOP-2024-0215',
    nik: '3273031002850001',
    nama: 'Ir. Hendra Gunawan',
    email: 'hendra.gunawan@mantara.co.id',
    phone: '0811-2233-4455',
    alamat: 'Jl. Merpati Putih Kav. 19, Tebet, Jakarta Selatan',
    tempatLahir: 'Surabaya',
    tanggalLahir: '1985-02-10',
    jenisKelamin: 'Laki-laki',
    pekerjaan: 'Kepala Bagian Pemeliharaan',
    unitKerja: 'Divisi Teknik & Pengadaan',
    statusPerkawinan: 'Menikah',
    tglGabung: '2024-01-10',
    status: 'AKTIF',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    slipGajiUrl: 'https://drive.google.com/file/d/kop_slip_0215/view',
    gdriveFolderUrl: 'https://drive.google.com/drive/folders/1HendraGunawan_Kopmantara',
    gformSubmissionId: 'gform_resp_883100',
    simpananPokok: 500000,
    simpananWajib: 2000000,
    simpananSukarela: 5000000,
    totalSimpanan: 7500000,
    pinjamanAktif: 25000000,
    sisaPinjaman: 18750000,
    riwayatKolektibilitas: 'LANCAR',
    shuTahunBerjalan: 980000,
    ratingKeaktifan: 4,
    tanggalVerifikasi: '2024-01-12',
    verifikator: 'Budi Santoso, S.Kom',
    catatan: 'Anggota baru dengan riwayat pinjaman lancar.'
  },
  {
    id: 'mem_004',
    noAnggota: 'KOP-2024-0301',
    nik: '3273045511950002',
    nama: 'Rina Kusuma Wardhani',
    email: 'rina.wardhani@gmail.com',
    phone: '0812-7788-9900',
    alamat: 'Jl. Melati Raya No. 4B, Rawamangun, Jakarta Timur',
    tempatLahir: 'Yogyakarta',
    tanggalLahir: '1995-11-15',
    jenisKelamin: 'Perempuan',
    pekerjaan: 'Staf Administrasi Keuangan',
    unitKerja: 'Unit Pelayanan Terpadu Mantara',
    statusPerkawinan: 'Belum Menikah',
    tglGabung: '2024-04-05',
    status: 'AKTIF',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    slipGajiUrl: 'https://drive.google.com/file/d/kop_slip_0301/view',
    gdriveFolderUrl: 'https://drive.google.com/drive/folders/1RinaKusuma_Kopmantara',
    gformSubmissionId: 'gform_resp_884210',
    simpananPokok: 500000,
    simpananWajib: 1600000,
    simpananSukarela: 3200000,
    totalSimpanan: 5300000,
    pinjamanAktif: 0,
    sisaPinjaman: 0,
    riwayatKolektibilitas: 'LANCAR',
    shuTahunBerjalan: 640000,
    ratingKeaktifan: 5,
    tanggalVerifikasi: '2024-04-08',
    verifikator: 'Hj. Siti Rahmawati, SE',
    catatan: 'Pendaftaran tersinkronisasi langsung dari Google Form.'
  },
  {
    id: 'mem_005',
    noAnggota: 'PENDING-2026-004',
    nik: '3273052003980004',
    nama: 'Bambang Trihatmojo',
    email: 'bambang.tri@gmail.com',
    phone: '0852-3344-5566',
    alamat: 'Jl. Danau Sunter Utara No. 88, Jakarta Utara',
    tempatLahir: 'Solo',
    tanggalLahir: '1998-03-20',
    jenisKelamin: 'Laki-laki',
    pekerjaan: 'Teknisi Jaringan',
    unitKerja: 'Unit Kerja Mantara Cabang Barat',
    statusPerkawinan: 'Belum Menikah',
    tglGabung: '2026-08-28',
    status: 'PENDING',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    ktpUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    slipGajiUrl: 'https://drive.google.com/file/d/pending_slip_004/view',
    gdriveFolderUrl: 'https://drive.google.com/drive/folders/1BambangTri_Kopmantara',
    gformSubmissionId: 'gform_resp_889912',
    simpananPokok: 500000,
    simpananWajib: 0,
    simpananSukarela: 0,
    totalSimpanan: 500000,
    pinjamanAktif: 0,
    sisaPinjaman: 0,
    riwayatKolektibilitas: 'LANCAR',
    shuTahunBerjalan: 0,
    ratingKeaktifan: 3,
    catatan: 'Menunggu review berkas KTP & Bukti Setoran Simpanan Pokok oleh Pengurus.'
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'trx_001',
    noTransaksi: 'TRX-202608-0091',
    memberId: 'mem_001',
    memberName: 'Ahmad Fauzi Pratama',
    noAnggota: 'KOP-2023-0089',
    type: 'SIMPANAN_WAJIB',
    amount: 100000,
    date: '2026-08-25 09:30',
    status: 'BERHASIL',
    buktiBayarUrl: 'https://drive.google.com/file/d/bukti_sw_0089_aug/view',
    gdriveFileId: 'gdrive_file_991823',
    keterangan: 'Setoran Simpanan Wajib Bulan Agustus 2026',
    paymentMethod: 'TRANSFER_BANK',
    verifiedBy: 'Siti Rahmawati (Bendahara)'
  },
  {
    id: 'trx_002',
    noTransaksi: 'TRX-202608-0085',
    memberId: 'mem_001',
    memberName: 'Ahmad Fauzi Pratama',
    noAnggota: 'KOP-2023-0089',
    type: 'ANGSURAN_PINJAMAN',
    amount: 1250000,
    date: '2026-08-20 14:15',
    status: 'BERHASIL',
    buktiBayarUrl: 'https://drive.google.com/file/d/bukti_angsuran_0089_aug/view',
    gdriveFileId: 'gdrive_file_991702',
    keterangan: 'Angsuran Pinjaman Pokok + Jasa ke-7/12',
    paymentMethod: 'POTONG_GAJI',
    verifiedBy: 'Siti Rahmawati (Bendahara)'
  },
  {
    id: 'trx_003',
    noTransaksi: 'TRX-202608-0078',
    memberId: 'mem_002',
    memberName: 'Dewi Lestari, S.Pd',
    noAnggota: 'KOP-2023-0142',
    type: 'SIMPANAN_SUKARELA',
    amount: 1000000,
    date: '2026-08-18 10:00',
    status: 'BERHASIL',
    buktiBayarUrl: 'https://drive.google.com/file/d/bukti_sukarela_0142_aug/view',
    gdriveFileId: 'gdrive_file_991644',
    keterangan: 'Top up Simpanan Sukarela Berjangka',
    paymentMethod: 'QRIS',
    verifiedBy: 'Siti Rahmawati (Bendahara)'
  },
  {
    id: 'trx_004',
    noTransaksi: 'TRX-202608-0062',
    memberId: 'mem_003',
    memberName: 'Ir. Hendra Gunawan',
    noAnggota: 'KOP-2024-0215',
    type: 'ANGSURAN_PINJAMAN',
    amount: 2083333,
    date: '2026-08-15 11:20',
    status: 'BERHASIL',
    buktiBayarUrl: 'https://drive.google.com/file/d/bukti_angsuran_0215_aug/view',
    gdriveFileId: 'gdrive_file_991512',
    keterangan: 'Angsuran Pinjaman Renovasi ke-3/12',
    paymentMethod: 'TRANSFER_BANK',
    verifiedBy: 'Budi Santoso (Admin)'
  },
  {
    id: 'trx_005',
    noTransaksi: 'TRX-202608-0104',
    memberId: 'mem_001',
    memberName: 'Ahmad Fauzi Pratama',
    noAnggota: 'KOP-2023-0089',
    type: 'SIMPANAN_SUKARELA',
    amount: 500000,
    date: '2026-08-30 16:40',
    status: 'MENUNGGU_VERIFIKASI',
    buktiBayarUrl: 'https://drive.google.com/file/d/bukti_sukarela_0089_new/view',
    gdriveFileId: 'gdrive_file_992011',
    keterangan: 'Setoran Tambahan Tabungan Hari Raya',
    paymentMethod: 'TRANSFER_BANK'
  }
];

export const INITIAL_LOANS: LoanApplication[] = [
  {
    id: 'loan_001',
    noPengajuan: 'PINJ-2026-0034',
    memberId: 'mem_001',
    memberName: 'Ahmad Fauzi Pratama',
    noAnggota: 'KOP-2023-0089',
    nominal: 15000000,
    tenorBulan: 12,
    bungaPersen: 1.0,
    angsuranPerBulan: 1400000,
    tujuan: 'Biaya Pendidikan Putra Masuk Perguruan Tinggi',
    penghasilanBulanan: 7500000,
    status: 'BERJALAN',
    tanggalPengajuan: '2026-01-10',
    tanggalPersetujuan: '2026-01-14',
    berkasDrive: {
      ktp: 'https://drive.google.com/file/d/ktp_0089_loan/view',
      slipGaji: 'https://drive.google.com/file/d/slip_0089_loan/view',
      jaminan: 'Surat Kuasa Potong Gaji & Saldo Simpanan',
      formulirGForm: 'https://docs.google.com/forms/d/e/1FAIpQLSe-LoanReq-Kop/viewform'
    },
    catatanPengurus: 'Disetujui. Potong gaji langsung tiap tanggal 25.',
    skorAnalisisAi: 88,
    rekomendasiAi: 'DISETUJUI',
    analisis5C: {
      character: 'Sangat baik, aktif berpartisipasi 3 tahun tanpa tunggakan.',
      capacity: 'DTI 18.6% dari total take home pay bulanan.',
      capital: 'Total simpanan mencakup 83% dari plafon pembiayaan.',
      collateral: 'Jaminan simpanan dan surat kesediaan potong gaji.',
      condition: 'Pendidikan anggota adalah prioritas pembiayaan koperasi.'
    }
  },
  {
    id: 'loan_002',
    noPengajuan: 'PINJ-2026-0052',
    memberId: 'mem_004',
    memberName: 'Rina Kusuma Wardhani',
    noAnggota: 'KOP-2024-0301',
    nominal: 8000000,
    tenorBulan: 10,
    bungaPersen: 1.0,
    angsuranPerBulan: 880000,
    tujuan: 'Pembelian Laptop Penunjang Sertifikasi Profesi',
    penghasilanBulanan: 6200000,
    status: 'MENUNGGU_REVIEW',
    tanggalPengajuan: '2026-08-29',
    berkasDrive: {
      ktp: 'https://drive.google.com/file/d/ktp_0301_loan/view',
      slipGaji: 'https://drive.google.com/file/d/slip_0301_loan/view',
      jaminan: 'BPKB Sepeda Motor Honda Vario 2021',
      formulirGForm: 'https://docs.google.com/forms/d/e/1FAIpQLSe-LoanReq-Kop/viewform'
    },
    catatanPengurus: 'Berkas lengkap, sedang menunggu konfirmasi rapat pengurus.',
    skorAnalisisAi: 84,
    rekomendasiAi: 'DISETUJUI',
    analisis5C: {
      character: 'Disiplin, staf keuangan kantor unit kerja.',
      capacity: 'Angsuran Rp 880.000 / bln (14.1% dari gaji).',
      capital: 'Memiliki simpanan total Rp 5.300.000.',
      collateral: 'BPKB Motor dan simpanan.',
      condition: 'Peralatan kerja produktif meningkatkan kapasitas kerja.'
    }
  }
];

export const INITIAL_GFORM_CONFIG: GFormIntegrationConfig = {
  formPendaftaranUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSd9KopmantaraRegistration/viewform',
  formPengurusUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1',
  formAspirasiUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc-AspirasiAnggotaKopmantara/viewform',
  webhookEndpoint: 'https://kopmantara.oqline.biz.id/api/sync/gform-webhook',
  isLiveSync: true,
  lastSyncTime: '2026-08-30 20:50:12',
  totalImported: 148,
  responseSheetId: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms',
  autoApprovePending: false
};

export const INITIAL_PENGURUS_APPLICATIONS: PengurusApplication[] = [
  {
    id: 'cpr_001',
    memberId: 'mem_001',
    memberName: 'Ahmad Fauzi Pratama',
    noAnggota: 'KOP-2023-0089',
    email: 'ahmad.fauzi@gmail.com',
    phone: '0857-1122-3344',
    unitKerja: 'Unit Kerja Mantara Cabang Barat',
    divisiDiminati: 'Bidang Simpan Pinjam & Kesejahteraan Anggota',
    visiMisi: 'Mewujudkan tata kelola pembiayaan anggota yang transparan, amanah, dan berkecepatan tinggi dengan integrasi teknologi digital.',
    prokerUtama: '1. Program penurunan NPL melalui sistem reminder otomatis dan restrukturisasi terukur.\n2. Digitalisasi permohonan kredit mikro produktif untuk UKM anggota.\n3. Peningkatan edukasi literasi keuangan dan tabungan berencana bagi anggota baru.',
    pengalamanOrganisasi: 'Koordinator Unit Logistik & Pengurus Paguyuban Karyawan 2021-2024.',
    bersediaIkutiMekanisme: true,
    patuhHierarki: true,
    bebasKonflikKepentingan: true,
    tanggalPengajuan: '2026-08-28',
    status: 'LOLOS_BERKAS',
    gformUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1',
    catatanPanitia: 'Berkas lengkap, pakta integritas dan komitmen kepatuhan hierarki telah ditandatangani digital.'
  },
  {
    id: 'cpr_002',
    memberId: 'mem_003',
    memberName: 'Ir. Hendra Gunawan',
    noAnggota: 'KOP-2024-0215',
    email: 'hendra.gunawan@mantara.co.id',
    phone: '0811-3344-5566',
    unitKerja: 'Divisi Teknik & Pengadaan',
    divisiDiminati: 'Bidang Unit Usaha & PPOB Digital',
    visiMisi: 'Ekspansi unit usaha riil Koperasi Mantara ke ranah e-commerce sembako dan pengadaan barang skala institusi.',
    prokerUtama: '1. Pembentukan unit usaha Toko Mantara Grosir berbasis marketplace aplikasi.\n2. Kemitraan distributor sembako resmi dengan margin laba kompetitif untuk mendongkrak SHU anggota hingga +25%.\n3. Integrasi supply chain pengadaan barang kantor unit kerja.',
    pengalamanOrganisasi: 'Ketua Panitia Pengadaan Material 2022-2025, Anggota Aktif Koperasi.',
    bersediaIkutiMekanisme: true,
    patuhHierarki: true,
    bebasKonflikKepentingan: true,
    tanggalPengajuan: '2026-08-29',
    status: 'MENUNGGU_VERIFIKASI',
    gformUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScvL7wSolUWwjyXavTLV-11t4tuUIjyskId8lP4Er_kXfU2bw/viewform?pli=1',
    catatanPanitia: 'Sedang dalam review panitia seleksi kepengurusan.'
  }
];

export const INITIAL_GDRIVE_CONFIG: GDriveIntegrationConfig = {
  isConnected: true,
  rootFolderId: '1kop_mantara_cloud_vault_root_2026',
  rootFolderName: 'KOPMANTARA Cloud Drive Vault',
  folderAnggota: '1_Berkas_KTP_Anggota_Kopmantara',
  folderBuktiTransaksi: '2_Bukti_Setoran_Transfer_Kopmantara',
  folderLaporanRat: '3_Arsip_Laporan_RAT_Keuangan',
  totalUsedGb: 4.82,
  maxQuotaGb: 100,
  serviceAccountEmail: 'gdrive-vault@kopmantara-core.iam.gserviceaccount.com',
  lastBackupToDrive: '2026-08-30 20:30:00'
};

export const INITIAL_GCLOUD_CONFIG: GCloudIntegrationConfig = {
  isConnected: true,
  projectId: 'kopmantara-cloud-prod-332582',
  storageBucket: 'gs://kopmantara-secure-data-backup',
  firestoreDatabase: '(default) - jakarta-region-asia-southeast2',
  region: 'asia-southeast2 (Jakarta)',
  backupSchedule: 'Setiap Hari Pukul 01:00 WIB (Automated Nightly Snapshot)',
  lastSnapshotTime: '2026-08-30 01:00:05 WIB',
  syncStatus: 'SYNCED',
  latencyMs: 38
};

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log_001',
    timestamp: '2026-08-30 20:45:10',
    actor: 'Budi Santoso, S.Kom',
    role: 'ADMIN',
    action: 'Sinkronisasi Otomatis Google Forms',
    ip: '103.144.17.22',
    details: 'Berhasil menarik 2 respon pendaftaran baru dari Google Form spreadsheet.',
    status: 'SUCCESS'
  },
  {
    id: 'log_002',
    timestamp: '2026-08-30 20:12:44',
    actor: 'Hj. Siti Rahmawati, SE',
    role: 'PENGURUS',
    action: 'Verifikasi Setoran Simpanan Wajib',
    ip: '180.252.88.91',
    details: 'Validasi transaksi TRX-202608-0091 senilai Rp 100.000 atas nama Ahmad Fauzi.',
    status: 'SUCCESS'
  },
  {
    id: 'log_003',
    timestamp: '2026-08-30 19:30:00',
    actor: 'Google Cloud Auto-Sync',
    role: 'ADMIN',
    action: 'Snapshot Database Backup ke GCloud Bucket',
    ip: '35.240.180.12',
    details: 'Pencadangan data terenkripsi 5.2 MB ke gs://kopmantara-secure-data-backup/daily/2026-08-30.enc',
    status: 'SUCCESS'
  },
  {
    id: 'log_004',
    timestamp: '2026-08-30 18:05:22',
    actor: 'Ahmad Fauzi Pratama',
    role: 'ANGGOTA',
    action: 'Login Portal Anggota',
    ip: '114.125.42.11',
    details: 'Autentikasi sukses melalui Single Sign-On / KOP-2023-0089.',
    status: 'SUCCESS'
  }
];

export const INITIAL_ASPIRASI: AspirasiItem[] = [
  {
    id: 'asp_001',
    memberName: 'Ahmad Fauzi Pratama',
    noAnggota: 'KOP-2023-0089',
    tanggal: '2026-08-20',
    judul: 'Usulan Pengadaan Toko Sembako Digital Koperasi',
    isi: 'Mohon dipertimbangkan program belanja sembako bulanan anggota dengan sistem potong saldo simpanan sukarela untuk meringankan beban harian anggota.',
    kategori: 'Unit Usaha',
    status: 'DIPROSES',
    tanggapanPengurus: 'Terima kasih atas masukannya Pak Ahmad. Usulan ini sedang dibahas dalam agenda Rapat Pengurus September 2026 bersama pengelola unit toko.',
    gformOriginId: 'gform_asp_9912'
  },
  {
    id: 'asp_002',
    memberName: 'Dewi Lestari, S.Pd',
    noAnggota: 'KOP-2023-0142',
    tanggal: '2026-08-15',
    judul: 'Integrasi Pembayaran Simpanan via Virtual Account Bank',
    isi: 'Akan sangat membantu jika setoran simpanan wajib bisa otomatis menggunakan Virtual Account BCA/Mandiri/BRI sehingga mutasi tercatat instan.',
    kategori: 'Sistem Aplikasi',
    status: 'SELESAI',
    tanggapanPengurus: 'Fitur Virtual Account dan QRIS resmi diaktifkan per Agustus 2026 dan terhubung otomatis dengan GDrive Bukti Bayar.',
    gformOriginId: 'gform_asp_9877'
  }
];

export const INITIAL_RAT_DOCS: RATDocument[] = [
  {
    id: 'rat_2025',
    judul: 'Laporan Pertanggungjawaban Pengurus & Pengawas RAT Tahun Buku 2025',
    tahun: 2025,
    kategori: 'Laporan Pertanggungjawaban',
    fileType: 'PDF',
    size: '4.8 MB',
    downloadUrl: 'https://drive.google.com/file/d/kop_rat_2025_lpj/view',
    gdriveId: 'gdrive_doc_rat_2025',
    tanggalUpload: '2026-02-15',
    deskripsi: 'Berisi laporan keuangan teraudit, rincian pembagian SHU, dan realisasi program kerja tahun 2025.'
  },
  {
    id: 'rat_adart',
    judul: 'Anggaran Dasar & Anggaran Rumah Tangga (AD/ART) Koperasi Mantara',
    tahun: 2024,
    kategori: 'AD / ART',
    fileType: 'PDF',
    size: '2.1 MB',
    downloadUrl: 'https://drive.google.com/file/d/kop_ad_art_official/view',
    gdriveId: 'gdrive_doc_adart',
    tanggalUpload: '2024-05-10',
    deskripsi: 'Landasan hukum dan pedoman operasional seluruh anggota dan pengurus KOPMANTARA.'
  },
  {
    id: 'rat_audit',
    judul: 'Hasil Audit Kantor Akuntan Publik (KAP) atas Neraca Koperasi 2025',
    tahun: 2025,
    kategori: 'Laporan Keuangan Audit',
    fileType: 'PDF',
    size: '3.4 MB',
    downloadUrl: 'https://drive.google.com/file/d/kop_audit_kap_2025/view',
    gdriveId: 'gdrive_doc_kap_2025',
    tanggalUpload: '2026-01-28',
    deskripsi: 'Opini: Wajar Tanpa Pengecualian (WTP).'
  }
];
