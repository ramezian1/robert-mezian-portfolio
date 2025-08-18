# Robert Mezian — Portfolio

A fast, minimalist developer portfolio built with **Vite + React + Tailwind CSS**.  
It auto-surfaces my public GitHub repositories and ships with dark mode by default.

> Live Demo: (add your deployed link here — GitHub Pages, Netlify, Vercel, etc.)

## ✨ Features
- **Repo feed:** Pulls public repos from my GitHub account to showcase work.
- **Dark-first UI:** Loads in dark mode and remembers preference (stored in `localStorage`).
- **No FOUC:** Boot script prevents light→dark flash on initial paint.
- **One-click resume:** Place a PDF at `public/resume.pdf` to enable the Resume button.
- **Blazing dev experience:** Vite HMR + Tailwind JIT.

## 🧱 Tech Stack
- **Frontend:** React, Tailwind CSS
- **Build tool:** Vite
- **Lint/HTML hint:** `.hintrc`
- **Config:** `tailwind.config.js`, `postcss.config.js`, `vite.config.js`

## 🚀 Quick Start

```bash
# 1) Install
npm install

# 2) Run dev server
npm run dev

# 3) Build for production
npm run build

# 4) Preview production build
npm run preview