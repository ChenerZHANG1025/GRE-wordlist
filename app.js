let mistakes = [];

let WORD_TOTAL = 0;
let vocabulary = [];
const storedSynonymGroups = JSON.parse(localStorage.getItem("vocabloom-synonym-groups") || "null");
let synonymGroups = Array.isArray(storedSynonymGroups) ? storedSynonymGroups : [];
const views = { learn: document.querySelector("#learnView"), vocabulary: document.querySelector("#vocabularyView"), synonyms: document.querySelector("#synonymsView"), cards: document.querySelector("#cardsView"), mistakes: document.querySelector("#mistakesView") };
const toast = document.querySelector("#toast");
const DAILY_GOAL = 200;
let orderedVocabulary = [];
const todayKey = new Date().toISOString().slice(0, 10);
const savedProgress = JSON.parse(localStorage.getItem("vocabloom-progress") || "null");
const progress = savedProgress?.date === todayKey ? savedProgress : { date: todayKey, index: 0, learned: 0, reviewed: [], bookmarks: [] };
const savedMistakes = JSON.parse(localStorage.getItem("vocabloom-mistakes") || "null");
if (Array.isArray(savedMistakes)) mistakes = savedMistakes;
function saveProgress() { localStorage.setItem("vocabloom-progress", JSON.stringify(progress)); localStorage.setItem("vocabloom-mistakes", JSON.stringify(mistakes)); }
function currentWord() { return orderedVocabulary.length ? orderedVocabulary[progress.index % orderedVocabulary.length] : null; }
function wordGroup(item) { return synonymGroups.find((group) => group.words.some(([word]) => word === item.word)); }
function renderStudy() {
  const item = currentWord();
  if (!item) return; const index = orderedVocabulary.indexOf(item); const group = wordGroup(item); const percent = Math.min(100, Math.round(progress.learned / DAILY_GOAL * 100));
  document.querySelector("#studySequence").textContent = `GRE 核心 · NO. ${String(index + 1).padStart(4, "0")} · A–Z`;
  document.querySelector("#studyWord").textContent = item.word; document.querySelector("#studyPhonetic").textContent = item.phonetic || "音标未提供"; document.querySelector("#studyMeaning").textContent = item.chineseMeaning;
  document.querySelector("#studyOrderHint").textContent = `按字母顺序学习 · ${item.word[0].toUpperCase()}`;
  document.querySelector("#studySynonyms").innerHTML = group ? group.words.slice(0, 3).map(([word, meaning]) => `<div class="${word === item.word ? "highlight" : ""}"><b>${word}</b><span>${meaning}</span></div>`).join("<i></i>") : `<div class="highlight"><b>${item.word}</b><span>${item.partOfSpeech || "未分组"}</span></div>`;
  document.querySelector("#studyTip").textContent = group?.note || `把 ${item.word} 与“${item.chineseMeaning}”一起朗读。`;
  const roots = item.root ? [item.root] : [];
  document.querySelector("#studyRootFormula").innerHTML = roots.length ? roots.map((root) => `<b>${root}</b>`).join("<strong>+</strong>") : `<span class="source-empty">PDF 未提供词根信息</span>`;
  document.querySelector("#studyRootNote").textContent = roots.length ? "以下内容来自 PDF。" : "为避免编造信息，此字段保持为空。";
  document.querySelector("#studyFamily").innerHTML = item.wordFamily?.length ? `<span>同根词</span>${item.wordFamily.map((word) => `<button>${word}</button>`).join("")}` : `<span>PDF 未提供同根词</span>`;
  document.querySelector("#studyExample").innerHTML = item.example ? item.example.replace(new RegExp(`(${item.word})`, "i"), "<mark>$1</mark>") : `<span class="source-empty">PDF 未提供例句</span>`;
  document.querySelector("#studyTranslation").textContent = item.englishMeaning || "原始 PDF 仅提供词性与中文释义。";
  document.querySelector("#studyTranslation").classList.remove("revealed");
  document.querySelector("#dailyPercent").textContent = `${percent}%`; document.querySelector("#dailyProgress").setAttribute("aria-label", `今日进度 ${percent}%`); document.querySelector("#dailyProgressRing").style.background = `radial-gradient(circle,#fffdf2 59%,transparent 61%),conic-gradient(var(--green-dark) ${percent}%,#e4e8dc 0)`;
  document.querySelector("#todayLearned").textContent = progress.learned; document.querySelector("#dailyMessage").textContent = progress.learned >= DAILY_GOAL ? "今日 200 词目标已完成，做得漂亮！" : `今日还剩 ${DAILY_GOAL - progress.learned} 个单词，按字母顺序继续学习。`;
  document.querySelector("#totalLearned").textContent = progress.reviewed.length; document.querySelector("#learnedMeter").style.width = `${Math.min(100, progress.reviewed.length / WORD_TOTAL * 100)}%`; document.querySelector("#weekLearned").textContent = progress.learned;
  document.querySelector("#bookmarkButton").classList.toggle("active", progress.bookmarks.includes(item.word)); document.querySelector("#cardSequence").textContent = `GRE CORE · ${String(index + 1).padStart(4, "0")} · A–Z`; document.querySelector("#cardWord").textContent = item.word; document.querySelector("#cardPhonetic").textContent = item.phonetic || "音标未提供"; document.querySelector("#cardMeaning").textContent = item.chineseMeaning; document.querySelector("#cardGroup").textContent = `词性：${item.partOfSpeech || "PDF 未提供"}`; document.querySelector("#cardSessionCount").textContent = `今日 ${progress.learned} / ${DAILY_GOAL}`;
}
function recordAnswer(remembered) {
  const item = currentWord(); if (!progress.reviewed.includes(item.word)) progress.reviewed.push(item.word); if (progress.learned < DAILY_GOAL) progress.learned += 1;
  if (!remembered) { const mistake = mistakes.find((entry) => entry.word === item.word); if (mistake) { mistake.errors += 1; mistake.last = "今天"; } else mistakes.unshift({ word: item.word, phonetic: item.phonetic || "音标未提供", meaning: item.chineseMeaning, errors: 1, last: "今天" }); }
  progress.index = (progress.index + 1) % orderedVocabulary.length; saveProgress(); renderStudy(); renderMistakes(); renderVocabulary(); showToast(remembered ? "记忆成功，继续下一个字母序单词" : "已记录到易错本，继续下一个单词");
}

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
      <div class="mistake-word"><b>${item.word}</b><span>${item.phonetic || "音标未提供"}</span></div>
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
  const filtered = vocabulary.filter((item) => (selectedLetter === "全部" || item.word.startsWith(selectedLetter.toLowerCase())) && `${item.word} ${item.chineseMeaning}`.toLowerCase().includes(query));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  wordPage = Math.min(wordPage, pages - 1);
  document.querySelector("#wordLibraryList").innerHTML = filtered.slice(wordPage * pageSize, (wordPage + 1) * pageSize).map((item) => { const status = progress.reviewed.includes(item.word) ? "已学习" : mistakes.some((entry) => entry.word === item.word) ? "待复习" : "未学习"; return `
    <div class="library-row"><div class="library-word"><button class="word-sound" data-speak="${item.word}">⌁</button><div><b>${item.word}</b><span>${item.partOfSpeech || "词性未提供"} · ${item.chineseMeaning}</span></div></div><span class="source-field">${item.phonetic || "PDF 未提供音标"}</span><span class="status-pill ${status === "已学习" ? "learned" : status === "待复习" ? "review" : ""}">${status}</span></div>
  `; }).join("") || `<div class="empty-state">没有找到匹配的词汇</div>`;
  document.querySelector("#wordPageInfo").textContent = `第 ${wordPage + 1} / ${pages} 页 · 当前展示 ${filtered.length} 词`;
  document.querySelector("#previousWords").disabled = wordPage === 0;
  document.querySelector("#nextWords").disabled = wordPage >= pages - 1;
  document.querySelectorAll(".word-sound").forEach((button) => button.addEventListener("click", () => { if ("speechSynthesis" in window) speechSynthesis.speak(new SpeechSynthesisUtterance(button.dataset.speak)); }));
}

