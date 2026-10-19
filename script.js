const nav = document.getElementById("nav");
const menuToggle = document.getElementById("menu-toggle");

window.addEventListener("scroll", () => {
    nav.classList.toggle("scrolled", window.scrollY > 10);
});

menuToggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", open);
});

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

document.getElementById("year").textContent = new Date().getFullYear();
const themeToggle = document.getElementById("theme-toggle");

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
    themeToggle.setAttribute("aria-label", theme === "dark" ? "Kalo në modalitetin e ditës" : "Kalo në modalitetin e natës");
    document.getElementById("app-theme").textContent = theme === "dark" ? "☀️  Modaliteti i ditës" : "🌙  Modaliteti i natës";
}

applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");

themeToggle.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    try {
        localStorage.setItem("theme", next);
    } catch {}
});
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
    let saved = null;
    try {
        saved = localStorage.getItem("theme");
    } catch {}
    if (!saved) applyTheme(e.matches ? "dark" : "light");
});

function formatNumber(value, decimals) {
    if (decimals) return value.toFixed(decimals);
    if (value >= 1000000) return (value / 1000000).toFixed(value % 1000000 ? 1 : 0) + "M+";
    if (value >= 1000) return Math.round(value / 1000) + "K+";
    return String(Math.round(value));
}

function animateCount(el) {
    const target = Number(el.dataset.count);
    const decimals = Number(el.dataset.decimals || 0);
    const duration = 1400;
    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = formatNumber(target * eased, decimals);
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}
const revealEls = document.querySelectorAll(".feature, .testimonial, .stat, .cta-inner");
revealEls.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("visible");
                const counter = entry.target.querySelector("[data-count]");
                if (counter) animateCount(counter);
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.2 }
    );
    revealEls.forEach((el) => observer.observe(el));
} else {
    revealEls.forEach((el) => el.classList.add("visible"));
    document.querySelectorAll("[data-count]").forEach(animateCount);
}

// =====================================================================
// Aplikacioni i detyrave
// =====================================================================
const byId = (id) => document.getElementById(id);
const modal = byId("app-modal");
const infoModal = byId("info-modal");
const authModal = byId("auth-modal");
const appEl = byId("app");
const appSidebar = byId("app-sidebar");
const quickInput = byId("quick-input");
const quickDate = byId("quick-date");
const quickTime = byId("quick-time");
const quickPriority = byId("quick-priority");
const searchInput = byId("search");
const newListForm = byId("new-list-form");
const newListInput = byId("new-list-input");

const ACCOUNTS_KEY = "rregull-accounts";
const SESSION_KEY = "rregull-session";
const LEGACY_DATA_KEY = "rregull-data";
const OLD_STORAGE_KEY = "todos";
const dataKey = (accountId) => `rregull-data-${accountId}`;

const LIST_COLORS = ["#4772fa", "#22c55e", "#f59e0b", "#e64980", "#8b5cf6", "#15aabf", "#ff6b6b"];
const ACCENTS = ["", "#7c5cff", "#16a34a", "#f97316", "#e64980"];
const SMART_VIEWS = [
    { id: "today", name: "Sot", icon: "☀️" },
    { id: "tomorrow", name: "Nesër", icon: "📅" },
    { id: "week", name: "7 ditët e ardhshme", icon: "🗓️" },
    { id: "inbox", name: "Inbox", icon: "📥" },
    { id: "all", name: "Të gjitha", icon: "📋" },
    { id: "completed", name: "Të përfunduara", icon: "✅" },
];
const TOOL_VIEWS = [
    { id: "calendar", name: "Kalendari", icon: "📆" },
    { id: "focus", name: "Fokus", icon: "🍅" },
    { id: "habits", name: "Zakonet", icon: "🔥" },
];
const PLANS = {
    free: {
        name: "Falas",
        price: "0 €",
        period: "përgjithmonë",
        features: ["✅ Detyra pa kufi", "📋 Deri në 5 lista", "🔥 Deri në 5 zakone", "📆 Kalendar dhe 🍅 Fokus"],
    },
    pro: {
        name: "Pro",
        price: "2,99 €",
        period: "/ muaj",
        badge: "Më i zgjedhuri",
        features: ["✨ Gjithçka te Falas", "♾️ Lista dhe zakone pa kufi", "🎨 Ngjyra të personalizuara", "⭐ Simboli Pro"],
    },
    year: {
        name: "Pro Vjetor",
        price: "24,99 €",
        period: "/ vit",
        features: ["✨ Gjithçka te Pro", "💸 Kurse 30%", "🎁 Të gjitha veçoritë e reja", "⭐ Simboli Pro"],
    },
};
const FREE_LIMITS = { lists: 5, habits: 5 };
const LEVEL_NAMES = ["Fillestar 🌱", "Në rrugë 🚶", "I organizuar 📋", "Produktiv ⚡", "Mjeshtër 🧠", "Legjendë 🏆"];
const PRAISE = ["Bravo! 🎉", "Shkëlqyeshëm! ⭐", "Vazhdo kështu! 💪", "Një më pak! ✅", "Je në formë! 🚀", "Punë e mirë! 👏", "Fantastike! 🌟"];
const EMPTY_MESSAGES = [
    ["🎉", "Asnjë detyrë këtu. Shijoje ditën!"],
    ["🌴", "Gjithçka e qetë. Koha për një kafe?"],
    ["🧘", "Mendje e lirë, listë e pastër."],
    ["🚀", "Gati për diçka të re? Shto një detyrë!"],
];
const FOCUS_MODES = {
    focus: { label: "Fokus", minutes: 25 },
    short: { label: "Pushim", minutes: 5 },
    long: { label: "Pushim i gjatë", minutes: 15 },
};
const XP = { task: 10, focus: 20, habit: 5 };
const DAY_LETTERS = ["D", "H", "M", "M", "E", "P", "S"]; // getDay(): 0 = e diel
const WEEKDAYS = ["Hën", "Mar", "Mër", "Enj", "Pre", "Sht", "Die"];
// Jo të gjithë shfletuesit i kanë emrat shqip të muajve, ndaj i mbajmë vetë
const MONTHS = ["janar", "shkurt", "mars", "prill", "maj", "qershor", "korrik", "gusht", "shtator", "tetor", "nëntor", "dhjetor"];
const MONTHS_SHORT = ["jan", "shk", "mar", "pri", "maj", "qer", "korr", "gush", "sht", "tet", "nën", "dhj"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const BASE_TITLE = document.title;

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
}

const pick = (items) => items[Math.floor(Math.random() * items.length)];
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

// ---------- Datat (ruhen si "YYYY-MM-DD") ----------
const pad = (n) => String(n).padStart(2, "0");
const dateStr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const todayStr = () => dateStr(new Date());

function parseDate(s) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function addDays(s, n) {
    const d = parseDate(s);
    d.setDate(d.getDate() + n);
    return dateStr(d);
}

