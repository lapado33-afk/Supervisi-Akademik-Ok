
import { ObservationData } from '../types';

/**
 * Penyimpanan Terintegrasi (Cloud + Local Fallback).
 * Prioritas Web App URL diambil dari Pengaturan Aplikasi (localStorage).
 */
const getWebAppUrl = () => {
  return localStorage.getItem('app_web_app_url') || 'https://script.google.com/macros/s/AKfycbzamfntKrZKxSLDAx-97ntQxfsh2gMcwM2e9Dwhub-wfb8XxJMnd2HZezNL62HIxIvkUA/exec';
};

export const cloudStorage = {
  async fetchAll(): Promise<ObservationData[]> {
    const WEB_APP_URL = getWebAppUrl();
    // 1. Coba ambil dari Cloud Spreadsheet jika URL tersedia
    if (WEB_APP_URL) {
      try {
        const response = await fetch(`${WEB_APP_URL}?action=getObservations`);
        if (response.ok) {
          const data = await response.json();
          // Sync ke Local Storage sebagai backup/cache
          localStorage.setItem('supervision_data', JSON.stringify(data));
          return Array.isArray(data) ? data : [];
        }
      } catch (err) {
        console.warn("Koneksi Cloud gagal atau URL salah, menggunakan data lokal:", err);
      }
    }

    // 2. Fallback ke Local Storage jika cloud gagal atau URL kosong
    try {
      const saved = localStorage.getItem('supervision_data');
      const data = saved ? JSON.parse(saved) : [];
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Gagal memuat data lokal:", err);
      return [];
    }
  },

  async save(data: ObservationData): Promise<void> {
    const WEB_APP_URL = getWebAppUrl();
    // 1. Simpan di Local Storage (Penyimpanan Utama Cepat)
    try {
      const saved = localStorage.getItem('supervision_data');
      const observations = saved ? JSON.parse(saved) : [];
      const updated = [
        ...observations.filter((o: any) => o.teacherId !== data.teacherId),
        data
      ];
      localStorage.setItem('supervision_data', JSON.stringify(updated));
    } catch (err) {
      console.error("Gagal menyimpan data lokal:", err);
    }

    // 2. Kirim ke Google Spreadsheet jika URL tersedia
    if (WEB_APP_URL) {
      try {
        await fetch(WEB_APP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        });
      } catch (err) {
        console.warn("Gagal sinkronisasi ke Spreadsheet:", err);
      }
    }
  },

  async clearAll(): Promise<void> {
    const WEB_APP_URL = getWebAppUrl();
    // 1. Bersihkan Local Storage
    localStorage.removeItem('supervision_data');

    // 2. Bersihkan Cloud jika didukung oleh script
    if (WEB_APP_URL) {
      try {
        console.log("Memulai pembersihan data cloud...");
        // Gunakan timeout untuk memastikan request terkirim
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        await fetch(`${WEB_APP_URL}?action=clearAll`, { 
          method: 'GET', 
          mode: 'no-cors',
          signal: controller.signal 
        });
        
        clearTimeout(timeoutId);
        console.log("Permintaan Cloud Clear terkirim.");
      } catch (err) {
        console.error("Gagal membersihkan cloud storage:", err);
        throw err;
      }
    }
  }
};
