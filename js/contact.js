// ============================================================
// Abdul Haseeb — Contact page script
// Basic client-side validation + success state.
// This form is not yet wired to a backend — it will be
// connected once the Admin Panel / backend is built.
// ============================================================

(function () {
  "use strict";

  var form = document.getElementById("contactForm");
  var success = document.getElementById("formSuccess");

  if (!form || !success) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    form.classList.add("is-hidden");
    success.classList.add("is-active");
  });
})();
