/**
 * Ayan Khan Portfolio — Vanilla JavaScript Interactions
 * Handles: navigation scroll-spy, mobile drawer, hero node switcher,
 * scroll reveals, project filtering, accessible detail modal, and form validation.
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     0. 1-Second Black Welcome Intro Splash
     ------------------------------------------------------------------------ */
  const introLoader = document.getElementById("intro-loader");
  const introSkipBtn = document.getElementById("intro-skip");

  function dismissIntro() {
    if (!introLoader || introLoader.classList.contains("is-leaving")) return;
    introLoader.classList.add("is-leaving");
    introLoader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("is-intro-active");
  }

  if (introLoader) {
    const introTimer = window.setTimeout(dismissIntro, 1000);
    if (introSkipBtn) {
      introSkipBtn.addEventListener("click", () => {
        window.clearTimeout(introTimer);
        dismissIntro();
      });
    }
  } else {
    document.body.classList.remove("is-intro-active");
  }

  /* ------------------------------------------------------------------------
     1. Sticky Header & Scroll-Spy Navigation
     ------------------------------------------------------------------------ */
  const header = document.getElementById("site-header");
  const navLinks = Array.from(document.querySelectorAll(".desktop-nav .nav-link"));
  const sections = Array.from(document.querySelectorAll("main section[id]"));

  function updateHeaderState() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }

  function updateActiveNavLink() {
    const scrollPos = window.scrollY + 140;
    let currentId = "home";

    for (const sec of sections) {
      if (sec.offsetTop <= scrollPos) {
        currentId = sec.id;
      }
    }

    // Map sub-sections under their closest top nav link
    let mappedId = currentId;
    if (currentId === "frontend-skills") {
      mappedId = "ghl-skills";
    } else if (currentId === "systems-lab") {
      mappedId = "experience";
    }

    navLinks.forEach((link) => {
      const target = link.getAttribute("href").replace("#", "");
      link.classList.toggle("is-active", target === mappedId);
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      updateHeaderState();
      updateActiveNavLink();
    },
    { passive: true }
  );
  updateHeaderState();
  updateActiveNavLink();

  /* ------------------------------------------------------------------------
     2. Accessible Mobile Navigation Menu
     ------------------------------------------------------------------------ */
  const menuToggle = document.getElementById("menu-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const mobileLinks = Array.from(document.querySelectorAll(".mobile-nav-link"));

  function setMobileMenuOpen(isOpen) {
    if (!menuToggle || !mobileMenu) return;
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    mobileMenu.hidden = !isOpen;
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", () => {
      const currentlyOpen = menuToggle.getAttribute("aria-expanded") === "true";
      setMobileMenuOpen(!currentlyOpen);
    });

    mobileLinks.forEach((link) => {
      link.addEventListener("click", () => setMobileMenuOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
        setMobileMenuOpen(false);
        menuToggle.focus();
      }
    });
  }

  /* ------------------------------------------------------------------------
     3. Hero Interactive Workflow Node Switcher
     ------------------------------------------------------------------------ */
  const heroNodes = Array.from(document.querySelectorAll(".wf-node"));
  const heroNodeLabel = document.getElementById("hero-node-label");
  const heroNodeDesc = document.getElementById("hero-node-desc");
  const heroCodeBlock = document.querySelector(".code-snippet code");

  const nodeDetails = {
    capture: {
      label: "NODE 01 // FRONT-END CAPTURE",
      desc: "Clean, responsive landing pages, forms, and multi-step surveys built to capture accurate contact data and feed directly into GoHighLevel triggers.",
      code:
        '<span class="code-kw">&lt;form</span> <span class="code-attr">data-ghl-trigger</span>=<span class="code-str">"lead_qualified"</span><span class="code-kw">&gt;</span>\n' +
        '  <span class="code-cm">&lt;!-- Custom fields map cleanly to CRM pipeline --&gt;</span>\n' +
        '<span class="code-kw">&lt;/form&gt;</span>'
    },
    logic: {
      label: "NODE 02 // CONDITIONAL BRANCHING",
      desc: "If/Else logic, custom field checks, tags, and scoring formulas evaluate responses so each lead enters the right segment automatically.",
      code:
        '<span class="code-kw">if</span> (contact.<span class="code-attr">homeowner_status</span> === <span class="code-str">"Yes"</span>) {\n' +
        '  addTag(<span class="code-str">"qualified_lead"</span>); updateScore(+25);\n' +
        '}'
    },
    crm: {
      label: "NODE 03 // PIPELINES & CALENDARS",
      desc: "Opportunities move through clear sales pipeline stages while round-robin or service-specific calendars keep bookings organized.",
      code:
        'pipeline.<span class="code-attr">createOpportunity</span>({\n' +
        '  stage: <span class="code-str">"Scheduled Call"</span>, calendar: <span class="code-str">"Round-Robin"</span>\n' +
        '});'
    },
    followup: {
      label: "NODE 04 // FOLLOW-UP & NOTIFICATIONS",
      desc: "Wait steps, reminder sequences, no-show recovery paths, and internal team notifications ensure leads never slip through the cracks.",
      code:
        'workflow.<span class="code-attr">wait</span>(<span class="code-str">"24h"</span>).<span class="code-attr">then</span>(() =&gt; {\n' +
        '  sendReminder(<span class="code-str">"appointment_check"</span>);\n' +
        '});'
    }
  };

  heroNodes.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-node");
      const info = nodeDetails[key];
      if (!info) return;

      heroNodes.forEach((n) => n.classList.remove("is-selected"));
      btn.classList.add("is-selected");

      if (heroNodeLabel) heroNodeLabel.textContent = info.label;
      if (heroNodeDesc) heroNodeDesc.textContent = info.desc;
      if (heroCodeBlock) heroCodeBlock.innerHTML = info.code;
    });
  });

  /* ------------------------------------------------------------------------
     4. Scroll Reveal Observer
     ------------------------------------------------------------------------ */
  const revealEls = Array.from(document.querySelectorAll(".reveal"));

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ------------------------------------------------------------------------
     5. Project Category Filter
     ------------------------------------------------------------------------ */
  const filterBtns = Array.from(document.querySelectorAll(".filter-btn"));
  const projectCards = Array.from(document.querySelectorAll(".project-card"));

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter");

      filterBtns.forEach((b) => b.classList.remove("is-active"));
      btn.classList.add("is-active");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        const shouldShow = filter === "all" || category === filter;
        card.classList.toggle("is-hidden", !shouldShow);
      });
    });
  });

  /* ------------------------------------------------------------------------
     6. Project Detail Modal (Content aligned strictly with detail.md)
     ------------------------------------------------------------------------ */
  const projectData = {
    brightpath: {
      title: "BrightPath Solar",
      category: "GoHighLevel Lead Capture & Automation",
      classification: "Company / Practice Workflow Concept",
      image: "assets/project-brightpath.svg",
      alt: "BrightPath Solar illustrative workflow showing survey capture and homeowner qualification logic",
      context:
        "Designed a solar lead qualification journey centered around a Home Solar Assessment survey. The business requirement was to gather relevant property and utility information, distinguish homeowners from renters, and organize prospects for structured follow-up.",
      role:
        "Worked on the GoHighLevel survey structure, custom field mapping, conditional qualification paths, lead segmentation concepts, and follow-up workflow planning as part of hands-on project work.",
      features: [
        "Home Solar Assessment survey with property & ownership questions",
        "Custom fields and lead source tracking for clean CRM records",
        "Conditional branching paths separating renters and homeowners",
        "Lead segmentation, scoring concepts, and nurture workflow planning"
      ],
      tags: ["GoHighLevel", "Surveys", "Custom Fields", "Conditional Logic", "Workflow Automation", "Lead Qualification"]
    },
    summit: {
      title: "Summit Comfort HVAC",
      category: "CRM & Service Request Workflow",
      classification: "Company / Practice CRM Concept",
      image: "assets/project-summit.svg",
      alt: "Summit Comfort HVAC illustrative CRM pipeline and follow-up concept",
      context:
        "A CRM and service-request workflow concept for organizing HVAC inquiries, tracking opportunities across sales stages, and handling missed appointments without creating duplicate objects inside an existing account.",
      role:
        "Contributed to reviewing existing CRM structures, mapping the HVAC service request form into a structured pipeline, and planning tags, no-show follow-up, and lost-reason tracking.",
      features: [
        "HVAC service request intake form connected to CRM records",
        "Dedicated HVAC sales pipeline and opportunity stage tracking",
        "Lead source organization and tag-based workflow planning",
        "No-show follow-up logic and lost-reason field tracking",
        "Existing account review to prevent duplicate custom fields or tags"
      ],
      tags: ["GoHighLevel", "CRM", "Forms", "Pipelines", "Opportunities", "Workflow Automation"]
    },
    dental: {
      title: "Dental Clinic",
      category: "Appointment Booking & Customer Communication",
      classification: "Company / Practice Booking Setup",
      image: "assets/project-dental.svg",
      alt: "Dental Clinic illustrative multi-calendar and patient follow-up setup",
      context:
        "An appointment-focused GoHighLevel setup created to organize multiple clinic booking options, capture patient details, support FAQ responses via a knowledge base assistant, and follow up with visitors who drop off before booking.",
      role:
        "Assisted with structuring multiple dental and round-robin calendar requirements, patient information collection, knowledge base configuration, and unbooked contact follow-up flows.",
      features: [
        "Multiple dental service calendars and round-robin calendar setup",
        "Patient information collection prior to appointment scheduling",
        "Knowledge base configuration for dental care assistant support",
        "Automated follow-up workflow for contacts who do not complete booking"
      ],
      tags: ["GoHighLevel", "Calendars", "Appointment Workflows", "Knowledge Base", "Lead Follow-Up"]
    },
    xortlogix: {
      title: "Xortlogix",
      category: "E-Commerce & Membership Workflows",
      classification: "Company / Collaborative Task Work",
      image: "assets/project-xortlogix.svg",
      alt: "Xortlogix illustrative e-commerce catalog and course membership access lifecycle",
      context:
        "A set of e-commerce organization and digital course membership tasks focused on structuring fashion store product categories, planning abandoned-cart journeys, and automating time-bound course access.",
      role:
        "Handled product category organization and membership workflow configuration tasks, including welcome communication, access duration tracking, and expiration/revocation logic.",
      features: [
        "Fashion store product categories and catalog organization",
        "Customer journey and abandoned-cart workflow planning",
        "Digital course setup and enrollment trigger configuration",
        "Welcome messaging, access duration timers, and revocation logic"
      ],
      tags: ["GoHighLevel", "E-Commerce", "Memberships", "Customer Automation", "Workflow Logic"]
    },
    loveleaves: {
      title: "Love Leaves Evidence",
      category: "Webinar Registration Funnel & Reminders",
      classification: "Company / Practice Funnel Work",
      image: "assets/project-loveleaves.svg",
      alt: "Love Leaves Evidence illustrative webinar funnel and reminder sequence",
      context:
        "A webinar registration journey connecting a sign-up landing page and thank-you experience with contact tagging, scheduled email reminders, and attendance vs. no-show organization.",
      role:
        "Worked on the funnel page steps, registration form connection, tag assignment, email reminder sequence setup, and attendance/no-show tracking workflow organization.",
      features: [
        "Webinar registration landing page and embedded sign-up form",
        "Thank-you page with confirmation step",
        "Automated registration tagging and scheduled email reminders",
        "Attendance and no-show segmentation workflow concepts"
      ],
      tags: ["GoHighLevel", "Funnels", "Forms", "Email Automation", "Tags", "Workflows"]
    },
    apex: {
      title: "Apex Growth Partners",
      category: "Survey Scoring & Result-Page Logic",
      classification: "Company / Practice Scoring Concept",
      image: "assets/project-apex.svg",
      alt: "Apex Growth Partners illustrative 0-100 scoring logic and Grade A/B/C branching",
      context:
        "A Business Growth Readiness Assessment designed as a multi-slide survey that scores answers on a 0–100 scale, categorizes respondents into Grade A, B, or C tiers, and routes each respondent to a tailored result page.",
      role:
        "Configured multi-slide survey fields, 0–100 scoring math operations, conditional Grade A/B/C branching, result landing pages, and opportunity creation workflows.",
      features: [
        "Multi-slide Business Growth Readiness Assessment with custom fields",
        "Weighted scoring rules and math operations (0–100 score range)",
        "Grade A / B / C categorization and tailored result landing pages",
        "Automated opportunity creation and conditional workflow branching"
      ],
      tags: ["GoHighLevel", "Surveys", "Scoring Logic", "Math Operations", "Conditional Workflows", "Funnels"]
    },
    cybersnake: {
      title: "Cyber Snake — Data Runner",
      category: "Interactive HTML5 Canvas Game",
      classification: "Personal Front-End JavaScript Build",
      image: "assets/project-game.svg",
      alt: "Cyber Snake Data Runner HTML5 Canvas game preview",
      context:
        "An interactive browser arcade game built directly inside this portfolio to demonstrate real-time Vanilla JavaScript game logic, state management, responsive canvas rendering, and touch-friendly controls.",
      role:
        "Designed and coded the complete 20x20 grid game engine, input direction queue, collision checks, localStorage high-score persistence, speed selector, and mobile swipe/D-pad controls.",
      features: [
        "Real-time 20x20 HTML5 Canvas rendering loop",
        "Direction input queue preventing accidental 180-degree self-reversal",
        "Keyboard (Arrows / WASD / Space), touch swipe, and on-screen D-pad controls",
        "Persistent Best Score saved locally in the browser"
      ],
      tags: ["HTML5 Canvas", "Vanilla JavaScript", "Game Loop", "Responsive Controls"]
    }
  };

  const modal = document.getElementById("project-modal");
  const modalClose = document.getElementById("modal-close");
  const modalTitle = document.getElementById("modal-title");
  const modalCategory = document.getElementById("modal-category");
  const modalClassification = document.getElementById("modal-classification");
  const modalImage = document.getElementById("modal-image");
  const modalContext = document.getElementById("modal-context");
  const modalRole = document.getElementById("modal-role");
  const modalFeatures = document.getElementById("modal-features");
  const modalTags = document.getElementById("modal-tags");
  const viewProjectBtns = Array.from(document.querySelectorAll(".view-project-btn"));

  let lastFocusedTrigger = null;

  function openProjectModal(projectKey, triggerEl) {
    const data = projectData[projectKey];
    if (!data || !modal) return;

    lastFocusedTrigger = triggerEl || document.activeElement;

    modalTitle.textContent = data.title;
    modalCategory.textContent = data.category;
    modalClassification.textContent = data.classification;
    modalImage.src = data.image;
    modalImage.alt = data.alt;
    modalContext.textContent = data.context;
    modalRole.textContent = data.role;

    modalFeatures.innerHTML = "";
    data.features.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      modalFeatures.appendChild(li);
    });

    modalTags.innerHTML = "";
    data.tags.forEach((tag) => {
      const li = document.createElement("li");
      li.className = "tag-pill";
      li.textContent = tag;
      modalTags.appendChild(li);
    });

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }

  function closeProjectModal() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (lastFocusedTrigger && typeof lastFocusedTrigger.focus === "function") {
      lastFocusedTrigger.focus();
    }
  }

  viewProjectBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      openProjectModal(btn.getAttribute("data-project"), btn);
    });
  });

  if (modalClose) {
    modalClose.addEventListener("click", closeProjectModal);
  }

  if (modal) {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeProjectModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!modal.hidden && event.key === "Escape") {
        closeProjectModal();
      }
    });
  }

  /* ------------------------------------------------------------------------
     6B. In-Page Certificate Viewer Modal
     ------------------------------------------------------------------------ */
  const viewCertBtn = document.getElementById("view-cert-btn");
  const certModal = document.getElementById("cert-modal");
  const certModalClose = document.getElementById("cert-modal-close");

  function openCertModal() {
    if (!certModal) return;
    certModal.hidden = false;
    document.body.style.overflow = "hidden";
    if (certModalClose) certModalClose.focus();
  }

  function closeCertModal() {
    if (!certModal || certModal.hidden) return;
    certModal.hidden = true;
    document.body.style.overflow = "";
    if (viewCertBtn) viewCertBtn.focus();
  }

  if (viewCertBtn && certModal) {
    viewCertBtn.addEventListener("click", openCertModal);

    if (certModalClose) {
      certModalClose.addEventListener("click", closeCertModal);
    }

    certModal.addEventListener("click", (event) => {
      if (event.target === certModal) {
        closeCertModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!certModal.hidden && event.key === "Escape") {
        closeCertModal();
      }
    });
  }

  /* ------------------------------------------------------------------------
     6C. In-Page Profile Photo Lightbox Modal
     ------------------------------------------------------------------------ */
  const avatarTriggers = Array.from(document.querySelectorAll(".avatar-trigger"));
  const photoModal = document.getElementById("photo-modal");
  const photoModalClose = document.getElementById("photo-modal-close");
  let lastAvatarTrigger = null;

  function openPhotoModal(triggerEl) {
    if (!photoModal) return;
    lastAvatarTrigger = triggerEl || document.activeElement;
    photoModal.hidden = false;
    document.body.style.overflow = "hidden";
    if (photoModalClose) photoModalClose.focus();
  }

  function closePhotoModal() {
    if (!photoModal || photoModal.hidden) return;
    photoModal.hidden = true;
    document.body.style.overflow = "";
    if (lastAvatarTrigger && typeof lastAvatarTrigger.focus === "function") {
      lastAvatarTrigger.focus();
    }
  }

  if (photoModal && avatarTriggers.length) {
    avatarTriggers.forEach((btn) => {
      btn.addEventListener("click", () => openPhotoModal(btn));
    });

    if (photoModalClose) {
      photoModalClose.addEventListener("click", closePhotoModal);
    }

    photoModal.addEventListener("click", (event) => {
      if (event.target === photoModal) {
        closePhotoModal();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!photoModal.hidden && event.key === "Escape") {
        closePhotoModal();
      }
    });
  }

  /* ------------------------------------------------------------------------
     6D. Playable Cyber Snake Game Engine & Modal
     ------------------------------------------------------------------------ */
  const playGameBtn = document.getElementById("play-game-btn");
  const gameModal = document.getElementById("game-modal");
  const gameModalClose = document.getElementById("game-modal-close");
  const gameCanvas = document.getElementById("snake-canvas");
  const gameScoreEl = document.getElementById("game-score");
  const gameBestEl = document.getElementById("game-best");
  const gameSpeedEl = document.getElementById("game-speed");
  const gamePauseBtn = document.getElementById("game-pause-btn");
  const gameOverlay = document.getElementById("game-overlay");
  const gameOverlayTag = document.getElementById("game-overlay-tag");
  const gameOverlayTitle = document.getElementById("game-overlay-title");
  const gameOverlaySub = document.getElementById("game-overlay-sub");
  const gameStartBtn = document.getElementById("game-start-btn");
  const dpadBtns = Array.from(document.querySelectorAll(".dpad-btn"));

  if (gameModal && gameCanvas && gameCanvas.getContext) {
    const ctx = gameCanvas.getContext("2d");
    const GRID = 20;
    const CELL = gameCanvas.width / GRID;
    const BEST_KEY = "ayan_cyber_snake_best";

    let snake = [];
    let dir = { x: 1, y: 0 };
    let inputQueue = [];
    let food = { x: 14, y: 10 };
    let score = 0;
    let bestScore = Number(localStorage.getItem(BEST_KEY) || 0);
    let isRunning = false;
    let isPaused = false;
    let rafId = null;
    let lastTick = 0;
    let touchStart = null;

    if (gameBestEl) gameBestEl.textContent = String(bestScore);

    function spawnFood() {
      const occupied = new Set(snake.map((s) => `${s.x},${s.y}`));
      const freeCells = [];
      for (let y = 0; y < GRID; y++) {
        for (let x = 0; x < GRID; x++) {
          if (!occupied.has(`${x},${y}`)) freeCells.push({ x, y });
        }
      }
      if (freeCells.length === 0) return null;
      return freeCells[Math.floor(Math.random() * freeCells.length)];
    }

    function drawBoard() {
      ctx.fillStyle = "#0B0B0D";
      ctx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);

      ctx.strokeStyle = "#17171E";
      ctx.lineWidth = 1;
      for (let i = 1; i < GRID; i++) {
        const pos = i * CELL;
        ctx.beginPath();
        ctx.moveTo(pos, 0);
        ctx.lineTo(pos, gameCanvas.height);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, pos);
        ctx.lineTo(gameCanvas.width, pos);
        ctx.stroke();
      }

      if (food) {
        const fx = food.x * CELL + CELL / 2;
        const fy = food.y * CELL + CELL / 2;
        ctx.fillStyle = "rgba(255, 87, 34, 0.25)";
        ctx.beginPath();
        ctx.arc(fx, fy, CELL * 0.48, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#FF5722";
        ctx.beginPath();
        ctx.arc(fx, fy, CELL * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#F5F5F2";
        ctx.beginPath();
        ctx.arc(fx, fy, CELL * 0.12, 0, Math.PI * 2);
        ctx.fill();
      }

      snake.forEach((seg, idx) => {
        const pad = 2;
        const x = seg.x * CELL + pad;
        const y = seg.y * CELL + pad;
        const size = CELL - pad * 2;
        const isHead = idx === 0;
        const alpha = Math.max(0.35, 1 - idx * 0.035);

        ctx.fillStyle = isHead ? "#FF5722" : `rgba(255, 112, 67, ${alpha.toFixed(2)})`;
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(x, y, size, size, 5);
        } else {
          ctx.rect(x, y, size, size);
        }
        ctx.fill();

        if (isHead) {
          ctx.strokeStyle = "#F5F5F2";
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      });
    }

    function resetGameState() {
      snake = [
        { x: 8, y: 10 },
        { x: 7, y: 10 },
        { x: 6, y: 10 }
      ];
      dir = { x: 1, y: 0 };
      inputQueue = [];
      score = 0;
      food = spawnFood();
      if (gameScoreEl) gameScoreEl.textContent = "0";
      drawBoard();
    }

    function showOverlay(tag, title, sub, btnLabel) {
      if (gameOverlayTag) gameOverlayTag.textContent = tag;
      if (gameOverlayTitle) gameOverlayTitle.textContent = title;
      if (gameOverlaySub) gameOverlaySub.textContent = sub;
      if (gameStartBtn) gameStartBtn.textContent = btnLabel;
      if (gameOverlay) gameOverlay.hidden = false;
    }

    function endGame(won) {
      isRunning = false;
      isPaused = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (gamePauseBtn) gamePauseBtn.textContent = "Pause";
      showOverlay(
        won ? "GRID CLEARED" : "CONNECTION LOST",
        won ? `Perfect Run — ${score} pts!` : `Game Over — Score: ${score}`,
        `Best score: ${bestScore}. Ready for another run?`,
        "Play Again"
      );
    }

    function stepGame() {
      if (inputQueue.length > 0) {
        dir = inputQueue.shift();
      }

      const head = snake[0];
      const next = { x: head.x + dir.x, y: head.y + dir.y };

      const hitWall = next.x < 0 || next.x >= GRID || next.y < 0 || next.y >= GRID;
      const willEat = food && next.x === food.x && next.y === food.y;
      const bodyToCheck = willEat ? snake : snake.slice(0, -1);
      const hitSelf = bodyToCheck.some((seg) => seg.x === next.x && seg.y === next.y);

      if (hitWall || hitSelf) {
        endGame(false);
        return;
      }

      snake.unshift(next);

      if (willEat) {
        score += 10;
        if (gameScoreEl) gameScoreEl.textContent = String(score);
        if (score > bestScore) {
          bestScore = score;
          localStorage.setItem(BEST_KEY, String(bestScore));
          if (gameBestEl) gameBestEl.textContent = String(bestScore);
        }
        food = spawnFood();
        if (!food) {
          drawBoard();
          endGame(true);
          return;
        }
      } else {
        snake.pop();
      }

      drawBoard();
    }

    function gameLoop(timestamp) {
      if (!isRunning || isPaused || gameModal.hidden) return;
      const interval = gameSpeedEl ? Number(gameSpeedEl.value) : 125;
      if (timestamp - lastTick >= interval) {
        lastTick = timestamp;
        stepGame();
      }
      if (isRunning && !isPaused) {
        rafId = requestAnimationFrame(gameLoop);
      }
    }

    function startGame() {
      resetGameState();
      isRunning = true;
      isPaused = false;
      if (gamePauseBtn) gamePauseBtn.textContent = "Pause";
      if (gameOverlay) gameOverlay.hidden = true;
      lastTick = performance.now();
      rafId = requestAnimationFrame(gameLoop);
    }

    function togglePause() {
      if (!isRunning) return;
      isPaused = !isPaused;
      if (gamePauseBtn) gamePauseBtn.textContent = isPaused ? "Resume" : "Pause";
      if (isPaused) {
        showOverlay("PAUSED", "Game Paused", "Press Space or click Resume to continue.", "Resume");
      } else {
        if (gameOverlay) gameOverlay.hidden = true;
        lastTick = performance.now();
        rafId = requestAnimationFrame(gameLoop);
      }
    }

    function queueDirection(name) {
      const map = {
        up: { x: 0, y: -1 },
        down: { x: 0, y: 1 },
        left: { x: -1, y: 0 },
        right: { x: 1, y: 0 }
      };
      const candidate = map[name];
      if (!candidate || !isRunning || isPaused) return;
      const latest = inputQueue.length > 0 ? inputQueue[inputQueue.length - 1] : dir;
      if (candidate.x === -latest.x && candidate.y === -latest.y) return;
      if (candidate.x === latest.x && candidate.y === latest.y) return;
      if (inputQueue.length < 2) inputQueue.push(candidate);
    }

    function openGameModal() {
      gameModal.hidden = false;
      document.body.style.overflow = "hidden";
      resetGameState();
      showOverlay(
        "SYSTEM READY",
        "Collect Data Nodes",
        "Use Arrow Keys / WASD on desktop or swipe & D-pad buttons below on mobile.",
        "Start Game"
      );
      if (gameStartBtn) gameStartBtn.focus();
    }

    function closeGameModal() {
      if (gameModal.hidden) return;
      isRunning = false;
      isPaused = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      gameModal.hidden = true;
      document.body.style.overflow = "";
      if (playGameBtn) playGameBtn.focus();
    }

    if (playGameBtn) {
      playGameBtn.addEventListener("click", openGameModal);
    }

    if (gameModalClose) {
      gameModalClose.addEventListener("click", closeGameModal);
    }

    gameModal.addEventListener("click", (event) => {
      if (event.target === gameModal) closeGameModal();
    });

    if (gameStartBtn) {
      gameStartBtn.addEventListener("click", () => {
        if (isPaused) {
          togglePause();
        } else {
          startGame();
        }
      });
    }

    if (gamePauseBtn) {
      gamePauseBtn.addEventListener("click", togglePause);
    }

    dpadBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (!isRunning) startGame();
        queueDirection(btn.getAttribute("data-dir"));
      });
    });

    gameCanvas.addEventListener("touchstart", (e) => {
      if (e.touches.length !== 1) return;
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    gameCanvas.addEventListener("touchmove", (e) => {
      if (!touchStart || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - touchStart.x;
      const dy = e.touches[0].clientY - touchStart.y;
      if (Math.abs(dx) < 22 && Math.abs(dy) < 22) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        queueDirection(dx > 0 ? "right" : "left");
      } else {
        queueDirection(dy > 0 ? "down" : "up");
      }
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }, { passive: true });

    document.addEventListener("keydown", (event) => {
      if (gameModal.hidden) return;
      if (event.key === "Escape") {
        closeGameModal();
        return;
      }
      const keyMap = {
        ArrowUp: "up",
        w: "up",
        W: "up",
        ArrowDown: "down",
        s: "down",
        S: "down",
        ArrowLeft: "left",
        a: "left",
        A: "left",
        ArrowRight: "right",
        d: "right",
        D: "right"
      };
      if (keyMap[event.key]) {
        event.preventDefault();
        if (!isRunning) startGame();
        queueDirection(keyMap[event.key]);
      } else if (event.key === " ") {
        event.preventDefault();
        if (isRunning) togglePause();
        else startGame();
      }
    });
  }

  /* ------------------------------------------------------------------------
     7. Contact Form Validation & Web3Forms Submission
     ------------------------------------------------------------------------ */
  const WEB3FORMS_ENDPOINT = "https://api.web3forms.com/submit";
  const WEB3FORMS_ACCESS_KEY = "aa6f0b59-5f03-4c9e-b2ea-3328b2f2f89f";

  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const topicInput = document.getElementById("contact-topic");
  const messageInput = document.getElementById("contact-message");
  const formFeedback = document.getElementById("form-feedback");
  const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

  const errorEls = {
    name: document.getElementById("error-name"),
    email: document.getElementById("error-email"),
    topic: document.getElementById("error-topic"),
    message: document.getElementById("error-message")
  };

  function setFieldError(input, errorEl, message) {
    if (!input || !errorEl) return;
    input.classList.toggle("is-invalid", Boolean(message));
    input.setAttribute("aria-invalid", message ? "true" : "false");
    errorEl.textContent = message || "";
  }

  function showFormFeedback(isError, titleText, detailText) {
    if (!formFeedback) return;
    formFeedback.classList.toggle("is-error", isError);
    formFeedback.innerHTML = "";

    const title = document.createElement("strong");
    title.textContent = titleText;

    const desc = document.createElement("p");
    desc.style.marginTop = "6px";
    desc.textContent = detailText;

    formFeedback.appendChild(title);
    formFeedback.appendChild(desc);
    formFeedback.hidden = false;
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
  }

  function validateContactForm() {
    let isValid = true;

    const nameVal = nameInput.value.trim();
    if (nameVal.length < 2) {
      setFieldError(nameInput, errorEls.name, "Please enter your name (at least 2 characters).");
      isValid = false;
    } else {
      setFieldError(nameInput, errorEls.name, "");
    }

    const emailVal = emailInput.value.trim();
    if (!validateEmail(emailVal)) {
      setFieldError(emailInput, errorEls.email, "Please enter a valid email address.");
      isValid = false;
    } else {
      setFieldError(emailInput, errorEls.email, "");
    }

    const topicVal = topicInput.value.trim();
    if (!topicVal) {
      setFieldError(topicInput, errorEls.topic, "Please select a project focus area.");
      isValid = false;
    } else {
      setFieldError(topicInput, errorEls.topic, "");
    }

    const msgVal = messageInput.value.trim();
    if (msgVal.length < 15) {
      setFieldError(messageInput, errorEls.message, "Please share a few project details (at least 15 characters).");
      isValid = false;
    } else {
      setFieldError(messageInput, errorEls.message, "");
    }

    return isValid;
  }

  if (contactForm) {
    [nameInput, emailInput, topicInput, messageInput].forEach((field) => {
      if (!field) return;
      field.addEventListener("input", () => {
        if (field.classList.contains("is-invalid")) {
          validateContactForm();
        }
      });
    });

    contactForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!validateContactForm()) {
        if (formFeedback) formFeedback.hidden = true;
        const firstInvalid = contactForm.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const formData = new FormData(contactForm);
      if (!formData.get("access_key")) {
        formData.append("access_key", WEB3FORMS_ACCESS_KEY);
      }

      const originalText = submitBtn ? submitBtn.textContent : "Send Message";
      if (submitBtn) {
        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;
      }
      if (formFeedback) formFeedback.hidden = true;

      try {
        const response = await fetch(WEB3FORMS_ENDPOINT, {
          method: "POST",
          body: formData
        });
        const data = await response.json();

        if (response.ok && data.success !== false) {
          showFormFeedback(
            false,
            "Message sent successfully.",
            "Thank you for reaching out. Your inquiry has been delivered and Ayan will review it shortly."
          );
          contactForm.reset();
        } else {
          showFormFeedback(
            true,
            "Unable to send message.",
            data && data.message ? data.message : "Please verify your details and try again."
          );
        }
      } catch (error) {
        showFormFeedback(
          true,
          "Network error while sending.",
          "Something went wrong connecting to the form service. Please check your connection and try again."
        );
      } finally {
        if (submitBtn) {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }
      }
    });
  }
})();
