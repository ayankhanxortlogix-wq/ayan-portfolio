/**
 * Ayan Khan Portfolio — Vanilla JavaScript Interactions
 * Handles: navigation scroll-spy, mobile drawer, hero node switcher,
 * scroll reveals, project filtering, accessible detail modal, and form validation.
 */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

    // Map frontend-skills under the "Skills" top nav link
    const mappedId = currentId === "frontend-skills" ? "ghl-skills" : currentId;

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
     7. Contact Form Validation & Inquiry Preparation
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById("contact-form");
  const nameInput = document.getElementById("contact-name");
  const emailInput = document.getElementById("contact-email");
  const topicInput = document.getElementById("contact-topic");
  const messageInput = document.getElementById("contact-message");
  const formFeedback = document.getElementById("form-feedback");

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

    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!validateContactForm()) {
        formFeedback.hidden = true;
        const firstInvalid = contactForm.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const formattedSummary =
        `Name: ${nameInput.value.trim()}\n` +
        `Email: ${emailInput.value.trim()}\n` +
        `Focus: ${topicInput.value.trim()}\n` +
        `Details: ${messageInput.value.trim()}`;

      formFeedback.innerHTML = "";
      const title = document.createElement("strong");
      title.textContent = "Inquiry validated and ready.";

      const desc = document.createElement("p");
      desc.style.marginTop = "6px";
      desc.textContent =
        "This static portfolio validates your message locally (no external backend endpoint is connected yet). You can copy your formatted brief below to send directly once contact channels are linked.";

      const actions = document.createElement("div");
      actions.className = "form-feedback-actions";

      const copyBtn = document.createElement("button");
      copyBtn.type = "button";
      copyBtn.className = "btn btn-secondary btn-sm";
      copyBtn.textContent = "Copy Inquiry Brief";
      copyBtn.addEventListener("click", () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(formattedSummary).then(() => {
            copyBtn.textContent = "Copied to Clipboard";
          });
        } else {
          copyBtn.textContent = "Clipboard unavailable";
        }
      });

      const resetBtn = document.createElement("button");
      resetBtn.type = "button";
      resetBtn.className = "btn btn-secondary btn-sm";
      resetBtn.textContent = "Clear Form";
      resetBtn.addEventListener("click", () => {
        contactForm.reset();
        formFeedback.hidden = true;
      });

      actions.appendChild(copyBtn);
      actions.appendChild(resetBtn);

      formFeedback.appendChild(title);
      formFeedback.appendChild(desc);
      formFeedback.appendChild(actions);
      formFeedback.hidden = false;
    });
  }
})();
