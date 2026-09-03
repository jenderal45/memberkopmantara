import React from 'react';
import { Member } from '../types';
import { Building2, X, Download, Printer, ShieldCheck, CheckCircle2, QrCode } from 'lucide-react';
import { formatDateIndo } from '../utils/formatters';

interface MemberCardModalProps {
  member: Member;
  onClose: () => void;
}

export const MemberCardModal: React.FC<MemberCardModalProps> = ({ member, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900">Kartu Tanda Anggota Digital (e-KTA)</h3>
            <p className="text-xs text-slate-700">Koperasi Mandiri Artha Nusantara (KOPMANTARA - kopmantara.co.id)</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Content - Realistic Indonesian Koperasi Smartcard */}
        <div className="p-6 flex flex-col items-center">
          <div
            id="kopmantara-kta-card"
            className="relative w-full aspect-[1.586/1] rounded-2xl bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950 text-white p-6 shadow-2xl overflow-hidden border border-amber-400/40 flex flex-col justify-between"
          >
            {/* Background Guilloche / Pattern */}
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#60a5fa_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
            <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-blue-500/20 blur-2xl pointer-events-none"></div>
            <div className="absolute -left-16 -bottom-16 w-48 h-48 rounded-full bg-amber-400/15 blur-2xl pointer-events-none"></div>

            {/* Top Bar of Card */}
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 shadow-md border border-amber-300">
                  <Building2 className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <h4 className="text-sm font-black tracking-wider uppercase font-serif text-amber-300">
                    KOPMANTARA
                  </h4>
                  <p className="text-[10px] text-blue-200 font-medium leading-tight">
                    Koperasi Mandiri Artha Nusantara
                  </p>
                  <p className="text-[8px] text-blue-300/80">NIK: 3276010020038 • AHU-0004921.AH.01.26</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-400/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-300">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>{member.status === 'AKTIF' ? 'ANGGOTA RESMI' : 'MENUNGGU VERIFIKASI'}</span>
              </div>
            </div>

            {/* Middle: Photo & Details */}
            <div className="relative z-10 flex items-center gap-4 my-auto">
              <div className="relative">
                <img
                  src={member.fotoUrl}
                  alt={member.nama}
                  className="w-20 h-24 object-cover rounded-xl border-2 border-amber-400 shadow-lg bg-slate-800"
                />
                <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 text-[8px] font-black px-1.5 py-0.2 rounded shadow-xs">
                  VERIFIED
                </div>
              </div>

              <div className="space-y-1 text-left flex-1 min-w-0">
                <div className="text-[10px] uppercase tracking-wider text-blue-300 font-mono">
                  NOMOR INDUK ANGGOTA
                </div>
                <div className="text-sm font-extrabold tracking-wider text-amber-300 font-mono">
                  {member.noAnggota}
                </div>
                <div className="text-base font-bold text-white truncate">{member.nama}</div>
                <div className="text-[11px] text-blue-100 truncate">{member.unitKerja}</div>
                <div className="text-[10px] text-slate-300 font-mono">NIK: {member.nik}</div>
              </div>
            </div>

            {/* Bottom Bar: QR Code & Validation Signature */}
            <div className="relative z-10 flex items-end justify-between pt-2 border-t border-blue-400/30">
              <div>
                <div className="text-[9px] text-blue-300">Terdaftar Sejak</div>
                <div className="text-xs font-semibold text-white">{formatDateIndo(member.tglGabung)}</div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[8px] text-blue-300/80 uppercase">Ketua Dewan Pengurus</div>
                  <div className="text-[9px] font-bold text-amber-200">H. Soeprapto, M.M.</div>
                </div>
                <div className="bg-white p-1 rounded-lg shadow-md">
                  <QrCode className="w-8 h-8 text-slate-900" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Specifications */}
          <div className="w-full mt-5 grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700 block text-[11px]">Total Simpanan Terdaftar</span>
              <span className="font-bold text-slate-900 text-sm">
                Rp {member.totalSimpanan.toLocaleString('id-ID')}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-slate-700 block text-[11px]">Email Resmi Anggota</span>
              <span className="font-semibold text-blue-700 truncate block">
                {member.email}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            Cetak Kartu Fisik
          </button>
          <button
            onClick={() => {
              alert('KTA Digital KOPMANTARA berhasil diunduh dalam format PDF e-ID Card.');
            }}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-xs font-semibold text-white flex items-center gap-2 transition-colors shadow-xs"
          >
            <Download className="w-4 h-4" />
            Unduh e-Card PDF
          </button>
        </div>
      </div>
    </div>
  );
};