function formatDue(due) {
    const today = todayStr();
    if (due === today) return "Sot";
    if (due === addDays(today, 1)) return "Nesër";
    if (due === addDays(today, -1)) return "Dje";
    const d = parseDate(due);
    const year = d.getFullYear() !== new Date().getFullYear() ? ` ${d.getFullYear()}` : "";
    return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}${year}`;
}

// ---------- Llogaritë (ruhen vetëm në këtë shfletues) ----------
function readJson(key, fallback) {
    try {
        return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
        return fallback;
    }
}

function writeJson(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {}
}

let accounts = readJson(ACCOUNTS_KEY, []);
let account = accounts.find((a) => a.id === readJson(SESSION_KEY, null)) || null;

const saveAccounts = () => writeJson(ACCOUNTS_KEY, accounts);
const isPro = () => !!account && account.plan !== "free";
const firstName = () => (account ? account.name.split(" ")[0] : "");

async function hashPassword(password, salt) {
    const text = `${salt}:${password}`;
    if (window.crypto?.subtle) {
        const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
        return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    // Rezervë për shfletuesit pa crypto.subtle
    let h = 2166136261;
    for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
    return "f" + (h >>> 0).toString(16);
}

// ---------- Të dhënat e përdoruesit ----------
function makeTask(fields) {
    return {
        id: uid(),
        title: "",
        notes: "",
        done: false,
        doneAt: null,
        priority: 0,
        due: "",
        time: "",
        listId: "inbox",
        tags: [],
        subtasks: [],
        createdAt: Date.now(),
        ...fields,
    };
}

function createStarterData(withLegacy) {
    const today = todayStr();
    const fresh = {
        lists: [
            { id: "puna", name: "Puna", color: LIST_COLORS[0] },
            { id: "shtepia", name: "Shtëpia", color: LIST_COLORS[1] },
            { id: "studimet", name: "Studimet", color: LIST_COLORS[2] },
        ],
        tasks: [],
    };

    // Merr detyrat nga versioni i parë i aplikacionit
    const old = withLegacy ? readJson(OLD_STORAGE_KEY, []) : [];
    for (const t of old) {
        fresh.tasks.push(makeTask({ title: t.text, done: t.completed, doneAt: t.completed ? Date.now() : null }));
    }

    if (!fresh.tasks.length) {
        fresh.tasks.push(
            makeTask({ title: "Mirë se erdhe! Kliko mbi një detyrë për të parë detajet", due: today, priority: 3 }),
            makeTask({ title: "Kryej një detyrë për të fituar XP 🎉", due: today, priority: 2 }),
            makeTask({
                title: "Shto përshkrim dhe nëndetyra në panelin djathtas",
                due: today,
                priority: 1,
                subtasks: [
                    { id: uid(), title: "Provo ta shënosh këtë nëndetyrë", done: false },
                    { id: uid(), title: "Ose shto një të re më poshtë", done: false },
                ],
            }),
            makeTask({ title: "Lexo 20 faqe", due: today, listId: "studimet", tags: ["lexim"] }),
            makeTask({ title: "Provo kronometrin 🍅 te Fokus", due: addDays(today, 1) }),
            makeTask({ title: "Përfundo prezantimin", due: addDays(today, 3), time: "10:00", listId: "puna", priority: 2, tags: ["puna"] }),
            makeTask({ title: "Bli ushqime", listId: "shtepia", tags: ["blerje"] })
        );
    }
    return fresh;
}

function defaultHabits() {
    return [
        { id: uid(), name: "Pi 8 gota ujë", icon: "💧", checks: {} },
        { id: uid(), name: "Lexo 20 faqe", icon: "📖", checks: {} },
        { id: uid(), name: "Vrapo", icon: "🏃", checks: {} },
    ];
}

function loadData(acc) {
    const saved = acc ? readJson(dataKey(acc.id), null) : null;
    const result = saved && Array.isArray(saved.tasks) ? saved : createStarterData(!!acc);
    // Fushat që u shtuan më vonë
    result.lists ??= [];
    result.habits ??= defaultHabits();
    result.focusLog ??= [];
    result.settings = { sound: true, accent: "", ...result.settings };
    for (const t of result.tasks) {
        t.tags ??= [];
        t.time ??= "";
        t.subtasks ??= [];
        if (t.reminded === undefined) settleReminder(t);
    }
    return result;
}

function saveData() {
    if (account) writeJson(dataKey(account.id), data);
}

let data = loadData(account);
let view = "today";
let selectedId = null;
let query = "";
let justAddedId = null;
let calMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
const collapsed = new Set();

// ---------- Statistikat dhe XP ----------
function streakFrom(days) {
    let day = todayStr();
    if (!days.has(day)) day = addDays(day, -1);
    let count = 0;
    while (days.has(day)) {
        count++;
        day = addDays(day, -1);
    }
    return count;
}

const doneDays = () => new Set(data.tasks.filter((t) => t.done && t.doneAt).map((t) => dateStr(new Date(t.doneAt))));
const habitCheckCount = () => data.habits.reduce((sum, h) => sum + Object.keys(h.checks).length, 0);
const focusMinutes = (day) => data.focusLog.filter((f) => !day || f.date === day).reduce((sum, f) => sum + f.minutes, 0);
const totalXp = () =>
    data.tasks.filter((t) => t.done).length * XP.task + data.focusLog.length * XP.focus + habitCheckCount() * XP.habit;
const levelOf = (xp) => Math.floor(xp / 100) + 1;
const levelName = (level) => LEVEL_NAMES[Math.min(level - 1, LEVEL_NAMES.length - 1)];
let lastLevel = levelOf(totalXp());

// ---------- Argëtimi: njoftime, konfeta, tinguj ----------
function toast(message, { action, onAction, duration = 3200 } = {}) {
    const box = el("div", "toast");
    box.appendChild(el("span", "", message));
    const remove = () => {
        box.classList.add("leaving");
        setTimeout(() => box.remove(), 200);
    };
    if (action) {
        const btn = el("button", "toast-btn", action);
        btn.type = "button";
        btn.addEventListener("click", () => {
            onAction();
            remove();
        });
        box.appendChild(btn);
    }
    byId("toasts").appendChild(box);
    setTimeout(remove, duration);
}

function confetti(x, y, count = 24, power = 1) {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    for (let i = 0; i < count; i++) {
        const piece = el("span", "confetti");
        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
        piece.style.background = pick(LIST_COLORS);
        if (Math.random() < 0.3) piece.style.borderRadius = "50%";
        document.body.appendChild(piece);
        const angle = Math.random() * Math.PI * 2;
        const speed = (50 + Math.random() * 110) * power;
        const dx = Math.cos(angle) * speed;
        const dy = Math.sin(angle) * speed - 70 * power;
        const spin = Math.random() * 720 - 360;
        piece.animate(
            [
                { transform: "translate(0, 0) rotate(0deg)", opacity: 1 },
                { transform: `translate(${dx}px, ${dy}px) rotate(${spin / 2}deg)`, opacity: 1, offset: 0.4 },
                { transform: `translate(${dx * 1.3}px, ${dy + 260 * power}px) rotate(${spin}deg)`, opacity: 0 },
            ],
            { duration: 1000 + Math.random() * 700, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)" }
        ).onfinish = () => piece.remove();
    }
}

const bigConfetti = () => confetti(innerWidth / 2, innerHeight / 3, 140, 2.3);

let audioCtx = null;
const SOUND_DONE = [[880, 0.12], [1320, 0.22]];
const SOUND_LEVEL = [[523, 0.13], [659, 0.13], [784, 0.13], [1047, 0.35]];
const SOUND_ALARM = [[880, 0.2], [660, 0.2], [880, 0.2], [660, 0.2], [988, 0.45]];

function beep(notes) {
    if (!data.settings.sound) return;
    try {
        audioCtx ??= new (window.AudioContext || window.webkitAudioContext)();
        let t = audioCtx.currentTime;
        for (const [freq, length] of notes) {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            osc.type = "sine";
            osc.frequency.value = freq;
            gain.gain.setValueAtTime(0.0001, t);
            gain.gain.exponentialRampToValueAtTime(0.18, t + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, t + length);
            osc.connect(gain).connect(audioCtx.destination);
            osc.start(t);
            osc.stop(t + length + 0.02);
            t += length * 0.85;
        }
    } catch {}
}

function notify(title, body) {
    try {
        if ("Notification" in window && Notification.permission === "granted") new Notification(title, { body });
    } catch {}
}

function askNotificationPermission() {
    try {
        if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
    } catch {}
}

function applyAccent(color) {
    const style = document.documentElement.style;
    if (!color) {
        ["--primary", "--primary-hover", "--primary-soft", "--primary-soft-hover"].forEach((p) => style.removeProperty(p));
        return;
    }
    style.setProperty("--primary", color);
    style.setProperty("--primary-hover", `color-mix(in srgb, ${color} 85%, black)`);
    style.setProperty("--primary-soft", `color-mix(in srgb, ${color} 15%, transparent)`);
    style.setProperty("--primary-soft-hover", `color-mix(in srgb, ${color} 24%, transparent)`);
}

function upgradePrompt(message) {
    toast(`🔒 ${message}`, { action: "Kalo në Pro", onAction: () => openPlans(false), duration: 6000 });
}

// ---------- Kujtesat ----------
function reminderTime(task) {
    if (!task.due || !task.time) return null;
    const [h, m] = task.time.split(":").map(Number);
    return parseDate(task.due).getTime() + (h * 60 + m) * 60000;
}

// Kujtesat që kanë kaluar tashmë nuk tingëllojnë
function settleReminder(task) {
    const at = reminderTime(task);
    task.reminded = !at || at <= Date.now();
}

function checkReminders() {
    if (!account) return;
    const now = Date.now();
    for (const task of data.tasks) {
        if (task.done || task.reminded) continue;
        const at = reminderTime(task);
        if (!at || at > now) continue;
        task.reminded = true;
        saveData();
        beep(SOUND_ALARM);
        notify("⏰ Kujtesë nga Taskify", task.title);
        toast(`⏰ Kujtesë: ${task.title}`, {
            action: "Shiko",
            duration: 10000,
            onAction: () => {
                openApp();
                selectTask(task.id);
            },
        });
    }
}

// ---------- Filtrat ----------
const listById = (id) => data.lists.find((l) => l.id === id);
const listName = (id) => listById(id)?.name ?? "Inbox";
const currentTask = () => data.tasks.find((t) => t.id === selectedId);
const isToolView = (v) => TOOL_VIEWS.some((tool) => tool.id === v);
const isListView = () => !query && (view === "inbox" || !!listById(view));
const defaultListId = () => (!query && listById(view) ? view : "inbox");

function viewName(v) {
    if (v.startsWith("tag:")) return `#${v.slice(4)}`;
    return [...SMART_VIEWS, ...TOOL_VIEWS].find((s) => s.id === v)?.name ?? listName(v);
}

