export interface FeatureItem {
  imgSrc: string;
  altText: string;
  title: string;
  desc: string;
}

export const featuresData: FeatureItem[] = [
  {
    imgSrc: "/mudah.png",
    altText: "Ilustrasi Mudah & Kolaboratif",
    title: "Mudah & Kolaboratif",
    desc: "Tambahkan teman, buat grup, dan bagi tagihan dalam hitungan detik."
  },
  {
    imgSrc: "/hitung otomatis.png",
    altText: "Ilustrasi Hitungan Otomatis",
    title: "Hitungan Otomatis",
    desc: "Lupakan kalkulator, semua pembagian dihitung otomatis dengan adil."
  },
  {
    imgSrc: "/kemudahan akses.png",
    altText: "Ilustrasi Mobile Friendly",
    title: "Mobile Friendly",
    desc: "Nikmati pengalaman terbaik di desktop maupun smartphone."
  },
  {
    imgSrc: "/transparansi.png",
    altText: "Ilustrasi Transparan",
    title: "Transparan",
    desc: "Setiap anggota bisa melihat pembagian dengan jelas dan akurat."
  }
];