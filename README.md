# Robert Mezian — Portfolio (Dark-by-default)

Vite + React + Tailwind portfolio that pulls public repos from GitHub.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Customize
- `src/App.jsx` top constants control name, email, location, and GitHub handle (`ramezian1`).
- Email shows **under your name**. Contact button remains in the header.
- Dark mode defaults to **dark** and persists to localStorage. A boot script prevents light→dark flash.
- Put your resume at `public/resume.pdf` to enable the button.