function filterView(v) {
    const today = todayStr();
    const weekEnd = addDays(today, 6);
    const tasks = data.tasks;
    if (v.startsWith("tag:")) return tasks.filter((t) => t.tags.includes(v.slice(4)));
    switch (v) {
        case "today":
            return tasks.filter((t) => t.due && (t.done ? t.due === today : t.due <= today));
        case "tomorrow":
            return tasks.filter((t) => t.due === addDays(today, 1));
        case "week":
            return tasks.filter((t) => t.due && (t.done ? t.due >= today && t.due <= weekEnd : t.due <= weekEnd));
        case "all":
            return tasks;
        case "completed":
            return tasks.filter((t) => t.done);
        default:
            return tasks.filter((t) => t.listId === v);
    }
}

function visibleTasks() {
    if (!query) return filterView(view);
    const q = query.toLowerCase();
    return data.tasks.filter((t) =>
        [t.title, t.notes, ...t.tags, ...t.subtasks.map((s) => s.title)].join(" ").toLowerCase().includes(q)
    );
}

const countOpen = (v) => filterView(v).filter((t) => !t.done).length;
const sortOpen = (list) =>
    list.sort(
        (a, b) =>
            b.priority - a.priority ||
            (a.due || "9999").localeCompare(b.due || "9999") ||
            (a.time || "99").localeCompare(b.time || "99") ||
            a.createdAt - b.createdAt
    );
const sortDone = (list) => list.sort((a, b) => (b.doneAt || 0) - (a.doneAt || 0));

function allTags() {
    const counts = new Map();
    for (const t of data.tasks) {
        for (const tag of t.tags) counts.set(tag, (counts.get(tag) || 0) + (t.done ? 0 : 1));
    }
    return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0]));
}

function groupTasks(tasks) {
    if (view === "completed" && !query) return [{ name: "Të përfunduara", tasks: sortDone(tasks) }];

    const today = todayStr();
    const tomorrow = addDays(today, 1);
    const weekEnd = addDays(today, 6);
    const groups = {
        "Të vonuara": [],
        "Sot": [],
        "Nesër": [],
        "7 ditët e ardhshme": [],
        "Më vonë": [],
        "Pa datë": [],
        "Të përfunduara": [],
    };
    for (const t of tasks) {
        if (t.done) groups["Të përfunduara"].push(t);
        else if (!t.due) groups["Pa datë"].push(t);
        else if (t.due < today) groups["Të vonuara"].push(t);
        else if (t.due === today) groups["Sot"].push(t);
        else if (t.due === tomorrow) groups["Nesër"].push(t);
        else if (t.due <= weekEnd) groups["7 ditët e ardhshme"].push(t);
        else groups["Më vonë"].push(t);
    }
    return Object.entries(groups)
        .filter(([, list]) => list.length)
        .map(([name, list]) => ({ name, tasks: name === "Të përfunduara" ? sortDone(list) : sortOpen(list) }));
}

const normalizeTag = (s) => s.trim().replace(/^#+/, "").toLowerCase().replace(/\s+/g, "-");

// Kupton "sot", "nesër", "14:30", "!3" dhe "#etiketë" brenda tekstit
function parseQuickAdd(text) {
    const today = todayStr();
    const result = { title: "", due: "", time: "", priority: null, tags: [] };
    const kept = [];
    for (const word of text.trim().split(/\s+/)) {
        const lower = word.toLowerCase();
        const time = word.match(/^(\d{1,2}):(\d{2})$/);
        if (lower === "sot") result.due = today;
        else if (lower === "nesër" || lower === "neser") result.due = addDays(today, 1);
        else if (time && Number(time[1]) < 24 && Number(time[2]) < 60) result.time = `${pad(Number(time[1]))}:${time[2]}`;
        else if (/^![0-3]$/.test(word)) result.priority = Number(word[1]);
        else if (/^#[\p{L}\p{N}_-]+$/u.test(word)) result.tags.push(normalizeTag(word));
        else kept.push(word);
    }
    result.title = kept.join(" ") || text.trim();
    return result;
}

// ---------- Veprimet ----------
function setView(id) {
    view = id;
    query = "";
    searchInput.value = "";
    const today = todayStr();
    quickDate.value = id === "today" || id === "week" ? today : id === "tomorrow" ? addDays(today, 1) : "";
    quickTime.value = "";
    appSidebar.classList.remove("open");
    render();
}

function selectTask(id) {
    selectedId = id;
    renderMain();
    renderDetail();
}

function toggleDone(task, done, sourceEl) {
    task.done = done;
    task.doneAt = done ? Date.now() : null;
    saveData();
    if (done) celebrateTask(task, sourceEl);
    render();
    renderLanding();
}

function celebrateTask(task, sourceEl) {
    const rect = sourceEl?.getBoundingClientRect();
    if (rect) confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 26);
    beep(SOUND_DONE);
    const today = todayStr();
    const dueToday = task.due && task.due <= today;
    if (dueToday && countOpen("today") === 0) {
        setTimeout(bigConfetti, 150);
        toast("🏆 Të gjitha detyrat e sotme u kryen! Dita jote është fitore.", { duration: 5000 });
    } else {
        toast(`${pick(PRAISE)} +${XP.task} XP`);
    }
}

function deleteTask(task) {
    const index = data.tasks.indexOf(task);
    if (index < 0) return;
    data.tasks.splice(index, 1);
    if (selectedId === task.id) selectedId = null;
    saveData();
    render();
    toast(`🗑 "${task.title}" u fshi`, {
        action: "Zhbëj",
        duration: 6000,
        onAction: () => {
            data.tasks.splice(index, 0, task);
            saveData();
            render();
        },
    });
}

function deleteList(list) {
    if (!confirm(`Ta fshish listën "${list.name}"? Detyrat e saj do të kalojnë në Inbox.`)) return;
    data.tasks.forEach((t) => {
        if (t.listId === list.id) t.listId = "inbox";
    });
    data.lists = data.lists.filter((l) => l !== list);
    saveData();
    if (view === list.id) setView("inbox");
    else render();
}

function addTask(fields) {
    const task = makeTask(fields);
    if (task.time && !task.due) task.due = todayStr();
    settleReminder(task);
    if (task.time) askNotificationPermission();
    data.tasks.push(task);
    justAddedId = task.id;
    saveData();
    return task;
}

// ---------- Vizatimi ----------
function render() {
    refresh();
    renderDetail();
}

// Gjithçka përveç panelit të detajeve (që mos të prishet shkrimi atje)
function refresh() {
    renderSidebar();
    renderHeader();
    renderMain();
    renderLevel();
}

function navItem(id, name, count, icon, color) {
    const item = el("div", "nav-item" + (view === id && !query ? " active" : ""));
    const iconEl = el("span", "nav-icon", icon);
    if (color) {
        const dot = el("span", "list-dot");
        dot.style.background = color;
        iconEl.appendChild(dot);
    }
    item.append(iconEl, el("span", "nav-name", name));
    item.addEventListener("click", () => setView(id));
    return { item, countEl: el("span", "nav-count", count ? String(count) : "") };
}

function fillNav(container, items) {
    container.innerHTML = "";
    for (const { id, name, count, icon, color, onDelete } of items) {
        const { item, countEl } = navItem(id, name, count, icon, color);
        if (onDelete) {
            const del = el("button", "icon-btn small nav-del", "✕");
            del.type = "button";
            del.title = "Fshi";
            del.addEventListener("click", (e) => {
                e.stopPropagation();
                onDelete();
            });
            item.appendChild(del);
        }
        item.appendChild(countEl);
        container.appendChild(item);
    }
}

function renderSidebar() {
    const today = todayStr();
    fillNav(
        byId("smart-nav"),
        SMART_VIEWS.map((s) => ({ ...s, count: s.id === "completed" ? 0 : countOpen(s.id) }))
    );
    const toolCounts = {
        calendar: 0,
        focus: data.focusLog.filter((f) => f.date === today).length,
        habits: data.habits.filter((h) => !h.checks[today]).length,
    };
    fillNav(
        byId("tool-nav"),
        TOOL_VIEWS.map((tool) => ({ ...tool, count: toolCounts[tool.id] }))
    );
    fillNav(
        byId("list-nav"),
        data.lists.map((list) => ({
            id: list.id,
            name: list.name,
            count: countOpen(list.id),
            color: list.color,
            onDelete: () => deleteList(list),
        }))
    );
    const tags = allTags();
    byId("tag-heading").hidden = !tags.length;
    fillNav(
        byId("tag-nav"),
        tags.map(([tag, count]) => ({ id: `tag:${tag}`, name: tag, count, icon: "#" }))
    );
}

function subtitle() {
    if (query) return "";
    const name = firstName();
    if (view === "today") {
        const hour = new Date().getHours();
        const hello = hour < 12 ? "Mirëmëngjes" : hour < 18 ? "Mirëdita" : "Mirëmbrëma";
        const emoji = hour < 12 ? "☀️" : hour < 18 ? "🌤️" : "🌙";
        const open = countOpen("today");
        const greet = `${hello}${name ? ", " + name : ""} ${emoji}`;
        return open ? `${greet} Ke ${open} ${open === 1 ? "detyrë" : "detyra"} për sot.` : `${greet} S'ke asgjë për sot, shijoje! 🎉`;
    }
    if (view === "calendar") return "Zvarrit detyrat për t'i zhvendosur. Kliko një ditë për të shtuar.";
    if (view === "focus") return `Puno 25 minuta, pusho 5. Çdo seancë sjell +${XP.focus} XP.`;
    if (view === "habits") return "Ndryshimet e vogla çdo ditë sjellin rezultate të mëdha.";
    return "";
}

function renderHeader() {
    byId("app-title").textContent = query ? "Rezultatet e kërkimit" : viewName(view);
    byId("app-subtitle").textContent = subtitle();
    quickInput.placeholder = `+ Shto detyrë në "${listName(defaultListId())}", shtyp Enter për ta ruajtur`;
    byId("quick-add").hidden = view === "completed" && !query;

    const ring = byId("day-ring");
    ring.hidden = !!query || view !== "today";
    if (!ring.hidden) {
        const todays = filterView("today");
        const done = todays.filter((t) => t.done).length;
        byId("day-ring-text").textContent = `${done}/${todays.length}`;
        byId("day-ring-fill").style.strokeDasharray = `${todays.length ? (done / todays.length) * 100 : 0} 100`;
    }
}

function renderMain() {
    const mode = query || !isToolView(view) ? "tasks" : view;
    byId("tasks-view").hidden = mode !== "tasks";
    byId("calendar-view").hidden = mode !== "calendar";
    byId("focus-view").hidden = mode !== "focus";
    byId("habits-view").hidden = mode !== "habits";
    appEl.classList.toggle("no-detail", mode === "focus" || mode === "habits");
    if (mode === "tasks") renderTasks();
    else if (mode === "calendar") renderCalendar();
    else if (mode === "focus") renderFocus();
    else renderHabits();
}

function renderLevel() {
    const xp = totalXp();
    const level = levelOf(xp);
    byId("level-name").textContent = `Niveli ${level} · ${levelName(level)}`;
    byId("level-fill").style.width = `${xp % 100}%`;
    byId("level-xp").textContent = `${xp % 100} / 100 XP · ${xp} gjithsej`;
    byId("streak").textContent = `🔥 ${streakFrom(doneDays())}`;
    if (level > lastLevel) {
        setTimeout(() => {
            bigConfetti();
            beep(SOUND_LEVEL);
            toast(`🎊 Niveli ${level}! Tani je ${levelName(level)}`, { duration: 5000 });
        }, 350);
    }
    lastLevel = level;
}

function taskRow(task) {
    const row = el(
        "div",
        "task" +
            (task.done ? " done" : "") +
            (task.id === selectedId ? " selected" : "") +
            (task.id === justAddedId ? " just-added" : "")
    );

    const check = el("input", `check p${task.priority}`);
    check.type = "checkbox";
    check.checked = task.done;
    check.setAttribute("aria-label", "Shëno si të përfunduar");
    check.addEventListener("click", (e) => e.stopPropagation());
    check.addEventListener("change", () => toggleDone(task, check.checked, check));

    const meta = el("span", "task-meta");
    for (const tag of task.tags.slice(0, 2)) meta.appendChild(el("span", "tag-chip", `#${tag}`));
    if (task.notes.trim()) meta.appendChild(el("span", "", "≡"));
    if (task.subtasks.length) {
        const doneCount = task.subtasks.filter((s) => s.done).length;
        meta.appendChild(el("span", "", `☑ ${doneCount}/${task.subtasks.length}`));
    }
    const list = listById(task.listId);
    if (!isListView() && list) {
        const tag = el("span", "tag");
        const dot = el("span", "list-dot");
        dot.style.background = list.color;
        tag.append(dot, el("span", "", list.name));
        meta.appendChild(tag);
    }
    if (task.due) {
        const today = todayStr();
        const state = task.done ? "" : task.due < today ? " overdue" : task.due === today ? " today" : "";
        const label = formatDue(task.due) + (task.time ? ` ${task.time}` : "");
        meta.appendChild(el("span", "due" + state, (task.time && !task.done ? "⏰ " : "") + label));
    }

    row.append(check, el("span", "task-title", task.title), meta);
    row.addEventListener("click", () => selectTask(task.id));
    return row;
}

function renderTasks() {
    const taskList = byId("task-list");
    const tasks = visibleTasks();
    taskList.innerHTML = "";

    if (!tasks.length) {
        const [emoji, text] = query
            ? ["🔍", "Asnjë detyrë nuk u gjet"]
            : EMPTY_MESSAGES[(view.length + new Date().getDate()) % EMPTY_MESSAGES.length];
        const empty = el("div", "empty-state");
        empty.append(el("div", "big", emoji), el("p", "", text));
        taskList.appendChild(empty);
        return;
    }

    for (const group of groupTasks(tasks)) {
        const section = el("div", "group" + (collapsed.has(group.name) ? " collapsed" : ""));
        const header = el("div", "group-header");
        header.append(
            el("span", "arrow", "▾"),
            el("span", "", group.name),
            el("span", "group-count", String(group.tasks.length))
        );
        header.addEventListener("click", () => {
            if (collapsed.has(group.name)) collapsed.delete(group.name);
            else collapsed.add(group.name);
            renderTasks();
        });
        section.appendChild(header);
        for (const task of group.tasks) section.appendChild(taskRow(task));
        taskList.appendChild(section);
    }
    justAddedId = null;
}

// ---------- Kalendari ----------
function calendarChip(task) {
    const chip = el(
        "div",
        `cal-chip p${task.priority}` + (task.done ? " done" : "") + (task.id === selectedId ? " selected" : ""),
        (task.time ? `${task.time} ` : "") + task.title
    );
    chip.title = task.title;
    chip.draggable = true;
    chip.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", task.id);
        e.dataTransfer.effectAllowed = "move";
    });
    chip.addEventListener("click", (e) => {
        e.stopPropagation();
        selectTask(task.id);
    });
    return chip;
}

