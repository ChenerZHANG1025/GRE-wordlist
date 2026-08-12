const mistakes = [
  { word: "equivocal", phonetic: "/ɪˈkwɪvəkəl/", meaning: "模棱两可的", errors: 5, last: "今天" },
  { word: "laconic", phonetic: "/ləˈkɒnɪk/", meaning: "言简意赅的", errors: 3, last: "昨天" },
  { word: "prodigal", phonetic: "/ˈprɒdɪɡəl/", meaning: "挥霍的；浪费的", errors: 2, last: "3 天前" },
];

const views = { learn: document.querySelector("#learnView"), cards: document.querySelector("#cardsView"), mistakes: document.querySelector("#mistakesView") };
const toast = document.querySelector("#toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 1800);
}

function switchView(name) {
  Object.values(views).forEach((view) => view.classList.remove("active"));
  views[name].classList.add("active");
  document.querySelectorAll(".nav-link").forEach((link) => link.classList.toggle("active", link.dataset.view === name));
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => switchView(button.dataset.view)));

document.querySelectorAll(".tab").forEach((tab) => tab.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach((panel) => panel.classList.remove("active"));
  tab.classList.add("active");
  document.querySelector(`#${tab.dataset.tab}Panel`).classList.add("active");
}));

function renderMistakes() {
  document.querySelector("#mistakePreview").innerHTML = mistakes.slice(0, 2).map((item) => `
    <div class="mistake-item"><b>${item.word}</b><p>${item.meaning}</p><span class="error-badge">错 ${item.errors} 次</span></div>
  `).join("");
  document.querySelector("#mistakeList").innerHTML = mistakes.map((item) => `
    <div class="mistake-row">
      <div class="mistake-word"><b>${item.word}</b><span>${item.phonetic}</span></div>
      <div class="mistake-meaning">${item.meaning}</div>
      <div class="mistake-errors"><strong>${item.errors}</strong> 次错误<br><small>${item.last}</small></div>
      <button class="review-button" data-word="${item.word}">立即复习</button>
    </div>
  `).join("");
  document.querySelector("#totalErrors").textContent = mistakes.reduce((sum, item) => sum + item.errors, 0);
  document.querySelector("#navMistakeCount").textContent = mistakes.length;
  document.querySelectorAll(".review-button").forEach((button) => button.addEventListener("click", () => { switchView("cards"); showToast(`已加入复习：${button.dataset.word}`); }));
}

const overlay = document.querySelector("#searchOverlay");
document.querySelector("#searchButton").addEventListener("click", () => { overlay.classList.add("open"); overlay.setAttribute("aria-hidden", "false"); setTimeout(() => document.querySelector("#searchInput").focus(), 50); });
function closeSearch() { overlay.classList.remove("open"); overlay.setAttribute("aria-hidden", "true"); }
document.querySelector("#closeSearch").addEventListener("click", closeSearch);
overlay.addEventListener("click", (event) => { if (event.target === overlay) closeSearch(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeSearch(); });

document.querySelector("#bookmarkButton").addEventListener("click", (event) => { event.currentTarget.classList.toggle("active"); showToast(event.currentTarget.classList.contains("active") ? "已收藏 equivocal" : "已取消收藏"); });
document.querySelector("#soundButton").addEventListener("click", () => { if ("speechSynthesis" in window) { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance("equivocal")); } showToast("正在播放发音"); });
document.querySelector("#knowButton").addEventListener("click", () => showToast("真棒！今日进度 +1"));
document.querySelector("#forgotButton").addEventListener("click", () => showToast("已加入今日复习队列"));
document.querySelector("#quizButton").addEventListener("click", () => showToast("例题模块即将展开"));

const flashcard = document.querySelector("#flashcard");
flashcard.addEventListener("click", () => flashcard.classList.toggle("flipped"));
[["#cardForgot", "已记录错误，稍后会再次出现"], ["#cardFuzzy", "已标记为模糊"], ["#cardKnow", "回答正确，继续保持！"]].forEach(([selector, message]) => document.querySelector(selector).addEventListener("click", () => { flashcard.classList.remove("flipped"); showToast(message); }));
document.querySelectorAll(".filter").forEach((filter) => filter.addEventListener("click", () => { document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active")); filter.classList.add("active"); showToast(`已切换：${filter.textContent}`); }));

renderMistakes();
