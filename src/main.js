import { HashMap, HashSet } from "./index.js";

const HASHMAP_STORAGE_KEY = "hashmap-state";
const HASHSET_STORAGE_KEY = "hashset-state";

const hashMap = new HashMap();
const hashSet = new HashSet();

const hashMapState = document.getElementById("hashmap-state");
const hashSetState = document.getElementById("hashset-state");
const log = document.getElementById("log");

function saveHashMapState() {
  localStorage.setItem(HASHMAP_STORAGE_KEY, JSON.stringify(hashMap.entries()));
}

function loadHashMapState() {
  try {
    const raw = localStorage.getItem(HASHMAP_STORAGE_KEY);
    if (!raw) return;
    JSON.parse(raw).forEach(([k, v]) => hashMap.set(k, v));
  } catch {
    // ignore corrupt storage
  }
}

function saveHashSetState() {
  localStorage.setItem(HASHSET_STORAGE_KEY, JSON.stringify(hashSet.keys()));
}

function loadHashSetState() {
  try {
    const raw = localStorage.getItem(HASHSET_STORAGE_KEY);
    if (!raw) return;
    JSON.parse(raw).forEach((v) => hashSet.set(v));
  } catch {
    // ignore corrupt storage
  }
}

const typingTimers = new WeakMap();

function typeWriter(el, text, { speed = 22, onTick } = {}) {
  clearInterval(typingTimers.get(el));

  const textSpan = document.createElement("span");
  const cursorSpan = document.createElement("span");
  cursorSpan.className = "cursor";
  el.replaceChildren(textSpan, cursorSpan);

  let i = 0;
  const timer = setInterval(() => {
    textSpan.textContent += text[i];
    i += 1;
    onTick?.();
    if (i >= text.length) clearInterval(timer);
  }, speed);
  typingTimers.set(el, timer);
}

const MAX_LOG_LINES = 6;

function logLine(text, type = "ok") {
  const line = document.createElement("div");
  line.className = type === "error" ? "log-line error" : "log-line";
  log.appendChild(line);

  while (log.children.length > MAX_LOG_LINES) {
    log.removeChild(log.firstElementChild);
  }

  typeWriter(line, text, { onTick: () => (log.scrollTop = log.scrollHeight) });
  log.scrollTop = log.scrollHeight;
}

function updateHashMapState() {
  typeWriter(hashMapState, hashMap.toString());
}

function updateHashSetState() {
  typeWriter(hashSetState, hashSet.toString());
}

function persistHashMap() {
  updateHashMapState();
  saveHashMapState();
}

function persistHashSet() {
  updateHashSetState();
  saveHashSetState();
}

function showQuery(label, value) {
  logLine(`${label}: ${value}`);
}

function showError(msg, invalidIds = []) {
  logLine(msg, "error");
  invalidIds.forEach((id) =>
    document.getElementById(id).classList.add("invalid"),
  );
}

function val(id) {
  return document.getElementById(id).value.trim();
}
function clear(id) {
  document.getElementById(id).value = "";
}

// ── Tabs ──
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    document.querySelectorAll(".tabpanel").forEach((panel) => {
      panel.classList.toggle("hidden", panel.dataset.tab !== tab.dataset.tab);
    });
  });
});

// ── HashMap ──
document.getElementById("hashmap-btn-set").addEventListener("click", () => {
  const k = val("hashmap-set-key");
  const v = val("hashmap-set-value");
  const invalid = [];
  if (!k) invalid.push("hashmap-set-key");
  if (!v) invalid.push("hashmap-set-value");
  if (invalid.length)
    return showError("set: enter a key and a value.", invalid);
  hashMap.set(k, v);
  clear("hashmap-set-key");
  clear("hashmap-set-value");
  persistHashMap();
  logLine(`set("${k}", "${v}")`);
});

document.getElementById("hashmap-btn-remove").addEventListener("click", () => {
  const k = val("hashmap-remove-key");
  if (!k) return showError("remove: enter a key.", ["hashmap-remove-key"]);
  const removed = hashMap.remove(k);
  clear("hashmap-remove-key");
  persistHashMap();
  logLine(`remove("${k}") → ${removed}`);
});

document.getElementById("hashmap-btn-clear").addEventListener("click", () => {
  hashMap.clear();
  persistHashMap();
  logLine("clear()");
});

document.getElementById("hashmap-btn-get").addEventListener("click", () => {
  const k = val("hashmap-get-key");
  if (!k) return showError("get: enter a key.", ["hashmap-get-key"]);
  showQuery(`get("${k}")`, hashMap.get(k));
});

document.getElementById("hashmap-btn-has").addEventListener("click", () => {
  const k = val("hashmap-has-key");
  if (!k) return showError("has: enter a key.", ["hashmap-has-key"]);
  showQuery(`has("${k}")`, hashMap.has(k));
});

document.getElementById("hashmap-btn-length").addEventListener("click", () => {
  showQuery("length()", hashMap.length());
});

document.getElementById("hashmap-btn-load").addEventListener("click", () => {
  showQuery("currentLoad()", hashMap.currentLoad().toFixed(2));
});

document.getElementById("hashmap-btn-entries").addEventListener("click", () => {
  showQuery("entries()", JSON.stringify(hashMap.entries()));
});

// ── HashSet ──
document.getElementById("hashset-btn-set").addEventListener("click", () => {
  const v = val("hashset-set-value");
  if (!v) return showError("set: enter a value.", ["hashset-set-value"]);
  hashSet.set(v);
  clear("hashset-set-value");
  persistHashSet();
  logLine(`set("${v}")`);
});

document.getElementById("hashset-btn-remove").addEventListener("click", () => {
  const v = val("hashset-remove-value");
  if (!v) return showError("remove: enter a value.", ["hashset-remove-value"]);
  const removed = hashSet.remove(v);
  clear("hashset-remove-value");
  persistHashSet();
  logLine(`remove("${v}") → ${removed}`);
});

document.getElementById("hashset-btn-clear").addEventListener("click", () => {
  hashSet.clear();
  persistHashSet();
  logLine("clear()");
});

document.getElementById("hashset-btn-has").addEventListener("click", () => {
  const v = val("hashset-has-value");
  if (!v) return showError("has: enter a value.", ["hashset-has-value"]);
  showQuery(`has("${v}")`, hashSet.has(v));
});

document.getElementById("hashset-btn-length").addEventListener("click", () => {
  showQuery("length()", hashSet.length());
});

document.getElementById("hashset-btn-load").addEventListener("click", () => {
  showQuery("currentLoad()", hashSet.currentLoad().toFixed(2));
});

document.getElementById("hashset-btn-keys").addEventListener("click", () => {
  showQuery("keys()", JSON.stringify(hashSet.keys()));
});

// Quality of life: Enter runs the row's command, typing clears its error state.
document.querySelectorAll(".cmd-row input").forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    input.closest(".cmd-row").querySelector("button.run").click();
  });
  input.addEventListener("input", () => input.classList.remove("invalid"));
});

loadHashMapState();
loadHashSetState();
updateHashMapState();
updateHashSetState();
document.getElementById("hashmap-set-key").focus();