function startCalendarAdd(cell, day) {
    if (cell.querySelector(".cal-input")) return;
    const input = el("input", "cal-input");
    input.placeholder = "Detyrë e re…";
    input.maxLength = 200;
    cell.insertBefore(input, cell.children[1] || null);
    input.focus();

    let finished = false;
    const finish = (save) => {
        if (finished) return;
        finished = true;
        const text = input.value.trim();
        if (save && text) {
            const parsed = parseQuickAdd(text);
            addTask({ title: parsed.title, due: parsed.due || day, time: parsed.time, priority: parsed.priority ?? 0, tags: parsed.tags });
            toast(`📆 U shtua për ${formatDue(parsed.due || day)}`);
        }
        render();
    };
    input.addEventListener("click", (e) => e.stopPropagation());
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") finish(true);
        if (e.key === "Escape") {
            e.stopPropagation();
            finish(false);
        }
    });
    input.addEventListener("blur", () => finish(true));
}

function renderCalendar() {
    byId("cal-month").textContent = `${capitalize(MONTHS[calMonth.getMonth()])} ${calMonth.getFullYear()}`;
    const grid = byId("cal-grid");
    grid.innerHTML = "";
    for (const name of WEEKDAYS) grid.appendChild(el("div", "cal-weekday", name));

    const byDay = new Map();
    for (const t of data.tasks) {
        if (!t.due) continue;
        if (!byDay.has(t.due)) byDay.set(t.due, []);
        byDay.get(t.due).push(t);
    }

    const today = todayStr();
    const start = new Date(calMonth);
    start.setDate(1 - ((calMonth.getDay() + 6) % 7));
    for (let i = 0; i < 42; i++) {
        const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        const day = dateStr(d);
        const cell = el(
            "div",
            "cal-cell" + (d.getMonth() !== calMonth.getMonth() ? " other" : "") + (day === today ? " today" : "")
        );
        cell.appendChild(el("div", "cal-date", String(d.getDate())));
        const tasks = byDay.get(day) || [];
        for (const t of [...sortOpen(tasks.filter((x) => !x.done)), ...tasks.filter((x) => x.done)]) {
            cell.appendChild(calendarChip(t));
        }
        cell.addEventListener("click", () => startCalendarAdd(cell, day));
        cell.addEventListener("dragover", (e) => {
            e.preventDefault();
            cell.classList.add("drop");
        });
        cell.addEventListener("dragleave", () => cell.classList.remove("drop"));
        cell.addEventListener("drop", (e) => {
            e.preventDefault();
            cell.classList.remove("drop");
            const task = data.tasks.find((t) => t.id === e.dataTransfer.getData("text/plain"));
            if (!task || task.due === day) return;
            task.due = day;
            settleReminder(task);
            saveData();
            render();
            toast(`📆 "${task.title}" u zhvendos në ${formatDue(day)}`);
        });
        grid.appendChild(cell);
    }
}

