const hamburger = document.querySelector(".hamburger");
const backdrop = document.querySelector(".mobile-menu-backdrop");
const closeBtn = document.querySelector(".mobile-menu-close");

function setMenuOpen(isOpen) {
  if (!hamburger || !backdrop) return;
  hamburger.classList.toggle("is-open", isOpen);
  backdrop.classList.toggle("is-open", isOpen);
  hamburger.setAttribute("aria-expanded", String(isOpen));
  backdrop.setAttribute("aria-hidden", String(!isOpen));
  if (isOpen) {
    const first = backdrop.querySelector("button, [href], input, [tabindex]");
    if (first) first.focus();
  } else {
    hamburger.focus();
  }
}

if (hamburger && backdrop) {
  hamburger.addEventListener("click", () => {
    const isOpen = !hamburger.classList.contains("is-open");
    setMenuOpen(isOpen);
  });

  if (closeBtn) {
    closeBtn.addEventListener("click", () => setMenuOpen(false));
  }

  backdrop.addEventListener("click", (event) => {
    if (event.target === backdrop) {
      setMenuOpen(false);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMenuOpen(false);
    }
  });
}

// Calculator logic (only runs on calculator page)
const calculateBtn = document.getElementById("calculate-btn");
const finalAverageEl = document.getElementById("final-average");

if (calculateBtn && finalAverageEl) {
  const SUBJECT_WEIGHTS = {
    database: { td: 0.2, tp: 0.2, exam: 0.6 },
    info_tl: { td: 0.2, tp: 0.2, exam: 0.6 },
    networks: { td: 0.2, tp: 0.2, exam: 0.6 },
    oop: { tp: 0.4, exam: 0.6 }, // TP 40%, Exam 60%
    os: { td: 0.2, tp: 0.2, exam: 0.6 },
    web: { tp: 0.4, exam: 0.6 }, // TP 40%, Exam 60%
    english: { exam: 1 }, // Exam only 100%
  };

  calculateBtn.addEventListener("click", () => {
    const rows = document.querySelectorAll(
      ".calculator-form .calculator-grid[data-subject]"
    );

    let totalWeighted = 0;
    let totalCoef = 0;

    rows.forEach((row) => {
      const subjectKey = row.getAttribute("data-subject");
      const weights = SUBJECT_WEIGHTS[subjectKey];
      if (!weights) return;

      const coefCell = row.querySelector(".calc-coef");
      if (!coefCell) return;
      const coef = Number(coefCell.getAttribute("data-coef") || "0");
      if (!coef) return;

      let moduleAvg = 0;

      // Use fixed weights per subject. Missing grades count as 0.
      const tdInput = row.querySelector("input[name$='_td']");
      const tpInput = row.querySelector("input[name$='_tp']");
      const examInput = row.querySelector("input[name$='_exam']");

      if (weights.td && tdInput) {
        const v = Number(tdInput.value || "0");
        if (!Number.isNaN(v)) {
          moduleAvg += v * weights.td;
        }
      }

      if (weights.tp && tpInput) {
        const v = Number(tpInput.value || "0");
        if (!Number.isNaN(v)) {
          moduleAvg += v * weights.tp;
        }
      }

      if (weights.exam && examInput) {
        const v = Number(examInput.value || "0");
        if (!Number.isNaN(v)) {
          moduleAvg += v * weights.exam;
        }
      }

      const moduleAvgCell = row.querySelector(".calc-module-avg");
      if (moduleAvgCell) {
        moduleAvgCell.textContent = moduleAvg.toFixed(2);
      }

      totalWeighted += moduleAvg * coef;
      totalCoef += coef;
    });

    if (!totalCoef) {
      finalAverageEl.textContent = "—";
      return;
    }

    const finalAvg = totalWeighted / totalCoef;
    finalAverageEl.textContent = finalAvg.toFixed(2);
  });
}

// Global search (works on all pages, with results list)
const searchInput = document.querySelector(".search-input");
const searchCta = document.querySelector(".search-cta");
const searchResults = document.getElementById("search-results");

