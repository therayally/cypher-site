/* Lays out the capabilities statement from js/capabilities-data.js.
   You should not need to edit this file to change any wording. */
(function () {
  "use strict";
  var D = window.CYPHER_STATEMENT;
  var root = document.getElementById("sheets");
  if (!D || !root) return;
  var C = D.company || {};
  var PAGES = 6;

  // Escape text, then mark [EDIT: ...] placeholders and **green** words.
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function t(s) {
    s = esc(s).replace(/\[EDIT:\s*([^\]]*)\]/g, function (m, what) {
      return '<span class="edit" title="Placeholder: fill in js/capabilities-data.js"><b>Edit</b>' + what + "</span>";
    });
    return s.replace(/\*\*(.+?)\*\*/g, "<em>$1</em>");
  }
  function digits(p) { var d = String(p).replace(/[^0-9]/g, ""); return d.length === 10 ? "+1" + d : d; }
  function icon(name) { return '<svg aria-hidden="true" focusable="false"><use href="#i-' + name + '"/></svg>'; }
  function bg(url) { return url ? ' style="background-image:url(\'' + esc(url) + '\')"' : ""; }
  function each(arr, fn) { return (arr || []).map(fn).join(""); }
  function li(s) { return "<li>" + t(s) + "</li>"; }
  function tel(p) { return '<a href="tel:' + digits(p) + '">' + t(p) + "</a>"; }
  function web() { return '<a href="https://' + esc(C.website) + '">' + t(C.website) + "</a>"; }

  // Section heading with an icon, as in the original statement.
  function head(ic, text, cls) {
    return '<h2 class="hd' + (cls ? " " + cls : "") + '"><span class="hi">' + icon(ic) + "</span><span>" + t(text) + "</span></h2>";
  }
  // Dark bar heading (offerings, contract vehicles, customers).
  function bar(text) { return '<h3 class="bar">' + t(text) + "</h3>"; }

  function foot(n) {
    return '<footer class="pfoot"><span><b>' + t(C.legalName) + "</b>" +
      "<i>UEI " + t(C.uei) + "</i><i>CAGE " + t(C.cage) + "</i><i>" + web() + "</i><i>" + tel(C.phone) + "</i></span>" +
      "<span>" + t(D.documentTitle) + " &middot; " + n + " of " + PAGES + "</span></footer>";
  }
  // Dark photo band with an angled cut. side = "r" (cut on the right) or "l".
  function band(photo, side, inner, cls) {
    return '<header class="band cut-' + side + (cls ? " " + cls : "") + '">' +
      '<div class="ph"' + bg(photo) + "></div><div class=\"shade\"></div>" +
      '<div class="sliver"></div><div class="stripe"></div>' +
      '<img class="blogo" src="assets/img/cypher-logo-white.svg" alt="">' +
      '<div class="band-in">' + inner + "</div></header>";
  }

  /* ---------------- Page 1: cover ---------------- */
  var cv = D.cover || {};
  var codes = (D.naics || []).map(function (n) { return esc(n.code); }).join(", ");
  var p1 =
    '<article class="sheet cover" aria-label="Page 1, cover">' +
      '<div class="cv-photo"' + bg(cv.photo) + "></div><div class=\"cv-shade\"></div>" +
      '<div class="cv-white"></div><div class="cv-sliver"></div><div class="cv-green"></div>' +
      '<div class="cv-low1"></div><div class="cv-low2"></div>' +
      '<img class="cv-logo" src="assets/img/cypher-logo.svg" alt="Cypher">' +
      '<p class="cv-doc"><span>' + t(D.documentTitle) + "</span>" + t(D.documentDate) + "</p>" +
      '<div class="cv-title fit"><p class="kick">' + t(C.legalName) + " &middot; " + t(C.socioEconomic) + "</p>" +
        "<h1><span>" + t(cv.titleLine1) + "</span><span>" + t(cv.titleLine2) + "</span></h1>" +
        (cv.leadLine ? '<p class="cv-lead">' + t(cv.leadLine) + "</p>" : "") + "</div>" +
      '<ul class="cv-contact"><li>' + icon("globe") + web() + "</li><li>" + icon("phone") + tel(C.phone) + "</li>" +
        "<li>" + icon("pin") + "<span>" + t(C.addressLine1) + "<br>" + t(C.addressLine2) + "</span></li></ul>" +
      '<div class="cv-ids fit"><p class="ids"><span><small>UEI</small>' + t(C.uei) + "</span><span><small>CAGE</small>" + t(C.cage) + "</span></p>" +
        '<p class="nk">' + t(C.socioEconomic) + " &middot; " + t(C.businessSize) + " under NAICS</p>" +
        '<p class="codes">' + codes + "</p></div>" +
    "</article>";

  /* ---------------- Page 2: Cypher in focus ---------------- */
  var F = D.focus || {};
  var p2 =
    '<article class="sheet inner p-focus" aria-label="Page 2, Cypher in focus">' +
      band(F.photo, "l",
        "<h1>" + t(F.title) + "</h1>" + (F.tagline ? '<p class="btag">' + t(F.tagline) + "</p>" : ""), "tall") +
      (F.badge ? '<p class="cleared"><span class="ck">' + icon("check") + "</span><span>" + t(F.badge) + "</span></p>" : "") +
      '<div class="pbody fit"><div class="cols-focus">' +
        '<div class="col-main fit">' +
          head("doc", "Summary") +
          '<p class="meta">Founded in ' + t(C.founded) + " &middot; Headquarters in " + t(C.addressLine2) + "</p>" +
          each(D.overview, function (p) { return '<p class="para">' + t(p) + "</p>"; }) +
          head("award", "Why Cypher") +
          '<ol class="diff">' + each(D.differentiators, function (d) {
            return "<li><span><b>" + t(d.lead) + "</b> " + t(d.text) + "</span></li>";
          }) + "</ol>" +
          (F.figures && F.figures.length ? '<ul class="figs">' + each(F.figures, function (f) {
            return "<li><b>" + t(f.big) + "</b><span>" + t(f.small) + "</span></li>";
          }) + "</ul>" : "") +
        "</div>" +
        '<aside class="col-panel fit">' +
          head("layers", "Core competencies") +
          '<ul class="comp">' + each(D.competencies, function (c) {
            return "<li><h3>" + icon("chev") + t(c.title) + "</h3><p>" + t(c.text) + "</p></li>";
          }) + "</ul>" +
        "</aside>" +
      "</div></div>" + foot(2) +
    "</article>";

  /* ---------------- Page 3: our goal, adaptive services, company data ---------------- */
  function dataRow(label, value) {
    if (!value) return "";
    return "<div><dt>" + label + "</dt><dd>" + value + "</dd></div>";
  }
  var p3 =
    '<article class="sheet inner p-goal" aria-label="Page 3, our goal and company data">' +
      band(D.goalPhoto, "r",
        "<h1>Our goal</h1>" +
        (D.goal ? '<blockquote class="goal"><p>&ldquo;' + t(D.goal) + "&rdquo;</p></blockquote>" : ""), "goal-band") +
      '<div class="pbody fit">' +
        '<section class="adaptive"><div class="ph"' + bg(D.adaptivePhoto) + '></div>' +
          '<div class="ad-in"><h2 class="hd on-dark"><span class="hi">' + icon("target") + "</span><span>Highly adaptive services</span></h2>" +
          '<ul class="adapt">' + each(D.adaptiveServices, function (s) { return "<li>" + icon("chev") + "<span>" + t(s) + "</span></li>"; }) + "</ul></div>" +
        "</section>" +
        '<div class="cols-data">' +
          "<section>" + head("id", "Company data") +
            '<dl class="cdata">' +
              dataRow("Legal name", t(C.legalName)) + dataRow("UEI", t(C.uei)) + dataRow("CAGE", t(C.cage)) +
              dataRow("Founded", t(C.founded)) + dataRow("Size", t(C.businessSize)) + dataRow("Status", t(C.socioEconomic)) +
              dataRow("Clearance", t(C.facilityClearance)) +
              dataRow("HQ", t(C.addressLine1) + "<br>" + t(C.addressLine2)) +
            "</dl></section>" +
          "<section>" + head("hash", "NAICS codes") +
            '<ul class="naics">' + each(D.naics, function (n) {
              return "<li><b>" + t(n.code) + "</b><span>" + t(n.title) + "</span></li>";
            }) + "</ul></section>" +
        "</div>" +
      "</div>" + foot(3) +
    "</article>";

  /* ---------------- Page 4: offerings ---------------- */
  function rowsOf(o) {
    var cols = o.columns || 1, long = 0;
    (o.items || []).forEach(function (s) { if (String(s).length > 38) long += 1; });
    return Math.ceil((o.items || []).length / cols) + long;
  }
  function area(o) {
    return '<section class="oa cols-' + (o.columns || 1) + '">' + bar(o.area) + "<ul>" + each(o.items, li) + "</ul></section>";
  }
  // Half-width areas go into a left and a right stack (whichever is shorter);
  // a full-width area closes the current pair of stacks.
  var offerHtml = "", L = [], R = [], lh = 0, rh = 0;
  function flush() {
    if (L.length || R.length) offerHtml += '<div class="pair"><div>' + L.join("") + "</div><div>" + R.join("") + "</div></div>";
    L = []; R = []; lh = rh = 0;
  }
  (D.offerings || []).forEach(function (o) {
    if (o.width === "full") { flush(); offerHtml += '<div class="full">' + area(o) + "</div>"; return; }
    var h = rowsOf(o) + 2;
    if (lh <= rh) { L.push(area(o)); lh += h; } else { R.push(area(o)); rh += h; }
  });
  flush();
  var p4 =
    '<article class="sheet inner p-offer" aria-label="Page 4, offerings in detail">' +
      band(D.offeringsPhoto, "l", "<h1>" + t(D.offeringsTitle) + "</h1>" + (D.offeringsTagline ? '<p class="btag">' + t(D.offeringsTagline) + "</p>" : ""), "short") +
      '<div class="pbody fit"><div class="offer">' + offerHtml + "</div></div>" + foot(4) +
    "</article>";

  /* ---------------- Page 5: products ---------------- */
  var p5 =
    '<article class="sheet inner p-prod" aria-label="Page 5, products">' +
      band(D.productsPhoto, "r", "<h1>Products</h1><p class=\"btag\">Software built by Cypher</p>", "short") +
      '<div class="pbody fit">' +
        each(D.products, function (p, i) {
          return '<section class="prod' + (i % 2 ? " flip" : "") + '">' +
            '<div class="ptext">' +
              (p.logo ? '<img class="plogo" src="' + esc(p.logo) + '" alt="' + esc(p.name) + '">' : "") +
              '<p class="para"><b>' + t(p.name) + (/\.$/.test(p.name) ? "" : ".") + "</b> " + t(p.text) + "</p>" +
              (p.points && p.points.length ? '<ul class="pchecks">' + each(p.points, function (s) { return "<li>" + icon("check") + "<span>" + t(s) + "</span></li>"; }) + "</ul>" : "") +
              (p.link ? '<p class="plink"><a href="' + esc(p.link) + '">' + t(p.linkText || p.link) + " " + icon("arrow") + "</a></p>" : "") +
            "</div>" +
            (p.screenshot ? '<figure class="device laptop mocked"><img src="' + esc(p.screenshot.replace(/^assets\/img\/([a-z-]+)\.jpg$/, "assets/img/mock/$1-macbook.webp")) + '" alt="' + esc(p.name) + ' screen"></figure>' : "") +
          "</section>";
        }) +
        (D.howToBuy ? '<p class="pbuy"><span class="bi">' + icon("bag") + "</span><span><b>How to buy.</b> " + t(D.howToBuy) + "</span></p>" : "") +
      "</div>" +
      (D.productsFooterPhoto ? '<div class="strip"' + bg(D.productsFooterPhoto) + "></div>" : "") +
      foot(5) +
    "</article>";

  /* ---------------- Page 6: corporate capabilities ---------------- */
  function veh(v) {
    return "<li><span>" + t(v.name) + "</span>" + (v.note ? "<small>" + t(v.note) + "</small>" : "") + "</li>";
  }
  var p6 =
    '<article class="sheet inner p-corp" aria-label="Page 6, corporate capabilities">' +
      band(D.corporatePhoto, "r", "<h1>Corporate<br>capabilities</h1>", "short") +
      '<div class="pbody fit"><div class="cols-corp">' +
        '<div class="col-main fit">' +
          '<section class="blk">' + bar("Prime contract vehicles") + '<ul class="vlist two">' + each(D.primeVehicles, veh) + "</ul></section>" +
          '<section class="blk">' + bar("Subcontract vehicles") + '<ul class="vlist two">' + each(D.subVehicles, veh) + "</ul></section>" +
          '<section class="blk">' + bar("Customers") + '<ul class="blist two">' + each(D.customers, li) + "</ul></section>" +
          '<section class="blk">' + bar("Certifications") + '<ul class="certs">' + each(D.certifications, function (c) {
            if (typeof c === "string") c = { name: c, badge: "" };
            return "<li>" + (c.badge ? '<span class="bdg"><img src="' + esc(c.badge) + '" alt=""></span>' : "") + "<span>" + t(c.name) + "</span></li>";
          }) + "</ul></section>" +
        "</div>" +
        '<aside class="col-side fit">' +
          '<h2 class="sbox">Partners</h2>' +
          '<ul class="prt">' + each(D.partners, function (p) {
            if (typeof p === "string") p = { name: p };
            return "<li" + (p.note ? ' class="wide"' : "") + ">" +
              (p.logo ? '<span class="ptile"><img src="' + esc(p.logo) + '" alt="' + esc(p.name) + '"></span>' : "<b>" + t(p.name) + "</b>") +
              (p.note ? "<small>" + t(p.note) + "</small>" : "") + "</li>";
          }) + "</ul>" +
          '<h2 class="sbox">Contact us</h2>' +
          '<div class="addr"><p>' + t(C.addressLine1) + "<br>" + t(C.addressLine2) + "</p><p>" + tel(C.phone) + "<br>" + web() + "</p></div>" +
          '<ul class="ppl">' + each(D.contacts, function (c) {
            return "<li><b>" + t(c.name) + "</b>" + (c.credentials ? "<span>" + t(c.credentials) + "</span>" : "") +
              '<span class="role">' + t(c.title) + "</span>" +
              '<a href="mailto:' + esc(c.email) + '">' + t(c.email) + "</a>" + tel(c.phone) + "</li>";
          }) + "</ul>" +
        "</aside>" +
      "</div></div>" + foot(6) +
    "</article>";

  root.innerHTML = p1 + p2 + p3 + p4 + p5 + p6;

  // Warn on screen if any part of a page is too full (text would be cut off).
  // Only checked when the pages are shown at full size (not the phone layout).
  function check() {
    var msgs = [];
    var stacked = window.matchMedia && window.matchMedia("screen and (max-width: 879px)").matches;
    if (!stacked) {
      Array.prototype.forEach.call(root.querySelectorAll(".sheet"), function (sh, i) {
        var bad = [];
        Array.prototype.forEach.call(sh.querySelectorAll(".fit"), function (el) {
          if (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1) {
            var h = el.querySelector("h1, h2, h3");
            bad.push(h ? h.textContent.trim() : "page body");
          }
        });
        if (bad.length) msgs.push("Page " + (i + 1) + " is too full (near “" + bad[0] + "”). Shorten some text in js/capabilities-data.js.");
      });
    }
    var box = document.getElementById("fit-warning");
    if (box) { box.hidden = !msgs.length; box.textContent = msgs.join(" "); }
    document.documentElement.setAttribute("data-overflow", stacked ? "unknown" : (msgs.length ? "yes" : "no"));
  }
  function run() { check(); }
  window.addEventListener("resize", run);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(run);
  window.addEventListener("load", run);
})();
