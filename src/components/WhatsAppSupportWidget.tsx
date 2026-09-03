import React, { useState } from 'react';
import { MessageCircle, X, ExternalLink, Send, ShieldCheck, Sparkles, PhoneCall } from 'lucide-react';
import { OFFICIAL_WHATSAPP } from '../data/mockData';

interface WhatsAppSupportWidgetProps {
  currentUserName?: string;
  currentUserNoAnggota?: string;
}

export const WhatsAppSupportWidget: React.FC<WhatsAppSupportWidgetProps> = ({
  currentUserName,
  currentUserNoAnggota
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickQuestions = [
    {
      title: 'Pendaftaran Calon Pengurus & Proker',
      desc: 'Syarat seleksi, mekanisme pemilihan & panduan penyusunan program kerja',
      text: `Halo Kak Vania (Koperasi Mantara), saya ${currentUserName || 'Anggota'} ${currentUserNoAnggota ? `(${currentUserNoAnggota})` : ''} ingin bertanya mengenai mekanisme seleksi calon pengurus dan format program kerja (proker).`
    },
    {
      title: 'Konsultasi Pembiayaan & Pinjaman',
      desc: 'Plafon pinjaman pensiunan/karyawan, bunga 1%, dan syarat berkas',
      text: `Halo Kak Vania (Koperasi Mantara), saya ${currentUserName || 'Anggota'} ingin konsultasi mengenai simulasi pengajuan pembiayaan pinjaman.`
    },
    {
      title: 'Bantuan Pendaftaran Anggota Baru',
      desc: 'Panduan formulir online, setoran simpanan pokok & verifikasi KTA',
      text: `Halo Kak Vania (Koperasi Mantara), saya ingin panduan untuk pendaftaran anggota baru KOPMANTARA.`
    },
    {
      title: 'Cek Status Simpanan & SHU',
      desc: 'Informasi saldo simpanan sukarela dan dividen SHU tahun berjalan',
      text: `Halo Kak Vania (Koperasi Mantara), saya ${currentUserName || 'Anggota'} ingin konfirmasi mutasi simpanan dan SHU.`
    }
  ];

  const handleSendToWhatsApp = (messageText: string) => {
    const encoded = encodeURIComponent(messageText);
    window.open(`https://wa.me/${OFFICIAL_WHATSAPP.numberOnly}?text=${encoded}`, '_blank', 'noopener,noreferrer');
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customMsg.trim()) return;
    const fullText = `Halo Kak Vania (Koperasi Mantara), saya ${currentUserName || 'Pengguna'} ${currentUserNoAnggota ? `(${currentUserNoAnggota})` : ''}: ${customMsg.trim()}`;
    handleSendToWhatsApp(fullText);
    setCustomMsg('');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Expanded Support Chat Card */}
      {isOpen && (
        <div className="mb-3 w-84 sm:w-96 rounded-3xl bg-white shadow-2xl border border-blue-100 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-950 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1 rounded-full text-emerald-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80"
                  alt="Vania CS Koperasi"
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-emerald-400 shadow-md"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-slate-950 rounded-full"></span>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-sm text-white">{OFFICIAL_WHATSAPP.name}</h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-[11px] text-emerald-200">Layanan Resmi Koperasi Mantara</p>
                <div className="flex items-center gap-1 text-[10px] text-emerald-300 font-mono mt-0.5">
                  <span>{OFFICIAL_WHATSAPP.phone}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">Online</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="px-4 py-2 bg-emerald-50/80 border-b border-emerald-100 text-[11px] text-emerald-900 flex items-center justify-between">
            <span>Respon Cepat Jam Kerja (08:00 - 17:00 WIB)</span>
            <span className="font-bold text-[10px] bg-emerald-200/80 px-2 py-0.5 rounded-full">WhatsApp Resmi</span>
          </div>

          {/* Body Content */}
          <div className="p-4 space-y-3 max-h-80 overflow-y-auto text-xs">
            <div className="text-slate-700 text-[11px]">
              Silakan pilih topik bantuan atau kirimkan pesan langsung ke WhatsApp Kak Vania:
            </div>

            {/* Quick Prompts */}
            <div className="space-y-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    handleSendToWhatsApp(q.text);
                    setIsOpen(false);
                  }}
                  className="w-full text-left p-2.5 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50 hover:border-emerald-300 transition-all group cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 group-hover:text-emerald-800 text-xs">
                      {q.title}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-700 group-hover:text-emerald-600 shrink-0 ml-1" />
                  </div>
                  <p className="text-[11px] text-slate-700 group-hover:text-slate-800 mt-0.5 leading-tight">
                    {q.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Custom Message Box */}
            <form onSubmit={handleCustomSubmit} className="pt-2 border-t border-slate-100">
              <label className="block text-[11px] font-bold text-slate-800 mb-1">
                Tulis Pesan Mandiri ke Kak Vania:
              </label>
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={customMsg}
                  onChange={(e) => setCustomMsg(e.target.value)}
                  placeholder="Ketik pertanyaan Anda di sini..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!customMsg.trim()}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer"
                  title="Kirim ke WhatsApp"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-700">
            Terhubung langsung ke akun WhatsApp resmi Sekretariat KOPMANTARA (Vania: {OFFICIAL_WHATSAPP.phone})
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-xs rounded-full shadow-xl hover:shadow-2xl hover:scale-105 transition-all cursor-pointer border-2 border-white"
      >
        <div className="relative">
          <MessageCircle className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full"></span>
        </div>
        <div className="flex flex-col items-start leading-tight text-left">
          <span className="text-[10px] text-emerald-100 font-medium">Bantuan Cepat</span>
          <span className="font-extrabold">WA Koperasi (Vania)</span>
        </div>
      </button>
    </div>
  );
};
