import { GoogleGenAI } from "@google/genai";

/**
 * Fungsi untuk membersihkan teks dari simbol-simbol teknis, markdown, 
 * dan karakter sisa format JSON agar menjadi narasi yang benar-benar bersih.
 */
const cleanMarkdown = (text: string) => {
  if (!text) return "";
  return text
    // Hapus karakter kurung, tanda kutip, dan simbol teknis lainnya
    .replace(/[\{\}\[\]\"\'\\<>|_^]/g, "") 
    // Hapus simbol markdown (bintang, pagar, gelombang, backtick)
    .replace(/[*#~`]/g, "")
    // Hapus tanda hubung di awal baris yang sering jadi bullet point
    .replace(/^\s*[-+]\s+/gm, "")
    // Rapikan spasi berlebih
    .replace(/\s+/g, " ")
    .trim();
};

export const generateCoachingAdvice = async (notes: string, focusId: string) => {
  const personalKey = localStorage.getItem('app_personal_api_key');
  const systemKey = process.env.GEMINI_API_KEY;
  const apiKey = personalKey || systemKey;

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not configured.");
    return "Saran AI belum tersedia karena konfigurasi kunci API belum ditemukan. Silakan isi umpan balik secara manual atau atur di menu Pengaturan.";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const focusMap: Record<string, string> = {
      'instruksi': 'Kualitas Instruksi (Penjelasan terstruktur & pengaktifan kognitif)',
      'disiplin': 'Pengelolaan Kelas (Disiplin positif & restitusi)',
      'umpan_balik': 'Umpan Balik Konstruktif (Umpan balik spesifik, berorientasi tujuan, & fokus pada proses)',
      'perhatian_kepedulian': 'Perhatian dan Kepedulian (Dukungan emosional & kebutuhan murid)'
    };

    const prompt = `
      PERAN: Anda adalah "Senior Instructional Coach" yang ahli dalam supervisi akademik klinis.
      TUGAS: Berikan narasi umpan balik coaching menggunakan alur TIRTA (Tujuan, Identifikasi, Rencana, Aksi) berdasarkan data observasi nyata.
      
      DATA OBSERVASI: 
      "${notes}"
      
      FOKUS KOMPETENSI: 
      "${focusMap[focusId] || 'Umum'}"
      
      INSTRUKSI ANALISIS:
      1. Berikan apresiasi yang spesifik pada perilaku guru yang sudah muncul berdasarkan catatan tersebut.
      2. Berikan saran perbaikan yang konkret dan praktis untuk perilaku yang belum optimal atau butuh penguatan.
      3. Kaitkan saran Anda dengan teori pedagogi yang relevan (misal: scaffolding, zona perkembangan proksimal, motivasi intrinsik, atau regulasi diri) secara halus dalam narasi.
      4. Gunakan alur TIRTA: Mulai dengan mengakui tujuan guru, identifikasi fakta di kelas, berikan saran rencana pengembangan, dan dorong aksi nyata.
      
      KONTROL OUTPUT:
      1. Tuliskan dalam bentuk PARAGRAF NARASI yang mengalir dan inspiratif.
      2. Gunakan Bahasa Indonesia formal dan profesional namun tetap suportif.
      3. JANGAN gunakan daftar (bullet points), JANGAN berikan judul seksi, JANGAN gunakan penomoran.
      4. Ganti istilah "Profil Pelajar Pancasila" menjadi "8 Dimensi Profil Lulusan".
      5. Output harus 100% teks polos tanpa kode atau format markdown apa pun.
      6. Minimal 150 kata untuk memastikan kedalaman saran.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: prompt.trim() }] }],
      config: {
        temperature: 0.7,
        topP: 0.8,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("AI returned no text");
    }
    
    return cleanMarkdown(text);
  } catch (error: any) {
    console.error("Gemini Service Error:", error);
    return "Maaf, sistem AI sedang mengalami kendala. Silakan coba kembali beberapa saat lagi.";
  }
};
