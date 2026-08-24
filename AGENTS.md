# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

School management application built with **React 19** and **Vite**. Plain JavaScript (JSX), no TypeScript. Currently at the initial Vite scaffold stage.

## Commands

- `npm run dev` — start the dev server with HMR
- `npm run build` — production build to `dist/`
- `npm run lint` — run ESLint on the project (use this to verify changes)
- `npm run preview` — preview the production build locally

Install dependencies with `npm install`. There is no test framework configured yet.

## Project Structure

```
index.html          # Vite entry HTML
vite.config.js      # Vite config (@vitejs/plugin-react)
eslint.config.js    # Flat ESLint config
src/
  main.jsx          # App bootstrap, mounts <App /> into #root
  App.jsx           # Root component
  App.css           # Component styles
  index.css         # Global styles
  assets/           # Static images (imported in JSX)
public/             # Static files served at root (copied as-is)
```

## Conventions

- Use JSX function components with hooks (`useState`, etc.)
- Use ES modules; import CSS files directly where needed
- Static assets go in `src/assets/` (bundled) or `public/` (served as-is)
- Run `npm run lint` after making changes and fix all reported errors
- Do not add comments unless necessary
