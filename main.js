const steps = ["welcome", "lang", "channel", "country", "sellers", "products"];
let selectedCountry = "";
let currentLang = "ar";

const translations = {
  ar: {
    welcomeTitle: "👁️ ANUBIS",
    welcomeSubtitle: "مرحباً بك في عالم أنوبيس",
    startButton: "ابدأ الآن",
    chooseLangTitle: "اختر اللغة",
    langButtons: ["العربية", "English", "Français"],
    chooseOptionTitle: "🎯 اختر خيارك",
    officialChannel: "📢 القناة الرسمية",
    buyKey: "💳 شراء مفتاح",
    chooseCountryTitle: "🌍 اختر دولتك",
    backButton: "🔙 رجوع للبداية",
    sellersTitlePrefix: "بائعين ",
    complainButton: "⚠️ شكاوى",
    ratedAlert: "لقد قمت بالتقييم بالفعل لهذا البائع ✅",
    thanksRating: "شكراً لتقييمك ⭐",
    complainedAlert: "لقد أرسلت شكوى بالفعل لهذا البائع ⚠️",
    addSellerAlert: "أدخل اسم الدولة واسم البائع",
    sellerAddedAlert: "تمت إضافة البائع بنجاح",
    wrongPassAlert: "كلمة مرور خاطئة!",
    confirmClearData: "هل تريد حذف جميع البيانات؟",
    noSellers: "لا يوجد بائعين بعد.",
    ratingsText: "تقييم",
  },
  en: {
    welcomeTitle: "👁️ ANUBIS",
    welcomeSubtitle: "Welcome to the world of Anubis",
    startButton: "Start Now",
    chooseLangTitle: "Choose Language",
    langButtons: ["Arabic", "English", "French"],
    chooseOptionTitle: "🎯 Choose your option",
    officialChannel: "📢 Official Channel",
    buyKey: "💳 Buy Key",
    chooseCountryTitle: "🌍 Choose your country",
    backButton: "🔙 Back to Start",
    sellersTitlePrefix: "Sellers in ",
    complainButton: "⚠️ Complaints",
    ratedAlert: "You have already rated this seller ✅",
    thanksRating: "Thank you for your rating ⭐",
    complainedAlert: "You have already sent a complaint for this seller ⚠️",
    addSellerAlert: "Enter country and seller name",
    sellerAddedAlert: "Seller added successfully",
    wrongPassAlert: "Wrong password!",
    confirmClearData: "Do you want to delete all data?",
    noSellers: "No sellers yet.",
    ratingsText: "rating",
  },
  fr: {
    welcomeTitle: "👁️ ANUBIS",
    welcomeSubtitle: "Bienvenue dans le monde d'Anubis",
    startButton: "Commencer",
    chooseLangTitle: "Choisissez la langue",
    langButtons: ["Arabe", "Anglais", "Français"],
    chooseOptionTitle: "🎯 Choisissez votre option",
    officialChannel: "📢 Chaîne officielle",
    buyKey: "💳 Acheter une clé",
    chooseCountryTitle: "🌍 Choisissez votre pays",
    backButton: "🔙 Retour au début",
    sellersTitlePrefix: "Vendeurs en ",
    complainButton: "⚠️ Plaintes",
    ratedAlert: "Vous avez déjà évalué ce vendeur ✅",
    thanksRating: "Merci pour votre évaluation ⭐",
    complainedAlert: "Vous avez déjà envoyé une plainte pour ce vendeur ⚠️",
    addSellerAlert: "Entrez le pays et le nom du vendeur",
    sellerAddedAlert: "Vendeur ajouté avec succès",
    wrongPassAlert: "Mot de passe incorrect!",
    confirmClearData: "Voulez-vous supprimer toutes les données?",
    noSellers: "Pas encore de vendeurs.",
    ratingsText: "évaluation",
  }
};

function updateTexts() {
  const t = translations[currentLang];
  const welcomeSection = document.getElementById("welcome");
  if (welcomeSection) {
    welcomeSection.querySelector(".logo").textContent = t.welcomeTitle;
    welcomeSection.querySelector(".subtitle").textContent = t.welcomeSubtitle;
    welcomeSection.querySelector("button").textContent = t.startButton;
  }
  const langSection = document.getElementById("lang");
  if (langSection) {
    langSection.querySelector("h2").textContent = t.chooseLangTitle;
    const langButtons = langSection.querySelectorAll(".lang-buttons button");
    langButtons.forEach((btn, i) => { btn.textContent = t.langButtons[i]; });
  }
  const channelSection = document.getElementById("channel");
  if (channelSection) {
    channelSection.querySelector("h2").textContent = t.chooseOptionTitle;
    const buttons = channelSection.querySelectorAll("button");
    if (buttons.length >= 3) {
      buttons[0].textContent = t.officialChannel;
      buttons[1].textContent = t.buyKey;
      buttons[2].textContent = "🛍️ منتجاتنا";
    }
  }
  const countrySection = document.getElementById("country");
  if (countrySection) {
    countrySection.querySelector("h2").textContent = t.chooseCountryTitle;
    countrySection.querySelector("button").textContent = t.backButton;
  }
  const sellersSection = document.getElementById("sellers");
  if (sellersSection) sellersSection.querySelector("button").textContent = t.backButton;
  const productsSection = document.getElementById("products");
  if (productsSection) productsSection.querySelector("button").textContent = t.backButton;
}

