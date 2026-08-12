const mistakes = [
  { word: "equivocal", phonetic: "/ɪˈkwɪvəkəl/", meaning: "模棱两可的", errors: 5, last: "今天" },
  { word: "laconic", phonetic: "/ləˈkɒnɪk/", meaning: "言简意赅的", errors: 3, last: "昨天" },
  { word: "prodigal", phonetic: "/ˈprɒdɪɡəl/", meaning: "挥霍的；浪费的", errors: 2, last: "3 天前" },
];

const WORD_TOTAL = 6485;
const vocabulary = [
  { word: "abate", phonetic: "/əˈbeɪt/", meaning: "减轻；减少", group: "减弱", status: "未学习" },
  { word: "aberrant", phonetic: "/əˈberənt/", meaning: "异常的；偏离常规的", group: "异常", status: "未学习" },
  { word: "abhor", phonetic: "/əbˈhɔːr/", meaning: "憎恶；厌恶", group: "厌恶", status: "已学习" },
  { word: "abstruse", phonetic: "/əbˈstruːs/", meaning: "深奥难懂的", group: "难懂", status: "待复习" },
  { word: "ambiguous", phonetic: "/æmˈbɪɡjuəs/", meaning: "含糊的；有歧义的", group: "含糊", status: "已学习" },
  { word: "anomalous", phonetic: "/əˈnɒmələs/", meaning: "反常的；不规则的", group: "异常", status: "未学习" },
  { word: "assuage", phonetic: "/əˈsweɪdʒ/", meaning: "缓和；减轻", group: "减弱", status: "未学习" },
  { word: "equivocal", phonetic: "/ɪˈkwɪvəkəl/", meaning: "模棱两可的", group: "含糊", status: "待复习" },
  { word: "erudite", phonetic: "/ˈerudaɪt/", meaning: "博学的", group: "博学", status: "未学习" },
  { word: "laconic", phonetic: "/ləˈkɒnɪk/", meaning: "言简意赅的", group: "简洁", status: "待复习" },
  { word: "lucid", phonetic: "/ˈluːsɪd/", meaning: "清晰易懂的", group: "清晰", status: "未学习" },
  { word: "obscure", phonetic: "/əbˈskjʊr/", meaning: "晦涩的；不著名的", group: "难懂", status: "未学习" },
  { word: "prodigal", phonetic: "/ˈprɒdɪɡəl/", meaning: "挥霍的；浪费的", group: "浪费", status: "待复习" },
  { word: "succinct", phonetic: "/səkˈsɪŋkt/", meaning: "简明的；言简意赅的", group: "简洁", status: "未学习" },
];
const synonymGroups = [
  { meaning: "含糊不清", category: "表达", note: "从客观歧义到刻意回避，注意主观意图。", words: [["ambiguous", "有多种解释"], ["equivocal", "刻意含糊"], ["vague", "不够明确"], ["obscure", "晦涩难懂"]] },
  { meaning: "言简意赅", category: "表达", note: "都表示用词少，laconic 有时带冷淡语气。", words: [["concise", "简洁清楚"], ["succinct", "简明扼要"], ["laconic", "少言简短"], ["terse", "简短生硬"]] },
  { meaning: "减轻缓和", category: "变化", note: "可搭配痛苦、担忧、冲突或严重程度。", words: [["abate", "强度减弱"], ["alleviate", "减轻痛苦"], ["assuage", "缓和情绪"], ["mitigate", "缓解危害"]] },
  { meaning: "异常反常", category: "性质", note: "强调偏离规则、常态或预期。", words: [["aberrant", "偏离常规"], ["anomalous", "不合规则"], ["atypical", "非典型的"], ["deviant", "背离规范"]] },
  { meaning: "憎恨厌恶", category: "情感", note: "强度由一般反感逐渐上升至深恶痛绝。", words: [["dislike", "不喜欢"], ["loathe", "强烈厌恶"], ["abhor", "深恶痛绝"], ["detest", "极为憎恨"]] },
  { meaning: "博学多识", category: "能力", note: "erudite 尤其强调通过研习获得的深厚知识。", words: [["learned", "有学问的"], ["erudite", "博学的"], ["scholarly", "学术渊博的"], ["lettered", "有文化的"]] },
  { meaning: "清晰明了", category: "表达", note: "既可形容语言思路，也可形容解释。", words: [["lucid", "清晰易懂"], ["explicit", "明确直白"], ["coherent", "连贯清楚"], ["pellucid", "清澈明晰"]] },
  { meaning: "挥霍浪费", category: "行为", note: "prodigal 侧重奢侈挥霍，wasteful 泛指浪费。", words: [["prodigal", "挥霍无度"], ["extravagant", "奢侈的"], ["wasteful", "浪费的"], ["spendthrift", "花钱无度"]] },
];
const views = { learn: document.querySelector("#learnView"), vocabulary: document.querySelector("#vocabularyView"), synonyms: document.querySelector("#synonymsView"), cards: document.querySelector("#cardsView"), mistakes: document.querySelector("#mistakesView") };
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

