const root = document.documentElement;
const year = document.querySelector("#year");
const themeToggle = document.querySelector("#themeToggle");
const paletteButton = document.querySelector("#paletteButton");
const paletteMenu = document.querySelector("#paletteMenu");
const recruiterMode = document.querySelector("#recruiterMode");
const menuToggle = document.querySelector("#menuToggle");
const nav = document.querySelector(".nav-links");
const scrollProgress = document.querySelector("#scrollProgress");
const cursorGlow = document.querySelector("#cursorGlow");
const printResume = document.querySelector("#printResume");
const typeText = document.querySelector("#typeText");
const copyEmail = document.querySelector("#copyEmail");
const copyStatus = document.querySelector("#copyStatus");
const contactForm = document.querySelector("#contactForm");
const projectSearch = document.querySelector("#projectSearch");
const skillRadar = document.querySelector("#skillRadar");
const backToTop = document.querySelector("#backToTop");
const processDetail = document.querySelector("#processDetail");
const consoleOutput = document.querySelector("#consoleOutput code");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const revealTargets = document.querySelectorAll(
  ".glass-panel, .metric-card, .project-card, .skill-meter, .timeline article, .credential-board article, .contact-section"
);

year.textContent = new Date().getFullYear();

if (localStorage.getItem("portfolio-theme") === "dark") {
  root.classList.add("dark");
}

const storedPalette = localStorage.getItem("portfolio-palette");
if (storedPalette) {
  root.dataset.palette = storedPalette;
}

if (localStorage.getItem("portfolio-recruiter-mode") === "on") {
  document.body.classList.add("recruiter-mode");
}

themeToggle.addEventListener("click", () => {
  root.classList.toggle("dark");
  localStorage.setItem("portfolio-theme", root.classList.contains("dark") ? "dark" : "light");
  drawSkillRadar();
});

recruiterMode.addEventListener("click", () => {
  document.body.classList.toggle("recruiter-mode");
  localStorage.setItem(
    "portfolio-recruiter-mode",
    document.body.classList.contains("recruiter-mode") ? "on" : "off"
  );
});

paletteButton.addEventListener("click", () => {
  paletteMenu.classList.toggle("open");
});

paletteMenu.addEventListener("click", (event) => {
  const button = event.target.closest("[data-palette]");
  if (!button) return;
  root.dataset.palette = button.dataset.palette;
  localStorage.setItem("portfolio-palette", button.dataset.palette);
  paletteMenu.classList.remove("open");
  drawSkillRadar();
});

menuToggle.addEventListener("click", () => {
  nav.classList.toggle("open");
});

nav.addEventListener("click", () => {
  nav.classList.remove("open");
});

if (printResume) {
  printResume.addEventListener("click", () => window.print());
}

const emailAddress = "amarkumar62156@gmail.com";

