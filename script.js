const questState = {
  heart: false,
  wishes: false,
  mood: false,
  memory: false,
};

const progressEl = document.getElementById("progress");
const giftBtn = document.getElementById("gift-btn");

function updateProgress() {
  const done = Object.values(questState).filter(Boolean).length;
  progressEl.textContent = `${done} / 4 квеста выполнено`;
  giftBtn.disabled = done !== 4;
}

function completeQuest(id, cardId) {
  if (questState[id]) return;
  questState[id] = true;
  document.getElementById(cardId).classList.add("done");
  updateProgress();
}

// Quest 1
const heartsZone = document.getElementById("hearts-zone");
let heartsCaught = 0;

for (let i = 0; i < 3; i += 1) {
  const heart = document.createElement("button");
  heart.className = "heart static-heart";
  heart.textContent = "💖";
  heart.addEventListener("click", () => {
    if (heart.classList.contains("caught")) return;
    heart.classList.add("caught");
    heartsCaught += 1;
    if (heartsCaught >= 3) {
      completeQuest("heart", "quest-heart");
    }
  });
  heartsZone.appendChild(heart);
}

// Quest 2
const wishes = [
  "Пусть каждый день будет наполнен радостью 🌸",
  "Пусть рядом будут любящие и верные люди 💗",
  "Пусть все цели покоряются легко и красиво ✨",
];
let wishIndex = 0;
const wishBtn = document.getElementById("wish-btn");
const wishDisplay = document.getElementById("wish-display");
wishBtn.addEventListener("click", () => {
  wishDisplay.textContent = wishes[wishIndex];
  wishIndex = (wishIndex + 1) % wishes.length;
  completeQuest("wishes", "quest-wishes");
});

// Quest 3
const moodMsg = document.getElementById("mood-msg");
document.querySelectorAll("#mood-options .mood").forEach((btn) => {
  btn.addEventListener("click", () => {
    moodMsg.textContent = `Отличный выбор: ${btn.textContent} 💖`;
    completeQuest("mood", "quest-mood");
    document.querySelectorAll("#mood-options .mood").forEach((b) => {
      b.disabled = true;
    });
    btn.disabled = false;
  });
});

// Quest 4
const symbols = ["🌷", "🌷", "🌹", "🌹", "🌸", "🌸", "💐", "💐"];
const memoryGrid = document.getElementById("memory-grid");
const memoryMsg = document.getElementById("memory-msg");

symbols
  .sort(() => Math.random() - 0.5)
  .forEach((symbol) => {
    const btn = document.createElement("button");
    btn.className = "memory-card";
    btn.dataset.symbol = symbol;
    btn.textContent = symbol;
    memoryGrid.appendChild(btn);
  });

let opened = [];
let lock = false;
memoryGrid.addEventListener("click", (e) => {
  const card = e.target.closest(".memory-card");
  if (!card || lock || card.classList.contains("matched") || opened.includes(card)) return;

  card.classList.add("revealed");
  opened.push(card);

  if (opened.length === 2) {
    lock = true;
    const [a, b] = opened;
    if (a.dataset.symbol === b.dataset.symbol) {
      a.classList.add("matched");
      b.classList.add("matched");
      memoryMsg.textContent = "Пара найдена!";
      opened = [];
      lock = false;
      if (memoryGrid.querySelectorAll(".matched").length >= 2) {
        completeQuest("memory", "quest-memory");
      }
    } else {
      memoryMsg.textContent = "Не совпало, попробуй снова";
      setTimeout(() => {
        a.classList.remove("revealed");
        b.classList.remove("revealed");
        opened = [];
        lock = false;
      }, 800);
    }
  }
});

// Wishes slider: 20 people, 4 per page
const classmatesWishes = [
  { text: "Пусть каждый день будет светлым и добрым!", from: "Артём" },
  { text: "Улыбок, счастья и весеннего настроения!", from: "Кирилл" },
  { text: "Пусть мечты исполняются быстрее, чем дедлайны.", from: "Илья" },
  { text: "Любви, тепла и ярких эмоций каждый день.", from: "Максим" },
  { text: "Пусть во всем сопутствует удача ✨", from: "Даниил" },
  { text: "Здоровья, гармонии и радости в сердце.", from: "Никита" },
  { text: "Пусть учеба дается легко и уверенно!", from: "Егор" },
  { text: "Больше поводов для смеха и праздника.", from: "Роман" },
  { text: "Пусть рядом будут только искренние люди.", from: "Матвей" },
  { text: "Желаю вдохновения и красивых побед!", from: "Иван" },
  { text: "Оставайтесь такими же прекрасными 💖", from: "Алексей" },
  { text: "Мира в душе и баланса во всем.", from: "Павел" },
  { text: "Пусть весна подарит новые возможности!", from: "Степан" },
  { text: "Пусть будет много цветов и комплиментов.", from: "Тимур" },
  { text: "Уверенности, нежности и вдохновения 🌸", from: "Глеб" },
  { text: "Пусть каждый день будет поводом для радости.", from: "Семён" },
  { text: "Счастья, любви и солнечного настроения!", from: "Дмитрий" },
  { text: "Пусть жизнь будет наполнена чудесами.", from: "Руслан" },
  { text: "Пусть у вас всегда всё получается!", from: "Антон" },
  { text: "Спасибо, что делаете группу ярче каждый день.", from: "Владислав" },
];

