const steps = ["welcome", "lang", "channel", "country", "sellers"];
let selectedCountry = "";
let currentLang = "ar"; // اللغة الافتراضية

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

  // تحديث نصوص القسم الترحيبي
  const welcomeSection = document.getElementById("welcome");
  if (welcomeSection) {
    welcomeSection.querySelector(".logo").textContent = t.welcomeTitle;
    welcomeSection.querySelector(".subtitle").textContent = t.welcomeSubtitle;
    welcomeSection.querySelector("button").textContent = t.startButton;
  }

  // تحديث نصوص اختيار اللغة
  const langSection = document.getElementById("lang");
  if (langSection) {
    langSection.querySelector("h2").textContent = t.chooseLangTitle;
    const langButtons = langSection.querySelectorAll(".lang-buttons button");
    langButtons.forEach((btn, i) => {
      btn.textContent = t.langButtons[i];
    });
  }

  // تحديث نصوص قسم القناة والشراء
  const channelSection = document.getElementById("channel");
  if (channelSection) {
    channelSection.querySelector("h2").textContent = t.chooseOptionTitle;
    const buttons = channelSection.querySelectorAll("button");
    if (buttons.length >= 2) {
      buttons[0].textContent = t.officialChannel;
      buttons[1].textContent = t.buyKey;
    }
  }

  // تحديث نصوص اختيار الدولة
  const countrySection = document.getElementById("country");
  if (countrySection) {
    countrySection.querySelector("h2").textContent = t.chooseCountryTitle;
    countrySection.querySelector("button").textContent = t.backButton;
  }

  // تحديث نص زر الرجوع في قسم البائعين
  const sellersSection = document.getElementById("sellers");
  if (sellersSection) {
    sellersSection.querySelector("button").textContent = t.backButton;
    // تحديث عنوان البائعين إذا تم اختيار دولة
    if (selectedCountry) {
      sellersSection.querySelector("#countryName").textContent = t.sellersTitlePrefix + selectedCountry;
    }
  }
}

function nextStep(id) {
  steps.forEach(s => document.getElementById(s)?.classList.remove("active"));
  document.getElementById(id)?.classList.add("active");
  if (id === "country") renderCountries();
}

function setLang(lang) {
  currentLang = lang;
  updateTexts();
  nextStep("channel");
}

function restart() {
  nextStep("welcome");
}

// 👁️ حركة عين أنوبيس
const eye = document.getElementById("eye");
if (eye) document.addEventListener("mousemove", e => {
  eye.style.left = e.pageX / 25 + "px";
  eye.style.top = e.pageY / 25 + "px";
});

// تحميل / حفظ بيانات
function loadData() { return JSON.parse(localStorage.getItem("sellersData") || "{}"); }
function saveData(data) { localStorage.setItem("sellersData", JSON.stringify(data)); }

// عرض الدول
function renderCountries() {
  const data = loadData();
  const div = document.getElementById("countries");
  div.innerHTML = "";
  Object.keys(data).forEach(c => {
    const el = document.createElement("div");
    el.className = "card";
    el.textContent = c;
    el.onclick = () => showSellers(c);
    div.appendChild(el);
  });
}

// عرض البائعين
function showSellers(country) {
  selectedCountry = country;
  const data = loadData()[country] || [];
  const t = translations[currentLang];
  document.getElementById("countryName").textContent = t.sellersTitlePrefix + country;
  const container = document.getElementById("sellerList");

  container.innerHTML = data.length
    ? data
        .sort((a, b) => (b.verified === true) - (a.verified === true) || (b.rating || 0) - (a.rating || 0))
        .map((s, i) => {
          const avg = s.rates ? (s.total / s.rates).toFixed(1) : "0.0";
          const canComplain = canComplainSeller(country, i);
          return `
      <div class='seller'>
        <strong>${s.name}</strong> ${s.verified ? "✅" : ""}<br>
        <small>${s.desc || ""}</small><br>
        <div>
          <span>⭐ ${avg}/5 (${s.rates || 0} ${t.ratingsText})</span><br>
          ${renderStars(country, i, avg)}
        </div>
        <br>
        ${s.telegram ? `<a href="${s.telegram}" target="_blank">📩 تيليجرام</a>` : ""}
        ${s.whatsapp ? ` | <a href="${s.whatsapp}" target="_blank">📱 واتساب</a>` : ""}
        <br>
        <button onclick="complainSeller('${country}',${i})" ${!canComplain ? "disabled style='opacity:0.5;cursor:not-allowed;'" : ""}>
          ${t.complainButton}
        </button>
      </div>
    `;
        })
        .join("")
    : `<p>${t.noSellers}</p>`;

  nextStep("sellers");
}

