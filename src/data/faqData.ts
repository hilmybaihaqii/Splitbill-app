// src/data/FaqData.ts
export interface FAQItem {
  question: string;
  answer: string;
}

export const faqData: FAQItem[] = [
  {
    question: "Apa itu SplitBill?",
    answer: "SplitBill adalah aplikasi web yang membantu Anda membagi pengeluaran dengan teman, keluarga, atau rekan kerja secara mudah, cepat, dan transparan."
  },
  {
    question: "Bagaimana cara memulainya?",
    answer: "Cukup daftar akun gratis, buat grup baru, tambahkan anggota, dan mulai masukkan pengeluaran Anda. SplitBill akan menghitung pembagiannya secara otomatis."
  },
  {
    question: "Apakah SplitBill aman untuk digunakan?",
    answer: "Ya, kami memprioritaskan keamanan data Anda. Semua data pengeluaran disimpan dengan aman dan hanya dapat diakses oleh anggota grup yang relevan."
  },
  {
    question: "Apakah ada biaya tersembunyi?",
    answer: "Tidak ada. SplitBill gratis untuk digunakan. Anda bisa menikmati semua fitur inti tanpa biaya apa pun."
  },
  {
    question: "Bisakah saya membagi pengeluaran dengan porsi yang tidak sama?",
    answer: "Tentu. SplitBill memungkinkan Anda membagi tagihan secara tidak merata, misalnya berdasarkan persentase, porsi yang berbeda per orang, atau jumlah tertentu. Ini sangat fleksibel untuk setiap situasi."
  },
];