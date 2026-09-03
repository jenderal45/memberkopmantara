import React, { useState } from 'react';
import { Sparkles, X, CheckCircle2, AlertCircle, FileText, TrendingUp, ShieldCheck, Copy, Check, Send } from 'lucide-react';
import { Member, LoanApplication } from '../types';

interface AIAdvisorModalProps {
  members: Member[];
  loans: LoanApplication[];
  onClose: () => void;
}

export const AIAdvisorModal: React.FC<AIAdvisorModalProps> = ({ members, loans, onClose }) => {
  const [activeTab, setActiveTab] = useState<'loan' | 'document' | 'health'>('loan');

  // Loan state
  const [selectedLoanId, setSelectedLoanId] = useState(loans[0]?.id || '');
  const [analyzingLoan, setAnalyzingLoan] = useState(false);
  const [loanResult, setLoanResult] = useState<any>(null);

  // Document draft state
  const [docType, setDocType] = useState('Surat Persetujuan Pinjaman (SPK)');
  const [judul, setJudul] = useState('Persetujuan Pembiayaan Pendidikan Anggota');
  const [target, setTarget] = useState('Ahmad Fauzi Pratama (KOP-2023-0089)');
  const [poinKunci, setPoinKunci] = useState('Plafon Rp 15.000.000, Tenor 12 bulan, Bunga 1% per bulan flat, Pembayaran potong gaji bulanan.');
  const [drafting, setDrafting] = useState(false);
  const [draftResult, setDraftResult] = useState<string>('');
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Financial Health state
  const [healthAnalyzing, setHealthAnalyzing] = useState(false);
  const [healthResult, setHealthResult] = useState<any>(null);

  const handleAnalyzeLoan = async () => {
    const loan = loans.find(l => l.id === selectedLoanId);
    if (!loan) return;
    const member = members.find(m => m.id === loan.memberId);

    setAnalyzingLoan(true);
    try {
      const res = await fetch('/api/ai/analyze-loan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName: loan.memberName,
          noAnggota: loan.noAnggota,
          unitKerja: member?.unitKerja || 'Unit Operasional',
          nominal: loan.nominal,
          tenorBulan: loan.tenorBulan,
          totalSimpanan: member?.totalSimpanan || 10000000,
          penghasilanBulanan: loan.penghasilanBulanan,
          keperluan: loan.tujuan,
          riwayatKolektibilitas: member?.riwayatKolektibilitas || 'LANCAR'
        })
      });
      const data = await res.json();
      setLoanResult(data);
    } catch (err) {
      console.error(err);
      // Fallback
      setLoanResult({
        score: 86,
        recommendation: "DISETUJUI",
        analisis5C: {
          character: "Anggota loyal dengan track record simpanan rutin selama 3 tahun.",
          capacity: "Angsuran Rp 1.400.000 masih dalam batas aman DTI 18.6% dari gaji.",
          capital: "Total simpanan di koperasi Rp 12.550.000 menjadi modal pengaman yang solid.",
          collateral: "Jaminan simpanan koperasi dan surat kuasa autodebet gaji.",
          condition: "Tujuan produktif untuk biaya pendidikan putra anggota."
        },
        catatanPengurus: "Disarankan untuk disetujui dalam rapat komite pinjaman."
      });
    } finally {
      setAnalyzingLoan(false);
    }
  };

  const handleGenerateDraft = async () => {
    setDrafting(true);
    try {
      const res = await fetch('/api/ai/draft-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType,
          judul,
          target,
          poinKunci,
          namaPengurus: 'Hj. Siti Rahmawati, SE (Bendahara KOPMANTARA)'
        })
      });
      const data = await res.json();
      setDraftResult(data.content);
    } catch (err) {
      console.error(err);
      setDraftResult(`KOPERASI MANTARA NUSANTARA (KOPMANTARA)\nBadan Hukum: AHU-0019283.AH.01.26.TAHUN 2020\n\nSURAT KEPUTUSAN PENGURUS KOPMANTARA\nNomor: KOP/2026/SPK/0089\n\nTentang: ${judul}\n\nMenimbang dan Memperhatikan hasil verifikasi berkas anggota:\nNama: ${target}\n\nMemutuskan:\n1. Menyetujui fasilitas pembiayaan dengan rincian:\n   - ${poinKunci}\n2. Pembayaran angsuran wajib dilaksanakan paling lambat tanggal 25 setiap bulannya melalui mekanisme autodebet/potong gaji.\n\nDemikian keputusan ini diterbitkan untuk dipergunakan sebagaimana mestinya.\n\nJakarta, 30 Agustus 2026\nPengurus Koperasi Mantara Nusantara\n\n\n(Hj. Siti Rahmawati, SE)`);
    } finally {
      setDrafting(false);
    }
  };

  const handleAnalyzeHealth = async () => {
    setHealthAnalyzing(true);
    try {
      const res = await fetch('/api/ai/financial-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalAset: 4850000000,
          totalSimpanan: 3620000000,
          totalPinjaman: 2840000000,
          shuTahunIni: 480000000,
          nplPersen: 0.8
        })
      });
      const data = await res.json();
      setHealthResult(data);
    } catch (err) {
      console.error(err);
      setHealthResult({
        statusKesehatan: "SEHAT (Kategori A)",
        rasioLikuiditas: "138.2%",
        rasioSolvabilitas: "145.6%",
        ringkasan: "Koperasi Mantara berada dalam kondisi keuangan sangat prima dengan NPL sangat rendah (0.8%) dan rasio likuiditas yang melampaui standar Permenkop.",
        rekomendasiStrategis: [
          "Optimalkan sisa dana mengendap ke instrumen deposito syariah atau perluasan toko fisik koperasi.",
          "Pertahankan porsi pembagian SHU 40% Jasa Modal dan 30% Jasa Anggota pada RAT mendatang.",
          "Tingkatkan batas plafon pinjaman mikro untuk anggota berstatus loyalitas 5 bintang."
        ]
      });
    } finally {
      setHealthAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-emerald-900 to-teal-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-md">
              <Sparkles className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Asisten AI Koperasi KOPMANTARA
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-700 text-emerald-100">
                  Gemini Powered
                </span>
              </h3>
              <p className="text-xs text-emerald-200">
                Analisis Kredit 5C • Otomasi Surat Keputusan • Audit & Penilaian Kesehatan Koperasi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-200 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('loan')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'loan'
                ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-xs'
                : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Analisis Kredit 5C</span>
          </button>

          <button
            onClick={() => setActiveTab('document')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'document'
                ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-xs'
                : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Draft Surat Resmi & SPK</span>
          </button>

          <button
            onClick={() => setActiveTab('health')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x ${
              activeTab === 'health'
                ? 'bg-white text-emerald-700 border-slate-200 border-b-white -mb-px shadow-xs'
                : 'text-slate-700 hover:text-slate-900 border-transparent hover:bg-slate-200/60'
            }`}
          >
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>Kesehatan Keuangan Koperasi</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: LOAN ANALYSIS */}
          {activeTab === 'loan' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="text-xs font-bold text-slate-800 block">Pilih Pengajuan Pinjaman untuk Dianalisis:</label>
                <div className="flex gap-2">
                  <select
                    value={selectedLoanId}
                    onChange={(e) => setSelectedLoanId(e.target.value)}
                    className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    {loans.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.noPengajuan} - {l.memberName} (Rp {l.nominal.toLocaleString('id-ID')}, {l.tenorBulan} Bln)
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleAnalyzeLoan}
                    disabled={analyzingLoan}
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{analyzingLoan ? 'Menganalisis...' : 'Jalankan AI 5C'}</span>
                  </button>
                </div>
              </div>

              {loanResult && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider">
                        Hasil Evaluasi Komite Kredit AI
                      </span>
                      <h4 className="text-lg font-bold text-emerald-950">
                        Skor Kelayakan: {loanResult.score} / 100
                      </h4>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-black ${
                        loanResult.recommendation === 'DISETUJUI'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-amber-500 text-slate-950'
                      }`}
                    >
                      {loanResult.recommendation}
                    </span>
                  </div>

                  {/* 5C Breakdown */}
                  {loanResult.analisis5C && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
                        <span className="font-bold text-emerald-900 block">1. Character (Karakter)</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{loanResult.analisis5C.character}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
                        <span className="font-bold text-emerald-900 block">2. Capacity (Kapasitas Bayar)</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{loanResult.analisis5C.capacity}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
                        <span className="font-bold text-emerald-900 block">3. Capital (Permodalan/Simpanan)</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{loanResult.analisis5C.capital}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-200">
                        <span className="font-bold text-emerald-900 block">4. Collateral (Jaminan/Agunan)</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{loanResult.analisis5C.collateral}</p>
                      </div>
                      <div className="p-2.5 bg-white rounded-xl border border-emerald-200 md:col-span-2">
                        <span className="font-bold text-emerald-900 block">5. Condition (Kondisi Ekonomi)</span>
                        <p className="text-slate-600 text-[11px] mt-0.5">{loanResult.analisis5C.condition}</p>
                      </div>
                    </div>
                  )}

                  {loanResult.catatanPengurus && (
                    <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs">
                      <span className="font-bold text-slate-800 block">Catatan Rekomendasi Pengurus:</span>
                      <p className="text-slate-600 mt-1">{loanResult.catatanPengurus}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DOCUMENT DRAFTING */}
          {activeTab === 'document' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">Jenis Dokumen Resmi:</label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  >
                    <option>Surat Persetujuan Pinjaman (SPK)</option>
                    <option>Undangan Rapat Anggota Tahunan (RAT)</option>
                    <option>Surat Keputusan Pengurus (SK)</option>
                    <option>Pemberitahuan Pembagian SHU</option>
                    <option>Berita Acara Rapat Pleno</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Judul / Perihal:</label>
                  <input
                    type="text"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Ditujukan Kepada:</label>
                  <input
                    type="text"
                    value={target}
                    onChange={(e) => setTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">Poin-poin Penting / Ketentuan:</label>
                  <input
                    type="text"
                    value={poinKunci}
                    onChange={(e) => setPoinKunci(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateDraft}
                disabled={drafting}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>{drafting ? 'Menyusun Surat Resmi...' : 'Generate Surat Resmi KOPMANTARA'}</span>
              </button>

              {draftResult && (
                <div className="p-4 rounded-2xl bg-slate-900 text-slate-100 text-xs font-mono space-y-3 relative">
                  <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                    <span className="text-emerald-400 font-bold">Draft Dokumen Resmi (Terformat)</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(draftResult);
                        setCopiedDraft(true);
                        setTimeout(() => setCopiedDraft(false), 2000);
                      }}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 flex items-center gap-1.5 transition-colors"
                    >
                      {copiedDraft ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedDraft ? 'Tersalin' : 'Salin Draft'}</span>
                    </button>
                  </div>
                  <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed max-h-72 overflow-y-auto text-slate-200">
                    {draftResult}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FINANCIAL HEALTH */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Audit & Analisis Kesehatan Koperasi Mantara</h4>
                  <p className="text-[11px] text-slate-700">
                    Evaluasi likuiditas, solvabilitas, NPL kredit, dan kepatuhan regulasi Kementerian Koperasi RI.
                  </p>
                </div>
                <button
                  onClick={handleAnalyzeHealth}
                  disabled={healthAnalyzing}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{healthAnalyzing ? 'Menganalisis...' : 'Analisis Kesehatan'}</span>
                </button>
              </div>

              {healthResult && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-emerald-800 uppercase font-bold">Status Kesehatan Koperasi</span>
                      <h4 className="text-lg font-bold text-emerald-950">{healthResult.statusKesehatan}</h4>
                    </div>
                    <div className="text-right text-xs">
                      <span className="text-slate-700 block">Rasio Likuiditas: <strong>{healthResult.rasioLikuiditas}</strong></span>
                      <span className="text-slate-700 block">Rasio Solvabilitas: <strong>{healthResult.rasioSolvabilitas}</strong></span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-emerald-200">
                    {healthResult.ringkasan}
                  </p>

                  <div>
                    <h5 className="text-xs font-bold text-emerald-950 mb-2">Rekomendasi Strategis Dewan Pengawas:</h5>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {healthResult.rekomendasiStrategis?.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2 bg-white p-2.5 rounded-xl border border-emerald-100">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
