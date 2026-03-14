/* ============================================================
   ADMIN PANEL — Login + Full Site Editor
   Data is saved in localStorage and overrides data/*.js files
   ============================================================ */

(function () {
  'use strict';

  // ── State ────────────────────────────────────────────────────
  let isLoggedIn = false;
  let adminData = {
    profile: null,
    skills: null,
    projects: null,
  };

  // ── Load saved data from localStorage (overrides JS files) ──
  function loadSavedData() {
    try {
      const saved = localStorage.getItem('portfolioData');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.profile)  Object.assign(profile, parsed.profile);
        if (parsed.skills)   skills.splice(0, skills.length, ...parsed.skills);
        if (parsed.projects) projects.splice(0, projects.length, ...parsed.projects);
      }
    } catch (e) {
      console.warn('Could not load saved portfolio data:', e);
    }
  }

  function saveAllData() {
    localStorage.setItem('portfolioData', JSON.stringify({
      profile:  adminData.profile  || profile,
      skills:   adminData.skills   || skills,
      projects: adminData.projects || projects,
    }));
  }

  // ── Init on page load ─────────────────────────────────────────
  window.addEventListener('DOMContentLoaded', () => {
    loadSavedData();
    injectHTML();
    bindEvents();
    // Re-render site with (possibly overridden) data
    if (typeof buildHero === 'function') {
      buildHero(); buildAbout(); buildSkills();
      buildProjects(); buildCV(); buildContact(); buildFooter();
      initSkillBars(); initScrollReveal(); initTypewriter();
    }
  });

  // ══════════════════════════════════════════════════════════════
  //  INJECT HTML
  // ══════════════════════════════════════════════════════════════
  function injectHTML() {
    document.head.insertAdjacentHTML('beforeend',
      '<link rel="stylesheet" href="css/admin.css">');

    document.body.insertAdjacentHTML('beforeend', `

      <!-- Admin Login Button -->
      <button id="admin-login-btn" title="Admin Login">⚙</button>

      <!-- Login Modal Overlay -->
      <div class="admin-overlay" id="login-overlay">
        <div class="login-modal">
          <button class="modal-close" onclick="AdminPanel.closeLogin()">✕</button>
          <h2>Admin Login</h2>
          <p>Enter your credentials to access the site editor.</p>
          <div class="login-error" id="login-error">Incorrect email or password.</div>
          <div class="login-field">
            <label>Email</label>
            <input type="email" id="login-email" placeholder="your@email.com"
              autocomplete="email" onkeydown="if(event.key==='Enter') AdminPanel.doLogin()">
          </div>
          <div class="login-field">
            <label>Password</label>
            <input type="password" id="login-password" placeholder="••••••••"
              autocomplete="current-password" onkeydown="if(event.key==='Enter') AdminPanel.doLogin()">
          </div>
          <div class="login-actions">
            <button class="btn btn-primary" onclick="AdminPanel.doLogin()" style="flex:1">
              Login →
            </button>
            <button class="btn btn-ghost" onclick="AdminPanel.closeLogin()">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Admin Panel Drawer -->
      <div class="admin-panel" id="admin-panel">
        <div class="admin-panel-header">
          <div>
            <h2>⚙ Site Editor</h2>
          </div>
          <div class="admin-panel-actions" style="display:flex;gap:10px;align-items:center;">
            <span>● Live</span>
            <button class="btn-logout" onclick="AdminPanel.logout()">Logout</button>
            <button class="modal-close" style="position:static" onclick="AdminPanel.closePanel()">✕</button>
          </div>
        </div>

        <div class="admin-tabs">
          <button class="admin-tab active" onclick="AdminPanel.switchTab('profile',this)">👤 Profile</button>
          <button class="admin-tab" onclick="AdminPanel.switchTab('projects',this)">🗂 Projects</button>
          <button class="admin-tab" onclick="AdminPanel.switchTab('skills',this)">⚡ Skills</button>
          <button class="admin-tab" onclick="AdminPanel.switchTab('social',this)">🔗 Links</button>
        </div>

        <div class="admin-body" id="admin-body">
          <!-- Filled by JS -->
        </div>

        <div class="admin-save-bar">
          <span class="admin-save-msg" id="save-msg">✓ Saved & applied!</span>
          <div style="display:flex;gap:10px;">
            <button class="btn btn-ghost" onclick="AdminPanel.resetToDefaults()"
              style="font-size:12px;padding:8px 14px;">Reset Defaults</button>
            <button class="btn btn-primary" onclick="AdminPanel.saveAndApply()">
              💾 Save & Apply
            </button>
          </div>
        </div>
      </div>

    `);
  }

  // ══════════════════════════════════════════════════════════════
  //  EVENTS
  // ══════════════════════════════════════════════════════════════
  function bindEvents() {
    document.getElementById('admin-login-btn').addEventListener('click', () => {
      if (isLoggedIn) {
        AdminPanel.openPanel();
      } else {
        AdminPanel.openLogin();
      }
    });
    // Close overlay on outside click
    document.getElementById('login-overlay').addEventListener('click', e => {
      if (e.target === e.currentTarget) AdminPanel.closeLogin();
    });
  }

  // ══════════════════════════════════════════════════════════════
  //  LOGIN
  // ══════════════════════════════════════════════════════════════
  window.AdminPanel = {

    openLogin() {
      document.getElementById('login-overlay').classList.add('open');
      setTimeout(() => document.getElementById('login-email').focus(), 200);
    },

    closeLogin() {
      document.getElementById('login-overlay').classList.remove('open');
      document.getElementById('login-error').classList.remove('show');
    },

    doLogin() {
      const email = document.getElementById('login-email').value.trim();
      const pass  = document.getElementById('login-password').value;
      const err   = document.getElementById('login-error');

      if (email === profile.admin.email && pass === profile.admin.password) {
        isLoggedIn = true;
        err.classList.remove('show');
        this.closeLogin();
        document.getElementById('admin-login-btn').classList.add('logged-in');
        document.getElementById('admin-login-btn').title = 'Open Editor';
        document.getElementById('admin-login-btn').textContent = '✏';
        this.openPanel();
      } else {
        err.classList.add('show');
        document.getElementById('login-password').value = '';
      }
    },

    logout() {
      isLoggedIn = false;
      this.closePanel();
      const btn = document.getElementById('admin-login-btn');
      btn.classList.remove('logged-in');
      btn.title = 'Admin Login';
      btn.textContent = '⚙';
    },

    // ══ PANEL ════════════════════════════════════════════════════
    openPanel() {
      adminData.profile  = JSON.parse(JSON.stringify(profile));
      adminData.skills   = JSON.parse(JSON.stringify(skills));
      adminData.projects = JSON.parse(JSON.stringify(projects));
      this.renderTab('profile');
      document.getElementById('admin-panel').classList.add('open');
    },

    closePanel() {
      document.getElementById('admin-panel').classList.remove('open');
    },

    switchTab(name, btn) {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      btn.classList.add('active');
      this.renderTab(name);
    },

    // ══ RENDER TABS ══════════════════════════════════════════════
    renderTab(name) {
      const body = document.getElementById('admin-body');
      if (name === 'profile')  body.innerHTML = this.tplProfile();
      if (name === 'projects') body.innerHTML = this.tplProjects();
      if (name === 'skills')   body.innerHTML = this.tplSkills();
      if (name === 'social')   body.innerHTML = this.tplSocial();
      this.bindTabEvents(name);
    },

    // ─── PROFILE TAB ─────────────────────────────────────────────
    tplProfile() {
      const p = adminData.profile;
      return `
        <div class="admin-section-title">Basic Info</div>
        <div class="admin-row">
          <div class="admin-field"><label>Full Name</label>
            <input type="text" id="a-name" value="${esc(p.name)}"></div>
          <div class="admin-field"><label>Title / Role</label>
            <input type="text" id="a-title" value="${esc(p.title)}"></div>
        </div>
        <div class="admin-field"><label>Tagline (shown under title on hero)</label>
          <input type="text" id="a-tagline" value="${esc(p.tagline)}"></div>
        <div class="admin-row">
          <div class="admin-field"><label>Location</label>
            <input type="text" id="a-location" value="${esc(p.location)}"></div>
          <div class="admin-field"><label>Email</label>
            <input type="email" id="a-email" value="${esc(p.email)}"></div>
        </div>

        <div class="admin-section-title">Phone Numbers</div>
        <div class="phone-list" id="a-phones">
          ${p.phone.map((ph, i) => `
            <div class="phone-item">
              <input type="text" class="phone-input" value="${esc(ph)}" placeholder="+20...">
              <button class="btn-icon danger" onclick="AdminPanel.removePhone(${i})">✕</button>
            </div>`).join('')}
        </div>
        <button class="btn btn-ghost" onclick="AdminPanel.addPhone()"
          style="font-size:12px;padding:8px 14px;margin-top:8px;">+ Add Phone</button>

        <div class="admin-section-title">About Me</div>
        <div class="admin-field">
          <label>About Text (separate paragraphs with blank line)</label>
          <textarea id="a-about" style="min-height:160px">${esc(p.about)}</textarea>
        </div>

        <div class="admin-section-title">Hero Stats</div>
        <div class="admin-stats-grid">
          ${p.stats.map((s, i) => `
            <div class="admin-stat-item">
              <label>Value</label>
              <input type="text" class="stat-value-input" data-i="${i}" value="${esc(s.value)}"
                style="background:var(--bg-2);border:1px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-family:var(--font-mono);font-size:13px;outline:none;width:100%;margin-bottom:8px;">
              <label>Label</label>
              <input type="text" class="stat-label-input" data-i="${i}" value="${esc(s.label)}"
                style="background:var(--bg-2);border:1px solid var(--border);border-radius:6px;padding:8px 10px;color:var(--text);font-family:var(--font-mono);font-size:13px;outline:none;width:100%;">
            </div>`).join('')}
        </div>

        <div class="admin-section-title">Education</div>
        <div class="admin-field"><label>University</label>
          <input type="text" id="a-uni" value="${esc(p.education.university)}"></div>
        <div class="admin-field"><label>Faculty</label>
          <input type="text" id="a-faculty" value="${esc(p.education.faculty)}"></div>
        <div class="admin-field"><label>Department</label>
          <input type="text" id="a-dept" value="${esc(p.education.department)}"></div>

        <div class="admin-section-title">Languages</div>
        ${p.languages.map((l, i) => `
          <div class="admin-row" style="margin-bottom:10px;">
            <div class="admin-field"><label>Language ${i+1}</label>
              <input type="text" class="lang-name-input" data-i="${i}" value="${esc(l.name)}"></div>
            <div class="admin-field"><label>Level</label>
              <input type="text" class="lang-level-input" data-i="${i}" value="${esc(l.level)}"></div>
          </div>`).join('')}

        <div class="admin-section-title">CV File</div>
        <div class="admin-field"><label>CV PDF filename (place file in portfolio root)</label>
          <input type="text" id="a-cv" value="${esc(p.cv_file)}"></div>
      `;
    },

    // ─── PROJECTS TAB ────────────────────────────────────────────
    tplProjects() {
      const list = adminData.projects;
      return `
        <div class="admin-section-title">Your Projects (${list.length})</div>
        <div class="admin-project-list" id="admin-project-list">
          ${list.map((p, i) => this.tplProjectItem(p, i)).join('')}
        </div>

        <div class="add-project-box">
          <h4>+ Add New Project</h4>
          <div class="admin-field"><label>Title</label>
            <input type="text" id="np-title" placeholder="Project Name"></div>
          <div class="admin-field"><label>Short Description (shown on card)</label>
            <textarea id="np-desc" style="min-height:80px" placeholder="What does this project do?"></textarea></div>
          <div class="admin-field"><label>Technologies (comma-separated)</label>
            <input type="text" id="np-tech" placeholder="React, Django, PostgreSQL"></div>
          <div class="admin-field"><label>GitHub Link</label>
            <input type="url" id="np-github" placeholder="https://github.com/..."></div>
          <div class="admin-field"><label>Live Demo / Website Link</label>
            <input type="url" id="np-demo" placeholder="https://yourproject.com"></div>
          <div class="admin-row">
            <div class="admin-field"><label>Card Color</label>
              <div class="color-row">
                <input type="color" id="np-color-picker" value="#00d4ff"
                  oninput="document.getElementById('np-color-text').value=this.value">
                <input type="text" id="np-color-text" value="#00d4ff"
                  oninput="document.getElementById('np-color-picker').value=this.value">
              </div>
            </div>
            <div class="admin-field" style="display:flex;align-items:flex-end;">
              <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
                <input type="checkbox" id="np-featured"> Featured project
              </label>
            </div>
          </div>
          <button class="btn btn-primary" onclick="AdminPanel.addProject()" style="width:100%;margin-top:8px;">
            + Add Project
          </button>
        </div>
      `;
    },

    tplProjectItem(p, i) {
      return `
        <div class="admin-project-item" id="proj-item-${i}">
          <div class="admin-project-item-header" onclick="AdminPanel.toggleProjectEdit(${i})">
            <h4 style="color:${p.color||'var(--accent)'}">
              ${esc(p.title)}
              ${p.demo && p.demo !== '#' ? `<a href="${esc(p.demo)}" target="_blank"
                onclick="event.stopPropagation()"
                style="font-size:11px;color:var(--accent);margin-left:8px;font-family:var(--font-mono);">
                ↗ Visit
              </a>` : ''}
            </h4>
            <div class="admin-project-actions">
              <button class="btn-icon" onclick="event.stopPropagation();AdminPanel.moveProject(${i},-1)" title="Move Up">↑</button>
              <button class="btn-icon" onclick="event.stopPropagation();AdminPanel.moveProject(${i},1)" title="Move Down">↓</button>
              <button class="btn-icon danger" onclick="event.stopPropagation();AdminPanel.deleteProject(${i})" title="Delete">🗑</button>
            </div>
          </div>
          <div class="admin-project-edit" id="proj-edit-${i}">
            <div class="admin-field"><label>Title</label>
              <input type="text" id="pe-title-${i}" value="${esc(p.title)}"></div>
            <div class="admin-field"><label>Short Description</label>
              <textarea id="pe-desc-${i}" style="min-height:80px">${esc(p.description)}</textarea></div>
            <div class="admin-field"><label>Technologies (comma-separated)</label>
              <input type="text" id="pe-tech-${i}" value="${esc((p.technologies||[]).join(', '))}"></div>
            <div class="admin-field"><label>GitHub Link</label>
              <input type="url" id="pe-github-${i}" value="${esc(p.github||'')}"></div>
            <div class="admin-field"><label>Live Demo / Website Link</label>
              <input type="url" id="pe-demo-${i}" value="${esc(p.demo||'')}"></div>
            <div class="admin-row">
              <div class="admin-field"><label>Card Color</label>
                <div class="color-row">
                  <input type="color" id="pe-color-picker-${i}" value="${p.color||'#00d4ff'}"
                    oninput="document.getElementById('pe-color-text-${i}').value=this.value">
                  <input type="text" id="pe-color-text-${i}" value="${p.color||'#00d4ff'}"
                    oninput="document.getElementById('pe-color-picker-${i}').value=this.value">
                </div>
              </div>
              <div class="admin-field" style="display:flex;align-items:flex-end;">
                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:13px;">
                  <input type="checkbox" id="pe-featured-${i}" ${p.featured?'checked':''}> Featured
                </label>
              </div>
            </div>
          </div>
        </div>`;
    },

    // ─── SKILLS TAB ──────────────────────────────────────────────
    tplSkills() {
      return `
        <div class="admin-section-title">Skill Categories</div>
        ${adminData.skills.map((cat, ci) => `
          <div class="admin-skill-cat">
            <div class="admin-skill-cat-header">
              <span style="font-size:20px">${cat.icon}</span>
              <input type="text" class="cat-name-input" data-ci="${ci}" value="${esc(cat.category)}"
                style="background:var(--bg-card);border:1px solid var(--border);border-radius:6px;
                       padding:8px 12px;color:var(--text);font-family:var(--font-mono);font-size:13px;
                       outline:none;flex:1;" placeholder="Category name">
              <input type="text" class="cat-icon-input" data-ci="${ci}" value="${cat.icon}"
                style="background:var(--bg-card);border:1px solid var(--border);border-radius:6px;
                       padding:8px 12px;color:var(--text);font-family:var(--font-mono);font-size:13px;
                       outline:none;width:60px;text-align:center;" placeholder="🔧">
            </div>
            <div class="admin-skill-items" id="skill-items-${ci}">
              ${cat.items.map((item, si) => `
                <div class="admin-skill-row">
                  <input type="text" class="skill-name-inp" data-ci="${ci}" data-si="${si}"
                    value="${esc(item.name)}" placeholder="Skill name">
                  <input type="number" class="skill-level-inp" data-ci="${ci}" data-si="${si}"
                    value="${item.level}" min="0" max="100" placeholder="0-100">
                  <button class="btn-icon danger" onclick="AdminPanel.removeSkill(${ci},${si})">✕</button>
                </div>`).join('')}
            </div>
            <button class="btn btn-ghost" onclick="AdminPanel.addSkill(${ci})"
              style="font-size:11px;padding:6px 12px;margin-top:8px;">+ Add Skill</button>
          </div>`).join('')}
      `;
    },

    // ─── SOCIAL / LINKS TAB ──────────────────────────────────────
    tplSocial() {
      const p = adminData.profile;
      return `
        <div class="admin-section-title">Social Links</div>
        <div class="admin-field"><label>GitHub URL</label>
          <input type="url" id="a-github" value="${esc(p.github)}"></div>
        <div class="admin-field"><label>LinkedIn URL</label>
          <input type="url" id="a-linkedin" value="${esc(p.linkedin)}"></div>

        <div class="admin-section-title">Admin Password</div>
        <p style="font-size:13px;color:var(--text-muted);margin-bottom:16px;">
          Change your login password here. After saving, use the new password next time.
        </p>
        <div class="admin-row">
          <div class="admin-field"><label>New Password</label>
            <input type="password" id="a-newpass" placeholder="Enter new password" autocomplete="new-password"></div>
          <div class="admin-field"><label>Confirm Password</label>
            <input type="password" id="a-confirmpass" placeholder="Confirm new password" autocomplete="new-password"></div>
        </div>
        <div id="pass-msg" style="font-size:13px;margin-top:4px;"></div>
      `;
    },

    // ══ TAB EVENTS ═══════════════════════════════════════════════
    bindTabEvents(name) {
      if (name === 'projects') {
        // No extra binding needed — onclick inline handles it
      }
    },

    // ══ COLLECT DATA FROM DOM ════════════════════════════════════
    collectProfileData() {
      const p = adminData.profile;
      p.name     = val('a-name')    || p.name;
      p.title    = val('a-title')   || p.title;
      p.tagline  = val('a-tagline') || p.tagline;
      p.location = val('a-location')|| p.location;
      p.email    = val('a-email')   || p.email;
      p.about    = val('a-about')   || p.about;
      p.cv_file  = val('a-cv')      || p.cv_file;
      p.education.university = val('a-uni')    || p.education.university;
      p.education.faculty    = val('a-faculty')|| p.education.faculty;
      p.education.department = val('a-dept')   || p.education.department;

      // phones
      const phoneInputs = document.querySelectorAll('.phone-input');
      if (phoneInputs.length) p.phone = [...phoneInputs].map(i => i.value.trim()).filter(Boolean);

      // stats
      document.querySelectorAll('.stat-value-input').forEach(inp => {
        const i = parseInt(inp.dataset.i);
        if (p.stats[i]) p.stats[i].value = inp.value;
      });
      document.querySelectorAll('.stat-label-input').forEach(inp => {
        const i = parseInt(inp.dataset.i);
        if (p.stats[i]) p.stats[i].label = inp.value;
      });

      // languages
      document.querySelectorAll('.lang-name-input').forEach(inp => {
        const i = parseInt(inp.dataset.i);
        if (p.languages[i]) p.languages[i].name = inp.value;
      });
      document.querySelectorAll('.lang-level-input').forEach(inp => {
        const i = parseInt(inp.dataset.i);
        if (p.languages[i]) p.languages[i].level = inp.value;
      });
    },

    collectProjectsData() {
      adminData.projects.forEach((p, i) => {
        const t  = document.getElementById(`pe-title-${i}`);
        const d  = document.getElementById(`pe-desc-${i}`);
        const tc = document.getElementById(`pe-tech-${i}`);
        const gh = document.getElementById(`pe-github-${i}`);
        const dm = document.getElementById(`pe-demo-${i}`);
        const cl = document.getElementById(`pe-color-text-${i}`);
        const ft = document.getElementById(`pe-featured-${i}`);
        if (t)  p.title        = t.value;
        if (d)  p.description  = d.value;
        if (tc) p.technologies = tc.value.split(',').map(s => s.trim()).filter(Boolean);
        if (gh) p.github       = gh.value;
        if (dm) p.demo         = dm.value;
        if (cl) p.color        = cl.value;
        if (ft) p.featured     = ft.checked;
      });
    },

    collectSkillsData() {
      document.querySelectorAll('.cat-name-input').forEach(inp => {
        const ci = parseInt(inp.dataset.ci);
        if (adminData.skills[ci]) adminData.skills[ci].category = inp.value;
      });
      document.querySelectorAll('.cat-icon-input').forEach(inp => {
        const ci = parseInt(inp.dataset.ci);
        if (adminData.skills[ci]) adminData.skills[ci].icon = inp.value;
      });
      document.querySelectorAll('.skill-name-inp').forEach(inp => {
        const ci = parseInt(inp.dataset.ci), si = parseInt(inp.dataset.si);
        if (adminData.skills[ci] && adminData.skills[ci].items[si])
          adminData.skills[ci].items[si].name = inp.value;
      });
      document.querySelectorAll('.skill-level-inp').forEach(inp => {
        const ci = parseInt(inp.dataset.ci), si = parseInt(inp.dataset.si);
        if (adminData.skills[ci] && adminData.skills[ci].items[si])
          adminData.skills[ci].items[si].level = parseInt(inp.value) || 0;
      });
    },

    collectSocialData() {
      const gh = document.getElementById('a-github');
      const li = document.getElementById('a-linkedin');
      if (gh) adminData.profile.github   = gh.value;
      if (li) adminData.profile.linkedin = li.value;

      // Password change
      const np = document.getElementById('a-newpass');
      const cp = document.getElementById('a-confirmpass');
      const pm = document.getElementById('pass-msg');
      if (np && np.value) {
        if (np.value !== cp.value) {
          pm.style.color = '#ff5050';
          pm.textContent = '✕ Passwords do not match.';
          return false;
        }
        if (np.value.length < 6) {
          pm.style.color = '#ff5050';
          pm.textContent = '✕ Password must be at least 6 characters.';
          return false;
        }
        adminData.profile.admin.password = np.value;
        if (pm) { pm.style.color = 'var(--green)'; pm.textContent = '✓ Password updated.'; }
      }
      return true;
    },

    // ══ SAVE & APPLY ═════════════════════════════════════════════
    saveAndApply() {
      // Collect all open tab data
      this.collectProfileData();
      this.collectProjectsData();
      this.collectSkillsData();
      const ok = this.collectSocialData();
      if (!ok) return;

      // Apply to live data objects
      Object.assign(profile,  adminData.profile);
      skills.splice(0, skills.length, ...adminData.skills);
      projects.splice(0, projects.length, ...adminData.projects);

      // Persist
      saveAllData();

      // Re-render site
      buildHero(); buildAbout(); buildSkills();
      buildProjects(); buildCV(); buildContact(); buildFooter();
      initSkillBars(); initScrollReveal(); initTypewriter();

      // Flash save message
      const msg = document.getElementById('save-msg');
      msg.classList.add('show');
      setTimeout(() => msg.classList.remove('show'), 3000);
    },

    resetToDefaults() {
      if (!confirm('Reset all data to original defaults? This cannot be undone.')) return;
      localStorage.removeItem('portfolioData');
      location.reload();
    },

    // ══ PROJECT ACTIONS ══════════════════════════════════════════
    toggleProjectEdit(i) {
      const el = document.getElementById(`proj-edit-${i}`);
      if (el) el.classList.toggle('open');
    },

    addProject() {
      const title = val('np-title');
      if (!title) { alert('Please enter a project title.'); return; }
      const newProj = {
        title,
        description: val('np-desc') || '',
        technologies: (val('np-tech') || '').split(',').map(s => s.trim()).filter(Boolean),
        github:   val('np-github') || '#',
        demo:     val('np-demo')   || '#',
        color:    val('np-color-text') || '#00d4ff',
        featured: document.getElementById('np-featured').checked,
      };
      this.collectProjectsData();
      adminData.projects.push(newProj);
      this.saveAndApply();
      this.renderTab('projects');
      // Scroll to new project
      setTimeout(() => {
        const list = document.getElementById('admin-project-list');
        if (list) list.lastElementChild.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    },

    deleteProject(i) {
      if (!confirm(`Delete "${adminData.projects[i].title}"?`)) return;
      this.collectProjectsData();
      adminData.projects.splice(i, 1);
      this.saveAndApply();
      this.renderTab('projects');
    },

    moveProject(i, dir) {
      const j = i + dir;
      if (j < 0 || j >= adminData.projects.length) return;
      this.collectProjectsData();
      const tmp = adminData.projects[i];
      adminData.projects[i] = adminData.projects[j];
      adminData.projects[j] = tmp;
      this.saveAndApply();
      this.renderTab('projects');
    },

    addPhone() {
      adminData.profile.phone.push('');
      this.renderTab('profile');
    },

    removePhone(i) {
      this.collectProfileData();
      adminData.profile.phone.splice(i, 1);
      this.renderTab('profile');
    },

    addSkill(ci) {
      this.collectSkillsData();
      adminData.skills[ci].items.push({ name: '', level: 80 });
      this.renderTab('skills');
    },

    removeSkill(ci, si) {
      this.collectSkillsData();
      adminData.skills[ci].items.splice(si, 1);
      this.renderTab('skills');
    },

  }; // end AdminPanel

  // ── Helpers ──────────────────────────────────────────────────
  function val(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }
  function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

})();