copyEmail.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(emailAddress);
    copyStatus.textContent = "Email copied";
  } catch {
    copyStatus.textContent = emailAddress;
  }

  setTimeout(() => {
    copyStatus.textContent = "";
  }, 2200);
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${emailAddress}&su=${subject}&body=${body}`, "_blank");
});

const updateScrollProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll <= 0 ? 0 : window.scrollY / maxScroll;
  scrollProgress.style.transform = `scaleX(${progress})`;
  backToTop.classList.toggle("visible", window.scrollY > 720);
};

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

window.addEventListener(
  "pointermove",
  (event) => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  },
  { passive: true }
);

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const typingWords = [
  "web applications.",
  "Java full-stack projects.",
  "MERN stack websites.",
  "machine learning prototypes.",
  "clean user experiences."
];

let wordIndex = 0;
let letterIndex = 0;
let isDeleting = false;

const typeLoop = () => {
  const currentWord = typingWords[wordIndex];
  typeText.textContent = currentWord.slice(0, letterIndex);

  if (!isDeleting && letterIndex < currentWord.length) {
    letterIndex += 1;
    setTimeout(typeLoop, 72);
    return;
  }

  if (!isDeleting && letterIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(typeLoop, 1200);
    return;
  }

  if (isDeleting && letterIndex > 0) {
    letterIndex -= 1;
    setTimeout(typeLoop, 38);
    return;
  }

  isDeleting = false;
  wordIndex = (wordIndex + 1) % typingWords.length;
  setTimeout(typeLoop, 260);
};

typeLoop();

revealTargets.forEach((element) => element.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealTargets.forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const number = entry.target;
      const target = Number(number.dataset.count);
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 28));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        number.textContent = `${current}+`;
      }, 34);
      counterObserver.unobserve(number);
    });
  },
  { threshold: 0.8 }
);

document.querySelectorAll("[data-count]").forEach((number) => counterObserver.observe(number));

document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.closest(".accordion-item");
    const isOpen = item.classList.contains("open");
    document.querySelectorAll(".accordion-item").forEach((entry) => {
      entry.classList.remove("open");
      entry.querySelector(".accordion-trigger").setAttribute("aria-expanded", "false");
    });

    if (!isOpen) {
      item.classList.add("open");
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

const processContent = {
  plan: {
    kicker: "Plan",
    title: "Understand the user, data, and main workflow first.",
    body:
      "I break the requirement into screens, APIs, database entities, and user actions before writing code, so the build has a clear direction.",
    points: ["Define core user flow", "Choose stack and database structure", "Split work into small deliverable modules"]
  },
  build: {
    kicker: "Build",
    title: "Create the feature in small, working pieces.",
    body:
      "I start with the core data and API behavior, then connect the user interface and refine the flow until the feature is usable.",
    points: ["Implement backend logic", "Connect frontend states", "Keep code readable and modular"]
  },
  test: {
    kicker: "Test",
    title: "Check the important flows before calling it complete.",
    body:
      "I verify CRUD actions, form states, navigation, responsiveness, and edge cases that can break the user experience.",
    points: ["Validate forms and actions", "Check mobile layout", "Review common failure cases"]
  },
  deploy: {
    kicker: "Deploy",
    title: "Prepare the project for sharing, review, and improvement.",
    body:
      "I organize the project, document the main setup, prepare links or demos, and keep the next improvement steps clear.",
    points: ["Clean project structure", "Prepare demo and documentation", "List next feature improvements"]
  }
};

document.querySelectorAll("[data-process]").forEach((button) => {
  button.addEventListener("click", () => {
    const key = button.dataset.process;
    const content = processContent[key];

    document.querySelectorAll("[data-process]").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    document.querySelectorAll("[data-stage-dot]").forEach((dot) => {
      dot.classList.toggle("active", dot.dataset.stageDot === key);
    });

    processDetail.innerHTML = `
      <p class="section-kicker">${content.kicker}</p>
      <h3>${content.title}</h3>
      <p>${content.body}</p>
      <ul>${content.points.map((point) => `<li>${point}</li>`).join("")}</ul>
    `;
  });
});

const consoleCommands = {
  profile: `$ amar profile
Name: Amar Kumar
Role: Software Developer
Education: B.E. CSE, Chandigarh University
Focus: Java Full Stack, MERN, Frontend, ML Basics
Status: Open to internships and collaborations`,
  skills: `$ amar skills --top
Java / Spring Boot      82%
HTML / CSS / JS         86%
MERN Stack              74%
Python / ML Basics      68%
MySQL / Data Modeling   72%
Git / GitHub            78%`,
  projects: `$ amar projects --featured
1. Online Student Management System
   Stack: Java, Spring Boot, REST APIs, MySQL
   Value: Secure admin CRUD and student records

2. Smart Traffic Management System
   Stack: Python, scikit-learn, Pandas, Matplotlib
   Value: Logistic regression traffic prototype

3. E-Commerce Website
   Stack: MongoDB, Express.js, React, Node.js
   Value: Auth, cart, orders, checkout flow`,
  contact: `$ amar contact
