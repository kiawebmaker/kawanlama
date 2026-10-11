(() => {
  const storageKey = "kawan-lama-group-content";
  const defaults = {
    heroTitle: "Lebih dari Bisnis Keluarga, Kami Adalah Bisnis untuk Keluarga",
    heroSubtitle: "Tumbuh Lebih Kuat Bersama Kawan Lama Group",
    heroImage: "images/homepage-header.jpg.jpeg",
    aboutTitle: "Hadir untuk Anda dan Keluarga",
    aboutBody: "Kawan Lama Group adalah identitas dari kelompok unit bisnis multisektor yang bergerak dalam enam pilar bisnis. Kami dipersatukan oleh nilai dan tujuan yang sama: memberikan kehidupan yang lebih baik bagi keluarga.",
    aboutImage: "images/keluarga-new.jpg-(1).jpeg",
    impactTitle: "Kontribusi Nyata Kami untuk Masyarakat",
    impactBody: "Kawan Lama Group aktif melaksanakan program keberlanjutan dan memberikan nilai tambah bagi masyarakat melalui kepedulian pada pilar Sosial, Pendidikan, Lingkungan, Kesehatan, serta Seni & Budaya.",
    impactImage: "images/Sustainability-Pic.jpg",
    careerTitle: "Bertumbuh dan Raih Pencapaian Tertinggi Bersama Kawan Lama Group",
    careerBody: "Berawal dari toko perkakas berukuran 3 × 3 meter, kami terus berkembang dengan budaya I AM ELITE. Mari turut memperkuat laju pertumbuhan Kawan Lama Group di masa depan.",
    careerImage: "images/foto-3.jpg",
    news: [
      {
        title: "Empat Unit Bisnis Kawan Lama Group Raih Top Retailer Awards 2026",
        category: "Artikel",
        date: "24 September 2026",
        image: "images/920-4-top-retailer-award-hubexo-resize.jpg.jpeg",
        alt: "Penerima penghargaan Top Retailer Awards"
      },
      {
        title: "Kawan Lama Group Masuk ke Jajaran Sepuluh Besar Developer di Indonesia",
        category: "Artikel",
        date: "18 September 2026",
        image: "images/HUbexo-Resize920.jpg.jpeg",
        alt: "Kawasan pengembangan properti"
      },
      {
        title: "F&B ID dan Chef Willgoz Hadirkan Kreasi Menu Baru Go! Go! CURRY!",
        category: "Artikel",
        date: "18 September 2026",
        image: "images/GGC-WILLGOZ-RESIZE920.jpg",
        alt: "Chef Willgoz menghadirkan kreasi menu Go! Go! CURRY!"
      }
    ]
  };

  function read() {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return JSON.parse(JSON.stringify(defaults));
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.news)) {
      throw new Error("Data CMS tidak valid. Pulihkan konten awal melalui halaman admin.");
    }
    return { ...defaults, ...parsed };
  }

  function write(content) {
    localStorage.setItem(storageKey, JSON.stringify(content));
  }

  function restore() {
    localStorage.removeItem(storageKey);
  }

  window.KawanLamaContent = { defaults, read, write, restore };
})();
