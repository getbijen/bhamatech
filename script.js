/* ==========================================================================
   Kevalabodh.ai — site behaviour
   ========================================================================== */

/* ---- config: set ONE of these to make the contact form actually deliver ---- */
const FORM_ENDPOINT = "";   // e.g. a Formspree / Getform URL: "https://formspree.io/f/xxxxxxx"
const CONTACT_EMAIL = "";   // or an address: opens the visitor's mail app pre-filled
const CALENDLY_URL  = "https://calendly.com/sharma-bijender/30min";

(function () {
  "use strict";

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;

  /* ---------- logo fallback (if the PNG is missing) ---------- */
  const brandImg = $("#brandImg");
  const showFallbackLogo = () => {
    brandImg.style.display = "none";
    $(".logo-fallback").style.display = "block";
  };
  if (brandImg) {
    if (brandImg.complete && brandImg.naturalWidth === 0) showFallbackLogo();
    brandImg.addEventListener("error", showFallbackLogo);
  }

  /* ---------- header: solid after scroll + progress bar + back-to-top ---------- */
  const header = $("#header");
  const progress = $("#progress");
  const toTop = $("#toTop");
  function onScroll() {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = "scaleX(" + (max > 0 ? Math.min(1, y / max) : 0) + ")";
    toTop.classList.toggle("show", y > 700);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- theme toggle ---------- */
  $("#themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("kb-theme", next); } catch (e) {}
  });

  /* ---------- hover menus (open on hover, close shortly after leaving; never "stick") ---------- */
  const menus = $$(".has-menu");
  const mobileMq = window.matchMedia("(max-width: 980px)");
  let lastPointer = "mouse";

  function openMenu(li) {
    menus.forEach(o => { if (o !== li) closeMenu(o); });
    clearTimeout(li._t);
    li.classList.add("open");
    $(".nav-link", li).setAttribute("aria-expanded", "true");
  }
  function closeMenu(li) {
    clearTimeout(li._t);
    li.classList.remove("open");
    $(".nav-link", li).setAttribute("aria-expanded", "false");
  }
  const closeAll = () => menus.forEach(closeMenu);

  menus.forEach(li => {
    const btn = $(".nav-link", li);
    li.addEventListener("pointerenter", e => {
      if (e.pointerType !== "mouse" || mobileMq.matches) return;
      openMenu(li);
    });
    li.addEventListener("pointerleave", e => {
      if (e.pointerType !== "mouse" || mobileMq.matches) return;
      li._t = setTimeout(() => closeMenu(li), 160);
    });
    btn.addEventListener("pointerdown", e => { lastPointer = e.pointerType; });
    btn.addEventListener("click", () => {
      // with a mouse the menu is already open from hover: keep it open instead of toggling it shut
      if (lastPointer === "mouse" && !mobileMq.matches && li.classList.contains("open")) return;
      li.classList.contains("open") ? closeMenu(li) : openMenu(li);
    });
    // keyboard: close when focus leaves the whole item
    li.addEventListener("focusout", e => { if (!li.contains(e.relatedTarget)) closeMenu(li); });
    // choosing a link always closes the menu and drops focus, so nothing stays open
    $$(".menu a", li).forEach(a => a.addEventListener("click", () => { closeAll(); a.blur(); closeMobileNav(); }));
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") { closeAll(); closeMobileNav(); } });
  document.addEventListener("click", e => { if (!e.target.closest(".has-menu")) closeAll(); });

  /* ---------- mobile nav ---------- */
  const burger = $("#burger");
  function closeMobileNav() {
    document.body.classList.remove("nav-open");
    burger.setAttribute("aria-expanded", "false");
  }
  burger.addEventListener("click", () => {
    const open = document.body.classList.toggle("nav-open");
    burger.setAttribute("aria-expanded", String(open));
    if (open) header.classList.add("is-solid"); else onScroll();
  });
  $$(".nav > ul > li > a.nav-link, .nav .cta").forEach(a => a.addEventListener("click", closeMobileNav));
  mobileMq.addEventListener("change", () => { closeAll(); closeMobileNav(); });

  /* ---------- hero: rotating headline ---------- */
  const items = $$(".rot-item");
  const dots = $$("#rotDots button");
  const ROT_MS = 5200;
  let cur = 0, timer = null;
  root.style.setProperty("--rot-time", ROT_MS + "ms");

  function show(n) {
    if (n === cur && items[n].classList.contains("is-active")) return;
    const prev = items[cur];
    prev.classList.remove("is-active");
    prev.classList.add("is-leaving");
    prev.setAttribute("aria-hidden", "true");
    setTimeout(() => prev.classList.remove("is-leaving"), 850);
    cur = n;
    items[cur].classList.add("is-active");
    items[cur].setAttribute("aria-hidden", "false");
    dots.forEach((d, i) => {
      d.classList.remove("is-active", "is-done");
      void d.offsetWidth; // restart the fill animation
      if (i === cur) d.classList.add("is-active");
      else if (i < cur) d.classList.add("is-done");
    });
  }
  function next() { show((cur + 1) % items.length); }
  function startRot() { if (reduceMotion) return; stopRot(); timer = setInterval(next, ROT_MS); }
  function stopRot() { clearInterval(timer); }
  dots.forEach((d, i) => d.addEventListener("click", () => { show(i); startRot(); }));
  startRot();
  document.addEventListener("visibilitychange", () => document.hidden ? stopRot() : startRot());

  /* ---------- hero: animated network canvas ---------- */
  const canvas = $("#network");
  const ctx = canvas.getContext("2d");
  let W = 0, H = 0, DPR = 1, pts = [], raf = null, heroVisible = true;
  const mouse = { x: -9999, y: -9999 };

  function sizeCanvas() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    W = r.width; H = r.height;
    canvas.width = W * DPR; canvas.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    const count = Math.max(34, Math.min(90, Math.round((W * H) / 16000)));
    pts = Array.from({ length: count }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 1.6 + .7, hue: Math.random() < .5 ? 172 : 238
    }));
  }
  function frame() {
    ctx.clearRect(0, 0, W, H);
    const LINK = 135;
    for (let i = 0; i < pts.length; i++) {
      const p = pts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < -10) p.x = W + 10; if (p.x > W + 10) p.x = -10;
      if (p.y < -10) p.y = H + 10; if (p.y > H + 10) p.y = -10;
      // gentle pull towards the cursor
      const dx = mouse.x - p.x, dy = mouse.y - p.y, d2 = dx * dx + dy * dy;
      if (d2 < 22000) { p.x += dx * .0016; p.y += dy * .0016; }
      for (let j = i + 1; j < pts.length; j++) {
        const q = pts[j], ax = p.x - q.x, ay = p.y - q.y, dd = ax * ax + ay * ay;
        if (dd < LINK * LINK) {
          const a = (1 - Math.sqrt(dd) / LINK) * .42;
          ctx.strokeStyle = "hsla(" + p.hue + ",80%,70%," + a + ")";
          ctx.lineWidth = .8;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
      ctx.fillStyle = "hsla(" + p.hue + ",85%,75%,.85)";
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832); ctx.fill();
    }
    raf = requestAnimationFrame(frame);
  }
  function startCanvas() { if (!raf && !reduceMotion && heroVisible) raf = requestAnimationFrame(frame); }
  function stopCanvas() { cancelAnimationFrame(raf); raf = null; }
  sizeCanvas();
  if (reduceMotion) { frame(); stopCanvas(); } else startCanvas();
  let rz; window.addEventListener("resize", () => { clearTimeout(rz); rz = setTimeout(sizeCanvas, 150); });
  $("#hero").addEventListener("pointermove", e => {
    const r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  $("#hero").addEventListener("pointerleave", () => { mouse.x = mouse.y = -9999; });
  new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; heroVisible ? startCanvas() : stopCanvas(); }).observe($("#hero"));

  /* ---------- marquee: clone the group so it loops seamlessly ---------- */
  const track = $("#marqueeTrack");
  const group = $(".marquee-group", track);
  track.appendChild(group.cloneNode(true));

  /* ---------- offerings: tabs ---------- */
  const tabs = $$(".tab");
  const panels = $$(".panel");
  function selectTab(key, focus) {
    tabs.forEach(t => {
      const on = t.dataset.key === key;
      t.setAttribute("aria-selected", String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && focus) t.focus();
    });
    panels.forEach(p => {
      const on = p.id === "offering-" + key;
      p.hidden = !on;
      p.classList.toggle("is-active", on);
    });
  }
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => selectTab(t.dataset.key));
    t.addEventListener("keydown", e => {
      const k = e.key;
      if (!["ArrowDown", "ArrowRight", "ArrowUp", "ArrowLeft", "Home", "End"].includes(k)) return;
      e.preventDefault();
      let n = i;
      if (k === "ArrowDown" || k === "ArrowRight") n = (i + 1) % tabs.length;
      if (k === "ArrowUp" || k === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
      if (k === "Home") n = 0; if (k === "End") n = tabs.length - 1;
      selectTab(tabs[n].dataset.key, true);
    });
  });
  // links elsewhere (menus, footer) that point at a specific offering
  $$("[data-offer]").forEach(a => a.addEventListener("click", () => selectTab(a.dataset.offer)));

  /* ---------- reveal on scroll + counters + process line ---------- */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.classList.add("in");
      io.unobserve(en.target);
    });
  }, { threshold: .14, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach(el => io.observe(el));

  const counters = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, end = +el.dataset.count, pre = el.dataset.prefix || "", suf = el.dataset.suffix || "";
      counters.unobserve(el);
      if (reduceMotion) { el.textContent = pre + end + suf; return; }
      const t0 = performance.now(), dur = 1400;
      (function tick(t) {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = pre + Math.round(end * e) + suf;
        if (p < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: .6 });
  $$("[data-count]").forEach(el => { el.textContent = (el.dataset.prefix || "") + "0" + (el.dataset.suffix || ""); counters.observe(el); });

  const steps = $("#steps");
  new IntersectionObserver(([en]) => {
    if (en.isIntersecting) { steps.classList.add("in"); steps.style.setProperty("--p", 1); }
  }, { threshold: .35 }).observe(steps);

  /* ---------- spotlight that follows the cursor on cards ---------- */
  $$(".spot").forEach(card => {
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", e.clientX - r.left + "px");
      card.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  /* ---------- contact form ---------- */
  const form = $("#contactForm");
  const status = $("#formStatus");
  form.addEventListener("submit", async e => {
    e.preventDefault();
    status.className = "form-status";
    const data = Object.fromEntries(new FormData(form).entries());
    if (!data.name || !data.email || !/^\S+@\S+\.\S+$/.test(data.email) || !data.message) {
      status.textContent = "Please add your name, a valid email and a short message.";
      return;
    }
    if (FORM_ENDPOINT) {
      try {
        status.textContent = "Sending…";
        const res = await fetch(FORM_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        status.className = "form-status ok";
        status.textContent = "Thanks, your message is on its way. We'll reply soon.";
      } catch (err) {
        status.textContent = "That didn't go through. Please try again or book a call instead.";
      }
    } else if (CONTACT_EMAIL) {
      const body = "Name: " + data.name + "\nEmail: " + data.email + "\nCompany: " + (data.company || "-") + "\n\n" + data.message;
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent("Enquiry from " + data.name) + "&body=" + encodeURIComponent(body);
      status.className = "form-status ok";
      status.textContent = "Opening your mail app…";
    } else {
      status.innerHTML = 'The form isn\'t connected yet. Please <a href="' + CALENDLY_URL + '" target="_blank" rel="noopener" style="text-decoration:underline;font-weight:700">book a 30-minute call</a> instead.';
    }
  });
})();
