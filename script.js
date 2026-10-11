const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const searchToggle = document.querySelector(".search-toggle");
const searchPanel = document.querySelector(".search-panel");
const newsGrid = document.querySelector(".news-grid");

function renderNews(items) {
  if (!newsGrid || !Array.isArray(items)) return;
  newsGrid.replaceChildren();
  items.forEach((item) => {
    const article = document.createElement("article");
    article.className = "news-card";
    const imageLink = document.createElement("a");
    imageLink.className = "news-image";
    imageLink.href = "#berita";
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.alt;
    imageLink.append(image);

    const meta = document.createElement("p");
    meta.className = "news-meta";
    const category = document.createElement("span");
    category.textContent = item.category;
    const date = document.createElement("span");
    date.textContent = item.date;
    meta.append(category, date);

    const heading = document.createElement("h3");
    const titleLink = document.createElement("a");
    titleLink.href = "#berita";
    titleLink.textContent = item.title;
    heading.append(titleLink);

    const readMore = document.createElement("a");
    readMore.className = "read-more";
    readMore.href = "#berita";
    readMore.append(document.createTextNode("Baca selengkapnya "));
    const arrow = document.createElement("span");
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    readMore.append(arrow);
    article.append(imageLink, meta, heading, readMore);
    newsGrid.append(article);
  });
  document.querySelectorAll(".carousel-button").forEach((button) => {
    button.hidden = items.length < 2;
  });
}

try {
  const content = window.KawanLamaContent.read();
  document.querySelectorAll("[data-content]").forEach((element) => {
    const value = content[element.dataset.content];
    if (typeof value === "string") element.textContent = value;
  });
  document.querySelectorAll("[data-image]").forEach((image) => {
    const value = content[image.dataset.image];
    if (typeof value === "string") image.src = value;
  });
  renderNews(content.news);
} catch (error) {
  const alert = document.createElement("p");
  alert.setAttribute("role", "alert");
  alert.textContent = `Konten CMS tidak dapat dimuat: ${error.message}`;
  alert.style.cssText = "position:fixed;z-index:50;right:16px;bottom:16px;max-width:360px;padding:14px;background:#fff0f0;color:#7a2020;border:1px solid #d8aaaa;font:12px/1.5 Arial,sans-serif";
  document.body.append(alert);
}

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Buka menu" : "Tutup menu");
  mainNav.classList.toggle("is-open", !isOpen);
  document.body.classList.toggle("menu-open", !isOpen);
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Buka menu");
    document.body.classList.remove("menu-open");
  }
});

searchToggle.addEventListener("click", () => {
  const isOpen = searchPanel.classList.toggle("is-open");
  searchToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) searchPanel.querySelector("input").focus();
});

searchPanel.addEventListener("submit", (event) => {
  event.preventDefault();
  const query = searchPanel.querySelector("input").value.trim().toLocaleLowerCase("id");
  if (!query) {
    searchPanel.querySelector("input").focus();
    return;
  }
  const searchLabel = searchPanel.querySelector("label");
  searchLabel.textContent = "Apa yang ingin Anda cari?";
  const match = [...document.querySelectorAll("main h1, main h2, main h3")]
    .find((heading) => heading.textContent.toLocaleLowerCase("id").includes(query));
  if (match) {
    match.scrollIntoView({ behavior: "smooth", block: "center" });
    match.setAttribute("tabindex", "-1");
    match.focus({ preventScroll: true });
  } else {
    searchLabel.textContent = "Belum ada hasil. Coba kata kunci lain.";
  }
});

document.querySelector(".carousel-button.prev").addEventListener("click", () => {
  const card = newsGrid.querySelector(".news-card");
  if (card) newsGrid.scrollBy({ left: -card.getBoundingClientRect().width - 24, behavior: "smooth" });
});

document.querySelector(".carousel-button.next").addEventListener("click", () => {
  const card = newsGrid.querySelector(".news-card");
  if (card) newsGrid.scrollBy({ left: card.getBoundingClientRect().width + 24, behavior: "smooth" });
});
