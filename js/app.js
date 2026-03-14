/* ============================================================
   MAIN APP — Reads data from /data/*.js and builds the UI
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. POPULATE ALL SECTIONS ────────────────────────────────
  buildNavbar();
  buildHero();
  buildAbout();
  buildSkills();
  buildProjects();
  buildCV();
  buildContact();
  buildFooter();

  // ── 2. INIT BEHAVIORS ───────────────────────────────────────
  initNavScroll();
  initScrollReveal();
  initSkillBars();
  initContactForm();
  initTypewriter();
  initMobileNav();
  initActiveNav();

});

/* ============================================================
   BUILD FUNCTIONS — Each section reads from data files
   ============================================================ */

function buildNavbar() {
  const nav = document.getElementById('nav-links');
  const navMobile = document.getElementById('nav-mobile-links');
  const pages = ['Home','About','Skills','Projects','CV','Contact'];
  const links = pages.map(p => {
    const id = p.toLowerCase();
    const isContact = p === 'Contact';
    return `<a href="#${id}" ${isContact ? 'class="nav-cta"' : ''}>${p}</a>`;
  }).join('');
  nav.innerHTML = links;
  navMobile.innerHTML = pages.map(p =>
    `<a href="#${p.toLowerCase()}" onclick="closeMobileNav()">${p}</a>`
  ).join('');

  document.querySelector('.nav-logo').innerHTML =
    `<span>${profile.name.split(' ')[0]}</span>${profile.name.split(' ').slice(1).join(' ')}`;
}

function buildHero() {
  const el = document.getElementById('hero-content');
  el.innerHTML = `
    <p class="hero-greeting">Hello, world!</p>
    <h1 class="hero-name">${profile.name.split(' ')[0]} <span class="accent">${profile.name.split(' ').slice(1).join(' ')}</span></h1>
    <p class="hero-title" id="hero-typewriter"><span id="typed-text"></span><span class="cursor-blink">|</span></p>
    <p class="hero-desc">${profile.tagline}</p>
    <div class="hero-actions">
      <a href="#projects" class="btn btn-primary">View My Work →</a>
      <a href="#contact" class="btn btn-ghost">Get In Touch</a>
    </div>
    <div class="hero-stats">
      ${profile.stats.map(s => `
        <div class="stat-item">
          <div class="stat-value">${s.value}</div>
          <div class="stat-label">${s.label}</div>
        </div>`).join('')}
    </div>
  `;
}

function buildAbout() {
  const textEl = document.getElementById('about-text');
  const metaEl = document.getElementById('about-meta');

  const paragraphs = profile.about.trim().split('\n\n').map(p =>
    `<p>${p.trim()}</p>`).join('');
  textEl.innerHTML = paragraphs;

  metaEl.innerHTML = `
    <div class="meta-group">
      <h4>Contact & Location</h4>
      <div class="meta-item"><span class="icon">📍</span><span>${profile.location}</span></div>
      <div class="meta-item"><span class="icon">✉</span><a href="mailto:${profile.email}">${profile.email}</a></div>
      ${profile.phone.map(p => `<div class="meta-item"><span class="icon">📞</span><span>${p}</span></div>`).join('')}
    </div>
    <div class="meta-group">
      <h4>Education</h4>
      <div class="meta-item">
        <span class="icon">🎓</span>
        <div>
          <strong>${profile.education.university}</strong><br>
          <span>${profile.education.faculty}</span><br>
          <span>${profile.education.department}</span>
        </div>
      </div>
    </div>
    <div class="meta-group">
      <h4>Languages</h4>
      ${profile.languages.map(l => `
        <div class="lang-row">
          <span class="lang-name">${l.name}</span>
          <span class="lang-level">${l.level}</span>
        </div>`).join('')}
    </div>
  `;
}

function buildSkills() {
  const grid = document.getElementById('skills-grid');
  grid.innerHTML = skills.map(cat => `
    <div class="skill-card reveal">
      <div class="skill-card-header">
        <div class="skill-card-icon">${cat.icon}</div>
        <div class="skill-card-title">${cat.category}</div>
      </div>
      ${cat.items.map(item => `
        <div class="skill-item">
          <div class="skill-row">
            <span class="skill-name">${item.name}</span>
            <span class="skill-pct">${item.level}%</span>
          </div>
          <div class="skill-bar-bg">
            <div class="skill-bar-fill" data-width="${item.level}"></div>
          </div>
        </div>`).join('')}
    </div>`).join('');
}