let synonymCategory = "全部";
function renderSynonyms() {
  const query = document.querySelector("#synonymSearch").value.trim().toLowerCase();
  const groups = synonymGroups.filter((group) => (synonymCategory === "全部" || group.category === synonymCategory) && `${group.meaning} ${group.words.flat().join(" ")}`.toLowerCase().includes(query));
  document.querySelector("#synonymGrid").innerHTML = groups.map((group, index) => `<article class="synonym-group-card"><div class="synonym-card-top"><span>${String(index + 1).padStart(2, "0")}</span><div class="group-card-actions"><small>${group.category}</small><button class="edit-group" data-id="${group.id}" aria-label="编辑 ${group.meaning}">编辑</button><button class="delete-group" data-id="${group.id}" aria-label="删除 ${group.meaning}">删除</button></div></div><h2>${group.meaning}</h2><p>${group.note}</p><div class="synonym-word-list">${group.words.map(([word, meaning], wordIndex) => `<button><i style="--level:${(wordIndex + 1) * 25}%"></i><b>${word}</b><span>${meaning}</span></button>`).join("")}</div></article>`).join("") || `<div class="empty-state wide">没有找到匹配的同义词组</div>`;
  document.querySelector("#synonymGroupTotal").textContent = synonymGroups.length;
  document.querySelectorAll(".edit-group").forEach((button) => button.addEventListener("click", () => openSynonymEditor(button.dataset.id)));
  document.querySelectorAll(".delete-group").forEach((button) => button.addEventListener("click", () => deleteSynonymGroup(button.dataset.id)));
}

