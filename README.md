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
| C | Toggle Configurator |
| K | Toggle Cockpit View |
| G | Toggle Gallery |
| M | Mute / Unmute Sound |
| Shift + D | Debug FPS HUD |

---

## 🎨 Features

- 300-Frame Scroll Animation — Car disassembles as you scroll
- 11 Cinematic Phases — Exterior → Aero → Wheels → Chassis → Engine → Interior
- Laser Reveal Hero animation
- Engine Start System with Web Audio API
- Vehicle Configurator — Paint, wheels, brakes, interior, ambient lighting
- Cockpit Experience — Immersive driver cell view
- Photo Gallery — Full-screen engineering gallery
- Inspection Mode — Exploded view with component hotspots
- 4 Visual Themes — Carbon Night, Arctic White, Inferno Red, Midnight Blue
- 60fps Performance — Off-thread frame decoding, LRU cache
- Custom Cursor + Sound Design

---

## 🛠️ Build for Production

```bash
npm run build
```

Output goes to /dist folder — deploy to Netlify, Vercel, or GitHub Pages.

---

## ⚠️ Important Notes

- The public/frames/ folder must contain all 300 JPG files
  (ezgif-frame-001.jpg through ezgif-frame-300.jpg)
- Do NOT delete node_modules/ — run npm install to restore
- If port 3000 is busy, Vite auto-uses 3001, 3002, etc.

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| vite | Fast dev server and bundler |
| three | 3D WebGL rendering |
| gsap | Animation engine |
| lenis | Smooth scrolling |
| lil-gui | Debug GUI controls |

---

## 🤝 Sharing This Project

### Option A — ZIP and Share
1. Zip the folder (EXCLUDE node_modules to keep size small)
2. Recipient double-clicks setup.bat or runs: npm install && npm run dev

### Option B — GitHub
```bash
git init
git add .
git commit -m "Initial commit - Project V"
git remote add origin YOUR_GITHUB_URL
git push -u origin main
```

### Option C — USB Drive
Copy everything EXCEPT the node_modules folder.
Recipient runs setup.bat to reinstall dependencies.

---

Built with Vite + Vanilla JS + HTML5 Canvas