// ---------- Fokus (Pomodoro), i përbashkët me faqen kryesore ----------
const timer = { mode: "focus", total: 25 * 60, left: 25 * 60, endAt: 0, interval: null, taskId: "" };
const timerRunning = () => !!timer.interval;
const formatClock = (sec) => `${pad(Math.floor(sec / 60))}:${pad(sec % 60)}`;

function timerStart() {
    if (timer.interval) return;
    if (timer.left === 0) timer.left = timer.total;
    timer.endAt = Date.now() + timer.left * 1000;
    timer.interval = setInterval(timerTick, 250);
    renderTimer();
}

function timerPause() {
    clearInterval(timer.interval);
    timer.interval = null;
    renderTimer();
}

const timerToggle = () => (timerRunning() ? timerPause() : timerStart());

function timerReset() {
    timerPause();
    timer.left = timer.total;
    renderTimer();
}

function setTimerMode(mode) {
    timerPause();
    timer.mode = mode;
    timer.total = FOCUS_MODES[mode].minutes * 60;
    timer.left = timer.total;
    if (!byId("focus-view").hidden) renderFocus();
    renderTimer();
}

function timerTick() {
    timer.left = Math.max(0, Math.round((timer.endAt - Date.now()) / 1000));
    renderTimer();
    if (timer.left === 0) timerFinish();
}

function timerFinish() {
    timerPause();
    beep(SOUND_ALARM);
    if (timer.mode === "focus") {
        data.focusLog.push({ date: todayStr(), minutes: timer.total / 60, taskId: timer.taskId });
        saveData();
        bigConfetti();
        toast(`🍅 Seanca përfundoi! +${XP.focus} XP. Koha për pushim.`, { duration: 6000 });
        notify("🍅 Seanca përfundoi!", "Bëj një pushim të shkurtër.");
        const sessionsToday = data.focusLog.filter((f) => f.date === todayStr()).length;
        setTimerMode(sessionsToday % 4 === 0 ? "long" : "short");
    } else {
        toast("💪 Pushimi mbaroi! Gati për seancën tjetër?", { duration: 6000 });
        notify("💪 Pushimi mbaroi!", "Gati për seancën tjetër?");
        setTimerMode("focus");
    }
    if (!modal.hidden) refresh();
    renderLanding();
}

function renderTimer() {
    const text = formatClock(timer.left);
    const running = timerRunning();
    byId("focus-time").textContent = text;
    byId("focus-start").textContent = running ? "Pauzë" : timer.left < timer.total ? "Vazhdo" : "Fillo";
    byId("focus-ring-fill").style.strokeDasharray = `${(1 - timer.left / timer.total) * 100} 100`;
    byId("focus-view").classList.toggle("running", running);
    byId("pomo-time").textContent = text;
    byId("pomo-start").textContent = running ? "Pauzë" : timer.left < timer.total ? "Vazhdo" : "Fillo";
    document.title = running ? `${text} · ${FOCUS_MODES[timer.mode].label}` : BASE_TITLE;
}

function renderFocus() {
    document.querySelectorAll(".mode-tab").forEach((b) => b.classList.toggle("active", b.dataset.mode === timer.mode));

    const select = byId("focus-task");
    select.innerHTML = "";
    select.appendChild(new Option("🎯 Zgjidh një detyrë (opsionale)", ""));
    for (const t of sortOpen(data.tasks.filter((x) => !x.done))) select.appendChild(new Option(t.title, t.id));
    if (!data.tasks.some((t) => t.id === timer.taskId && !t.done)) timer.taskId = "";
    select.value = timer.taskId;

    const today = todayStr();
    const sessions = data.focusLog.filter((f) => f.date === today).length;
    const tomatoes = byId("tomatoes");
    tomatoes.innerHTML = "";
    if (sessions) tomatoes.textContent = "🍅".repeat(Math.min(sessions, 12)) + (sessions > 12 ? ` +${sessions - 12}` : "");
    else tomatoes.appendChild(el("small", "", "Ende asnjë seancë sot. Fillo të parën! 🚀"));

    const stats = byId("focus-stats");
    stats.innerHTML = "";
    for (const [value, label] of [
        [sessions, "seanca sot"],
        [focusMinutes(today), "minuta sot"],
        [focusMinutes(), "minuta gjithsej"],
    ]) {
        const box = el("div", "focus-stat");
        box.append(el("strong", "", String(value)), el("span", "", label));
        stats.appendChild(box);
    }
    renderTimer();
}

// ---------- Zakonet ----------
function toggleHabit(habit, day, button) {
    if (habit.checks[day]) {
        delete habit.checks[day];
    } else {
        habit.checks[day] = true;
        const rect = button.getBoundingClientRect();
        confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 18);
        beep(SOUND_DONE);
        const today = todayStr();
        if (day === today && data.habits.every((h) => h.checks[today])) {
            setTimeout(bigConfetti, 150);
            toast("🌟 Të gjitha zakonet u kryen sot!", { duration: 5000 });
        } else {
            toast(`${habit.icon} ${pick(PRAISE)} +${XP.habit} XP`);
        }
    }
    saveData();
    refresh();
    renderLanding();
}

function renderHabits() {
    const list = byId("habit-list");
    list.innerHTML = "";
    if (!data.habits.length) {
        const empty = el("div", "empty-state");
        empty.append(el("div", "big", "🌱"), el("p", "", "Shto zakonin tënd të parë më lart."));
        list.appendChild(empty);
        return;
    }

    const today = todayStr();
    const days = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6));
    for (const habit of data.habits) {
        const row = el("div", "habit-row");

        const streak = streakFrom(new Set(Object.keys(habit.checks)));
        const text = el("div", "habit-text");
        text.append(el("strong", "", habit.name), el("span", "", streak ? `🔥 ${streak} ditë rresht` : "Fillo vargun sot!"));
        const info = el("div", "habit-info");
        info.append(el("span", "habit-icon", habit.icon), text);

        const week = el("div", "habit-week");
        for (const day of days) {
            const on = !!habit.checks[day];
            const btn = el("button", "habit-day" + (on ? " on" : "") + (day === today ? " is-today" : ""));
            btn.type = "button";
            btn.title = formatDue(day);
            btn.append(el("small", "", DAY_LETTERS[parseDate(day).getDay()]), el("span", "", on ? "✓" : String(parseDate(day).getDate())));
            btn.addEventListener("click", () => toggleHabit(habit, day, btn));
            week.appendChild(btn);
        }

        const del = el("button", "icon-btn small", "✕");
        del.type = "button";
        del.title = "Fshi zakonin";
        del.addEventListener("click", () => {
            if (!confirm(`Ta fshish zakonin "${habit.name}"?`)) return;
            data.habits = data.habits.filter((h) => h !== habit);
            saveData();
            refresh();
            renderLanding();
        });

        row.append(info, week, del);
        list.appendChild(row);
    }
}

// ---------- Paneli i detajeve ----------
function renderDetail() {
    const task = currentTask();
    byId("detail").classList.toggle("open", !!task);
    byId("detail-empty").hidden = !!task;
    byId("detail-body").hidden = !task;
    if (!task) return;

    byId("d-check").checked = task.done;
    byId("d-check").className = `check p${task.priority}`;
    byId("d-date").value = task.due;
    byId("d-time").value = task.time;
    byId("d-priority").value = task.priority;
    byId("d-title").value = task.title;
    byId("d-notes").value = task.notes;

    const dList = byId("d-list");
    dList.innerHTML = "";
    dList.appendChild(new Option("📥 Inbox", "inbox"));
    for (const list of data.lists) dList.appendChild(new Option(list.name, list.id));
    dList.value = listById(task.listId) ? task.listId : "inbox";

    renderDetailTags(task);
    renderSubtasks(task);
}

function renderDetailTags(task) {
    const box = byId("d-tags");
    box.innerHTML = "";
    for (const tag of task.tags) {
        const chip = el("span", "tag-chip", `#${tag}`);
        const remove = el("button", "chip-x", "×");
        remove.type = "button";
        remove.title = "Hiq etiketën";
        remove.addEventListener("click", () => {
            task.tags = task.tags.filter((t) => t !== tag);
            saveData();
            renderDetailTags(task);
            refresh();
        });
        chip.appendChild(remove);
        box.appendChild(chip);
    }
    const input = el("input", "tag-input");
    input.placeholder = "+ etiketë";
    input.maxLength = 30;
    input.addEventListener("keydown", (e) => {
        if (e.key !== "Enter") return;
        e.preventDefault();
        const tag = normalizeTag(input.value);
        if (tag && !task.tags.includes(tag)) {
            task.tags.push(tag);
            saveData();
            refresh();
        }
        renderDetailTags(task);
        box.querySelector(".tag-input").focus();
    });
    box.appendChild(input);
}

