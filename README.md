# Supervisi Akademik Digital - SMPN Luwu Utara

Platform digital untuk memfasilitasi siklus supervisi akademik (Pra, Observasi, Pasca) berbasis Kurikulum Merdeka dengan bantuan AI untuk umpan balik konstruktif.

## Fitur Utama
- **Pra-Observasi**: Perencanaan dan kesepakatan fokus observasi.
- **Observasi Kelas**: Checklist real-time saat kegiatan belajar mengajar.
- **Pasca-Observasi**: Coaching dengan alur TIRTA untuk refleksi dan pengembangan.
- **Analisis AI**: Menggunakan Google Gemini AI untuk memberikan saran pedagogis yang objektif.
- **Cetak Laporan**: Generate laporan resmi dalam format cetak/PDF.

## Cara Instalasi Lokal
1. Clone repositori ini:
   ```bash
   git clone <url-repo-anda>
   cd supervisi-akademik-digital
   ```
2. Instal dependensi:
   ```bash
   npm install
   ```
3. Buat file `.env` dan tambahkan API Key Gemini Anda:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```
4. Jalankan aplikasi dalam mode pengembangan:
   ```bash
   npm run dev
   ```

## Deploy ke Vercel (Opsional)
1. Unggah kode ke GitHub.
2. Hubungkan ke Vercel.
3. Tambahkan Environment Variable `GEMINI_API_KEY`.
4. Pastikan konfigurasi Google Sheets di `services/sheetsService.ts` sudah mengarah ke Apps Script yang benar.