Email: amarkumar62156@gmail.com
Phone: +91 9199320433
Location: Motihari, Bihar
Action: Use the contact form or Gmail button below`
};

document.querySelectorAll("[data-console]").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("[data-console]").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    consoleOutput.textContent = consoleCommands[button.dataset.console];
  });
});

const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll(".project-card[data-category]");
let activeProjectFilter = "all";

const updateProjects = () => {
  const query = projectSearch.value.trim().toLowerCase();

  projectCards.forEach((card) => {
    const matchesFilter = activeProjectFilter === "all" || card.dataset.category === activeProjectFilter;
    const matchesSearch = !query || card.textContent.toLowerCase().includes(query);
    card.classList.toggle("hidden", !matchesFilter);
    card.classList.toggle("search-hidden", !matchesSearch);
  });
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeProjectFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    updateProjects();
  });
});

projectSearch.addEventListener("input", updateProjects);

const caseStudies = {
  student: {
    title: "Online Student Management System",
    summary:
      "A Java full-stack admin system focused on structured student record management, secure access, and practical CRUD workflows.",
    points: [
      "Implemented add, update, delete, view, and search operations for student records.",
      "Designed role-based login patterns and database-backed records.",
      "Covered course and fee management flows using Spring Boot REST APIs with HTML, CSS, and JavaScript."
    ]
  },
  traffic: {
    title: "Smart Traffic Management System",
    summary:
      "A machine learning prototype using logistic regression to explore traffic-related prediction and analysis workflows.",
    points: [
      "Prepared data with Pandas and NumPy for model experiments.",
      "Built logistic regression workflows with scikit-learn.",
      "Used Matplotlib and Google Colab for visualization and reproducible experimentation."
    ]
  },
  commerce: {
    title: "E-Commerce Website",
    summary:
      "A MERN stack shopping platform with authentication, catalog browsing, cart management, order history, and checkout simulation.",
    points: [
      "Built frontend product browsing and responsive UI flows in React.",
      "Managed backend routes with Node.js, Express.js, and MongoDB.",
      "Included login, cart, order history, and checkout simulation features."
    ]
  }
};

const caseModal = document.querySelector("#caseModal");
const caseContent = document.querySelector("#caseContent");
const modalClose = document.querySelector("#modalClose");

document.querySelectorAll("[data-project]").forEach((button) => {
  button.addEventListener("click", () => {
    const study = caseStudies[button.dataset.project];
    caseContent.innerHTML = `
      <div class="case-content">
        <p class="section-kicker">Case Study</p>
        <h2>${study.title}</h2>
        <p>${study.summary}</p>
        <ul>${study.points.map((point) => `<li>${point}</li>`).join("")}</ul>
      </div>
    `;
    caseModal.classList.add("open");
    caseModal.setAttribute("aria-hidden", "false");
  });
});

const closeModal = () => {
  caseModal.classList.remove("open");
  caseModal.setAttribute("aria-hidden", "true");
};

modalClose.addEventListener("click", closeModal);
caseModal.addEventListener("click", (event) => {
  if (event.target === caseModal) closeModal();
});

const commandOverlay = document.querySelector("#commandOverlay");
const commandButton = document.querySelector("#commandButton");
const commandInput = document.querySelector("#commandInput");
const commandList = document.querySelector("#commandList");

const commands = [
  { title: "Home", subtitle: "Hero and profile overview", href: "#home" },
  { title: "Work", subtitle: "Featured project case studies", href: "#work" },
  { title: "Stack", subtitle: "Technical competencies and tools", href: "#stack" },
  { title: "Journey", subtitle: "Education and certifications", href: "#journey" },
  { title: "Contact", subtitle: "Email, phone, and LinkedIn", href: "#contact" },
  { title: "Java Spring Boot", subtitle: "Student management project", href: "#work" },
  { title: "MERN Stack", subtitle: "E-commerce project", href: "#work" },
  { title: "Machine Learning", subtitle: "Traffic management model", href: "#work" }
];

const renderCommands = (query = "") => {
  const normalized = query.trim().toLowerCase();
  const filtered = commands.filter((command) =>
    `${command.title} ${command.subtitle}`.toLowerCase().includes(normalized)
  );
  commandList.innerHTML = filtered
    .map(
      (command) => `
        <a class="command-item" href="${command.href}">
          <span><strong>${command.title}</strong><span>${command.subtitle}</span></span>
          <strong>Go</strong>
        </a>
      `
    )
    .join("");
};

const openCommand = () => {
  renderCommands();
  commandOverlay.classList.add("open");
  commandOverlay.setAttribute("aria-hidden", "false");
  commandInput.focus();
};

const closeCommand = () => {
  commandOverlay.classList.remove("open");
  commandOverlay.setAttribute("aria-hidden", "true");
};

commandButton.addEventListener("click", openCommand);
commandInput.addEventListener("input", () => renderCommands(commandInput.value));
commandList.addEventListener("click", closeCommand);
commandOverlay.addEventListener("click", (event) => {
  if (event.target === commandOverlay) closeCommand();
});

document.addEventListener("keydown", (event) => {
  const isCommandKey = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k";
  if (isCommandKey) {
    event.preventDefault();
    openCommand();
  }
  if (event.key === "Escape") {
    closeCommand();
    closeModal();
  }
});

const portrait = document.querySelector(".portrait-shell");
if (portrait) {
  portrait.addEventListener("mousemove", (event) => {
    const bounds = portrait.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    portrait.style.transform = `rotateY(${x * 7}deg) rotateX(${-y * 7}deg)`;
  });

  portrait.addEventListener("mouseleave", () => {
    portrait.style.transform = "rotateY(0deg) rotateX(0deg)";
  });
}

const radarSkills = [
  ["Backend", 82],
  ["Frontend", 86],
  ["Database", 72],
  ["Full Stack", 76],
  ["ML Basics", 68],
  ["Workflow", 78]
];

function cssColor(variableName) {
  return getComputedStyle(root).getPropertyValue(variableName).trim();
}

function drawSkillRadar() {
  if (!skillRadar) return;

  const ctx = skillRadar.getContext("2d");
  const rect = skillRadar.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  skillRadar.width = rect.width * ratio;
  skillRadar.height = Math.max(320, rect.width * 0.68) * ratio;
  skillRadar.style.height = `${skillRadar.height / ratio}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  const width = skillRadar.width / ratio;
  const height = skillRadar.height / ratio;
  const centerX = width / 2;
  const centerY = height / 2 + 8;
  const radius = Math.min(width, height) * 0.34;
  const primary = cssColor("--primary");
  const secondary = cssColor("--primary-2");
  const muted = cssColor("--muted");
  const line = cssColor("--line");
  const ink = cssColor("--ink");

  ctx.clearRect(0, 0, width, height);
  ctx.lineWidth = 1;
  ctx.font = "800 12px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let level = 1; level <= 5; level += 1) {
    const levelRadius = (radius / 5) * level;
    ctx.beginPath();
    radarSkills.forEach((_, index) => {
      const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radarSkills.length;
      const x = centerX + Math.cos(angle) * levelRadius;
      const y = centerY + Math.sin(angle) * levelRadius;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.strokeStyle = line;
    ctx.stroke();
  }

  radarSkills.forEach(([label], index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radarSkills.length;
    const axisX = centerX + Math.cos(angle) * radius;
    const axisY = centerY + Math.sin(angle) * radius;
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(axisX, axisY);
    ctx.strokeStyle = line;
    ctx.stroke();

    const labelX = centerX + Math.cos(angle) * (radius + 34);
    const labelY = centerY + Math.sin(angle) * (radius + 24);
    ctx.fillStyle = muted;
    ctx.fillText(label, labelX, labelY);
  });

  const gradient = ctx.createLinearGradient(centerX - radius, centerY - radius, centerX + radius, centerY + radius);
  gradient.addColorStop(0, primary);
  gradient.addColorStop(1, secondary);

  ctx.beginPath();
  radarSkills.forEach(([, value], index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radarSkills.length;
    const pointRadius = radius * (value / 100);
    const x = centerX + Math.cos(angle) * pointRadius;
    const y = centerY + Math.sin(angle) * pointRadius;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = `${primary}33`;
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 3;
  ctx.fill();
  ctx.stroke();

  radarSkills.forEach(([, value], index) => {
    const angle = -Math.PI / 2 + (Math.PI * 2 * index) / radarSkills.length;
    const pointRadius = radius * (value / 100);
    const x = centerX + Math.cos(angle) * pointRadius;
    const y = centerY + Math.sin(angle) * pointRadius;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = primary;
    ctx.fill();
    ctx.strokeStyle = ink;
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

drawSkillRadar();
window.addEventListener("resize", drawSkillRadar);