// Static index of searchable items across pages
const SEARCH_INDEX = [
  { label: "Home", page: "index.html", type: "Page", description: "Landing page" },
  {
    label: "Modules page",
    page: "modules.html",
    type: "Page",
    description: "All S4 modules",
  },
  {
    label: "Calculator page",
    page: "calculator.html",
    type: "Page",
    description: "Grades & GPA",
  },
  // Modules
  {
    label: "Data base",
    page: "modules.html",
    type: "Module",
    description: "S4 module",
  },
  {
    label: "Info TL",
    page: "modules.html",
    type: "Module",
    description: "S4 module",
  },
  {
    label: "Networks",
    page: "modules.html",
    type: "Module",
    description: "S4 module",
  },
  {
    label: "Orient object programming",
    page: "modules.html",
    type: "Module",
    description: "S4 module",
  },
  {
    label: "Operation system",
    page: "modules.html",
    type: "Module",
    description: "S4 module",
  },
  {
    label: "Web development",
    page: "modules.html",
    type: "Module",
    description: "S4 module",
  },
  {
    label: "English",
    page: "modules.html",
    type: "Module",
    description: "S4 module",
  },
  // Calculator subjects
  {
    label: "Database",
    page: "calculator.html",
    type: "Calculator",
    description: "TP, TD, Exam (coef 3)",
  },
  {
    label: "Info TL",
    page: "calculator.html",
    type: "Calculator",
    description: "TD, TP, Exam (coef 2)",
  },
  {
    label: "Networks",
    page: "calculator.html",
    type: "Calculator",
    description: "TD, TP, Exam (coef 3)",
  },
  {
    label: "OOP",
    page: "calculator.html",
    type: "Calculator",
    description: "TP, Exam (coef 2)",
  },
  {
    label: "Operating System",
    page: "calculator.html",
    type: "Calculator",
    description: "TD, TP, Exam (coef 3)",
  },
  {
    label: "Web Development",
    page: "calculator.html",
    type: "Calculator",
    description: "TP, Exam (coef 2)",
  },
  {
    label: "English",
    page: "calculator.html",
    type: "Calculator",
    description: "Exam only (coef 1)",
  },
];

function clearSearchHighlights() {
  document.querySelectorAll(".search-match").forEach((el) => {
    el.classList.remove("search-match");
  });
  document.querySelectorAll(".search-dim").forEach((el) => {
    el.classList.remove("search-dim");
  });

  if (searchResults) {
    searchResults.innerHTML = "";
  }
}

function runPageSearch(queryRaw) {
  const query = queryRaw.trim().toLowerCase();
  clearSearchHighlights();
  if (!query) return;

  // Build results list from static index
  if (searchResults) {
    const matches = SEARCH_INDEX.filter((item) =>
      item.label.toLowerCase().includes(query)
    );

    if (matches.length > 0) {
      const inner = document.createElement("div");
      inner.className = "search-results-inner";

      const title = document.createElement("div");
      title.className = "search-results-title";
      title.textContent = `Results for "${queryRaw.trim()}"`;
      inner.appendChild(title);

      const list = document.createElement("div");
      list.className = "search-results-list";

      matches.forEach((item) => {
        const pill = document.createElement("div");
        pill.className = "search-result-pill";

        const main = document.createElement("span");
        main.textContent = item.label;
        pill.appendChild(main);

        const meta = document.createElement("small");
        meta.textContent = item.description || item.type;
        pill.appendChild(meta);

        const link = document.createElement("a");
        link.href = item.page;
        link.textContent = "Open";
        pill.appendChild(link);

        list.appendChild(pill);
      });

      inner.appendChild(list);
      searchResults.appendChild(inner);
    }
  }

  // Modules page: highlight matching module cards
  const moduleCards = document.querySelectorAll(".module-card");
  if (moduleCards.length) {
    let anyMatch = false;
    moduleCards.forEach((card) => {
      const nameEl = card.querySelector(".module-name");
      const text = nameEl ? nameEl.textContent.toLowerCase() : "";
      if (text.includes(query)) {
        card.classList.add("search-match");
        anyMatch = true;
      } else {
        card.classList.add("search-dim");
      }
    });
    if (anyMatch) return;
  }

  // Calculator page: highlight matching subject rows
  const subjectRows = document.querySelectorAll(
    ".calculator-form .calculator-grid[data-subject]"
  );
  if (subjectRows.length) {
    subjectRows.forEach((row) => {
      const labelEl = row.querySelector(".calc-subject span");
      const text = labelEl ? labelEl.textContent.toLowerCase() : "";
      if (text.includes(query)) {
        row.classList.add("search-match");
      } else {
        row.classList.add("search-dim");
      }
    });
  }
}

if (searchInput) {
  searchInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      runPageSearch(searchInput.value);
    } else if (event.key === "Escape") {
      clearSearchHighlights();
    }
  });
}

if (searchCta && searchInput) {
  searchCta.addEventListener("click", () => {
    runPageSearch(searchInput.value);
  });
}

// Modules accordion behavior (restore sub-buttons)
const moduleToggles = document.querySelectorAll(".module-toggle");

if (moduleToggles.length) {
  moduleToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const card = toggle.closest(".module-card");
      const details = card && card.querySelector(".module-details");
      const chevron = toggle.querySelector(".module-chevron");
      if (!details) return;

      const isOpen = details.classList.contains("is-open");

      // Close other open modules
      document.querySelectorAll(".module-details.is-open").forEach((open) => {
        if (open !== details) {
          open.classList.remove("is-open");
          const c = open.closest(".module-card")?.querySelector(".module-chevron");
          if (c) c.textContent = "⌄";
        }
      });

      details.classList.toggle("is-open", !isOpen);
      if (chevron) {
        chevron.textContent = !isOpen ? "⌃" : "⌄";
      }
    });
  });
}



