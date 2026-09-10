import { HashMap, HashSet } from "./index.js";
import { HASHMAP_SOURCE, HASHSET_SOURCE } from "./annotated-source.js";

const log = document.getElementById("log");

const typingTimers = new WeakMap();

function typeWriter(el, text, { speed = 22, onTick } = {}) {
  clearInterval(typingTimers.get(el));

  const textSpan = document.createElement("span");
  el.replaceChildren(textSpan);

  let i = 0;
  const timer = setInterval(() => {
    textSpan.textContent += text[i];
    i += 1;
    onTick?.();
    if (i >= text.length) clearInterval(timer);
  }, speed);
  typingTimers.set(el, timer);
}

const MAX_LOG_LINES = 20;

// Newest command goes on the left; the row scrolls horizontally and older
// entries drop off the right once MAX_LOG_LINES is exceeded.
function logLine(text, type = "ok") {
  const line = document.createElement("div");
  line.className = type === "error" ? "log-line error" : "log-line";
  log.prepend(line);

  while (log.children.length > MAX_LOG_LINES) {
    log.removeChild(log.lastElementChild);
  }

  typeWriter(line, text, { onTick: () => (log.scrollLeft = 0) });
  log.scrollLeft = 0;
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

// Wraps a HashMap/HashSet with its UI elements and localStorage key so both
// tabs can share the same update/persist/load logic. Renders the current
// entries directly (one box per key) rather than the raw bucket layout, so
// there's nothing to interpret beyond "these are the keys and values".
function createController({
  prefix,
  collection,
  storageKey,
  serialize,
  restore,
  buildRow,
}) {
  const statsEl = document.getElementById(`${prefix}-stats`);
  const entriesEl = document.getElementById(`${prefix}-entries`);

  function update() {
    const count = collection.length();
    typeWriter(
      statsEl,
      `${count} ${count === 1 ? "entry" : "entries"} · capacity ${collection.capacity} · load ${collection.currentLoad().toFixed(2)}`,
    );
    entriesEl.replaceChildren(...serialize().map(buildRow));
  }

  function persist() {
    update();
    localStorage.setItem(storageKey, JSON.stringify(serialize()));
  }

  function load() {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;
      JSON.parse(raw).forEach(restore);
    } catch {
      // ignore corrupt storage
    }
  }

  return { update, persist, load };
}

function entryRow(key, value) {
  const row = document.createElement("div");
  row.className = "entry-row";

  const k = document.createElement("span");
  k.className = "entry-key";
  k.textContent = key;
  row.appendChild(k);

  if (value !== undefined) {
    const v = document.createElement("span");
    v.className = "entry-value";
    v.textContent = value;
    row.appendChild(v);
  }

  return row;
}

// Wires up one tab's command buttons from a declarative list. Each op reads
// its input field(s), bails out with an error if any are empty, otherwise
// runs the command and logs the string it returns.
function wireOps(ops) {
  ops.forEach(({ btn, inputs = [], validateMsg, run }) => {
    document.getElementById(btn).addEventListener("click", () => {
      const values = inputs.map(val);
      const missing = inputs.filter((id, i) => !values[i]);
      if (missing.length) return showError(validateMsg, missing);

      const text = run(...values);
      inputs.forEach(clear);
      logLine(text);
    });
  });
}

const hashMap = new HashMap();
const hashSet = new HashSet();

const hashMapCtl = createController({
  prefix: "hashmap",
  collection: hashMap,
  storageKey: "hashmap-state",
  serialize: () => hashMap.entries(),
  restore: ([k, v]) => hashMap.set(k, v),
  buildRow: ([k, v]) => entryRow(k, v),
});

const hashSetCtl = createController({
  prefix: "hashset",
  collection: hashSet,
  storageKey: "hashset-state",
  restore: (v) => hashSet.set(v),
  serialize: () => hashSet.keys(),
  buildRow: (v) => entryRow(v),
});

