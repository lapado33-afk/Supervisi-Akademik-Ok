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
      PERAN: Anda adalah "Desainer Pembelajaran Mendalam" (Deep Learning Designer).
      TUGAS: Berikan narasi umpan balik coaching alur TIRTA yang sangat bersih dan manusiawi.
      DATA OBSERVASI: "${notes}"
      FOKUS: "${focusMap[focusId] || 'Umum'}"
      
      KONTROL OUTPUT:
      1. Tuliskan dalam bentuk PARAGRAF NARASI yang mengalir saja.
      2. Gunakan Bahasa Indonesia formal yang menyentuh hati.
      3. JANGAN berikan judul, JANGAN gunakan bullet points atau penomoran.
      4. Ganti istilah "Profil Pelajar Pancasila" menjadi "8 Dimensi Profil Lulusan".
      5. Output harus 100% teks polos tanpa kode atau format markdown apa pun.
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
