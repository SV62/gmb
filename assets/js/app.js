// Upload & enrich preview
(function () {
  const dropzone = document.getElementById("dropzone");
  const fileInput = document.getElementById("fileInput");
  const uploadPreview = document.getElementById("uploadPreview");
  const uploadSummary = document.getElementById("uploadSummary");
  const previewTable = document.getElementById("previewTable");
  const uploadReset = document.getElementById("uploadReset");
  const emailListBtn = document.getElementById("emailListBtn");
  if (!dropzone) return;

  const ENRICH_COLUMNS = ["Niche", "Location", "Why It's a Fit", "LinkedIn Contact"];
  const PREVIEW_ROWS = 8;

  function splitCsvLine(line) {
    const cells = [];
    let cur = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          cur += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          cur += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        cells.push(cur);
        cur = "";
      } else {
        cur += ch;
      }
    }
    cells.push(cur);
    return cells.map((c) => c.trim());
  }

  function parseCsv(text) {
    return text
      .split(/\r\n|\n/)
      .filter((line) => line.trim().length)
      .map(splitCsvLine);
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function renderPreview(rows, filename) {
    const header = rows[0];
    const dataRows = rows.slice(1, 1 + PREVIEW_ROWS);
    const totalRows = rows.length - 1;
    const headerLower = header.map((h) => h.trim().toLowerCase());
    const missingColumns = ENRICH_COLUMNS.filter((c) => !headerLower.includes(c.toLowerCase()));

    let html = "<thead><tr>";
    header.forEach((h) => (html += `<th>${escapeHtml(h)}</th>`));
    missingColumns.forEach((c) => (html += `<th>${escapeHtml(c)}</th>`));
    html += "</tr></thead><tbody>";
    dataRows.forEach((row) => {
      html += "<tr>";
      header.forEach((_, i) => (html += `<td>${escapeHtml(row[i] || "")}</td>`));
      missingColumns.forEach(() => (html += `<td class="pending">Pending</td>`));
      html += "</tr>";
    });
    html += "</tbody>";
    previewTable.innerHTML = html;

    uploadSummary.textContent = `${filename} — ${totalRows} brand${totalRows === 1 ? "" : "s"} (showing first ${Math.min(totalRows, PREVIEW_ROWS)})`;
    dropzone.hidden = true;
    uploadPreview.hidden = false;

    const subject = encodeURIComponent(`Enrich my brand list — ${filename}`);
    const body = encodeURIComponent(`Hi GetMeBrands,\n\nI'd like this list enriched (${totalRows} brands). Attaching the file separately.\n\nThanks!`);
    emailListBtn.href = `mailto:hello@getmebrands.com?subject=${subject}&body=${body}`;
  }

  function handleFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const rows = parseCsv(String(reader.result));
      if (rows.length < 1) return;
      renderPreview(rows, file.name);
    };
    reader.readAsText(file);
  }

  dropzone.addEventListener("click", () => fileInput.click());
  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener("change", (e) => handleFile(e.target.files[0]));

  ["dragenter", "dragover"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    })
  );
  dropzone.addEventListener("drop", (e) => handleFile(e.dataTransfer.files[0]));

  uploadReset.addEventListener("click", () => {
    uploadPreview.hidden = true;
    dropzone.hidden = false;
    fileInput.value = "";
  });
})();

// Pricing "I'm interested" buttons — mailto depends on the visitor having a
// default mail app configured, which isn't guaranteed, so always show a
// visible, copyable fallback too rather than relying on mailto alone.
(function () {
  const buttons = document.querySelectorAll(".interest-btn");
  if (!buttons.length) return;

  const EMAIL = "hello@getmebrands.com";

  buttons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const tier = btn.dataset.tier || "";
      const subject = encodeURIComponent(`Interested: ${tier}`);
      const body = encodeURIComponent(`Hi GetMeBrands,\n\nI'm interested in the ${tier}. My niche is: `);
      const mailtoUrl = `mailto:${EMAIL}?subject=${subject}&body=${body}`;

      const fallback = btn.nextElementSibling;
      let copied = false;
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(EMAIL);
          copied = true;
        } catch (e) {
          copied = false;
        }
      }

      if (fallback && fallback.classList.contains("interest-fallback")) {
        fallback.textContent = copied
          ? `Opening your email app… didn't work? ${EMAIL} is copied — paste it into any email app.`
          : `Opening your email app… didn't work? Email us directly at ${EMAIL}.`;
        fallback.hidden = false;
      }

      window.location.href = mailtoUrl;
    });
  });
})();
