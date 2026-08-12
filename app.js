let mistakes = [
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
const defaultSynonymGroups = [
  { id: crypto.randomUUID(), meaning: "含糊不清", category: "表达", note: "从客观歧义到刻意回避，注意主观意图。", words: [["ambiguous", "有多种解释"], ["equivocal", "刻意含糊"], ["vague", "不够明确"], ["obscure", "晦涩难懂"]] },
  { id: crypto.randomUUID(), meaning: "言简意赅", category: "表达", note: "都表示用词少，laconic 有时带冷淡语气。", words: [["concise", "简洁清楚"], ["succinct", "简明扼要"], ["laconic", "少言简短"], ["terse", "简短生硬"]] },
  { id: crypto.randomUUID(), meaning: "减轻缓和", category: "变化", note: "可搭配痛苦、担忧、冲突或严重程度。", words: [["abate", "强度减弱"], ["alleviate", "减轻痛苦"], ["assuage", "缓和情绪"], ["mitigate", "缓解危害"]] },
  { id: crypto.randomUUID(), meaning: "异常反常", category: "性质", note: "强调偏离规则、常态或预期。", words: [["aberrant", "偏离常规"], ["anomalous", "不合规则"], ["atypical", "非典型的"], ["deviant", "背离规范"]] },
  { id: crypto.randomUUID(), meaning: "憎恨厌恶", category: "情感", note: "强度由一般反感逐渐上升至深恶痛绝。", words: [["dislike", "不喜欢"], ["loathe", "强烈厌恶"], ["abhor", "深恶痛绝"], ["detest", "极为憎恨"]] },
  { id: crypto.randomUUID(), meaning: "博学多识", category: "能力", note: "erudite 尤其强调通过研习获得的深厚知识。", words: [["learned", "有学问的"], ["erudite", "博学的"], ["scholarly", "学术渊博的"], ["lettered", "有文化的"]] },
  { id: crypto.randomUUID(), meaning: "清晰明了", category: "表达", note: "既可形容语言思路，也可形容解释。", words: [["lucid", "清晰易懂"], ["explicit", "明确直白"], ["coherent", "连贯清楚"], ["pellucid", "清澈明晰"]] },
  { id: crypto.randomUUID(), meaning: "挥霍浪费", category: "行为", note: "prodigal 侧重奢侈挥霍，wasteful 泛指浪费。", words: [["prodigal", "挥霍无度"], ["extravagant", "奢侈的"], ["wasteful", "浪费的"], ["spendthrift", "花钱无度"]] },
];
const storedSynonymGroups = JSON.parse(localStorage.getItem("vocabloom-synonym-groups") || "null");
let synonymGroups = Array.isArray(storedSynonymGroups) ? storedSynonymGroups : defaultSynonymGroups;
const learningContent = {
  abate: { roots: [["a-", "向下"], ["bat", "击打"]], note: "像把强度向下压，使风、痛苦或情绪逐渐减弱。", family: [["abatement", "n. 减少"], ["unabated", "adj. 未减弱的"]], example: "The storm finally abated, allowing the rescue team to continue its work.", translation: "暴风雨终于减弱，救援队得以继续工作。" },
  aberrant: { roots: [["ab-", "离开"], ["err", "漫游；犯错"], ["-ant", "形容词后缀"]], note: "偏离正常道路而‘走错’方向，因此表示异常或偏离常规。", family: [["aberration", "n. 反常"], ["err", "v. 犯错"]], example: "The researchers treated the aberrant result as a signal to examine the equipment again.", translation: "研究人员把这个异常结果视为重新检查设备的信号。" },
  abhor: { roots: [["ab-", "远离"], ["hor", "颤抖"]], note: "厌恶到想远离、甚至发抖，记作‘深恶痛绝’。", family: [["abhorrence", "n. 憎恶"], ["abhorrent", "adj. 可憎的"]], example: "She abhorred any policy that denied people equal opportunities.", translation: "她憎恶任何剥夺人们平等机会的政策。" },
  abstruse: { roots: [["abs-", "离开；隐藏"], ["trud/trus", "推"]], note: "被推到视线之外、藏得很深，引申为深奥难懂。", family: [["abstruseness", "n. 深奥"], ["intrude", "v. 闯入"]], example: "The professor made an abstruse theory accessible through vivid examples.", translation: "教授通过生动的例子让一个深奥理论变得易懂。" },
  ambiguous: { roots: [["ambi-", "两边"], ["ag", "驱动"], ["-ous", "形容词后缀"]], note: "意思被推向两个方向，因此可以有不止一种解释。", family: [["ambiguity", "n. 歧义"], ["ambiguously", "adv. 含糊地"]], example: "The contract was deliberately ambiguous about who would bear the extra cost.", translation: "合同故意没有明确说明谁来承担额外费用。" },
  anomalous: { roots: [["an-", "不"], ["homal", "相同；规则"], ["-ous", "形容词后缀"]], note: "与通常规则不相同，强调反常或难以归类。", family: [["anomaly", "n. 异常"], ["anomalously", "adv. 反常地"]], example: "One anomalous reading prompted the scientists to repeat the experiment.", translation: "一个反常的读数促使科学家重复实验。" },
  assuage: { roots: [["ad-", "朝向"], ["suav", "甜美；柔和"]], note: "使感受变得柔和，常用于缓解恐惧、内疚、疼痛或饥饿。", family: [["suave", "adj. 温和圆滑的"], ["assuagement", "n. 缓和"]], example: "The new evidence did little to assuage the public's concern.", translation: "新证据几乎没有缓解公众的担忧。" },
  equivocal: { roots: [["equi-", "相等"], ["voc", "声音"], ["-al", "形容词后缀"]], note: "两种声音分量相等，让人无法确定说话者的真实立场。", family: [["equivocate", "v. 含糊其辞"], ["equivocation", "n. 模棱两可"]], example: "The senator gave an equivocal answer when asked about the proposal.", translation: "当被问及该提案时，参议员给出了含糊其辞的回答。" },
  erudite: { roots: [["e-/ex-", "从……出来"], ["rud", "粗野；无知"], ["-ite", "形容词后缀"]], note: "从无知状态中走出来，表示通过学习而变得博学。", family: [["erudition", "n. 博学"], ["rudiment", "n. 基础"]], example: "Her erudite commentary connected the poem with several ancient traditions.", translation: "她博学的评论把这首诗与数种古老传统联系起来。" },
  laconic: { roots: [["Lacon", "拉科尼亚人"], ["-ic", "……的"]], note: "古代斯巴达人以少言著称，因此 laconic 表示言简意赅。", family: [["laconism", "n. 简短表达"], ["laconically", "adv. 简洁地"]], example: "His laconic reply—'Perhaps'—revealed almost nothing.", translation: "他简短地回答‘也许’，几乎没有透露任何信息。" },
  lucid: { roots: [["luc", "光"], ["-id", "形容词后缀"]], note: "像光一样照亮思路，因此表示表达或思维清晰易懂。", family: [["lucidity", "n. 清晰"], ["elucidate", "v. 阐明"]], example: "The report offers a lucid explanation of a complicated economic problem.", translation: "这份报告对一个复杂的经济问题作出了清晰解释。" },
  obscure: { roots: [["ob-", "在……前面"], ["scur", "覆盖；隐藏"]], note: "被遮挡在前而看不清，可表示晦涩、不明确或不著名。", family: [["obscurity", "n. 晦涩；默默无闻"], ["obscurely", "adv. 含糊地"]], example: "Technical jargon can obscure an otherwise simple argument.", translation: "专业术语可能会让原本简单的论点变得晦涩。" },
  prodigal: { roots: [["pro-", "向前"], ["ag", "驱动"], ["-al", "形容词后缀"]], note: "不断把财物向外推出去，联想到挥霍无度。", family: [["prodigality", "n. 挥霍"], ["prodigally", "adv. 浪费地"]], example: "The prodigal heir exhausted his fortune within a few years.", translation: "这位挥霍的继承人在几年内就耗尽了财产。" },
  succinct: { roots: [["sub-", "在下"], ["cing/cinct", "束紧"]], note: "把内容紧紧束在一起，表示简洁而信息完整。", family: [["succinctness", "n. 简洁"], ["cincture", "n. 腰带"]], example: "Please give a succinct summary rather than repeating every detail.", translation: "请作简明概述，不要重复每一个细节。" }
};
const views = { learn: document.querySelector("#learnView"), vocabulary: document.querySelector("#vocabularyView"), synonyms: document.querySelector("#synonymsView"), cards: document.querySelector("#cardsView"), mistakes: document.querySelector("#mistakesView") };
const toast = document.querySelector("#toast");
const DAILY_GOAL = 200;
const orderedVocabulary = [...vocabulary].sort((a, b) => a.word.localeCompare(b.word));
const todayKey = new Date().toISOString().slice(0, 10);
const savedProgress = JSON.parse(localStorage.getItem("vocabloom-progress") || "null");
const progress = savedProgress?.date === todayKey ? savedProgress : { date: todayKey, index: 0, learned: 0, reviewed: [], bookmarks: [] };
const savedMistakes = JSON.parse(localStorage.getItem("vocabloom-mistakes") || "null");
if (Array.isArray(savedMistakes)) mistakes = savedMistakes;
function saveProgress() { localStorage.setItem("vocabloom-progress", JSON.stringify(progress)); localStorage.setItem("vocabloom-mistakes", JSON.stringify(mistakes)); }
function currentWord() { return orderedVocabulary[progress.index % orderedVocabulary.length]; }
function wordGroup(item) { return synonymGroups.find((group) => group.words.some(([word]) => word === item.word)) || synonymGroups.find((group) => group.meaning.includes(item.group)); }
function renderStudy() {
  const item = currentWord(); const index = orderedVocabulary.indexOf(item); const group = wordGroup(item); const percent = Math.min(100, Math.round(progress.learned / DAILY_GOAL * 100));
  document.querySelector("#studySequence").textContent = `GRE 核心 · NO. ${String(index + 1).padStart(4, "0")} · A–Z`;
  document.querySelector("#studyWord").textContent = item.word; document.querySelector("#studyPhonetic").textContent = item.phonetic; document.querySelector("#studyMeaning").textContent = item.meaning;
  document.querySelector("#studyOrderHint").textContent = `按字母顺序学习 · ${item.word[0].toUpperCase()}`;
  document.querySelector("#studySynonyms").innerHTML = group ? group.words.slice(0, 3).map(([word, meaning]) => `<div class="${word === item.word ? "highlight" : ""}"><b>${word}</b><span>${meaning}</span></div>`).join("<i></i>") : `<div class="highlight"><b>${item.word}</b><span>${item.group}</span></div>`;
  document.querySelector("#studyTip").textContent = group?.note || `把 ${item.word} 与“${item.meaning}”一起朗读。`;
  const content = learningContent[item.word];
  document.querySelector("#studyRootFormula").innerHTML = content.roots.map(([root, meaning]) => `<b>${root}</b><span>${meaning}</span>`).join("<strong>+</strong>");
  document.querySelector("#studyRootNote").textContent = content.note;
  document.querySelector("#studyFamily").innerHTML = `<span>同根词</span>${content.family.map(([word, meaning]) => `<button>${word} <small>${meaning}</small></button>`).join("")}`;
  document.querySelector("#studyExample").innerHTML = content.example.replace(new RegExp(`(${item.word})`, "i"), "<mark>$1</mark>");
  document.querySelector("#studyTranslation").textContent = content.translation;
  document.querySelector("#studyTranslation").classList.remove("revealed");
  document.querySelector("#dailyPercent").textContent = `${percent}%`; document.querySelector("#dailyProgress").setAttribute("aria-label", `今日进度 ${percent}%`); document.querySelector("#dailyProgressRing").style.background = `radial-gradient(circle,#fffdf2 59%,transparent 61%),conic-gradient(var(--green-dark) ${percent}%,#e4e8dc 0)`;
  document.querySelector("#todayLearned").textContent = progress.learned; document.querySelector("#dailyMessage").textContent = progress.learned >= DAILY_GOAL ? "今日 200 词目标已完成，做得漂亮！" : `今日还剩 ${DAILY_GOAL - progress.learned} 个单词，按字母顺序继续学习。`;
  document.querySelector("#totalLearned").textContent = progress.reviewed.length; document.querySelector("#learnedMeter").style.width = `${Math.min(100, progress.reviewed.length / WORD_TOTAL * 100)}%`; document.querySelector("#weekLearned").textContent = progress.learned;
  document.querySelector("#bookmarkButton").classList.toggle("active", progress.bookmarks.includes(item.word)); document.querySelector("#cardSequence").textContent = `GRE CORE · ${String(index + 1).padStart(4, "0")} · A–Z`; document.querySelector("#cardWord").textContent = item.word; document.querySelector("#cardPhonetic").textContent = item.phonetic; document.querySelector("#cardMeaning").textContent = item.meaning; document.querySelector("#cardGroup").textContent = `同义词组：${item.group}`; document.querySelector("#cardSessionCount").textContent = `今日 ${progress.learned} / ${DAILY_GOAL}`;
}
function recordAnswer(remembered) {
  const item = currentWord(); if (!progress.reviewed.includes(item.word)) progress.reviewed.push(item.word); if (progress.learned < DAILY_GOAL) progress.learned += 1;
  if (!remembered) { const mistake = mistakes.find((entry) => entry.word === item.word); if (mistake) { mistake.errors += 1; mistake.last = "今天"; } else mistakes.unshift({ word: item.word, phonetic: item.phonetic, meaning: item.meaning, errors: 1, last: "今天" }); }
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
  document.querySelector("#wordLibraryList").innerHTML = filtered.slice(wordPage * pageSize, (wordPage + 1) * pageSize).map((item) => { const status = progress.reviewed.includes(item.word) ? "已学习" : mistakes.some((entry) => entry.word === item.word) ? "待复习" : "未学习"; return `
    <div class="library-row"><div class="library-word"><button class="word-sound" data-speak="${item.word}">⌁</button><div><b>${item.word}</b><span>${item.phonetic} · ${item.meaning}</span></div></div><button class="group-link" data-group="${item.group}">${item.group}词组 →</button><span class="status-pill ${status === "已学习" ? "learned" : status === "待复习" ? "review" : ""}">${status}</span></div>
  `; }).join("") || `<div class="empty-state">没有找到匹配的词汇</div>`;
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

renderMistakes();
renderVocabulary();
renderSynonymCategories();
renderSynonyms();
renderStudy();