function buildProjects() {
  const grid = document.getElementById('projects-grid');

  function renderProjects(list) {
    grid.innerHTML = list.map((p, i) => `
      <div class="project-card reveal" style="--card-color: ${p.color || 'var(--accent)'}">
        <div class="project-header">
          <span class="project-number">0${i + 1}</span>
          <div class="project-links">
            ${p.github && p.github !== '#' ? `<a href="${p.github}" class="project-link" target="_blank" title="GitHub">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </a>` : ''}
            ${p.demo && p.demo !== '#' ? `<a href="${p.demo}" class="project-link" target="_blank" title="Live Demo">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
                <polyline points="15,3 21,3 21,9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>` : ''}
          </div>
        </div>
        <div class="project-body">
          <h3 class="project-title">
            ${(p.demo && p.demo !== '#')
              ? `<a href="${p.demo}" target="_blank" rel="noopener"
                   style="color:inherit;text-decoration:none;transition:color 0.2s;"
                   onmouseover="this.style.color='var(--card-color, var(--accent))'"
                   onmouseout="this.style.color=''"
                 >${p.title} <span style="font-size:14px;opacity:0.6">↗</span></a>`
              : p.title}
          </h3>
          <p class="project-desc">${p.description}</p>
          <div class="project-tags">
            ${p.technologies.map(t => `<span class="tag">${t}</span>`).join('')}
          </div>
        </div>
      </div>`).join('');

    // Re-trigger reveal for newly added cards
    initScrollReveal();
  }

  // Filter buttons — collect unique tech tags
  const allTechs = [...new Set(projects.flatMap(p => p.technologies))].sort();
  const filterBar = document.getElementById('projects-filter');
  filterBar.innerHTML = `
    <button class="filter-btn active" data-filter="all" onclick="filterProjects('all', this)">All</button>
    ${allTechs.map(t => `<button class="filter-btn" data-filter="${t}" onclick="filterProjects('${t}', this)">${t}</button>`).join('')}
  `;

  window.filterProjects = (tech, btn) => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filtered = tech === 'all' ? projects : projects.filter(p => p.technologies.includes(tech));
    renderProjects(filtered);
  };

  renderProjects(projects);
}

function buildCV() {
  const wrapper = document.getElementById('cv-content');

  const allSkillTags = skills.flatMap(cat => cat.items.map(i => `<span class="tag">${i.name}</span>`)).join('');
  const projectList = projects.map(p =>
    `<li>${p.title} — ${p.description.split('.')[0]}</li>`).join('');

  wrapper.innerHTML = `
    <div class="cv-card">
      <div class="cv-top">
        <div class="cv-top-name">${profile.name}</div>
        <div class="cv-top-title">${profile.title}</div>
        <div class="cv-top-contact">
          <span>📍 ${profile.location}</span>
          <span>✉ ${profile.email}</span>
          ${profile.phone.map(p => `<span>📞 ${p}</span>`).join('')}
        </div>
      </div>
      <div class="cv-body">
        <div class="cv-section">
          <div class="cv-section-title">Professional Summary</div>
          <p style="font-size:14px; color:var(--text-muted); line-height:1.8;">
            Self-taught Full Stack Developer with 3+ years of freelance experience building scalable SaaS platforms, 
            business management systems, and cloud applications. Strong expertise in Python, Django, React, and PostgreSQL. 
            Delivered 25+ real-world projects with a focus on clean architecture and maintainable code.
          </p>
        </div>
        <div class="cv-section">
          <div class="cv-section-title">Experience</div>
          <div class="cv-exp-item">
            <div class="cv-exp-row">
              <div class="cv-exp-title">Freelance Full Stack Developer</div>
              <div class="cv-exp-date">2022 – Present</div>
            </div>
            <div class="cv-exp-sub">Self-Employed · Remote</div>
            <ul class="cv-bullets">
              <li>Designed and built 4 major SaaS platforms from scratch (Managora, Nibar Cloud, Eduvia, Trafico)</li>
              <li>Completed 25+ projects spanning enterprise management, e-commerce, and education</li>
              <li>Implemented REST APIs, Docker containerization, and cloud deployment pipelines</li>
              <li>Integrated AI tools and prompt engineering into development and productivity workflows</li>
            </ul>
          </div>
        </div>
        <div class="cv-section">
          <div class="cv-section-title">Notable Projects</div>
          <ul class="cv-bullets">${projectList}</ul>
        </div>
        <div class="cv-section">
          <div class="cv-section-title">Technical Skills</div>
          <div class="cv-skill-row">${allSkillTags}</div>
        </div>
        <div class="cv-section">
          <div class="cv-section-title">Education</div>
          <div class="cv-exp-item">
            <div class="cv-exp-row">
              <div class="cv-exp-title">${profile.education.university}</div>
            </div>
            <div class="cv-exp-sub">${profile.education.faculty} · ${profile.education.department}</div>
          </div>
        </div>
        <div class="cv-section">
          <div class="cv-section-title">Languages</div>
          <div class="cv-skill-row">
            ${profile.languages.map(l => `<span class="tag">${l.name} — ${l.level}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="cv-download-bar">
        <p class="cv-download-note">Download the full CV as a PDF to share with recruiters or clients.</p>
        <a href="${profile.cv_file}" download class="btn btn-primary">
          ↓ Download CV (PDF)
        </a>
      </div>
    </div>
  `;
}

function buildContact() {
  const infoEl = document.getElementById('contact-info');
  const formEl = document.getElementById('contact-form-wrap');

  infoEl.innerHTML = `
    <div class="contact-item">
      <div class="contact-icon">✉</div>
      <div>
        <div class="contact-label">Email</div>
        <a href="mailto:${profile.email}" class="contact-value">${profile.email}</a>
      </div>
    </div>
    ${profile.phone.map(p => `
      <div class="contact-item">
        <div class="contact-icon">📞</div>
        <div>
          <div class="contact-label">Phone</div>
          <div class="contact-value">${p}</div>
        </div>
      </div>`).join('')}
    <div class="contact-item">
      <div class="contact-icon">📍</div>
      <div>
        <div class="contact-label">Location</div>
        <div class="contact-value">${profile.location}</div>
      </div>
    </div>
    <div class="social-row">
      <a href="${profile.github}" target="_blank" class="social-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 013-.4c1.02.005 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58C20.56 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        GitHub
      </a>
      <a href="${profile.linkedin}" target="_blank" class="social-btn">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 110-4.12 2.06 2.06 0 010 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z"/>
        </svg>
        LinkedIn
      </a>
    </div>
  `;

  formEl.innerHTML = `
    <form class="contact-form" id="contact-form" novalidate>
      <div class="form-row">
        <div class="form-group">
          <label>Name</label>
          <input type="text" name="name" placeholder="Your name" required>
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="your@email.com" required>
        </div>
      </div>
      <div class="form-group">
        <label>Subject</label>
        <input type="text" name="subject" placeholder="What's this about?">
      </div>
      <div class="form-group">
        <label>Message</label>
        <textarea name="message" placeholder="Tell me about your project..." required></textarea>
      </div>
      <div class="form-status" id="form-status"></div>
      <button type="submit" class="btn btn-primary" id="form-submit">
        Send Message →
      </button>
    </form>
  `;
}

function buildFooter() {
  document.getElementById('footer-name').innerHTML =
    `<span>${profile.name}</span>`;
  document.getElementById('footer-github').href = profile.github;
  document.getElementById('footer-linkedin').href = profile.linkedin;
  document.getElementById('footer-email').href = `mailto:${profile.email}`;
}

/* ============================================================
   BEHAVIORS
   ============================================================ */

function initNavScroll() {
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

function initActiveNav() {
  const sections = ['home','about','skills','projects','cv','contact'];
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${e.target.id}`);
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => observer.observe(el));
}

function initSkillBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll('.skill-card').forEach(el => observer.observe(el));
}

function initContactForm() {
  document.addEventListener('submit', e => {
    if (e.target.id !== 'contact-form') return;
    e.preventDefault();
    const btn = document.getElementById('form-submit');
    const status = document.getElementById('form-status');
    btn.textContent = 'Sending…';
    btn.disabled = true;
    // Simulate send (replace with your backend or Formspree/EmailJS)
    setTimeout(() => {
      status.className = 'form-status success';
      status.textContent = '✓ Message sent! I\'ll get back to you soon.';
      e.target.reset();
      btn.textContent = 'Send Message →';
      btn.disabled = false;
    }, 1200);
  });
}

function initTypewriter() {
  const titles = [
    profile.title,
    'Python & Django Developer',
    'React Frontend Developer',
    'SaaS Builder',
    'Problem Solver',
  ];
  let ti = 0, ci = 0, deleting = false;
  const el = document.getElementById('typed-text');
  if (!el) return;

  function tick() {
    const current = titles[ti];
    if (deleting) {
      el.textContent = current.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % titles.length; setTimeout(tick, 400); return; }
      setTimeout(tick, 45);
    } else {
      el.textContent = current.slice(0, ++ci);
      if (ci === current.length) { deleting = true; setTimeout(tick, 2200); return; }
      setTimeout(tick, 80);
    }
  }
  setTimeout(tick, 1000);
}

function initMobileNav() {
  window.closeMobileNav = () => {
    document.getElementById('nav-mobile').classList.remove('open');
    document.getElementById('nav-hamburger').classList.remove('open');
  };
}
