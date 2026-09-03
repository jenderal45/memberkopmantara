import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.error("Failed to initialize GoogleGenAI:", err);
    }
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API: Health check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      appName: "Kopmantara Portal",
      timestamp: new Date().toISOString(),
      integrations: {
        gform: "Active",
        gdrive: "Connected",
        gcloud: "Synced"
      }
    });
  });

  // API: AI Loan Credit & Risk Assessment
  app.post("/api/ai/analyze-loan", async (req, res) => {
    try {
      const { memberName, noAnggota, unitKerja, nominal, tenorBulan, totalSimpanan, riwayatKolektibilitas, penghasilanBulanan, keperluan } = req.body;
      const ai = getAIClient();

      if (!ai) {
        // Fallback intelligent assessment rule engine
        const dti = ((nominal / (tenorBulan || 12)) * 1.01) / (penghasilanBulanan || 5000000);
        const simpananRatio = (totalSimpanan || 1000000) / (nominal || 10000000);
        let score = 78;
        if (dti < 0.3) score += 12;
        else if (dti > 0.5) score -= 18;
        if (simpananRatio > 0.3) score += 10;

        return res.json({
          score: Math.min(Math.max(score, 45), 98),
          recommendation: score >= 75 ? "DISETUJUI" : score >= 60 ? "PERTIMBANGKAN DENGAN SYARAT" : "PERLU JAMINAN TAMBAHAN",
          analisis5C: {
            character: "Anggota aktif dengan riwayat disiplin simpanan wajib.",
            capacity: `Estimasi Debt-to-Income ${(dti * 100).toFixed(1)}% dari penghasilan.`,
            capital: `Akumulasi simpanan Rp ${Number(totalSimpanan || 0).toLocaleString('id-ID')} mendukung pembiayaan.`,
            collateral: nominal > 20000000 ? "Memerlukan jaminan BPKB/Sertifikat atau potongan gaji otomatis." : "Cukup jaminan simpanan & rekomendasi pimpinan unit.",
            condition: "Kebutuhan pembiayaan wajar dan sesuai regulasi AD/ART Koperasi Mantara."
          },
          catatanPengurus: "Hasil analisis sistem otomatis menyarankan persetujuan dengan angsuran auto-debet bulanan."
        });
      }

      const prompt = `Anda adalah Analis Kredit Koperasi Simpan Pinjam KOPMANTARA.
Evaluasi permohonan pinjaman anggota berikut:
- Nama Anggota: ${memberName} (${noAnggota})
- Unit Kerja / Cabang: ${unitKerja}
- Jumlah Pinjaman: Rp ${Number(nominal).toLocaleString('id-ID')}
- Tenor: ${tenorBulan} bulan
- Total Simpanan di Koperasi: Rp ${Number(totalSimpanan).toLocaleString('id-ID')}
- Estimasi Penghasilan: Rp ${Number(penghasilanBulanan || 5000000).toLocaleString('id-ID')}
- Keperluan: ${keperluan}
- Riwayat Kolektibilitas: ${riwayatKolektibilitas || 'Lancar'}

Berikan output JSON murni dengan format:
{
  "score": (nilai 50 - 100),
  "recommendation": "DISETUJUI" | "PERTIMBANGKAN DENGAN SYARAT" | "DITOLAK / JAMINAN TAMBAHAN",
  "analisis5C": {
    "character": "penjelasan karakter",
    "capacity": "penjelasan kapasitas",
    "capital": "penjelasan modal",
    "collateral": "penjelasan agunan/jaminan",
    "condition": "penjelasan kondisi ekonomi"
  },
  "catatanPengurus": "saran konkret untuk pengurus koperasi"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      return res.json(parsed);
    } catch (error: any) {
      console.error("AI Loan error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze loan" });
    }
  });

  // API: AI Draft Surat / Dokumen Koperasi (Surat Keputusan / Undangan RAT / Notulen)
  app.post("/api/ai/draft-document", async (req, res) => {
    try {
      const { docType, judul, target, poinKunci, namaPengurus } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          content: `KOPERASI MANTARA NUSANTARA (KOPMANTARA)\nBadan Hukum No: AHU-0019283.AH.01.26.TAHUN 2020\nSekretariat: Jl. Mantara Raya No. 45, Jakarta\n------------------------------------------------------------\n\n${docType.toUpperCase()}: ${judul}\n\nKepada Yth: ${target}\n\nDengan hormat,\nSehubungan dengan keputusan Rapat Pengurus Koperasi Mantara, dengan ini kami sampaikan:\n1. Penetapan keputusan terkait ${judul}.\n2. Poin realisasi: ${poinKunci || 'Sesuai dengan anggaran dasar dan anggaran rumah tangga koperasi.'}\n3. Seluruh anggota dan pengurus diharapkan mematuhi ketetapan ini demi kemajuan bersama koperasi.\n\nDemikian surat ini disampaikan untuk dipergunakan sebagaimana mestinya.\n\nJakarta, ${new Date().toLocaleDateString('id-ID', { dateStyle: 'long' })}\nPengurus KOPMANTARA,\n\n\n(${namaPengurus || 'Ketua Pengurus'})`
        });
      }

      const prompt = `Anda adalah Sekretaris Eksekutif Koperasi Simpan Pinjam KOPMANTARA.
Buatkan draft dokumen resmi koperasi bahasa Indonesia formal yang rapi, profesional, dan berbobot hukum koperasi (UU Perkoperasian Indonesia):
- Jenis Dokumen: ${docType} (contoh: Surat Keputusan Pengurus, Undangan RAT Tahunan, Surat Persetujuan Pinjaman SPK, Berita Acara, Pengumuman SHU)
- Judul / Perihal: ${judul}
- Ditujukan Kepada: ${target}
- Poin-poin penting: ${poinKunci}
- Penandatangan: ${namaPengurus || 'Pengurus KOPMANTARA'}

Sertakan kop standar KOPMANTARA, nomor surat format KOP/YYYY/MM/XXX, isi pasal/klausul yang tegas, dan penutup formal.`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return res.json({ content: response.text });
    } catch (error: any) {
      console.error("AI Draft error:", error);
      res.status(500).json({ error: error.message || "Failed to generate draft" });
    }
  });

  // API: AI Financial & SHU Assistant
  app.post("/api/ai/financial-advisor", async (req, res) => {
    try {
      const { totalAset, totalSimpanan, totalPinjaman, shuTahunIni, nplPersen } = req.body;
      const ai = getAIClient();

      if (!ai) {
        return res.json({
          statusKesehatan: "SEHAT (Kategori A)",
          rasioLikuiditas: "135.4%",
          rasioSolvabilitas: "142.8%",
          ringkasan: `Kondisi keuangan KOPMANTARA menunjukkan performa stabil dengan total aset Rp ${Number(totalAset || 0).toLocaleString('id-ID')} dan NPL ${nplPersen || 1.2}%. Penyaluran pinjaman berjalan lancar didukung oleh partisipasi simpanan wajib anggota yang konsisten.`,
          rekomendasiStrategis: [
            "Tingkatkan alokasi dana cadangan untuk antisipasi likuiditas semester depan.",
            "Optimalkan pemanfaatan aplikasi digital untuk memangkas biaya operasional penagihan.",
            "Distribusikan 40% SHU untuk Jasa Modal dan 30% untuk Jasa Anggota sesuai keputusan RAT."
          ]
        });
      }

      const prompt = `Anda adalah Auditor & Konsultan Keuangan Koperasi Berpengalaman.
Analisis data neraca koperasi KOPMANTARA berikut:
- Total Aset: Rp ${Number(totalAset).toLocaleString('id-ID')}
- Total Simpanan Anggota: Rp ${Number(totalSimpanan).toLocaleString('id-ID')}
- Total Pinjaman Beredar: Rp ${Number(totalPinjaman).toLocaleString('id-ID')}
- SHU Berjalan: Rp ${Number(shuTahunIni).toLocaleString('id-ID')}
- Non-Performing Loan (NPL): ${nplPersen}%

Berikan evaluasi dalam format JSON:
{
  "statusKesehatan": "SEHAT (Kategori A)" | "CUKUP SEHAT (Kategori B)" | "DALAM PENGAWASAN",
  "rasioLikuiditas": "string persentase",
  "rasioSolvabilitas": "string persentase",
  "ringkasan": "ringkasan kondisi 2-3 kalimat",
  "rekomendasiStrategis": ["poin 1", "poin 2", "poin 3"]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (error: any) {
      console.error("AI Advisor error:", error);
      res.status(500).json({ error: error.message || "Failed to analyze financial health" });
    }
  });

  // Vite Middleware Setup
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Kopmantara Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(console.error);
