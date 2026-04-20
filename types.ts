
export enum SupervisionStatus {
  PLANNED = 'Terjadwal',
  OBSERVED = 'Sudah Diobservasi',
  FOLLOWED_UP = 'Selesai Tindak Lanjut',
}

export interface ObservationFocus {
  id: string;
  title: string;
  description: string;
}

export interface ObservationData {
  teacherId: string;
  teacherName: string;
  teacherNip: string;
  principalNip: string;
  date: string;
  subject: string;
  conversationTime: string;
  learningGoals: string;
  developmentArea?: string; // Area Pengembangan (Pra)
  strategy?: string; // Strategi/Metode (Pra)
  supervisorNotes?: string; // Catatan Khusus Supervisor (Pra)
  additionalNotes?: string; // Catatan Tambahan (Pelaksanaan)
  focusId: string;
  indicators: {
    [key: string]: {
      checked: boolean;
      note: string;
    }
  };
  reflection: string;
  coachingFeedback: string;
  rtl: string;
  status: SupervisionStatus;
}