wireOps([
  {
    btn: "hashmap-btn-set",
    inputs: ["hashmap-set-key", "hashmap-set-value"],
    validateMsg: "set: enter a key and a value.",
    run: (k, v) => {
      hashMap.set(k, v);
      hashMapCtl.persist();
      return `set("${k}", "${v}")`;
    },
  },
  {
    btn: "hashmap-btn-remove",
    inputs: ["hashmap-remove-key"],
    validateMsg: "remove: enter a key.",
    run: (k) => {
      const removed = hashMap.remove(k);
      hashMapCtl.persist();
      return `remove("${k}") → ${removed}`;
    },
  },
  {
    btn: "hashmap-btn-clear",
    run: () => {
      hashMap.clear();
      hashMapCtl.persist();
      return "clear()";
    },
  },
  {
    btn: "hashmap-btn-get",
    inputs: ["hashmap-get-key"],
    validateMsg: "get: enter a key.",
    run: (k) => `get("${k}"): ${hashMap.get(k)}`,
  },
  {
    btn: "hashmap-btn-has",
    inputs: ["hashmap-has-key"],
    validateMsg: "has: enter a key.",
    run: (k) => `has("${k}"): ${hashMap.has(k)}`,
  },
  {
    btn: "hashmap-btn-length",
    run: () => `length(): ${hashMap.length()}`,
  },
  {
    btn: "hashmap-btn-load",
    run: () => `currentLoad(): ${hashMap.currentLoad().toFixed(2)}`,
  },
  {
    btn: "hashmap-btn-keys",
    run: () => `keys(): ${JSON.stringify(hashMap.keys())}`,
  },
  {
    btn: "hashmap-btn-values",
    run: () => `values(): ${JSON.stringify(hashMap.values())}`,
  },
  {
    btn: "hashmap-btn-entries",
    run: () => `entries(): ${JSON.stringify(hashMap.entries())}`,
  },
]);

wireOps([
  {
    btn: "hashset-btn-set",
    inputs: ["hashset-set-value"],
    validateMsg: "set: enter a value.",
    run: (v) => {
      hashSet.set(v);
      hashSetCtl.persist();
      return `set("${v}")`;
    },
  },
  {
    btn: "hashset-btn-remove",
    inputs: ["hashset-remove-value"],
    validateMsg: "remove: enter a value.",
    run: (v) => {
      const removed = hashSet.remove(v);
      hashSetCtl.persist();
      return `remove("${v}") → ${removed}`;
    },
  },
  {
    btn: "hashset-btn-clear",
    run: () => {
      hashSet.clear();
      hashSetCtl.persist();
      return "clear()";
    },
  },
  {
    btn: "hashset-btn-has",
    inputs: ["hashset-has-value"],
    validateMsg: "has: enter a value.",
    run: (v) => `has("${v}"): ${hashSet.has(v)}`,
  },
  {
    btn: "hashset-btn-length",
    run: () => `length(): ${hashSet.length()}`,
  },
  {
    btn: "hashset-btn-load",
    run: () => `currentLoad(): ${hashSet.currentLoad().toFixed(2)}`,
  },
  {
    btn: "hashset-btn-keys",
    run: () => `keys(): ${JSON.stringify(hashSet.keys())}`,
  },
]);

// ── Tabs (HashMap / HashSet) ──
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

// ── Action tabs (mutate / query), scoped to each column ──
document.querySelectorAll(".action-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const commands = tab.closest(".col-commands");
    commands
      .querySelectorAll(".action-tab")
      .forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");

    commands.querySelectorAll(".pane").forEach((pane) => {
      pane.classList.toggle(
        "hidden",
        pane.dataset.action !== tab.dataset.action,
      );
    });
  });
});

// ── "How it works" modal ──
const howModal = document.getElementById("how-modal");
const howModalTitle = document.getElementById("how-modal-title");
const howModalCode = document.getElementById("how-modal-code");

function renderCode(code) {
  howModalCode.replaceChildren();
  code.split("\n").forEach((line) => {
    const lineEl = document.createElement("div");
    lineEl.className = line.trim().startsWith("//")
      ? "code-line comment"
      : "code-line";
    lineEl.textContent = line.length ? line : " ";
    howModalCode.appendChild(lineEl);
  });
}

function openHow(title, code) {
  howModalTitle.textContent = title;
  renderCode(code);
  howModal.showModal();
}

document.getElementById("hashmap-btn-how").addEventListener("click", () => {
  openHow("How HashMap works", HASHMAP_SOURCE);
});
document.getElementById("hashset-btn-how").addEventListener("click", () => {
  openHow("How HashSet works", HASHSET_SOURCE);
});
document
  .getElementById("how-modal-close")
  .addEventListener("click", () => howModal.close());
howModal.addEventListener("click", (e) => {
  if (e.target === howModal) howModal.close();
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

hashMapCtl.load();
hashSetCtl.load();
hashMapCtl.update();
hashSetCtl.update();
document.getElementById("hashmap-set-key").focus();