function renderSubtasks(task) {
    const ul = byId("d-subtasks");
    ul.innerHTML = "";
    for (const sub of task.subtasks) {
        const li = el("li", sub.done ? "done" : "");

        const check = el("input", "check small");
        check.type = "checkbox";
        check.checked = sub.done;
        check.addEventListener("change", () => {
            sub.done = check.checked;
            if (sub.done) {
                const rect = check.getBoundingClientRect();
                confetti(rect.left + rect.width / 2, rect.top + rect.height / 2, 10, 0.7);
                beep(SOUND_DONE);
            }
            saveData();
            renderSubtasks(task);
            refresh();
        });

        const text = el("input", "sub-text");
        text.value = sub.title;
        text.maxLength = 200;
        text.addEventListener("change", () => {
            sub.title = text.value.trim() || sub.title;
            text.value = sub.title;
            saveData();
        });
        text.addEventListener("keydown", (e) => {
            if (e.key === "Enter") text.blur();
        });

        const del = el("button", "icon-btn small sub-del", "✕");
        del.type = "button";
        del.title = "Fshi nëndetyrën";
        del.addEventListener("click", () => {
            task.subtasks = task.subtasks.filter((s) => s !== sub);
            saveData();
            renderSubtasks(task);
            refresh();
        });

        li.append(check, text, del);
        ul.appendChild(li);
    }
}

// Ndryshimet në panelin e detajeve përditësojnë gjithçka tjetër pa e rivizatuar vetë panelin
function editTask(change) {
    const task = currentTask();
    if (!task) return;
    change(task);
    saveData();
    refresh();
}

byId("d-check").addEventListener("change", (e) => {
    const task = currentTask();
    if (task) toggleDone(task, e.target.checked, e.target);
});
byId("d-date").addEventListener("change", (e) =>
    editTask((t) => {
        t.due = e.target.value;
        settleReminder(t);
    })
);
byId("d-time").addEventListener("change", (e) =>
    editTask((t) => {
        t.time = e.target.value;
        if (t.time && !t.due) {
            t.due = todayStr();
            byId("d-date").value = t.due;
        }
        settleReminder(t);
        if (t.time) askNotificationPermission();
    })
);
byId("d-priority").addEventListener("change", (e) =>
    editTask((t) => {
        t.priority = Number(e.target.value);
        byId("d-check").className = `check p${t.priority}`;
    })
);
byId("d-title").addEventListener("input", (e) => editTask((t) => (t.title = e.target.value)));
byId("d-title").addEventListener("blur", (e) =>
    editTask((t) => {
        if (!t.title.trim()) {
            t.title = "Pa titull";
            e.target.value = t.title;
        }
    })
);
byId("d-title").addEventListener("keydown", (e) => {
    if (e.key === "Enter") byId("d-notes").focus();
});
byId("d-notes").addEventListener("input", (e) => editTask((t) => (t.notes = e.target.value)));
byId("d-list").addEventListener("change", (e) => editTask((t) => (t.listId = e.target.value)));
byId("d-close").addEventListener("click", () => selectTask(null));
byId("d-delete").addEventListener("click", () => {
    const task = currentTask();
    if (task) deleteTask(task);
});
byId("d-focus").addEventListener("click", () => {
    const task = currentTask();
    if (!task) return;
    timer.taskId = task.id;
    if (timer.mode !== "focus" && !timerRunning()) setTimerMode("focus");
    setView("focus");
});
byId("d-sub-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const task = currentTask();
    const title = byId("d-sub-input").value.trim();
    if (!task || !title) return;
    task.subtasks.push({ id: uid(), title, done: false });
    byId("d-sub-input").value = "";
    saveData();
    renderSubtasks(task);
    refresh();
});

// ---------- Ngjarjet e aplikacionit ----------
byId("quick-add").addEventListener("submit", (e) => {
    e.preventDefault();
    if (!quickInput.value.trim()) return;
    const parsed = parseQuickAdd(quickInput.value);
    const tags = [...parsed.tags];
    if (view.startsWith("tag:") && !query && !tags.includes(view.slice(4))) tags.push(view.slice(4));
    addTask({
        title: parsed.title,
        due: parsed.due || quickDate.value,
        time: parsed.time || quickTime.value,
        priority: parsed.priority ?? Number(quickPriority.value),
        listId: defaultListId(),
        tags,
    });
    quickInput.value = "";
    quickTime.value = "";
    quickPriority.value = "0";
    render();
});

searchInput.addEventListener("input", () => {
    query = searchInput.value.trim();
    render();
});

byId("add-list").addEventListener("click", () => {
    if (!isPro() && data.lists.length >= FREE_LIMITS.lists) {
        upgradePrompt(`Plani Falas lejon deri në ${FREE_LIMITS.lists} lista.`);
        return;
    }
    newListForm.hidden = false;
    newListInput.focus();
});
newListForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = newListInput.value.trim();
    if (!name) return;
    const list = { id: uid(), name, color: LIST_COLORS[data.lists.length % LIST_COLORS.length] };
    data.lists.push(list);
    newListInput.value = "";
    newListForm.hidden = true;
    saveData();
    setView(list.id);
    toast(`📋 Lista "${name}" u krijua`);
});
newListInput.addEventListener("blur", () => {
    if (!newListInput.value.trim()) newListForm.hidden = true;
});
newListInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") newListInput.value = "";
});

byId("habit-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = byId("habit-name").value.trim();
    if (!name) return;
    if (!isPro() && data.habits.length >= FREE_LIMITS.habits) {
        upgradePrompt(`Plani Falas lejon deri në ${FREE_LIMITS.habits} zakone.`);
        return;
    }
    data.habits.push({ id: uid(), name, icon: byId("habit-emoji").value.trim() || "✨", checks: {} });
    byId("habit-name").value = "";
    byId("habit-emoji").value = "✨";
    saveData();
    refresh();
    renderLanding();
    toast("🌱 Zakon i ri! Kliko ditën e sotme kur ta kryesh.");
});

byId("cal-prev").addEventListener("click", () => {
    calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() - 1, 1);
    renderCalendar();
});
byId("cal-next").addEventListener("click", () => {
    calMonth = new Date(calMonth.getFullYear(), calMonth.getMonth() + 1, 1);
    renderCalendar();
});
byId("cal-today").addEventListener("click", () => {
    calMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    renderCalendar();
});

document.querySelectorAll(".mode-tab").forEach((btn) => btn.addEventListener("click", () => setTimerMode(btn.dataset.mode)));
byId("focus-start").addEventListener("click", timerToggle);
byId("focus-reset").addEventListener("click", timerReset);
byId("focus-task").addEventListener("change", (e) => (timer.taskId = e.target.value));
byId("pomo-start").addEventListener("click", timerToggle);
byId("pomo-reset").addEventListener("click", timerReset);

byId("app-menu").addEventListener("click", () => appSidebar.classList.toggle("open"));
byId("app-main").addEventListener("click", (e) => {
    if (!e.target.closest("#app-menu")) appSidebar.classList.remove("open");
});
byId("app-theme").addEventListener("click", () => themeToggle.click());
byId("sound-toggle").addEventListener("click", () => {
    data.settings.sound = !data.settings.sound;
    saveData();
    renderSettings();
    if (data.settings.sound) beep(SOUND_DONE);
});

function renderSettings() {
    byId("sound-toggle").textContent = data.settings.sound ? "🔊 Tingujt: aktiv" : "🔇 Tingujt: joaktiv";
    const picker = byId("accent-picker");
    picker.innerHTML = "";
    ACCENTS.forEach((color, i) => {
        const locked = i > 0 && !isPro();
        const swatch = el("button", "swatch" + (data.settings.accent === color ? " active" : ""), locked ? "🔒" : "");
        swatch.type = "button";
        swatch.style.background = color || "#4772fa";
        swatch.title = locked ? "Ngjyrat janë pjesë e planit Pro" : "Ndrysho ngjyrën";
        swatch.addEventListener("click", () => {
            if (locked) {
                upgradePrompt("Ngjyrat e personalizuara janë pjesë e planit Pro.");
                return;
            }
            data.settings.accent = color;
            saveData();
            applyAccent(color);
            renderSettings();
        });
        picker.appendChild(swatch);
    });
}

// ---------- Hyrja, regjistrimi dhe planet ----------
let pendingView = null;

function showError(id, message) {
    byId(`${id}-error`).textContent = message;
    byId(id).classList.toggle("invalid", !!message);
}

function clearAuthErrors() {
    for (const id of ["signup-name", "signup-email", "signup-password", "signin-email", "signin-password"]) showError(id, "");
}

function showAuthTab(tab) {
    document.querySelectorAll(".auth-tab").forEach((b) => b.classList.toggle("active", b.dataset.auth === tab));
    byId("signup-form").hidden = tab !== "signup";
    byId("signin-form").hidden = tab !== "signin";
    clearAuthErrors();
    const first = tab === "signup" ? byId("signup-name") : byId("signin-email");
    setTimeout(() => first.focus(), 50);
}

function updateScrollLock() {
    const anyOpen = !modal.hidden || !infoModal.hidden || !authModal.hidden;
    document.body.classList.toggle("no-scroll", anyOpen);
}

