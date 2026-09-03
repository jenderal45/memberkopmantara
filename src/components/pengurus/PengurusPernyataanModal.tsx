import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Send,
  MessageCircle,
  CheckSquare,
  Square,
  ExternalLink,
  Building2,
  FileText,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { OFFICIAL_WHATSAPP } from '../../data/mockData';
import { PengurusApplication, UserAccount } from '../../types';

interface PengurusPernyataanModalProps {
  currentUser?: UserAccount;
  onClose: () => void;
  onSubmitPernyataan: (data: Partial<PengurusApplication>) => void;
  onEnterDashboard: () => void;
}

export const PengurusPernyataanModal: React.FC<PengurusPernyataanModalProps> = ({
  currentUser,
  onClose,
  onSubmitPernyataan,
  onEnterDashboard
}) => {
  // Form state - Dikosongkan sesuai instruksi agar diisi mandiri oleh pendaftar
  const [nama, setNama] = useState('');
  const [noAnggota, setNoAnggota] = useState('');
  const [unitKerja, setUnitKerja] = useState('');
  const [phone, setPhone] = useState('');
  const [divisi, setDivisi] = useState('');
  const [proker, setProker] = useState('');

  // Checkbox Pakta Integritas (dikosongkan secara default)
  const [agreeMekanisme, setAgreeMekanisme] = useState(false);
  const [agreeHierarki, setAgreeHierarki] = useState(false);
  const [agreeIntegritas, setAgreeIntegritas] = useState(false);
  const [agreeBebasKonflik, setAgreeBebasKonflik] = useState(false);

  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const allAgreed = agreeMekanisme && agreeHierarki && agreeIntegritas && agreeBebasKonflik;

  // Generate formatted WhatsApp message text
  const generateWhatsAppMessage = () => {
    return (
      `*SURAT PERNYATAAN & PAKTA INTEGRITAS DEWAN PENGURUS KOPMANTARA*\n` +
      `KOPMANTARA - Koperasi Pengusaha Muda Nusantara (NIK: 3276010020038)\n` +
      `--------------------------------------------------\n` +
      `Kepada Yth.\n` +
      `Panitia Seleksi & Admin KOPMANTARA (Kak Vania)\n` +
      `Di Tempat\n\n` +
      `Dengan ini saya yang bertanda tangan di bawah ini:\n` +
      `• *Nama Lengkap*: ${nama.trim() || '-'}\n` +
      `• *NIK / No. Anggota*: ${noAnggota.trim() || '-'}\n` +
      `• *Unit Kerja*: ${unitKerja.trim() || '-'}\n` +
      `• *No. WhatsApp/HP*: ${phone.trim() || '-'}\n` +
      `• *Posisi/Divisi yang Dituju*: ${divisi}\n\n` +
      `*USULAN PROGRAM KERJA (PROKER) UTAMA*:\n` +
      `${proker.trim() || '-'}\n\n` +
      `*BUTIR PERNYATAAN & PAKTA INTEGRITAS RESMI*:\n` +
      `1. [✓] *Mekanisme Pemilihan*: Menyatakan bersedia dan siap mengikuti seluruh mekanisme pemilihan berkala (RAT / RALB) secara konstitusional, tertib, dan demokratis.\n` +
      `2. [✓] *Kepatuhan Hierarki*: Menyatakan patuh, loyal, dan tunduk sepenuhnya pada hierarki struktural organisasi, AD/ART KOPMANTARA, serta keputusan musyawarah pimpinan.\n` +
      `3. [✓] *Integritas & Kerahasiaan*: Berkomitmen menjaga integritas, marwah, kehormatan nama baik koperasi, dan kerahasiaan data seluruh anggota.\n` +
      `4. [✓] *Bebas Konflik Kepentingan*: Bebas dari konflik kepentingan pribadi atau golongan, serta senantiasa mengutamakan kemaslahatan seluruh anggota koperasi.\n\n` +
      `Demikian surat pernyataan ini saya sampaikan dengan sadar, sungguh-sungguh, dan penuh rasa tanggung jawab untuk diverifikasi oleh Panitia Seleksi & Pengurus KOPMANTARA.\n\n` +
      `_Tercatat pada Sistem Portal: kopmantara.co.id_`
    );
  };

  const handleSendToWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();

    if (!nama.trim()) {
      setErrorMsg('Mohon cantumkan Nama Lengkap Anda.');
      return;
    }
    if (!noAnggota.trim()) {
      setErrorMsg('Mohon cantumkan NIK KTP atau Nomor Anggota.');
      return;
    }
    if (!divisi.trim()) {
      setErrorMsg('Mohon pilih Posisi / Divisi yang dituju.');
      return;
    }
    if (!proker.trim()) {
      setErrorMsg('Mohon cantumkan ringkasan usulan Program Kerja (Proker).');
      return;
    }
    if (!allAgreed) {
      setErrorMsg('Anda wajib menyetujui seluruh butir Pakta Integritas & Kepatuhan Hierarki.');
      return;
    }

    setErrorMsg('');

    // Save to system records
    onSubmitPernyataan({
      memberName: nama,
      noAnggota: noAnggota,
      phone: phone,
      unitKerja: unitKerja,
      divisiDiminati: divisi,
      prokerUtama: proker,
      bersediaIkutiMekanisme: agreeMekanisme,
      patuhHierarki: agreeHierarki,
      bebasKonflikKepentingan: agreeBebasKonflik,
      tanggalPengajuan: new Date().toISOString().slice(0, 10),
      status: 'MENUNGGU_VERIFIKASI',
      catatanPanitia: 'Pernyataan pakta integritas resmi telah dikirimkan via WhatsApp Admin.'
    });

    const fullMessage = generateWhatsAppMessage();
    const waUrl = `https://wa.me/${OFFICIAL_WHATSAPP.numberOnly}?text=${encodeURIComponent(fullMessage)}`;

    // Open WhatsApp directly
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    setIsSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1A261E] to-[#14281D] text-white p-5 sm:p-6 relative border-b border-amber-400/20">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#C59E58]/20 border border-[#C59E58]/40 flex items-center justify-center text-[#C59E58] shadow-inner">
              <ShieldCheck className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Portal Pengurus KOPMANTARA
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
                Pernyataan &amp; Pakta Integritas Pengurus
              </h2>
              <p className="text-xs text-slate-300">
                Kepatuhan hierarki organisasi, komitmen proker, dan verifikasi langsung Admin WA
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 max-h-[78vh] overflow-y-auto space-y-6">
          {/* Notification / Explanatory Alert */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3 text-xs text-amber-950">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold block mb-0.5">Ketentuan Akses Portal Pengurus:</span>
              Sesuai ketentuan organisasi KOPMANTARA, seluruh calon pengurus maupun dewan pengurus diwajibkan menyertakan usulan program kerja serta menandatangani komitmen kepatuhan hierarki struktural. Surat pernyataan ini akan otomatis dikirimkan ke <strong>WhatsApp Resmi Admin Koperasi (Kak Vania)</strong> untuk diverifikasi.
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isSent ? (
            /* Success State */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Pernyataan Berhasil Diteruskan ke WhatsApp!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                Format surat pernyataan resmi dan usulan proker Anda telah disiapkan dan dibuka di aplikasi WhatsApp Admin Kak Vania (+62 857-8245-0816).
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const waUrl = `https://wa.me/${OFFICIAL_WHATSAPP.numberOnly}?text=${encodeURIComponent(generateWhatsAppMessage())}`;
                    window.open(waUrl, '_blank', 'noopener,noreferrer');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Ulang ke WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onEnterDashboard();
                    onClose();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#C59E58] hover:bg-[#B38C46] text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Lanjut Masuk ke Dashboard Pengurus</span>
                </button>
              </div>
            </div>
          ) : (
            /* Input Form */
            <form onSubmit={handleSendToWhatsApp} className="space-y-6">
              {/* 1. Data Identitas */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#C59E58]" />
                  <span>1. Identitas Calon / Dewan Pengurus</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap &amp; Gelar <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                      placeholder="Contoh: Ir. Hendra Gunawan"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C59E58] focus:border-transparent outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NIK KTP / No. Anggota <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={noAnggota}
                      onChange={(e) => setNoAnggota(e.target.value)}
                      required
                      placeholder="Contoh: KOP-2024-0215 / NIK KTP"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C59E58] focus:border-transparent outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Unit Kerja / Instansi
                    </label>
                    <input
                      type="text"
                      value={unitKerja}
                      onChange={(e) => setUnitKerja(e.target.value)}
                      placeholder="Contoh: Unit Kerja Mantara Cabang Barat"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C59E58] focus:border-transparent outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor WhatsApp Anda
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0812-xxxx-xxxx"
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C59E58] focus:border-transparent outline-hidden"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Posisi / Divisi yang Dituju <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={divisi}
                      onChange={(e) => setDivisi(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C59E58] focus:border-transparent outline-hidden bg-white"
                    >
                      <option value="">-- Pilih Posisi / Divisi yang Dituju --</option>
                      <option value="Ketua Umum / Dewan Pengurus">Ketua Umum / Dewan Pengurus</option>
                      <option value="Sekretaris Umum">Sekretaris Umum</option>
                      <option value="Bendahara & Keuangan">Bendahara &amp; Keuangan</option>
                      <option value="Divisi Pembiayaan, Pinjaman & Kemitraan">Divisi Pembiayaan, Pinjaman &amp; Kemitraan</option>
                      <option value="Divisi Simpanan & Kesejahteraan Anggota">Divisi Simpanan &amp; Kesejahteraan Anggota</option>
                      <option value="Divisi Unit Usaha & PPOB Digital">Divisi Unit Usaha &amp; PPOB Digital</option>
                      <option value="Divisi Teknologi Informasi & Transformasi Digital">Divisi Teknologi Informasi &amp; Transformasi Digital</option>
                      <option value="Badan Pengawas Koperasi">Badan Pengawas Koperasi</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* 2. Usulan Program Kerja */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#C59E58]" />
                  <span>2. Usulan Program Kerja (Proker) Utama</span>
                </h4>
                <p className="text-[11px] text-slate-500 mb-2">
                  Tuliskan inisiatif atau terobosan kerja yang Anda bawa untuk memajukan KOPMANTARA:
                </p>
                <textarea
                  rows={4}
                  value={proker}
                  onChange={(e) => setProker(e.target.value)}
                  required
                  placeholder="1. Peningkatan plafon dan penyaluran kredit produktif...&#10;2. Penguatan unit usaha sembako grosir...&#10;3. Optimalisasi digitalisasi aplikasi anggota..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-[#C59E58] focus:border-transparent outline-hidden font-sans leading-relaxed"
                />
              </div>

              {/* 3. Pakta Integritas & Kepatuhan Hierarki */}
              <div className="space-y-3 pt-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>3. Pakta Integritas &amp; Kepatuhan Hierarki (Wajib Dicentang)</span>
                </h4>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={agreeMekanisme}
                    onChange={(e) => setAgreeMekanisme(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>
                    <strong>Kesiapan Mekanisme Pemilihan:</strong> Menyatakan bersedia dan siap mengikuti seluruh mekanisme pemilihan berkala (RAT / RALB) secara konstitusional, tertib, dan demokratis.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={agreeHierarki}
                    onChange={(e) => setAgreeHierarki(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>
                    <strong>Kepatuhan Hierarki Struktural:</strong> Menyatakan patuh, loyal, dan tunduk sepenuhnya pada hierarki struktural organisasi, AD/ART KOPMANTARA, serta keputusan musyawarah kepemimpinan.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={agreeIntegritas}
                    onChange={(e) => setAgreeIntegritas(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>
                    <strong>Integritas &amp; Kerahasiaan Data:</strong> Berkomitmen menjaga marwah kehormatan nama baik KOPMANTARA serta menjaga kerahasiaan data seluruh anggota koperasi.
                  </span>
                </label>

                <label className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={agreeBebasKonflik}
                    onChange={(e) => setAgreeBebasKonflik(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>
                    <strong>Bebas Konflik Kepentingan:</strong> Menyatakan bebas dari konflik kepentingan pribadi maupun kelompok dan senantiasa mendahulukan kemaslahatan anggota.
                  </span>
                </label>
              </div>

              {/* WhatsApp Message Preview Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between font-bold text-slate-700">
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Tujuan WhatsApp: Kak Vania (Sekretariat KOPMANTARA)</span>
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">+62 857-8245-0816</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Setelah menekan tombol di bawah, aplikasi WhatsApp Anda akan terbuka otomatis dengan seluruh pernyataan di atas sudah terformat rapi di dalam teks pesan.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={!allAgreed}
                  className={`w-full sm:flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md ${
                    allAgreed
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Pernyataan ke WhatsApp Admin (Kak Vania) →</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onEnterDashboard();
                    onClose();
                  }}
                  className="w-full sm:w-auto py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Lewati ke Dashboard
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