document.querySelector("#alphabetFilter").innerHTML = ["全部", ..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => `<button class="${letter === "全部" ? "active" : ""}" data-letter="${letter}">${letter}</button>`).join("");
document.querySelectorAll("#alphabetFilter button").forEach((button) => button.addEventListener("click", () => { selectedLetter = button.dataset.letter; wordPage = 0; document.querySelectorAll("#alphabetFilter button").forEach((item) => item.classList.toggle("active", item === button)); renderVocabulary(); }));
document.querySelector("#librarySearch").addEventListener("input", () => { wordPage = 0; renderVocabulary(); });
document.querySelector("#previousWords").addEventListener("click", () => { wordPage--; renderVocabulary(); });
document.querySelector("#nextWords").addEventListener("click", () => { wordPage++; renderVocabulary(); });
function renderSynonymCategories() {
  const categories = ["全部", ...new Set(synonymGroups.map((group) => group.category))];
  if (!categories.includes(synonymCategory)) synonymCategory = "全部";
  document.querySelector("#synonymCategories").innerHTML = categories.map((category) => `<button class="${category === synonymCategory ? "active" : ""}" data-category="${category}">${category}</button>`).join("");
  document.querySelectorAll("#synonymCategories button").forEach((button) => button.addEventListener("click", () => { synonymCategory = button.dataset.category; renderSynonymCategories(); renderSynonyms(); }));
}
document.querySelector("#synonymSearch").addEventListener("input", renderSynonyms);

const synonymEditor = document.querySelector("#synonymEditor");
function addWordEditorRow(word = "", meaning = "") {
  const row = document.createElement("div"); row.className = "word-editor-row";
  row.innerHTML = `<input class="editor-word" required placeholder="英文单词" value="${word}"><input class="editor-meaning" required placeholder="中文辨析" value="${meaning}"><button type="button" class="remove-word" aria-label="移除单词">×</button>`;
  row.querySelector(".remove-word").addEventListener("click", () => { if (document.querySelectorAll(".word-editor-row").length > 1) row.remove(); else showToast("每个组别至少保留一个单词"); });
  document.querySelector("#wordEditorRows").append(row);
}
function openSynonymEditor(id = "") {
  const group = synonymGroups.find((item) => item.id === id);
  document.querySelector("#editorTitle").textContent = group ? "编辑同义词组" : "新建同义词组";
  document.querySelector("#editingGroupId").value = group?.id || "";
  document.querySelector("#groupMeaning").value = group?.meaning || ""; document.querySelector("#groupCategory").value = group?.category || ""; document.querySelector("#groupNote").value = group?.note || "";
  document.querySelector("#wordEditorRows").innerHTML = ""; (group?.words || [["", ""]]).forEach(([word, meaning]) => addWordEditorRow(word, meaning)); synonymEditor.showModal();
}
function persistSynonymGroups() { localStorage.setItem("vocabloom-synonym-groups", JSON.stringify(synonymGroups)); renderSynonymCategories(); renderSynonyms(); renderStudy(); }
function deleteSynonymGroup(id) { const group = synonymGroups.find((item) => item.id === id); if (!group || !confirm(`确定删除“${group.meaning}”组吗？`)) return; synonymGroups = synonymGroups.filter((item) => item.id !== id); persistSynonymGroups(); showToast("组别已删除"); }
document.querySelector("#addGroupButton").addEventListener("click", () => openSynonymEditor());
document.querySelector("#addWordRow").addEventListener("click", () => addWordEditorRow());
document.querySelector("#synonymForm").addEventListener("submit", (event) => {
  if (event.submitter?.value === "cancel") return;
  event.preventDefault(); const words = [...document.querySelectorAll(".word-editor-row")].map((row) => [row.querySelector(".editor-word").value.trim().toLowerCase(), row.querySelector(".editor-meaning").value.trim()]).filter(([word, meaning]) => word && meaning);
  if (!words.length) { showToast("请至少填写一个单词"); return; }
  const id = document.querySelector("#editingGroupId").value; const group = { id: id || crypto.randomUUID(), meaning: document.querySelector("#groupMeaning").value.trim(), category: document.querySelector("#groupCategory").value.trim(), note: document.querySelector("#groupNote").value.trim(), words };
  const index = synonymGroups.findIndex((item) => item.id === id); if (index >= 0) synonymGroups[index] = group; else synonymGroups.unshift(group);
  persistSynonymGroups(); synonymEditor.close(); showToast(index >= 0 ? "组别已更新" : "新组别已添加");
});