function openAuth(tab = "signup", viewAfter = null) {
    if (account) {
        openApp(viewAfter);
        return;
    }
    pendingView = viewAfter;
    closeInfo();
    byId("auth-step").hidden = false;
    byId("plan-step").hidden = true;
    byId("auth-dialog").classList.remove("wide");
    authModal.hidden = false;
    updateScrollLock();
    showAuthTab(tab);
}

function closeAuth() {
    authModal.hidden = true;
    updateScrollLock();
}

function openPlans(afterSignup) {
    if (!account) {
        openAuth("signup");
        return;
    }
    closeInfo();
    byId("auth-step").hidden = true;
    byId("plan-step").hidden = false;
    byId("plan-step-label").hidden = !afterSignup;
    byId("plan-title").textContent = afterSignup ? `Zgjidh planin tënd, ${firstName()}` : "Ndrysho planin";
    byId("auth-dialog").classList.add("wide");
    renderPlanCards(afterSignup);
    authModal.hidden = false;
    updateScrollLock();
}

function renderPlanCards(afterSignup) {
    const box = byId("plan-cards");
    box.innerHTML = "";
    for (const [id, plan] of Object.entries(PLANS)) {
        const current = account.plan === id && !afterSignup;
        const card = el("div", "plan-card" + (plan.badge ? " featured" : ""));
        if (plan.badge) card.appendChild(el("span", "plan-badge", plan.badge));
        const price = el("div", "plan-price", plan.price + " ");
        price.appendChild(el("small", "", plan.period));
        const features = el("ul");
        for (const f of plan.features) features.appendChild(el("li", "", f));
        const btn = el("button", "btn " + (plan.badge ? "btn-primary" : "btn-ghost"), current ? "Plani aktual" : `Zgjidh ${plan.name}`);
        btn.type = "button";
        btn.disabled = current;
        btn.addEventListener("click", () => choosePlan(id, afterSignup));
        card.append(el("div", "plan-name", plan.name), price, features, btn);
        box.appendChild(card);
    }
}

function choosePlan(planId, afterSignup) {
    account.plan = planId;
    saveAccounts();
    closeAuth();
    renderAccount();
    renderSettings();
    if (afterSignup) {
        bigConfetti();
        beep(SOUND_LEVEL);
        toast(`🎉 Mirë se erdhe, ${firstName()}! Plani yt: ${PLANS[planId].name}`, { duration: 5000 });
        openApp(pendingView);
    } else {
        toast(planId === "free" ? "Kalove në planin Falas" : `⭐ Tani je ${PLANS[planId].name}!`);
        if (planId !== "free") confetti(innerWidth / 2, innerHeight / 3, 60, 1.5);
        if (!modal.hidden) render();
    }
}

function signIn(acc) {
    account = acc;
    writeJson(SESSION_KEY, acc.id);
    data = loadData(acc);
    saveData();
    lastLevel = levelOf(totalXp());
    selectedId = null;
    applyAccent(data.settings.accent);
    renderAccount();
    renderSettings();
    renderLanding();
}

function signOut() {
    if (!confirm("Të dalësh nga llogaria? Detyrat mbeten të ruajtura për herën tjetër që hyn.")) return;
    timerPause();
    account = null;
    try {
        localStorage.removeItem(SESSION_KEY);
    } catch {}
    data = loadData(null);
    lastLevel = levelOf(totalXp());
    selectedId = null;
    applyAccent("");
    closeApp();
    renderAccount();
    renderSettings();
    renderLanding();
    toast("👋 Dole nga llogaria. Shihemi së shpejti!");
}

byId("signup-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = byId("signup-name").value.trim().replace(/\s+/g, " ");
    const email = byId("signup-email").value.trim().toLowerCase();
    const password = byId("signup-password").value;

    const errors = {
        "signup-name": name.length < 2 ? "Shkruaj emrin tënd (të paktën 2 shkronja)." : "",
        "signup-email": !EMAIL_RE.test(email)
            ? "Shkruaj një email të vlefshëm."
            : accounts.some((a) => a.email === email)
              ? "Ky email është i regjistruar. Provo të hysh."
              : "",
        "signup-password": password.length < 6 ? "Fjalëkalimi duhet të ketë të paktën 6 karaktere." : "",
    };
    for (const [id, message] of Object.entries(errors)) showError(id, message);
    const firstInvalid = Object.keys(errors).find((id) => errors[id]);
    if (firstInvalid) {
        byId(firstInvalid).focus();
        return;
    }

    const salt = uid();
    const acc = { id: uid(), name, email, salt, passHash: await hashPassword(password, salt), plan: "free", joinedAt: Date.now() };
    // Llogaria e parë merr detyrat që ishin ruajtur para se të ekzistonin llogaritë
    if (!accounts.length) {
        const legacy = readJson(LEGACY_DATA_KEY, null);
        if (legacy) {
            writeJson(dataKey(acc.id), legacy);
            localStorage.removeItem(LEGACY_DATA_KEY);
        }
    }
    accounts.push(acc);
    saveAccounts();
    byId("signup-form").reset();
    signIn(acc);
    openPlans(true);
});

byId("signin-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = byId("signin-email").value.trim().toLowerCase();
    const password = byId("signin-password").value;
    clearAuthErrors();

    const acc = accounts.find((a) => a.email === email);
    if (!EMAIL_RE.test(email)) return showError("signin-email", "Shkruaj një email të vlefshëm.");
    if (!acc) return showError("signin-email", "Nuk ka llogari me këtë email. Regjistrohu më parë.");
    if ((await hashPassword(password, acc.salt)) !== acc.passHash) {
        showError("signin-password", "Fjalëkalimi është i gabuar.");
        byId("signin-password").select();
        return;
    }

    byId("signin-form").reset();
    signIn(acc);
    closeAuth();
    toast(`👋 Mirë se u ktheve, ${firstName()}!`);
    openApp(pendingView);
});

function renderAccount() {
    byId("nav-login").hidden = !!account;
    byId("nav-user").hidden = !account;
    byId("nav-user").textContent = account ? `👋 ${firstName()}` : "";
    byId("nav-cta").textContent = account ? "Hap aplikacionin" : "Regjistrohu";
    if (!account) return;
    byId("profile-avatar").textContent = account.name.charAt(0).toUpperCase();
    byId("profile-name").textContent = account.name;
    byId("profile-name").title = account.email;
    const plan = byId("profile-plan");
    plan.textContent = isPro() ? `⭐ ${PLANS[account.plan].name}` : "Falas";
    plan.classList.toggle("pro", isPro());
}

