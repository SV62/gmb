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