const perPage = 4;
let currentPage = 0;
const totalPages = Math.ceil(classmatesWishes.length / perPage);
const wishCards = document.getElementById("wish-cards");
const prevBtn = document.getElementById("wishes-prev");
const nextBtn = document.getElementById("wishes-next");
const slider = document.getElementById("wishes-slider");

function renderWishesPage() {
  const start = currentPage * perPage;
  const chunk = classmatesWishes.slice(start, start + perPage);
  wishCards.innerHTML = "";

  chunk.forEach((item) => {
    const card = document.createElement("article");
    card.className = "wish-card";
    card.innerHTML = `<p>${item.text}</p><span>— от ${item.from}</span>`;
    wishCards.appendChild(card);
  });

  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === totalPages - 1;
}

prevBtn.addEventListener("click", () => {
  if (currentPage > 0) {
    currentPage -= 1;
    renderWishesPage();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages - 1) {
    currentPage += 1;
    renderWishesPage();
  }
});

let touchStartX = 0;
slider.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].clientX;
});

slider.addEventListener("touchend", (e) => {
  const delta = e.changedTouches[0].clientX - touchStartX;
  if (delta < -40 && currentPage < totalPages - 1) {
    currentPage += 1;
    renderWishesPage();
  }
  if (delta > 40 && currentPage > 0) {
    currentPage -= 1;
    renderWishesPage();
  }
});

// Gift modal + flower burst
const modal = document.getElementById("gift-modal");
const closeModalBtn = document.getElementById("close-modal");
const certPasswordInput = document.getElementById("cert-password");
const certCheckBtn = document.getElementById("check-cert");
const certMessage = document.getElementById("cert-message");
const certDownload = document.getElementById("cert-download");

const certificatesByPassword = {
  flower01: "gift/certificates/certificate-1.pdf",
  flower02: "gift/certificates/certificate-2.pdf",
  flower03: "gift/certificates/certificate-3.pdf",
  flower04: "gift/certificates/certificate-4.pdf",
  flower05: "gift/certificates/certificate-5.pdf",
  flower06: "gift/certificates/certificate-6.pdf",
  flower07: "gift/certificates/certificate-7.pdf",
  flower08: "gift/certificates/certificate-8.pdf",
};

function resetCertificateAccess() {
  certPasswordInput.value = "";
  certMessage.textContent = "";
  certDownload.hidden = true;
  certDownload.href = "gift/congrats.pdf";
}

giftBtn.addEventListener("click", () => {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  resetCertificateAccess();
  launchFlowers();
});

certCheckBtn.addEventListener("click", () => {
  const password = certPasswordInput.value.trim();
  const certPath = certificatesByPassword[password];
  if (!certPath) {
    certMessage.textContent = "Неверный пароль. Попробуйте ещё раз 💡";
    certDownload.hidden = true;
    return;
  }
  certMessage.textContent = "Пароль верный! Ваш сертификат готов к скачиванию ✅";
  certDownload.href = certPath;
  certDownload.hidden = false;
});

closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
});

function launchFlowers() {
  const flowers = ["🌸", "🌺", "🌷", "💮", "🏵️"];
  for (let i = 0; i < 70; i += 1) {
    const flower = document.createElement("span");
    flower.className = "flower";
    flower.textContent = flowers[Math.floor(Math.random() * flowers.length)];
    flower.style.left = `${Math.random() * 100}vw`;
    flower.style.animationDelay = `${Math.random() * 0.4}s`;
    flower.style.fontSize = `${16 + Math.random() * 24}px`;
    document.body.appendChild(flower);
    setTimeout(() => flower.remove(), 2600);
  }
}

updateProgress();
renderWishesPage();
