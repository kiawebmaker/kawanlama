const form = document.querySelector("#content-form");
const newsList = document.querySelector("#news-list");
const newsTemplate = document.querySelector("#news-template");
const saveStatus = document.querySelector("#save-status");
const maxImageBytes = 400 * 1024;
let content;

function showStatus(message, isError = false) {
  saveStatus.textContent = message;
  saveStatus.classList.toggle("is-error", isError);
}

function setPreview(key, src) {
  const preview = document.querySelector(`[data-preview="${key}"]`);
  if (preview) preview.src = src;
}

function readImage(file) {
  if (!file.type.match(/^image\/(jpeg|png|gif|webp)$/)) {
    return Promise.reject(new Error("Gunakan gambar JPG, PNG, GIF, atau WebP."));
  }
  if (file.size > maxImageBytes) {
    return Promise.reject(new Error("Ukuran gambar maksimal 400 KB."));
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result));
    reader.addEventListener("error", () => reject(new Error("Gambar gagal dibaca. Silakan coba lagi.")));
    reader.readAsDataURL(file);
  });
}

function createNewsEditor(item = {}) {
  const editor = newsTemplate.content.firstElementChild.cloneNode(true);
  const inputs = editor.querySelectorAll("[data-news]");
  inputs.forEach((input) => {
    input.value = item[input.dataset.news] || "";
  });
  const preview = editor.querySelector(".news-preview");
  preview.src = item.image || "images/homepage-header.jpg.jpeg";
  editor.dataset.image = item.image || "";
  editor.querySelector(".remove-news").addEventListener("click", () => {
    editor.remove();
  });
  editor.querySelector("[data-news-upload]").addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    try {
      editor.dataset.image = await readImage(file);
      preview.src = editor.dataset.image;
      showStatus("Gambar berita siap disimpan.");
    } catch (error) {
      event.target.value = "";
      showStatus(error.message, true);
    }
  });
  newsList.append(editor);
}

function renderForm() {
  Object.keys(content).forEach((key) => {
    const field = form.elements.namedItem(key);
    if (field && typeof content[key] === "string") field.value = content[key];
    if (key.endsWith("Image") && typeof content[key] === "string") setPreview(key, content[key]);
  });
  newsList.replaceChildren();
  content.news.forEach((item) => createNewsEditor(item));
}

function collectNews() {
  return [...newsList.querySelectorAll(".news-editor")].map((editor) => {
    const item = { image: editor.dataset.image };
    editor.querySelectorAll("[data-news]").forEach((field) => {
      item[field.dataset.news] = field.value.trim();
    });
    return item;
  });
}

document.querySelectorAll("[data-upload]").forEach((input) => {
  input.addEventListener("change", async (event) => {
    const [file] = event.target.files;
    if (!file) return;
    try {
      const key = input.dataset.upload;
      content[key] = await readImage(file);
      setPreview(key, content[key]);
      showStatus("Gambar siap disimpan.");
    } catch (error) {
      event.target.value = "";
      showStatus(error.message, true);
    }
  });
});

document.querySelector("#add-news").addEventListener("click", () => {
  createNewsEditor();
  newsList.lastElementChild.scrollIntoView({ behavior: "smooth", block: "center" });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fields = ["heroTitle", "heroSubtitle", "aboutTitle", "aboutBody", "impactTitle", "impactBody", "careerTitle", "careerBody"];
  fields.forEach((key) => {
    content[key] = form.elements.namedItem(key).value.trim();
  });
  content.news = collectNews();
  if (content.news.some((item) => !item.image)) {
    showStatus("Pilih gambar untuk setiap berita sebelum menyimpan.", true);
    return;
  }

  const serialized = JSON.stringify(content);
  if (serialized.length > 4_500_000) {
    showStatus("Konten terlalu besar untuk penyimpanan browser. Gunakan gambar yang lebih kecil.", true);
    return;
  }
  try {
    window.KawanLamaContent.write(content);
    showStatus("Perubahan berhasil disimpan. Muat ulang halaman website untuk melihat hasilnya.");
  } catch (error) {
    showStatus(`Gagal menyimpan konten ke browser: ${error.message}`, true);
  }
});

document.querySelector("#reset-content").addEventListener("click", () => {
  if (!window.confirm("Pulihkan seluruh konten website ke versi awal? Perubahan tersimpan akan dihapus.")) return;
  try {
    window.KawanLamaContent.restore();
    content = window.KawanLamaContent.read();
    renderForm();
    showStatus("Konten awal berhasil dipulihkan. Buka ulang halaman website untuk melihat hasilnya.");
  } catch (error) {
    showStatus(`Gagal memulihkan konten: ${error.message}`, true);
  }
});

document.querySelector("#export-content").addEventListener("click", () => {
  const fields = ["heroTitle", "heroSubtitle", "aboutTitle", "aboutBody", "impactTitle", "impactBody", "careerTitle", "careerBody"];
  fields.forEach((key) => {
    content[key] = form.elements.namedItem(key).value.trim();
  });
  content.news = collectNews();
  const backup = new Blob([JSON.stringify(content, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(backup);
  const link = document.createElement("a");
  link.href = url;
  link.download = "kawan-lama-cms-backup.json";
  link.click();
  URL.revokeObjectURL(url);
  showStatus("Cadangan konten berhasil diekspor.");
});

try {
  content = window.KawanLamaContent.read();
  renderForm();
} catch (error) {
  content = JSON.parse(JSON.stringify(window.KawanLamaContent.defaults));
  renderForm();
  showStatus(`Data CMS tersimpan tidak dapat dibaca: ${error.message}`, true);
}
