/* Contact form: sends through FormSubmit without leaving the page.
   The receiving address is the data-email attribute on <form id="contact-form">
   in contact.html. Without JavaScript the form posts normally to the address
   in its action attribute, so keep both the same. */
(function () {
  "use strict";
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (!form || !window.fetch || !window.FormData) return;
  var email = (form.getAttribute("data-email") || "").trim();
  if (email) form.action = "https://formsubmit.co/" + encodeURIComponent(email);

  function thanks() {
    form.innerHTML = '<div class="sent" tabindex="-1"><h2 style="font-size:1.5rem;margin-bottom:.4rem">Thank you. Your message was sent.</h2>' +
      "<p>We will reply by email. For anything urgent, call (571) 206-1401.</p></div>";
    form.querySelector(".sent").focus();
  }
  // Coming back from the no-JavaScript route (FormSubmit sends people to ?sent=1)
  if (/[?&]sent=1/.test(location.search)) { thanks(); return; }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.querySelector('[name="_honey"]').value) return;          // a bot filled the hidden field
    if (!form.checkValidity()) { form.reportValidity(); return; }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; status.className = "status"; status.textContent = "Sending...";
    fetch("https://formsubmit.co/ajax/" + encodeURIComponent(email), {
      method: "POST", headers: { Accept: "application/json" }, body: new FormData(form)
    })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && (res.j.success === true || res.j.success === "true")) { thanks(); return; }
        throw new Error((res.j && res.j.message) || "not sent");
      })
      .catch(function () {
        btn.disabled = false; status.className = "status err";
        status.textContent = "Sorry, the message did not send. Please try again, or email " + email + " directly.";
      });
  });
})();