function nextStep(id) {
  steps.forEach(s => document.getElementById(s)?.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  if (id === "country") renderCountries();
  if (id === "products") renderProducts();
}

function setLang(lang) {
  currentLang = lang;
  updateTexts();
  nextStep("channel");
}

function restart() {
  nextStep("welcome");
}

const eye = document.getElementById("eye");
if (eye) document.addEventListener("mousemove", e => {
  eye.style.left = e.pageX / 25 + "px";
  eye.style.top = e.pageY / 25 + "px";
});

// ------------ Fetching data from API ------------
const API = '/api';

async function renderCountries() {
  try {
    const res = await fetch(API + '/countries');
    const countries = await res.json();
    const div = document.getElementById("countries");
    div.innerHTML = "";
    if (!countries || countries.length === 0) {
      div.innerHTML = '<p>لا توجد دول بعد</p>';
      return;
    }
    countries.forEach(c => {
      const el = document.createElement("div");
      el.className = "card";
      el.textContent = c;
      el.onclick = () => showSellers(c);
      div.appendChild(el);
    });
  } catch (e) {
    console.error(e);
    document.getElementById("countries").innerHTML = '<p>خطأ في جلب البيانات</p>';
  }
}

async function showSellers(country) {
  selectedCountry = country;
  const t = translations[currentLang];
  try {
    const res = await fetch(API + '/sellers/' + encodeURIComponent(country));
    const data = await res.json();
    document.getElementById("countryName").textContent = t.sellersTitlePrefix + country;
    const container = document.getElementById("sellerList");
    container.innerHTML = data.length ? data.map((s, i) => {
      const avg = s.rates ? (s.total / s.rates).toFixed(1) : "0.0";
      return `
        <div class='seller'>
          <strong>${s.name}</strong> ${s.verified ? "✅" : ""}<br>
          <small>${s.desc || ""}</small><br>
          <div>
            <span>⭐ ${avg}/5 (${s.rates || 0} ${t.ratingsText})</span><br>
            <button onclick="complainSeller(${s.id})">${t.complainButton}</button>
            ${s.telegram ? `<a href="${s.telegram}" target="_blank"> | 📩 تيليجرام</a>` : ''}
            ${s.whatsapp ? `<a href="${s.whatsapp}" target="_blank"> | 📱 واتساب</a>` : ''}
          </div>
        </div>
      `;
    }).join('') : `<p>${t.noSellers}</p>`;
    nextStep("sellers");
  } catch (e) {
    console.error(e);
    alert('خطأ في جلب البائعين');
  }
}

async function complainSeller(sellerId) {
  try {
    await fetch(API + '/seller/' + sellerId + '/complaint', { method: 'POST' });
    // open telegram to admins as before (simple)
    const admins = ['zkkabo','devilcheatyt'];
    const randomAdmin = admins[Math.floor(Math.random()*admins.length)];
    window.open(`https://t.me/${randomAdmin}`, '_blank');
    showSellers(selectedCountry);
  } catch (e) {
    alert('خطأ في الإرسال');
  }
}

// ------------ Products rendering ------------
async function renderProducts() {
  try {
    const res = await fetch(API + '/products');
    const prods = await res.json();
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = '';
    if (!prods || prods.length === 0) grid.innerHTML = '<p>لا توجد منتجات بعد</p>';
    prods.forEach(p => {
      const el = document.createElement('div');
      el.className = 'card product-card';
      el.innerHTML = `
        <div class="prod-img-wrap"><img src="${p.image||''}" alt="${p.name}" onerror="this.style.display='none'"></div>
        <h3>${p.name}</h3>
        <p class="price">${p.price}</p>
        <p class="details">${p.details || ''}</p>
      `;
      grid.appendChild(el);
      // animation
      el.style.opacity = 0;
      el.style.transform = 'scale(0.98)';
      setTimeout(()=> { el.style.transition = 'transform 260ms ease, opacity 260ms ease'; el.style.opacity = 1; el.style.transform = 'scale(1)'; }, 50);
    });
    nextStep('products');
  } catch (e) {
    console.error(e);
    document.getElementById('productsGrid').innerHTML = '<p>خطأ في جلب المنتجات</p>';
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  updateTexts();
});
