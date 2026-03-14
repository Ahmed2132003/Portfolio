# Ahmed Ibrahim — Personal Portfolio

A modern, dark-themed developer portfolio. **Fully data-driven** — all content is stored in `/data` files so you never need to touch the main code.

---

## 📁 Folder Structure

```
portfolio/
├── index.html          ← Main page (don't edit unless adding new sections)
├── css/
│   └── style.css       ← All styles & design system
├── js/
│   └── app.js          ← App logic (reads data, builds UI)
├── data/
│   ├── profile.js      ← ✏️  YOUR INFO: name, email, phone, about, etc.
│   ├── skills.js       ← ✏️  YOUR SKILLS: categories + proficiency levels
│   └── projects.js     ← ✏️  YOUR PROJECTS: add new ones here!
└── Ahmed_Hassan_CV.pdf ← Place your CV PDF file here
```

---

## ✏️  How to Update Content

### Add a New Project (30 seconds)

Open `data/projects.js` and add a new object to the array:

```js
{
  title: "My New Project",
  description: "Short description shown on the card.",
  long_description: "Longer description (optional).",
  technologies: ["React", "Django", "PostgreSQL"],
  github: "https://github.com/you/repo",
  demo: "https://your-demo.com",
  featured: false,
  color: "#ff6b35",   // Card accent color (any hex color)
},
```

Save the file. The project appears on the website automatically. ✅

---

### Update Your Profile

Edit `data/profile.js`:
- Change `name`, `email`, `phone`, `location`, `tagline`
- Update `github` and `linkedin` URLs
- Update the `about` text
- Add/remove `stats`

---

### Update Skills

Edit `data/skills.js`:
- Add a new category object with `category`, `icon`, and `items`
- Each item has `name` and `level` (0–100)

---

## 🚀 Running Locally

No build tools needed! Just open `index.html` in your browser.

**Option 1 — Direct open:**  
Double-click `index.html`

**Option 2 — Local server (recommended, avoids CORS):**
```bash
# Python
python -m http.server 3000

# Node
npx serve .

# VS Code
Install "Live Server" extension → right-click index.html → "Open with Live Server"
```

---

## 🌐 Deploying Online

| Platform | Steps |
|----------|-------|
| **Netlify** | Drag the `portfolio/` folder to netlify.com/drop |
| **GitHub Pages** | Push to a repo → Settings → Pages → Deploy from main |
| **Vercel** | `vercel` in terminal inside the folder |

No backend required — it's pure HTML/CSS/JS.

---

## 🎨 Customizing Colors

Open `css/style.css` and edit the `:root` variables at the top:

```css
:root {
  --accent:  #00d4ff;   /* Main accent color */
  --bg:      #080c10;   /* Page background */
  --bg-card: #0f1923;   /* Card background */
}
```

---

## 📧 Making the Contact Form Work

The form currently simulates a send. To make it real:

**Option A — Formspree (easiest, free):**
1. Go to formspree.io and create a form
2. In `js/app.js`, find `initContactForm()` and replace the `setTimeout` block with:
```js
fetch('https://formspree.io/f/YOUR_ID', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(Object.fromEntries(new FormData(e.target)))
}).then(() => { /* show success */ });
```

**Option B — EmailJS (free, no backend):**
Follow the EmailJS docs and call `emailjs.sendForm()` in `initContactForm()`.

---

## 📄 CV Download

Place your PDF file in the root folder and update `cv_file` in `data/profile.js`:
```js
cv_file: "Ahmed_Hassan_CV.pdf",
```
