# 🏎️ PROJECT V — Luxury Automotive Launch Platform

> A world-class, Awwwards-level premium supercar digital experience with scroll-driven 300-frame car disassembly, interactive configurator, cockpit view, and cinematic storytelling.

---

## 🖥️ Live Preview

After setup, open in browser: **http://localhost:3000/**

---

## ⚡ Quick Start (One Click)

### Windows Users:
> Double-click **`setup.bat`** — it does everything automatically!

Or run manually in terminal:

```bash
npm install
npm run dev
```

---

## 📋 Requirements

| Tool       | Version   | Download |
|------------|-----------|----------|
| **Node.js** | v18+ (LTS recommended) | https://nodejs.org |
| **npm**    | v9+       | Comes with Node.js |

---

## 🚀 Manual Setup (Step by Step)

### Step 1 — Install Node.js
Download from: https://nodejs.org/en/download
Choose LTS version.

### Step 2 — Open Terminal in Project Folder
Right-click the project folder → Open in Terminal

### Step 3 — Install Dependencies
```bash
npm install
```

### Step 4 — Start Dev Server
```bash
npm run dev
```

### Step 5 — Open in Browser
Visit: http://localhost:3000/

---

## 📁 Project Structure

```
3d car website backchodi/
│
├── index.html                  ← Main HTML entry
├── vite.config.js              ← Vite build config
├── package.json                ← Dependencies
├── setup.bat                   ← Windows one-click setup
│
├── public/
│   ├── frames/                 ← 300 car animation frames
│   └── assets/                 ← Gallery images
│
└── src/
    ├── main.js                 ← App entry point
    ├── core/                   ← Canvas, Scroller, Audio, State, Cache
    ├── components/             ← Navbar, Hero, Configurator, Cockpit, etc.
    ├── data/                   ← Engineering specs, config options
    └── styles/                 ← All CSS modules
```

---

## 🎮 Keyboard Shortcuts

| Key | Action |
|-----|--------|
| H / Z | Toggle Clean View (Zen Mode - hide all overlays) |
| F | Toggle Fullscreen Mode |
| C | Toggle Configurator |
| K | Toggle Cockpit View |
| G | Toggle Gallery |
| M | Mute / Unmute Sound |
| Shift + D | Debug FPS HUD |

---

## 🚀 Hosting on GitHub Pages (Automated Deployment)

This project is pre-configured with **GitHub Actions** for 100% automated build and hosting!

### Step 1: Create a New GitHub Repository
1. Go to [github.com/new](https://github.com/new).
2. Repository name: e.g. `project-v` or `3d-car-website`.
3. Choose **Public** (recommended for free GitHub Pages).
4. Do **not** initialize with a README, .gitignore, or license (already included in this project).
5. Click **Create repository**.

### Step 2: Push Your Code
In your project terminal, run:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages in 1 Click
1. On your GitHub repository page, click **Settings** (top tab).
2. On the left sidebar, click **Pages**.
3. Under **Build and deployment** → **Source**, select:
   👉 **GitHub Actions**
4. That's it! GitHub will automatically trigger the workflow, build the project, and publish your site at:
   `https://YOUR_USERNAME.github.io/YOUR_REPOSITORY/`

---

## 🛠️ Build for Production (Manual)

```bash
npm run build
```

The output will be in `/dist` — ready to deploy to GitHub Pages, Netlify, Vercel, or Cloudflare Pages.

---

Built with Vite + Vanilla JS + HTML5 Canvas