// ---------- Faqet e informacionit ----------
const INFO_PAGES = {
    cmimet: {
        title: "Çmimet",
        html: `
            <p class="info-lead">Fillo <b>falas</b> dhe kalo në Pro kur të duash. 🎉</p>
            <table>
                <tr><td><b>Falas</b> · 0 €</td><td>Detyra pa kufi, deri në 5 lista dhe 5 zakone, kalendar dhe fokus</td></tr>
                <tr><td><b>Pro</b> · 2,99 € / muaj</td><td>Lista dhe zakone pa kufi, ngjyra të personalizuara</td></tr>
                <tr><td><b>Pro Vjetor</b> · 24,99 € / vit</td><td>Gjithçka te Pro, me 30% kursim</td></tr>
            </table>
            <p class="plan-note">Version demo: pagesat nuk janë aktive ende, prandaj planet Pro aktivizohen pa pagesë.</p>
            <div class="info-actions"><button type="button" class="btn btn-primary" data-action="plans">Zgjidh planin</button></div>`,
    },
    ndihme: {
        title: "Ndihmë",
        html: `
            <p>Shkurtore dhe truke për ta përdorur Taskify më shpejt.</p>
            <table>
                <tr><td><kbd>N</kbd></td><td>Shto një detyrë të re</td></tr>
                <tr><td><kbd>Esc</kbd></td><td>Mbyll panelin ose aplikacionin</td></tr>
                <tr><td><kbd>Hapësirë</kbd></td><td>Fillo ose ndalo kronometrin te Fokus</td></tr>
            </table>
            <p><b>Shkrim i zgjuar</b> kur shton një detyrë:</p>
            <table>
                <tr><td><b>sot</b>, <b>nesër</b></td><td>Vendos datën</td></tr>
                <tr><td><b>14:30</b></td><td>Vendos orën dhe një kujtesë ⏰</td></tr>
                <tr><td><b>!1</b> <b>!2</b> <b>!3</b></td><td>Prioritet i ulët, mesatar ose i lartë</td></tr>
                <tr><td><b>#etiketë</b></td><td>Shton një etiketë</td></tr>
            </table>
            <p>Shembull: <i>Takim me Anën nesër 10:00 !3 #puna</i></p>
            <div class="info-actions"><button type="button" class="btn btn-primary" data-open-app>Hap aplikacionin</button></div>`,
    },
    udhezues: {
        title: "Udhëzues i shpejtë",
        html: `
            <ol>
                <li><b>Shto detyrat</b> te kutia lart dhe shtyp Enter.</li>
                <li><b>Kliko një detyrë</b> për t'i shtuar përshkrim, nëndetyra, etiketa ose kujtesë.</li>
                <li><b>Organizo me lista</b> (Puna, Shtëpia…) nga shenja + në të majtë.</li>
                <li><b>Planifiko javën</b> te Kalendari dhe zvarrit detyrat nga një ditë te tjetra.</li>
                <li><b>Fokusohu</b> me kronometrin 🍅 dhe <b>ndërto zakone</b> 🔥.</li>
                <li>Çdo veprim të jep <b>XP</b>. Deri në cilin nivel do të arrish? 🏆</li>
            </ol>
            <div class="info-actions"><button type="button" class="btn btn-primary" data-open-app>Fillo tani</button></div>`,
    },
    keshilla: {
        title: "Këshilla produktiviteti",
        html: `
            <ul>
                <li>🐸 <b>Ha bretkosën në mëngjes:</b> bëj fillimisht detyrën më të vështirë.</li>
                <li>⏱️ <b>Rregulli i 2 minutave:</b> nëse diçka zgjat më pak se 2 minuta, bëje menjëherë.</li>
                <li>🍅 <b>Pomodoro:</b> 25 minuta punë, 5 pushim. Pas 4 seancash, pusho më gjatë.</li>
                <li>🎯 <b>Tri gjëra në ditë:</b> zgjidh 3 detyra kryesore dhe jepu prioritet të lartë.</li>
                <li>🔥 <b>Mos e këput vargun:</b> një zakon i vogël çdo ditë vlen më shumë se një i madh rrallë.</li>
            </ul>`,
    },
    rreth: {
        title: "Rreth nesh",
        html: `
            <p class="info-lead">Taskify është një aplikacion i thjeshtë për detyra, i frymëzuar nga TickTick.</p>
            <p>U ndërtua vetëm me HTML, CSS dhe JavaScript. Qëllimi: ta mbash ditën në rregull dhe ta bësh pak më argëtuese. 🎉</p>`,
    },
    privatesia: {
        title: "Privatësia dhe të dhënat",
        html: `
            <p class="info-lead">🔒 Të dhënat e tua mbeten te ti.</p>
            <p>Llogaria, detyrat dhe statistikat ruhen vetëm në këtë shfletues. Asgjë nuk dërgohet në internet, dhe fjalëkalimi ruhet i koduar (hash), jo si tekst.</p>
            <p>Nëse i fshin të dhënat e shfletuesit, gjithçka humbet. Prandaj bëj herë pas here një kopje rezervë:</p>
            <div class="info-actions">
                <button type="button" class="btn btn-primary" data-action="export">💾 Eksporto</button>
                <button type="button" class="btn btn-ghost" data-action="import">📥 Importo</button>
                <button type="button" class="btn btn-danger" data-action="reset">🗑 Fshi detyrat e mia</button>
            </div>`,
    },
};

function openInfo(key) {
    const page = INFO_PAGES[key];
    if (!page) return;
    byId("info-title").textContent = page.title;
    byId("info-content").innerHTML = page.html;
    infoModal.hidden = false;
    updateScrollLock();
}

function closeInfo() {
    infoModal.hidden = true;
    updateScrollLock();
}

function exportData() {
    if (!account) {
        toast("Hyr në llogari për të eksportuar detyrat e tua.", { action: "Hyr", onAction: () => openAuth("signin") });
        return;
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = el("a");
    link.href = URL.createObjectURL(blob);
    link.download = `taskify-${todayStr()}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    toast("💾 Kopja rezervë u shkarkua");
}

function replaceData(next, message) {
    data = next;
    saveData();
    lastLevel = levelOf(totalXp());
    selectedId = null;
    applyAccent(data.settings.accent);
    renderSettings();
    renderLanding();
    if (!modal.hidden) render();
    toast(message);
}

byId("import-file").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
        const parsed = JSON.parse(await file.text());
        if (!parsed || !Array.isArray(parsed.tasks)) throw new Error("invalid");
        if (!confirm("Kjo do të zëvendësojë detyrat e tua aktuale. Vazhdo?")) return;
        writeJson(dataKey(account.id), parsed);
        replaceData(loadData(account), "📥 Të dhënat u importuan");
    } catch {
        toast("⚠️ Skedari nuk është një kopje e vlefshme e Taskify");
    }
});

function runAction(action) {
    if (action === "plans") return openPlans(false);
    if (action === "logout") return signOut();
    if (action === "export") return exportData();
    if (!account) return openAuth("signin");
    if (action === "import") byId("import-file").click();
    if (action === "reset" && confirm("Të fshihen të gjitha detyrat, listat, zakonet dhe statistikat e tua? Ky veprim nuk kthehet.")) {
        closeInfo();
        replaceData(createStarterData(false), "🧹 Fillim i ri! Të dhënat u fshinë.");
    }
}

// ---------- Faqja kryesore me të dhëna të vërteta ----------
function setStat(id, value) {
    const node = byId(id);
    node.dataset.count = value;
    if (node.closest(".stat").classList.contains("visible")) node.textContent = formatNumber(value, 0);
}

function renderLanding() {
    const cal = byId("calendar-mini");
    cal.innerHTML = "";
    ["H", "M", "M", "E", "P", "S", "D"].forEach((d) => cal.appendChild(el("div", "cal-head", d)));
    const now = new Date();
    const offset = (new Date(now.getFullYear(), now.getMonth(), 1).getDay() + 6) % 7;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const busyDays = new Set(data.tasks.filter((t) => !t.done && t.due).map((t) => t.due));
    for (let i = 0; i < offset; i++) cal.appendChild(document.createElement("div"));
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = el("div", "cal-day", String(day));
        if (day === now.getDate()) cell.classList.add("today");
        else if (busyDays.has(dateStr(new Date(now.getFullYear(), now.getMonth(), day)))) cell.classList.add("has-event");
        cal.appendChild(cell);
    }

    const habitsBox = byId("habits-mini");
    habitsBox.innerHTML = "";
    const lastWeek = Array.from({ length: 7 }, (_, i) => addDays(todayStr(), i - 6));
    for (const habit of data.habits.slice(0, 3)) {
        const row = el("div", "habit");
        const dots = el("div", "habit-days");
        for (const day of lastWeek) dots.appendChild(el("i", habit.checks[day] ? "on" : ""));
        row.append(el("span", "", `${habit.icon} ${habit.name}`), dots);
        habitsBox.appendChild(row);
    }
    if (!data.habits.length) habitsBox.appendChild(el("p", "habits-empty", "Ende pa zakone. Shto të parin! 🌱"));

    setStat("stat-done", data.tasks.filter((t) => t.done).length);
    setStat("stat-focus", focusMinutes());
    setStat("stat-streak", streakFrom(doneDays()));
    setStat("stat-habits", habitCheckCount());
}

// ---------- Hapja dhe mbyllja ----------
function openApp(viewId) {
    if (!account) {
        openAuth("signup", viewId);
        return;
    }
    closeInfo();
    modal.hidden = false;
    updateScrollLock();
    if (viewId) setView(viewId);
    else render();
    if (!byId("tasks-view").hidden && matchMedia("(min-width: 761px)").matches) quickInput.focus();
}

function closeApp() {
    modal.hidden = true;
    appSidebar.classList.remove("open");
    updateScrollLock();
    renderLanding();
}

document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-app]");
    if (opener) {
        e.preventDefault();
        openApp(opener.dataset.openApp || null);
        return;
    }
    const auth = e.target.closest("[data-auth]");
    if (auth) {
        e.preventDefault();
        if (authModal.hidden) openAuth(auth.dataset.auth);
        else showAuthTab(auth.dataset.auth);
        return;
    }
    const info = e.target.closest("[data-info]");
    if (info) {
        e.preventDefault();
        openInfo(info.dataset.info);
        return;
    }
    const action = e.target.closest("[data-action]");
    if (action) {
        e.preventDefault();
        runAction(action.dataset.action);
        return;
    }
    if (e.target.closest("[data-close-app]")) closeApp();
    else if (e.target.closest("[data-close-info]")) closeInfo();
    else if (e.target.closest("[data-close-auth]")) closeAuth();
});

// Esc mbyll gjërat, "N" shton detyrë, Hapësira ndez kronometrin
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !authModal.hidden) return closeAuth();
    if (e.key === "Escape" && !infoModal.hidden) return closeInfo();
    if (modal.hidden) return;
    const active = document.activeElement.tagName;
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(active);
    if (e.key === "Escape") {
        if (typing) document.activeElement.blur();
        else if (selectedId) selectTask(null);
        else closeApp();
        return;
    }
    if (typing || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key.toLowerCase() === "n") {
        e.preventDefault();
        if (byId("tasks-view").hidden) setView("inbox");
        quickInput.focus();
    } else if (e.key === " " && view === "focus" && active !== "BUTTON") {
        e.preventDefault();
        timerToggle();
    }
});

// ---------- Fillimi ----------
applyAccent(data.settings.accent);
renderAccount();
renderSettings();
setView("today");
renderTimer();
renderLanding();
setInterval(checkReminders, 15000);