const overlay = document.querySelector("#searchOverlay");
document.querySelector("#searchButton").addEventListener("click", () => { overlay.classList.add("open"); overlay.setAttribute("aria-hidden", "false"); setTimeout(() => document.querySelector("#searchInput").focus(), 50); });
function closeSearch() { overlay.classList.remove("open"); overlay.setAttribute("aria-hidden", "true"); }
document.querySelector("#closeSearch").addEventListener("click", closeSearch);
overlay.addEventListener("click", (event) => { if (event.target === overlay) closeSearch(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeSearch(); });

document.querySelector("#bookmarkButton").addEventListener("click", () => { const word = currentWord().word; const index = progress.bookmarks.indexOf(word); if (index >= 0) progress.bookmarks.splice(index, 1); else progress.bookmarks.push(word); saveProgress(); renderStudy(); showToast(index >= 0 ? "已取消收藏" : `已收藏 ${word}`); });
document.querySelector("#soundButton").addEventListener("click", () => { if ("speechSynthesis" in window) { speechSynthesis.cancel(); speechSynthesis.speak(new SpeechSynthesisUtterance(currentWord().word)); } showToast("正在播放发音"); });
document.querySelector("#knowButton").addEventListener("click", () => recordAnswer(true));
document.querySelector("#forgotButton").addEventListener("click", () => recordAnswer(false));
document.querySelector("#quizButton").addEventListener("click", () => { document.querySelector("#studyTranslation").classList.toggle("revealed"); document.querySelector("#quizButton").textContent = document.querySelector("#studyTranslation").classList.contains("revealed") ? "隐藏参考译文 ↑" : "查看参考译文 →"; });

const flashcard = document.querySelector("#flashcard");
flashcard.addEventListener("click", () => flashcard.classList.toggle("flipped"));
document.querySelector("#cardForgot").addEventListener("click", () => { flashcard.classList.remove("flipped"); recordAnswer(false); });
document.querySelector("#cardFuzzy").addEventListener("click", () => { flashcard.classList.remove("flipped"); recordAnswer(false); });
document.querySelector("#cardKnow").addEventListener("click", () => { flashcard.classList.remove("flipped"); recordAnswer(true); });
document.addEventListener("keydown", (event) => {
  if (!views.cards.classList.contains("active") || ["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) return;
  if (event.key === "1" || event.key === "2") { flashcard.classList.remove("flipped"); recordAnswer(false); }
  if (event.key === "3") { flashcard.classList.remove("flipped"); recordAnswer(true); }
  if (event.code === "Space") { event.preventDefault(); flashcard.classList.toggle("flipped"); }
});
document.querySelectorAll(".filter").forEach((filter) => filter.addEventListener("click", () => { document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active")); filter.classList.add("active"); showToast(`已切换：${filter.textContent}`); }));

async function initializeApp() {
  try {
    const response = await fetch("data/words.json");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    vocabulary = payload.words;
    WORD_TOTAL = payload.metadata.cleanEntries;
    orderedVocabulary = [...vocabulary].sort((a, b) => a.word.localeCompare(b.word));
    document.querySelector("#heroWordTotal").textContent = WORD_TOTAL.toLocaleString();
    document.querySelector("#libraryWordTotal").textContent = WORD_TOTAL.toLocaleString();
    document.querySelector("#librarySourceNote").textContent = `已从 PDF 解析 ${payload.metadata.pdfPages} 页 · ${payload.metadata.uniqueWords.toLocaleString()} 个唯一词条`;
    renderMistakes(); renderVocabulary(); renderSynonymCategories(); renderSynonyms(); renderStudy();
  } catch (error) {
    document.querySelector("#dailyMessage").textContent = "真实词库加载失败，请通过本地 HTTP 服务运行网站。";
    showToast(`词库加载失败：${error.message}`);
  }
}
initializeApp();
