# AGENTS.md

Guidance for AI coding agents working in this repository.

## Project Overview

School management application built with **React 19** and **Vite**. Plain JavaScript (JSX), no TypeScript. Uses **Tailwind CSS v4** for styling and **Axios** for HTTP requests to a backend API at `http://127.0.0.1:8000`. Supports role-based access: Admin (1), Teacher (2), Librarian (3), Student (4).

## Commands

- `npm run dev` — start the dev server with HMR (proxies `/api` to backend)
- `npm run build` — production build to `dist/`
- `npm run lint` — run ESLint on the project (use this to verify changes)
- `npm run preview` — preview the production build locally

Install dependencies with `npm install`. There is no test framework configured yet.

## Project Structure

```
index.html
vite.config.js          # React plugin, Tailwind plugin, /api proxy to :8000
eslint.config.js        # Flat ESLint config
src/
  main.jsx              # App bootstrap, mounts <App /> into #root
  App.jsx               # Root component (BrowserRouter, Theme/Sidebar/Toast providers)
  index.css             # Global styles + Tailwind import
  routes/
    AppRoutes.jsx        # All routes, lazy-loaded pages, role-based ProtectedRoute
  layouts/
    DashboardLayout.jsx  # Main layout with Sidebar + Navbar
    Sidebar.jsx
    Navbar.jsx
  pages/                 # One file per page (lazy-loaded)
  components/
    common/              # Reusable UI: Button, Modal, DataTable, Pagination,
                         #   SearchBar, FilterDropdown, StatCard, PageHeader,
                         #   FormField, EmptyState, Loading, StatusBadge,
                         #   Toast, ChartCard, ConfirmDialog
    auth/
      ProtectedRoute.jsx # Role-based route guard
  context/
    ThemeContext.jsx
    SidebarContext.jsx
    ToastContext.jsx
  hooks/
    useCrudState.js
    useApiCrud.js
    useDebounce.js
  api/
    axios.js             # Axios instance with Bearer token + 401 redirect
    services/            # API service modules (one per domain)
  constants/
    navigation.js        # Sidebar nav groups with role-based visibility
  data/
    mockData.js
  lib/
    axios.js
  features/              # Feature modules (stubs with .gitkeep)
    auth/ dashboard/ students/ teachers/ parents/ classes/
    grades/ attendance/
  styles/
  utils/
  assets/                # Static images (hero.png, etc.)
```

## Conventions

- Use JSX function components with hooks (`useState`, `useEffect`, etc.)
- Use ES modules; import CSS files directly where needed
- All page components are lazy-loaded via `React.lazy()` in `AppRoutes.jsx`
- Route protection via `<ProtectedRoute allowedRoles={[...]} />`
- API calls go through `src/api/axios.js` (attaches Bearer token, handles 401)
- Each API domain has a service file in `src/api/services/`
- Static assets go in `src/assets/` (bundled) or `public/` (served as-is)
- Run `npm run lint` after making changes and fix all reported errors
- Do not add comments unless necessary
- Styling: use Tailwind CSS utility classes; no separate CSS files for components
