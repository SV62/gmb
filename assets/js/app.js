(function () {
  const BRANDS = window.BRANDS || [];
  const STORAGE_KEY = "gmb.selectedBrands.v1";

  const state = {
    search: "",
    niche: "all",
    adStatus: "all", // all | Running | Not running
    social: "all", // all | yes
    size: "all", // all | Small | Medium
    selected: loadSelection(),
  };

  const els = {
    search: document.getElementById("search"),
    nicheSelect: document.getElementById("nicheSelect"),
    adPills: document.getElementById("adPills"),
    socialPills: document.getElementById("socialPills"),
    sizePills: document.getElementById("sizePills"),
    brandList: document.getElementById("brandList"),
    resultCount: document.getElementById("resultCount"),
    selectedScroll: document.getElementById("selectedScroll"),
    selectedCount: document.getElementById("selectedCount"),
    exportCsv: document.getElementById("exportCsv"),
    exportBento: document.getElementById("exportBento"),
    clearList: document.getElementById("clearList"),
    listNameInput: document.getElementById("listNameInput"),
    nicheQuickFilters: document.querySelectorAll("[data-niche-quick]"),
  };

  function loadSelection() {
    try {
      return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
    } catch (e) {
      return new Set();
    }
  }

  function saveSelection() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...state.selected]));
  }

  function populateNiches() {
    const niches = [...new Set(BRANDS.map((b) => b.niche))].sort();
    niches.forEach((n) => {
      const opt = document.createElement("option");
      opt.value = n;
      opt.textContent = n;
      els.nicheSelect.appendChild(opt);
    });
  }

  function formatFollowers(n) {
    if (!n) return "0";
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
    return String(n);
  }

  function matchesFilters(b) {
    if (state.niche !== "all" && b.niche !== state.niche) return false;
    if (state.adStatus !== "all" && b.adStatus !== state.adStatus) return false;
    if (state.social === "yes" && !b.hasSocial) return false;
    if (state.size !== "all" && b.size !== state.size) return false;
    if (state.search) {
      const q = state.search.toLowerCase();
      const hay = (b.name + " " + b.niche + " " + b.tags.join(" ") + " " + b.location).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }

  function render() {
    const filtered = BRANDS.filter(matchesFilters);
    els.resultCount.textContent = `${filtered.length} brand${filtered.length === 1 ? "" : "s"} match your filters`;

    if (!filtered.length) {
      els.brandList.innerHTML = `<div class="empty-state">No brands match those filters yet. Try widening your search or clearing a filter.</div>`;
    } else {
      els.brandList.innerHTML = filtered
        .map((b) => {
          const checked = state.selected.has(b.name) ? "checked" : "";
          const adTag =
            b.adStatus === "Running"
              ? `<span class="tag tag-running">Ads running${b.adPlatforms.length ? " · " + b.adPlatforms.join(", ") : ""}</span>`
              : `<span class="tag tag-notrunning">No active ads</span>`;
          const socialTag = b.hasSocial ? `<span class="tag tag-social">Social presence</span>` : "";
          const sizeTag = `<span class="tag tag-size">${b.size}</span>`;
          return `
          <label class="brand-row">
            <input type="checkbox" data-name="${escapeAttr(b.name)}" ${checked} />
            <div>
              <div class="brand-name">${escapeHtml(b.name)}</div>
              <div class="brand-meta">${escapeHtml(b.niche)} · ${escapeHtml(b.location)}</div>
            </div>
            ${adTag}
            ${socialTag}${sizeTag}
            <div class="brand-social">IG ${formatFollowers(b.instagram)}${b.tiktok ? " · TT " + formatFollowers(b.tiktok) : ""}</div>
          </label>`;
        })
        .join("");
    }

    renderSelected();
  }

  function renderSelected() {
    const items = BRANDS.filter((b) => state.selected.has(b.name));
    els.selectedCount.textContent = `${items.length} brand${items.length === 1 ? "" : "s"} in this list`;
    els.selectedScroll.innerHTML = items
      .map(
        (b) => `
        <div class="selected-item">
          <span>${escapeHtml(b.name)}</span>
          <button type="button" data-remove="${escapeAttr(b.name)}" aria-label="Remove ${escapeAttr(b.name)}">&times;</button>
        </div>`
      )
      .join("");
    const disabled = items.length === 0;
    els.exportCsv.disabled = disabled;
    els.exportBento.disabled = disabled;
    els.clearList.disabled = disabled;
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function escapeAttr(str) {
    return escapeHtml(str);
  }

  function csvEscape(val) {
    const s = String(val ?? "");
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }

  function downloadCsv(filename, rows) {
    const csv = rows.map((r) => r.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function selectedBrands() {
    return BRANDS.filter((b) => state.selected.has(b.name));
  }

  function slugify(str) {
    return String(str || "brand-list")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "brand-list";
  }

  function exportPlainCsv() {
    const items = selectedBrands();
    const header = ["Brand", "Niche", "Size", "Ad Status", "Ad Platforms", "Instagram Followers", "TikTok Followers", "Website", "Contact Name", "Contact Email", "Location", "Tags"];
    const rows = items.map((b) => [
      b.name,
      b.niche,
      b.size,
      b.adStatus,
      b.adPlatforms.join(" | "),
      b.instagram,
      b.tiktok,
      b.website,
      b.contactName,
      b.contactEmail,
      b.location,
      b.tags.join(" | "),
    ]);
    downloadCsv(`${slugify(els.listNameInput.value)}.csv`, [header, ...rows]);
  }

  function exportBentoCsv() {
    // Bento's subscriber importer maps arbitrary CSV columns to custom fields
    // during import, so we ship a generic, clearly-labelled column set.
    // "email" is required by Bento and is the only column it auto-matches.
    const items = selectedBrands();
    const header = ["email", "first_name", "tags", "brand_name", "niche", "size", "ad_status", "instagram_followers", "tiktok_followers", "website"];
    const rows = items.map((b) => [
      b.contactEmail,
      b.contactName.split(" ")[0],
      [b.niche, b.size, b.adStatus === "Running" ? "ads-running" : "no-ads", b.hasSocial ? "social-active" : null, ...b.tags]
        .filter(Boolean)
        .map(slugify)
        .join(";"),
      b.name,
      b.niche,
      b.size,
      b.adStatus,
      b.instagram,
      b.tiktok,
      b.website,
    ]);
    downloadCsv(`${slugify(els.listNameInput.value)}-bento.csv`, [header, ...rows]);
  }

  // Events
  els.search.addEventListener("input", (e) => {
    state.search = e.target.value;
    render();
  });
  els.nicheSelect.addEventListener("change", (e) => {
    state.niche = e.target.value;
    render();
  });
  els.adPills.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    state.adStatus = btn.dataset.value;
    [...els.adPills.children].forEach((c) => c.classList.toggle("active", c === btn));
    render();
  });
  els.socialPills.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    state.social = btn.dataset.value;
    [...els.socialPills.children].forEach((c) => c.classList.toggle("active", c === btn));
    render();
  });
  els.sizePills.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    state.size = btn.dataset.value;
    [...els.sizePills.children].forEach((c) => c.classList.toggle("active", c === btn));
    render();
  });
  els.brandList.addEventListener("change", (e) => {
    const cb = e.target.closest("input[type=checkbox]");
    if (!cb) return;
    if (cb.checked) state.selected.add(cb.dataset.name);
    else state.selected.delete(cb.dataset.name);
    saveSelection();
    renderSelected();
  });
  els.selectedScroll.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-remove]");
    if (!btn) return;
    state.selected.delete(btn.dataset.remove);
    saveSelection();
    render();
  });
  els.clearList.addEventListener("click", () => {
    state.selected.clear();
    saveSelection();
    render();
  });
  els.exportCsv.addEventListener("click", exportPlainCsv);
  els.exportBento.addEventListener("click", exportBentoCsv);
  els.nicheQuickFilters.forEach((el) =>
    el.addEventListener("click", () => {
      els.nicheSelect.value = el.dataset.nicheQuick;
      state.niche = el.dataset.nicheQuick;
      document.getElementById("explorer").scrollIntoView({ behavior: "smooth" });
      render();
    })
  );

  populateNiches();
  render();
})();
