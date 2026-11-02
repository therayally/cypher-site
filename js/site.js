/* Cypher, LLC site behavior: header, mobile menu, hero slider, scroll reveals,
   count-ups and parallax. No libraries. Every effect uses transform/opacity
   only and is skipped when the visitor prefers reduced motion. With JavaScript
   off, all content is visible and the first slide shows. */
(function () {
  "use strict";
  var doc = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Header: solid background and smaller after scrolling ---- */
  var header = document.querySelector(".site-header");
  var menuBtn = document.querySelector(".menu-btn");
  var nav = document.getElementById("site-nav");
  var alwaysSolid = header && header.hasAttribute("data-solid");
  function setHeader() {
    if (!header) return;
    var open = nav && nav.classList.contains("open");
    header.classList.toggle("solid", alwaysSolid || open || window.scrollY > 24);
  }
  if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
      setHeader();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) { nav.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); menuBtn.focus(); setHeader(); }
    });
  }

  /* ---- Parallax on background layers marked data-parallax="0.15" ---- */
  var par = reduce ? [] : Array.prototype.slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      setHeader();
      var vh = window.innerHeight;
      par.forEach(function (el) {
        var host = el.parentElement.getBoundingClientRect();
        if (host.bottom < 0 || host.top > vh) return;
        var f = parseFloat(el.getAttribute("data-parallax")) || 0.15;
        el.style.transform = "translate3d(0," + (-host.top * f).toFixed(1) + "px,0)";
      });
      ticking = false;
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();

  /* ---- Count-up for real numbers: <b data-count="2009" data-from="1990">2009</b> ---- */
  function countUp(el) {
    var end = parseFloat(el.getAttribute("data-count"));
    var from = parseFloat(el.getAttribute("data-from") || "0");
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce || isNaN(end)) return;
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(from + (end - from) * e) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---- Scroll reveals (staggered via --i) ---- */
  var revealEls = document.querySelectorAll(".reveal, .tilt-in, [data-count]");
  if (!reduce && "IntersectionObserver" in window) {
    doc.classList.add("motion");
    document.querySelectorAll("[data-stagger]").forEach(function (group) {
      Array.prototype.forEach.call(group.children, function (c, i) { c.style.setProperty("--i", i % 8); });
    });
    revealEls = document.querySelectorAll(".reveal, .tilt-in, [data-count], [data-stagger] > *");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        if (en.target.hasAttribute("data-count")) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---- Hero slider ---- */
  var slider = document.querySelector(".slider");
  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll(".slide"));
    var dotsBox = slider.querySelector(".dots-nav");
    var countEl = slider.querySelector(".slide-count b");
    var playBtn = slider.querySelector("[data-play]");
    var DELAY = 7000, idx = 0, timer = null, playing = !reduce, hovered = false;
    slider.style.setProperty("--dur", DELAY + "ms");
    var dots = slides.map(function (s, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Show slide " + (i + 1) + " of " + slides.length);
      b.addEventListener("click", function () { go(i, true); });
      dotsBox.appendChild(b);
      return b;
    });
    function go(i, user) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) {
        var on = n === idx;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", on ? "false" : "true");
        if (on) s.removeAttribute("inert"); else s.setAttribute("inert", "");
      });
      dots.forEach(function (d, n) { d.setAttribute("aria-current", n === idx ? "true" : "false"); });
      if (countEl) countEl.textContent = String(idx + 1).padStart(2, "0");
      restart(user);
    }
    function restart() {
      clearTimeout(timer);
      // re-trigger the progress bar animation
      slider.classList.remove("playing"); void slider.offsetWidth;
      if (playing && !hovered) { slider.classList.add("playing"); timer = setTimeout(function () { go(idx + 1); }, DELAY); }
    }
    function setPlaying(p) {
      playing = p;
      if (playBtn) {
        playBtn.setAttribute("aria-label", p ? "Pause slideshow" : "Play slideshow");
        playBtn.querySelector(".i-pause").style.display = p ? "" : "none";
        playBtn.querySelector(".i-play").style.display = p ? "none" : "";
      }
      restart();
    }
    slider.querySelector("[data-prev]").addEventListener("click", function () { go(idx - 1, true); });
    slider.querySelector("[data-next]").addEventListener("click", function () { go(idx + 1, true); });
    if (playBtn) playBtn.addEventListener("click", function () { setPlaying(!playing); });
    slider.addEventListener("mouseenter", function () { hovered = true; restart(); });
    slider.addEventListener("mouseleave", function () { hovered = false; restart(); });
    slider.addEventListener("focusin", function () { hovered = true; restart(); });
    slider.addEventListener("focusout", function (e) { if (!slider.contains(e.relatedTarget)) { hovered = false; restart(); } });
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { go(idx - 1, true); e.preventDefault(); }
      if (e.key === "ArrowRight") { go(idx + 1, true); e.preventDefault(); }
    });
    setPlaying(playing);
    go(0);
  }

  /* ---- Capabilities page: highlight the section in view in the sub-navigation ---- */
  var sub = document.querySelectorAll(".subnav a");
  if (sub.length && "IntersectionObserver" in window) {
    var map = {};
    sub.forEach(function (a) { map[a.getAttribute("href").slice(1)] = a; });
    var so = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && map[en.target.id]) { sub.forEach(function (a) { a.classList.remove("on"); }); map[en.target.id].classList.add("on"); }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) so.observe(el); });
  }
})();