// عرض النجوم + تحديد حالة التقييم
function renderStars(country, index, avg) {
  const rated = JSON.parse(localStorage.getItem("ratedSellers") || "[]");
  const sellerId = `${country}_${index}`;
  const alreadyRated = rated.includes(sellerId);
  return [1, 2, 3, 4, 5]
    .map(n =>
      alreadyRated
        ? `<span class='star ${n <= Math.round(avg) ? "active" : ""}'>★</span>`
        : `<span class='star' onclick='rateSeller("${country}",${index},${n})'>★</span>`
    )
    .join("");
}

// تقييم البائع (مرة واحدة لكل جهاز)
function rateSeller(country, index, rate) {
  const rated = JSON.parse(localStorage.getItem("ratedSellers") || "[]");
  const sellerId = `${country}_${index}`;
  const t = translations[currentLang];

  if (rated.includes(sellerId)) {
    alert(t.ratedAlert);
    return;
  }

  const data = loadData();
  const seller = data[country][index];
  seller.rates = (seller.rates || 0) + 1;
  seller.total = (seller.total || 0) + rate;
  seller.rating = seller.total / seller.rates;

  rated.push(sellerId);
  localStorage.setItem("ratedSellers", JSON.stringify(rated));
  saveData(data);

  alert(t.thanksRating);
  showSellers(country);
}

// تحقق إن المستخدم يقدر يرسل شكوى ولا لأ
function canComplainSeller(country, index) {
  const complaints = JSON.parse(localStorage.getItem("complainedSellers") || "[]");
  const sellerId = `${country}_${index}`;
  return !complaints.includes(sellerId);
}

// تقديم شكوى (مرة واحدة فقط لكل بائع)
function complainSeller(country, index) {
  const complaints = JSON.parse(localStorage.getItem("complainedSellers") || "[]");
  const sellerId = `${country}_${index}`;
  const t = translations[currentLang];

  if (complaints.includes(sellerId)) {
    alert(t.complainedAlert);
    return;
  }

  const data = loadData();
  const seller = data[country][index];
  seller.complaints = (seller.complaints || 0) + 1;
  saveData(data);

  complaints.push(sellerId);
  localStorage.setItem("complainedSellers", JSON.stringify(complaints));

  const randomAdmin = Math.random() < 0.5 ? "zkkabo" : "devilcheatyt";
  window.open(`https://t.me/${randomAdmin}?text=بلاغ%20عن%20${seller.name}`);
  showSellers(country);
}

/* ========== لوحة الإدارة ========== */
function loginAdmin() {
  const pass = document.getElementById("adminPass").value;
  const t = translations[currentLang];
  if (pass === "hjirjhgfkhbgh84hy74jhf5gh5fr8h848fh") {
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("adminPanel").classList.remove("hidden");
    renderAdminTable();
  } else alert(t.wrongPassAlert);
}

function addSeller() {
  const c = countryName.value.trim();
  const n = sellerName.value.trim();
  const t = translations[currentLang];
  if (!c || !n) return alert(t.addSellerAlert);
  const data = loadData();
  data[c] = data[c] || [];
  data[c].push({
    name: n,
    desc: sellerDesc.value,
    telegram: telegram.value,
    whatsapp: whatsapp.value,
    verified: verified.checked,
    rating: 0,
    rates: 0,
    total: 0,
    complaints: 0
  });
  saveData(data);
  renderAdminTable();
  alert(t.sellerAddedAlert);
}

function renderAdminTable() {
  const data = loadData();
  const table = document.getElementById("sellersTable");
  table.innerHTML = "";
  Object.entries(data).forEach(([country, sellers]) => {
    sellers.forEach((s, i) => {
      const avg = s.rates ? (s.total / s.rates).toFixed(1) : "0.0";
      const row = document.createElement("div");
      row.className = "seller-row";
      row.innerHTML = `
        <span><strong>${country}</strong> - ${s.name} ${s.verified ? "✅" : ""} 
        | ⭐ ${avg}/5 (${s.rates || 0}) | 📛 شكاوى: ${s.complaints || 0}</span>
        <button onclick="deleteSeller('${country}',${i})">❌</button>
      `;
      table.appendChild(row);
    });
  });
}

function deleteSeller(country, index) {
  const data = loadData();
  data[country].splice(index, 1);
  if (!data[country].length) delete data[country];
  saveData(data);
  renderAdminTable();
}

function clearAll() {
  const t = translations[currentLang];
  if (confirm(t.confirmClearData)) {
    localStorage.removeItem("sellersData");
    renderAdminTable();
  }
}

// استدعاء تحديث النصوص عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  updateTexts();
});