let wordPage = 0;
let selectedLetter = "全部";
const pageSize = 7;
function renderVocabulary() {
  const query = document.querySelector("#librarySearch").value.trim().toLowerCase();
  const filtered = vocabulary.filter((item) => (selectedLetter === "全部" || item.word.startsWith(selectedLetter.toLowerCase())) && `${item.word} ${item.meaning}`.toLowerCase().includes(query));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  wordPage = Math.min(wordPage, pages - 1);
  document.querySelector("#wordLibraryList").innerHTML = filtered.slice(wordPage * pageSize, (wordPage + 1) * pageSize).map((item) => `
    <div class="library-row"><div class="library-word"><button class="word-sound" data-speak="${item.word}">⌁</button><div><b>${item.word}</b><span>${item.phonetic} · ${item.meaning}</span></div></div><button class="group-link" data-group="${item.group}">${item.group}词组 →</button><span class="status-pill ${item.status === "已学习" ? "learned" : item.status === "待复习" ? "review" : ""}">${item.status}</span></div>
  `).join("") || `<div class="empty-state">没有找到匹配的词汇</div>`;
  document.querySelector("#wordPageInfo").textContent = `第 ${wordPage + 1} / ${pages} 页 · 当前展示 ${filtered.length} 词`;
  document.querySelector("#previousWords").disabled = wordPage === 0;
  document.querySelector("#nextWords").disabled = wordPage >= pages - 1;
  document.querySelectorAll(".group-link").forEach((button) => button.addEventListener("click", () => { switchView("synonyms"); document.querySelector("#synonymSearch").value = button.dataset.group; renderSynonyms(); }));
  document.querySelectorAll(".word-sound").forEach((button) => button.addEventListener("click", () => { if ("speechSynthesis" in window) speechSynthesis.speak(new SpeechSynthesisUtterance(button.dataset.speak)); }));
}

let synonymCategory = "全部";
function renderSynonyms() {
  const query = document.querySelector("#synonymSearch").value.trim().toLowerCase();
  const groups = synonymGroups.filter((group) => (synonymCategory === "全部" || group.category === synonymCategory) && `${group.meaning} ${group.words.flat().join(" ")}`.toLowerCase().includes(query));
  document.querySelector("#synonymGrid").innerHTML = groups.map((group, index) => `<article class="synonym-group-card"><div class="synonym-card-top"><span>0${index + 1}</span><small>${group.category}</small></div><h2>${group.meaning}</h2><p>${group.note}</p><div class="synonym-word-list">${group.words.map(([word, meaning], wordIndex) => `<button><i style="--level:${(wordIndex + 1) * 25}%"></i><b>${word}</b><span>${meaning}</span></button>`).join("")}</div></article>`).join("") || `<div class="empty-state wide">没有找到匹配的同义词组</div>`;
  document.querySelector("#synonymGroupTotal").textContent = groups.length;
}

document.querySelector("#alphabetFilter").innerHTML = ["全部", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => `<button class="${letter === "全部" ? "active" : ""}" data-letter="${letter}">${letter}</button>`).join("");
document.querySelectorAll("#alphabetFilter button").forEach((button) => button.addEventListener("click", () => { selectedLetter = button.dataset.letter; wordPage = 0; document.querySelectorAll("#alphabetFilter button").forEach((item) => item.classList.toggle("active", item === button)); renderVocabulary(); }));
document.querySelector("#librarySearch").addEventListener("input", () => { wordPage = 0; renderVocabulary(); });
document.querySelector("#previousWords").addEventListener("click", () => { wordPage--; renderVocabulary(); });
document.querySelector("#nextWords").addEventListener("click", () => { wordPage++; renderVocabulary(); });
const categories = ["全部", ...new Set(synonymGroups.map((group) => group.category))];
document.querySelector("#synonymCategories").innerHTML = categories.map((category) => `<button class="${category === "全部" ? "active" : ""}" data-category="${category}">${category}</button>`).join("");
document.querySelectorAll("#synonymCategories button").forEach((button) => button.addEventListener("click", () => { synonymCategory = button.dataset.category; document.querySelectorAll("#synonymCategories button").forEach((item) => item.classList.toggle("active", item === button)); renderSynonyms(); }));
document.querySelector("#synonymSearch").addEventListener("input", renderSynonyms);

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
renderVocabulary();
renderSynonyms();
