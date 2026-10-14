# belken.ai site

## Adding a docs or compare page

To add a new guide to `/docs` or `/compare`:

1. Create the page folder and `index.html` only (e.g. `public/docs/what-is-my-new-guide/index.html`).
2. Add a `<meta name="belken:card" ...>` tag to the page with the card metadata (after the description meta):
   ```html
   <meta name="belken:card" content='{"meta":"Guide · AI Receptionist","icon":"<svg ...>","order":180}' />
   ```
   - `meta`: the small category label shown above the card title
   - `icon`: SVG element for the card icon (docs pages only; omit for compare pages)
   - `order`: sort order for the card list (use the next multiple of 10)
   - `title` (optional): override the card heading when it should differ from the page `<h1>`
3. Run `npm run build` (or open a PR). The build script auto-generates the card entry and sitemap URL.

**Never edit `public/docs/index.html` card list, `public/compare/index.html` card list, or `public/sitemap.xml` by hand.** Those files are rewritten on every build. Hand edits will be overwritten and PRs that touch them will conflict.

The hand-written sections (failure index, field manual, workstation install, contact card in docs; header/footer in compare) live outside the `<!-- DERIVED:...:start/end -->` markers and are never touched by the script.

---

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
